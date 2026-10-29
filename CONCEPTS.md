# React concept checklist

Tick `[x]` when you can **explain it in your own words** (not just when the code is done).

## Fundamentals
- [ ] JSX & how it compiles to function calls — T0.1
- [ ] Components, props, `children` — T0.1
- [ ] Rendering lists & `key` — T0.2
- [ ] Conditional rendering — T0.3
- [ ] Purity & the UI tree — T0.4
- [ ] Composition vs prop drilling — T0.4, T3.2

## State
- [ ] `useState`, state as a snapshot — T1.1, T1.4
- [ ] Immutable updates — T1.1
- [ ] Controlled vs uncontrolled — T1.2
- [ ] Lifting state up, derived state — T1.3
- [ ] Batching & updater functions — T1.4
- [ ] Preserving/resetting state by position, `key` — T1.5
- [ ] `useReducer` — T1.6, T3.3

## Effects & Refs
- [ ] `useEffect`, dependencies, cleanup — T2.1
- [ ] Race conditions when fetching — T2.1
- [ ] When you DON'T need an effect — T2.2
- [ ] `useRef` (DOM & values) — T2.3
- [ ] Custom hooks — T2.4
- [ ] `useLayoutEffect` — T2.5
- [ ] `useSyncExternalStore` — T2.6
- [ ] `useEffectEvent` — T2.7
- [ ] Rules of Hooks — T2.4

## Architecture
- [ ] Routing, the URL as state — T3.1
- [ ] Context (`createContext`, Provider, `use(Context)`) — T3.2, T4.2
- [ ] Context + Reducer, splitting contexts — T3.3, T5.4
- [ ] Portals — T3.4
- [ ] Ref as a prop, `useImperativeHandle` — T3.5
- [ ] `useId` — T3.6
- [ ] Error Boundaries — T3.7

## React 19 / Concurrent
- [ ] `lazy` & `Suspense` — T4.1
- [ ] `use(promise)` — T4.2, T7.5
- [ ] Actions, `<form action>` — T4.3
- [ ] `useActionState` — T4.3
- [ ] `useFormStatus` — T4.4
- [ ] `useOptimistic` — T4.5
- [ ] `useTransition`, `startTransition` — T4.6
- [ ] `useDeferredValue` — T4.7
- [ ] `<Activity>` — T4.8
- [ ] Metadata & resource preloading — T4.9

## Performance
- [ ] React DevTools Profiler (Flamegraph, Ranked, why-rendered) — T5.1
- [ ] The `<Profiler>` API — T5.2
- [ ] `memo`, `useMemo`, `useCallback` — T5.3
- [ ] Colocation, children as props — T5.4
- [ ] Virtualization — T5.5
- [ ] React Performance Tracks (Chrome) — T5.6
- [ ] React Compiler — T5.7

## Quality
- [ ] Testing Library & Vitest — T6.1
- [ ] StrictMode — T6.2
- [ ] Accessibility & focus management — T6.3

## Server
- [ ] Server Components — T7.2
- [ ] The `'use client'` boundary — T7.2
- [ ] Server Functions, `'use server'` — T7.3
- [ ] Streaming SSR — T7.4
