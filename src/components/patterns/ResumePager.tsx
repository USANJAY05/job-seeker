import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import PagerView from 'react-native-pager-view';
import type { StyleProp, ViewStyle } from 'react-native';

export type ResumePagerHandle = { setPage: (page: number) => void };
export type ResumePagerProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  initialPage?: number;
  testID?: string;
  onPageSelected?: (event: { nativeEvent: { position: number } }) => void;
};

const ResumePager = forwardRef<ResumePagerHandle, ResumePagerProps>(function ResumePager(
  { children, ...props },
  ref,
) {
  const pager = useRef<PagerView>(null);
  useImperativeHandle(ref, () => ({ setPage: page => pager.current?.setPage(page) }), []);
  return <PagerView ref={pager} {...props}>{children}</PagerView>;
});

export default ResumePager;
