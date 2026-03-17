# Windy Spot

Windsurf spot finder and forecast guide built with Next.js 15, React 19, TypeScript, and Supabase.

## Tech Stack

- **Framework**: Next.js 15 (App Router, Turbopack)
- **UI**: React 19, Bootstrap 5, SCSS
- **Auth**: Clerk
- **Database**: Supabase (PostgreSQL)
- **Search**: Fuse.js (client-side fuzzy search)
- **Maps**: MapKit JS
- **Deployment**: Vercel

## Project Structure

- `src/app/` — App Router pages and layouts
- `src/app/api/` — API routes (spots, webcam-proxy)
- `src/app/components/` — Shared React components
- `src/app/lib/` — Data fetching and Supabase clients
- `src/app/style/scss/` — Global SCSS styles
- `src/app/spots/` - This is the directory with the custom spot guides, everytime I ask to add a new custom spot guide, it should be added to this folder
- `src/app/unused-pages/` - This is a directory where I move all the pages from the template that I am not activily using. Do not read or update anything from this directory unless I explicitely tell you to look for a template to create something new.

## Commands

- `npm run dev` — Start dev server with Turbopack
- `npm run build` — Production build
- `npm run lint` — Run ESLint

## Conventions

- Use Next.js `Image` component for all images, never raw `<img>` tags
- Use Next.js `Link` component for all internal navigation
- Pages that fetch data should be server components; interactive UI should be client components
- All images are hosted on Supabase Storage (`orwtlksbpmgpijcdtngr.supabase.co`)
- Use Bootstrap utility classes for layout and spacing (e.g., `d-flex`, `py-5`, `col-xl-8`)
- Keep components in `src/app/components/`, grouped by feature (navbar/, footer/)

## SEO

- Every public page must export a `metadata` object with title, description, openGraph, twitter, and canonical
- Private pages (/login, /register, /profile) must have `robots: { index: false, follow: false }`
- Use JSON-LD structured data where applicable (WebSite, Organization, TouristAttraction)
- Every page must have a single, descriptive H1 tag

## Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anonymous key
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` — Clerk publishable key
- `CLERK_SECRET_KEY` — Clerk secret key
- `NEXT_PUBLIC_MAPKIT_TOKEN` — MapKit JS token
