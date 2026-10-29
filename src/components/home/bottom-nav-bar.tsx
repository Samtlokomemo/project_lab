import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export type NavTabId = 'map' | 'routes' | 'schedules' | 'profile';

interface NavItem {
  id: NavTabId;
  label: string;
  iconName: keyof typeof Ionicons.glyphMap;
  outlineIconName: keyof typeof Ionicons.glyphMap;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'map', label: 'Mapa', iconName: 'map', outlineIconName: 'map-outline' },
  { id: 'routes', label: 'Linhas', iconName: 'git-network', outlineIconName: 'git-network-outline' },
  { id: 'schedules', label: 'Horários', iconName: 'time', outlineIconName: 'time-outline' },
  { id: 'profile', label: 'Perfil', iconName: 'person', outlineIconName: 'person-outline' },
];

interface BottomNavBarProps {
  activeTab: NavTabId;
  onChangeTab: (tab: NavTabId) => void;
}

export function BottomNavBar({ activeTab, onChangeTab }: BottomNavBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      {NAV_ITEMS.map((item) => {
        const isActive = activeTab === item.id;
        const iconColor = isActive ? '#22C55E' : '#64748B';
        const textColor = isActive ? '#22C55E' : '#64748B';

        return (
          <TouchableOpacity
            key={item.id}
            onPress={() => onChangeTab(item.id)}
            style={styles.tabItem}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isActive ? item.iconName : item.outlineIconName}
              size={22}
              color={iconColor}
            />
            <Text style={[styles.tabLabel, { color: textColor }]}>{item.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#090D16',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    minWidth: 64,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
});
