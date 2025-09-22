# 10. Unified Project Structure

The project will use a standard `apps` and `packages` monorepo layout, managed by `npm workspaces`.

```plaintext
flow-dev/
├── apps/
│   ├── web/                # Next.js frontend and user-facing API
│   └── cron/               # Backend data processing functions
├── packages/
│   ├── db/                 # Drizzle ORM schema and database client
│   ├── shared-types/       # Shared TypeScript interfaces
│   └── config/             # Shared configs (ESLint, etc.)
├── package.json            # Root workspaces config
└── README.md
```

