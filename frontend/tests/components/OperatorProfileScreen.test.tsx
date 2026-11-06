import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { OperatorProfileScreen } from '../../src/screens/OperatorProfileScreen';
import { demoProfile } from '../../src/demo/profileData';
import { renderUI } from './helpers';
test('profile edits can be saved and cancelled without mutating the supplied profile', () => {
  const onProfileChange = jest.fn();
  const screen = renderUI(<OperatorProfileScreen onBack={jest.fn()} onAction={jest.fn()} profile={demoProfile} onProfileChange={onProfileChange} />);
  fireEvent.press(screen.getByLabelText('Edit Profile'));
  fireEvent.changeText(screen.getByLabelText('Name'), 'Taylor');
  fireEvent.changeText(screen.getByLabelText('New skill'), 'Elixir');
  fireEvent.press(screen.getByLabelText('Add Skill'));
  fireEvent.press(screen.getByLabelText('Save Profile Changes'));
  expect(onProfileChange).toHaveBeenCalledWith(expect.objectContaining({ name: 'Taylor', skills: expect.arrayContaining(['Elixir']) }));
  expect(demoProfile.name).toBe('Alex Vance');
  fireEvent.press(screen.getByLabelText('Edit Profile'));
  fireEvent.changeText(screen.getByLabelText('Name'), 'Discard');
  fireEvent.press(screen.getByLabelText('Cancel Editing'));
  expect(onProfileChange).toHaveBeenCalledTimes(1);
});

test('does not show example profile records when the host supplies an empty profile', () => {
  const screen = renderUI(<OperatorProfileScreen onBack={jest.fn()} onAction={jest.fn()} profile={{ name: '', headline: '', location: '', summary: '', email: '', skills: [] }} onProfileChange={jest.fn()} />);
  expect(screen.getByText('No experience added.')).toBeTruthy();
  expect(screen.queryByText('Nexus Scale Labs')).toBeNull();
  expect(screen.queryByText('github.com/avance')).toBeNull();
});
