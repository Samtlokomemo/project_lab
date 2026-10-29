import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export interface BusStatusData {
  id: string;
  code: string;
  updatedAt: string;
  location: string;
  reporter: string;
  occupancyPercent: number; // 0 to 100
  occupancyLabel: string;
  comment?: string;
}

interface BusCardProps {
  bus: BusStatusData;
}

export function BusCard({ bus }: BusCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.identifierGroup}>
          <View style={styles.iconContainer}>
            <Text style={styles.busEmoji}>🚌</Text>
          </View>
          <View>
            <Text style={styles.busCode}>{bus.code}</Text>
            <View style={styles.locationRow}>
              <Text style={styles.pinIcon}>📍</Text>
              <Text style={styles.locationText}>
                {bus.location} · Reportado por {bus.reporter}
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.timeText}>{bus.updatedAt}</Text>
      </View>

      {/* Occupancy bar */}
      <View style={styles.occupancySection}>
        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${Math.min(Math.max(bus.occupancyPercent, 5), 100)}%` },
            ]}
          />
        </View>
        <Text style={styles.occupancyLabel}>{bus.occupancyLabel}</Text>
      </View>

      {/* Community comment / report */}
      {bus.comment && (
        <Text style={styles.commentText}>
          &ldquo;{bus.comment}&rdquo;
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#151D2C',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 14,
    gap: 12,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  identifierGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  busEmoji: {
    fontSize: 22,
  },
  busCode: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F8FAFC',
    letterSpacing: 0.3,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  pinIcon: {
    fontSize: 11,
    marginRight: 4,
  },
  locationText: {
    fontSize: 12,
    color: '#94A3B8',
  },
  timeText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  occupancySection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  progressBarBackground: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#273449',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
    borderRadius: 3,
  },
  occupancyLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F59E0B',
  },
  commentText: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#94A3B8',
    marginTop: -2,
  },
});
