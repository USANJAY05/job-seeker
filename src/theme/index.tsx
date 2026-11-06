import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from 'react-native-paper';

export type AppColors = {
  background: string; surface: string; surfaceRaised: string; surfaceLowest: string;
  border: string; text: string; muted: string; subtle: string; primary: string;
  primaryStrong: string; secondary: string; success: string; error: string; white: string;
  onStrong: string; onSuccess: string; primaryContainer: string; onPrimaryContainer: string;
  selection: string; selectionBorder: string; highlightSurface: string;
};
export const darkColors: AppColors = {
  background: '#0f131c', surface: '#181b25', surfaceRaised: '#262a34', surfaceLowest: '#0a0e17',
  border: '#464554', text: '#dfe2ef', muted: '#c7c4d7', subtle: '#aaa8ba', primary: '#c0c1ff',
  primaryStrong: '#4f46e5', secondary: '#bdc2ff', success: '#4edea3', error: '#ffb4ab', white: '#ffffff',
  onStrong: '#ffffff', onSuccess: '#003824', primaryContainer: '#8083ff', onPrimaryContainer: '#0d0096',
  selection: '#30335d', selectionBorder: '#6366f1', highlightSurface: '#1c2232',
};
export const lightColors: AppColors = {
  background: '#f7f8ff', surface: '#ffffff', surfaceRaised: '#ebedf7', surfaceLowest: '#f0f1f8',
  border: '#777786', text: '#191b25', muted: '#484657', subtle: '#626171', primary: '#494bd6',
  primaryStrong: '#494bd6', secondary: '#5059aa', success: '#006c49', error: '#ba1a1a', white: '#ffffff',
  onStrong: '#ffffff', onSuccess: '#ffffff', primaryContainer: '#e1e0ff', onPrimaryContainer: '#171077',
  selection: '#e4e3ff', selectionBorder: '#7779de', highlightSurface: '#f0efff',
};
export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 } as const;
export const radii = { sm: 4, md: 8, lg: 12, xl: 16, pill: 999 } as const;
export const fonts = { body: 'Geist', mono: 'JetBrainsMono' } as const;
export type ThemeMode = 'light' | 'dark' | 'system';
export type AppTheme = { mode: 'light' | 'dark'; colors: AppColors };
const defaultTheme: AppTheme = { mode: 'dark', colors: darkColors };
const ThemeContext = createContext<AppTheme>(defaultTheme);
export function useAppTheme(): AppTheme { return useContext(ThemeContext); }

/** All color values must be six-digit hex strings; components use alpha suffixes for borders. */
export function JobBuddyThemeProvider({ children, mode = 'system', colors }: { children: React.ReactNode; mode?: ThemeMode; colors?: Partial<AppColors> }) {
  const system = useColorScheme();
  const resolvedMode = mode === 'system' ? (system === 'light' ? 'light' : 'dark') : mode;
  const theme = useMemo<AppTheme>(() => ({ mode: resolvedMode, colors: { ...(resolvedMode === 'light' ? lightColors : darkColors), ...colors } }), [resolvedMode, colors]);
  const paperTheme = useMemo(() => {
    const base = resolvedMode === 'light' ? MD3LightTheme : MD3DarkTheme;
    const c = theme.colors;
    return { ...base, colors: { ...base.colors, primary: c.primary, onPrimary: c.onStrong, primaryContainer: c.primaryContainer, onPrimaryContainer: c.onPrimaryContainer, background: c.background, surface: c.surface, surfaceVariant: c.surfaceRaised, onSurface: c.text, onSurfaceVariant: c.muted, outline: c.subtle } };
  }, [resolvedMode, theme]);
  return <ThemeContext.Provider value={theme}><PaperProvider theme={paperTheme}>{children}</PaperProvider></ThemeContext.Provider>;
}
/** Backwards-compatible dark palette and Paper theme; prefer the provider and useAppTheme. */
export const colors = darkColors;
export const jobBuddyTheme = { ...MD3DarkTheme, colors: { ...MD3DarkTheme.colors, primary: darkColors.primary, background: darkColors.background, surface: darkColors.surface, onSurface: darkColors.text, outline: darkColors.subtle } };
