import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Route, crowdColor, crowdLabel, minutesAgo } from '@/data/routes';

interface RoutesViewProps {
  routes: Route[];
  onSelectRouteOnMap?: (routeId: string) => void;
}

export function RoutesView({ routes, onSelectRouteOnMap }: RoutesViewProps) {
  const insets = useSafeAreaInsets();
  const [expandedId, setExpandedId] = useState<string | null>(routes[0]?.id || null);

  const activeCount = routes.filter((r) => r.activeBus).length;

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Linhas Intermunicipais</Text>
        <Text style={styles.subtitle}>
          {activeCount} de {routes.length} linhas com localização ativa agora
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollList} showsVerticalScrollIndicator={false}>
        {routes.map((line) => {
          const isExpanded = expandedId === line.id;

          return (
            <View
              key={line.id}
              style={[
                styles.card,
                isExpanded && { borderColor: `${line.color}70` },
              ]}
            >
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setExpandedId(isExpanded ? null : line.id)}
                style={styles.cardHeader}
              >
                {/* Left accent bar */}
                <View style={[styles.colorBar, { backgroundColor: line.color }]} />

                <View style={styles.routeMainInfo}>
                  <View style={styles.originRow}>
                    <Text style={styles.originText}>{line.origin}</Text>
                    <Ionicons name="arrow-forward" size={14} color="#8b949e" />
                    <Text style={styles.destinationText}>{line.destination}</Text>
                  </View>

                  <View style={styles.tagsRow}>
                    {line.universities.map((u) => (
                      <View key={u} style={styles.univBadge}>
                        <Text style={styles.univBadgeText}>{u}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Right status */}
                <View style={styles.statusCol}>
                  {line.activeBus ? (
                    <View style={[styles.liveBadge, { backgroundColor: `${line.color}20` }]}>
                      <View style={[styles.liveDot, { backgroundColor: line.color }]} />
                      <Text style={[styles.liveText, { color: line.color }]}>AO VIVO</Text>
                    </View>
                  ) : (
                    <Text style={styles.offlineText}>Sem relatos</Text>
                  )}
                  <Ionicons
                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color="#8b949e"
                  />
                </View>
              </TouchableOpacity>

              {/* Live Bus Summary */}
              {line.activeBus && (
                <View style={styles.liveBox}>
                  <Text style={styles.busEmoji}>🚌</Text>
                  <View style={styles.liveDetails}>
                    <View style={styles.liveTopRow}>
                      <Text style={styles.liveStopName} numberOfLines={1}>
                        {line.activeBus.stopName}
                      </Text>
                      <Text style={styles.liveTime}>
                        {minutesAgo(line.activeBus.reportedAt)}
                      </Text>
                    </View>

                    {/* Progress bar and crowd indicator */}
                    <View style={styles.crowdBarRow}>
                      <View style={styles.crowdTrack}>
                        <View
                          style={[
                            styles.crowdFill,
                            {
                              width: `${line.activeBus.crowdLevel}%`,
                              backgroundColor: crowdColor(line.activeBus.crowdLevel),
                            },
                          ]}
                        />
                      </View>
                      <Text
                        style={[
                          styles.crowdText,
                          { color: crowdColor(line.activeBus.crowdLevel) },
                        ]}
                      >
                        {crowdLabel(line.activeBus.crowdLevel)}
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              {/* Collapsed/Expanded Stats */}
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{line.stops.length}</Text>
                  <Text style={styles.statLabel}>Paradas</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{line.departures.length}</Text>
                  <Text style={styles.statLabel}>Horários/dia</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{line.totalReports}</Text>
                  <Text style={styles.statLabel}>Relatos</Text>
                </View>
              </View>

              {/* Expanded Stops Timeline */}
              {isExpanded && (
                <View style={styles.expandedContent}>
                  <Text style={styles.timelineTitle}>Itinerário da Linha</Text>
                  <View style={styles.timelineList}>
                    {line.stops.map((stop, idx) => {
                      const isLast = idx === line.stops.length - 1;
                      const isFirst = idx === 0;

                      return (
                        <View key={stop.name} style={styles.timelineItem}>
                          <View style={styles.timelineLineColumn}>
                            <View
                              style={[
                                styles.timelineDot,
                                {
                                  backgroundColor: isFirst || isLast ? line.color : '#0d1117',
                                  borderColor: line.color,
                                },
                              ]}
                            />
                            {!isLast && <View style={styles.timelineSegment} />}
                          </View>
                          <View style={styles.timelineTextColumn}>
                            <Text style={styles.stopNameText}>{stop.name}</Text>
                            <Text style={styles.stopCityText}>{stop.city}</Text>
                          </View>
                        </View>
                      );
                    })}
                  </View>

                  {onSelectRouteOnMap && (
                    <TouchableOpacity
                      onPress={() => onSelectRouteOnMap(line.id)}
                      style={[styles.viewMapBtn, { borderColor: line.color }]}
                    >
                      <Ionicons name="map-outline" size={16} color={line.color} />
                      <Text style={[styles.viewMapText, { color: line.color }]}>
                        Ver Linha no Mapa
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090D16',
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#21262d',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#e6edf3',
  },
  subtitle: {
    fontSize: 13,
    color: '#8b949e',
    marginTop: 4,
  },
  scrollList: {
    padding: 16,
    gap: 14,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: '#161b22',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#30363d',
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  colorBar: {
    width: 4,
    height: 44,
    borderRadius: 2,
  },
  routeMainInfo: {
    flex: 1,
  },
  originRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  originText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#e6edf3',
  },
  destinationText: {
    fontSize: 13,
    color: '#8b949e',
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  univBadge: {
    backgroundColor: '#21262d',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  univBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#8b949e',
  },
  statusCol: {
    alignItems: 'flex-end',
    gap: 8,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  liveText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  offlineText: {
    fontSize: 11,
    color: '#8b949e',
  },
  liveBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#21262d',
    marginHorizontal: 14,
    marginBottom: 12,
    padding: 10,
    borderRadius: 12,
  },
  busEmoji: {
    fontSize: 18,
  },
  liveDetails: {
    flex: 1,
  },
  liveTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  liveStopName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#e6edf3',
    maxWidth: '70%',
  },
  liveTime: {
    fontSize: 11,
    color: '#8b949e',
  },
  crowdBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  crowdTrack: {
    flex: 1,
    height: 5,
    backgroundColor: '#30363d',
    borderRadius: 3,
    overflow: 'hidden',
  },
  crowdFill: {
    height: '100%',
    borderRadius: 3,
  },
  crowdText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#21262d',
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  statItem: {
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#e6edf3',
  },
  statLabel: {
    fontSize: 10,
    color: '#8b949e',
    marginTop: 1,
  },
  expandedContent: {
    borderTopWidth: 1,
    borderTopColor: '#21262d',
    padding: 14,
    backgroundColor: '#121720',
  },
  timelineTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8b949e',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  timelineList: {
    paddingLeft: 6,
  },
  timelineItem: {
    flexDirection: 'row',
    minHeight: 36,
  },
  timelineLineColumn: {
    alignItems: 'center',
    width: 16,
    marginRight: 10,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
  },
  timelineSegment: {
    flex: 1,
    width: 2,
    backgroundColor: '#30363d',
    marginVertical: 2,
  },
  timelineTextColumn: {
    flex: 1,
    paddingBottom: 10,
  },
  stopNameText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#e6edf3',
  },
  stopCityText: {
    fontSize: 10,
    color: '#8b949e',
  },
  viewMapBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: '#161b22',
  },
  viewMapText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
