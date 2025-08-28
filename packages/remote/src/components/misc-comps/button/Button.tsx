import { useState } from "react";
import "./Button.css";

const Button = () => {
  const [count, setCount] = useState(0);
  return (
    <div>
      <button
        id="click-btn"
        className="shared-btn"
        onClick={() => setCount((prev) => prev + 1)}
      >
        hello world : {count}
      </button>
    </div>
  );
};

export default Button;
