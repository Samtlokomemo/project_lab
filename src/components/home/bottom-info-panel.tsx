import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Badge } from '@/components/ui/badge';
import { BusCard, type BusStatusData } from '@/components/ui/bus-card';

interface BottomInfoPanelProps {
  origin: string;
  destination: string;
  busData: BusStatusData;
  campusTags?: string[];
  onBoardingReport?: () => void;
}

export function BottomInfoPanel({
  origin,
  destination,
  busData,
  campusTags = ['UFAL', 'CESMAC'],
  onBoardingReport,
}: BottomInfoPanelProps) {
  const [isOnboard, setIsOnboard] = useState(false);

  const handlePressOnboard = () => {
    if (onBoardingReport) {
      onBoardingReport();
      return;
    }

    const nextState = !isOnboard;
    setIsOnboard(nextState);

    Alert.alert(
      nextState ? 'Embarque Confirmado! 🚌' : 'Desembarque Registrado',
      nextState
        ? `Você está colaborando em tempo real na rota ${origin} ➔ ${destination}. Sua presença atualiza a lotação!`
        : `Você informou o desembarque do ônibus ${busData.code}.`,
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.sheetContainer}>
      {/* Drag Indicator Handle */}
      <View style={styles.handleContainer}>
        <View style={styles.dragHandle} />
      </View>

      {/* Route Direction & Action Button */}
      <View style={styles.routeHeaderRow}>
        <View style={styles.routeTitleGroup}>
          <View style={styles.originDot} />
          <Text style={styles.originText}>{origin}</Text>
          <Text style={styles.arrowText}>➔</Text>
          <Text style={styles.destinationText}>{destination}</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handlePressOnboard}
          style={[
            styles.onboardButton,
            isOnboard && styles.onboardButtonActive,
          ]}
        >
          <Text style={styles.buttonPin}>📍</Text>
          <Text style={[styles.buttonLabel, isOnboard && styles.buttonLabelActive]}>
            {isOnboard ? 'A bordo' : 'Estou no ônibus'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* University / Stop Badges */}
      <View style={styles.tagsRow}>
        {campusTags.map((tag) => (
          <Badge key={tag} label={tag} variant="neutral" />
        ))}
      </View>

      {/* Live Monitored Bus Card */}
      <BusCard bus={busData} />
    </View>
  );
}

const styles = StyleSheet.create({
  sheetContainer: {
    backgroundColor: '#0F1626',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 10,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  dragHandle: {
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  routeHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  routeTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    flexWrap: 'wrap',
  },
  originDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#22C55E',
  },
  originText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  arrowText: {
    fontSize: 14,
    color: '#64748B',
  },
  destinationText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#94A3B8',
  },
  onboardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(34, 197, 94, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.35)',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
    gap: 6,
  },
  onboardButtonActive: {
    backgroundColor: '#16A34A',
    borderColor: '#22C55E',
  },
  buttonPin: {
    fontSize: 13,
  },
  buttonLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4ADE80',
  },
  buttonLabelActive: {
    color: '#FFFFFF',
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 8,
  },
});
