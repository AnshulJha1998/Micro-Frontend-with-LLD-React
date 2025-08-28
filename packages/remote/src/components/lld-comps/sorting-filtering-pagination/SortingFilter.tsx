import { useEffect, useMemo, useState } from "react";

type Todo = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

const PAGE_SIZE = 13;

export default function SortingFilter() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);

  const [filter, setFilter] = useState("");
  const [sortKey, setSortKey] = useState<keyof Todo>("id");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);

  const [total, setTotal] = useState(0);

  // Build API URL with query params
  const apiUrl = useMemo(() => {
    const params = new URLSearchParams();
    params.append("_sort", String(sortKey));
    params.append("_order", String(sortDir));
    params.append("_page", String(page));
    params.append("_limit", String(PAGE_SIZE));
    if (filter) params.append("title_like", String(filter));
    return `https://jsonplaceholder.typicode.com/todos?${params.toString()}`;
  }, [page, filter, sortKey, sortDir]);

  useEffect(() => {
    setLoading(true);
    fetch(apiUrl)
      .then((res) => {
        const totalRows = Number(res.headers.get("x-total-count"));
        setTotal(isNaN(totalRows) ? 0 : totalRows);
        return res.json();
      })
      .then((data) => setTodos(data))
      .finally(() => setLoading(false));
    // Only re-fetch when relevant parameters change
    // eslint-disable-next-line
  }, [apiUrl]);

  const columns = [
    { accessor: "id", label: "ID" },
    { accessor: "title", label: "Title" },
    { accessor: "userId", label: "User ID" },
    { accessor: "completed", label: "Completed" },
  ] as const;

  const pageCount = total ? Math.ceil(total / PAGE_SIZE) : 20; // fallback for unknown

  return (
    <div style={{ maxWidth: 750, margin: "auto" }}>
      <h2>Todos Table (API-ONLY: Server Pagination, Filter, Sort)</h2>
      <div style={{ marginBottom: 10 }}>
        <input
          placeholder="Filter by title"
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setPage(1);
          }}
          style={{ padding: 8, minWidth: 220 }}
        />
      </div>
      <table
        border={1}
        cellPadding={6}
        cellSpacing={0}
        style={{ width: "100%" }}
      >
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.accessor}
                onClick={() => {
                  console.log(sortKey, col.accessor);
                  if (sortKey !== col.accessor) {
                    setSortKey(col.accessor);
                    setSortDir("asc");
                  } else {
                    setSortDir(sortDir === "asc" ? "desc" : "asc");
                  }
                  setPage(1); // reset to first page
                }}
                style={{ cursor: "pointer" }}
              >
                {col.label}{" "}
                {sortKey === col.accessor
                  ? sortDir === "asc"
                    ? "▲"
                    : "▼"
                  : ""}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length}>Loading...</td>
            </tr>
          ) : todos.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>No results</td>
            </tr>
          ) : (
            todos.map((todo) => (
              <tr key={todo.id}>
                <td>{todo.id}</td>
                <td>{todo.title}</td>
                <td>{todo.userId}</td>
                <td>{todo.completed ? "✅" : "❌"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div style={{ margin: 10 }}>
        <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
          Prev
        </button>
        <span>
          {" "}
          Page {page} / {pageCount}{" "}
        </span>
        <button
          disabled={page >= pageCount}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
