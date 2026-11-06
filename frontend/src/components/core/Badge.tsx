import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAppTheme, fonts, radii } from '../../theme';
export type BadgeTone = 'neutral' | 'primary' | 'success' | 'secondary';
export function Badge({ label, tone = 'neutral', dot = false }: { label: string; tone?: BadgeTone; dot?: boolean }) {
  const { colors } = useAppTheme();
  const color = tone === 'success' ? colors.success : tone === 'primary' ? colors.primary : tone === 'secondary' ? colors.secondary : colors.muted;
  return <View style={[styles.badge, { backgroundColor: colors.surfaceRaised, borderColor: colors.border + '66' }, tone !== 'neutral' && { borderColor: color + '66', backgroundColor: color + '18' }]}>{dot && <View style={[styles.dot, { backgroundColor: color }]} />}<Text style={[styles.text, { color }]}>{label}</Text></View>;
}
const styles = StyleSheet.create({ badge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 6, paddingVertical: 2, borderRadius: radii.sm, borderWidth: 1 }, dot: { width: 6, height: 6, borderRadius: 3 }, text: { fontSize: 10, fontFamily: fonts.mono } });
