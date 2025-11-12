# Automobile Service Management System (ASMS)

A modern, full‑stack web application for managing automobile services and custom modification projects. The system provides role‑based portals for Customers and Employees with real‑time progress tracking, appointment booking, project (modification) requests, and operational tooling.

### Highlights

- Customer portal to manage vehicles, book service appointments, and request modification projects
- Employee portal to manage work logs, update statuses, and view upcoming tasks
- Real‑time updates (SSE/WebSockets/polling ready)
- Secure authentication with role‑based access control (Customer, Employee/Admin)
- Container‑ready deployment (frontend + backend + database)

---

## Tech Stack

- Frontend: Next.js (App Router), TypeScript, Tailwind CSS
- State/Data: Axios with interceptors, local component state
- AuthN/Z: JWT (Bearer) via backend, role read from token
- Realtime: Pluggable (SSE/WebSockets or polling)
- Tooling: ESLint, PostCSS

---

## Project Structure (frontend)

```
asms-frontend/
├─ src/app/
│  ├─ customer/
│  │  ├─ customerAppoinments/           # Appointments + Vehicles (customer)
│  │  │  ├─ components/
│  │  │  │  ├─ AppointmentForm.tsx      # Project-only booking + work order
│  │  │  │  ├─ AppointmentList.tsx      # My Appointments card (fetches GET)
│  │  │  │  ├─ CarDetailsForm.tsx       # Vehicle add + list (POST vehicles)
│  │  │  ├─ page.tsx                    # Customer appointments page (fetch vehicles)
│  │  ├─ dashboard/                     # Customer dashboard sections
│  │  ├─ components/                    # Navbar, footer, chatbot
│  ├─ employee/                         # Employee portal
│  ├─ services/                         # Auth/JWT helpers, user services
│  ├─ lib/axios.ts                      # Axios instance + Bearer token interceptor
│  ├─ layout.tsx, page.tsx, globals.css
├─ public/                              # Static assets (logos, images)
├─ package.json, tsconfig.json, eslint.config.mjs
```

---

## Features

### 1) Customer

- Secure login & signup
- Dashboard with service/project progress
- Manage vehicles (add via POST `/api/customer/vehicles`)
- Book appointment (project‑only) via POST `/api/customer/appointments`
- Create project work order via POST `/api/customer/work-orders`
- View “My Appointments” (GET `/api/customer/appointments`) inside the card
- Mobile‑friendly UI
- Optional chatbot integration (Generative AI) to check service slots

### 2) Employee

- Login & authentication
- Log time against projects/services
- Update progress/status of ongoing tasks
- View upcoming appointments and requests

### 3) System Requirements

- Real‑time updates (SSE/WebSockets/polling) – integration points provided
- Containerized deployment (frontend + backend + database)
- Role‑based access control (customer vs employee/admin)
- Secure handling of auth and user data (Bearer JWT; minimal storage)

---

## Getting Started (Frontend)

### Prerequisites

- Node.js 18+
- A running backend at `http://localhost:8080` (or your URL)

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment

Create a `.env.local` at the repo root:

```bash
NEXT_PUBLIC_BASE_URL=http://localhost:8080
```

### 3) Run the app

```bash
npm run dev
# App: http://localhost:3000
```

### 4) Build & start

```bash
npm run build
npm start
```

---

## Authentication

- On successful login, the backend returns a JWT. The token is stored in `localStorage` as `authToken`.
- All API calls use `src/app/lib/axios.ts`, which attaches `Authorization: Bearer <token>` automatically via a request interceptor.

Code excerpt:

```ts
// src/app/lib/axios.ts
axiosInstance.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

---

## Key Flows (Customer)

### Vehicles

- Add vehicle: `POST /api/customer/vehicles`
- “My Vehicles” appears in the appointments page via `CarDetailsForm.tsx`

### Appointments (Project‑only)

- Create appointment: `POST /api/customer/appointments` with `{ vehicleId, appointmentDate }`
- Create work order: `POST /api/customer/work-orders` with `{ vehicleId, type: 'PROJECT', title, description, estimatedCost, estimatedCompletion }`
- View appointments: `GET /api/customer/appointments` (loaded inside `AppointmentList.tsx`)

### Example Request (from UI)

```ts
await axiosInstance.post("/api/customer/appointments", {
  vehicleId: 1,
  appointmentDate: new Date().toISOString(),
});

await axiosInstance.post("/api/customer/work-orders", {
  vehicleId: 1,
  type: "PROJECT",
  title: "Custom Body Kit Installation",
  description: "Front/rear bumpers, side skirts, spoiler",
  estimatedCost: 2500,
  estimatedCompletion: new Date().toISOString(),
});
```

---

## Realtime Updates

The UI is structured to support any of the following strategies:

- Server‑Sent Events (SSE)
- WebSockets
- Interval polling

## Scripts

---

## Contributing

1. Fork the repo and create a feature branch.
2. Commit changes with clear messages.
3. Open a Pull Request describing your changes and screenshots if UI related.

---

## License

This project is provided under the MIT License. See `LICENSE` (add if not present).

---

## Roadmap / Next Steps

- Wire real‑time updates for status/progress (SSE or WebSockets)
- Add e2e tests and integration tests
- Expand employee analytics and reporting
- Harden auth flows (refresh tokens, token rotation)
