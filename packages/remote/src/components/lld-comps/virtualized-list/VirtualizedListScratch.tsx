import React, { useState } from "react";

const ITEM_HEIGHT = 30; // Each row is 30px tall
const CONTAINER_HEIGHT = 300; // List shows 10 items at a time
const TOTAL_ITEMS = 1000; // Total number of items

export default function VirtualizedListScratch() {
  const [scrollTop, setScrollTop] = useState(0);

  const items = Array.from({ length: TOTAL_ITEMS }, (_, i) => `Item ${i + 1}`);
  // How many items fit in the viewport
  const visibleCount = Math.ceil(CONTAINER_HEIGHT / ITEM_HEIGHT);

  // Indexes to render
  const startIndex = Math.floor(scrollTop / ITEM_HEIGHT);
  const endIndex = Math.min(startIndex + visibleCount + 2, items.length); // +2 for buffer

  //   1. visibleCount = Math.ceil(CONTAINER_HEIGHT / ITEM_HEIGHT);
  // What it means:
  // This calculates how many items can fit visible at once inside the container (the scrollable viewport).

  // Why Math.ceil?
  // If the container height is not an exact multiple of item height, we round up to ensure even partially visible items count.

  // Example:

  // Container height = 300px

  // Item height = 30px

  // Then: 300 / 30 = 10 → visibleCount = 10 (you see 10 items at a time)

  // 2. startIndex = Math.floor(scrollTop / ITEM_HEIGHT);
  // What it means:
  // This calculates the index of the first item currently visible at the top of the scrolling container.

  // Why Math.floor?
  // Because if you have scrolled halfway through an item, you still start rendering from the item fully or partially visible above.

  // Example:

  // scrollTop = 75px (scrolled 75 pixels down)

  // Item height = 30px.

  // 75 / 30 = 2.5 → startIndex = 2 (start rendering at item index 2).

  // 3. endIndex = Math.min(startIndex + visibleCount + 2, items.length);
  // What it means:
  // This determines the last item index to render.

  // Why add + 2?
  // You add a small buffer of items before and after the visible area to avoid flickering or blank space during fast scrolls.

  // Why Math.min with items.length?
  // To ensure you never go beyond the total number of items.

  // Example:

  // startIndex = 2

  // visibleCount = 10

  // So endIndex = min(2 + 10 + 2, totalItems) = 14 (renders items 2 through 13)

  // Handler when user scrolls
  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    console.log("Scroll", e.currentTarget.scrollTop);
    setScrollTop(e.currentTarget.scrollTop);
  };

  // Items to actually render
  const visibleItems = items.slice(startIndex, endIndex);
  return (
    <div
      onScroll={onScroll}
      style={{
        position: "relative",
        height: CONTAINER_HEIGHT,
        overflowX: "auto",
        overflowY: "auto",
        border: "1px solid #aaa",
      }}
    >
      {/* big outer area to enable scrolling */}
      <div style={{ height: items.length * ITEM_HEIGHT, position: "relative" }}>
        {/* Actual rendered rows */}
        {visibleItems.map((item, idx) => {
          const realIndex = startIndex + idx;
          return (
            <div
              key={realIndex}
              style={{
                position: "absolute",
                top: realIndex * ITEM_HEIGHT,
                height: ITEM_HEIGHT,
                left: 0,
                right: 0,
                borderBottom: "1px solid #eee",
                padding: "0 12px",
                display: "flex",
                alignItems: "center",
                background: realIndex % 2 === 0 ? "#fafafa" : "#fff",
              }}
            >
              {item}
            </div>
          );
        })}
      </div>
    </div>
  );
}
