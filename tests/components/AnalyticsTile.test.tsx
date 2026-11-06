import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { AnalyticsTile } from '../../src/components/patterns/Analytics';
import { renderUI } from './helpers';
test('renders a metric and delegates its action', () => {
  const press = jest.fn(); const screen = renderUI(<AnalyticsTile metric={{ label: 'Resumes', value: '3', icon: 'file' }} onPress={press} />);
  fireEvent.press(screen.getByRole('button', { name: 'Resumes: 3' })); expect(press).toHaveBeenCalledTimes(1);
});
