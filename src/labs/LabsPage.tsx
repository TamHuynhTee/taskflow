import { Link, NavLink, useParams } from "react-router";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { Layout } from "../components/Layout";
import { Badge, EmptyState, ErrorMessage, PageHeader } from "../components/ui";
import { LABS } from "./registry";
import "./labs.css";

/** /labs/:labId — xem demo từng bài. Đề bài + gợi ý: LABS.md. Tự chấm: npm run test:labs. */
export default function LabsPage() {
  const { labId } = useParams();
  const lab = LABS.find((l) => l.id === labId);

  return (
    <Layout
      nav={<Link className="layout__nav-link" to="/boards">← Về app</Link>}
      sidebar={
        <nav className="board-sidebar">
          <h2 className="board-sidebar__heading">Labs</h2>
          <ul className="board-sidebar__list">
            {LABS.map((l) => (
              <li key={l.id}>
                <NavLink to={`/labs/${l.id}`} className="board-sidebar__item">
                  {l.id}. {l.title}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      }
    >
      <title>{lab ? `Lab ${lab.id} · TaskFlow` : "Labs · TaskFlow"}</title>
      {lab ? (
        <>
          <PageHeader
            title={`${lab.id}. ${lab.title}`}
            description={`${lab.concept} — src/labs/${lab.file}`}
            actions={
              <Badge tone={lab.kind === "bug" ? "red" : "blue"}>
                {lab.kind === "bug" ? "🐞 Sửa bug" : "🛠 Implement"}
              </Badge>
            }
          />
          <div className="lab-stage">
            {/* key: đổi lab → mount lại từ đầu (state, effect, boundary đều mới). */}
            <ErrorBoundary
              key={lab.id}
              fallback={(error, reset) => (
                <ErrorMessage title="Lab bị crash" error={error} onRetry={reset} />
              )}
            >
              <lab.Demo />
            </ErrorBoundary>
          </div>
        </>
      ) : (
        <EmptyState
          icon="🧪"
          title="Chọn một bài lab bên trái"
          description="Đề bài và gợi ý ở LABS.md. Chạy npm run test:labs để tự chấm."
        />
      )}
    </Layout>
  );
}
