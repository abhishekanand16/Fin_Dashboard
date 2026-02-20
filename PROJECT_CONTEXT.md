# PROJECT_CONTEXT.md

## 1) Project Goal and Summary

**Ledger (Fin_Dashboard)** is a personal financial dashboard for managing accounts, goals, stock portfolios, transactions, and analytics. Data is stored locally per user (localStorage + cookies). No backend database; optional integrations: Kite (Zerodha), Groww, and OpenAI for statement processing.

---

## 2) Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| UI | React 19, TypeScript 5 |
| Styling | Tailwind CSS 3.4 |
| Components | Radix UI, shadcn/ui |
| Charts | Recharts |
| Icons | Lucide React |
| Forms | React Hook Form, Zod |
| Theme | next-themes |
| Utils | date-fns, js-cookie, class-variance-authority, tailwind-merge, clsx |
| Package manager | pnpm |

---

## 3) Full Folder Tree

```
Fin_Dashboard/
├── .gitignore
├── app/
│   ├── analytics/
│   │   ├── loading.tsx
│   │   └── page.tsx
│   ├── api/
│   │   ├── groww-holdings/
│   │   │   └── route.ts
│   │   ├── kite-holdings/
│   │   │   └── route.ts
│   │   └── process-statement/
│   │       └── route.ts
│   ├── dashboard/
│   │   └── page.tsx
│   ├── goals/
│   │   └── page.tsx
│   ├── help/
│   │   └── page.tsx
│   ├── organization/
│   │   └── page.tsx
│   ├── settings/
│   │   └── page.tsx
│   ├── stocks/
│   │   ├── callback/
│   │   │   └── page.tsx
│   │   ├── callback.tsx
│   │   ├── groww-callback/
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── transactions/
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── dialogs/
│   │   ├── add-edit-account-dialog.tsx
│   │   ├── add-edit-event-dialog.tsx
│   │   ├── add-groww-holding-dialog.tsx
│   │   └── upload-statement-dialog.tsx
│   ├── ledger/
│   │   ├── analytics-content.tsx
│   │   ├── app-shell.tsx
│   │   ├── content.tsx
│   │   ├── dashboard-content.tsx
│   │   ├── dashboard.tsx
│   │   ├── layout.tsx
│   │   ├── list-01.tsx
│   │   ├── list-02.tsx
│   │   ├── list-03.tsx
│   │   ├── profile-01.tsx
│   │   ├── sidebar.tsx
│   │   └── top-nav.tsx
│   ├── ui/           # shadcn components (accordion, button, card, chart, etc.)
│   ├── providers.tsx
│   ├── style-provider.tsx
│   ├── theme-provider.tsx
│   └── theme-toggle.tsx
├── context/
│   ├── financial-data-context.tsx
│   └── user-context.tsx
├── hooks/
│   ├── use-mobile.tsx
│   └── use-toast.ts
├── lib/
│   └── utils.ts
├── public/           # favicon, placeholders, sample-statement.txt
├── styles/
│   └── globals.css
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── tailwind.config.js
├── tsconfig.json
├── PROJECT_REQUIREMENTS.txt
├── PROJECT_CONTEXT.md
└── README.md
```

---

## 4) Main Data Flow

1. **Entry**: `/` redirects to `/dashboard`. `AppShell` wraps all pages (sidebar + top nav + main content). `Providers` wrap app: `UserProvider` → `FinancialDataProvider` → `ThemeProvider` → `StyleProvider`.

2. **User**: `UserContext` holds `user` (name/email). Login sets cookie `demo_user` (30 days). Logout clears cookie and user-specific localStorage keys. Profile picture stored in `localStorage` key `profile_picture_${user}`.

3. **Financial data**: `FinancialDataContext` (depends on `useUser()`) loads/saves from `localStorage` key `dashboard_data_${user}`. Holds: accounts, events/goals, transactions, holdings, revenue/expenses for analytics. Writes are debounced. Broker holdings also use `kite_holdings` and `groww_holdings` in localStorage (cleared on logout).

4. **APIs (server)**:
   - **POST /api/process-statement**: Accepts file upload → AI (OpenAI) or rule-based extraction → returns transactions; client then merges into context.
   - **POST /api/kite-holdings**: Body `{ request_token, api_key }` → Kite session token → fetch positions → returns normalized holdings; client stores in context + localStorage.
   - **POST /api/groww-holdings**: Body `{ access_token }` → Groww API → returns normalized holdings; client stores in context + localStorage.

5. **Pages**: Each route (`/dashboard`, `/analytics`, `/goals`, `/stocks`, `/transactions`, `/settings`, `/help`, `/organization`) renders ledger content that uses `useUser()` and financial context; no server-side DB.

---

## 5) Key Features

- **Auth**: Demo login (name/email), cookie persistence, per-user data isolation.
- **Accounts**: CRUD for account types (savings, checking, investment, debt, salary); salary used in analytics.
- **Goals**: Financial goals with target date, progress, days remaining, status (overdue / due today / upcoming).
- **Stocks**: Kite OAuth + holdings API; Groww holdings API; manual add; broker filter; P&amp;L and %.
- **Transactions**: Upload bank statement (text) → AI or rule-based parsing → categories and payment methods; search/filter by type.
- **Analytics**: Revenue/expense charts; salary as revenue when no data.
- **Settings**: Profile picture, currency, salary, theme (light/dark/system), style (standard/glass).
- **Help**: FAQs and troubleshooting.

---

## 6) Current Status

- **Functional**: Dashboard, accounts, goals, stocks (Kite/Groww + manual), transactions (upload + AI/fallback), analytics, settings, help, and organization pages are implemented.
- **Data**: Client-only persistence (localStorage + cookies). No database. Optional env: `KITE_API_KEY`, `KITE_API_SECRET`, `GROWW_API_KEY`, `GROWW_API_SECRET`, `OPENAI_API_KEY` (or `NEXT_PUBLIC_OPENAI_API_KEY`) for integrations.
- **UI**: Responsive, dark mode, optional glass style, loading states, toasts.

---

## 7) Known Issues / TODOs

- **Codebase**: No explicit `TODO`/`FIXME` comments found in source.
- **From README (future work)**: Real auth with passwords; cloud sync; export/import (CSV, PDF); advanced analytics; mobile app; multi-currency live rates; budget planning; recurring transactions; mutual funds/ETFs; tax reporting; expense splitting; bill reminders; goal templates; backup/restore.
- **Integrations**: Kite and Groww require env keys; statement AI requires OpenAI key; otherwise fallback or manual entry used.
- **Broker data on logout**: Kite/Groww holdings are cleared on logout (stored in generic keys, not per-user).
