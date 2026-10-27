
require('tsx/cjs');

const express = require('express');
const cors = require('cors');
const { ROUTES } = require('../src/data/routes.ts');

const app = express();
const PORT = 3000;

// Permite requisições do aplicativo e interpreta JSON.
app.use(cors());
app.use(express.json());

// Armazena os relatos enquanto o servidor estiver ligado.
const reports = [];

// Confirma que a API está funcionando.
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'API de transporte funcionando!' });
});

// GET /routes — lista as linhas de ônibus.
app.get('/routes', (req, res) => {
  res.json(ROUTES);
});

// GET /buses/live — consulta os ônibus de exemplo disponíveis.
app.get('/buses/live', (req, res) => {
  const buses = ROUTES
    .filter(route => route.activeBus)
    .map(route => route.activeBus);

  res.json(buses);
});

// POST /reports — registra um relato de passageiro.
app.post('/reports', (req, res) => {
  const { routeId, stopName, crowdLevel, comment, coords } = req.body;

  if (
    !routeId ||
    !stopName ||
    !Number.isFinite(crowdLevel) ||
    crowdLevel < 0 ||
    crowdLevel > 100
  ) {
    return res.status(400).json({
      success: false,
      message: 'Informe routeId, stopName e crowdLevel entre 0 e 100.',
    });
  }

  const route = ROUTES.find(item => item.id === routeId);

  if (!route) {
    return res.status(404).json({
      success: false,
      message: 'Linha de ônibus não encontrada.',
    });
  }

  const report = {
    id: `rep-${Date.now()}`,
    routeId,
    reportedBy: 'Passageiro',
    reportedAt: new Date().toISOString(),
    coords: Array.isArray(coords)
      ? coords
      : route.activeBus?.coords ?? route.stops[0].coords,
    stopName,
    crowdLevel,
    comment,
  };

  reports.push(report);

  route.activeBus = {
    id: route.activeBus?.id ?? `B-${route.id.toUpperCase()}`,
    reportedBy: report.reportedBy,
    reportedAt: report.reportedAt,
    coords: report.coords,
    stopName: report.stopName,
    crowdLevel: report.crowdLevel,
    comment: report.comment,
  };

  route.totalReports += 1;

  res.status(201).json({
    success: true,
    reportId: report.id,
  });
});

// Tratamento básico de erros de JSON.
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({
      success: false,
      message: 'O corpo da requisição contém JSON inválido.',
    });
  }

  next(err);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`API disponível em http://localhost:${PORT}`);
  console.log('Endpoints: GET /health, GET /routes, GET /buses/live, POST /reports');
});
