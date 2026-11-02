export type Stop = {
  name: string;
  city: string;
  coords: [number, number]; // [longitude, latitude]
  type: 'origin' | 'waypoint' | 'destination';
};

export type BusReport = {
  id: string;
  reportedBy: string;
  reportedAt: string; // ISO string
  coords: [number, number]; // [longitude, latitude]
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
    color: '#22C55E',
    origin: 'Paripueira',
    destination: 'UNIMA / CESMAC / UFAL',
    universities: ['UNIMA', 'CESMAC', 'UFAL'],
    stops: [
      { name: 'Paripueira (AL-101)', city: 'Paripueira', coords: [-35.5523, -9.4635], type: 'origin' },
      { name: 'UNIMA (Cruz das Almas)', city: 'Maceió', coords: [-35.695, -9.6213], type: 'waypoint' },
      { name: 'CESMAC / Farol', city: 'Maceió', coords: [-35.7347, -9.6533], type: 'waypoint' },
      { name: 'UFAL (Campus A.C. Simões)', city: 'Maceió', coords: [-35.7745, -9.558], type: 'destination' },
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
      coords: [-35.695, -9.6213],
      stopName: 'UNIMA (Cruz das Almas)',
      crowdLevel: 72,
      comment: 'Passou na UNIMA sentido Farol',
    },
    totalReports: 342,
  },
  {
    id: 'barra-de-santo-antonio',
    name: 'Linha Barra de Sto. Antônio',
    color: '#38BDF8',
    origin: 'Barra de Santo Antônio',
    destination: 'UNIMA / CESMAC / UFAL',
    universities: ['UNIMA', 'CESMAC', 'UFAL'],
    stops: [
      { name: 'Barra de Santo Antônio', city: 'Barra de Santo Antônio', coords: [-35.5072, -9.4047], type: 'origin' },
      { name: 'UNIMA (Cruz das Almas)', city: 'Maceió', coords: [-35.695, -9.6213], type: 'waypoint' },
      { name: 'CESMAC / Farol', city: 'Maceió', coords: [-35.7347, -9.6533], type: 'waypoint' },
      { name: 'UFAL (Campus A.C. Simões)', city: 'Maceió', coords: [-35.7745, -9.558], type: 'destination' },
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
      coords: [-35.635, -9.562],
      stopName: 'AL-101 Norte',
      crowdLevel: 55,
      comment: 'Descendo a AL-101 sentido UNIMA',
    },
    totalReports: 218,
  },
  {
    id: 'marechal-deodoro',
    name: 'Linha Marechal Deodoro',
    color: '#F59E0B',
    origin: 'Marechal Deodoro',
    destination: 'CESMAC / UFAL',
    universities: ['CESMAC', 'UFAL'],
    stops: [
      { name: 'Marechal Deodoro (Barra Nova)', city: 'Marechal Deodoro', coords: [-35.834, -9.736], type: 'origin' },
      { name: 'CESMAC / Farol', city: 'Maceió', coords: [-35.7347, -9.6533], type: 'waypoint' },
      { name: 'UFAL (Santos Dumont)', city: 'Maceió', coords: [-35.7745, -9.558], type: 'destination' },
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
      coords: [-35.758, -9.68],
      stopName: 'Pontal da Barra',
      crowdLevel: 30,
      comment: 'Cruzando o Pontal sentido Farol',
    },
    totalReports: 189,
  },
  {
    id: 'rio-largo',
    name: 'Linha Rio Largo',
    color: '#C084FC',
    origin: 'Rio Largo',
    destination: 'UFAL / CESMAC',
    universities: ['UFAL', 'CESMAC'],
    stops: [
      { name: 'Rio Largo (Centro)', city: 'Rio Largo', coords: [-35.858, -9.4802], type: 'origin' },
      { name: 'UFAL / BR-104', city: 'Maceió', coords: [-35.7745, -9.558], type: 'waypoint' },
      { name: 'CESMAC (Ladeira dos Martírios / Farol)', city: 'Maceió', coords: [-35.7382, -9.6596], type: 'destination' },
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
      coords: [-35.7745, -9.558],
      stopName: 'UFAL / BR-104',
      crowdLevel: 80,
      comment: 'Parada na UFAL sentido Farol',
    },
    totalReports: 295,
  },
];

export function crowdColor(level: number): string {
  if (level < 40) return '#22C55E';
  if (level < 75) return '#F59E0B';
  return '#EF4444';
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
