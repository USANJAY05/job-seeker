import React from 'react';
import { Pressable, Text } from 'react-native';
import { fireEvent } from '@testing-library/react-native';
import { DocumentHeader } from '../../src/components/patterns/DocumentEditor';
import { renderUI, resume, template } from './helpers';
test('DocumentHeader behavior', () => { const cb=jest.fn(); const s=renderUI(<DocumentHeader title="Resume.tex" onBack={cb} actionLabel="Run" onAction={jest.fn()} />); fireEvent.press(s.getByLabelText('Go back')); expect(cb).toHaveBeenCalledTimes(1); });
