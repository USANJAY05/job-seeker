import React from 'react';
import { Pressable, Text } from 'react-native';
import { fireEvent } from '@testing-library/react-native';
import { CopilotWelcome } from '../../src/components/patterns/Copilot';
import { renderUI, resume, template } from './helpers';
test('CopilotWelcome behavior', () => { const s=renderUI(<CopilotWelcome title="Assistant" description="Ready" />); expect(s.getByText('Assistant')).toBeTruthy(); });
