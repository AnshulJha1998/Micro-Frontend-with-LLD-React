import StopWatch from "./implementations/StopWatch";

const UseRefExamples = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <h1
        style={{
          marginBottom: "2rem",
          borderBottom: "1px solid black",
          textAlign: "center",
          width: "100%",
        }}
      >
        Use Ref Examples
      </h1>
      <StopWatch />
    </div>
  );
};

export default UseRefExamples;
