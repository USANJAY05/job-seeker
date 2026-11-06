import React from 'react';
import { Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme, type AppColors, fonts, radii } from '../../theme';
import { AppIcon, Badge, IconAction, SmallButton, type IconName } from '../core';

type Tone = 'primary' | 'secondary' | 'success' | 'neutral';
const toneColor = (colors: AppColors, tone: Tone = 'primary') => tone === 'success' ? colors.success : tone === 'secondary' ? colors.secondary : tone === 'neutral' ? colors.muted : colors.primary;

export type ContextItem = { id: string; label: string; value: string; icon?: IconName; tone?: Tone; detail?: string };
export function ContextStrip({ items }: { items: ContextItem[] }) {
  const { colors } = useAppTheme(); const styles = makeStyles(colors);
  return <ScrollView showsVerticalScrollIndicator={false} horizontal showsHorizontalScrollIndicator={false} style={styles.strip} contentContainerStyle={styles.stripContent}>{items.map(item => <View key={item.id} style={styles.contextItem}>{item.icon && <AppIcon name={item.icon} size={15} color={toneColor(colors, item.tone)} />}<Text style={styles.meta}>{item.label}</Text><Text style={[styles.meta, { color: toneColor(colors, item.tone) }]}>{item.value}</Text>{item.detail && <Badge label={item.detail} />}</View>)}</ScrollView>;
}
export function CopilotWelcome({ title, description, eyebrow, icon = 'brain' }: { title: string; description: string; eyebrow?: string; icon?: IconName }) {
  const { colors } = useAppTheme(); const styles = makeStyles(colors);
  return <View style={styles.welcome}><View style={styles.heroIcon}><AppIcon name={icon} size={30} color={colors.primary} /></View>{eyebrow && <Badge label={eyebrow} tone="secondary" />}<Text accessibilityRole="header" style={styles.heroTitle}>{title}</Text><Text style={styles.heroDescription}>{description}</Text></View>;
}
export type QuickAction = { id: string; title: string; description: string; icon: IconName; tone?: Tone; index?: string };
export function QuickActionCard({ action, onPress }: { action: QuickAction; onPress: (id: string) => void }) {
  const { colors } = useAppTheme(); const styles = makeStyles(colors);
  return <Pressable accessibilityRole="button" onPress={() => onPress(action.id)} style={styles.quickCard}><View style={styles.row}><View style={styles.smallIcon}><AppIcon name={action.icon} size={18} color={toneColor(colors, action.tone)} /></View>{action.index && <Text style={styles.meta}>{action.index}</Text>}</View><Text style={styles.quickTitle}>{action.title}</Text><Text style={styles.description}>{action.description}</Text></Pressable>;
}
export type SessionItem = { id: string; title: string; subtitle: string; icon: IconName; status?: string; tone?: Tone };
export function SessionRow({ item, onPress }: { item: SessionItem; onPress: (id: string) => void }) {
  const { colors } = useAppTheme(); const styles = makeStyles(colors);
  return <Pressable accessibilityRole="button" onPress={() => onPress(item.id)} style={styles.session}><View style={styles.smallIcon}><AppIcon name={item.icon} size={20} color={toneColor(colors, item.tone)} /></View><View style={styles.grow}><Text numberOfLines={1} style={styles.sessionTitle}>{item.title}</Text><Text numberOfLines={1} style={styles.meta}>{item.subtitle}</Text></View>{item.status && <Badge label={item.status} tone={item.tone} />}<AppIcon name="chevron-right" size={18} color={colors.subtle} /></Pressable>;
}
export type ComposerShortcut = { id: string; label: string; icon: IconName; tone?: Tone };
export function MessageComposer({ value, onChangeText, onSend, onAttach, shortcuts = [], onShortcut, placeholder = 'Write a message…', context, disabled = false, collapsible = false, collapsed = false, onToggleCollapse }: { value: string; onChangeText: (value: string) => void; onSend: (value: string) => void; onAttach?: () => void; shortcuts?: ComposerShortcut[]; onShortcut?: (id: string) => void; placeholder?: string; context?: string; disabled?: boolean; collapsible?: boolean; collapsed?: boolean; onToggleCollapse?: () => void }) {
  const { colors } = useAppTheme(); const styles = makeStyles(colors); const canSend = !!value.trim() && !disabled; const { width } = useWindowDimensions(); const desktop = Platform.OS === 'web' && width >= 1024;
  return <View style={styles.composer}>
    {shortcuts.length > 0 && <ScrollView showsVerticalScrollIndicator={false} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.shortcuts}>{shortcuts.map(shortcut => <Pressable key={shortcut.id} accessibilityRole="button" onPress={() => onShortcut?.(shortcut.id)} disabled={!onShortcut} style={styles.shortcut}><AppIcon name={shortcut.icon} size={14} color={toneColor(colors, shortcut.tone)} /><Text style={styles.meta}>{shortcut.label}</Text></Pressable>)}</ScrollView>}
    {collapsed && collapsible ? <View style={styles.collapsedBox}>
      <Pressable accessibilityRole="button" accessibilityLabel="Expand message composer" onPress={onToggleCollapse} style={styles.collapsedPrompt}><View style={styles.collapsedIcon}><AppIcon name="star-four-points-outline" size={16} color={colors.primary} /></View><Text numberOfLines={1} style={styles.collapsedText}>{value.trim() || placeholder}</Text></Pressable>
      {onToggleCollapse && <Pressable accessibilityRole="button" accessibilityLabel="Expand message composer" onPress={onToggleCollapse} style={styles.collapseButton}><AppIcon name="chevron-up" size={19} color={colors.muted} /></Pressable>}
    </View> : desktop ? <View style={[styles.composerBox, styles.desktopComposerBox]}>
      {onAttach && <IconAction icon="paperclip" label="Add attachment" onPress={onAttach} />}
      <TextInput accessibilityLabel="Message" value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={colors.subtle} style={[styles.input, styles.desktopInput]} />
      {context && <Text numberOfLines={1} style={styles.context}>{context}</Text>}
      <View style={[styles.toolbarActions, styles.desktopToolbarActions]}>
        {collapsible && onToggleCollapse && <Pressable accessibilityRole="button" accessibilityLabel="Collapse message composer" onPress={onToggleCollapse} style={[styles.collapseButton, styles.desktopCollapseButton]}><AppIcon name="chevron-down" size={19} color={colors.muted} /></Pressable>}
        <Pressable accessibilityRole="button" accessibilityLabel="Send message" accessibilityState={{ disabled: !canSend }} disabled={!canSend} onPress={() => onSend(value)} style={[styles.send, styles.desktopSend, !canSend && styles.disabled]}><AppIcon name="arrow-up" size={22} color={colors.onStrong} /></Pressable>
      </View>
    </View> : <View style={styles.composerBox}>
      <TextInput accessibilityLabel="Message" multiline value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={colors.subtle} style={styles.input} textAlignVertical="top" />
      <View style={styles.composerToolbar}>
        <View style={styles.toolbarLeading}>{onAttach && <IconAction icon="paperclip" label="Add attachment" onPress={onAttach} />}{context && <Text numberOfLines={1} style={styles.context}>{context}</Text>}</View>
        <View style={styles.toolbarActions}>
          {collapsible && onToggleCollapse && <Pressable accessibilityRole="button" accessibilityLabel="Collapse message composer" onPress={onToggleCollapse} style={styles.collapseButton}><AppIcon name="chevron-down" size={19} color={colors.muted} /></Pressable>}
          <Pressable accessibilityRole="button" accessibilityLabel="Send message" accessibilityState={{ disabled: !canSend }} disabled={!canSend} onPress={() => onSend(value)} style={[styles.send, !canSend && styles.disabled]}><AppIcon name="arrow-up" size={20} color={colors.onStrong} /></Pressable>
        </View>
      </View>
    </View>}
  </View>;
}
export function HistoryDrawer({ visible, title, description, items, onClose, onSelect, footer }: { visible: boolean; title: string; description?: string; items: SessionItem[]; onClose: () => void; onSelect: (id: string) => void; footer?: { label: string; onPress: () => void } }) {
  const { colors } = useAppTheme(); const styles = makeStyles(colors); const insets = useSafeAreaInsets();
  return <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}><View style={styles.overlay}><Pressable accessibilityRole="button" accessibilityLabel="Close history" onPress={onClose} style={styles.backdrop} /><View accessibilityViewIsModal style={[styles.drawer, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 12 }]}><View style={styles.row}><Text accessibilityRole="header" style={styles.heroTitle}>{title}</Text><IconAction icon="close" label="Close history" onPress={onClose} /></View>{description && <Text style={styles.description}>{description}</Text>}<ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} contentContainerStyle={styles.historyList}>{items.map(item => <SessionRow key={item.id} item={item} onPress={onSelect} />)}</ScrollView>{footer && <SmallButton label={footer.label} icon="delete-outline" onPress={footer.onPress} />}</View></View></Modal>;
}
const makeStyles = (c: AppColors) => StyleSheet.create({
 strip: { backgroundColor: c.surface, borderRadius: radii.lg }, stripContent: { padding: 8, gap: 16, alignItems: 'center' }, contextItem: { flexDirection: 'row', alignItems: 'center', gap: 5 }, meta: { color: c.muted, fontFamily: fonts.mono, fontSize: 11 },
 welcome: { alignItems: 'center', padding: 8, gap: 8 }, heroIcon: { width: 64, height: 64, borderRadius: radii.xl, alignItems: 'center', justifyContent: 'center', backgroundColor: c.surfaceRaised }, heroTitle: { color: c.text, fontSize: 22, fontWeight: '600' }, heroDescription: { color: c.muted, textAlign: 'center', fontSize: 13, lineHeight: 18 },
 row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 }, quickCard: { flex: 1, minWidth: 140, minHeight: 128, padding: 12, borderRadius: radii.lg, backgroundColor: c.surface, gap: 6 }, smallIcon: { width: 36, height: 36, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center', backgroundColor: c.surfaceRaised }, quickTitle: { color: c.text, fontSize: 14, fontWeight: '600' }, description: { color: c.muted, fontSize: 12, lineHeight: 17 }, session: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 8, borderRadius: radii.lg, backgroundColor: c.surface }, grow: { flex: 1, minWidth: 0 }, sessionTitle: { color: c.text, fontSize: 13, fontWeight: '600' },
 composer: { gap: 8 }, shortcuts: { gap: 6 }, shortcut: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, minHeight: 32, borderRadius: radii.pill, backgroundColor: c.surface }, composerBox: { paddingHorizontal: 14, paddingTop: 12, paddingBottom: 10, borderRadius: 22, backgroundColor: c.surface, borderWidth: 1, borderColor: c.border + '55', shadowColor: '#000000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.08, shadowRadius: 10, elevation: 2 }, desktopComposerBox: { minHeight: 72, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingVertical: 8, borderRadius: radii.pill, shadowOpacity: 0.04, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } }, input: { width: '100%', minWidth: 0, minHeight: 48, maxHeight: 128, paddingHorizontal: 2, paddingTop: 4, paddingBottom: 8, color: c.text, fontSize: 14, lineHeight: 21, borderWidth: 0 }, desktopInput: { flex: 1, width: undefined, minHeight: 44, maxHeight: 44, padding: 0, outlineStyle: 'none', backgroundColor: 'transparent' } as any, composerToolbar: { minHeight: 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }, toolbarLeading: { flex: 1, minWidth: 0, flexDirection: 'row', alignItems: 'center', gap: 8 }, toolbarActions: { flexDirection: 'row', alignItems: 'center', gap: 8 }, desktopToolbarActions: { gap: 4 }, collapseButton: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: radii.md, backgroundColor: c.surfaceRaised }, desktopCollapseButton: { backgroundColor: 'transparent' }, collapsedBox: { minHeight: 62, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 10, borderRadius: radii.xl, backgroundColor: c.surface, borderWidth: 1, borderColor: c.border + '55' }, collapsedPrompt: { minWidth: 0, flex: 1, minHeight: 42, flexDirection: 'row', alignItems: 'center', gap: 10 }, collapsedIcon: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center', borderRadius: radii.md, backgroundColor: c.selection }, collapsedText: { flex: 1, color: c.muted, fontSize: 13 }, send: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: radii.lg, backgroundColor: c.primaryStrong }, desktopSend: { width: 48, height: 48, borderRadius: radii.pill }, disabled: { opacity: 0.45 }, context: { color: c.muted, fontFamily: fonts.mono, fontSize: 11, padding: 4 },
 overlay: { flex: 1, flexDirection: 'row' }, backdrop: { flex: 1, backgroundColor: c.text + '99' }, drawer: { width: '85%', maxWidth: 320, paddingHorizontal: 12, gap: 8, backgroundColor: c.surfaceLowest }, historyList: { gap: 4, paddingVertical: 8 },
});
