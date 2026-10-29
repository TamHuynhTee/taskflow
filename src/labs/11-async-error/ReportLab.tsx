// LAB 11 — Error Boundary không bắt lỗi async  (bài IMPLEMENT)
// 🐞 Bấm "Tải báo cáo" khi API lỗi: không có gì hiện ra, console chỉ có "Uncaught (in promise)".
//    ErrorBoundary bên dưới KHÔNG bắt được lỗi xảy ra trong event handler / sau await.
// Mục tiêu: lỗi của load() phải hiện bằng fallback của ErrorBoundary ("Lỗi: <message>"),
//           bấm "Thử lại" thì quay về nút "Tải báo cáo". Đang tải thì nút disabled.
// Giữ nguyên: export `ReportLab` (prop `load`), class `ErrorBoundary`, các chữ/nút nêu trên.
// Gợi ý: lỗi phải được NÉM RA TRONG LÚC RENDER thì boundary mới thấy.
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
          <p>Lỗi: {this.state.error.message}</p>
          <button onClick={() => this.setState({ error: null })}>Thử lại</button>
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

  if (report) return <p>Báo cáo: {report}</p>;
  return <button onClick={handleClick}>Tải báo cáo</button>;
}

let demoCount = 0;
async function demoLoad() {
  await new Promise((r) => setTimeout(r, 500));
  if (++demoCount % 2 === 1) throw new Error("Server trả về 500");
  return "Doanh thu tháng 10: 120tr";
}

export function ReportLab({ load = demoLoad }: { load?: () => Promise<string> }) {
  return (
    <ErrorBoundary>
      <ReportButton load={load} />
    </ErrorBoundary>
  );
}
