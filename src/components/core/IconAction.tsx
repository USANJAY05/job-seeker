import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { AppIcon, type IconName } from './AppIcon';
export function IconAction({ icon, label, onPress, disabled = false }: { icon: IconName; label: string; onPress: () => void; disabled?: boolean }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ disabled }} disabled={disabled} onPress={onPress} hitSlop={4} style={({ pressed }) => [styles.action, (pressed || disabled) && styles.dimmed]}><AppIcon name={icon} /></Pressable>;
}
const styles = StyleSheet.create({ action: { minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' }, dimmed: { opacity: 0.5 } });
