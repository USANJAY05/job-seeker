import React from 'react';
import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';
import { useAppTheme, radii } from '../../theme';
import { AppIcon, type IconName } from './AppIcon';
export function SmallButton({ label, icon, onPress, primary, variant = 'default', style, disabled = false }: { label: string; icon: IconName; onPress: () => void; primary?: boolean; variant?: 'default' | 'primary' | 'lightPrimary'; style?: StyleProp<ViewStyle>; disabled?: boolean }) {
  const { colors } = useAppTheme();
  const strong = primary || variant === 'primary';
  const background = variant === 'lightPrimary' ? colors.primaryContainer : strong ? colors.primaryStrong : colors.surfaceRaised;
  const foreground = variant === 'lightPrimary' ? colors.onPrimaryContainer : strong ? colors.onStrong : colors.muted;
  return <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ disabled }} disabled={disabled} onPress={onPress} style={({ pressed }) => [styles.button, { backgroundColor: background, borderColor: strong || variant === 'lightPrimary' ? background : colors.border + '80' }, (pressed || disabled) && styles.dimmed, style]}><AppIcon name={icon} size={13} color={foreground} /><Text style={[styles.text, { color: foreground }]}>{label}</Text></Pressable>;
}
const styles = StyleSheet.create({ button: { minHeight: 36, paddingHorizontal: 8, borderRadius: radii.md, borderWidth: 1, flexDirection: 'row', gap: 4, alignItems: 'center', justifyContent: 'center' }, text: { fontSize: 11, fontWeight: '600' }, dimmed: { opacity: 0.5 } });
