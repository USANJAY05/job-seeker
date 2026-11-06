import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { ActionMenu } from '../../src/components/patterns/ActionMenu';
import { renderUI } from './helpers';
test('dispatches enabled actions and exposes disabled state', () => {
  const select = jest.fn(), close = jest.fn(); const screen = renderUI(<ActionMenu visible title="Resume" items={[{ id: 'open', label: 'Open', icon: 'file' }, { id: 'delete', label: 'Delete', icon: 'delete', disabled: true }]} onClose={close} onSelect={select} />);
  expect(screen.getByLabelText('Delete').props.accessibilityState.disabled).toBe(true);
  fireEvent.press(screen.getByLabelText('Open')); expect(select).toHaveBeenCalledWith('open');
  fireEvent.press(screen.getByLabelText('Close actions')); expect(close).toHaveBeenCalled();
});

test('a destructive action requires confirmation and can be cancelled', () => {
  const select = jest.fn(); const screen = renderUI(<ActionMenu visible title="Resume" items={[{ id: 'delete', label: 'Delete', icon: 'delete-outline', destructive: true, confirmation: { message: 'Delete this resume?', confirmLabel: 'Confirm delete' } }]} onClose={jest.fn()} onSelect={select} />);
  fireEvent.press(screen.getByLabelText('Delete')); expect(select).not.toHaveBeenCalled();
  fireEvent.press(screen.getByLabelText('Cancel')); expect(screen.getByLabelText('Delete')).toBeTruthy();
  fireEvent.press(screen.getByLabelText('Delete')); fireEvent.press(screen.getByLabelText('Confirm delete')); expect(select).toHaveBeenCalledWith('delete');
});
