import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { AppIcon, SmallButton } from '../core';
import { useAppTheme, type AppColors, radii } from '../../theme';
import { BottomSheet } from './BottomSheet';

export type ResumePdfFile = { uri: string; name: string };
export function ImportResumePdfSheet({ visible, onClose, onImport }: { visible: boolean; onClose: () => void; onImport: (file: ResumePdfFile) => void }) {
  const { colors } = useAppTheme(); const s = makeStyles(colors); const [file, setFile] = useState<ResumePdfFile | null>(null);
  const choosePdf = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf', copyToCacheDirectory: true, multiple: false });
    if (!result.canceled && result.assets[0]) setFile({ uri: result.assets[0].uri, name: result.assets[0].name });
  };
  const close = () => { setFile(null); onClose(); };
  return <BottomSheet visible={visible} title="Create from PDF" closeLabel="Close PDF import" height="62%" onClose={close}>
    <View style={s.content}>
      <View style={s.info}><AppIcon name="creation-outline" size={28} color={colors.primary} /><Text style={s.heading}>Reverse-engineer a resume</Text><Text style={s.description}>Upload an existing resume PDF. An AI service can turn it into editable LaTeX after that service is connected.</Text></View>
      {file ? <View style={s.file}><AppIcon name="file-pdf-box" size={20} color={colors.error} /><Text numberOfLines={1} style={s.fileName}>{file.name}</Text></View> : <Text style={s.hint}>PDF files only</Text>}
      <View style={s.actions}><SmallButton label={file ? 'Choose another PDF' : 'Choose PDF'} icon="file-upload-outline" variant="lightPrimary" onPress={choosePdf} style={s.button} />{file && <SmallButton label="Continue" icon="arrow-right" variant="primary" onPress={() => { onImport(file); close(); }} style={s.button} />}</View>
    </View>
  </BottomSheet>;
}

const makeStyles = (c: AppColors) => StyleSheet.create({ content: { flex: 1, justifyContent: 'center', padding: 20, gap: 18 }, info: { alignItems: 'center', gap: 10 }, heading: { color: c.text, fontSize: 17, fontWeight: '700' }, description: { maxWidth: 300, color: c.muted, fontSize: 12, lineHeight: 18, textAlign: 'center' }, hint: { color: c.subtle, fontSize: 11, textAlign: 'center' }, file: { minHeight: 48, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 12, backgroundColor: c.surface, borderRadius: radii.md }, fileName: { flex: 1, color: c.text, fontSize: 12 }, actions: { gap: 8 }, button: { minHeight: 44 } });
