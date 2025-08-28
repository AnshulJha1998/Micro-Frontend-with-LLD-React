import { useDataFetch } from "./useDataFetch";
type TODO = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};
const DataFetchCache = () => {
  const fetchTodos = () =>
    fetch("https://jsonplaceholder.typicode.com/todos").then((res) =>
      res.json()
    );

  const { data, error, loading, updateData, refetch } = useDataFetch<TODO[]>({
    key: "todos",
    fetcher: fetchTodos,
  });

  const toggleComplete = (id: number) => {
    if (!data) return;

    // Create updated array with toggled completed for matching id
    const updatedTodos = data.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );

    // Update local state and cache instantly
    updateData(updatedTodos);

    // You could then send an API PATCH/PUT here
    // and call refetch() on success to sync with server
  };
  return (
    <>
      <h1>DataFetchCache</h1>

      <div>
        {data?.map((each) => {
          return (
            <div key={each.id}>
              <h3>{each.title}</h3>
              <h4>{each.userId}</h4>
              <h4>{each.completed ? "Completed" : "Not Completed"}</h4>
              <button onClick={() => toggleComplete(each.id)}>
                Toggle Complete
              </button>
              <h4>------------------------------------------------</h4>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default DataFetchCache;
