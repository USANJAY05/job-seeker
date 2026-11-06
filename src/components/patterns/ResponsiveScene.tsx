import React from 'react';
import { Platform, useWindowDimensions, View } from 'react-native';
import { useAppTheme } from '../../theme';

/** Gives tab screens a desktop navigation gutter and keeps very wide content readable. */
export function ResponsiveScene({ children, sidebarCollapsed = false }: { children: React.ReactNode; sidebarCollapsed?: boolean }) {
  const { width } = useWindowDimensions();
  const { colors } = useAppTheme();
  const desktop = Platform.OS === 'web' && width >= 1024;
  const maxWidth = width >= 1600 ? 1440 : 1200;
  return <View style={{ flex: 1, minWidth: 0, paddingLeft: desktop ? (sidebarCollapsed ? 72 : 248) : 0, backgroundColor: colors.background }}>
    <View style={{ flex: 1, minWidth: 0, width: '100%', maxWidth, alignSelf: 'center' }}>{children}</View>
  </View>;
}
