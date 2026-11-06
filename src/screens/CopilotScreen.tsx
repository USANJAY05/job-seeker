import React, { useState } from 'react';
import { Alert, Keyboard, KeyboardAvoidingView, Platform, Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconAction } from '../components/core';
import { ConversationHistorySheet } from '../components/patterns/ConversationHistorySheet';
import { PageHeader } from '../components/patterns/Navigation';
import { AppFooter } from '../components/patterns/AppFooter';
import { pickChatAttachment, type ChatAttachment } from '../utils/pickChatAttachment';
import { MessageComposer, type ComposerShortcut, type ContextItem, type QuickAction, type SessionItem } from '../components/patterns/Copilot';
import { useAppTheme } from '../theme';

export type PromptAction = QuickAction & { prompt: string };
export type PromptShortcut = ComposerShortcut & { prompt: string };
export type CopilotScreenProps = { sessions: SessionItem[]; quickActions?: PromptAction[]; shortcuts?: PromptShortcut[]; context?: ContextItem[]; status?: string; onNavigate: (destination: string) => void; onOpenSession: (id: string) => void; onStartConversation: (message: string, attachment?: ChatAttachment) => void; onAttach?: (file: ChatAttachment) => void };
export function CopilotScreen({ sessions, onNavigate, onOpenSession, onStartConversation, onAttach }: CopilotScreenProps) {
  const { colors } = useAppTheme(); const { width } = useWindowDimensions(); const desktop = Platform.OS === 'web' && width >= 1024; const [message, setMessage] = useState(''); const [historyOpen, setHistoryOpen] = useState(false); const [attachment, setAttachment] = useState<ChatAttachment | undefined>(); const [composerCollapsed, setComposerCollapsed] = useState(false);
  const chooseAttachment = async () => { try { const file = await pickChatAttachment(); if (!file) return; setAttachment(file); onAttach?.(file); setMessage(current => current || `Please review the attached file: ${file.name}`); } catch { Alert.alert('Unable to open files', 'Please try again.'); } };
  return <KeyboardAvoidingView testID="chat-keyboard-container" behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={[styles.screen, { backgroundColor: colors.background }]}><SafeAreaView edges={['top']} style={styles.screen}>
    <PageHeader title="Chat" action={<IconAction icon="history" label="Conversation history" onPress={() => { Keyboard.dismiss(); setHistoryOpen(true); }} />} />
    <View testID="new-chat-center" style={[styles.center, desktop && styles.desktopCenter]}><Pressable testID="chat-dismiss-background" accessible={false} onPress={Keyboard.dismiss} style={StyleSheet.absoluteFill} /><View style={styles.composerFrame}><MessageComposer value={message} onChangeText={setMessage} onSend={value => { Keyboard.dismiss(); onStartConversation(value.trim(), attachment); setMessage(''); setAttachment(undefined); }} onAttach={onAttach ? chooseAttachment : undefined} context={attachment ? `Attached · ${attachment.name}` : undefined} placeholder="Paste a job posting or ask a question..." collapsible collapsed={composerCollapsed} onToggleCollapse={() => { Keyboard.dismiss(); setComposerCollapsed(value => !value); }} /></View></View>
    <ConversationHistorySheet visible={historyOpen} sessions={sessions} onClose={() => setHistoryOpen(false)} onSelect={onOpenSession} />
    <AppFooter selectedId="chat" onSelect={onNavigate} />
  </SafeAreaView></KeyboardAvoidingView>;
}
const styles = StyleSheet.create({ screen: { flex: 1 }, center: { flex: 1, justifyContent: 'center', paddingHorizontal: 16 }, desktopCenter: { paddingHorizontal: 40 }, composerFrame: { width: '100%', maxWidth: 900, alignSelf: 'center' } });
