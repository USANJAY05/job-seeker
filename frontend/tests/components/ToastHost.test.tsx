import React from 'react';
import Toast from 'react-native-toast-message';
import { ToastHost, showToast } from '../../src/components/patterns/Toast';
import { renderUI } from './helpers';
test('shows a toast with its message', () => {
  renderUI(<ToastHost />);
  showToast('success', 'Saved', 'Changes applied');
  expect(Toast.show).toHaveBeenCalledWith({ type: 'success', text1: 'Saved', text2: 'Changes applied' });
});
