# flow.dev

Professional engineering tools for developers

## 🚀 Tech Stack

- **Frontend**: Next.js 14.2.3, React 18, HeroUI (NextUI v2), Tailwind CSS v4
- **Database**: Supabase (PostgreSQL), Drizzle ORM
- **Testing**: Jest (unit), Playwright (E2E)
- **Styling**: Tailwind CSS v4, Framer Motion
- **Architecture**: Monorepo with npm workspaces

## 📁 Project Structure

```
flow.dev/
├── apps/
│   └── web/              # Next.js application
├── packages/
│   └── db/               # Database schema and Drizzle ORM setup
├── tests/                # E2E tests
└── docs/                 # Documentation
```

## 🛠️ Setup

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd flow.dev
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Run development server**
```bash
npm run dev
```

The application will be available at http://localhost:3000

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run E2E tests with Playwright
- `npm run lint` - Run linter
- `npm run format` - Format code with Prettier

## 🧪 Testing

### Unit Tests (Jest)
```bash
npm run test
```

### E2E Tests (Playwright)
```bash
npm run test:e2e
```

### Interactive E2E Testing
```bash
npm run test:e2e:ui
```

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy

The project is pre-configured with `vercel.json` for optimal deployment.

### Environment Variables

Required environment variables for production:

- `DATABASE_URL` - PostgreSQL connection string
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `NEXT_PUBLIC_APP_URL` - Your application URL

## 📚 Documentation

- [Product Requirements](./docs/prd.md)
- [Architecture](./docs/architecture.md)
- [User Stories](./docs/stories/)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests
4. Submit a pull request

## 📄 License

[Your License]