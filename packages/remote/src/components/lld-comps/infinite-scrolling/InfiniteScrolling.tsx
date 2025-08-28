import { useCallback, useEffect, useRef, useState } from "react";
import "./InfiniteScrolling.css";

const PAGE_SIZE = 25;

const InfiniteScrolling = () => {
  const [items, setItems] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

  const fetchData = async (pageNum: number) => {
    setLoading(true);
    try {
      const start = (pageNum - 1) * PAGE_SIZE + 1;

      const newItems = Array.from(
        { length: PAGE_SIZE },
        (_, i) => `item ${start + i}`
      );
      console.log(newItems, start);
      await new Promise((res) => setTimeout(res, 1000));
      setItems((prevItems) => [...prevItems, ...newItems]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [page]);

  // The IntersectionObserver is a browser API that lets you monitor when an element
  // (called the “target”) enters or leaves the viewport (or a defined scrollable container).
  const lastItemRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect(); // disconnect from previous node
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) setPage((prev) => prev + 1);
      });
      if (node) observer.current.observe(node); // Observe new node after scrolling
    },
    [loading]
  );

  return (
    <div style={{ maxWidth: 400, margin: "auto", height: "110vh" }}>
      <h2>Infinite Scroll Example</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {items.map((item, index) => (
          <li
            key={item + index}
            ref={index === items.length - 1 ? lastItemRef : null}
            style={{ padding: 10, border: "1px solid #ccc", marginBottom: 5 }}
          >
            {item}
          </li>
        ))}
      </ul>
      {loading && <p>Loading...</p>}
    </div>
  );
};

export default InfiniteScrolling;
