import React from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { useAppTheme, type AppColors, fonts, radii } from '../../theme';
import { AppIcon, Badge, Card, IconAction, type IconName } from '../core';

type Tone = 'neutral' | 'primary' | 'secondary' | 'success';
export function SettingsSection({ title, subtitle, icon, badge, action, children }: { title: string; subtitle?: string; icon?: IconName; badge?: string; action?: React.ReactNode; children: React.ReactNode }) {
  const { colors } = useAppTheme(); const s = styles(colors);
  return <Card style={s.section}><View style={s.sectionHeader}>{icon && <View style={s.icon}><AppIcon name={icon} color={colors.primary} /></View>}<View style={s.grow}><Text accessibilityRole="header" style={s.title}>{title}</Text>{subtitle && <Text style={s.description}>{subtitle}</Text>}</View>{badge && <Badge label={badge} tone="primary" />}{action}</View><View style={s.body}>{children}</View></Card>;
}
export function SettingsRow({ title, description, icon, badge, tone, onPress, trailing }: { title: string; description?: string; icon?: IconName; badge?: string; tone?: Tone; onPress?: () => void; trailing?: React.ReactNode }) {
  const { colors } = useAppTheme(); const s = styles(colors);
  const content = <>{icon && <View style={s.icon}><AppIcon name={icon} color={colors.primary} /></View>}<View style={s.grow}><Text style={s.rowTitle}>{title}</Text>{description && <Text style={s.description}>{description}</Text>}</View>{badge && <Badge label={badge} tone={tone} />}{trailing}{onPress && <AppIcon name="chevron-right" color={colors.subtle} />}</>;
  return onPress ? <Pressable accessibilityRole="button" onPress={onPress} style={s.row}>{content}</Pressable> : <View style={s.row}>{content}</View>;
}
export function SettingsToggle({ title, description, icon, value, onValueChange, disabled }: { title: string; description?: string; icon?: IconName; value: boolean; onValueChange: (value: boolean) => void; disabled?: boolean }) {
  const { colors } = useAppTheme();
  return <SettingsRow title={title} description={description} icon={icon} trailing={<Switch accessibilityLabel={title} value={value} onValueChange={onValueChange} disabled={disabled} trackColor={{ false: colors.border, true: colors.primaryStrong }} thumbColor={colors.white} />} />;
}
export type ChoiceItem = { id: string; title: string; description?: string; badge?: string };
export function ChoiceList({ items, selectedId, onSelect }: { items: ChoiceItem[]; selectedId: string; onSelect: (id: string) => void }) {
  const { colors } = useAppTheme(); const s = styles(colors);
  return <View accessibilityRole="radiogroup" style={s.list}>{items.map(item => <Pressable key={item.id} accessibilityRole="radio" accessibilityState={{ checked: item.id === selectedId }} onPress={() => onSelect(item.id)} style={[s.choice, item.id === selectedId && s.choiceSelected]}><AppIcon name={item.id === selectedId ? 'radiobox-marked' : 'radiobox-blank'} color={item.id === selectedId ? colors.primary : colors.subtle} /><View style={s.grow}><Text style={s.rowTitle}>{item.title}</Text>{item.description && <Text style={s.description}>{item.description}</Text>}</View>{item.badge && <Badge label={item.badge} />}</Pressable>)}</View>;
}
export function NumberStepper({ label, value, min, max, step = 1, onChange }: { label: string; value: number; min: number; max: number; step?: number; onChange: (value: number) => void }) {
  const { colors } = useAppTheme(); const s = styles(colors);
  return <View style={s.row}><Text style={[s.rowTitle, s.grow]}>{label}</Text><IconAction icon="minus" label={`Decrease ${label}`} onPress={() => { if (step > 0 && value > min) onChange(Math.max(min, value - step)); }} /><Text accessibilityLabel={`${label}: ${value}`} style={s.value}>{value}</Text><IconAction icon="plus" label={`Increase ${label}`} onPress={() => { if (step > 0 && value < max) onChange(Math.min(max, value + step)); }} /></View>;
}
export function ProgressMeter({ label, value, maximum = 100, detail }: { label: string; value: number; maximum?: number; detail?: string }) {
  const { colors } = useAppTheme(); const s = styles(colors); const ratio = maximum > 0 && Number.isFinite(value) && Number.isFinite(maximum) ? Math.max(0, Math.min(1, value / maximum)) : 0;
  return <View style={s.list}><View style={s.row}><Text style={[s.rowTitle, s.grow]}>{label}</Text><Text style={s.value}>{detail ?? `${value} / ${maximum}`}</Text></View><View accessibilityRole="progressbar" accessibilityLabel={label} accessibilityValue={{ min: 0, max: 100, now: Math.round(ratio * 100) }} style={s.track}><View style={[s.fill, { width: `${ratio * 100}%` }]} /></View></View>;
}
/** A controlled, touch-adjustable range with accessibility increment/decrement actions. */
export function RangeControl({ label, value, min, max, step = 1, onChange, detail }: { label: string; value: number; min: number; max: number; step?: number; onChange: (value: number) => void; detail?: string }) {
  const { colors } = useAppTheme(); const s = styles(colors);
  const [width, setWidth] = React.useState(0);
  const valid = Number.isFinite(min) && Number.isFinite(max) && Number.isFinite(value) && Number.isFinite(step) && max > min && step > 0;
  const current = valid ? Math.max(min, Math.min(max, value)) : min;
  const ratio = valid ? (current - min) / (max - min) : 0;
  const setValue = (raw: number) => { if (valid) { const rounded = min + Math.round((raw - min) / step) * step; onChange(Math.max(min, Math.min(max, rounded))); } };
  return <View style={s.list}><View style={s.row}><Text style={[s.rowTitle, s.grow]}>{label}</Text><Text style={s.value}>{detail ?? String(value)}</Text></View><Pressable accessibilityRole="adjustable" accessibilityLabel={label} accessibilityState={{ disabled: !valid }} accessibilityValue={valid ? { min, max, now: current } : undefined} accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]} onAccessibilityAction={event => { if (event.nativeEvent.actionName === 'increment') setValue(current + step); if (event.nativeEvent.actionName === 'decrement') setValue(current - step); }} onLayout={event => setWidth(event.nativeEvent.layout.width)} onPress={event => { if (width > 0 && valid) setValue(min + Math.max(0, Math.min(1, event.nativeEvent.locationX / width)) * (max - min)); }} style={s.rangeHit}><View style={s.track}><View style={[s.fill, { width: `${ratio * 100}%` }]} /></View></Pressable></View>;
}
const styles = (c: AppColors) => StyleSheet.create({ section: { padding: 0, overflow: 'hidden' }, sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12 }, body: { padding: 12, paddingTop: 0, gap: 8 }, icon: { width: 36, height: 36, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center', backgroundColor: c.surfaceRaised }, grow: { flex: 1, minWidth: 0 }, title: { color: c.text, fontSize: 16, fontWeight: '600' }, rowTitle: { color: c.text, fontSize: 13, fontWeight: '600' }, description: { color: c.muted, fontSize: 12, lineHeight: 17, marginTop: 2 }, row: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 6 }, list: { gap: 6 }, choice: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 10, backgroundColor: c.surfaceLowest, borderRadius: radii.md, borderWidth: 1, borderColor: c.border + '55' }, choiceSelected: { borderColor: c.primary, backgroundColor: c.selection }, value: { color: c.primary, fontFamily: fonts.mono, fontSize: 12 }, rangeHit: { minHeight: 44, justifyContent: 'center' }, track: { height: 6, borderRadius: 3, backgroundColor: c.surfaceRaised, overflow: 'hidden' }, fill: { height: '100%', backgroundColor: c.primaryStrong } });
