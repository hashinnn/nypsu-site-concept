# NYPSU — Students' Union Website Concept

A six-page website concept for the Nanyang Polytechnic Students' Union, built with hand-written HTML, CSS and JavaScript. Created for a Y1S1 UX Design module at Nanyang Polytechnic.

The site presents the Union's activities, committee, events and enquiry channels, and takes its visual direction from NYPSU's own campus mural art and social media presence rather than a conventional institutional template.

## Contents

- [Overview](#overview)
- [Features](#features)
- [Design](#design)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Project structure](#project-structure)
- [Accessibility](#accessibility)
- [Performance](#performance)
- [Browser support](#browser-support)
- [Disclaimer](#disclaimer)

## Overview

| | |
|---|---|
| Pages | 6 — Home, About, Events, FAQ, Join Us, Ask a Question |
| Stack | HTML5, CSS3, JavaScript (ES6+), Bootstrap 5.3, Font Awesome 6 |
| Build step | None |
| Source | ~1,900 lines HTML, ~4,900 CSS, ~1,300 JS |
| Repository size | 18.6 MB |

<!--
  Screenshots: add images to a docs/ folder and reference them here, e.g.
  ![Homepage](docs/homepage.png)

  Live demo: this is a static site and can be hosted free on GitHub Pages via
  Settings > Pages > Deploy from a branch > main / (root). Rename homepage.html
  to index.html and update the navigation links before enabling.
-->

## Features

### Instagram feed integration

The Events page embeds six live NYPSU Instagram posts directly in the page using Instagram's official `embed.js`, presented in a Bootstrap carousel. Each embed is paired with a written caption panel covering the event it documents — GradNite 2025, Student Life Carnival, Leaders' Summit, EDSK 2025, Imperium Gemma and NYP's Got Talent 2024 — so the section remains readable before the embeds finish loading.

### Interactive meeting calendar

The About page renders a full month calendar in JavaScript with no library. It calculates the first Friday of any given month, highlights it as the Union's standing meeting date, marks the current day, and supports stepping forward and backward through months indefinitely.

### Filterable FAQ

Fifteen questions across three categories (Membership, Events, Suggestions), filtered through a tabbed interface. Answers expand as an accordion with one item open at a time, and the whole component is operable by keyboard, including arrow-key navigation between category tabs and Escape to close.

### Carousels

Four independent carousels, each built for a different purpose:

- **Activities** (About) — infinite loop with cloned edge slides, touch-swipe, auto-advance and pause-on-hover
- **Committee** (About) — nine executive committee profiles
- **Instagram** (Events) — six embedded posts
- **Testimonials** (Events) — six student quotes across two slides, with swipe support

### Forms with live validation

The Join Us and Ask a Question pages provide multi-field forms with inline validation feedback, digit-masked phone entry, submit and loading states, and a reset control. The Join Us form generates its available interview slots from the current date and derives both the date-picker bounds and the on-screen helper text from that same source, so the offered dates stay current.

### Animated statistics

Membership and impact figures count up when scrolled into view, on both the About and Events pages.

### Video hero

The homepage includes a self-hosted introduction video with custom play and mute controls, which falls back to a still image on small screens.

### Scroll-triggered animations

Content across the site reveals progressively as it enters the viewport using `IntersectionObserver`, including staggered card reveals, row-by-row table reveals and section fades.

### Additional elements

A scrolling headline ticker on the homepage, an animated wave footer with links to all five NYPSU social channels, a fixed navigation bar with a mobile off-canvas menu, and a floating action button on the Events page.

## Design

The concept takes NYPSU's existing visual identity — the painted murals on campus and the photography on their social channels — as its starting point.

- **Imagery.** Each page leads with a different piece of campus mural art as a full-bleed hero, overlaid with a navy scrim so headline text remains legible against a high-contrast background.
- **Palette.** Deep navy `#051329` as the base, `darkred` for primary actions, `linen` `#FAF0E6` for text and surfaces, with goldenrod accents.
- **Typography.** Poppins across the site in weights 200–900, with Space Grotesk used for FAQ headings.
- **Motion.** Deliberately restrained given the busy backgrounds: slow fades, staggered reveals and a single scrolling ticker.

## Tech stack

| Purpose | Technology |
|---|---|
| Markup | HTML5 |
| Styling | CSS3 — Flexbox, Grid, media queries, keyframe animations |
| Behaviour | JavaScript (ES6+), no framework |
| Layout & components | Bootstrap 5.3 (CDN) |
| Icons | Font Awesome 6.5 (CDN) |
| Fonts | Poppins, Space Grotesk (Google Fonts) |
| Embeds | Instagram `embed.js` |

No package manager, bundler or build step is required.

## Getting started

Clone the repository and serve the folder over HTTP:

```bash
git clone https://github.com/hashinnn/nypsu-site-concept.git
cd nypsu-site-concept
python -m http.server 8000
```

Then open <http://localhost:8000/homepage.html>.

A local server is required rather than opening the files directly — the Instagram embeds and video will not load over the `file://` protocol.

## Project structure

```
nypsu-site-concept/
├── homepage.html          Landing page
├── about.html             Mission, committee, meeting calendar, activities
├── events.html            Events, Instagram feed, testimonials
├── enquiry.html           FAQ
├── join.html              Membership application form
├── qns.html               Enquiry submission form
├── css/                   One stylesheet per page
├── js/                    One script per page
├── images/                Mural art, committee portraits, event photography
└── videos/                Homepage hero reel, campus clip
```

Styles and scripts are scoped per page so that each page loads only the rules and behaviour it uses.

## Accessibility

- Semantic HTML with landmark elements and a logical heading hierarchy
- Interactive controls implemented as real `<button>` elements rather than styled containers
- ARIA state kept in sync with the interface: `aria-expanded` on accordions, `aria-selected` and roving `tabindex` on the FAQ tablist, `aria-busy` on form submission, `aria-current` on active navigation
- Keyboard support for all custom controls, including arrow-key tab navigation and Escape to close
- Descriptive alt text on all 31 images, and accessible names on all icon-only controls
- Text contrast maintained over photographic backgrounds via overlay scrims

## Performance

- Hero video encoded at 1080p30 H.264 with the `moov` atom relocated to the head of the file, so playback can begin while the file is still downloading
- Photographic assets served as progressive JPEG and sized to their display dimensions
- Native lazy loading (`loading="lazy"`) on below-the-fold imagery
- Per-page CSS and JS, so no page downloads rules it does not use
- `IntersectionObserver` used for scroll effects in place of scroll-event listeners
- Total repository size 18.6 MB, with the largest single asset at 7.8 MB

## Browser support

Targets current versions of Chrome, Firefox, Safari and Edge. Uses `IntersectionObserver`, CSS Grid, Flexbox and `aspect-ratio`. Scroll animations degrade gracefully to visible content where `IntersectionObserver` is unavailable.

## Disclaimer

This is an unofficial student concept project created for an academic module. It is not affiliated with, endorsed by, or an official product of Nanyang Polytechnic or the Nanyang Polytechnic Students' Union.

NYPSU branding, photography, Instagram content and committee details remain the property of the Nanyang Polytechnic Students' Union and appear here solely for a non-commercial academic exercise. Contact details shown on the site are illustrative, and the forms are front-end demonstrations that do not submit data anywhere.
