import React from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Pdf from 'react-native-pdf';
import { useAppTheme, type AppColors, radii } from '../../theme';

/** Displays a PDF produced by the host's TeX compiler. URI can be a local file or HTTPS URL. */
export function DocumentPreview({ uri, onError, onLoadComplete, style }: { uri: string; onError?: (error: Error) => void; onLoadComplete?: (pageCount: number) => void; style?: StyleProp<ViewStyle> }) {
  const { colors } = useAppTheme();
  const styles = makeStyles(colors);
  return <Pdf source={{ uri, cache: false }} trustAllCerts={false} onError={onError} onLoadComplete={onLoadComplete} style={[styles.preview, style]} />;
}
const makeStyles = (colors: AppColors) => StyleSheet.create({ preview: { width: '100%', height: 500, backgroundColor: colors.surfaceLowest, borderRadius: radii.lg } });
