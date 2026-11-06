import React from 'react';
import { ScrollView, StyleSheet, Text, View, type TextInputProps } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import { FormField, IconAction } from '../components/core';
import { useAppTheme, type AppColors } from '../theme';

export type SettingsScreenProps = { onBack: () => void; onAction: (action: string) => void };
export function SettingsScreenShell({ title, subtitle, onBack, children, headerAction }: { title: string; subtitle?: string; onBack?: () => void; children: React.ReactNode; headerAction?: React.ReactNode }) {
  const { colors } = useAppTheme(); const insets = useSafeAreaInsets(); const s = styles(colors);
  return <SafeAreaView edges={['top']} style={s.screen}><View style={s.header}>{onBack && <IconAction icon="arrow-left" label="Go back" onPress={onBack} />}<View style={s.grow}><Text accessibilityRole="header" style={s.title}>{title}</Text>{subtitle && <Text style={s.muted}>{subtitle}</Text>}</View>{headerAction}</View><ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={[s.content, { paddingBottom: 24 + (Platform.OS === 'ios' ? insets.bottom + 64 : 0) }]}>{children}</ScrollView></SafeAreaView>;
}
export function SettingsField({ label, ...props }: TextInputProps & { label: string }) {
  return <FormField {...props} label={label} />;
}
export function SettingsText({ children }: { children: React.ReactNode }) { const { colors } = useAppTheme(); return <Text style={{ color: colors.muted, fontSize: 12, lineHeight: 18 }}>{children}</Text>; }
export function SettingsGrid({ children }: { children: React.ReactNode }) { return <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>{children}</View>; }
const styles = (c: AppColors) => StyleSheet.create({ screen: { flex: 1, backgroundColor: c.background }, header: { minHeight: 60, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }, grow: { flex: 1 }, title: { color: c.text, fontSize: 18, fontWeight: '700' }, muted: { color: c.muted, fontSize: 11 }, content: { padding: 16, paddingBottom: 32, gap: 12 } });
