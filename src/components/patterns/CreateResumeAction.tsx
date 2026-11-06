import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAppTheme, type AppColors } from '../../theme';
import { AppIcon } from '../core';
import { BottomSheet } from './BottomSheet';
import { FloatingAction } from './FloatingAction';

export type CreateOption = { id: string; label: string; description: string; icon: string; color?: string };

export function CreateResumeAction({ options, onSelect, label = 'New TeX Resume' }: { options: CreateOption[]; onSelect: (id: string) => void; label?: string; menuPlacement?: 'above' | 'below' }) {
  const { colors } = useAppTheme();
  const styles = makeStyles(colors);
  const [open, setOpen] = useState(false);

  return <>
    <FloatingAction label={label} icon="plus" expanded={open} onPress={() => setOpen(true)} />
    <BottomSheet visible={open} title={label} closeLabel={`Close ${label.toLowerCase()} options`} height="60%" onClose={() => setOpen(false)}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
        {options.map(option => <Pressable key={option.id} accessibilityRole="button" onPress={() => { setOpen(false); onSelect(option.id); }} style={({ pressed }) => [styles.option, pressed && styles.pressed]}>
          <View style={[styles.icon, { backgroundColor: `${option.color ?? colors.primary}18` }]}>
            <AppIcon name={option.icon} size={20} color={option.color ?? colors.primary} />
          </View>
          <View style={styles.optionText}>
            <Text style={styles.optionTitle}>{option.label}</Text>
            <Text style={styles.description}>{option.description}</Text>
          </View>
          <AppIcon name="chevron-right" size={18} color={colors.subtle} />
        </Pressable>)}
      </ScrollView>
    </BottomSheet>
  </>;
}

const makeStyles = (colors: AppColors) => StyleSheet.create({
  list: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 28, gap: 8 },
  option: { minHeight: 68, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 16, backgroundColor: colors.surfaceRaised, borderWidth: 1, borderColor: colors.border, flexDirection: 'row', alignItems: 'center', gap: 12 },
  pressed: { opacity: 0.72 },
  icon: { width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  optionText: { flex: 1, minWidth: 0 },
  optionTitle: { color: colors.text, fontSize: 14, fontWeight: '700' },
  description: { color: colors.subtle, fontSize: 12, marginTop: 3 },
});
