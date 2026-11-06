import React, { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';
import { useAppTheme, type AppColors, fonts, radii } from '../../theme';
import { AppIcon, Badge, FormField, IconAction, SmallButton } from '../core';

export function DocumentHeader({ title, subtitle, status, onBack, actionLabel, actionIcon = 'play', onAction, onTitleChange }: { title: string; subtitle?: string; status?: string; onBack: () => void; actionLabel: string; actionIcon?: string; onAction: () => void; onTitleChange?: (title: string) => void }) {
  const { colors } = useAppTheme();
  const styles = makeStyles(colors);
  const [editingTitle, setEditingTitle] = useState(false); const [draftTitle, setDraftTitle] = useState(title); const lastTap = useRef(0);
  useEffect(() => { if (!editingTitle) setDraftTitle(title); }, [title, editingTitle]);
  const finishTitleEdit = () => { const next = draftTitle.trim(); if (next && next !== title) onTitleChange?.(next); else setDraftTitle(title); setEditingTitle(false); };
  const handleTitlePress = () => { const now = Date.now(); if (now - lastTap.current < 350) { setDraftTitle(title); setEditingTitle(true); lastTap.current = 0; } else lastTap.current = now; };
  return <View style={styles.header}><IconAction icon="arrow-left" label="Go back" onPress={onBack} /><View style={styles.headerTitle}>{editingTitle ? <TextInput accessibilityLabel="Document title" value={draftTitle} onChangeText={setDraftTitle} onBlur={finishTitleEdit} onSubmitEditing={finishTitleEdit} returnKeyType="done" style={styles.titleInput} /> : <Pressable accessibilityRole="button" accessibilityLabel="Double tap to edit document title" onPress={handleTitlePress} style={styles.titlePressable}><Text numberOfLines={1} accessibilityRole="header" style={styles.title}>{title}</Text><AppIcon name="pencil-outline" size={12} color={colors.subtle} /></Pressable>}{(subtitle || status) && <View style={styles.subtitleRow}>{subtitle && <Text numberOfLines={1} style={styles.muted}>{subtitle}</Text>}{status && <Badge label={status} tone="success" dot />}</View>}</View><SmallButton label={actionLabel} icon={actionIcon} variant="lightPrimary" onPress={onAction} /></View>;
}

/** A controlled plain-text TeX editor; compilation and persistence belong to the host. */
export function TexEditor({ value, onChangeText, filename, onSearch, status, onLogs }: { value: string; onChangeText: (value: string) => void; filename: string; onSearch?: () => void; status?: string; onLogs?: () => void }) {
  const { colors } = useAppTheme();
  const styles = makeStyles(colors);
  const [viewportHeight, setViewportHeight] = useState(0); const [textHeight, setTextHeight] = useState(0);
  const codeHeight = Math.max(viewportHeight, textHeight, 40);
  return <View style={styles.editor}><View style={styles.editorBar}><Text numberOfLines={1} style={[styles.mono, { flex: 1 }]}>{filename}</Text><Text style={styles.mono}>UTF-8</Text>{onSearch && <SmallButton label="Search" icon="magnify" onPress={onSearch} />}</View><View style={styles.codeBody} onLayout={event => setViewportHeight(event.nativeEvent.layout.height)}><ScrollView style={styles.codeScroll} contentContainerStyle={[styles.codeScrollContent, { minHeight: viewportHeight }]} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled"><View style={[styles.codeRow, { minHeight: codeHeight }]}><Text accessibilityElementsHidden importantForAccessibility="no" style={[styles.lineNumbers, { minHeight: codeHeight }]}>{value.split('\n').map((_, i) => i + 1).join('\n')}</Text><TextInput accessibilityLabel="LaTeX source" multiline scrollEnabled={false} autoCorrect={false} autoCapitalize="none" spellCheck={false} value={value} onChangeText={onChangeText} onContentSizeChange={event => setTextHeight(event.nativeEvent.contentSize.height)} style={[styles.codeInput, { height: codeHeight }]} textAlignVertical="top" /></View></ScrollView></View>{(status || onLogs) && <View style={styles.statusBar}><Text style={styles.status}>{status}</Text>{onLogs && <Pressable accessibilityRole="button" onPress={onLogs}><Text style={styles.link}>View Logs</Text></Pressable>}</View>}</View>;
}

export function EditorSection({ title, subtitle, icon, expanded, onToggle, action, children }: { title: string; subtitle?: string; icon: string; expanded?: boolean; onToggle?: () => void; action?: React.ReactNode; children?: React.ReactNode }) {
  const { colors } = useAppTheme();
  const styles = makeStyles(colors);
  const header = <><View style={styles.sectionIcon}><AppIcon name={icon} color={colors.primary} /></View><View style={styles.sectionTitle}><Text style={styles.sectionHeading}>{title}</Text>{subtitle && <Text style={styles.mono}>{subtitle}</Text>}</View>{action}{onToggle && <AppIcon name={expanded ? 'chevron-up' : 'chevron-down'} />}</>;
  return <View style={styles.section}>{onToggle ? <Pressable accessibilityRole="button" accessibilityState={{ expanded: !!expanded }} onPress={onToggle} style={styles.sectionHeader}>{header}</Pressable> : <View style={styles.sectionHeader}>{header}</View>}{(!onToggle || expanded) && children && <View style={styles.sectionBody}>{children}</View>}</View>;
}
export function EditorField({ label, ...props }: TextInputProps & { label: string }) {
  return <FormField {...props} label={label} variant="editor" />;
}
export function EditorBullet({ text, badge, action }: { text: string; badge?: string; action?: React.ReactNode }) {
  const { colors } = useAppTheme();
  const styles = makeStyles(colors); return <View style={styles.bullet}><Text style={styles.bulletText}><Text style={{ color: colors.primary }}>• </Text>{text}</Text>{(badge || action) && <View style={styles.bulletFooter}>{badge && <Badge label={badge} tone="primary" />}{action}</View>}</View>; }

const makeStyles = (colors: AppColors) => StyleSheet.create({
 header: { minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 8, backgroundColor: colors.background }, headerTitle: { flex: 1, minWidth: 0 }, titlePressable: { minHeight: 24, flexDirection: 'row', alignItems: 'center', gap: 4 }, title: { flexShrink: 1, color: colors.text, fontSize: 14, fontWeight: '600' }, titleInput: { minHeight: 24, paddingHorizontal: 0, flex: 1, color: colors.text, fontSize: 14, fontWeight: '600', backgroundColor: 'transparent' }, subtitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 }, muted: { color: colors.muted, fontSize: 10, flexShrink: 1 },
 editor: { width: '100%', flex: 1, minHeight: 0, alignSelf: 'stretch', backgroundColor: colors.surfaceLowest, borderRadius: radii.lg, overflow: 'hidden' }, editorBar: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 8, backgroundColor: colors.surface }, codeBody: { flex: 1, minHeight: 0 }, codeScroll: { flex: 1 }, codeScrollContent: { flexGrow: 1 }, mono: { color: colors.muted, fontSize: 11, fontFamily: fonts.mono }, codeRow: { width: '100%', flexDirection: 'row', padding: 8, alignItems: 'stretch' }, lineNumbers: { minWidth: 30, color: colors.subtle, fontFamily: fonts.mono, fontSize: 13, lineHeight: 20, textAlign: 'right', marginRight: 12 }, codeInput: { color: colors.text, fontFamily: fonts.mono, fontSize: 13, lineHeight: 20, padding: 0, minWidth: 0, flex: 1 }, statusBar: { padding: 12, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: colors.surfaceRaised }, status: { color: colors.success, fontSize: 11, flexShrink: 1 }, link: { color: colors.primary, fontSize: 11 },
 section: { borderRadius: radii.lg, overflow: 'hidden', backgroundColor: colors.surface }, sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.surfaceRaised, padding: 12 }, sectionIcon: { width: 28, height: 28, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceLowest }, sectionTitle: { flex: 1 }, sectionHeading: { color: colors.text, fontSize: 16, fontWeight: '600' }, sectionBody: { padding: 12, gap: 12 }, bullet: { padding: 10, borderRadius: radii.md, backgroundColor: colors.surfaceLowest, gap: 6 }, bulletText: { color: colors.text, fontSize: 12, lineHeight: 18 }, bulletFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
