import React, { useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { AppIcon, SmallButton } from '../core';
import { useAppTheme, type AppColors, radii } from '../../theme';
import { BottomSheet } from './BottomSheet';

export type JobDescriptionInput = { type: 'link' | 'text' | 'screenshot'; value: string };
type InputMode = JobDescriptionInput['type'];
const modes: { id: InputMode; label: string; icon: string }[] = [
  { id: 'link', label: 'Link', icon: 'link-variant' },
  { id: 'text', label: 'Text', icon: 'text' },
  { id: 'screenshot', label: 'Screenshot', icon: 'image-outline' },
];

/** Collects a JD source before handing it to the host's import/API flow. */
export function AddJobDescriptionSheet({ visible, onClose, onAdd }: { visible: boolean; onClose: () => void; onAdd: (input: JobDescriptionInput) => void }) {
  const { colors } = useAppTheme(); const s = makeStyles(colors);
  const [mode, setMode] = useState<InputMode>('link');
  const [link, setLink] = useState(''); const [text, setText] = useState(''); const [imageUri, setImageUri] = useState<string | null>(null);
  const value = mode === 'link' ? link.trim() : mode === 'text' ? text.trim() : imageUri ?? '';
  const chooseImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) { Alert.alert('Photo access needed', 'Allow photo library access to attach a job description screenshot.'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, quality: 0.85 });
    if (!result.canceled) setImageUri(result.assets[0]?.uri ?? null);
  };
  const submit = () => { if (!value) return; onAdd({ type: mode, value }); onClose(); };
  return <BottomSheet visible={visible} title="Add job description" closeLabel="Close add job description" height="82%" onClose={onClose}>
    <View style={s.content}>
      <Text style={s.subtitle}>Add an opportunity using its job description.</Text>
      <View accessibilityRole="tablist" style={s.modeRow}>{modes.map(item => {
        const selected = mode === item.id;
        return <Pressable key={item.id} accessibilityRole="tab" accessibilityState={{ selected }} onPress={() => setMode(item.id)} style={[s.mode, selected && s.modeSelected]}>
          <AppIcon name={item.icon} size={16} color={selected ? colors.primary : colors.muted} /><Text style={[s.modeText, selected && s.modeTextSelected]}>{item.label}</Text>
        </Pressable>;
      })}</View>
      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={s.form}>
        {mode === 'link' && <><Text style={s.label}>JOB POSTING LINK</Text><TextInput accessibilityLabel="Job posting link" value={link} onChangeText={setLink} placeholder="https://company.com/careers/role" placeholderTextColor={colors.subtle} autoCapitalize="none" autoCorrect={false} keyboardType="url" style={s.input} /></>}
        {mode === 'text' && <><Text style={s.label}>JOB DESCRIPTION</Text><TextInput accessibilityLabel="Job description text" value={text} onChangeText={setText} placeholder="Paste the job title, responsibilities, and requirements…" placeholderTextColor={colors.subtle} multiline textAlignVertical="top" style={[s.input, s.textArea]} /></>}
        {mode === 'screenshot' && <View style={s.uploadArea}>{imageUri ? <><Image source={{ uri: imageUri }} resizeMode="contain" style={s.preview} /><Text numberOfLines={1} style={s.fileName}>Screenshot selected</Text></> : <><AppIcon name="image-plus" size={32} color={colors.primary} /><Text style={s.uploadTitle}>Choose a JD screenshot</Text><Text style={s.uploadHint}>Select an image from your photo library.</Text></>}<SmallButton label={imageUri ? 'Choose another' : 'Choose screenshot'} icon="image-outline" variant="lightPrimary" onPress={chooseImage} /></View>}
      </ScrollView>
      <View style={s.footer}><SmallButton label="Cancel" icon="close" onPress={onClose} style={s.button} /><SmallButton label="Continue" icon="arrow-right" variant="primary" onPress={submit} disabled={!value} style={s.button} /></View>
    </View>
  </BottomSheet>;
}

const makeStyles = (c: AppColors) => StyleSheet.create({
  content: { flex: 1 }, subtitle: { color: c.muted, fontSize: 12, paddingHorizontal: 16, paddingTop: 8 },
  modeRow: { flexDirection: 'row', marginHorizontal: 16, marginTop: 16, padding: 4, borderRadius: radii.lg, backgroundColor: c.surfaceLowest },
  mode: { flex: 1, minHeight: 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: radii.md }, modeSelected: { backgroundColor: c.primaryContainer },
  modeText: { color: c.muted, fontSize: 11, fontWeight: '600' }, modeTextSelected: { color: c.onPrimaryContainer },
  form: { flexGrow: 1, padding: 16, gap: 8 }, label: { color: c.muted, fontSize: 10, fontWeight: '700', letterSpacing: 0.6 },
  input: { minHeight: 46, borderRadius: radii.md, paddingHorizontal: 12, paddingVertical: 10, color: c.text, backgroundColor: c.surface, borderWidth: 1, borderColor: c.border + '66', fontSize: 13 }, textArea: { minHeight: 200, lineHeight: 20 },
  uploadArea: { minHeight: 250, alignItems: 'center', justifyContent: 'center', gap: 10, padding: 16, borderRadius: radii.lg, borderWidth: 1, borderStyle: 'dashed', borderColor: c.border, backgroundColor: c.surface },
  uploadTitle: { color: c.text, fontSize: 14, fontWeight: '700' }, uploadHint: { color: c.muted, fontSize: 11, textAlign: 'center' }, preview: { width: '100%', height: 180 }, fileName: { color: c.muted, fontSize: 11 },
  footer: { flexDirection: 'row', gap: 8, padding: 16, paddingTop: 8, borderTopWidth: StyleSheet.hairlineWidth, borderColor: c.border + '55' }, button: { flex: 1 },
});
