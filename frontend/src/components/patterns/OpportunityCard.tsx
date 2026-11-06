import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAppTheme, type AppColors, radii, fonts } from '../../theme';
import { Card, AppIcon, Badge, NativeButton, SmallButton } from '../core';

export type Opportunity = { id: string; company: string; initials: string; role: string; deadline?: string; employment: string; compensation?: string; status: string; statusIcon?: string; verified?: boolean };
export type OpportunityAction = { id: string; label: string; icon: string; variant?: 'default' | 'primary' | 'lightPrimary' };
export function OpportunityCard({ opportunity, actions, onAction, onLongPress }: { opportunity: Opportunity; actions: OpportunityAction[]; onAction: (opportunityId: string, actionId: string) => void; onLongPress?: () => void }) {
  const { colors } = useAppTheme();
  const styles = makeStyles(colors);
  return <Pressable accessible={false} onLongPress={onLongPress} delayLongPress={380}><Card style={styles.card}>
    <View style={styles.row}><NativeButton accessibilityLabel={`View details for ${opportunity.company}`} onPress={() => onAction(opportunity.id, 'view')} style={styles.identity}><View style={styles.avatar}><Text style={styles.initials}>{opportunity.initials}</Text></View><View style={styles.identityText}><View style={styles.row}><Text style={styles.company}>{opportunity.company}</Text>{opportunity.verified && <AppIcon name="check-decagram" size={14} color={colors.success} />}</View><Text style={styles.role}>{opportunity.role}</Text></View></NativeButton>{opportunity.deadline && <Badge label={opportunity.deadline} tone="secondary" />}</View>
    <View style={styles.details}><Text style={styles.detail}>{opportunity.employment}</Text>{opportunity.compensation && <Text style={styles.compensation}>{opportunity.compensation}</Text>}</View>
    <View style={styles.footer}><View style={styles.status}><AppIcon name={opportunity.statusIcon ?? 'briefcase-outline'} size={15} color={colors.secondary} /><Text style={styles.detail}>{opportunity.status}</Text></View><View style={styles.actions}>{actions.filter(action => action.id !== 'view').map(action => <SmallButton key={action.id} {...action} onPress={() => onAction(opportunity.id, action.id)} />)}</View></View>
  </Card></Pressable>;
}
const makeStyles = (colors: AppColors) => StyleSheet.create({
  card: { gap: 8 }, row: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap', justifyContent: 'space-between' }, identity: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1, minWidth: 140 }, identityText: { flex: 1 }, avatar: { width: 40, height: 40, borderRadius: radii.md, backgroundColor: colors.surfaceRaised, alignItems: 'center', justifyContent: 'center' }, initials: { color: colors.primary, fontSize: 16, fontWeight: '600' }, company: { color: colors.text, fontSize: 16, fontWeight: '600', flexShrink: 1 }, role: { color: colors.text, fontSize: 14, fontWeight: '600' }, details: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 8, padding: 10, borderRadius: radii.md, backgroundColor: colors.surfaceLowest }, detail: { color: colors.muted, fontSize: 12 }, compensation: { color: colors.success, fontSize: 12, fontFamily: fonts.mono }, footer: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 8 }, status: { flexDirection: 'row', alignItems: 'center', gap: 6 }, actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
