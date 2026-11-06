import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAppTheme, fonts, radii } from '../../theme';
import { AppIcon, type IconName } from './AppIcon';
export function Chip({ label, selected = false, onPress, count, icon, color, variant = 'outlined' }: { label: string; selected?: boolean; onPress: () => void; count?: number; icon?: IconName; color?: string; variant?: 'outlined' | 'pill' }) {
  const { colors } = useAppTheme();
  const textColor = selected ? (variant === 'pill' ? colors.onPrimaryContainer : colors.primary) : colors.muted;
  const background = selected ? (variant === 'pill' ? colors.primaryContainer : colors.selection) : colors.surface;
  return <Pressable accessibilityRole="button" accessibilityState={{ selected }} onPress={onPress} style={[styles.chip, { backgroundColor: background, borderColor: selected ? (variant === 'pill' ? colors.primaryContainer : colors.selectionBorder) : colors.border + '55' }, variant === 'pill' && styles.pill]}>{icon ? <AppIcon name={icon} size={14} color={color ?? textColor} /> : color ? <View style={[styles.dot, { backgroundColor: color }]} /> : null}<Text style={[styles.text, { color: textColor }]}>{label}</Text>{count != null && <Text style={[styles.count, { color: selected ? textColor : colors.subtle }]}>{variant === 'pill' ? `(${count})` : count}</Text>}</Pressable>;
}
const styles = StyleSheet.create({ chip: { minHeight: 36, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: radii.md, borderWidth: 1 }, pill: { borderRadius: radii.pill }, dot: { width: 6, height: 6, borderRadius: 3 }, text: { fontFamily: fonts.mono, fontSize: 10 }, count: { fontFamily: fonts.mono, fontSize: 10 } });
