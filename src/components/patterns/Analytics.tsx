import React from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions, type StyleProp, type ViewStyle } from 'react-native';
import { AppIcon, Card, type IconName } from '../core';
import { useAppTheme, type AppColors, radii } from '../../theme';

export type AnalyticsMetric = { label: string; value: string; detail?: string; icon: IconName };
export function AnalyticsTile({ metric, onPress }: { metric: AnalyticsMetric; onPress?: () => void }) {
  const { colors } = useAppTheme(); const s = styles(colors);
  const { width } = useWindowDimensions();
  const content = <><View style={s.tileHeader}><View style={s.icon}><AppIcon name={metric.icon} size={18} color={colors.primary} /></View>{onPress && <AppIcon name="arrow-top-right" size={16} color={colors.subtle} />}</View><Text style={s.value}>{metric.value}</Text><Text style={s.label}>{metric.label}</Text>{metric.detail && <Text style={s.detail}>{metric.detail}</Text>}</>;
  const tileStyle = [s.tile, width >= 1280 && { flexBasis: '22%' as const }];
  return onPress ? <Pressable accessibilityRole="button" accessibilityLabel={`${metric.label}: ${metric.value}`} onPress={onPress} style={tileStyle}>{content}</Pressable> : <View style={tileStyle}>{content}</View>;
}
export type BreakdownItem = { label: string; count: number };
export function BreakdownChart({ title, items, emptyMessage = 'No data yet.', style }: { title: string; items: BreakdownItem[]; emptyMessage?: string; style?: StyleProp<ViewStyle> }) {
  const { colors } = useAppTheme(); const s = styles(colors);
  const valid = items.filter(item => Number.isFinite(item.count) && item.count > 0); const total = valid.reduce((sum, item) => sum + item.count, 0);
  return <Card style={[s.chart, style]}><Text accessibilityRole="header" style={s.title}>{title}</Text>{total === 0 ? <Text style={s.detail}>{emptyMessage}</Text> : valid.map((item, index) => <View key={`${item.label}-${index}`} style={s.chartRow}><View style={s.row}><Text style={s.rowLabel} numberOfLines={1}>{item.label}</Text><Text style={s.count}>{item.count}</Text></View><View accessible accessibilityRole="progressbar" accessibilityLabel={`${item.label}: ${item.count} of ${total}`} accessibilityValue={{ min: 0, max: total, now: item.count }} style={s.track}><View style={[s.fill, { width: `${(item.count / total) * 100}%` }]} /></View></View>)}</Card>;
}
const styles = (c: AppColors) => StyleSheet.create({ tile: { flexGrow: 1, flexBasis: '47%', minWidth: 130, backgroundColor: c.surface, borderRadius: radii.xl, padding: 14, gap: 3 }, tileHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }, icon: { width: 34, height: 34, borderRadius: radii.md, backgroundColor: c.selection, alignItems: 'center', justifyContent: 'center' }, value: { color: c.text, fontSize: 25, fontWeight: '700' }, label: { color: c.text, fontSize: 12, fontWeight: '600' }, detail: { color: c.muted, fontSize: 11, lineHeight: 16 }, chart: { padding: 16, borderRadius: radii.xl, gap: 12 }, title: { color: c.text, fontWeight: '700', fontSize: 15 }, chartRow: { gap: 6 }, row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 }, rowLabel: { color: c.muted, fontSize: 12, flexShrink: 1 }, count: { color: c.text, fontSize: 12, fontWeight: '700' }, track: { height: 7, backgroundColor: c.surfaceRaised, borderRadius: radii.pill, overflow: 'hidden' }, fill: { height: '100%', borderRadius: radii.pill, backgroundColor: c.primaryStrong } });
