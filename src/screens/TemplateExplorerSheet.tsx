import React, { useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { BottomSheet } from '../components/patterns/BottomSheet';
import { FloatingAction } from '../components/patterns/FloatingAction';
import { TemplatesContent, type TemplateSearchState, type TemplatesExplorerScreenProps } from './TemplatesExplorerScreen';
import { usePullToRefresh } from '../hooks/usePullToRefresh';

export type TemplateExplorerSheetProps = { visible: boolean; onClose: () => void; templates: Omit<TemplatesExplorerScreenProps, 'resumeCount' | 'onViewChange' | 'onNavigate'> };
/** Keeps search and filter state while the sheet is closed. */
export function TemplateExplorerSheet({ visible, onClose, templates }: TemplateExplorerSheetProps) {
  const [searchState, setSearchState] = useState<TemplateSearchState>({ query: '', filterId: 'all' });
  const refreshProps = usePullToRefresh(templates.onRefresh);
  return <BottomSheet visible={visible} title="Templates Explorer" onClose={onClose} closeLabel="Close template explorer">
    <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false} refreshControl={<RefreshControl {...refreshProps} />} contentContainerStyle={styles.content}><TemplatesContent {...templates} searchState={searchState} onSearchStateChange={setSearchState} /></ScrollView>
    {templates.onUpload && <View testID="template-upload-floating" pointerEvents="box-none" style={styles.floating}><FloatingAction label="Upload TeX" icon="file-upload-outline" tone="success" onPress={templates.onUpload} /></View>}
  </BottomSheet>;
}
const styles = StyleSheet.create({ content: { paddingHorizontal: 16, paddingBottom: 88, gap: 12 }, floating: { position: 'absolute', right: 16, bottom: 16, alignItems: 'flex-end' } });
