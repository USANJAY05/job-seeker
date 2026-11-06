import { demoEmailConfiguration } from '../../src/mocks/emailConfiguration.mock';
import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { EmailConfigurationScreen } from '../../src/screens/EmailConfigurationScreen';
import { renderUI } from './helpers';
test('email protocol switches fields and discard clears the draft', () => {
  const screen = renderUI(<EmailConfigurationScreen initial={demoEmailConfiguration} onBack={jest.fn()} onAction={jest.fn()} />);
  expect(screen.getByLabelText('API Token Key').props.secureTextEntry).toBe(true);
  fireEvent.press(screen.getByRole('radio', { name: 'SMTP Server' }));
  fireEvent.changeText(screen.getByLabelText('SMTP Host'), 'smtp.example.com');
  fireEvent.press(screen.getByLabelText('Discard Changes'));
  expect(screen.getByLabelText('API Token Key').props.value).toBe('');
  fireEvent.press(screen.getByRole('radio', { name: 'SMTP Server' }));
  expect(screen.getByLabelText('SMTP Host').props.value).toBe('');
});
