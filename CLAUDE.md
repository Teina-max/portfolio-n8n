# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Portfolio website for Teina Teinauri showcasing n8n automation and Supabase expertise. The site simulates navigating through an n8n workflow with scroll-driven 3D effects.

**Stack**: Vanilla HTML/CSS/JavaScript (no build tools)
- Three.js for 3D webhook node and floating skills
- GSAP ScrollTrigger for scroll animations
- Hosted on Vercel

## Development Commands

```bash
# Local development (choose one)
python -m http.server 8080
npx serve .

# Then open http://localhost:8080
```

No build step required - the site uses CDN-loaded libraries.

## Architecture

### JavaScript Modules (non-ES6, uses global window exports)

- **`js/main.js`** - App initialization, i18n system, project loading, modal handling, contact form
  - Exports nothing (entry point)
  - Depends on: `window.N8NScene`, `window.ScrollAnimations`
  - Loads projects from `data/projects.json`

- **`js/three-scene.js`** - Three.js 3D scene with webhook node and floating skill icons
  - Exports: `window.N8NScene` class
  - Key method: `updateScroll(progress)` - called by ScrollAnimations to drive zoom effect
  - Disabled on mobile (`window.innerWidth < 768`) and when `prefers-reduced-motion` is set

- **`js/scroll-animations.js`** - GSAP ScrollTrigger animations for all sections
  - Exports: `window.ScrollAnimations` class
  - Takes `N8NScene` instance in constructor to coordinate 3D zoom with scroll
  - Mobile fallback: CSS-based zoom animation when Three.js is disabled

### Script Load Order (critical)
```html
<script src="js/three-scene.js"></script>     <!-- First: defines N8NScene -->
<script src="js/scroll-animations.js"></script> <!-- Second: defines ScrollAnimations -->
<script src="js/main.js"></script>            <!-- Last: uses both -->
```

### Key Data Flow

1. **Scroll Progress** → `ScrollAnimations.setupZoomRevelateur()` → `N8NScene.updateScroll(progress)`
2. **Projects** → `fetch('data/projects.json')` → `renderProjectNodes()` → `drawConnections()`
3. **i18n** → `translations` object in main.js → `data-i18n` attributes in HTML → `setLanguage()` updates all

### CSS Architecture

- **`css/variables.css`** - n8n brand colors, semantic tokens, node type colors
- **`css/main.css`** - All component styles, responsive breakpoints

Key CSS variables:
```css
--n8n-color-primary: #FF6D5A;     /* Orange/coral - main accent */
--n8n-node-trigger: #FF6D5A;       /* Webhook, Schedule triggers */
--n8n-node-ai: #9B59B6;            /* OpenAI, Claude nodes */
--n8n-node-data: #3498DB;          /* Supabase, DB nodes */
--n8n-node-communication: #1ABC9C; /* Email, Telegram nodes */
```

## Contact Form Integration

The contact form posts to an n8n webhook. The URL is hardcoded in `main.js`:
```javascript
const N8N_WEBHOOK_URL = 'https://n8n.n8n-teina.shop/webhook/portfolio-contact';
```

The n8n workflow template is in `n8n-workflow-contact.json`.

## Project Data Structure

Projects in `data/projects.json` use this structure:
```javascript
{
  "id": "project-id",
  "title": { "fr": "...", "en": "..." },       // Bilingual titles
  "description": { "fr": "...", "en": "..." }, // Bilingual descriptions
  "category": "workflows-n8n",                  // Filter category
  "featured": true,                             // Show in canvas
  "nodeConfig": {
    "type": "trigger",                          // Node color type
    "iconUrl": "https://...",                   // Cloudinary SVG
    "position": { "x": 150, "y": 180 }          // Canvas position
  },
  "metrics": [...],
  "tech": ["n8n", "Supabase", ...],
  "image": "https://...",                       // Single image OR
  "gallery": [{ "title": "...", "url": "..." }] // Gallery array
}
```

## Mobile Considerations

- Three.js 3D scene disabled on `window.innerWidth < 768`
- Mobile uses `.mobile-skills-overlay` with CSS animations instead
- All GSAP animations respect `prefers-reduced-motion`
- Project nodes are draggable on both desktop and mobile (touch events)
