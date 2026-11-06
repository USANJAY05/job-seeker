import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { ScrollView, View, type LayoutChangeEvent } from 'react-native';
import type { ResumePagerHandle, ResumePagerProps } from './ResumePager';

const ResumePager = forwardRef<ResumePagerHandle, ResumePagerProps>(function ResumePager(
  { children, onPageSelected, initialPage = 0, ...props },
  ref,
) {
  const scroll = useRef<any>(null);
  const width = useRef(0);
  const selectedPage = useRef(initialPage);
  const [pageWidth, setPageWidth] = useState(0);
  const pages = React.Children.toArray(children);

  useImperativeHandle(ref, () => ({
    setPage: page => {
      const next = Math.max(0, Math.min(page, pages.length - 1));
      selectedPage.current = next;
      scroll.current?.scrollTo({ x: next * width.current, animated: true });
      onPageSelected?.({ nativeEvent: { position: next } });
    },
  }), [onPageSelected, pages.length]);

  const onLayout = (event: LayoutChangeEvent) => {
    width.current = event.nativeEvent.layout.width;
    setPageWidth(width.current);
    if (initialPage > 0) scroll.current?.scrollTo({ x: initialPage * width.current, animated: false });
  };

  const onMomentumScrollEnd = (event: { nativeEvent: { contentOffset: { x: number } } }) => {
    const position = width.current ? Math.round(event.nativeEvent.contentOffset.x / width.current) : 0;
    selectedPage.current = position;
    onPageSelected?.({ nativeEvent: { position } });
  };

  return (
    <ScrollView
      {...props}
      ref={scroll}
      horizontal
      pagingEnabled
      bounces={false}
      showsHorizontalScrollIndicator={false}
      scrollEventThrottle={16}
      onLayout={onLayout}
      onMomentumScrollEnd={onMomentumScrollEnd}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      {pages.map((page, index) => (
        <View key={index} style={{ width: pageWidth || '100%', flex: pageWidth ? undefined : 1 }}>
          {page}
        </View>
      ))}
    </ScrollView>
  );
});

export default ResumePager;
