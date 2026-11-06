import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { FormField } from '../../src/components/core/FormField';
import { renderUI } from './helpers';
test.each(['settings', 'editor'] as const)('%s field forwards text input options and events', variant => {
  const onChange = jest.fn(); const screen = renderUI(<FormField label="Token" variant={variant} accessibilityLabel="Secret token" secureTextEntry value="" onChangeText={onChange} />);
  const input = screen.getByLabelText('Secret token'); expect(input.props.secureTextEntry).toBe(true);
  fireEvent.changeText(input, 'value'); expect(onChange).toHaveBeenCalledWith('value');
});
