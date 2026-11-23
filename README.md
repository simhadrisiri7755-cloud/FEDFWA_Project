# Staffly — Employee Management System

A clean, accessible front end for managing employees: profiles, roles, attendance, leave, payslips and performance.
Built with **React + Vite**, **Redux Toolkit**, **React Router**, **Tailwind CSS** and **Material UI**.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # Jest + React Testing Library
npm run build      # production build in /dist
npm run preview    # serve the production build locally
```

### Demo accounts

| Role | Email | Password |
|------|-------|----------|
| HR administrator | `hr@company.com` | `hr123` |
| Employee | `arjun@company.com` | `emp123` |

New employees created by HR get the password `emp123`.
Data lives in `localStorage` (key `ems.db.v1`); clear it in DevTools to reset the demo.

## What each role can do

**HR** — add / edit / remove employees, assign access roles, search / filter / sort / paginate the directory, approve or reject leave, view team attendance by date, rate performance, and see a dashboard of headcount and pending work.

**Employee** — check in / out, see leave balances and apply for leave, view and print payslips, update their own contact details.

## Sign up & account rules

- **Create account** (`/signup`) — name, work email, mobile, department, job title, location, password + confirmation, terms checkbox. Live password-strength meter, show/hide passwords, focus jumps to the first invalid field.
- Self-sign-up **always creates an Employee**; HR accounts can only be created or promoted by HR, so nobody can register themselves as an administrator.
- Validation runs in the browser (`validateSignup`) **and** again inside `api.register` (a real server must never trust the client). Names are whitespace-normalised, emails lower-cased, duplicates rejected.
- A new account starts with salary `0`: the dashboard shows “Pending”, the profile shows “Awaiting HR”, and Payslips shows a friendly empty state until HR sets the CTC. Payslips are also limited to completed months on or after the joining date.
- Passwords are stored in plain text **only because this is a localStorage demo** — a real Express/MongoDB backend must hash them (bcrypt/argon2).

## UI design system

The interface is built on a small set of **design tokens** (CSS custom properties in `src/index.css`, exposed to Tailwind through `@theme inline`), so every colour, shadow and radius is defined once.

- **Light + dark mode** — the `.dark` class on `<html>` swaps the whole palette. The choice is saved in `localStorage` (`ems.theme`), follows the OS until the user picks one, and is applied before first paint (inline script in `index.html`) so there is no flash. MUI (Dialog, Drawer, Snackbar) receives the matching palette from `src/theme.js`.
- **Layout shell** — dark gradient sidebar with an active-route indicator, sticky blurred top bar on desktop, drawer navigation on mobile.
- **Dashboard** — gradient welcome hero, animated count-up stat cards, SVG donut chart (headcount by department), progress ring (attendance today), leave-balance bars. No chart library is needed.
- **Cursor light** — a soft aura follows the pointer across the page, and cards, stat tiles, the hero, sidebar items and primary buttons light up (inner glow + glowing border) as the cursor approaches (`hooks/useSpotlight.js`, `.spotlight` classes in `index.css`). One `pointermove` listener and one `requestAnimationFrame` loop; disabled on touch screens and for `prefers-reduced-motion`.
- **Motion** — `@keyframes` fade-up / pop-in / float / ring-draw, staggered entrances, hover transforms; everything is disabled by `prefers-reduced-motion`.
- **Accessibility** — status colours are paired with text and a dot; all token pairs keep text contrast at 4.5:1 or better in both modes; charts have a text legend and an `aria-label`.

## Syllabus coverage

| CO | Topics used in this project |
|----|-----------------------------|
| **CO-1** | Semantic HTML5 (`header`, `nav`, `main`, `aside`, `section`, `article`, `table` with captions); forms with `placeholder`, `required`, `autofocus`, `pattern`, `type=email/tel/date/number`; `.gitignore` included (see *Git workflow* below) |
| **CO-2** | Tailwind utility CSS, Flexbox + CSS Grid layouts, responsive design with breakpoints, CSS transitions / transforms, `@keyframes` fade-up animation, `prefers-reduced-motion`, print media query for payslips; JS: ES6+ modules, destructuring, `async/await` + Promises (`src/api/mockApi.js`), form validation (`src/utils/validators.js`), error handling, `localStorage`, JSON processing, classes (`ErrorBoundary`) |
| **CO-3** | Functional components, props & state, `useState` / `useEffect`, controlled forms, conditional & list rendering, React Router (nested + protected routes), Atomic Design folders, Redux Toolkit (`createSlice`, `createAsyncThunk`, `createEntityAdapter`), Material UI (`Dialog`, `Drawer`, `Snackbar`), Tailwind, Vite + Vercel deploy |
| **CO-4** | Context API (`AuthContext`, `ToastContext`), custom hooks (`useAuth`, `useDebounce`, `useLocalStorage`, `useToast`, `useDocumentTitle`), lazy loading (`React.lazy` + `Suspense`), Error Boundaries, Jest + RTL tests, input validation & sanitisation (trimming, normalised payloads). `src/api/mockApi.js` mirrors a REST API (GET / POST / PUT / DELETE) so it can be swapped for an Express backend with `fetch` |
| **CO-5** | Not covered — this project is the React (Vite) front end only. The data layer is isolated so a Next.js / MongoDB back end can replace it later |
| **CO-6** | Vite build pipeline with vendor chunk splitting, `vercel.json` for Vercel, WCAG AA accessibility, performance (`React.memo`, `useMemo`, `useCallback`, route-level code splitting) |

## Accessibility (WCAG 2.1 AA)

- Skip-to-content link, landmark regions, one `h1` per page, descriptive `<title>` per route
- Every input has a visible `<label>`; errors use `aria-invalid` + `aria-describedby`, and focus jumps to the first invalid field
- Colour contrast ≥ 4.5:1 for text; status is always text + colour, never colour alone
- Visible `:focus-visible` rings, full keyboard support (tabs use arrow keys; MUI Dialog / Drawer trap focus and close on Esc)
- Data tables use `<caption>`, `scope`, and row headers; toasts use `role="alert"`
- Respects `prefers-reduced-motion`

## Performance

- Every page is a lazily loaded chunk; vendor code (React, Router, Redux, MUI) is split into separate long-cache files
- `React.memo` on table rows, `useMemo` for filtered lists, debounced search, memoised context values

## Project structure

```
src/
  api/           mockApi.js            async, localStorage-backed "backend"
  components/
    atoms/       Button, Badge, Avatar, Card, Icon, Spinner, Skeleton
    molecules/   Field, StatCard, Tabs, Pagination, ConfirmDialog, RatingStars, ...
    organisms/   Sidebar, EmployeeTable, EmployeeForm, LeaveForm, LeaveTable, PayslipView, ...
    templates/   AppLayout
  context/       AuthContext, ToastContext
  data/          seed.js
  hooks/         useAuth, useDebounce, useLocalStorage, useToast, useDocumentTitle
  pages/         Login, Dashboard, Employees, EmployeeEditor, Attendance, Leaves, Performance, Payslips, Profile
  store/         Redux Toolkit slices (employees, leaves, attendance)
  utils/         date, format, validators, payroll, leave, attendance
```

## Deploy to Vercel

1. Push the repo to GitHub.
2. Import it in Vercel — the Vite preset is detected automatically (`vercel.json` adds the SPA rewrite so deep links work).
3. Build command `npm run build`, output directory `dist`.

## Git workflow (CO-1)

```bash
git init
git add .
git commit -m "chore: scaffold Vite + React project"
git switch -c feature/employee-directory      # one branch per feature
# ...work, commit often...
git switch main && git merge feature/employee-directory
git remote add origin <your-repo-url> && git push -u origin main
```
