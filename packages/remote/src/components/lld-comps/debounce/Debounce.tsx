import { useState } from "react";
import { useDebounceSearch } from "./useDebounceHook";

type TODO = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

const Debounce = () => {
  const [query, setQuery] = useState("");
  const { results, loading, error } = useDebounceSearch<TODO[]>(
    query,
    500,
    `https://jsonplaceholder.typicode.com/todos?title_like=${query}`
  );

  return (
    <div style={{ maxWidth: 500, margin: "40px auto" }}>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Type to search"
        style={{
          width: "100%",
          padding: 8,
          fontSize: 17,
          border: "1px solid #ccc",
          borderRadius: 5,
        }}
      />

      {loading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}

      {!loading && results?.length === 0 && <div>No results</div>}

      <ul>
        {results?.map((todo) => (
          <li key={todo.id}>
            {todo.title}{" "}
            <span style={{ opacity: 0.6 }}>{todo.completed ? "✅" : "❌"}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Debounce;
