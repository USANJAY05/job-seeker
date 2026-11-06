import React, { useCallback, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import ResumePager, { type ResumePagerHandle } from '../components/patterns/ResumePager';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DocumentHeader, TexEditor } from '../components/patterns/DocumentEditor';
import { AppFooter } from '../components/patterns/AppFooter';
import { SegmentedNavigation, type NavigationItem } from '../components/patterns/Navigation';
import { useAppTheme, type AppColors } from '../theme';
import { ResumeEditorForm, type ResumeEditorFormData } from './ResumeEditorForm';

export type ResumeEditorMode = 'code' | 'form' | 'preview';
export type ResumeEditorScreenProps = {
  filename: string; onFilenameChange?: (filename: string) => void; source: string; onSourceChange: (source: string) => void;
  form: ResumeEditorFormData; onFormChange: (form: ResumeEditorFormData) => void;
  onBack: () => void; onNavigate: (destination: string) => void;
  onCompile: () => void; onSaveCompile: () => void;
  initialMode?: ResumeEditorMode; subtitle?: string; status?: string; compilerStatus?: string;
  onSearch?: () => void; onLogs?: () => void; onDuplicate?: () => void;
  preview?: React.ReactNode; onDownload?: () => void; onSendToPipeline?: () => void;
  formNotice?: string;
  /** Rendered within the library workspace; the app tab bar already exists underneath. */
  embedded?: boolean;
  /** Desktop editor keeps the PDF visible beside the selected editing mode. */
  desktopSplit?: boolean;
};
const modes: ResumeEditorMode[] = ['code', 'form', 'preview'];
const tabs: NavigationItem[] = [ { id: 'code', label: 'Code', icon: 'code-tags' }, { id: 'form', label: 'Form', icon: 'form-textbox' }, { id: 'preview', label: 'Preview', icon: 'eye-outline' } ];
export function ResumeEditorScreen(props: ResumeEditorScreenProps) {
  const { colors } = useAppTheme(); const styles = makeStyles(colors);
  const scrollContentStyle = styles.content;
  const pager = useRef<ResumePagerHandle>(null);
  const initialMode = props.desktopSplit && props.initialMode === 'preview' ? 'code' : props.initialMode ?? 'code';
  const [mode, setMode] = useState<ResumeEditorMode>(initialMode);
  const selectMode = useCallback((next: ResumeEditorMode) => { setMode(next); pager.current?.setPage(modes.indexOf(next)); }, []);
  const visible = (name: ResumeEditorMode) => ({ accessibilityElementsHidden: mode !== name, importantForAccessibility: (mode === name ? 'auto' : 'no-hide-descendants') as 'auto' | 'no-hide-descendants' });
  return <SafeAreaView edges={['top']} style={styles.screen}><KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.screen}>
    <DocumentHeader title={props.filename} onTitleChange={props.onFilenameChange} subtitle={props.subtitle} status={props.status} onBack={props.onBack} actionLabel={mode === 'preview' ? 'Re-render' : 'Run TeX'} actionIcon={mode === 'preview' ? 'sync' : 'play'} onAction={props.onCompile} />
    {props.desktopSplit ? <View style={styles.splitLayout}>
      <View style={styles.splitPane}><View style={styles.splitTabs}><SegmentedNavigation items={tabs.slice(0, 2)} selectedId={mode === 'form' ? 'form' : 'code'} onSelect={id => { if (id === 'code' || id === 'form') setMode(id); }} /></View>{mode === 'form' ? <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={scrollContentStyle}>{props.formNotice && <Text style={styles.notice}>{props.formNotice}</Text>}<ResumeEditorForm value={props.form} onChange={props.onFormChange} /></ScrollView> : <View style={styles.codePage}><TexEditor value={props.source} onChangeText={props.onSourceChange} filename={props.filename} status={props.compilerStatus} onSearch={props.onSearch} onLogs={props.onLogs} /></View>}</View>
      <View style={styles.splitPane}><View style={styles.previewHeader}><Text style={styles.previewTitle}>Preview</Text></View><ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} contentContainerStyle={scrollContentStyle}>{props.preview ?? <View style={styles.empty}><Text style={styles.emptyText}>No compiled PDF available yet. Run TeX to generate a preview.</Text></View>}</ScrollView></View>
    </View> : <>
      <View style={styles.tabs}><SegmentedNavigation items={tabs} selectedId={mode} onSelect={id => { if (id === 'code' || id === 'form' || id === 'preview') selectMode(id); }} /></View>
      <ResumePager ref={pager} testID="editor-pager" style={styles.pager} initialPage={modes.indexOf(props.initialMode ?? 'code')} onPageSelected={event => { const next = modes[event.nativeEvent.position]; if (next) setMode(next); }}>
        <View key="code" collapsable={false} {...visible('code')} style={styles.codePage}><TexEditor value={props.source} onChangeText={props.onSourceChange} filename={props.filename} status={props.compilerStatus} onSearch={props.onSearch} onLogs={props.onLogs} /></View>
        <View key="form" collapsable={false} {...visible('form')}><ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={scrollContentStyle}>{props.formNotice && <Text style={styles.notice}>{props.formNotice}</Text>}<ResumeEditorForm value={props.form} onChange={props.onFormChange} /></ScrollView></View>
        <View key="preview" collapsable={false} {...visible('preview')}><ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={scrollContentStyle}>{props.preview ?? <View style={styles.empty}><Text style={styles.emptyText}>No compiled PDF available yet. Run TeX to generate a preview.</Text></View>}</ScrollView></View>
      </ResumePager>
    </>}
    {!props.embedded && <AppFooter selectedId="resumes" onSelect={props.onNavigate} />}
  </KeyboardAvoidingView></SafeAreaView>;
}
const makeStyles = (colors: AppColors) => StyleSheet.create({ screen: { flex: 1, backgroundColor: colors.background }, tabs: { paddingHorizontal: 16, paddingVertical: 12 }, pager: { flex: 1 }, splitLayout: { flex: 1, minHeight: 0, flexDirection: 'row', gap: 12, paddingHorizontal: 16, paddingBottom: 16 }, splitPane: { flex: 1, minWidth: 0, minHeight: 0, backgroundColor: colors.surfaceLowest, borderRadius: 14, overflow: 'hidden' }, splitTabs: { paddingHorizontal: 12, paddingVertical: 10 }, previewHeader: { minHeight: 54, justifyContent: 'center', paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: colors.border + '55' }, previewTitle: { color: colors.text, fontSize: 14, fontWeight: '700' }, codePage: { flex: 1, minHeight: 0, paddingHorizontal: 16, paddingBottom: 12 }, content: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24, gap: 12 }, notice: { color: colors.muted, backgroundColor: colors.surface, borderRadius: 8, padding: 10, fontSize: 12, lineHeight: 18 }, empty: { backgroundColor: colors.surface, borderRadius: 12, padding: 24 }, emptyText: { color: colors.muted, textAlign: 'center', fontSize: 13, lineHeight: 18 } });
