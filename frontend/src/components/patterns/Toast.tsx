import React from 'react';
import Toast, { BaseToast, ErrorToast, type ToastConfig } from 'react-native-toast-message';
import { useAppTheme } from '../../theme';

/** Mount once at the root, inside JobBuddyThemeProvider. */
export function ToastHost() {
  const { colors } = useAppTheme();
  const config: ToastConfig = {
    success: props => <BaseToast {...props} style={{ backgroundColor: colors.surface, borderLeftColor: colors.success }} text1Style={{ color: colors.text }} text2Style={{ color: colors.muted }} />,
    error: props => <ErrorToast {...props} style={{ backgroundColor: colors.surface, borderLeftColor: colors.error }} text1Style={{ color: colors.text }} text2Style={{ color: colors.muted }} />,
    info: props => <BaseToast {...props} style={{ backgroundColor: colors.surface, borderLeftColor: colors.primary }} text1Style={{ color: colors.text }} text2Style={{ color: colors.muted }} />,
  };
  return <Toast config={config} />;
}
export function showToast(type: 'success' | 'error' | 'info', title: string, message?: string) { Toast.show({ type, text1: title, text2: message }); }
