# TaskFlow — React Todo Dashboard

A distinctive, responsive React dashboard for the existing **Node JS Course Backend / todo app** Express + MongoDB API.

## Requirements
- Node.js (recent LTS recommended)
- Running course backend on port 5000
- Local MongoDB connected to the course backend

## Run on Windows
1. Open **todo app** (backend) in VS Code, and run `npm run dev` in Terminal 1.
2. Open **taskflow-react** (this frontend) in a separate VS Code window.
3. Run `npm install` then `npm run dev` in Terminal 2.
4. Visit `http://127.0.0.1:5173`.

Optional: duplicate `.env.example` to `.env` to customize `VITE_API_URL`.

## API contract
- `GET /api/todos` — list tasks
- `POST /api/todos` — create `{ title, completed }`
- `PUT /api/todos/:id` — update `{ title }` and/or `{ completed }`
- `DELETE /api/todos/:id` — delete task (204 No Content)

No API changes are required: the course backend already uses `cors()` middleware. Frontend has no fake task data: all task operations use the API.

## Features
- Add / edit / complete / delete tasks
- Filters, text search, progress summary
- Responsive sidebar, branded logo, animated task transitions, toast feedback
- Network errors, empty states, loading states, keyboard-friendly controls
- `prefers-reduced-motion` support

## Tech
React, Vite, Motion for React, Lucide icons, CSS.

## Notes
The original backend has limited error handling and PUT validation. We recommend adding server-side validation and integration tests before deploying it publicly. **Do not commit your `.env` secrets.**

This interface is a new companion application; it does not claim to be the original course author’s work.
