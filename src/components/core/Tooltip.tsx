import React from 'react';
import { Tooltip as PaperTooltip } from 'react-native-paper';
/** The child must accept a ref; icon-only controls also require an accessibility label. */
export function Tooltip({ title, children }: { title: string; children: React.ReactElement }) {
  return <PaperTooltip title={title}>{children}</PaperTooltip>;
}
