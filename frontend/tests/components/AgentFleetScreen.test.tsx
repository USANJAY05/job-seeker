import { demoAgents } from '../../src/mocks/agentFleet.mock';
import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { AgentFleetScreen } from '../../src/screens/AgentFleetScreen';
import { renderUI } from './helpers';
test('fleet controls update the local preview and expose actions', () => {
  const action = jest.fn(); const screen = renderUI(<AgentFleetScreen agents={demoAgents} onBack={jest.fn()} onAction={action} />);
  const toggle = screen.getByLabelText('Enable Job Ingestion Agent');
  fireEvent(toggle, 'valueChange', true);
  expect(screen.getByLabelText('Enable Job Ingestion Agent').props.value).toBe(true);
  fireEvent.press(screen.getByLabelText('Halt Fleet'));
  expect(action).toHaveBeenCalledWith('Halt fleet');
});

test('does not invent fleet agents when none are supplied', () => {
  const screen = renderUI(<AgentFleetScreen onBack={jest.fn()} onAction={jest.fn()} />);
  expect(screen.getByText('No agents available.')).toBeTruthy();
  expect(screen.queryByLabelText('Enable Job Ingestion Agent')).toBeNull();
});
