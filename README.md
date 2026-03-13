# DIAG — Onboarding & Dashboard

A pixel-perfect Next.js implementation of the DIAG multi-step onboarding flow and analytics dashboard, built with **Next.js 14 App Router**, **Tailwind CSS**, and **JavaScript**.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18.17 or higher → [nodejs.org](https://nodejs.org/)
- **npm** v9+

Verify:

```bash
node -v   # should be v18.17+
npm -v    # should be v9+
```

---

### Installation & Setup

**Step 1 — Extract**

```bash
unzip diag-onboarding.zip
cd diag
```

**Step 2 — Install dependencies**

```bash
npm install
```

**Step 3 — Start dev server**

```bash
npm run dev
```

Visit **http://localhost:3000** 🎉

---

### Production Build

```bash
npm run build
npm run start
```

---

## 📁 Folder Architecture

```
diag/
├── public/
│
├── src/
│   └── app/
│       ├── globals.css               # Global styles + Tailwind
│       ├── layout.js                 # Root HTML layout
│       ├── page.js                   # Multi-step onboarding flow (all steps)
│       ├── dashboard/
│       │   └── page.js               # Analytics dashboard
│       └── api/
│           ├── register/
│           │   └── route.js          # POST /api/register
│           ├── verify/
│           │   └── route.js          # POST /api/verify
│           ├── onboarding/
│           │   └── route.js          # POST /api/onboarding
│           ├── workspace/
│           │   └── route.js          # POST /api/workspace
│           ├── invite/
│           │   └── route.js          # POST /api/invite
│           └── focus/
│               └── route.js          # POST /api/focus
│
├── .npmrc                            # legacy-peer-deps=true
├── jsconfig.json                     # Path alias @/
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── README.md
```

---

## 🧩 Screens Built

| Screen                         | Route          | Description                                            |
| ------------------------------ | -------------- | ------------------------------------------------------ |
| **Step 1 — Create Account**    | `/`            | Email + password form with show/hide toggle            |
| **Step 1b — Verify Email**     | `/` (sub-step) | 6-digit OTP input with auto-focus and countdown resend |
| **Step 2 — Tell Us About You** | `/` (sub-step) | Name, role, team size radio selection                  |
| **Step 3a — Create Workspace** | `/` (sub-step) | Workspace name input                                   |
| **Step 3b — Invite Teammates** | `/` (sub-step) | Email invite with quick tips, skip option              |
| **Step 4 — Choose Your Focus** | `/` (sub-step) | 5-option use-case card grid                            |
| **Dashboard**                  | `/dashboard`   | Full analytics dashboard with charts and table         |

---

## 🏗️ Backend Architecture

### API Routes

| Endpoint          | Method | Payload                                | Description                                         |
| ----------------- | ------ | -------------------------------------- | --------------------------------------------------- |
| `/api/register`   | `POST` | `{ email, password, confirmPassword }` | Validates input, generates 6-digit OTP, stores user |
| `/api/verify`     | `POST` | `{ email, code }`                      | Verifies 6-digit OTP (demo: any valid code passes)  |
| `/api/onboarding` | `POST` | `{ name, role, teamSize }`             | Saves user profile data                             |
| `/api/workspace`  | `POST` | `{ workspaceName }`                    | Creates workspace with unique ID                    |
| `/api/invite`     | `POST` | `{ emails: [] }`                       | Validates and processes teammate invites            |
| `/api/focus`      | `POST` | `{ focus }`                            | Saves user's focus/use-case selection               |

### Validation Applied

- Email format validation with regex
- Password minimum 8 characters
- Password confirmation matching
- Workspace name minimum 2 characters
- Multi-email validation for invite flow

### Scaling to Production

The current in-memory store is swap-ready. Replace with:

- **Database** — PostgreSQL via Prisma, or MongoDB via Mongoose
- **Auth** — NextAuth.js or Clerk for session management
- **Email** — Resend or SendGrid for real OTP delivery
- **Password hashing** — bcrypt before storing

---

## 🎨 Design Tokens

| Token        | Value     | Usage                       |
| ------------ | --------- | --------------------------- |
| Background   | `#f0f2f5` | Page background             |
| Brand Indigo | `#4f46e5` | Primary CTAs, active states |
| Active Light | `#eef2ff` | Selected card backgrounds   |
| Muted Text   | `#9ca3af` | Labels, placeholders        |
| Body Font    | `Inter`   | All text                    |

---

## 🔄 Onboarding Flow

```
/ (page.js)
│
├── create     → Step 1: Email + Password form
│                   ↓ POST /api/register
├── verify     → Step 1b: 6-digit OTP
│                   ↓ POST /api/verify
├── about      → Step 2: Name + Role + Team size
│                   ↓ POST /api/onboarding
├── workspace  → Step 3a: Workspace name
│                   ↓ POST /api/workspace
├── invite     → Step 3b: Invite by email (skippable)
│                   ↓ POST /api/invite
└── focus      → Step 4: Choose use case
                    ↓ POST /api/focus
                    → redirect /dashboard
```

The left sidebar step indicator updates automatically:

- ⚪ Upcoming steps — grey circle
- 🟣 Current step — filled indigo circle
- ✅ Completed steps — indigo circle with checkmark + indigo connector line

---

## 📱 Responsive Design

- Onboarding layout stacks vertically on mobile (sidebar above, form below)
- Dashboard adapts KPI cards and charts to smaller screens
- All inputs and buttons are full-width on mobile

---

## 🤖 AI Tools Used

Built using **Claude AI** (Anthropic) for:

- Component scaffolding and boilerplate generation
- SVG chart implementation (area, bar, donut)
- API route architecture and validation logic
- Multi-step state management pattern

All generated code was reviewed and structured for production quality.

---

## 🌐 Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

Or connect GitHub repo at [vercel.com](https://vercel.com) for auto CI/CD.

---

## 📜 Scripts

| Command         | Description                        |
| --------------- | ---------------------------------- |
| `npm run dev`   | Start dev server at localhost:3000 |
| `npm run build` | Production build                   |
| `npm run start` | Run production server              |
| `npm run lint`  | ESLint checks                      |

---

## 🔧 Tech Stack

| Technology   | Version | Purpose                         |
| ------------ | ------- | ------------------------------- |
| Next.js      | 14.2.5  | React framework with App Router |
| React        | 18      | UI library                      |
| Tailwind CSS | 3.4.1   | Utility-first styling           |
| JavaScript   | ES6+    | Language                        |

---

Built by Adigwu Chinedum Hilary for the **Upcut Technical Assessment**
