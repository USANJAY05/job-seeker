import React from 'react';
import { Pressable, Text } from 'react-native';
import { fireEvent } from '@testing-library/react-native';
import { HistoryDrawer } from '../../src/components/patterns/Copilot';
import { renderUI, resume, template } from './helpers';
test('HistoryDrawer behavior', () => { const cb=jest.fn(); const s=renderUI(<HistoryDrawer visible title="History" items={[]} onClose={cb} onSelect={jest.fn()} />); fireEvent.press(s.getAllByLabelText('Close history')[0]); expect(cb).toHaveBeenCalledTimes(1); });
