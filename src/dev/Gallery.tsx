// Trang xem trước toàn bộ UI có sẵn: http://localhost:5173/#gallery
// Chỉ để tham khảo cách dùng props — dữ liệu ở đây là giả, không có logic thật.
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
          <NavLinkPlaceholder>Thống kê</NavLinkPlaceholder>
          <NavLinkPlaceholder>Cài đặt</NavLinkPlaceholder>
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
          Mất kết nối mạng — thay đổi sẽ không được lưu.
        </Banner>
      }
      sidebar={
        <BoardSidebar
          boards={sampleBoards}
          activeBoardId="b1"
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
        description="Tất cả component giao diện có sẵn. Mở file tương ứng để xem props."
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
                + Tạo card
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
            Đang lưu…
          </Button>
          <Button size="sm">Small</Button>
          <Spinner />
        </div>
      </Section>

      <Section title="Modal (mở bằng nút)" file="components/ui/Modal.tsx">
        <div className="gallery__row">
          <Button onClick={() => setModal("detail")}>Chi tiết card</Button>
          <Button onClick={() => setModal("form")}>Form tạo card</Button>
          <Button onClick={() => setModal("confirm")}>Hộp xác nhận</Button>
        </div>
      </Section>

      <Section title="Trạng thái" file="components/ui/Feedback.tsx">
        <div className="gallery__grid">
          <ErrorMessage
            error={new Error("GET /cards thất bại: 500")}
            onRetry={noop}
          />
          <ErrorMessage
            error="Cột này bị lỗi khi render"
            compact
            onRetry={noop}
          />
          <EmptyState
            title="Chưa có board nào"
            description="Tạo board đầu tiên để bắt đầu."
            action={<Button>Tạo board</Button>}
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
        title="Thống kê + Profiler + danh sách dài"
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
              highlight="trang"
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

      <Section title="Cài đặt" file="features/settings/SettingsView.tsx">
        <SettingsView
          theme={theme}
          onThemeChange={(t) => t !== theme && toggleTheme()}
          user={sampleUsers[0]}
          onLogout={noop}
          apiUrl="http://localhost:3001"
          apiDelay={500}
        />
      </Section>

      <Section title="Đăng nhập" file="features/auth/LoginView.tsx">
        <div className="gallery__frame">
          <LoginView users={sampleUsers} onSelect={noop} />
        </div>
      </Section>

      <Section title="404" file="pages/NotFoundView.tsx">
        <NotFoundView action={<Button>Về trang chủ</Button>} />
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
              <Button size="sm">Sửa</Button>
              <Button size="sm" variant="danger">
                Xoá
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
                content: "Đã có PR, nhờ review giúp.",
                createdAt: "2026-10-20T00:00:00Z",
              },
              {
                id: "x2",
                cardId: card.id,
                authorId: "u1",
                content: "Đang gửi bình luận này…",
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
                  Gửi
                </Button>
              }
            />
          </form>
        </CardDetail>
      </Modal>

      <Modal
        open={modal === "form"}
        title="Tạo card"
        onClose={() => setModal("none")}
      >
        <form onSubmit={(e) => e.preventDefault()}>
          <FormMessage>
            Không lưu được card: lỗi giả lập khi POST /cards
          </FormMessage>
          <CardFormFields
            users={sampleUsers}
            errors={{ title: "Tiêu đề cần ít nhất 3 ký tự" }}
          />
          <FormActions>
            <Button onClick={() => setModal("none")}>Huỷ</Button>
            <Button type="submit" variant="primary">
              Tạo card
            </Button>
          </FormActions>
        </form>
      </Modal>

      <ConfirmDialogView
        open={modal === "confirm"}
        message={`Xoá card "${card.title}"? Không thể hoàn tác.`}
        confirmText="Xoá"
        danger
        onConfirm={() => setModal("none")}
        onCancel={() => setModal("none")}
      />

      <ToastStack
        onDismiss={noop}
        toasts={[
          { id: "t1", kind: "success", message: "Đã tạo card" },
          {
            id: "t2",
            kind: "error",
            message: "Không chuyển được card — đã hoàn tác",
          },
        ]}
      />
    </Layout>
  );
}
