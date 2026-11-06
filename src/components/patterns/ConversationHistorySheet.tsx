import React, { useEffect, useRef } from 'react';
import { Animated, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme, type AppColors } from '../../theme';
import { IconAction } from '../core';
import { BottomSheet } from './BottomSheet';
import { SessionRow, type SessionItem } from './Copilot';
export function ConversationHistorySheet({ visible, sessions, onClose, onSelect }: { visible: boolean; sessions: SessionItem[]; onClose: () => void; onSelect: (id: string) => void }) {
  const { width } = useWindowDimensions();
  const desktop = Platform.OS === 'web' && width >= 1024;
  return desktop
    ? <DesktopHistoryDrawer visible={visible} sessions={sessions} onClose={onClose} onSelect={onSelect} />
    : <MobileHistorySheet visible={visible} sessions={sessions} onClose={onClose} onSelect={onSelect} />;
}
function MobileHistorySheet({ visible, sessions, onClose, onSelect }: { visible: boolean; sessions: SessionItem[]; onClose: () => void; onSelect: (id: string) => void }) {
  const { colors } = useAppTheme();
  return <BottomSheet visible={visible} onClose={onClose} title="Conversation history" closeLabel="Close conversation history"><ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>{sessions.length ? sessions.map(item => <SessionRow key={item.id} item={item} onPress={id => { onClose(); onSelect(id); }} />) : <Text style={{ color: colors.muted }}>No conversations yet.</Text>}</ScrollView></BottomSheet>;
}
function DesktopHistoryDrawer({ visible, sessions, onClose, onSelect }: { visible: boolean; sessions: SessionItem[]; onClose: () => void; onSelect: (id: string) => void }) {
  const { colors } = useAppTheme();
  const { width } = useWindowDimensions();
  const drawerWidth = Math.min(420, width * 0.92);
  const translateX = useRef(new Animated.Value(drawerWidth)).current;
  const styles = makeStyles(colors);
  useEffect(() => {
    if (visible) {
      translateX.setValue(drawerWidth);
      Animated.spring(translateX, { toValue: 0, useNativeDriver: true, damping: 25, stiffness: 240 }).start();
    }
  }, [drawerWidth, translateX, visible]);
  return <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
    <View style={styles.overlay}>
      <Pressable accessibilityRole="button" accessibilityLabel="Close conversation history" onPress={onClose} style={styles.backdrop} />
      <Animated.View accessibilityViewIsModal style={[styles.drawer, { width: drawerWidth, transform: [{ translateX }] }]}>
        <SafeAreaView edges={['top', 'bottom']} style={styles.drawerContent}>
          <View style={styles.header}><View style={styles.headerText}><Text accessibilityRole="header" style={styles.title}>Conversation history</Text><Text style={styles.subtitle}>{sessions.length} {sessions.length === 1 ? 'conversation' : 'conversations'}</Text></View><IconAction icon="close" label="Close conversation history" onPress={onClose} /></View>
          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>{sessions.length ? sessions.map(item => <SessionRow key={item.id} item={item} onPress={id => { onClose(); onSelect(id); }} />) : <Text style={styles.empty}>No conversations yet.</Text>}</ScrollView>
        </SafeAreaView>
      </Animated.View>
    </View>
  </Modal>;
}
const makeStyles = (c: AppColors) => StyleSheet.create({ overlay: { flex: 1, justifyContent: 'flex-start', alignItems: 'flex-end' }, backdrop: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: '#00000066' }, drawer: { height: '100%', backgroundColor: c.background, borderLeftWidth: 1, borderLeftColor: c.border + '88', shadowColor: '#000', shadowOffset: { width: -8, height: 0 }, shadowOpacity: 0.2, shadowRadius: 20, elevation: 18 }, drawerContent: { flex: 1 }, header: { minHeight: 72, flexDirection: 'row', alignItems: 'center', paddingLeft: 20, paddingRight: 12, borderBottomWidth: 1, borderBottomColor: c.border + '55' }, headerText: { flex: 1, gap: 3 }, title: { color: c.text, fontSize: 18, fontWeight: '700' }, subtitle: { color: c.muted, fontSize: 12 }, empty: { color: c.muted, padding: 16 }, content: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 } });
const styles = StyleSheet.create({ content: { paddingHorizontal: 16, paddingVertical: 8, gap: 8 } });
