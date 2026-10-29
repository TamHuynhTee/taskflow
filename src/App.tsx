import { Layout } from "./components/Layout";
import { sampleBoards, sampleCards, sampleUsers } from "./data/sample";
import { BoardPage } from "./features/boards/BoardPage";
import { BoardSidebar } from "./features/boards/BoardSidebar";
import { BoardView } from "./features/boards/BoardView";
import { todayIso } from "./utils/date";

// Đọc ngày hiện tại 1 lần khi load module, rồi truyền xuống qua props.
// Gọi new Date() ngay trong render sẽ làm component không còn thuần (mỗi lần render một kết quả khác).
const TODAY = todayIso();

function App() {
  // Level 0: board cố định. T1.5 sẽ biến activeBoardId thành state để đổi board.
  const activeBoard = sampleBoards[0];

  return (
    <Layout
      sidebar={
        <BoardSidebar boards={sampleBoards} activeBoardId={activeBoard.id} />
      }
    >
      <BoardPage
        board={activeBoard}
        initialCards={sampleCards}
        users={sampleUsers}
        today={TODAY}
      />
    </Layout>
  );
}

export default App;
