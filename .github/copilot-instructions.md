# Personal Website - AI Coding Agent Instructions

## Project Architecture

This is an **Astro-based personal website** hosted on GitHub Pages at `densumesh.dev`. Built with Astro v5, React, and Tailwind CSS, it features a static home page and content-managed blog system.

**Key Stack:**

- **Astro 5**: Static site generator with React integration for interactive components
- **Tailwind CSS v4**: Utility-first styling with custom prose classes
- **MDX**: Content authoring with Astro content collections
- **GitHub Pages**: Static deployment with build process

## Development Workflow

**Commands:**

- `npm run dev` - Local development server at `localhost:4321`
- `npm run build` - Production build to `./dist/`
- `npm run preview` - Preview production build locally

**File-based Routing:**

- `src/pages/index.astro` - Homepage
- `src/pages/blog/index.astro` - Blog listing page
- `src/pages/blog/[slug].astro` - Dynamic blog post pages
- `src/content/blog/*.mdx` - Blog content with frontmatter

## Styling Conventions

**Dark Theme Consistency:**

- Background: `bg-zinc-900`, Text: `text-zinc-100`
- Borders: `border-zinc-700`, Links: `text-blue-400 hover:underline`
- Card Pattern: `p-2 border border-zinc-700 rounded` (homepage) or `p-4` (blog)

**Typography:**

- Monospace: `font-mono` applied globally via Layout.astro
- Responsive grid: `grid-cols-1 md:grid-cols-2 gap-2` for resume section
- Special characters: Use `‑` (non-breaking hyphens) in technical terms

## Content Management

**Blog Posts:**

- Located in `src/content/blog/` as `.mdx` files
- Frontmatter schema: `title`, `description`, `pubDate`, `updatedDate`, `heroImage`, `tags`
- Auto-sorted by `pubDate` in descending order
- Custom `.prose` styling in `global.css` for blog content

**Homepage Structure:**

- Semantic sections: Hero, About, Résumé, Projects (each as `<section>`)
- Two-column responsive layout for experience/education
- External links use `↗` character indicator

## Meta & SEO Configuration

**Shared Layout (Layout.astro):**

- Open Graph tags with `og-image.png`
- Twitter Cards with `summary_large_image`
- Google Analytics: `G-40Q5MFLQZH`
- Theme color: `#2E3440` (Nord-inspired)

## Key Files & Patterns

- `src/layouts/Layout.astro` - Shared layout with SEO, navigation, and styling
- `src/content/config.ts` - Content collection schema definitions
- `src/styles/global.css` - Tailwind import + custom `.prose` classes
- `astro.config.mjs` - Site URL, integrations (MDX, React), static output
- `public/` - Static assets (favicon.png, og-image.png, CNAME)
