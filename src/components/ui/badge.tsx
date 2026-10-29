import React from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';

interface BadgeProps {
  label: string;
  variant?: 'live' | 'neutral' | 'warning' | 'info' | 'success';
  showDot?: boolean;
  style?: ViewStyle;
}

export function Badge({ label, variant = 'neutral', showDot = false, style }: BadgeProps) {
  const getColors = () => {
    switch (variant) {
      case 'live':
      case 'success':
        return {
          bg: 'rgba(34, 197, 94, 0.15)',
          border: 'rgba(34, 197, 94, 0.35)',
          text: '#4ADE80',
          dot: '#22C55E',
        };
      case 'warning':
        return {
          bg: 'rgba(245, 158, 11, 0.15)',
          border: 'rgba(245, 158, 11, 0.35)',
          text: '#FBBF24',
          dot: '#F59E0B',
        };
      case 'info':
        return {
          bg: 'rgba(56, 189, 248, 0.15)',
          border: 'rgba(56, 189, 248, 0.35)',
          text: '#38BDF8',
          dot: '#0284C7',
        };
      case 'neutral':
      default:
        return {
          bg: 'rgba(255, 255, 255, 0.08)',
          border: 'rgba(255, 255, 255, 0.12)',
          text: '#CBD5E1',
          dot: '#94A3B8',
        };
    }
  };

  const colors = getColors();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.bg, borderColor: colors.border },
        style,
      ]}
    >
      {showDot && <View style={[styles.dot, { backgroundColor: colors.dot }]} />}
      <Text style={[styles.text, { color: colors.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});
