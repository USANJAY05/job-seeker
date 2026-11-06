import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppIcon } from '../components/core';
import { useAppTheme, type AppColors, radii } from '../theme';

export type AuthMode = 'sign-in' | 'create-account';
export type AuthSubmission = { mode: AuthMode; email: string; password: string; name?: string };
export function AuthScreen({ onSubmit, onForgotPassword }: { onSubmit: (submission: AuthSubmission) => void; onForgotPassword?: () => void }) {
  const { colors } = useAppTheme(); const s = makeStyles(colors);
  const [mode, setMode] = useState<AuthMode>('sign-in'); const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [passwordVisible, setPasswordVisible] = useState(false); const [error, setError] = useState('');
  const createAccount = mode === 'create-account';
  const submit = () => {
    const normalizedEmail = email.trim();
    if (createAccount && !name.trim()) { setError('Enter your name to continue.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) { setError('Enter a valid email address.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setError(''); onSubmit({ mode, email: normalizedEmail, password, ...(createAccount ? { name: name.trim() } : {}) });
  };
  return <SafeAreaView edges={['top', 'bottom']} style={s.safe}>
    <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={s.page}>
          <View style={s.brand}><View style={s.brandIcon}><AppIcon name="briefcase-check-outline" size={26} color={colors.onStrong} /></View><Text style={s.brandName}>Job Buddy</Text><Text style={s.brandCaption}>CAREER WORKSPACE</Text></View>
          <View style={s.card}>
            <View style={s.heading}><Text style={s.title}>{createAccount ? 'Create your account' : 'Welcome back'}</Text><Text style={s.subtitle}>{createAccount ? 'Build and manage your career materials in one place.' : 'Sign in to continue to your career workspace.'}</Text></View>
            {createAccount && <View style={s.field}><Text style={s.label}>FULL NAME</Text><TextInput accessibilityLabel="Full name" value={name} onChangeText={setName} placeholder="Your name" placeholderTextColor={colors.subtle} autoCapitalize="words" style={s.input} returnKeyType="next" /></View>}
            <View style={s.field}><Text style={s.label}>EMAIL ADDRESS</Text><TextInput accessibilityLabel="Email address" value={email} onChangeText={setEmail} placeholder="you@example.com" placeholderTextColor={colors.subtle} autoCapitalize="none" autoCorrect={false} keyboardType="email-address" textContentType="emailAddress" style={s.input} returnKeyType="next" /></View>
            <View style={s.field}><View style={s.labelRow}><Text style={s.label}>PASSWORD</Text>{!createAccount && <Pressable accessibilityRole="button" onPress={onForgotPassword}><Text style={s.link}>Forgot password?</Text></Pressable>}</View><View style={s.passwordWrap}><TextInput accessibilityLabel="Password" value={password} onChangeText={setPassword} placeholder="At least 8 characters" placeholderTextColor={colors.subtle} secureTextEntry={!passwordVisible} textContentType={createAccount ? 'newPassword' : 'password'} style={s.passwordInput} returnKeyType="done" onSubmitEditing={submit} /><Pressable accessibilityRole="button" accessibilityLabel={passwordVisible ? 'Hide password' : 'Show password'} onPress={() => setPasswordVisible(value => !value)} hitSlop={8}><AppIcon name={passwordVisible ? 'eye-off-outline' : 'eye-outline'} color={colors.muted} /></Pressable></View></View>
            {!!error && <Text accessibilityRole="alert" style={s.error}>{error}</Text>}
            <Pressable accessibilityRole="button" onPress={submit} style={({ pressed }) => [s.submit, pressed && s.pressed]}><Text style={s.submitText}>{createAccount ? 'Create account' : 'Sign in'}</Text><AppIcon name="arrow-right" size={18} color={colors.onStrong} /></Pressable>
            <View style={s.switchRow}><Text style={s.switchText}>{createAccount ? 'Already have an account?' : 'New to Job Buddy?'}</Text><Pressable accessibilityRole="button" onPress={() => { setError(''); setMode(createAccount ? 'sign-in' : 'create-account'); }}><Text style={s.link}>{createAccount ? 'Sign in' : 'Create account'}</Text></Pressable></View>
          </View>
          <View style={s.note}><AppIcon name="information-outline" size={14} color={colors.subtle} /><Text style={s.noteText}>Preview mode · Authentication will connect when the API is ready.</Text></View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  </SafeAreaView>;
}

const makeStyles = (c: AppColors) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: c.background }, flex: { flex: 1 }, scroll: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 20, paddingVertical: 28 }, page: { width: '100%', maxWidth: 440, alignSelf: 'center', gap: 22 },
  brand: { alignItems: 'center', gap: 5 }, brandIcon: { width: 54, height: 54, alignItems: 'center', justifyContent: 'center', borderRadius: 18, backgroundColor: c.primaryStrong, marginBottom: 6 }, brandName: { color: c.text, fontSize: 23, fontWeight: '800', letterSpacing: -0.5 }, brandCaption: { color: c.subtle, fontSize: 9, fontWeight: '700', letterSpacing: 2 },
  card: { gap: 18, padding: 20, backgroundColor: c.surface, borderWidth: 1, borderColor: c.border + '55', borderRadius: radii.xl }, heading: { gap: 6, marginBottom: 2 }, title: { color: c.text, fontSize: 22, fontWeight: '700' }, subtitle: { color: c.muted, fontSize: 13, lineHeight: 19 },
  field: { gap: 7 }, labelRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, label: { color: c.muted, fontSize: 10, fontWeight: '700', letterSpacing: 0.7 }, input: { minHeight: 48, paddingHorizontal: 13, borderRadius: radii.md, backgroundColor: c.surfaceLowest, borderWidth: 1, borderColor: c.border + '66', color: c.text, fontSize: 14 }, passwordWrap: { minHeight: 48, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 13, borderRadius: radii.md, backgroundColor: c.surfaceLowest, borderWidth: 1, borderColor: c.border + '66' }, passwordInput: { flex: 1, minWidth: 0, color: c.text, fontSize: 14 }, link: { color: c.primary, fontSize: 12, fontWeight: '600' }, error: { color: c.error, fontSize: 12 },
  submit: { minHeight: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 2, borderRadius: radii.md, backgroundColor: c.primaryStrong }, submitText: { color: c.onStrong, fontSize: 14, fontWeight: '700' }, pressed: { opacity: 0.82 }, switchRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 5 }, switchText: { color: c.muted, fontSize: 12 },
  note: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }, noteText: { color: c.subtle, fontSize: 10, textAlign: 'center' },
});
