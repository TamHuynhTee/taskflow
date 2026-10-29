// Generates fake data for json-server.
//   npm run gen:seed  -> db.seed.json (2 boards, 30 cards) — normal learning data
//   npm run gen:big   -> db.big.json  (5 boards, 5000 cards) — data for Level 5 (Profiler)
// Uses a PRNG with a fixed seed, so every run produces the same data.

import { writeFileSync } from 'node:fs'
import type { Board, Card, Column, ColumnId, Comment, Label, Priority, User } from '../src/types.ts'

function arg(name: string, fallback: string) {
  const i = process.argv.indexOf(`--${name}`)
  return i === -1 ? fallback : process.argv[i + 1]
}

const cardCount = Number(arg('cards', '30'))
const boardCount = Number(arg('boards', '2'))
const out = arg('out', 'db.seed.json')

let seed = 42
function rand() {
  // mulberry32
  seed |= 0
  seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}
const pick = <T,>(arr: readonly T[]) => arr[Math.floor(rand() * arr.length)]

const columns: Column[] = [
  { id: 'todo', title: 'To do' },
  { id: 'doing', title: 'In progress' },
  { id: 'done', title: 'Done' },
]

const users: User[] = [
  { id: 'u1', name: 'An', avatarColor: '#e57373' },
  { id: 'u2', name: 'Ben', avatarColor: '#64b5f6' },
  { id: 'u3', name: 'Chi', avatarColor: '#81c784' },
  { id: 'u4', name: 'Dan', avatarColor: '#ffb74d' },
]

const boardNames = [
  ['Online store', 'Rebuild the shop and checkout pages'],
  ['Mobile app', 'Booking app for a gym'],
  ['Internal', 'Admin tools for the team'],
  ['Marketing', 'Year-end campaign'],
  ['Infrastructure', 'CI/CD, monitoring, security'],
]

const verbs = ['Design', 'Fix bugs in', 'Write tests for', 'Optimize', 'Refactor', 'Add', 'Review', 'Document']
const things = [
  'login page', 'shopping cart', 'payment form', 'product list', 'search bar',
  'navigation menu', 'profile page', 'email notifications', 'filters', 'dark mode', 'pagination',
  'image upload', 'dashboard', 'orders API', '404 page',
]
const labels: Label[] = ['bug', 'feature', 'design', 'docs', 'chore']
const priorities: Priority[] = ['low', 'medium', 'high', 'urgent']
const columnIds: ColumnId[] = ['todo', 'doing', 'done']
const commentTexts = [
  "I'll take this one.", 'PR is up, please review.', 'Blocked by the API, waiting on backend.',
  'Needs another mockup.', 'Tested on mobile, looks good.', 'Broken on Safari.',
]

const baseDate = Date.UTC(2026, 9, 1)
const day = 24 * 60 * 60 * 1000
const isoDate = (offsetDays: number) => new Date(baseDate + offsetDays * day).toISOString()

const boards: Board[] = Array.from({ length: boardCount }, (_, i) => {
  const [title, description] = boardNames[i % boardNames.length]
  return {
    id: `b${i + 1}`,
    title: i < boardNames.length ? title : `${title} ${i + 1}`,
    description,
    columns,
    createdAt: isoDate(-30 + i),
  }
})

const orderCounter = new Map<string, number>()
const cards: Card[] = Array.from({ length: cardCount }, (_, i) => {
  const boardId = boards[i % boards.length].id
  const columnId = pick(columnIds)
  const key = `${boardId}:${columnId}`
  const order = orderCounter.get(key) ?? 0
  orderCounter.set(key, order + 1)
  const labelSet = new Set<Label>([pick(labels)])
  if (rand() < 0.3) labelSet.add(pick(labels))
  return {
    id: `c${i + 1}`,
    boardId,
    columnId,
    title: `${pick(verbs)} ${pick(things)}`,
    description: rand() < 0.6 ? 'Details: acceptance criteria, design link, technical notes.' : '',
    labels: [...labelSet],
    priority: pick(priorities),
    dueDate: rand() < 0.7 ? isoDate(Math.floor(rand() * 60) - 20).slice(0, 10) : null,
    assigneeId: rand() < 0.8 ? pick(users).id : null,
    order,
    createdAt: isoDate(-Math.floor(rand() * 30)),
  }
})

const comments: Comment[] = []
for (const card of cards.slice(0, Math.min(cards.length, 200))) {
  const n = Math.floor(rand() * 4)
  for (let k = 0; k < n; k++) {
    comments.push({
      id: `cm${comments.length + 1}`,
      cardId: card.id,
      authorId: pick(users).id,
      content: pick(commentTexts),
      createdAt: isoDate(-Math.floor(rand() * 10)),
    })
  }
}

writeFileSync(out, JSON.stringify({ users, boards, cards, comments }, null, 2) + '\n')
console.log(`Wrote ${out}: ${boards.length} boards, ${cards.length} cards, ${comments.length} comments`)
