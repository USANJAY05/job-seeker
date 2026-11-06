import React from 'react';
import { Pressable, Text } from 'react-native';
import { fireEvent } from '@testing-library/react-native';
import { OpportunityCard } from '../../src/components/patterns/OpportunityCard';
import { renderUI, resume, template } from './helpers';
test('OpportunityCard behavior', () => { const cb=jest.fn(); const s=renderUI(<OpportunityCard opportunity={{id:'o1',company:'Example',initials:'E',role:'Engineer',employment:'Remote',status:'Applied'}} actions={[{id:'view',label:'View',icon:'eye'}]} onAction={cb} />); fireEvent.press(s.getByLabelText('View')); expect(cb).toHaveBeenCalledWith('o1','view'); });
