# Frontend (Next.js)

Current baseline: Next.js 16.2.10, React 19.2.7, TypeScript 5.9.3, and ESLint 9 flat configuration.

Node.js 20.9 or newer is required.

## Run

```bash
npm install
npm run dev
```

## Validate

Stop any running development server before running the production build.

```bash
npm run lint
npx tsc --noEmit
npm run build
npm audit --omit=dev
```

## Production-like Preview

```bash
npm run build
npm run start
```

Open `http://localhost:3000`. If the FastAPI backend is unavailable, the frontend falls back to local mock lesson data.

## Routes

- `/`
- `/dashboard`
- `/lessons/hsk6-lesson-01`
- `/notebook`
- `/notebook/hsk6-lesson-01`
