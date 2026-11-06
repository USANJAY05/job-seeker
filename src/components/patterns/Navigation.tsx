import React, { useMemo, useState } from 'react';
import { PanResponder, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { GlassView, isGlassEffectAPIAvailable, isLiquidGlassAvailable } from 'expo-glass-effect';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme, type AppColors, fonts, radii } from '../../theme';
import { AppIcon, Chip, type IconName } from '../core';
import { resolveDataMode } from '../../data/appData';

export type NavigationItem = { id: string; label: string; icon: IconName; count?: number };
const showMockBadge = __DEV__ && !process.env.EXPO_PUBLIC_API_URL && resolveDataMode(process.env.EXPO_PUBLIC_APP_DATA_MODE, __DEV__) === 'demo';
export function PageHeader({ title, action, leading }: { title: string; action?: React.ReactNode; leading?: React.ReactNode }) {
  const { colors } = useAppTheme();
  const styles = makeStyles(colors); return <View style={styles.header}><View style={styles.headerTitle}>{leading}<Text numberOfLines={1} accessibilityRole="header" style={styles.title}>{title}</Text>{showMockBadge && <View accessibilityLabel="Mock environment" style={styles.mockBadge}><Text style={styles.mockBadgeText}>MOCK</Text></View>}</View>{action}</View>; }
export function SegmentedNavigation({ items, selectedId, onSelect }: { items: NavigationItem[]; selectedId: string; onSelect: (id: string) => void }) {
  const { colors } = useAppTheme();
  const styles = makeStyles(colors);
  return <View accessibilityRole="tablist" style={styles.segment}>{items.map(item => { const selected = item.id === selectedId; return <Pressable key={item.id} accessibilityRole="tab" accessibilityState={{ selected }} onPress={() => onSelect(item.id)} style={[styles.segmentItem, selected && styles.selected]}><AppIcon name={item.icon} size={16} color={selected ? colors.primary : colors.muted} /><Text numberOfLines={1} style={[styles.segmentText, selected && { color: colors.primary }]}>{item.label}</Text>{item.count != null && <Text style={styles.count}>{item.count}</Text>}</Pressable>; })}</View>;
}
export type FilterItem = { id: string; label: string; count?: number; color?: string; icon?: IconName };
export function FilterChips({ items, selectedId, onSelect, onAdd, variant = 'outlined' }: { items: FilterItem[]; selectedId: string; onSelect: (id: string) => void; onAdd?: () => void; variant?: 'outlined' | 'pill' }) {
  const { colors } = useAppTheme();
  const styles = makeStyles(colors);
  return <ScrollView showsVerticalScrollIndicator={false} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>{items.map(item => <Chip key={item.id} label={item.label} count={item.count} icon={item.icon} color={item.color} variant={variant} selected={item.id === selectedId} onPress={() => onSelect(item.id)} />)}{onAdd && <Pressable accessibilityRole="button" accessibilityLabel="Add custom filter" onPress={onAdd} style={styles.add}><AppIcon name="plus" size={16} /></Pressable>}</ScrollView>;
}
export function BottomNavigation({ items, selectedId, onSelect }: { items: NavigationItem[]; selectedId: string; onSelect: (id: string) => void }) {
  const { colors, mode } = useAppTheme();
  const styles = makeStyles(colors);
  const insets = useSafeAreaInsets();
  const ios = Platform.OS === 'ios';
  const supportsNativeGlass = ios && isLiquidGlassAvailable() && isGlassEffectAPIAvailable();
  const panResponder = useMemo(() => PanResponder.create({
    onMoveShouldSetPanResponderCapture: (_event, gesture) => Math.abs(gesture.dx) > 18 && Math.abs(gesture.dx) > Math.abs(gesture.dy) * 1.2,
    onPanResponderRelease: (_event, gesture) => {
      if (Math.abs(gesture.dx) < 40) return;
      const activeIndex = items.findIndex(item => item.id === selectedId);
      const nextIndex = Math.max(0, Math.min(items.length - 1, activeIndex + (gesture.dx < 0 ? 1 : -1)));
      if (nextIndex !== activeIndex && items[nextIndex]) onSelect(items[nextIndex].id);
    },
  }), [items, onSelect, selectedId]);
  const content = <View style={styles.bottomRow}>{items.map(item => { const selected = selectedId === item.id; return <Pressable key={item.id} accessibilityRole="tab" accessibilityState={{ selected }} onPress={() => onSelect(item.id)} style={styles.bottomItem}>{ios && selected && supportsNativeGlass && <GlassView pointerEvents="none" colorScheme={mode} glassEffectStyle="regular" isInteractive style={styles.iosSelectedGlass} />}<View testID={`footer-icon-${item.id}`} style={[styles.bottomIcon, selected && !ios && styles.bottomIconSelected]}><AppIcon name={item.icon} size={20} color={selected ? colors.primary : colors.muted} /></View><Text numberOfLines={1} style={[styles.bottomText, selected && { color: colors.primary, fontWeight: '700' }]}>{item.label}</Text></Pressable>; })}</View>;
  return <View {...panResponder.panHandlers} testID="app-bottom-navigation" accessibilityRole="tablist" style={[styles.bottom, { paddingBottom: insets.bottom, backgroundColor: colors.background }]}>
    {ios ? <View style={styles.iosBottomSurface}>
      {supportsNativeGlass
        ? <GlassView pointerEvents="none" colorScheme={mode} glassEffectStyle="regular" style={StyleSheet.absoluteFill} />
        : <BlurView pointerEvents="none" intensity={mode === 'dark' ? 80 : 90} tint={mode} style={StyleSheet.absoluteFill} />}
      <View pointerEvents="none" style={styles.iosGlassTint} />
      {content}
    </View> : <View style={styles.bottomSurface}>{content}</View>}
  </View>;
}
/** Desktop navigation rail; the host still owns routing and selection state. */
export function NavigationRail({ items, selectedId, onSelect, collapsed = false, onToggleCollapse }: { items: NavigationItem[]; selectedId: string; onSelect: (id: string) => void; collapsed?: boolean; onToggleCollapse?: () => void }) {
  const { colors } = useAppTheme();
  const styles = makeStyles(colors);
  const [logoHovered, setLogoHovered] = useState(false);
  const railWidth = collapsed ? 72 : 248;
  const webPosition = Platform.OS === 'web' ? { position: 'fixed', left: 0, top: 0, bottom: 0, width: railWidth, height: '100vh', zIndex: 100 } as any : undefined;
  return <View testID="app-navigation-rail" accessibilityRole="tablist" style={[styles.rail, collapsed && styles.railCollapsed, webPosition]}>
    <Pressable onHoverIn={() => setLogoHovered(true)} onHoverOut={() => setLogoHovered(false)} style={[styles.railBrand, collapsed && styles.railBrandCollapsed]}>
      <View style={styles.brandMark}><AppIcon name="briefcase-check" size={19} color={colors.onStrong} /></View>
      {!collapsed && <View style={styles.railBrandText}><Text style={styles.brandName}>Job Buddy</Text><Text style={styles.brandCaption}>CAREER WORKSPACE</Text></View>}
      {onToggleCollapse && <Pressable accessibilityRole="button" accessibilityLabel={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} onPress={onToggleCollapse} onHoverIn={() => setLogoHovered(true)} onFocus={() => setLogoHovered(true)} onBlur={() => setLogoHovered(false)} style={[styles.railToggle, logoHovered && styles.railToggleVisible]}><AppIcon name={collapsed ? 'chevron-right' : 'chevron-left'} size={18} color={colors.muted} /></Pressable>}
    </Pressable>
    {!collapsed && <Text style={styles.railLabel}>WORKSPACE</Text>}
    <View style={styles.railItems}>{items.map(item => { const selected = selectedId === item.id; return <Pressable key={item.id} accessibilityRole="tab" accessibilityLabel={item.label} accessibilityState={{ selected }} onPress={() => onSelect(item.id)} style={[styles.railItem, collapsed && styles.railItemCollapsed, selected && styles.railItemSelected]}><AppIcon name={item.icon} size={19} color={selected ? colors.primary : colors.muted} />{!collapsed && <Text numberOfLines={1} style={[styles.railItemText, selected && styles.railItemTextSelected]}>{item.label}</Text>}{selected && <View style={styles.railIndicator} />}</Pressable>; })}</View>
    <View style={[styles.railBottom, collapsed && styles.railBottomCollapsed]}><View style={styles.railAvatar}><AppIcon name="account-outline" size={17} color={colors.primary} /></View>{!collapsed && <View style={styles.railBrandText}><Text style={styles.railUser}>Your workspace</Text><Text style={styles.railUserMeta}>Local preview</Text></View>}</View>
  </View>;
}
const makeStyles = (colors: AppColors) => StyleSheet.create({
  headerTitle: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 7, minWidth: 0 }, header: { height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, backgroundColor: colors.background, zIndex: 20, elevation: 20 }, title: { color: colors.text, fontSize: 19, fontWeight: '700', flexShrink: 1 }, mockBadge: { paddingHorizontal: 6, paddingVertical: 3, borderRadius: radii.pill, backgroundColor: colors.primaryContainer, flexShrink: 0 }, mockBadgeText: { color: colors.onPrimaryContainer, fontFamily: fonts.mono, fontSize: 8, fontWeight: '700', letterSpacing: 0.5 },
  segment: { flexDirection: 'row', padding: 4, backgroundColor: colors.surfaceLowest, borderWidth: 1, borderColor: colors.border + '55', borderRadius: radii.lg }, segmentItem: { flex: 1, minHeight: 36, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingHorizontal: 4, borderRadius: radii.md }, selected: { backgroundColor: colors.selection, borderWidth: 1, borderColor: colors.selectionBorder }, segmentText: { color: colors.muted, fontFamily: fonts.mono, fontSize: 12, flexShrink: 1 }, count: { color: colors.subtle, fontFamily: fonts.mono, fontSize: 10 },
  chips: { gap: 6, alignItems: 'center', paddingVertical: 2 }, chip: { minHeight: 32, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: radii.md, borderWidth: 1, borderColor: colors.border + '55', backgroundColor: colors.surface }, pill: { borderRadius: radii.pill, borderColor: 'transparent' }, selectedPill: { backgroundColor: colors.primaryContainer, borderColor: colors.primaryContainer }, chipText: { color: colors.muted, fontFamily: fonts.mono, fontSize: 10 }, dot: { width: 6, height: 6, borderRadius: 3 }, add: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: radii.md, backgroundColor: colors.surface },
  bottom: { backgroundColor: colors.background }, bottomSurface: { backgroundColor: colors.surface, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border + '55' }, iosBottomSurface: { marginHorizontal: 10, marginTop: 6, marginBottom: 5, borderRadius: radii.pill, overflow: 'hidden', backgroundColor: colors.surfaceRaised + '28', borderWidth: StyleSheet.hairlineWidth, borderColor: colors.white + '77', ...Platform.select({ ios: { shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 22, shadowOffset: { width: 0, height: 7 } } }) }, iosGlassTint: { ...StyleSheet.absoluteFill, backgroundColor: colors.surfaceRaised + '18', borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.white + 'CC' }, bottomRow: { height: 64, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingHorizontal: 4 }, bottomItem: { minWidth: 0, flex: 1, height: 54, borderRadius: radii.pill, alignItems: 'center', justifyContent: 'center', gap: 2, paddingHorizontal: 2, position: 'relative' }, iosSelectedGlass: { ...StyleSheet.absoluteFill, borderRadius: radii.pill }, bottomIcon: { width: 44, height: 28, borderRadius: radii.pill, alignItems: 'center', justifyContent: 'center' }, bottomIconSelected: { backgroundColor: colors.selection + 'D9' }, bottomText: { color: colors.muted, fontFamily: fonts.mono, fontSize: 10 },
  rail: { flex: 1, width: 248, minHeight: '100%', paddingHorizontal: 16, paddingVertical: 22, backgroundColor: colors.surfaceLowest, borderRightWidth: 1, borderRightColor: colors.border + '55' }, railCollapsed: { width: 72, paddingHorizontal: 8 }, railBrand: { minHeight: 48, position: 'relative', flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 4, paddingBottom: 10 }, railBrandCollapsed: { justifyContent: 'center', paddingHorizontal: 0 }, brandMark: { width: 38, height: 38, borderRadius: 13, backgroundColor: colors.primaryStrong, alignItems: 'center', justifyContent: 'center' }, railBrandText: { flex: 1, gap: 2, paddingRight: 30 }, brandName: { color: colors.text, fontSize: 15, fontWeight: '800' }, brandCaption: { color: colors.subtle, fontSize: 8, letterSpacing: 1.2, fontWeight: '700' }, railToggle: { position: 'absolute', top: 5, right: 0, width: 30, height: 30, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceRaised, opacity: 0 }, railToggleVisible: { opacity: 1 }, railLabel: { color: colors.subtle, fontFamily: fonts.mono, fontSize: 9, letterSpacing: 1, paddingHorizontal: 10, paddingBottom: 8 }, railItems: { gap: 4 }, railItem: { minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 12, borderRadius: radii.md, position: 'relative' }, railItemCollapsed: { justifyContent: 'center', paddingHorizontal: 0 }, railItemSelected: { backgroundColor: colors.selection }, railItemText: { color: colors.muted, fontSize: 13, fontWeight: '600', flex: 1 }, railItemTextSelected: { color: colors.primary, fontWeight: '700' }, railIndicator: { width: 3, height: 20, borderRadius: 2, position: 'absolute', left: 0, backgroundColor: colors.primary }, railBottom: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 'auto', padding: 10, borderTopWidth: 1, borderTopColor: colors.border + '55' }, railBottomCollapsed: { justifyContent: 'center', paddingHorizontal: 0 }, railAvatar: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.selection, alignItems: 'center', justifyContent: 'center' }, railUser: { color: colors.text, fontSize: 11, fontWeight: '600' }, railUserMeta: { color: colors.subtle, fontSize: 10 },
});
