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
import { Route } from '@/data/routes';

interface SchedulesViewProps {
  routes: Route[];
}

const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const CURRENT_TIME = '07:26'; // Mocked reference time

function nextDeparture(departures: { time: string; direction: 'ida' | 'volta' }[], direction: 'ida' | 'volta') {
  const upcoming = departures.filter((d) => d.direction === direction && d.time >= CURRENT_TIME);
  return upcoming[0] ?? null;
}

function minsUntil(time: string) {
  const [h, m] = time.split(':').map(Number);
  const [ch, cm] = CURRENT_TIME.split(':').map(Number);
  return h * 60 + m - (ch * 60 + cm);
}

export function SchedulesView({ routes }: SchedulesViewProps) {
  const insets = useSafeAreaInsets();
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const [selectedRouteId, setSelectedRouteId] = useState(routes[0]?.id || 'paripueira');
  const [direction, setDirection] = useState<'ida' | 'volta'>('ida');

  const currentRoute = routes.find((r) => r.id === selectedRouteId) || routes[0];
  const departures = currentRoute.departures.filter((d) => d.direction === direction);
  const next = nextDeparture(currentRoute.departures, direction);

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Quadro de Horários</Text>
        <Text style={styles.subtitle}>Consulte as saídas programadas de ida e volta</Text>

        {/* Days selector */}
        <View style={styles.daysRow}>
          {DAYS.map((d, index) => {
            const isSelected = selectedDay === index;
            return (
              <TouchableOpacity
                key={d}
                onPress={() => setSelectedDay(index)}
                style={[
                  styles.dayButton,
                  isSelected && {
                    backgroundColor: currentRoute.color,
                    borderColor: currentRoute.color,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.dayText,
                    isSelected && { color: '#0d1117', fontWeight: '800' },
                  ]}
                >
                  {d}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Route chips horizontal scroll */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.routeChipsRow}>
          {routes.map((r) => {
            const isSelected = selectedRouteId === r.id;
            return (
              <TouchableOpacity
                key={r.id}
                onPress={() => setSelectedRouteId(r.id)}
                style={[
                  styles.routeChip,
                  isSelected && {
                    borderColor: r.color,
                    backgroundColor: `${r.color}20`,
                  },
                ]}
              >
                <View style={[styles.routeDot, { backgroundColor: r.color }]} />
                <Text
                  style={[
                    styles.routeChipText,
                    isSelected && { color: '#e6edf3', fontWeight: '700' },
                  ]}
                >
                  {r.origin}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Direction Toggle */}
        <View style={styles.directionToggleRow}>
          {(['ida', 'volta'] as const).map((dir) => {
            const isSelected = direction === dir;
            return (
              <TouchableOpacity
                key={dir}
                onPress={() => setDirection(dir)}
                style={[
                  styles.directionBtn,
                  isSelected && {
                    backgroundColor: `${currentRoute.color}20`,
                    borderColor: currentRoute.color,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.directionBtnText,
                    isSelected && { color: currentRoute.color, fontWeight: '700' },
                  ]}
                >
                  {dir === 'ida'
                    ? `🏫 ${currentRoute.origin} ➔ Maceió`
                    : `🏠 Maceió ➔ ${currentRoute.origin}`}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.contentList} showsVerticalScrollIndicator={false}>
        {/* Next Bus Card Callout */}
        {next && (
          <View
            style={[
              styles.nextCard,
              { backgroundColor: `${currentRoute.color}15`, borderColor: `${currentRoute.color}45` },
            ]}
          >
            <View>
              <Text style={[styles.nextTag, { color: currentRoute.color }]}>PRÓXIMA SAÍDA</Text>
              <Text style={styles.nextTime}>{next.time}</Text>
              <Text style={styles.nextDest}>
                Destino: {direction === 'ida' ? currentRoute.destination : currentRoute.origin}
              </Text>
            </View>
            <View style={styles.countdownBox}>
              <Text style={[styles.countdownNumber, { color: currentRoute.color }]}>
                {minsUntil(next.time) > 0 ? `${minsUntil(next.time)} min` : 'Em instantes'}
              </Text>
              <Text style={styles.countdownLabel}>tempo estimado</Text>
            </View>
          </View>
        )}

        {/* Departures Grid / List */}
        <Text style={styles.sectionLabel}>Todos os horários de {direction.toUpperCase()}</Text>
        <View style={styles.departuresGrid}>
          {departures.map((dep, idx) => {
            const isPast = dep.time < CURRENT_TIME;
            const isNext = next?.time === dep.time;

            return (
              <View
                key={`${dep.time}-${idx}`}
                style={[
                  styles.timeCard,
                  isNext && { borderColor: currentRoute.color, backgroundColor: `${currentRoute.color}15` },
                  isPast && styles.pastTimeCard,
                ]}
              >
                <Ionicons
                  name="time-outline"
                  size={16}
                  color={isNext ? currentRoute.color : isPast ? '#484f58' : '#8b949e'}
                />
                <Text
                  style={[
                    styles.timeText,
                    isNext && { color: currentRoute.color, fontWeight: '800' },
                    isPast && { color: '#484f58' },
                  ]}
                >
                  {dep.time}
                </Text>
                {isNext && (
                  <View style={[styles.nextDot, { backgroundColor: currentRoute.color }]} />
                )}
              </View>
            );
          })}
        </View>

        {/* Tips Footer */}
        <View style={styles.tipsBox}>
          <Ionicons name="information-circle-outline" size={18} color="#8b949e" />
          <Text style={styles.tipsText}>
            Horários sujeitos a alterações pelo tráfego da AL-101 e BR-104 nos horários de pico.
          </Text>
        </View>
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
    paddingBottom: 14,
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
    marginBottom: 14,
  },
  daysRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 12,
  },
  dayButton: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#161b22',
    borderWidth: 1,
    borderColor: '#30363d',
  },
  dayText: {
    fontSize: 11,
    color: '#8b949e',
    fontWeight: '600',
  },
  routeChipsRow: {
    gap: 8,
    paddingBottom: 12,
  },
  routeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#161b22',
    borderWidth: 1,
    borderColor: '#30363d',
  },
  routeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  routeChipText: {
    fontSize: 12,
    color: '#8b949e',
  },
  directionToggleRow: {
    flexDirection: 'row',
    gap: 10,
  },
  directionBtn: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#161b22',
    borderWidth: 1,
    borderColor: '#30363d',
  },
  directionBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8b949e',
  },
  contentList: {
    padding: 20,
    gap: 16,
    paddingBottom: 36,
  },
  nextCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nextTag: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  nextTime: {
    fontSize: 26,
    fontWeight: '800',
    color: '#e6edf3',
    marginVertical: 2,
  },
  nextDest: {
    fontSize: 12,
    color: '#8b949e',
  },
  countdownBox: {
    alignItems: 'flex-end',
  },
  countdownNumber: {
    fontSize: 18,
    fontWeight: '800',
  },
  countdownLabel: {
    fontSize: 10,
    color: '#8b949e',
    marginTop: 2,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8b949e',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  departuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  timeCard: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#161b22',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#30363d',
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  pastTimeCard: {
    opacity: 0.5,
  },
  timeText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#e6edf3',
  },
  nextDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginLeft: 'auto',
  },
  tipsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#161b22',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#21262d',
    marginTop: 6,
  },
  tipsText: {
    flex: 1,
    fontSize: 11,
    color: '#8b949e',
    lineHeight: 16,
  },
});
