import React from 'react';
import { Pressable, Text } from 'react-native';
import { fireEvent } from '@testing-library/react-native';
import { TagGroup } from '../../src/components/patterns/Profile';
import { renderUI, resume, template } from './helpers';
test('TagGroup behavior', () => { const cb=jest.fn(); const s=renderUI(<TagGroup title="Skills" items={[{id:'go',label:'Go'}]} onRemove={cb} />); fireEvent.press(s.getByLabelText('Remove Go')); expect(cb).toHaveBeenCalledWith('go'); });
