// LAB 01 — Stale closure
// 🐞 Press "Start": the stopwatch goes to 1 and then stays there forever.
// Keep as is: the `Stopwatch` export, the "<n> seconds" text, the button names "Start" / "Stop" / "Reset".
import { useEffect, useState } from "react";

export function Stopwatch() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setSeconds((s) => s + 1);
      // Reason: the state 'seconds' will always be 0 here since it is not passed as a useEffect's dependency
      // setSeconds(seconds + 1);
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  return (
    <div className="lab-row">
      <output className="lab-big">{seconds} seconds</output>
      <button onClick={() => setRunning(!running)}>
        {running ? "Stop" : "Start"}
      </button>
      <button
        onClick={() => {
          setRunning(false);
          setSeconds(0);
        }}
      >
        Reset
      </button>
    </div>
  );
}
