import React from 'react';
import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';
import { useAppTheme, type AppColors, fonts, radii } from '../../theme';

export type FormFieldProps = TextInputProps & { label: string; variant?: 'settings' | 'editor' };
export function FormField({ label, variant = 'settings', style, ...props }: FormFieldProps) {
  const { colors } = useAppTheme(); const s = styles(colors);
  return <View style={variant === 'editor' ? s.editorField : s.field}><Text style={variant === 'editor' ? s.editorLabel : s.label}>{label}</Text><TextInput {...props} accessibilityLabel={props.accessibilityLabel ?? label} placeholderTextColor={props.placeholderTextColor ?? colors.subtle} style={[s.input, variant === 'editor' && s.editorInput, style]} /></View>;
}
const styles = (c: AppColors) => StyleSheet.create({ field: { gap: 5 }, editorField: { gap: 4 }, label: { color: c.text, fontSize: 12, fontWeight: '600' }, editorLabel: { color: c.muted, fontFamily: fonts.mono, fontSize: 10 }, input: { color: c.text, backgroundColor: c.surfaceRaised, borderRadius: radii.md, paddingHorizontal: 12, paddingVertical: 8, minHeight: 42 }, editorInput: { backgroundColor: c.surfaceLowest, minHeight: 40, fontSize: 13 } });
