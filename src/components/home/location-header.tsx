import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Badge } from '@/components/ui/badge';
import { ChipFilter, type RouteChipItem } from '@/components/ui/chip-filter';

export const ALAGOAS_ROUTES: RouteChipItem[] = [
  {
    id: 'paripueira',
    name: 'Paripueira',
    color: '#22C55E',
    activeColorBg: 'rgba(34, 197, 94, 0.18)',
    activeColorBorder: '#22C55E',
  },
  {
    id: 'barra-de-santo-antonio',
    name: 'Barra de Santo Antônio',
    color: '#38BDF8',
    activeColorBg: 'rgba(56, 189, 248, 0.18)',
    activeColorBorder: '#38BDF8',
  },
  {
    id: 'marechal-deodoro',
    name: 'Marechal Deodoro',
    color: '#F59E0B',
    activeColorBg: 'rgba(245, 158, 11, 0.18)',
    activeColorBorder: '#F59E0B',
  },
  {
    id: 'rio-largo',
    name: 'Rio Largo',
    color: '#C084FC',
    activeColorBg: 'rgba(192, 132, 252, 0.18)',
    activeColorBorder: '#C084FC',
  },
];

interface LocationHeaderProps {
  selectedRouteId: string;
  onSelectRoute: (id: string) => void;
  activeBusesCount?: number;
}

export function LocationHeader({
  selectedRouteId,
  onSelectRoute,
  activeBusesCount = 3,
}: LocationHeaderProps) {
  return (
    <View style={styles.container}>
      {/* Location Status Card */}
      <View style={styles.locationCard}>
        <View style={styles.leftInfo}>
          <View style={styles.pinCircle}>
            <Text style={styles.pinIcon}>📍</Text>
          </View>
          <View>
            <Text style={styles.smallLabel}>Você está em</Text>
            <Text style={styles.cityText}>Maceió — AL</Text>
          </View>
        </View>

        <Badge
          label={`${activeBusesCount} ao vivo`}
          variant="live"
          showDot
        />
      </View>

      {/* Horizontal Route Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsScroll}
      >
        {ALAGOAS_ROUTES.map((route) => (
          <ChipFilter
            key={route.id}
            item={route}
            isSelected={selectedRouteId === route.id}
            onPress={() => onSelectRoute(route.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  locationCard: {
    backgroundColor: '#131A29',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  leftInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pinCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinIcon: {
    fontSize: 18,
  },
  smallLabel: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  cityText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F8FAFC',
    letterSpacing: 0.2,
  },
  chipsScroll: {
    paddingRight: 16,
  },
});
