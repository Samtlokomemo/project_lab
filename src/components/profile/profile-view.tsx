import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Route } from '@/data/routes';

interface ProfileViewProps {
  routes: Route[];
  favoriteRouteId: string;
  onSelectFavoriteRoute: (routeId: string) => void;
}

const USER_HISTORY = [
  { line: 'Linha Paripueira', color: '#3fb950', stop: 'AL-101 Norte', crowd: 'Moderado (72%)', time: 'Hoje, 06:47' },
  { line: 'Linha Paripueira', color: '#3fb950', stop: 'Ponto Mirante', crowd: 'Moderado (55%)', time: 'Ontem, 07:02' },
  { line: 'Linha Barra de Sto. Antônio', color: '#58a6ff', stop: 'BR-104', crowd: 'Lotado (88%)', time: 'Seg, 27 Set' },
];

export function ProfileView({
  routes,
  favoriteRouteId,
  onSelectFavoriteRoute,
}: ProfileViewProps) {
  const insets = useSafeAreaInsets();
  const [notifyReports, setNotifyReports] = useState(true);
  const [notifyDepartures, setNotifyDepartures] = useState(true);

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Card Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>GS</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>Gabriel Souza</Text>
            <Text style={styles.userEmail}>gabriel.souza@ufal.br</Text>
            <View style={styles.badgeRow}>
              <View style={styles.statusDot} />
              <Text style={styles.badgeText}>Estudante · UFAL Campus A.C. Simões</Text>
            </View>
          </View>
        </View>

        {/* Contribution Metrics */}
        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>14</Text>
            <Text style={styles.metricLabel}>Relatos feitos</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={[styles.metricValue, { color: '#3fb950' }]}>84 pts</Text>
            <Text style={styles.metricLabel}>Colaboração</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>Nível 3</Text>
            <Text style={styles.metricLabel}>Comunidade</Text>
          </View>
        </View>

        {/* Favorite Line Preference */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Minha Linha Principal</Text>
          <Text style={styles.sectionSubtitle}>
            A linha selecionada será exibida como padrão na tela inicial
          </Text>

          <View style={styles.routesList}>
            {routes.map((route) => {
              const isFav = favoriteRouteId === route.id;
              return (
                <TouchableOpacity
                  key={route.id}
                  onPress={() => onSelectFavoriteRoute(route.id)}
                  style={[
                    styles.routeItem,
                    isFav && { borderColor: route.color, backgroundColor: `${route.color}15` },
                  ]}
                >
                  <View style={[styles.routeIconBox, { backgroundColor: `${route.color}25` }]}>
                    <Ionicons name="bus" size={18} color={route.color} />
                  </View>
                  <View style={styles.routeItemInfo}>
                    <Text style={[styles.routeItemName, isFav && { color: '#e6edf3', fontWeight: '700' }]}>
                      {route.name}
                    </Text>
                    <Text style={styles.routeItemSub}>
                      {route.origin} ➔ {route.destination}
                    </Text>
                  </View>
                  {isFav && <Ionicons name="checkmark-circle" size={22} color={route.color} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Notification Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notificações</Text>
          <View style={styles.settingsGroup}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Novos relatos em tempo real</Text>
                <Text style={styles.settingDesc}>Avisar quando houver reporte na minha linha</Text>
              </View>
              <Switch
                value={notifyReports}
                onValueChange={setNotifyReports}
                thumbColor={notifyReports ? '#3fb950' : '#8b949e'}
                trackColor={{ false: '#21262d', true: '#3fb95040' }}
              />
            </View>

            <View style={[styles.settingRow, styles.settingRowBorder]}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Lembrete de partida</Text>
                <Text style={styles.settingDesc}>Notificar 15 min antes da saída do ônibus</Text>
              </View>
              <Switch
                value={notifyDepartures}
                onValueChange={setNotifyDepartures}
                thumbColor={notifyDepartures ? '#3fb950' : '#8b949e'}
                trackColor={{ false: '#21262d', true: '#3fb95040' }}
              />
            </View>
          </View>
        </View>

        {/* Recent Contributions History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Histórico de Contribuições</Text>
          <View style={styles.historyList}>
            {USER_HISTORY.map((h, i) => (
              <View key={i} style={styles.historyItem}>
                <View style={[styles.historyDot, { backgroundColor: h.color }]} />
                <View style={styles.historyInfo}>
                  <Text style={styles.historyLine}>{h.line} · {h.stop}</Text>
                  <Text style={styles.historyCrowd}>Lotação: {h.crowd}</Text>
                </View>
                <Text style={styles.historyTime}>{h.time}</Text>
              </View>
            ))}
          </View>
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
  scrollContent: {
    padding: 20,
    gap: 22,
    paddingBottom: 40,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#21262d',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#238636',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#e6edf3',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#e6edf3',
  },
  userEmail: {
    fontSize: 12,
    color: '#8b949e',
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3fb950',
  },
  badgeText: {
    fontSize: 11,
    color: '#3fb950',
    fontWeight: '600',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#161b22',
    borderWidth: 1,
    borderColor: '#30363d',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#e6edf3',
  },
  metricLabel: {
    fontSize: 10,
    color: '#8b949e',
    marginTop: 3,
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#8b949e',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#6e7681',
    marginTop: -4,
  },
  routesList: {
    gap: 8,
  },
  routeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#161b22',
    borderWidth: 1,
    borderColor: '#30363d',
    borderRadius: 14,
    padding: 12,
  },
  routeIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  routeItemInfo: {
    flex: 1,
  },
  routeItemName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8b949e',
  },
  routeItemSub: {
    fontSize: 11,
    color: '#6e7681',
    marginTop: 2,
  },
  settingsGroup: {
    backgroundColor: '#161b22',
    borderWidth: 1,
    borderColor: '#30363d',
    borderRadius: 14,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  settingRowBorder: {
    borderTopWidth: 1,
    borderTopColor: '#21262d',
  },
  settingInfo: {
    flex: 1,
    paddingRight: 10,
  },
  settingTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#e6edf3',
  },
  settingDesc: {
    fontSize: 11,
    color: '#8b949e',
    marginTop: 2,
  },
  historyList: {
    backgroundColor: '#161b22',
    borderWidth: 1,
    borderColor: '#30363d',
    borderRadius: 14,
    padding: 12,
    gap: 12,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  historyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  historyInfo: {
    flex: 1,
  },
  historyLine: {
    fontSize: 12,
    fontWeight: '600',
    color: '#e6edf3',
  },
  historyCrowd: {
    fontSize: 11,
    color: '#8b949e',
  },
  historyTime: {
    fontSize: 10,
    color: '#6e7681',
  },
});
