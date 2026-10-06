export type Stop = {
  name: string;
  city: string;
  coords: [number, number];
  type: 'origin' | 'waypoint' | 'destination';
};

export type BusReport = {
  id: string;
  reportedBy: string;
  reportedAt: string; // ISO string
  coords: [number, number];
  stopName: string;
  crowdLevel: number; // 0-100
  comment?: string;
};

export type Route = {
  id: string;
  name: string;
  color: string;
  origin: string;
  destination: string;
  universities: string[];
  stops: Stop[];
  departures: { time: string; direction: 'ida' | 'volta' }[];
  activeBus: BusReport | null;
  totalReports: number;
};

export const ROUTES: Route[] = [
  {
    id: 'paripueira',
    name: 'Linha Paripueira',
    color: '#3fb950',
    origin: 'Paripueira',
    destination: 'UFAL / CESMAC',
    universities: ['UFAL', 'CESMAC'],
    stops: [
      { name: 'Terminal Paripueira', city: 'Paripueira', coords: [-35.5647, -9.4624], type: 'origin' },
      { name: 'Ponto Mirante', city: 'Paripueira', coords: [-35.582, -9.489], type: 'waypoint' },
      { name: 'Rodovia AL-101 Norte', city: 'Barra de Santo Antônio', coords: [-35.62, -9.51], type: 'waypoint' },
      { name: 'Av. Fernandes Lima', city: 'Maceió', coords: [-35.705, -9.56], type: 'waypoint' },
      { name: 'CESMAC', city: 'Maceió', coords: [-35.735, -9.58], type: 'waypoint' },
      { name: 'UFAL — Campus A.C. Simões', city: 'Maceió', coords: [-35.7694, -9.5565], type: 'destination' },
    ],
    departures: [
      { time: '05:30', direction: 'ida' },
      { time: '06:00', direction: 'ida' },
      { time: '06:30', direction: 'ida' },
      { time: '07:00', direction: 'ida' },
      { time: '07:30', direction: 'ida' },
      { time: '11:30', direction: 'volta' },
      { time: '17:30', direction: 'volta' },
      { time: '18:00', direction: 'volta' },
      { time: '18:30', direction: 'volta' },
      { time: '22:00', direction: 'volta' },
      { time: '22:30', direction: 'volta' },
    ],
    activeBus: {
      id: 'B-PAR-01',
      reportedBy: 'Lucas M.',
      reportedAt: new Date(Date.now() - 4 * 60000).toISOString(),
      coords: [-35.64, -9.505],
      stopName: 'AL-101 Norte',
      crowdLevel: 72,
      comment: 'Saiu de Paripueira com 5 min de atraso',
    },
    totalReports: 342,
  },
  {
    id: 'barra-de-santo-antonio',
    name: 'Linha Barra de Sto. Antônio',
    color: '#58a6ff',
    origin: 'Barra de Santo Antônio',
    destination: 'UFAL / UNIT',
    universities: ['UFAL', 'UNIT'],
    stops: [
      { name: 'Terminal Barra de Sto. Antônio', city: 'Barra de Santo Antônio', coords: [-35.4941, -9.408], type: 'origin' },
      { name: 'Ponto do Mercado', city: 'Barra de Santo Antônio', coords: [-35.51, -9.425], type: 'waypoint' },
      { name: 'São Luís do Quitunde', city: 'São Luís do Quitunde', coords: [-35.556, -9.332], type: 'waypoint' },
      { name: 'Entrada de Maceió (BR-104)', city: 'Maceió', coords: [-35.68, -9.53], type: 'waypoint' },
      { name: 'UNIT — Maceió', city: 'Maceió', coords: [-35.72, -9.57], type: 'waypoint' },
      { name: 'UFAL — Campus A.C. Simões', city: 'Maceió', coords: [-35.7694, -9.5565], type: 'destination' },
    ],
    departures: [
      { time: '05:00', direction: 'ida' },
      { time: '05:45', direction: 'ida' },
      { time: '06:20', direction: 'ida' },
      { time: '07:00', direction: 'ida' },
      { time: '11:30', direction: 'volta' },
      { time: '17:00', direction: 'volta' },
      { time: '17:30', direction: 'volta' },
      { time: '18:30', direction: 'volta' },
      { time: '22:30', direction: 'volta' },
    ],
    activeBus: {
      id: 'B-BSA-02',
      reportedBy: 'Ana P.',
      reportedAt: new Date(Date.now() - 2 * 60000).toISOString(),
      coords: [-35.61, -9.49],
      stopName: 'BR-104 · Cruzamento',
      crowdLevel: 55,
      comment: 'Trânsito fluido na AL-101 Norte',
    },
    totalReports: 218,
  },
  {
    id: 'marechal-deodoro',
    name: 'Linha Marechal Deodoro',
    color: '#e3b341',
    origin: 'Marechal Deodoro',
    destination: 'UFAL / UNEAL',
    universities: ['UFAL', 'UNEAL'],
    stops: [
      { name: 'Praça Marechal Deodoro', city: 'Marechal Deodoro', coords: [-35.8957, -9.7044], type: 'origin' },
      { name: 'Rodoviária de Marechal', city: 'Marechal Deodoro', coords: [-35.88, -9.695], type: 'waypoint' },
      { name: 'Santa Lúcia', city: 'Santa Lúcia', coords: [-35.85, -9.68], type: 'waypoint' },
      { name: 'Av. Gustavo Paiva', city: 'Maceió', coords: [-35.78, -9.65], type: 'waypoint' },
      { name: 'UNEAL — Maceió', city: 'Maceió', coords: [-35.75, -9.62], type: 'waypoint' },
      { name: 'UFAL — Campus A.C. Simões', city: 'Maceió', coords: [-35.7694, -9.5565], type: 'destination' },
    ],
    departures: [
      { time: '05:15', direction: 'ida' },
      { time: '06:00', direction: 'ida' },
      { time: '06:45', direction: 'ida' },
      { time: '07:15', direction: 'ida' },
      { time: '11:00', direction: 'volta' },
      { time: '12:00', direction: 'volta' },
      { time: '17:15', direction: 'volta' },
      { time: '18:00', direction: 'volta' },
      { time: '22:15', direction: 'volta' },
    ],
    activeBus: {
      id: 'B-MD-04',
      reportedBy: 'Rafael S.',
      reportedAt: new Date(Date.now() - 6 * 60000).toISOString(),
      coords: [-35.86, -9.685],
      stopName: 'Polo Cloroquímico',
      crowdLevel: 30,
      comment: 'Embarque normal nas paradas',
    },
    totalReports: 189,
  },
  {
    id: 'rio-largo',
    name: 'Linha Rio Largo',
    color: '#d2a8ff',
    origin: 'Rio Largo',
    destination: 'UFAL / CESMAC',
    universities: ['UFAL', 'CESMAC', 'UNEAL'],
    stops: [
      { name: 'Terminal Rio Largo', city: 'Rio Largo', coords: [-35.8495, -9.4789], type: 'origin' },
      { name: 'Mata do Rolo', city: 'Rio Largo', coords: [-35.83, -9.495], type: 'waypoint' },
      { name: 'Aeroporto Zumbi dos Palmares', city: 'Rio Largo', coords: [-35.7915, -9.5108], type: 'waypoint' },
      { name: 'Av. Menino Marcelo (Via Expressa)', city: 'Maceió', coords: [-35.74, -9.56], type: 'waypoint' },
      { name: 'CESMAC', city: 'Maceió', coords: [-35.735, -9.58], type: 'waypoint' },
      { name: 'UFAL — Campus A.C. Simões', city: 'Maceió', coords: [-35.7694, -9.5565], type: 'destination' },
    ],
    departures: [
      { time: '05:20', direction: 'ida' },
      { time: '06:10', direction: 'ida' },
      { time: '06:50', direction: 'ida' },
      { time: '07:20', direction: 'ida' },
      { time: '11:45', direction: 'volta' },
      { time: '17:20', direction: 'volta' },
      { time: '18:10', direction: 'volta' },
      { time: '22:20', direction: 'volta' },
    ],
    activeBus: {
      id: 'B-RL-03',
      reportedBy: 'Camila T.',
      reportedAt: new Date(Date.now() - 1 * 60000).toISOString(),
      coords: [-35.7915, -9.5108],
      stopName: 'BR-104 · Aeroporto',
      crowdLevel: 80,
      comment: 'Parada cheia na entrada do aeroporto',
    },
    totalReports: 295,
  },
];

export function crowdColor(level: number): string {
  if (level < 40) return '#3fb950'; // verde - livre / vazio
  if (level < 75) return '#e3b341'; // amarelo - moderado / cheio
  return '#f85149'; // vermelho - lotado
}

export function crowdLabel(level: number): string {
  if (level < 40) return 'Livre';
  if (level < 75) return 'Moderado';
  return 'Lotado';
}

export function minutesAgo(isoDate: string): string {
  const diff = Math.floor((Date.now() - new Date(isoDate).getTime()) / 60000);
  if (diff < 1) return 'Agora';
  if (diff === 1) return 'há 1 min';
  return `há ${diff} min`;
}
