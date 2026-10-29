/**
 * Promise cache keyed by id — for use with use() (T4.2, T4.6).
 *
 * use(promise) needs the SAME promise across renders. If every render called
 * getComments(id) and got a new promise: render → suspend → new promise resolves → re-render →
 * another new promise → suspend... an endless request loop. The cache keeps the promise stable.
 */
export function createPromiseCache<T>(load: (key: string) => Promise<T>) {
  const cache = new Map<string, Promise<T>>();
  return {
    get(key: string): Promise<T> {
      let p = cache.get(key);
      if (!p) {
        p = load(key);
        // On failure, drop it from the cache so "Retry" sends a new request.
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
