# PetHealth Hub

Real-time household pet health tracker. One tap to log feedings, walks, and medications — instantly visible to everyone in your home.

Built with Next.js 14+, Clerk Organizations, Supabase Realtime, and TanStack Query.

## Features

- **Shared Household Dashboard** — Clerk Organizations handle multi-user access with no custom invite system
- **Real-Time Status Buttons** — Tap "Fed", "Walked", or "Meds" and every household member sees the update instantly via Supabase Realtime
- **Attribution** — "Luna was fed by Gemini at 8:45 AM" displayed below each button
- **Medication Schedule** — Live countdown timers showing when each dose is next due
- **Optimistic Updates** — UI responds immediately; syncs in the background
- **Midnight Auto-Reset** — Status buttons reset daily (client-side date filtering)
- **PWA** — Installable on iOS/Android for quick access during pet care
- **Mobile-First** — Bottom tab navigation, responsive card grid

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14+ (App Router), Tailwind CSS, Shadcn/UI |
| Auth | Clerk (Organizations for shared households) |
| Database | Supabase (PostgreSQL + Realtime) |
| State | TanStack Query (React Query) with optimistic updates |
| Icons | Lucide React |

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/missykayko/pethealth-hub.git
cd pethealth-hub
npm install
```

### 2. Set up Clerk

1. Create an app at [clerk.com](https://clerk.com)
2. Enable **Organizations** in the Clerk dashboard
3. Copy your publishable key and secret key

### 3. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Run the schema in `src/lib/supabase-schema.sql` via the SQL Editor
3. Enable **Realtime** on the `status_logs` table (Database → Replication)
4. Copy your project URL and anon key

### 4. Configure environment

```bash
cp .env.local.example .env.local
```

Fill in your keys:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 5. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── (app)/              # Authenticated routes
│   │   ├── dashboard/      # Pet cards + medication schedule
│   │   ├── medications/    # Medication list view
│   │   └── pets/           # Add/edit pets + manage meds
│   ├── api/cron/reset/     # Optional midnight cleanup endpoint
│   ├── sign-in/            # Clerk sign-in
│   └── sign-up/            # Clerk sign-up
├── components/
│   ├── ui/                 # Shadcn/UI primitives
│   ├── pet-card.tsx        # Pet card with status buttons
│   ├── status-button.tsx   # Fed/Walked/Meds buttons
│   ├── medication-list.tsx # Dose countdown timers
│   ├── pet-form.tsx        # Add/edit pet form
│   └── medication-form.tsx # Add medication form
├── hooks/
│   ├── use-household.ts    # Clerk org → Supabase household
│   ├── use-pets.ts         # CRUD for pets
│   ├── use-medications.ts  # CRUD for medications
│   └── use-status-logs.ts  # Real-time status with optimistic updates
├── lib/
│   ├── supabase.ts         # Supabase client
│   └── supabase-schema.sql # Database DDL
└── types/
    └── database.ts         # TypeScript types for all tables
```

## Database Schema

Four tables with Row Level Security enabled:

- **households** — linked to Clerk org via `clerk_org_id`
- **pets** — belongs to a household
- **medications** — belongs to a pet, tracks dosage and frequency
- **status_logs** — records every fed/walked/medicated action with attribution
