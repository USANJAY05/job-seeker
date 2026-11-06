import React from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppFooter } from '../components/patterns/AppFooter';
import { PageHeader } from '../components/patterns/Navigation';
import { IconAction } from '../components/core';
import { useAppTheme, type AppColors } from '../theme';

export type LibraryView = 'resumes' | 'templates';
export type LibraryShellProps = {
  title: string;
  view: LibraryView;
  resumeCount: number;
  templateCount: number;
  onViewChange: (view: LibraryView) => void;
  onNavigate: (destination: string) => void;
  headerAction?: React.ReactNode;
  floatingAction?: React.ReactNode;
  refreshControl?: React.ReactElement;
  children: React.ReactNode;
  scrollContent?: boolean;
};

/** Shared layout for the two library screens. The footer handles its own bottom inset. */
export function LibraryScreenShell({ title, view, onViewChange, onNavigate, headerAction, floatingAction, refreshControl, children, scrollContent = true }: LibraryShellProps) {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const styles = makeStyles(colors, Platform.OS === 'ios' ? insets.bottom + 64 : 0);
  return <SafeAreaView edges={['top']} style={styles.screen}>
    <PageHeader title={title} leading={view === 'templates' ? <IconAction icon="arrow-left" label="Back to My Resumes" onPress={() => onViewChange('resumes')} /> : undefined} action={<View style={styles.headerActions}>{view === 'resumes' && <IconAction icon="view-grid-outline" label="Explore Templates" onPress={() => onViewChange('templates')} />}{headerAction}</View>} />
    <View style={styles.contentArea}>
      {scrollContent ? <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" refreshControl={refreshControl} contentContainerStyle={[styles.content, { paddingBottom: 24 + (Platform.OS === 'ios' ? insets.bottom + 64 : 0) }]}>
        {children}
      </ScrollView> : children}
      {floatingAction && <View pointerEvents="box-none" style={styles.floating}>{floatingAction}</View>}
    </View>
    <AppFooter selectedId="resumes" onSelect={onNavigate} />
  </SafeAreaView>;
}
export function EmptyLibraryState({ message }: { message: string }) {
  const { colors } = useAppTheme();
  return <View style={makeStyles(colors).empty}><Text style={makeStyles(colors).emptyText}>{message}</Text></View>;
}
const makeStyles = (colors: AppColors, tabBarOffset = 0) => StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background }, headerActions: { flexDirection: 'row', alignItems: 'center' }, contentArea: { flex: 1 },
  content: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24, gap: 12 },
  floating: { position: 'absolute', right: 16, bottom: 16 + tabBarOffset, alignItems: 'flex-end', zIndex: 1 },
  empty: { backgroundColor: colors.surface, borderRadius: 12, padding: 20, alignItems: 'center' },
  emptyText: { color: colors.muted, fontSize: 13, textAlign: 'center' },
});
