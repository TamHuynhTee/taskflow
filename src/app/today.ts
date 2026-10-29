import { todayIso } from "../utils/date";

// Đọc ngày hiện tại 1 lần khi load module. Gọi new Date() ngay trong render sẽ làm
// component không còn thuần (mỗi lần render một kết quả khác).
export const TODAY = todayIso();
