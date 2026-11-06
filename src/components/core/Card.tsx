import React from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';
import { useAppTheme, radii } from '../../theme';

/** Shared themed surface; callers may override spacing or borders through style. */
export function Card({ style, ...props }: ViewProps) {
  const { colors } = useAppTheme();
  return <View {...props} style={[styles.card, { backgroundColor: colors.surface }, style]} />;
}
const styles = StyleSheet.create({ card: { borderRadius: radii.lg, padding: 12 } });
