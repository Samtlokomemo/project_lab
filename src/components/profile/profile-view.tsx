import { Route } from '@/data/routes';
import { authService, UserProfile, UserReportHistory } from '@/database/auth-service';
import { auth } from '@/database/firebase';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ProfileViewProps {
  routes: Route[];
  favoriteRouteId: string;
  onSelectFavoriteRoute: (routeId: string) => void;
  onLogout: () => void;
}

export function ProfileView({
  routes,
  favoriteRouteId,
  onSelectFavoriteRoute,
  onLogout,
}: ProfileViewProps) {
  const insets = useSafeAreaInsets();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [history, setHistory] = useState<UserReportHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [notifyReports, setNotifyReports] = useState(true);
  const [notifyDepartures, setNotifyDepartures] = useState(true);

  useEffect(() => {
    async function loadUserData() {
      try {
        const user = auth.currentUser;
        if (user) {
          const userProfile = await authService.getCurrentUser();
          setProfile(userProfile);

          try {
            const reportHistory = await authService.getReportHistory();
            setHistory(reportHistory);
          } catch {
            // Se o histórico ainda não tiver coleções, segue com lista vazia
            setHistory([]);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
      } finally {
        setLoading(false);
      }
    }

    loadUserData();
  }, []);

  // Extrai as iniciais do nome para o avatar
  const displayName = profile?.name || auth.currentUser?.displayName || 'Estudante';
  const displayEmail = profile?.email || auth.currentUser?.email || '';
  const university = profile?.university || 'UFAL';
  const campus = profile?.campus || 'Campus A.C. Simões';
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('') || 'UN';

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>

          <View style={styles.userInfo}>
            <Text style={styles.userName}>{displayName}</Text>
            <Text style={styles.userEmail}>{displayEmail}</Text>

            <View style={styles.badgeRow}>
              <View style={styles.statusDot} />
              <Text style={styles.badgeText}>
                Estudante · {university} {campus ? `(${campus})` : ''}
              </Text>
            </View>
          </View>
        </View>

        {/* Contribution Metrics */}
        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{history.length}</Text>
            <Text style={styles.metricLabel}>Relatos feitos</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={[styles.metricValue, { color: '#22C55E' }]}>
              {profile?.points ?? history.length * 5} pts
            </Text>
            <Text style={styles.metricLabel}>Colaboração</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>
              Nível {Math.max(1, Math.floor((profile?.points ?? history.length * 5) / 20) + 1)}
            </Text>
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
                  onPress={() => {
                    onSelectFavoriteRoute(route.id);
                    authService.updateFavoriteRoute(route.id).catch(console.error);
                  }}
                  style={[
                    styles.routeItem,
                    isFav && {
                      borderColor: route.color,
                      backgroundColor: `${route.color}15`,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.routeIconBox,
                      { backgroundColor: `${route.color}25` },
                    ]}
                  >
                    <Ionicons name="bus" size={18} color={route.color} />
                  </View>

                  <View style={styles.routeItemInfo}>
                    <Text
                      style={[
                        styles.routeItemName,
                        isFav && {
                          color: '#e6edf3',
                          fontWeight: '700',
                        },
                      ]}
                    >
                      {route.name}
                    </Text>

                    <Text style={styles.routeItemSub}>
                      {route.origin} ➔ {route.destination}
                    </Text>
                  </View>

                  {isFav && (
                    <Ionicons
                      name="checkmark-circle"
                      size={22}
                      color={route.color}
                    />
                  )}
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
                <Text style={styles.settingTitle}>
                  Novos relatos em tempo real
                </Text>

                <Text style={styles.settingDesc}>
                  Avisar quando houver reporte na minha linha
                </Text>
              </View>

              <Switch
                value={notifyReports}
                onValueChange={setNotifyReports}
                thumbColor={notifyReports ? '#22C55E' : '#8b949e'}
                trackColor={{
                  false: '#21262d',
                  true: '#22C55E40',
                }}
              />
            </View>

            <View style={[styles.settingRow, styles.settingRowBorder]}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>
                  Lembrete de partida
                </Text>

                <Text style={styles.settingDesc}>
                  Notificar 15 min antes da saída do ônibus
                </Text>
              </View>

              <Switch
                value={notifyDepartures}
                onValueChange={setNotifyDepartures}
                thumbColor={notifyDepartures ? '#22C55E' : '#8b949e'}
                trackColor={{
                  false: '#21262d',
                  true: '#22C55E40',
                }}
              />
            </View>
          </View>
        </View>

        {/* Recent Contributions History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Histórico de Contribuições
          </Text>

          {history.length > 0 ? (
            <View style={styles.historyList}>
              {history.map((h, i) => (
                <View key={i} style={styles.historyItem}>
                  <View
                    style={[
                      styles.historyDot,
                      { backgroundColor: '#22C55E' },
                    ]}
                  />

                  <View style={styles.historyInfo}>
                    <Text style={styles.historyLine}>
                      {h.line} · {h.stop}
                    </Text>

                    <Text style={styles.historyCrowd}>
                      Lotação: {h.crowdLevel}%
                    </Text>
                  </View>

                  <Text style={styles.historyTime}>{h.time}</Text>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyHistoryBox}>
              <Ionicons name="chatbubbles-outline" size={24} color="#64748B" />
              <Text style={styles.emptyHistoryText}>
                Nenhum relato enviado ainda. Seus relatos de ônibus aparecerão aqui!
              </Text>
            </View>
          )}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={onLogout}
          activeOpacity={0.8}
        >
          <Ionicons
            name="log-out-outline"
            size={20}
            color="#f85149"
          />
          <Text style={styles.logoutButtonText}>
            Sair da conta
          </Text>
        </TouchableOpacity>
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
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(34, 197, 94, 0.18)',
    borderWidth: 1.5,
    borderColor: '#22C55E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#22C55E',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  userEmail: {
    fontSize: 12,
    color: '#94A3B8',
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
    backgroundColor: '#22C55E',
  },
  badgeText: {
    fontSize: 11,
    color: '#22C55E',
    fontWeight: '600',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#131A29',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  metricLabel: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 3,
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: -4,
  },
  routesList: {
    gap: 8,
  },
  routeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#131A29',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
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
    color: '#94A3B8',
  },
  routeItemSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  settingsGroup: {
    backgroundColor: '#131A29',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
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
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  settingInfo: {
    flex: 1,
    paddingRight: 10,
  },
  settingTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#F8FAFC',
  },
  settingDesc: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  historyList: {
    backgroundColor: '#131A29',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 14,
    padding: 12,
    gap: 12,
  },
  emptyHistoryBox: {
    backgroundColor: '#131A29',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
    gap: 8,
  },
  emptyHistoryText: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 18,
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
    color: '#F8FAFC',
  },
  historyCrowd: {
    fontSize: 11,
    color: '#94A3B8',
  },
  historyTime: {
    fontSize: 10,
    color: '#64748B',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#f8514915',
    borderWidth: 1,
    borderColor: '#f8514960',
    borderRadius: 14,
    padding: 15,
    marginTop: 5,
  },
  logoutButtonText: {
    color: '#f85149',
    fontSize: 14,
    fontWeight: '700',
  },
});
