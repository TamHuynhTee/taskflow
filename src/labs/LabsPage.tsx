import { Link, NavLink, useParams } from "react-router";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { Layout } from "../components/Layout";
import { Badge, EmptyState, ErrorMessage, PageHeader } from "../components/ui";
import { LABS } from "./registry";
import "./labs.css";

/** /labs/:labId — view each lab's demo. Instructions + hints: LABS.md. Self-check: npm run test:labs. */
export default function LabsPage() {
  const { labId } = useParams();
  const lab = LABS.find((l) => l.id === labId);

  return (
    <Layout
      nav={<Link className="layout__nav-link" to="/boards">← Back to app</Link>}
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
                {lab.kind === "bug" ? "🐞 Fix the bug" : "🛠 Implement"}
              </Badge>
            }
          />
          <div className="lab-stage">
            {/* key: switching labs → remount from scratch (fresh state, effects and boundary). */}
            <ErrorBoundary
              key={lab.id}
              fallback={(error, reset) => (
                <ErrorMessage title="The lab crashed" error={error} onRetry={reset} />
              )}
            >
              <lab.Demo />
            </ErrorBoundary>
          </div>
        </>
      ) : (
        <EmptyState
          icon="🧪"
          title="Pick a lab on the left"
          description="Instructions and hints are in LABS.md. Run npm run test:labs to check yourself."
        />
      )}
    </Layout>
  );
}
