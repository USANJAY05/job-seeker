import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppIcon, SmallButton, type IconName } from '../core';
import { useAppTheme, type AppColors, radii } from '../../theme';
import { BottomSheet } from './BottomSheet';

export type ActionMenuItem = { id: string; label: string; icon: IconName; destructive?: boolean; disabled?: boolean; confirmation?: { message: string; confirmLabel: string } };
export function ActionMenu({ visible, title, items, onClose, onSelect }: { visible: boolean; title: string; items: ActionMenuItem[]; onClose: () => void; onSelect: (id: string) => void }) {
  const { colors } = useAppTheme(); const s = styles(colors); const [pending, setPending] = React.useState<ActionMenuItem | null>(null);
  React.useEffect(() => { if (!visible) setPending(null); }, [visible]);
  const close = () => { setPending(null); onClose(); };
  return <BottomSheet visible={visible} title={title} closeLabel="Close actions" height="60%" onClose={close}>{pending?.confirmation ? <View style={s.confirm}><Text accessibilityRole="header" style={s.confirmTitle}>{pending.confirmation.message}</Text><View style={s.buttons}><SmallButton label="Cancel" icon="close" onPress={() => setPending(null)} style={s.button} /><SmallButton label={pending.confirmation.confirmLabel} icon={pending.icon} variant="primary" onPress={() => { const id = pending.id; setPending(null); onSelect(id); }} style={s.button} /></View></View> : <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={s.list}>{items.map(item => <Pressable key={item.id} accessibilityRole="button" accessibilityLabel={item.label} accessibilityState={{ disabled: !!item.disabled }} disabled={item.disabled} onPress={() => item.confirmation ? setPending(item) : onSelect(item.id)} style={({ pressed }) => [s.row, (pressed || item.disabled) && s.dim]}><View style={s.icon}><AppIcon name={item.icon} color={item.destructive ? colors.error : colors.primary} size={20} /></View><Text style={[s.label, item.destructive && { color: colors.error }]}>{item.label}</Text></Pressable>)}</ScrollView>}</BottomSheet>;

}
const styles = (c: AppColors) => StyleSheet.create({ list: { paddingHorizontal: 16, paddingBottom: 16, gap: 4 }, row: { flexDirection: 'row', alignItems: 'center', minHeight: 52, gap: 12, paddingHorizontal: 8, borderRadius: radii.md }, icon: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: radii.md, backgroundColor: c.surfaceRaised }, label: { color: c.text, fontSize: 14, fontWeight: '600', flex: 1 }, dim: { opacity: 0.45 }, confirm: { padding: 16, gap: 16 }, confirmTitle: { color: c.text, fontSize: 15, lineHeight: 22, fontWeight: '600' }, buttons: { flexDirection: 'row', gap: 8 }, button: { flex: 1 } });
