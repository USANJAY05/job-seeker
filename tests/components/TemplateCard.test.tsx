import React from 'react';
import { Pressable, Text } from 'react-native';
import { fireEvent } from '@testing-library/react-native';
import { TemplateCard } from '../../src/components/patterns/TemplateCard';
import { renderUI, resume, template } from './helpers';
test('TemplateCard behavior', () => { const cb=jest.fn(); const s=renderUI(<TemplateCard template={template} actions={template.actions} onAction={cb} />); fireEvent.press(s.getByLabelText('Preview PDF')); expect(cb).toHaveBeenCalledWith('t1','preview'); });
