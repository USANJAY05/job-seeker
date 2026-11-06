import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAppTheme, type AppColors, fonts, radii } from '../../theme';
import { Card, AppIcon, Badge } from '../core';

export type ResumeCardData = { id: string; filename: string; target: string; targetIcon?: string; status: string; statusTone?: 'primary' | 'success' | 'secondary' | 'neutral'; atsScore?: number; engine: string; skills: string[]; extraSkillCount?: number; compiledLabel: string; compileStatus: string; /** Retained for compatibility; cards use a consistent appearance. */ highlighted?: boolean; pages?: number };
export type ResumeCardProps = { resume: ResumeCardData; onMore: (id: string) => void; onPreview?: (id: string) => void; onDuplicate?: (id: string) => void; onOpen?: (id: string) => void };
export function ResumeCard({ resume, onMore, onPreview }: ResumeCardProps) {
  const { colors } = useAppTheme(); const styles = makeStyles(colors);
  return <Pressable accessibilityRole="button" accessibilityLabel={`Open PDF preview for ${resume.filename}`} accessibilityHint="Long press for resume actions." onPress={() => onPreview?.(resume.id)} onLongPress={() => onMore(resume.id)} delayLongPress={380}><Card testID={`resume-card-${resume.id}`} style={styles.card}>
    <View style={styles.top}>
      <View style={styles.thumbnail}>
        <AppIcon name="file-document-outline" size={22} color={colors.primary} />
        <Text style={styles.thumbText}>{resume.pages ?? 1} {(resume.pages ?? 1) === 1 ? 'PAGE' : 'PAGES'}</Text>
      </View>
      <View style={styles.details}>
        <View style={styles.heading}>
          <View style={styles.headingText}><Text numberOfLines={1} style={styles.filename}>{resume.filename}</Text><View style={styles.target}><AppIcon name={resume.targetIcon ?? 'target'} size={14} color={colors.subtle} /><Text numberOfLines={1} style={styles.targetText}>{resume.target}</Text></View></View>
        </View>
        <View style={styles.badges}><Badge label={resume.status} tone={resume.statusTone} dot />{resume.atsScore != null && <Badge label={`${resume.atsScore}% ATS`} tone="neutral" />}<Badge label={resume.engine} tone="secondary" />{resume.skills.map((skill, index) => <Badge key={`${skill}-${index}`} label={skill} />)}{(resume.extraSkillCount ?? 0) > 0 && <Badge label={`+${resume.extraSkillCount} more`} />}</View>
      </View>
    </View>
    <View style={styles.meta}><AppIcon name="clock-outline" size={14} color={colors.subtle} /><Text style={styles.metaText}>{resume.compiledLabel} · {resume.compileStatus}</Text></View>

  </Card></Pressable>;
}
const makeStyles = (colors: AppColors) => StyleSheet.create({
  card: { borderWidth: 0, borderRadius: radii.xl, padding: 10, gap: 6 },
  top: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  thumbnail: { width: 42, height: 50, borderRadius: radii.md, backgroundColor: colors.surfaceRaised, alignItems: 'center', justifyContent: 'center', gap: 2 },
  thumbText: { fontSize: 8, color: colors.muted, fontFamily: fonts.mono },
  details: { flex: 1, minWidth: 0, gap: 4 }, heading: { flexDirection: 'row', alignItems: 'flex-start' }, headingText: { flex: 1, minWidth: 0, gap: 2 },
  filename: { fontFamily: fonts.mono, fontSize: 13, fontWeight: '600', lineHeight: 18, color: colors.text }, target: { flexDirection: 'row', alignItems: 'flex-start', gap: 4 }, targetText: { flex: 1, color: colors.muted, fontSize: 12, lineHeight: 16 },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 }, meta: { flexDirection: 'row', alignItems: 'center', gap: 6 }, metaText: { color: colors.muted, fontSize: 11, flexShrink: 1 },
});
