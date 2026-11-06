import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { useAppTheme, type AppColors, radii } from '../../theme';
import { AppIcon, NativeButton, type IconName } from '../core';

/** The host positions this action above its navigation and safe area. */
export function FloatingAction({ label, icon, onPress, tone = 'primary', expanded }: { label: string; icon: IconName; onPress: () => void; tone?: 'primary' | 'success'; expanded?: boolean }) {
  const { colors } = useAppTheme();
  const styles = makeStyles(colors);
  const foreground = tone === 'success' ? colors.onSuccess : colors.onStrong;
  return <NativeButton accessibilityLabel={label} accessibilityState={expanded === undefined ? undefined : { expanded }} onPress={onPress} style={[styles.button, tone === 'success' && styles.success]}><AppIcon name={icon} size={20} color={foreground} /><Text style={[styles.text, { color: foreground }]}>{label}</Text></NativeButton>;
}
const makeStyles = (colors: AppColors) => StyleSheet.create({ button: { minHeight: 48, paddingHorizontal: 16, borderRadius: radii.pill, backgroundColor: colors.primaryStrong, flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'flex-end' }, success: { backgroundColor: colors.success }, text: { fontSize: 12, fontWeight: '700' } });
