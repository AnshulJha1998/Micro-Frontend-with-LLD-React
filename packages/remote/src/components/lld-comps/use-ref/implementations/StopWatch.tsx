import { useEffect, useRef, useState } from "react";

// Avoid using this timerRef?.current?.clearInterval();
// use this instead clearInterval(timerRef.current);

const StopWatch = () => {
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);

  const handleStart = () => {
    if (!timerRef.current) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
  };

  const handleStop = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      setSeconds(0);
      setMinutes(0);
      setHours(0);
      timerRef.current = null;
    }
  };

  const handlePause = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    if (seconds > 59) {
      setSeconds(0);
      setMinutes((prev) => prev + 1);
    }
    if (minutes > 59) {
      setHours((prev) => prev + 1);
      setMinutes(0);
    }
  }, [seconds]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <div>
      <h3>Stop Watch</h3>
      <h1>
        {hours} : {minutes} : {seconds}
      </h1>
      <button onClick={handleStart}>Start</button>
      <button onClick={handleStop}>Stop</button>
      <button onClick={handlePause}>Pause</button>
    </div>
  );
};

export default StopWatch;
