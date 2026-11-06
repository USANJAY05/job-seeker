import React from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useAppTheme, type AppColors, radii } from '../../theme';
import { AppIcon } from '../core';
export function SearchBar({ value, onChangeText, placeholder = 'Search', onFilterPress }: { value: string; onChangeText: (value: string) => void; placeholder?: string; onFilterPress?: () => void }) {
  const { colors } = useAppTheme();
  const styles = makeStyles(colors);
  return <View style={styles.row}><View style={styles.inputWrap}><AppIcon name="magnify" size={20} color={colors.subtle} /><TextInput accessibilityLabel={placeholder} value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={colors.subtle} style={styles.input} /></View>{onFilterPress && <Pressable accessibilityRole="button" accessibilityLabel="Filters" onPress={onFilterPress} style={styles.filter}><AppIcon name="filter-outline" /></Pressable>}</View>;
}
const makeStyles = (colors: AppColors) => StyleSheet.create({ row: { flexDirection: 'row', gap: 8 }, inputWrap: { flex: 1, minHeight: 40, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, backgroundColor: colors.surface, borderColor: colors.border + '55', borderWidth: 1, borderRadius: radii.lg }, input: { flex: 1, color: colors.text, fontSize: 12, padding: 0 }, filter: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border + '55', borderRadius: radii.lg } });
