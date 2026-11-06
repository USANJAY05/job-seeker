import * as DocumentPicker from 'expo-document-picker';

export type ChatAttachment = DocumentPicker.DocumentPickerAsset;

/** Opens the platform's native document picker (or the browser's file picker on web). */
export async function pickChatAttachment(): Promise<ChatAttachment | null> {
  const result = await DocumentPicker.getDocumentAsync({ type: '*/*', copyToCacheDirectory: true, multiple: false });
  return result.canceled ? null : result.assets[0] ?? null;
}
