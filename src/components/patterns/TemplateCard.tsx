import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAppTheme, type AppColors, fonts, radii } from '../../theme';
import { Card, AppIcon, Badge, IconAction, SmallButton, type IconName } from '../core';

export type TemplateAction = { id: string; label: string; icon: IconName; variant?: 'default' | 'primary' | 'lightPrimary' };
export type TemplatePlaceholder = {
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  required?: boolean;
  maxLength?: number;
  maxItems?: number;
  itemMaxLength?: number;
  maxProperties?: number;
  keyMaxLength?: number;
  item?: string | TemplatePlaceholder | Record<string, TemplatePlaceholder>;
  items?: string | TemplatePlaceholder;
};
export type TemplateCardData = {
  id: string;
  title: string;
  description: string;
  icon: IconName;
  iconColor?: string;
  badge?: { label: string; tone?: 'neutral' | 'primary' | 'success' | 'secondary' };
  bookmarked?: boolean;
};
export type TemplateCardProps = {
  template: TemplateCardData;
  actions: TemplateAction[];
  onAction: (templateId: string, actionId: string) => void;
  onBookmark?: (templateId: string) => void;
};

/** Content and available actions are supplied by the caller, including for private templates. */
export function TemplateCard({ template, actions, onAction, onBookmark }: TemplateCardProps) {
  const { colors } = useAppTheme();
  const styles = makeStyles(colors);
  return <Card style={styles.card}>
    <View style={styles.header}>
      <View style={styles.identity}>
        <View style={styles.icon}><AppIcon name={template.icon} size={18} color={template.iconColor ?? colors.secondary} /></View>
        <View style={styles.text}>
          <View style={styles.titleRow}><Text style={styles.title}>{template.title}</Text>{template.badge && <Badge label={template.badge.label} tone={template.badge.tone} />}</View>
          <Text style={styles.description}>{template.description}</Text>
        </View>
      </View>
      {onBookmark && <IconAction icon={template.bookmarked ? 'bookmark' : 'bookmark-outline'} label={`${template.bookmarked ? 'Remove bookmark from' : 'Bookmark'} ${template.title}`} onPress={() => onBookmark(template.id)} />}
    </View>
    <View style={styles.actions}>{actions.map(action => <SmallButton key={action.id} label={action.label} icon={action.icon} variant={action.variant} onPress={() => onAction(template.id, action.id)} />)}</View>
  </Card>;
}
const makeStyles = (colors: AppColors) => StyleSheet.create({
  card: { gap: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 },
  identity: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  icon: { width: 32, height: 32, borderRadius: radii.md, backgroundColor: colors.surfaceRaised, alignItems: 'center', justifyContent: 'center' },
  text: { flex: 1 }, titleRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 6 },
  title: { color: colors.text, fontSize: 16, fontWeight: '600', flexShrink: 1 },
  description: { color: colors.subtle, fontFamily: fonts.mono, fontSize: 11, marginTop: 2 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8 },
});
