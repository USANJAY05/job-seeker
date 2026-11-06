import React from 'react';
import { Icon } from 'react-native-paper';
import { useAppTheme } from '../../theme';
export type IconName = string;
export function AppIcon({ name, size = 18, color }: { name: IconName; size?: number; color?: string }) {
  const { colors } = useAppTheme();
  return <Icon source={name} size={size} color={color ?? colors.muted} />;
}
