
import { StatusBar } from 'expo-status-bar';
import { signOut } from 'firebase/auth';
import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { auth } from '@/database/firebase';

import {
  BottomInfoPanel,
  BottomNavBar,
  InteractiveMapMock,
  LocationHeader,
  ReportModal,
  type NavTabId,
} from '@/components/home';
import { ProfileView } from '@/components/profile/profile-view';
import { RoutesView } from '@/components/routes/routes-view';
import { SchedulesView } from '@/components/schedules/schedules-view';
import { type BusStatusData } from '@/components/ui';
import { ROUTES as INITIAL_ROUTES, Route, crowdLabel, minutesAgo } from '@/data/routes';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [routes, setRoutes] = useState<Route[]>(INITIAL_ROUTES);
  const [selectedRouteId, setSelectedRouteId] = useState<string>('paripueira');
  const [activeTab, setActiveTab] = useState<NavTabId>('map');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Current selected route
  const currentRoute = routes.find((r) => r.id === selectedRouteId) || routes[0];

  // Convert activeBus to BusStatusData format for the UI card
  const currentBusData: BusStatusData | null = currentRoute.activeBus
    ? {
        id: currentRoute.activeBus.id,
        code: currentRoute.activeBus.id,
        updatedAt: minutesAgo(currentRoute.activeBus.reportedAt),
        location: currentRoute.activeBus.stopName,
        reporter: currentRoute.activeBus.reportedBy,
        occupancyPercent: currentRoute.activeBus.crowdLevel,
        occupancyLabel: crowdLabel(currentRoute.activeBus.crowdLevel),
        comment: currentRoute.activeBus.comment,
      }
    : null;

  const handleSelectBusFromMap = (busCode: string) => {
    const matched = routes.find((r) => r.activeBus?.id === busCode);
    if (matched) {
      setSelectedRouteId(matched.id);
    }
  };

  const handleSendReport = (newReport: { stopName: string; crowdLevel: number; comment?: string }) => {
    setRoutes((prevRoutes) =>
      prevRoutes.map((r) => {
        if (r.id === currentRoute.id) {
          return {
            ...r,
            totalReports: r.totalReports + 1,
            activeBus: {
              id: r.activeBus?.id || `B-${r.origin.substring(0, 3).toUpperCase()}-01`,
              reportedBy: 'Você',
              reportedAt: new Date().toISOString(),
              coords: [-35.735, -9.58],
              stopName: newReport.stopName,
              crowdLevel: newReport.crowdLevel,
              comment: newReport.comment,
            },
          };
        }
        return r;
      })
    );
  };

  const handleSelectRouteFromList = (routeId: string) => {
    setSelectedRouteId(routeId);
    setActiveTab('map');
  };

  // Sair da conta do usuário
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível sair da conta.');
      console.error('Erro ao sair da conta:', error);
    }
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />

      {/* Main Tab Content */}
      <View style={styles.mainContent}>
        {activeTab === 'map' && (
          <View style={styles.mapContainer}>
            <InteractiveMapMock onSelectBus={handleSelectBusFromMap} />

            {/* Floating Header Card and Route Filter Carousel */}
            <View style={[styles.topHeaderOverlay, { paddingTop: insets.top + 8 }]}>
              <LocationHeader
                selectedRouteId={selectedRouteId}
                onSelectRoute={setSelectedRouteId}
                activeBusesCount={routes.filter((r) => r.activeBus).length}
              />
            </View>

            {/* Bottom Sheet Details Panel */}
            <View style={styles.bottomPanelContainer}>
              <BottomInfoPanel
                origin={currentRoute.origin}
                destination={currentRoute.destination}
                color={currentRoute.color}
                busData={currentBusData}
                campusTags={currentRoute.universities}
                totalReports={currentRoute.totalReports}
                onOpenReportModal={() => setIsReportModalOpen(true)}
              />
            </View>
          </View>
        )}

        {activeTab === 'routes' && (
          <RoutesView
            routes={routes}
            onSelectRouteOnMap={handleSelectRouteFromList}
          />
        )}

        {activeTab === 'schedules' && <SchedulesView routes={routes} />}

        {activeTab === 'profile' && (
          <ProfileView
            routes={routes}
            favoriteRouteId={selectedRouteId}
            onSelectFavoriteRoute={setSelectedRouteId}
            onLogout={handleLogout}
          />
        )}
      </View>

      {/* Report Modal */}
      <ReportModal
        visible={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        route={currentRoute}
        onSubmit={handleSendReport}
      />

      {/* Persistent Bottom Navigation Bar */}
      <BottomNavBar activeTab={activeTab} onChangeTab={setActiveTab} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#090D16',
  },
  mainContent: {
    flex: 1,
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
  bottomPanelContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
});
