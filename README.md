# NYPSU — Students' Union Website Concept

A six-page website concept for the **Nanyang Polytechnic Students' Union**, built to answer one design question:

> NYPSU's Instagram is loud, painted, and full of personality. Their web presence isn't. What would the site look like if it actually felt like the Union that students follow?

Built with **hand-written HTML, CSS and JavaScript** — no build step, no framework, no dependencies to install. Bootstrap and Font Awesome are pulled from a CDN for the grid and icons; every layout, animation, carousel and interaction in here is written from scratch.

**Y1S1 UX Design module project · Nanyang Polytechnic**

---

<!--
  ADD BEFORE SHARING WITH RECRUITERS — these two things do more than anything else below:

  1. A live link. This is a static site, so GitHub Pages hosts it free:
     Settings → Pages → Source: "Deploy from a branch" → main / (root) → Save.
     Then rename homepage.html to index.html and update the nav links to match,
     and put the URL here.

  2. Two or three screenshots. Drop them in a docs/ folder and swap in:
     ![Homepage](docs/homepage.png)
     The homepage hero, the Instagram carousel, and the FAQ page show best.
-->

| | |
|---|---|
| **Pages** | 6 — Home, About, Events, FAQ, Join, Ask a Question |
| **Stack** | HTML5 · CSS3 · Vanilla JS (ES6+) · Bootstrap 5.3 · Font Awesome 6 |
| **Build step** | None. Open a file, or serve the folder. |
| **Total page weight** | 18.6 MB repo, hero video 7.8 MB |
| **Written** | ~1,900 lines HTML · ~4,900 CSS · ~1,300 JS |

---

## The design idea: taking the graffiti off the wall

NYPSU has a real visual identity — the murals around campus, the painted lettering, the high-energy photography that fills their [Instagram](https://www.instagram.com/nypsu). Most institutional student-union sites throw that away and default to corporate blue.

This concept does the opposite: **the campus graffiti is the interface.**

- **Every hero is a real painted surface.** The homepage opens on the "STUDENT UNION / LEADERSHIP" mural rather than a stock photo, with a navy scrim (`rgba(5,19,41,0.4)`) laid over it so headline text clears WCAG contrast against a chaotic background. Each page gets its own mural — About, Events, FAQ and Join all carry a different wall.
- **The palette is pulled from the paint, not from a brand book.** Deep navy `#051329` as ground, `darkred` as the action colour, `linen` `#FAF0E6` as the ink. It reads as the Union's red-and-navy identity while staying legible over photography.
- **Type does the heavy lifting.** Poppins in heavy weights (700–900) for headline work, so the typography can hold its own next to the artwork instead of being drowned by it. Space Grotesk picks up the FAQ headings for a slightly more technical voice.
- **Motion is restrained on purpose.** With backgrounds this busy, everything else stays quiet: slow fades, a single scrolling ticker, staggered reveals. The art moves; the UI doesn't.

## The Instagram integration

Rather than a dead "Follow us" icon in the footer, **the Events page embeds six real NYPSU posts directly in the page** using Instagram's official `embed.js`, inside a Bootstrap carousel.

Each embed is paired with a **hand-written caption panel** beside it — GradNite 2025, Student Life Carnival, Leaders' Summit in Bintan, EDSK 2025, Imperium Gemma, NYP's Got Talent 2024 — so the section still communicates even before the embeds hydrate, and still reads as a designed page rather than a wall of pasted widgets.

The point: the site doesn't just *link* to where the Union's personality lives. It pulls it in.

## What's in each page

**Home** — Mural hero · scroll-cue arrow · an infinite marquee ticker that measures itself and clones its own content until it fills the viewport · a self-hosted video section with custom play/mute controls that degrades to a poster image on mobile · staggered-reveal contact cards.

**About** — Animated statistics that count up when scrolled into view · a **month-steppable meeting calendar rendered entirely in JS**, which computes the first Friday of any month you navigate to and highlights it · an infinite-loop activities carousel with cloned edge slides, touch-swipe and hover-pause · a nine-member EXCO carousel.

**Events** — Upcoming event cards · a past-events table that reveals row by row · **the six-post Instagram carousel** · impact counters (one of which resolves to `∞` rather than a number) · a two-slide testimonial carousel with swipe support · a floating action button.

**FAQ** — 15 questions across three categories, filtered by a **real ARIA tablist** with roving arrow-key focus. Accordions are proper `<button>`s inside headings with live `aria-expanded`, so the whole thing is keyboard- and screen-reader-operable.

**Join / Ask a Question** — Multi-field forms with live inline validation, digit-masked phone input, loading and busy states. The Join form **generates its interview slots from the current date** (next Mon/Wed/Fri, a week out) and renders both the date picker bounds and the helper text from that same list — so the available dates can never drift out of sync or go stale.

## Engineering notes

Things I'd want to talk through in an interview:

**Performance.** The project started at 307 MB — a 246 MB hero video at a 31.8 Mbps bitrate and a 21 MB, 35-megapixel PNG used as a CSS background. It now ships at **18.6 MB**. The video was re-encoded to 1080p30 H.264 with the `moov` atom moved to the front so it streams progressively instead of buffering whole; the hero art was downscaled and moved from opaque RGBA PNG to progressive JPEG. Same visual result, 94% smaller.

**Accessibility.** Not retrofitted as an afterthought — 32 `aria-label`s, live `aria-expanded` / `aria-selected` / `aria-busy` state, roving tabindex on the FAQ tablist, keyboard handlers on every non-native control, and alt text on all 31 images. Interactive elements are real `<button>`s rather than styled `<div>`s, which is the difference between an accordion that works with a keyboard and one that only works with a mouse.

**Reveal animations and the off-screen trap.** Scroll-reveal via `IntersectionObserver` has a failure mode that's easy to miss: elements parked outside a horizontal carousel never intersect the viewport, so anything starting at `opacity: 0` stays invisible forever. Slides 2+ of the testimonial and activities carousels hit exactly this. Fixed by observing the *section* and revealing its children together, rather than observing each card.

**Responsive carousels measure themselves.** Card margins change at the 900px and 576px breakpoints, so a hard-coded stride drifts a little further out of alignment with every slide. Both carousels now read their real stride from `getComputedStyle` and re-measure on resize.

**Defensive by default.** Every script guards its DOM lookups, so one missing element on one page can't take down the rest of the file. The marquee's content-doubling loop is bounded, because `offsetWidth` returns `0` before layout settles and an unbounded `while` would hang the tab.

## Running it

No install, no build:

```bash
git clone https://github.com/hashinnn/nypsu-site-concept.git
cd nypsu-site-concept
python -m http.server 8000
```

Then open <http://localhost:8000/homepage.html>.

Use a server rather than opening the file directly — the Instagram embeds and the video won't load over `file://`.

## Structure

```
├── homepage.html      about.html      events.html
├── enquiry.html       join.html       qns.html
├── css/               one stylesheet per page
├── js/                one script per page
├── images/            murals, EXCO portraits, event photography
└── videos/            hero reel + campus clip
```

One stylesheet and one script per page, deliberately. At six pages with no build step, a shared bundle would mean every page downloading rules for five pages it never renders — and page-scoped files kept the CSS readable while I was still moving fast on the design.

## Credits & disclaimer

This is an **unofficial student concept project**, created for a Y1S1 UX Design module. It is **not affiliated with, endorsed by, or an official product of** Nanyang Polytechnic or the NYP Students' Union.

NYPSU branding, photography, Instagram content and committee member details belong to the Nanyang Polytechnic Students' Union and are used here for a non-commercial academic exercise only. Contact details shown on the site are illustrative — the forms are front-end demonstrations and do not submit anywhere.
