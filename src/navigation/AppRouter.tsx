import React, { useMemo } from 'react';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { useAppTheme } from '../theme';
import { LibraryNavigator, type LibraryNavigatorProps } from './LibraryNavigator';

/** Root router; use LibraryNavigator directly if the host already has a container. */
export function AppRouter(props: LibraryNavigatorProps) {
  const { mode, colors } = useAppTheme();
  const theme = useMemo(() => {
    const base = mode === 'dark' ? DarkTheme : DefaultTheme;
    return { ...base, colors: { ...base.colors, primary: colors.primary, background: colors.background, card: colors.surface, text: colors.text, border: colors.border, notification: colors.error } };
  }, [mode, colors]);
  return <NavigationContainer theme={theme}><LibraryNavigator {...props} /></NavigationContainer>;
}
