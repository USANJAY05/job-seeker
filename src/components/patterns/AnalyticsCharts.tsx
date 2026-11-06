import React from 'react';
import { ScrollView, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, Line, Path, Polyline, Rect, Text as SvgText } from 'react-native-svg';
import { Card } from '../core';
import { useAppTheme, type AppColors, radii } from '../../theme';
import type { BreakdownItem } from './Analytics';

function palette(c: AppColors) { return [c.primaryStrong, c.success, c.secondary, c.muted, c.selectionBorder]; }
export function VerticalBarChart({ title, items, emptyMessage = 'No data yet.', style }: { title: string; items: BreakdownItem[]; emptyMessage?: string; style?: StyleProp<ViewStyle> }) {
  const { colors } = useAppTheme(); const s = styles(colors);
  const valid = items.filter(item => Number.isFinite(item.count) && item.count > 0);
  if (!valid.length) return <Card style={[s.card, style]}><Text accessibilityRole="header" style={s.title}>{title}</Text><Text style={s.muted}>{emptyMessage}</Text></Card>;
  const max = Math.max(...valid.map(item => item.count), 1); const width = Math.max(280, valid.length * 68); const height = 180;
  const left = 28; const right = 10; const top = 14; const bottom = 38; const plotHeight = height - top - bottom; const plotWidth = width - left - right;
  const ticks = Array.from(new Set([0, Math.ceil(max / 2), max])); const barWidth = Math.min(34, plotWidth / valid.length * 0.55);
  return <Card style={[s.card, style]}><Text accessibilityRole="header" style={s.title}>{title}</Text><ScrollView horizontal showsHorizontalScrollIndicator={false}><View accessible accessibilityLabel={`${title}. ${valid.map(item => `${item.label}: ${item.count}`).join(', ')}.`}><Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
    {ticks.map(tick => { const y = top + plotHeight - tick / max * plotHeight; return <React.Fragment key={tick}><Line x1={left} y1={y} x2={width - right} y2={y} stroke={colors.border} strokeWidth={0.7} /><SvgText x={left - 5} y={y + 3} fill={colors.muted} fontSize={9} textAnchor="end">{tick}</SvgText></React.Fragment>; })}
    {valid.map((item, index) => { const slot = plotWidth / valid.length; const x = left + slot * index + (slot - barWidth) / 2; const barHeight = item.count / max * plotHeight; const label = item.label.length > 9 ? `${item.label.slice(0, 8)}…` : item.label; return <React.Fragment key={`${item.label}-${index}`}><Rect x={x} y={top + plotHeight - barHeight} width={barWidth} height={Math.max(2, barHeight)} rx={5} fill={palette(colors)[index % palette(colors).length]} /><SvgText x={x + barWidth / 2} y={top + plotHeight - barHeight - 5} fill={colors.text} fontSize={10} textAnchor="middle">{item.count}</SvgText><SvgText x={x + barWidth / 2} y={height - 12} fill={colors.muted} fontSize={9} textAnchor="middle">{label}</SvgText></React.Fragment>; })}
  </Svg></View></ScrollView></Card>;
}

export type StackedBarRow = { label: string; segments: BreakdownItem[] };
export function StackedBarChart({ title, rows, emptyMessage = 'Add data to compare status mix.', style }: { title: string; rows: StackedBarRow[]; emptyMessage?: string; style?: StyleProp<ViewStyle> }) {
  const { colors } = useAppTheme(); const s = styles(colors); const chartColors = palette(colors);
  const labels = Array.from(new Set(rows.flatMap(row => row.segments.filter(segment => segment.count > 0).map(segment => segment.label))));
  const total = (row: StackedBarRow) => row.segments.reduce((sum, segment) => sum + (Number.isFinite(segment.count) && segment.count > 0 ? segment.count : 0), 0);
  return <Card style={[s.card, style]}><Text accessibilityRole="header" style={s.title}>{title}</Text>{!labels.length ? <Text style={s.muted}>{emptyMessage}</Text> : <>
    <View style={s.stackedRows}>{rows.map(row => { const rowTotal = total(row); return <View key={row.label} style={s.stackedRow}>
      <View style={s.stackedLabelLine}><Text style={s.stackedLabel}>{row.label}</Text><Text style={s.count}>{rowTotal}</Text></View>
      <View accessible accessibilityRole="progressbar" accessibilityLabel={`${row.label} status mix`} accessibilityValue={{ min: 0, max: rowTotal, now: rowTotal }} style={s.stackedTrack}>{rowTotal > 0 && labels.map((label, index) => { const count = row.segments.find(segment => segment.label === label)?.count ?? 0; if (!(count > 0)) return null; return <View key={label} accessibilityLabel={`${label}: ${count}`} style={{ width: `${count / rowTotal * 100}%`, backgroundColor: chartColors[index % chartColors.length] }} />; })}</View>
    </View>; })}</View>
    <View style={s.stackedLegend}>{labels.map((label, index) => <View key={label} style={s.stackedLegendItem}><View style={[s.dot, { backgroundColor: chartColors[index % chartColors.length] }]} /><Text style={s.legendLabel}>{label}</Text></View>)}</View>
  </>}</Card>;
}
function pieSlice(start: number, end: number) {
  const point = (angle: number) => ({ x: 50 + 42 * Math.cos(angle), y: 50 + 42 * Math.sin(angle) });
  const a = point(start), b = point(end);
  return `M 50 50 L ${a.x} ${a.y} A 42 42 0 ${end - start > Math.PI ? 1 : 0} 1 ${b.x} ${b.y} Z`;
}
export function DistributionChart({ title, items, variant, emptyMessage = 'No data yet.', style }: { title: string; items: BreakdownItem[]; variant: 'pie' | 'donut'; emptyMessage?: string; style?: StyleProp<ViewStyle> }) {
  const { colors } = useAppTheme(); const s = styles(colors);
  const valid = items.filter(item => Number.isFinite(item.count) && item.count > 0); const total = valid.reduce((sum, item) => sum + item.count, 0);
  const chartColors = palette(colors); let cumulative = 0; const circumference = 2 * Math.PI * 37;
  return <Card style={[s.card, style]}><Text accessibilityRole="header" style={s.title}>{title}</Text>{total === 0 ? <Text style={s.muted}>{emptyMessage}</Text> : <View style={s.distribution}>
    <View accessible accessibilityLabel={`${title}. ${valid.map(item => `${item.label}: ${item.count}`).join(', ')}.`} style={s.figure}>
      <Svg width={132} height={132} viewBox="0 0 100 100">
        {valid.map((item, index) => {
          const start = cumulative; const ratio = item.count / total; cumulative += ratio; const color = chartColors[index % chartColors.length];
          if (variant === 'donut') return <Circle key={`${item.label}-${index}`} cx={50} cy={50} r={37} fill="none" stroke={color} strokeWidth={12} strokeDasharray={`${ratio * circumference} ${circumference}`} strokeDashoffset={-start * circumference} rotation={-90} origin="50, 50" />;
          return valid.length === 1 ? <Circle key={`${item.label}-${index}`} cx={50} cy={50} r={42} fill={color} /> : <Path key={`${item.label}-${index}`} d={pieSlice(-Math.PI / 2 + start * 2 * Math.PI, -Math.PI / 2 + cumulative * 2 * Math.PI)} fill={color} />;
        })}
      </Svg>
      {variant === 'donut' && <View pointerEvents="none" style={s.donutCenter}><Text style={s.total}>{total}</Text><Text style={s.centerLabel}>total</Text></View>}
    </View>
    <View style={s.legend}>{valid.map((item, index) => <View key={`${item.label}-${index}`} style={s.legendRow}><View style={[s.dot, { backgroundColor: chartColors[index % chartColors.length] }]} /><Text style={s.legendLabel}>{item.label}</Text><Text style={s.count}>{item.count}</Text></View>)}</View>
  </View>}</Card>;
}
export type ScorePoint = { id: string; label: string; value: number };
export function ScoreLineChart({ title, points, style }: { title: string; points: ScorePoint[]; style?: StyleProp<ViewStyle> }) {
  const { colors } = useAppTheme(); const s = styles(colors);
  const valid = points.filter(point => Number.isFinite(point.value) && point.value >= 0 && point.value <= 100);
  const width = Math.max(280, valid.length * 64); const height = 150; const left = 32; const right = 18; const top = 12; const bottom = 24;
  const coordinates = valid.map((point, index) => ({ ...point, x: valid.length === 1 ? (left + width - right) / 2 : left + index * (width - left - right) / (valid.length - 1), y: top + (100 - point.value) / 100 * (height - top - bottom) }));
  return <Card style={[s.card, style]}><Text accessibilityRole="header" style={s.title}>{title}</Text><Text style={s.muted}>Current library order · not a timeline</Text>{valid.length === 0 ? <Text style={s.muted}>No resume scores available.</Text> : <><ScrollView horizontal showsHorizontalScrollIndicator={false}><View accessible accessibilityLabel={`${title}. ${valid.map(point => `${point.label}: ${point.value}%`).join(', ')}.`}><Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
    {[0, 50, 100].map(value => { const y = top + (100 - value) / 100 * (height - top - bottom); return <React.Fragment key={value}><Line x1={left} y1={y} x2={width - right} y2={y} stroke={colors.border} strokeWidth={0.5} /><SvgText x={left - 5} y={y + 3} fill={colors.muted} fontSize={9} textAnchor="end">{value}</SvgText></React.Fragment>; })}
    {coordinates.length > 1 && <Polyline points={coordinates.map(point => `${point.x},${point.y}`).join(' ')} fill="none" stroke={colors.primaryStrong} strokeWidth={2.5} strokeLinejoin="round" />}
    {coordinates.map(point => <Circle key={point.id} cx={point.x} cy={point.y} r={4} fill={colors.primaryStrong} />)}
  </Svg><View style={{ width, flexDirection: 'row', justifyContent: valid.length === 1 ? 'center' : 'space-between', paddingHorizontal: left - 6 }}>{valid.map((point, index) => <Text key={point.id} style={s.axisLabel}>{index + 1}</Text>)}</View></View></ScrollView><View style={s.scoreList}>{valid.map((point, index) => <View key={point.id} style={s.legendRow}><Text style={s.index}>{index + 1}</Text><Text style={s.legendLabel} numberOfLines={1}>{point.label}</Text><Text style={s.count}>{point.value}%</Text></View>)}</View></>}</Card>;
}
const styles = (c: AppColors) => StyleSheet.create({ card: { padding: 16, borderRadius: radii.xl, gap: 10 }, title: { color: c.text, fontWeight: '700', fontSize: 15 }, muted: { color: c.muted, fontSize: 11, lineHeight: 16 }, distribution: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 12 }, figure: { width: 132, height: 132 }, donutCenter: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, alignItems: 'center', justifyContent: 'center' }, total: { color: c.text, fontSize: 22, fontWeight: '700' }, centerLabel: { color: c.muted, fontSize: 10 }, legend: { flex: 1, minWidth: 120, gap: 8 }, legendRow: { flexDirection: 'row', alignItems: 'center', gap: 7 }, dot: { width: 9, height: 9, borderRadius: 5 }, legendLabel: { color: c.muted, fontSize: 12, flex: 1, flexShrink: 1 }, count: { color: c.text, fontSize: 12, fontWeight: '700' }, axisLabel: { color: c.muted, fontSize: 10 }, scoreList: { gap: 7 }, index: { color: c.primary, fontSize: 11, minWidth: 14 }, stackedRows: { gap: 14 }, stackedRow: { gap: 6 }, stackedLabelLine: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, stackedLabel: { color: c.text, fontSize: 12, fontWeight: '600' }, stackedTrack: { height: 18, flexDirection: 'row', overflow: 'hidden', borderRadius: radii.pill, backgroundColor: c.surfaceRaised }, stackedLegend: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 }, stackedLegendItem: { maxWidth: '48%', flexDirection: 'row', alignItems: 'center', gap: 6 } });
