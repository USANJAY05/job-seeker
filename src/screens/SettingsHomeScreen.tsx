import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { AppIcon, SmallButton } from '../components/core';
import { StatusCard } from '../components/patterns/Dashboard';
import { ChoiceList, SettingsSection, SettingsToggle } from '../components/patterns/Settings';
import { type ThemeMode } from '../theme';
import { SettingsScreenShell } from './SettingsScreenShell';
import { useAppTheme, type AppColors, radii } from '../theme';
export type SettingsDestination = 'fleet' | 'latex' | 'dispatch' | 'email' | 'profile' | 'retention';
type AccountProfile = { name: string; headline: string; email: string };
export function SettingsHomeScreen({ onOpen, onAction, onSignOut, themeMode, onThemeChange, profile }: { onOpen: (destination: SettingsDestination) => void; onAction?: (action: string) => void; onSignOut?: () => void; themeMode?: ThemeMode; onThemeChange?: (mode: ThemeMode) => void; profile?: AccountProfile }) {
  const { colors } = useAppTheme(); const styles = makeStyles(colors);
  const [human, setHuman] = useState(false); const [logs, setLogs] = useState(false);
  const groups: { title: string; entries: { id: SettingsDestination; title: string; description: string; icon: string }[] }[] = [
    { title: 'Core Operations', entries: [{ id: 'dispatch', title: 'Autonomous Dispatch', description: 'Velocity limits, approval gates & portals', icon: 'send-clock-outline' }, { id: 'fleet', title: 'Agent Fleet Control', description: 'Manage agents and routing', icon: 'robot-outline' }, { id: 'latex', title: 'LaTeX Engine', description: 'Compiler and page layout', icon: 'code-tags' }, { id: 'email', title: 'Email Configuration', description: 'Outgoing and incoming email', icon: 'email-outline' }] },
    { title: 'Preferences & Security', entries: [{ id: 'retention', title: 'Data Retention & Purge Policy', description: 'Manage preview retention rules', icon: 'shield-lock-outline' }] },
  ];
  const name = profile?.name?.trim() || 'Your profile';
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0].toUpperCase()).join('');
  const confirmSignOut = () => Alert.alert('Sign out?', 'You can sign back in to return to your workspace.', [{ text: 'Cancel', style: 'cancel' }, { text: 'Sign out', style: 'destructive', onPress: onSignOut }]);
  return <SettingsScreenShell title="Settings">
    <Pressable accessibilityRole="button" accessibilityLabel="Open profile settings" onPress={() => onOpen('profile')} style={styles.profileCard}><View style={styles.avatar}>{initials ? <Text style={styles.initials}>{initials}</Text> : <AppIcon name="account-outline" color={colors.onStrong} />}</View><View style={styles.profileText}><Text style={styles.profileName}>{name}</Text><Text numberOfLines={1} style={styles.profileDescription}>{profile?.headline || 'Complete your profile'}</Text>{!!profile?.email && <Text numberOfLines={1} style={styles.profileEmail}>{profile.email}</Text>}</View><AppIcon name="chevron-right" color={colors.subtle} /></Pressable>
    {themeMode && onThemeChange && <SettingsSection title="Appearance" icon="theme-light-dark"><ChoiceList selectedId={themeMode} onSelect={id => onThemeChange(id as ThemeMode)} items={[{ id: 'system', title: 'System' }, { id: 'light', title: 'Light' }, { id: 'dark', title: 'Dark' }]} /></SettingsSection>}
    {groups.map(group => <SettingsSection key={group.title} title={group.title}>{group.entries.map(item => <StatusCard key={item.id} title={item.title} description={item.description} icon={item.icon} onPress={() => onOpen(item.id)} />)}</SettingsSection>)}
    <SettingsSection title="Additional Controls" icon="cog-outline"><SettingsToggle title="Human Verification" value={human} onValueChange={setHuman} /><SettingsToggle title="Telemetry & Audit Logs" value={logs} onValueChange={setLogs} /><StatusCard title="API Keys & Integrations" description="Connection settings" icon="key-outline" onPress={() => onAction?.('API keys and integrations')} /><StatusCard title="Notifications & Webhooks" description="Alert and webhook settings" icon="bell-outline" onPress={() => onAction?.('Notifications and webhooks')} /></SettingsSection>
    <SettingsSection title="System Actions"><SmallButton label="Export Full System Configuration" icon="export" onPress={() => onAction?.('Export configuration')} /><SmallButton label="Sign out" icon="logout" onPress={confirmSignOut} /></SettingsSection>
  </SettingsScreenShell>;
}
const makeStyles = (c: AppColors) => StyleSheet.create({ profileCard: { minHeight: 86, flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, backgroundColor: c.surface, borderWidth: 1, borderColor: c.border + '55', borderRadius: radii.xl }, avatar: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center', borderRadius: 24, backgroundColor: c.primaryStrong }, initials: { color: c.onStrong, fontSize: 15, fontWeight: '700' }, profileText: { flex: 1, minWidth: 0, gap: 3 }, profileName: { color: c.text, fontSize: 15, fontWeight: '700' }, profileDescription: { color: c.muted, fontSize: 11 }, profileEmail: { color: c.subtle, fontSize: 10 } });
