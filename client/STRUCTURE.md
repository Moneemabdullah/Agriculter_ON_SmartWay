# Client Folder Structure (Production Standard)

## Overview

The client follows an industry-standard feature-based architecture suitable for production applications.

```
src/
├── api/              # API layer
│   └── axios.ts      # Axios instance (auth interceptor, baseURL)
│
├── assets/           # Static assets (images, fonts)
│
├── components/       # Shared components (app-wide)
│   ├── ui/           # UI primitives (shadcn/ui - buttons, cards, etc.)
│   └── TestPage.tsx  # Dev/test utility page
│
├── config/           # Configuration & constants
│   └── routes.ts     # Route path constants
│
├── features/         # Feature modules (domain-driven)
│   ├── landing/
│   │   ├── components/   # Header, Footer, HeroSection, etc.
│   │   ├── pages/        # LandPage, MainBlog, MainService, etc.
│   │   └── index.ts      # Barrel exports
│   ├── dashboard/
│   │   ├── components/   # DashboardHeader, AlertsPanel, etc.
│   │   ├── pages/        # Dashboard.tsx
│   │   └── index.ts
│   └── admin/
│       ├── components/   # AdminSidebar, Overview, Users, etc.
│       ├── pages/        # AdminPanel.tsx
│       └── index.ts
│
├── hooks/            # Custom React hooks (shared)
│   └── use-mobile.ts
│
├── lib/              # Utilities & helpers
│   └── utils.ts      # cn() - className merger
│
├── types/            # Shared TypeScript types
│   └── index.ts
│
├── App.tsx           # Root app (router)
├── main.tsx          # Entry point
└── index.css         # Global styles
```

## Path Aliases

- `@/*` → `src/*` (e.g. `@/api/axios`, `@/components/ui/card`)

## Import Guidelines

- **API**: `import api from "@/api/axios"`
- **Utils**: `import { cn } from "@/lib/utils"`
- **Hooks**: `import { useIsMobile } from "@/hooks/use-mobile"`
- **UI**: `import { Button } from "@/components/ui/button"`
- **Features**: `import { Dashboard } from "@/features/dashboard"`
