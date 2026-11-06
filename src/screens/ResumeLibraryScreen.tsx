import React, { useCallback, useEffect, useState } from 'react';
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconAction } from '../components/core';
import { AppFooter } from '../components/patterns/AppFooter';
import { PageHeader } from '../components/patterns/Navigation';
import { CreateResumeAction } from '../components/patterns/CreateResumeAction';
import { ImportResumePdfSheet } from '../components/patterns/ImportResumePdfSheet';
import { useAppTheme, type AppColors } from '../theme';
import { MyResumesContent, type MyResumesScreenProps } from './MyResumesScreen';
import { type TemplatesExplorerScreenProps } from './TemplatesExplorerScreen';
import { TemplateExplorerSheet } from './TemplateExplorerSheet';
import type { LibraryView } from './LibraryScreenShell';

export type ResumeLibraryScreenProps = {
  resumes: Omit<MyResumesScreenProps, 'templateCount' | 'onViewChange' | 'onNavigate'>;
  templates: Omit<TemplatesExplorerScreenProps, 'resumeCount' | 'onViewChange' | 'onNavigate'>;
  onNavigateOutside: (destination: string) => void;
  initialView?: LibraryView;
  /** Increment to select the resume view when its footer item is pressed. */
  resumeSelectionRequest?: number;
};
/** Templates open as a sheet while the resume library stays mounted. */
export function ResumeLibraryScreen({ resumes, templates, onNavigateOutside, initialView = 'resumes', resumeSelectionRequest = 0 }: ResumeLibraryScreenProps) {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const styles = makeStyles(colors, Platform.OS === 'ios' ? insets.bottom + 64 : 0);
  const { width } = useWindowDimensions();
  const desktop = Platform.OS === 'web' && width >= 1024;
  const [view, setView] = useState<LibraryView>(initialView);
  const [verifiedTemplatesOnly, setVerifiedTemplatesOnly] = useState(false);
  const [pdfImportVisible, setPdfImportVisible] = useState(false);
  const selectView = useCallback((next: LibraryView) => setView(next), []);
  const selectCreateOption = (optionId: string) => {
    if (optionId === 'template') { setVerifiedTemplatesOnly(true); selectView('templates'); return; }
    if (optionId === 'pdf') { setPdfImportVisible(true); return; }
    const resumeId = resumes.onCreate(optionId);
    if (resumeId) resumes.onOpen(resumeId);
  };
  const templateData = verifiedTemplatesOnly ? {
    ...templates,
    templates: templates.templates.filter(template => template.verified && template.source),
    onTemplateAction: (templateId: string, actionId: string) => {
      const resumeId = templates.onTemplateAction(templateId, actionId);
      if (resumeId) { setVerifiedTemplatesOnly(false); selectView('resumes'); resumes.onOpen(resumeId); }
      return resumeId;
    },
  } : templates;
  useEffect(() => { if (resumeSelectionRequest > 0) selectView('resumes'); }, [resumeSelectionRequest, selectView]);
  return <SafeAreaView edges={['top']} style={styles.screen}>
    <PageHeader title="My Resumes" action={<View style={styles.headerActions}>{desktop && resumes.createOptions.length > 0 && <CreateResumeAction options={resumes.createOptions} onSelect={selectCreateOption} menuPlacement="below" />}<IconAction icon="view-grid-outline" label="Explore Templates" onPress={() => { setVerifiedTemplatesOnly(false); selectView('templates'); }} /></View>} />
    <View style={styles.contentArea}>
      <MyResumesContent {...resumes} sticky />
      {!desktop && resumes.createOptions.length > 0 && <View pointerEvents="box-none" style={styles.floating}><CreateResumeAction options={resumes.createOptions} onSelect={selectCreateOption} /></View>}
    </View>
    <TemplateExplorerSheet visible={view === 'templates'} onClose={() => { setVerifiedTemplatesOnly(false); selectView('resumes'); }} templates={templateData} />
    <ImportResumePdfSheet visible={pdfImportVisible} onClose={() => setPdfImportVisible(false)} onImport={file => resumes.onImportPdf?.(file.uri, file.name)} />
    <AppFooter selectedId="resumes" onSelect={destination => destination === 'resumes' ? selectView('resumes') : onNavigateOutside(destination)} />
  </SafeAreaView>;
}
const makeStyles = (colors: AppColors, tabBarOffset = 0) => StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  contentArea: { flex: 1 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 8, zIndex: 2 },
  floating: { position: 'absolute', right: 16, bottom: 16 + tabBarOffset, zIndex: 1, alignItems: 'flex-end' },
});
