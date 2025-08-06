# Personal Website - AI Coding Agent Instructions

## Project Architecture

This is a **static single-page personal website** hosted on GitHub Pages at `densumesh.dev`. The entire site is contained in `index.html` with no build process or external dependencies beyond CDN resources.

## CSS Framework & Styling Conventions

- **WebTUI Framework**: Uses `@webtui/css` with Nord theme (`@webtui/theme-nord`)
- **CSS Layers**: Always declare layers first: `@layer base, utils, components;`
- **Box Attributes**: Use WebTUI's box system: `box-="soft shadow padding-lg"` and `variant-="surface1"`
- **Character Units**: Use `ch` units for spacing and widths (e.g., `2ch` margins, `120ch` max-width)
- **Monospace Typography**: Font family is explicitly set to `monospace` throughout

## Content Structure & Patterns

- **Semantic Sections**: Each major area (hero, about, resume, projects, blog) is a `<section>` with descriptive IDs
- **Two-Column Layout**: Resume section uses CSS Grid: `grid-template-columns: 1fr 1fr; gap: 2ch`
- **Special Characters**: Use Unicode characters like `‑` (non-breaking hyphens) and `•` for design consistency
- **External Links**: Project and blog links use `↗` character to indicate external navigation

## Meta & SEO Configuration

- **Open Graph**: Complete OG tags for social sharing with `og-image.png`
- **Twitter Cards**: Uses `summary_large_image` format
- **Analytics**: Google Analytics configured with ID `G-40Q5MFLQZH`
- **Theme**: Nord color scheme with theme-color `#2E3440`

## Deployment & Domain

- **GitHub Pages**: Auto-deploys via `CNAME` file pointing to `densumesh.dev`
- **Static Assets**: Favicon and OG image are root-level PNG files
- **No Build Process**: Direct HTML deployment, no bundling or compilation

## Content Update Patterns

When updating content:

- Maintain character unit (`ch`) spacing consistency
- Use WebTUI box attributes for new sections
- Keep external links in projects/blog sections with arrow indicators
- Preserve non-breaking hyphen usage in technical terms
- Update meta descriptions if adding major new sections

## Key Files

- `index.html` - Entire website (single source of truth)
- `CNAME` - Domain configuration for GitHub Pages
- `favicon.png` / `og-image.png` - Static assets for branding
