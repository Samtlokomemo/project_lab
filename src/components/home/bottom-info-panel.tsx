import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Badge } from '@/components/ui/badge';
import { BusCard, type BusStatusData } from '@/components/ui/bus-card';

interface BottomInfoPanelProps {
  origin: string;
  destination: string;
  color?: string;
  busData: BusStatusData | null;
  campusTags?: string[];
  totalReports?: number;
  onOpenReportModal: () => void;
  onViewStopsTimeline?: () => void;
}

export function BottomInfoPanel({
  origin,
  destination,
  color = '#22C55E',
  busData,
  campusTags = ['UFAL', 'CESMAC'],
  totalReports = 300,
  onOpenReportModal,
  onViewStopsTimeline,
}: BottomInfoPanelProps) {
  return (
    <View style={styles.sheetContainer}>
      {/* Drag Indicator Handle */}
      <View style={styles.handleContainer}>
        <View style={styles.dragHandle} />
      </View>

      {/* Route Direction & Action Button */}
      <View style={styles.routeHeaderRow}>
        <View style={styles.routeTitleGroup}>
          <View style={[styles.originDot, { backgroundColor: color }]} />
          <Text style={styles.originText}>{origin}</Text>
          <Text style={styles.arrowText}>➔</Text>
          <Text style={styles.destinationText}>{destination}</Text>
        </View>

        {/* Report Status Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onOpenReportModal}
          style={[styles.reportButton, { borderColor: `${color}60`, backgroundColor: `${color}18` }]}
        >
          <Ionicons name="chatbubble-ellipses-outline" size={15} color={color} />
          <Text style={[styles.reportButtonLabel, { color }]}>Reportar</Text>
        </TouchableOpacity>
      </View>

      {/* University / Stop Badges and Meta */}
      <View style={styles.tagsRow}>
        {campusTags.map((tag) => (
          <Badge key={tag} label={tag} variant="neutral" />
        ))}
        <View style={styles.reportsCountBadge}>
          <Ionicons name="people-outline" size={12} color="#8b949e" />
          <Text style={styles.reportsCountText}>{totalReports} relatos</Text>
        </View>
      </View>

      {/* Live Monitored Bus Card or Empty State */}
      {busData ? (
        <BusCard bus={busData} />
      ) : (
        <View style={styles.emptyBusCard}>
          <Ionicons name="bus-outline" size={24} color="#64748B" />
          <View style={styles.emptyBusTextCol}>
            <Text style={styles.emptyBusTitle}>Nenhum ônibus reportado agora</Text>
            <Text style={styles.emptyBusSub}>
              Seja o primeiro a compartilhar a localização desta linha!
            </Text>
          </View>
        </View>
      )}
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
  },
  originText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  arrowText: {
    fontSize: 14,
    color: '#64748B',
  },
  destinationText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#94A3B8',
  },
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  reportButtonLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reportsCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#161b22',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#30363d',
  },
  reportsCountText: {
    fontSize: 11,
    color: '#8b949e',
    fontWeight: '500',
  },
  emptyBusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#161b22',
    borderWidth: 1,
    borderColor: '#30363d',
    borderRadius: 16,
    padding: 16,
  },
  emptyBusTextCol: {
    flex: 1,
  },
  emptyBusTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#e6edf3',
  },
  emptyBusSub: {
    fontSize: 11,
    color: '#8b949e',
    marginTop: 2,
  },
});
