# Zmol - URL Shortener

A modern, fast URL shortener built with Next.js 15, featuring server actions, global statistics, and a beautiful UI.

## Features

- 🔗 **URL Shortening**: Transform long URLs into short, memorable links
- 📊 **Global Stats**: View total clicks and URL statistics
- 🎨 **Modern Design**: Beautiful UI with glassmorphism effects
- 📱 **Responsive Design**: Beautiful UI that works on all devices
- ⚡ **Fast Performance**: Built with Next.js 15 and server actions
- 🌙 **Dark Mode**: Automatic dark/light mode support
- 🗄️ **PostgreSQL**: Reliable database with Drizzle ORM

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with shadcn/ui components
- **Database**: PostgreSQL with Drizzle ORM
- **Validation**: Zod schemas
- **Icons**: Lucide React
- **Package Manager**: Bun

## Quick Start

1. **Clone and install dependencies**:

   ```bash
   git clone <your-repo>
   cd zmol
   bun install
   ```

2. **Set up environment variables**:

   ```bash
   cp .env.example .env.local
   ```

   Update `.env.local` with your database URL:

   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/zmol"
   NEXT_PUBLIC_BASE_URL="http://localhost:3000"
   ```

3. **Set up the database**:

   ```bash
   # Generate migration files
   bun run db:generate
   
   # Run migrations
   bun run db:migrate
   
   # Or push schema directly (for development)
   bun run db:push
   ```

4. **Start the development server**:

   ```bash
   bun run dev
   ```

5. **Open your browser** and visit [http://localhost:3000](http://localhost:3000)

## Database Schema

The application uses two main tables:

- **urls**: Stores URL mappings, metadata, and click counts
- **url_clicks**: Tracks individual click events with analytics data

## API Routes

All functionality is handled via Next.js server actions - no API routes needed!

- `createShortUrl()`: Create a new short URL
- `redirectToUrl()`: Handle URL redirects and click tracking

## Project Structure

```
zmol/
├── app/                    # Next.js app directory
│   ├── [shortCode]/       # Dynamic route for URL redirection
│   ├── expired/           # Expired URL page
│   └── not-found.tsx      # 404 page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── ...               # Feature components
├── lib/                  # Utilities and database
│   ├── db/               # Database schema and connection
│   ├── actions.ts        # Server actions
│   └── url-utils.ts      # URL utilities
└── drizzle/              # Database migrations
```

## Development Commands

```bash
# Development
bun run dev                # Start dev server
bun run build             # Build for production
bun run start             # Start production server

# Database
bun run db:generate       # Generate migrations
bun run db:migrate        # Run migrations
bun run db:push           # Push schema to database
bun run db:studio         # Open Drizzle Studio

# Code Quality
bun run lint              # Run ESLint
```

## Environment Variables

```env
# Required
DATABASE_URL="postgresql://user:password@localhost:5432/zmol"

# Optional
NEXT_PUBLIC_BASE_URL="http://localhost:3000"  # Your domain in production
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy!

### Database Setup

For production, you can use:

- **Vercel Postgres** (easiest for Vercel deployments)
- **Railway**
- **PlanetScale**
- **Supabase**
- Any PostgreSQL provider

## Features in Detail

### URL Shortening

- Automatic short code generation using nanoid
- Duplicate URL detection  
- URL validation and formatting

### Statistics

- Click tracking with timestamps
- User agent and referrer information
- Global statistics dashboard
- Recent URLs overview

### UI/UX

- Modern, gradient-based design with glassmorphism effects
- Responsive layout for all devices
- Loading states and error handling
- Copy-to-clipboard functionality
- Dark mode support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) for details.
