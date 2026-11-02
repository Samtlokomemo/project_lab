# 🚌 Guia de Integração — Backend, Banco de Dados & Mapa Interativo

Este documento serve como guia para a equipe integrar o **Backend (API)**, o **Banco de Dados (Auth / Contas / Persistência)** e o **Mapa Interativo (Geolocalização / MapLibre / Google Maps)** no aplicativo React Native / Expo.

A estrutura do Front-End já está completamente componentizada, tipada e pronta para receber as chamadas reais.

---

## 📌 Visão Geral dos Pontos de Integração

| Módulo | Arquivo Principal | O que precisa ser feito? |
| :--- | :--- | :--- |
| **Backend — API de Ônibus & Relatos** | [`src/services/bus-service.ts`](file:///C:/Users/Samuel/Documents/project_lab/src/services/bus-service.ts) | Conectar endpoints de listagem de rotas, envio de relatos e status em tempo real. |
| **Banco / Auth — Contas de Estudantes** | [`src/database/auth-service.ts`](file:///C:/Users/Samuel/Documents/project_lab/src/database/auth-service.ts) | Conectar login/cadastro, perfil, linha favorita e histórico de relatos. |
| **Mapa Interativo — GPS / Renderizador** | [`src/components/home/interactive-map-mock.tsx`](file:///C:/Users/Samuel/Documents/project_lab/src/components/home/interactive-map-mock.tsx) | Substituir o mock vetorial por MapLibre / WebView / `react-native-maps`. |

---

## 1. 🌐 Integração com o Backend (API)

A base HTTP pronta com `fetch` e suporte a `EXPO_PUBLIC_API_URL` já está configurada em [`src/services/api.ts`](file:///C:/Users/Samuel/Documents/project_lab/src/services/api.ts).

### Endpoints necessários:
1. **`GET /routes`**: Retorna a lista de linhas metropolitanas, paradas e horários (formato `Route[]` de [`src/data/routes.ts`](file:///C:/Users/Samuel/Documents/project_lab/src/data/routes.ts)).
2. **`POST /reports`**: Envia um novo relato de lotação de ônibus:
   ```json
   {
     "routeId": "paripueira",
     "stopName": "AL-101 Norte",
     "crowdLevel": 60,
     "comment": "Ônibus passou agora há pouco",
     "coords": [-35.64, -9.505]
   }
   ```
3. **`GET /buses/live`** (ou WebSocket): Retorna as posições e relatos ativos dos ônibus em tempo real.

👉 O arquivo [`src/services/bus-service.ts`](file:///C:/Users/Samuel/Documents/project_lab/src/services/bus-service.ts) já contém os métodos prontos com fallback para mock, bastando descomentar as chamadas para `api.get` e `api.post`.

---

## 2. 🗄️ Integração com Banco de Dados e Contas (Auth / Perfil)

Em [`src/database/auth-service.ts`](file:///C:/Users/Samuel/Documents/project_lab/src/database/auth-service.ts), deixamos a estrutura de autenticação e perfil universitário pronta:

- **Autenticação**:
  - `login(email, password)`
  - `register(name, email, university, password)`
  - `getCurrentUser()`
- **Perfil & Preferências**:
  - `setFavoriteRoute(routeId)`: Salva no banco/storage a linha favorita do estudante para abrir na tela inicial.
  - `getUserReports(userId)`: Histórico de relatos que alimenta a tela de perfil.

*(Pode ser integrado com Supabase, Firebase, SQLite ou backend próprio REST).*

---

## 3. 🗺️ Integração do Mapa Interativo

O componente atual [`src/components/home/interactive-map-mock.tsx`](file:///C:/Users/Samuel/Documents/project_lab/src/components/home/interactive-map-mock.tsx) já recebe as props necessárias:

```tsx
interface InteractiveMapProps {
  selectedRouteId: string;
  onSelectBus?: (busCode: string) => void;
  // Quando o mapa real for integrado:
  // userLocation?: { latitude: number; longitude: number };
  // routes?: Route[];
}
```

### Opções recomendadas para o Expo v57:
1. **MapLibre via WebView**: Carregar o HTML/JS com `maplibre-gl` (exatamente como estava no protótipo web da pasta `FrontEndProjeto`).
2. **`react-native-maps`** ou **`@rnmapbox/maps`**: Para renderização de mapas nativos vetoriais em iOS/Android.

---

## 🚀 Como testar localmente

```bash
# Iniciar o servidor Expo
npm run start

# Abrir no navegador ou emulador Android
npm run web
# ou
npm run android
```
