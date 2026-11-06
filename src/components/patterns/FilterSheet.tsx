import React from 'react';
import { Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { AppIcon, SmallButton } from '../core';
import { useAppTheme, type AppColors, radii } from '../../theme';
import { BottomSheet } from './BottomSheet';
import type { FilterItem } from './Navigation';

/** Shared single-select filter panel used by searchable library and pipeline lists. */
export function FilterSheet({ visible, title, items, selectedId, onSelect, onClose, onClear }: {
  visible: boolean; title: string; items: FilterItem[]; selectedId: string;
  onSelect: (id: string) => void; onClose: () => void; onClear: () => void;
}) {
  const { colors } = useAppTheme(); const s = makeStyles(colors); const { width, height } = useWindowDimensions();
  const desktop = Platform.OS === 'web' && width >= 1024;
  if (desktop) return <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
    <View style={s.popoverRoot}>
      <Pressable accessibilityRole="button" accessibilityLabel="Close filters" onPress={onClose} style={s.popoverBackdrop} />
      <View accessibilityViewIsModal style={[s.popover, { maxHeight: Math.min(height - 140, 480) }]}>
        <View style={s.popoverHeader}><Text accessibilityRole="header" style={s.popoverTitle}>{title}</Text><Pressable accessibilityRole="button" accessibilityLabel="Close filters" onPress={onClose} style={s.close}><AppIcon name="close" size={18} color={colors.muted} /></Pressable></View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.list}>
          {items.map(item => {
            const selected = selectedId === item.id;
            return <Pressable key={item.id} accessibilityRole="radio" accessibilityState={{ selected }} onPress={() => onSelect(item.id)} style={({ pressed }) => [s.row, selected && s.selectedRow, pressed && s.pressed]}>
              <View style={[s.radio, selected && s.radioSelected]}>{selected && <View style={s.radioDot} />}</View>
              <Text numberOfLines={1} style={[s.label, selected && s.selectedLabel]}>{item.label}</Text>
              {item.count != null && <Text style={s.count}>{item.count}</Text>}
              {item.icon && <AppIcon name={item.icon} size={16} color={selected ? colors.primary : colors.muted} />}
            </Pressable>;
          })}
        </ScrollView>
        <View style={s.footer}>
          <SmallButton label="Clear" icon="filter-remove-outline" onPress={onClear} style={s.button} />
          <SmallButton label="Done" icon="check" variant="primary" onPress={onClose} style={s.button} />
        </View>
      </View>
    </View>
  </Modal>;
  return <BottomSheet visible={visible} title={title} closeLabel="Close filters" height="64%" onClose={onClose}>
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.list}>
      <Text style={s.hint}>Choose one filter</Text>
      {items.map(item => {
        const selected = selectedId === item.id;
        return <Pressable key={item.id} accessibilityRole="radio" accessibilityState={{ selected }} onPress={() => onSelect(item.id)} style={({ pressed }) => [s.row, selected && s.selectedRow, pressed && s.pressed]}>
          <View style={[s.radio, selected && s.radioSelected]}>{selected && <View style={s.radioDot} />}</View>
          <Text numberOfLines={1} style={[s.label, selected && s.selectedLabel]}>{item.label}</Text>
          {item.count != null && <Text style={s.count}>{item.count}</Text>}
          {item.icon && <AppIcon name={item.icon} size={16} color={selected ? colors.primary : colors.muted} />}
        </Pressable>;
      })}
    </ScrollView>
    <View style={s.footer}>
      <SmallButton label="Clear" icon="filter-remove-outline" onPress={onClear} style={s.button} />
      <SmallButton label="Done" icon="check" variant="primary" onPress={onClose} style={s.button} />
    </View>
  </BottomSheet>;
}

const makeStyles = (c: AppColors) => StyleSheet.create({
  popoverRoot: { flex: 1 }, popoverBackdrop: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: '#00000018' },
  popover: { position: 'absolute', top: 116, right: 16, width: 320, backgroundColor: c.surface, borderRadius: radii.xl, borderWidth: 1, borderColor: c.border, overflow: 'hidden', elevation: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 24 },
  popoverHeader: { minHeight: 52, flexDirection: 'row', alignItems: 'center', paddingLeft: 16, paddingRight: 8, borderBottomWidth: 1, borderBottomColor: c.border + '55' }, popoverTitle: { flex: 1, color: c.text, fontSize: 14, fontWeight: '700' }, close: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  list: { padding: 16, gap: 8 }, hint: { color: c.muted, fontSize: 12, marginBottom: 4 },
  row: { minHeight: 48, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 12, borderRadius: radii.md, backgroundColor: c.surface },
  selectedRow: { backgroundColor: c.primaryContainer, borderWidth: 1, borderColor: c.selectionBorder }, pressed: { opacity: 0.72 },
  radio: { width: 18, height: 18, borderRadius: 9, borderWidth: 1.5, borderColor: c.border, alignItems: 'center', justifyContent: 'center' },
  radioSelected: { borderColor: c.primary }, radioDot: { width: 9, height: 9, borderRadius: 5, backgroundColor: c.primary },
  label: { flex: 1, color: c.text, fontSize: 13 }, selectedLabel: { color: c.onPrimaryContainer, fontWeight: '600' },
  count: { color: c.muted, fontSize: 11, fontVariant: ['tabular-nums'] }, footer: { flexDirection: 'row', gap: 8, padding: 16, paddingTop: 8 }, button: { flex: 1 },
});
