// LAB 11 — Error Boundaries don't catch async errors  (IMPLEMENT exercise)
// 🐞 Click "Load report" while the API fails: nothing shows up, the console only has "Uncaught (in promise)".
//    The ErrorBoundary below CAN'T catch errors thrown in an event handler / after await.
// Goal: load()'s error must show through the ErrorBoundary fallback ("Error: <message>"),
//       clicking "Retry" goes back to the "Load report" button. The button is disabled while loading.
// Keep as is: the `ReportLab` export (prop `load`), the `ErrorBoundary` class, the text/buttons above.
// Hint: the error has to be THROWN DURING RENDER for the boundary to see it.
import { Component, useState, type ReactNode } from "react";

export class ErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div role="alert">
          <p>Error: {this.state.error.message}</p>
          <button onClick={() => this.setState({ error: null })}>Retry</button>
        </div>
      );
    }
    return this.props.children;
  }
}

function ReportButton({ load }: { load: () => Promise<string> }) {
  const [report, setReport] = useState<string | null>(null);

  async function handleClick() {
    const data = await load();
    setReport(data);
  }

  if (report) return <p>Report: {report}</p>;
  return <button onClick={handleClick}>Load report</button>;
}

let demoCount = 0;
async function demoLoad() {
  await new Promise((r) => setTimeout(r, 500));
  if (++demoCount % 2 === 1) throw new Error("Server returned 500");
  return "October revenue: $120k";
}

export function ReportLab({ load = demoLoad }: { load?: () => Promise<string> }) {
  return (
    <ErrorBoundary>
      <ReportButton load={load} />
    </ErrorBoundary>
  );
}
