Next.js is a React framework for production with server-side rendering, static generation, and more.

Pages in the Pages Router are defined by files in the pages/ directory. Each file becomes a route.

The App Router (Next.js 13+) uses the app/ directory with file conventions: page.tsx, layout.tsx, loading.tsx, error.tsx.

Server-Side Rendering (SSR): getServerSideProps runs on every request, returning props to the page.

Static Site Generation (SSG): getStaticProps runs at build time, generating static HTML.

Incremental Static Regeneration (ISR): revalidate option regenerates pages after a specified interval.

generateStaticParams (App Router) or getStaticPaths (Pages Router) define dynamic routes for SSG.

File-based routing: pages/about.tsx → /about. Dynamic routes: pages/post/[id].tsx → /post/123.

API Routes: files in pages/api/ or app/api/ create serverless API endpoints.

Middleware runs before a request is completed: middleware.ts in the root. Uses NextResponse.

next/image provides automatic image optimization with lazy loading, resizing, and format conversion.

next/link enables client-side navigation with prefetching: <Link href="/about">About</Link>.

Layout components in App Router wrap page content: export default function RootLayout({ children }).

Server Components (default in App Router) render on the server; 'use client' opts into Client Components.

Data fetching in Server Components uses native fetch with caching: fetch(url, { next: { revalidate: 60 } }).

next/head manages document head metadata (Pages Router). App Router uses generateMetadata().

Environment variables: NEXT_PUBLIC_ prefix exposes variables to the client.

Static export: next export generates a fully static site (no server required).

Built-in CSS support: CSS Modules (.module.css), global CSS, and CSS-in-JS.

next.config.js configures the framework: redirects, rewrites, headers, images, and more.
