/**
 * Design system tokens and theme colors for the Transportation App.
 * Built for high fidelity matching with Figma wireframes and university branding.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#0F172A',
    textSecondary: '#64748B',
    textDim: '#94A3B8',
    background: '#F8FAFC',
    backgroundElement: '#F1F5F9',
    backgroundSelected: '#E2E8F0',
    card: '#FFFFFF',
    cardSecondary: '#F8FAFC',
    border: 'rgba(0, 0, 0, 0.08)',
    borderHover: 'rgba(0, 0, 0, 0.16)',
    primary: '#16A34A',
    primaryBackground: 'rgba(22, 163, 74, 0.12)',
    primaryBorder: 'rgba(22, 163, 74, 0.3)',
    blue: '#0284C7',
    blueBackground: 'rgba(2, 132, 199, 0.12)',
    yellow: '#D97706',
    yellowBackground: 'rgba(217, 119, 6, 0.12)',
    purple: '#9333EA',
    purpleBackground: 'rgba(147, 51, 234, 0.12)',
  },
  dark: {
    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    textDim: '#64748B',
    background: '#0B0F19',
    backgroundElement: '#131A29',
    backgroundSelected: '#1E293B',
    card: '#131A29',
    cardSecondary: '#182236',
    border: 'rgba(255, 255, 255, 0.08)',
    borderHover: 'rgba(255, 255, 255, 0.16)',
    primary: '#22C55E',
    primaryBackground: 'rgba(34, 197, 94, 0.16)',
    primaryBorder: 'rgba(34, 197, 94, 0.4)',
    blue: '#38BDF8',
    blueBackground: 'rgba(56, 189, 248, 0.16)',
    yellow: '#F59E0B',
    yellowBackground: 'rgba(245, 158, 11, 0.16)',
    purple: '#C084FC',
    purpleBackground: 'rgba(192, 132, 252, 0.16)',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 12,
  four: 16,
  five: 20,
  six: 24,
  seven: 32,
} as const;

export const BottomTabInset = Platform.select({ ios: 40, android: 20 }) ?? 0;
export const MaxContentWidth = 800;
