/**
 * Cache promise theo key — dùng với use() (T4.2, T4.6).
 *
 * use(promise) yêu cầu CÙNG MỘT promise giữa các lần render. Nếu mỗi render gọi
 * getComments(id) ra promise mới thì: render → suspend → promise mới resolve → render lại →
 * lại tạo promise mới → suspend... vòng lặp request vô hạn. Cache giữ promise ổn định.
 */
export function createPromiseCache<T>(load: (key: string) => Promise<T>) {
  const cache = new Map<string, Promise<T>>();
  return {
    get(key: string): Promise<T> {
      let p = cache.get(key);
      if (!p) {
        p = load(key);
        // Lỗi thì bỏ khỏi cache để lần "Thử lại" gọi request mới.
        p.catch(() => cache.delete(key));
        cache.set(key, p);
      }
      return p;
    },
    invalidate(key: string) {
      cache.delete(key);
    },
  };
}
