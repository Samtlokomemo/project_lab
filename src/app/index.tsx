import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import {
  LocationHeader,
  InteractiveMapMock,
  BottomInfoPanel,
  BottomNavBar,
  type NavTabId,
} from '@/components/home';
import { type BusStatusData } from '@/components/ui';

// Mock data based on the Alagoas University Transportation report
const ROUTE_BUS_DATA: Record<string, { origin: string; destination: string; bus: BusStatusData }> = {
  paripueira: {
    origin: 'Paripueira',
    destination: 'Maceió',
    bus: {
      id: 'bus-1',
      code: 'B-PAR-01',
      updatedAt: 'há 4 min',
      location: 'AL-101 Norte',
      reporter: 'Lucas M.',
      occupancyPercent: 80,
      occupancyLabel: 'Cheio',
      comment: 'Saiu de Paripueira com 5 min de atraso',
    },
  },
  'barra-de-santo-antonio': {
    origin: 'Barra de Santo Antônio',
    destination: 'Maceió',
    bus: {
      id: 'bus-2',
      code: 'B-BSA-02',
      updatedAt: 'há 2 min',
      location: 'Trevo de São Luís do Quitunde',
      reporter: 'Camila R.',
      occupancyPercent: 55,
      occupancyLabel: 'Moderado',
      comment: 'Trânsito fluido na AL-101 Norte',
    },
  },
  'marechal-deodoro': {
    origin: 'Marechal Deodoro',
    destination: 'Maceió',
    bus: {
      id: 'bus-3',
      code: 'B-MD-04',
      updatedAt: 'há 6 min',
      location: 'Polo Cloroquímico',
      reporter: 'Rafael S.',
      occupancyPercent: 30,
      occupancyLabel: 'Livre',
      comment: 'Embarque normal nas paradas',
    },
  },
  'rio-largo': {
    origin: 'Rio Largo',
    destination: 'Maceió',
    bus: {
      id: 'bus-4',
      code: 'B-RL-03',
      updatedAt: 'há 1 min',
      location: 'BR-104 · Aeroporto',
      reporter: 'Ana P.',
      occupancyPercent: 75,
      occupancyLabel: 'Cheio',
      comment: 'Parada cheia na entrada do aeroporto',
    },
  },
};

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [selectedRouteId, setSelectedRouteId] = useState<string>('paripueira');
  const [activeTab, setActiveTab] = useState<NavTabId>('map');

  const currentRouteData = ROUTE_BUS_DATA[selectedRouteId] || ROUTE_BUS_DATA.paripueira;

  const handleSelectBusFromMap = (busCode: string) => {
    // If user taps on a bus tooltip on map, automatically switch to its route
    if (busCode.includes('RL')) {
      setSelectedRouteId('rio-largo');
    } else if (busCode.includes('BSA')) {
      setSelectedRouteId('barra-de-santo-antonio');
    } else {
      setSelectedRouteId('paripueira');
    }
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />

      {/* Main Map View Area */}
      <View style={styles.mapContainer}>
        <InteractiveMapMock onSelectBus={handleSelectBusFromMap} />

        {/* Floating Header Card and Route Filter Carousel */}
        <View style={[styles.topHeaderOverlay, { paddingTop: insets.top + 8 }]}>
          <LocationHeader
            selectedRouteId={selectedRouteId}
            onSelectRoute={setSelectedRouteId}
            activeBusesCount={3}
          />
        </View>
      </View>

      {/* Bottom Sheet Details Panel */}
      <BottomInfoPanel
        origin={currentRouteData.origin}
        destination={currentRouteData.destination}
        busData={currentRouteData.bus}
        campusTags={['UFAL', 'CESMAC']}
      />

      {/* Persistent Bottom Navigation Bar */}
      <BottomNavBar
        activeTab={activeTab}
        onChangeTab={setActiveTab}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#090D16',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  topHeaderOverlay: {
    position: 'absolute',
    top: 0,
    left: 16,
    right: 0,
    zIndex: 10,
  },
});
