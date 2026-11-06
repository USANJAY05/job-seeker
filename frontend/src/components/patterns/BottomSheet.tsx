import React from 'react';
import { Modal, Platform, Pressable, StyleSheet, Text, View, useWindowDimensions, type DimensionValue } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconAction } from '../core';
import { useAppTheme, type AppColors } from '../../theme';

/** Shared sheet API; iOS presents a native page sheet, Android slides a native modal up. */
export function BottomSheet({ visible, title, onClose, closeLabel, children, height = '96%' }: { visible: boolean; title: string; onClose: () => void; closeLabel: string; children: React.ReactNode; height?: DimensionValue }) {
  const { colors } = useAppTheme();
  const styles = makeStyles(colors);
  const { width, height: viewportHeight } = useWindowDimensions();
  const desktop = Platform.OS === 'web' && width >= 1024;
  const ios = Platform.OS === 'ios';
  const sheetHeight = typeof height === 'number' ? height : height ?? '96%';

  return <Modal
    visible={visible}
    transparent={!ios}
    animationType={desktop ? 'fade' : 'slide'}
    presentationStyle={ios ? 'pageSheet' : 'overFullScreen'}
    allowSwipeDismissal={ios}
    onRequestClose={onClose}
    statusBarTranslucent={!ios}>
    <View style={[styles.modalRoot, ios && styles.iosRoot]}>
      {!ios && <Pressable accessibilityRole="button" accessibilityLabel={`${closeLabel} backdrop`} onPress={onClose} style={styles.backdrop} />}
      <View style={[styles.overlay, desktop && styles.desktopOverlay]}>
        <View style={[styles.sheet, ios && styles.iosSheet, desktop && { height: Math.min(viewportHeight - 80, 900), width: Math.min(width - 64, 760) }, !ios && !desktop && { height: sheetHeight }]} accessibilityViewIsModal>
          <SafeAreaView edges={ios ? ['top', 'bottom'] : ['bottom']} style={styles.safeArea}>
            <View style={styles.header}>
              <Text accessibilityRole="header" style={styles.title}>{title}</Text>
              <IconAction icon="close" label={closeLabel} onPress={onClose} />
            </View>
            <View style={styles.body}>{children}</View>
          </SafeAreaView>
        </View>
      </View>
    </View>
  </Modal>;
}

const makeStyles = (c: AppColors) => StyleSheet.create({
  modalRoot: { flex: 1, justifyContent: 'flex-end' },
  iosRoot: { backgroundColor: c.background },
  backdrop: { ...StyleSheet.absoluteFill, backgroundColor: '#00000088' },
  overlay: { flex: 1, justifyContent: 'flex-end' },
  desktopOverlay: { justifyContent: 'center', alignItems: 'center' },
  sheet: { width: '100%', alignSelf: 'stretch', backgroundColor: c.background, borderTopLeftRadius: 28, borderTopRightRadius: 28, overflow: 'hidden' },
  iosSheet: { flex: 1, borderTopLeftRadius: 0, borderTopRightRadius: 0 },
  safeArea: { flex: 1, backgroundColor: c.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4 },
  title: { flex: 1, color: c.text, fontSize: 18, fontWeight: '700' },
  body: { flex: 1, minHeight: 0 },
});
