import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface RouteChipItem {
  id: string;
  name: string;
  color: string;
  activeColorBg: string;
  activeColorBorder: string;
}

interface ChipFilterProps {
  item: RouteChipItem;
  isSelected: boolean;
  onPress: () => void;
}

export function ChipFilter({ item, isSelected, onPress }: ChipFilterProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      style={[
        styles.chip,
        isSelected
          ? {
              backgroundColor: item.activeColorBg,
              borderColor: item.activeColorBorder,
            }
          : styles.inactiveChip,
      ]}
    >
      <View style={[styles.dot, { backgroundColor: item.color }]} />
      <Text
        style={[
          styles.label,
          { color: isSelected ? '#FFFFFF' : '#94A3B8' },
        ]}
      >
        {item.name}
      </Text>
      {isSelected && <View style={[styles.indicatorDot, { backgroundColor: item.color }]} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1.2,
    marginRight: 8,
    gap: 8,
  },
  inactiveChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  indicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    opacity: 0.8,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
});
