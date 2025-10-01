import { useMemo, useState, useEffect, useRef } from "react";

interface VirtualListOptions {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}
export function useVirtualList<T>(
  items: T[],
  { itemHeight, containerHeight, overscan = 5 }: VirtualListOptions
) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setScrollTop(container.scrollTop);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const { visibleItems, totalHeight, offsetY } = useMemo(() => {
    const startIndex = Math.max(
      0,
      Math.floor(scrollTop / itemHeight) - overscan
    );
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );

    return {
      visibleItems: items
        .slice(startIndex, endIndex + 1)
        .map((item, index) => ({
          item,
          index: startIndex + index,
        })),
      totalHeight: items.length * itemHeight,
      offsetY: startIndex * itemHeight,
    };
  }, [items, scrollTop, itemHeight, containerHeight, overscan]);

  return {
    containerRef,
    visibleItems,
    totalHeight,
    offsetY,
  };
}
