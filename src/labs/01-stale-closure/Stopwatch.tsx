// LAB 01 — Stale closure
// 🐞 Bấm "Bắt đầu": đồng hồ lên 1 rồi đứng im mãi mãi.
// Giữ nguyên: export `Stopwatch`, chữ "<n> giây", tên nút "Bắt đầu" / "Dừng" / "Đặt lại".
import { useEffect, useState } from "react";

export function Stopwatch() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setSeconds(seconds + 1);
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  return (
    <div className="lab-row">
      <output className="lab-big">{seconds} giây</output>
      <button onClick={() => setRunning(!running)}>
        {running ? "Dừng" : "Bắt đầu"}
      </button>
      <button
        onClick={() => {
          setRunning(false);
          setSeconds(0);
        }}
      >
        Đặt lại
      </button>
    </div>
  );
}
