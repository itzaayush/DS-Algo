<div align="center">

# 🧭 AlgoQuest

**Zero → hero in data structures, algorithms & competitive programming.**

A visual, pattern-led learning platform with interactive algorithm traces, animated
flowcharts, and a Three.js adventure game.

<p>
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs&logoColor=white" />
  <img alt="React" src="https://img.shields.io/badge/React-19-149eca?logo=react&logoColor=white" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript&logoColor=white" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss&logoColor=white" />
  <img alt="Three.js" src="https://img.shields.io/badge/Three.js-r185-000000?logo=threedotjs&logoColor=white" />
  <img alt="Status" src="https://img.shields.io/badge/status-v1%20slice-brightgreen" />
</p>

[Quick start](#-quick-start) · [Features](#-features) · [Tech stack](#-tech-stack) · [Structure](#️-project-structure) · [Add a lesson](#-add-a-lesson) · [Contributing](#-contributing)

</div>

---

## ⚡ Quick start

```bash
git clone <your-fork-url> && cd algoquest
npm install
npm run dev          # ▶ http://localhost:3000
```

<details>
<summary><b>📦 All scripts</b></summary>

| Script | What it does |
| :-- | :-- |
| `npm run dev` | Start the dev server (Turbopack) on `:3000` |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

</details>

<details>
<summary><b>🧰 Requirements</b></summary>

- **Node.js 20+**
- The PRD specifies **pnpm** — this workspace uses **npm** because the environment blocked
  corepack from writing global shims. Swap `pnpm install` / `pnpm dev` wherever pnpm is available.

</details>

---

## ✨ Features

| | Feature | What you get |
| :--: | :-- | :-- |
| 🎬 | **Interactive visualizers** | A deterministic step engine drives bubble / selection / insertion sort and linear / binary search. Play, pause, step, scrub, change speed, and feed custom input — code, data, narration, and flowchart stay in lockstep. |
| 🗺️ | **Animated flowcharts** | Zoomable / pannable React Flow diagrams whose active node lights up in sync with the trace, plus a structured text fallback. |
| 📚 | **Complete lessons** | hook → objectives → analogy → concept → visualizer → flowchart → pseudocode → JS → complexity → mistakes → recap → **mastery quiz (80% gate)** → curated practice. |
| 🧩 | **Pattern Lab** | A 20-unit catalog (6 fully authored) with recognition-first teaching. |
| 🏋️ | **Practice library** | Curated LeetCode & Codeforces links with filters, spoiler-free hints, company tags, and per-problem status tracking (URL-synced). |
| 🎮 | **Three.js Adventure** | A 3D "sort the towers" game with lighting, shadows, orbit camera, lesson-gated levels, a full **2D fallback**, and reduced-motion support. |
| 🏆 | **Progress system** | Levels, XP, streaks, achievements (with unlock toasts), bookmarks, and a dashboard — persisted to `localStorage` via Zustand. |
| ♿ | **Accessibility** | Keyboard-operable visualizers, text traces, reduced-motion (OS + in-app), focus states, skip link, and non-WebGL paths. |

---

## 🧱 Tech stack

| Layer | Tools |
| :-- | :-- |
| **Framework** | Next.js 16 (App Router · Turbopack) · React 19 · TypeScript (strict) |
| **Styling** | Tailwind CSS 4 · Radix UI · Lucide · `clsx` / `tailwind-merge` |
| **Motion & 3D** | Motion · Three.js · React Three Fiber · Drei |
| **Data-viz** | React Flow (`@xyflow/react`) · D3 · Shiki (code highlighting) |
| **State & schema** | Zustand (persisted) · Zod |

---

## 🗂️ Project structure

```text
src/
├─ app/                     # routes: /, learn, patterns, practice, adventure,
│                           #         dashboard, bookmarks, achievements, settings, onboarding
├─ components/
│  ├─ visualizer/           # deterministic trace player (canvas, controls, code, step list)
│  ├─ flowchart/            # React Flow diagram + text fallback
│  ├─ adventure/            # Three.js scene, 2D fallback, world map, level shell
│  └─ lesson/ home/ ui/ …   # lesson islands, home sections, design-system primitives
├─ content/                 # typed lessons, patterns, practice, achievements, adventure levels
├─ lib/                     # algorithm engine, Zod schema, content access + unlock logic
├─ store/                   # Zustand progress store (persisted)
└─ hooks/                   # visualizer, sort-game, hydration, reduced-motion
```

<details>
<summary><b>🧭 Routes at a glance</b></summary>

| Route | Purpose |
| :-- | :-- |
| `/` | Landing / hero |
| `/onboarding` | First-run experience |
| `/learn` | Curriculum map + lessons (`/learn/[slug]`) |
| `/patterns` | Pattern Lab (`/patterns/[slug]`) |
| `/practice` | Filterable practice library |
| `/adventure` | Three.js "sort the towers" game |
| `/dashboard` | Progress, XP, streaks |
| `/bookmarks` · `/achievements` · `/settings` | Personalization + accessibility |

</details>

---

## ➕ Add a lesson

1. Author a typed object against [`src/lib/schema.ts`](src/lib/schema.ts) in `src/content/lessons/`.
2. Register it in `src/content/lessons/index.ts`.
3. Point a module's `lessonSlugs` at its slug.

`validateContent()` in [`src/lib/content.ts`](src/lib/content.ts) parses **all** content against
Zod, so a typo fails fast — wire it into CI as a content gate.

---

## 🤝 Contributing

```bash
# 1. Branch
git checkout -b feat/my-lesson

# 2. Keep it green
npm run lint
npm run build

# 3. Open a PR 🎉
```

- **TypeScript is strict** — no `any` escape hatches.
- **Content is typed** — new lessons / patterns / problems must satisfy the Zod schema.
- **Accessibility is a feature** — keep keyboard paths and reduced-motion fallbacks intact.

---

## 📈 Status

A polished **v1 vertical slice** of the PRD: the full experience shell plus three complete
lessons, six patterns, 23 practice problems, and one playable 3D level (+ fallback). Built so
new content and backend integration (Auth.js, Postgres/Drizzle, S3/CDN) slot in without rework.

<div align="center">

Built from [`../prd.md`](../prd.md) · Happy questing 🚀

</div>
