// Preview page for all the ready-made UI: http://localhost:5173/#gallery
// For reference on props only — the data here is fake, there is no real logic.
import { useState, type ReactNode } from "react";
import { ThemeToggle, UserMenu } from "../components/HeaderWidgets";
import { Layout, NavLinkPlaceholder } from "../components/Layout";
import {
  Banner,
  BoardSkeleton,
  Button,
  ConfirmDialogView,
  EmptyState,
  ErrorMessage,
  Modal,
  PageHeader,
  PageSkeleton,
  RenderCounter,
  Spinner,
  Tabs,
  ToastStack,
  TooltipBox,
} from "../components/ui";
import { sampleBoards, sampleCards, sampleUsers } from "../data/sample";
import { LoginView } from "../features/auth/LoginView";
import { AddCardButton } from "../features/boards/AddCardButton";
import { BoardSidebar } from "../features/boards/BoardSidebar";
import { BoardView } from "../features/boards/BoardView";
import { FilterPanel } from "../features/boards/FilterPanel";
import { EMPTY_FILTER } from "../features/cards/cardMeta";
import { SearchBox } from "../features/boards/SearchBox";
import { CardDetail } from "../features/cards/CardDetail";
import {
  CardFormFields,
  FormActions,
  FormMessage,
} from "../features/cards/CardFormFields";
import {
  CommentComposerFields,
  CommentList,
  CommentListSkeleton,
} from "../features/cards/CommentList";
import { InlineEdit } from "../features/cards/InlineEdit";
import { SettingsView } from "../features/settings/SettingsView";
import {
  CardRow,
  ListFrame,
  ProfilerTable,
  StatsOverview,
} from "../features/stats/StatsViews";
import { NotFoundView } from "../pages/NotFoundView";
import type { CardFilter, Theme } from "../types";
import { todayIso } from "../utils/date";
import "./Gallery.css";

const TODAY = todayIso();
const noop = () => {};
const usersById = Object.fromEntries(sampleUsers.map((u) => [u.id, u]));
const card = sampleCards[0];

function Section({
  title,
  file,
  children,
}: {
  title: string;
  file: string;
  children: ReactNode;
}) {
  return (
    <section className="gallery__section">
      <h2 className="gallery__title">
        {title} <code>{file}</code>
      </h2>
      <div className="gallery__demo">{children}</div>
    </section>
  );
}

export default function Gallery() {
  const [theme, setTheme] = useState<Theme>("light");
  const [filter, setFilter] = useState<CardFilter>(EMPTY_FILTER);
  const [modal, setModal] = useState<"none" | "detail" | "form" | "confirm">(
    "none",
  );
  const [tab, setTab] = useState("b1");

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
  };

  return (
    <Layout
      nav={
        <>
          <NavLinkPlaceholder active>Board</NavLinkPlaceholder>
          <NavLinkPlaceholder>Stats</NavLinkPlaceholder>
          <NavLinkPlaceholder>Settings</NavLinkPlaceholder>
        </>
      }
      headerActions={
        <>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
          <UserMenu user={sampleUsers[0]} onLogout={noop} />
        </>
      }
      banner={
        <Banner tone="warning">
          You're offline — changes won't be saved.
        </Banner>
      }
      sidebar={
        <BoardSidebar
          boards={sampleBoards}
          filters={
            <FilterPanel
              value={filter}
              onChange={setFilter}
              users={sampleUsers}
            />
          }
        />
      }
    >
      <PageHeader
        title="UI Gallery"
        description="Every ready-made UI component. Open the matching file to see its props."
      />

      <Section
        title="BoardView + Column + CardItem"
        file="features/boards/BoardView.tsx"
      >
        <BoardView
          board={sampleBoards[0]}
          cards={sampleCards}
          users={sampleUsers}
          today={TODAY}
          toolbar={
            <>
              <SearchBox onClear={noop} />
              <RenderCounter count={3} />
              <Button variant="primary" onClick={() => setModal("form")}>
                + New card
              </Button>
            </>
          }
          getCardProps={(c) => ({
            onOpen: () => setModal("detail"),
            onDelete: () => setModal("confirm"),
            onMove: noop,
            onBumpPriority: noop,
            isPending: c.id === "c3",
            titleEditor:
              c.id === "c5" ? (
                <InlineEdit
                  defaultValue={c.title}
                  onCommit={noop}
                  onCancel={noop}
                />
              ) : undefined,
          })}
          onDropCard={(id, col) => console.info("[gallery] drop", id, "→", col)}
          renderColumnFooter={(col) =>
            col.id === "todo" ? (
              <AddCardButton onClick={() => setModal("form")} />
            ) : null
          }
        />
      </Section>

      <Section title="Tabs" file="components/ui/Misc.tsx">
        <Tabs
          items={sampleBoards.map((b) => ({ id: b.id, label: b.title }))}
          activeId={tab}
          onSelect={setTab}
          pendingId="b2"
        />
      </Section>

      <Section title="Button / Spinner" file="components/ui/Button.tsx">
        <div className="gallery__row">
          <Button variant="primary">Primary</Button>
          <Button>Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="primary" loading>
            Saving…
          </Button>
          <Button size="sm">Small</Button>
          <Spinner />
        </div>
      </Section>

      <Section title="Modal (open with a button)" file="components/ui/Modal.tsx">
        <div className="gallery__row">
          <Button onClick={() => setModal("detail")}>Card detail</Button>
          <Button onClick={() => setModal("form")}>New card form</Button>
          <Button onClick={() => setModal("confirm")}>Confirm dialog</Button>
        </div>
      </Section>

      <Section title="Status" file="components/ui/Feedback.tsx">
        <div className="gallery__grid">
          <ErrorMessage
            error={new Error("GET /cards failed: 500")}
            onRetry={noop}
          />
          <ErrorMessage
            error="This column crashed while rendering"
            compact
            onRetry={noop}
          />
          <EmptyState
            title="No boards yet"
            description="Create your first board to get started."
            action={<Button>New board</Button>}
          />
          <div style={{ position: "relative", height: 60 }}>
            <TooltipBox style={{ position: "absolute", top: 0, left: 0 }}>
              {card.description}
            </TooltipBox>
          </div>
        </div>
      </Section>

      <Section title="Skeleton" file="components/ui/Spinner.tsx">
        <BoardSkeleton />
        <div style={{ marginTop: 24 }}>
          <PageSkeleton />
        </div>
      </Section>

      <Section
        title="Stats + Profiler + long list"
        file="features/stats/StatsViews.tsx"
      >
        <StatsOverview
          stats={{
            total: 30,
            overdue: 9,
            unassigned: 6,
            byColumn: { todo: 12, doing: 10, done: 8 },
            byPriority: { low: 7, medium: 8, high: 9, urgent: 6 },
          }}
        />
        <ListFrame height={240} count={sampleCards.length}>
          {sampleCards.map((c) => (
            <CardRow
              key={c.id}
              card={c}
              assignee={c.assigneeId ? usersById[c.assigneeId] : undefined}
              highlight="page"
            />
          ))}
        </ListFrame>
        <ProfilerTable
          onClear={noop}
          rows={[
            {
              id: "BoardView",
              phase: "mount",
              actualDuration: 42.3,
              baseDuration: 40.1,
              commitTime: 1520,
            },
            {
              id: "SearchResults",
              phase: "update",
              actualDuration: 18.7,
              baseDuration: 39.5,
              commitTime: 2380,
            },
            {
              id: "SearchResults",
              phase: "update",
              actualDuration: 2.1,
              baseDuration: 39.2,
              commitTime: 2610,
            },
          ]}
        />
      </Section>

      <Section title="Settings" file="features/settings/SettingsView.tsx">
        <SettingsView
          theme={theme}
          onThemeChange={(t) => t !== theme && toggleTheme()}
          user={sampleUsers[0]}
          onLogout={noop}
          apiUrl="http://localhost:3001"
          apiDelay={500}
        />
      </Section>

      <Section title="Login" file="features/auth/LoginView.tsx">
        <div className="gallery__frame">
          <LoginView users={sampleUsers} onSelect={noop} />
        </div>
      </Section>

      <Section title="404" file="pages/NotFoundView.tsx">
        <NotFoundView action={<Button>Back to home</Button>} />
      </Section>

      <Modal
        open={modal === "detail"}
        title={card.title}
        onClose={() => setModal("none")}
        size="lg"
      >
        <CardDetail
          card={card}
          board={sampleBoards[0]}
          assignee={card.assigneeId ? usersById[card.assigneeId] : undefined}
          today={TODAY}
          actions={
            <>
              <Button size="sm">Edit</Button>
              <Button size="sm" variant="danger">
                Delete
              </Button>
            </>
          }
        >
          <CommentList
            usersById={usersById}
            comments={[
              {
                id: "x1",
                cardId: card.id,
                authorId: "u2",
                content: "PR is up, please review.",
                createdAt: "2026-10-20T00:00:00Z",
              },
              {
                id: "x2",
                cardId: card.id,
                authorId: "u1",
                content: "Sending this comment…",
                createdAt: "",
                pending: true,
              },
            ]}
          />
          <CommentListSkeleton />
          <form onSubmit={(e) => e.preventDefault()}>
            <CommentComposerFields
              submit={
                <Button type="submit" variant="primary">
                  Send
                </Button>
              }
            />
          </form>
        </CardDetail>
      </Modal>

      <Modal
        open={modal === "form"}
        title="New card"
        onClose={() => setModal("none")}
      >
        <form onSubmit={(e) => e.preventDefault()}>
          <FormMessage>
            Couldn't save the card: simulated failure on POST /cards
          </FormMessage>
          <CardFormFields
            users={sampleUsers}
            errors={{ title: "Title needs at least 3 characters" }}
          />
          <FormActions>
            <Button onClick={() => setModal("none")}>Cancel</Button>
            <Button type="submit" variant="primary">
              Create card
            </Button>
          </FormActions>
        </form>
      </Modal>

      <ConfirmDialogView
        open={modal === "confirm"}
        message={`Delete card "${card.title}"? This can't be undone.`}
        confirmText="Delete"
        danger
        onConfirm={() => setModal("none")}
        onCancel={() => setModal("none")}
      />

      <ToastStack
        onDismiss={noop}
        toasts={[
          { id: "t1", kind: "success", message: "Card created" },
          {
            id: "t2",
            kind: "error",
            message: "Couldn't move the card — reverted",
          },
        ]}
      />
    </Layout>
  );
}
