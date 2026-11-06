import React from 'react';
import { Pressable, Text } from 'react-native';
import { fireEvent } from '@testing-library/react-native';
import { EditorSection } from '../../src/components/patterns/DocumentEditor';
import { renderUI, resume, template } from './helpers';
test('EditorSection behavior', () => { const cb=jest.fn(); const s=renderUI(<EditorSection title="Contact" icon="file" expanded={false} onToggle={cb}><Text>Secret child</Text></EditorSection>); expect(s.queryByText('Secret child')).toBeNull(); fireEvent.press(s.getByText('Contact')); expect(cb).toHaveBeenCalledTimes(1); });
