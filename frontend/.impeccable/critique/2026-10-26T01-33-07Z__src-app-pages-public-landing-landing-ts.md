---
target: landing
total_score: 21
max_score: 32
na_heuristics: 7,10
p0_count: 1
p1_count: 2
target_identity: "file:C:\\Desktop\\Office\\Personal\\BRINDA\\frontend\\src\\app\\pages\\public\\landing\\landing.ts"
target_fingerprint: "sha256:c2b11035cf76548b237427b5ed81e6072a524ac1a7adabdf3004ff67a2736def"
target_path: "C:\\Desktop\\Office\\Personal\\BRINDA\\frontend\\src\\app\\pages\\public\\landing\\landing.ts"
timestamp: 2026-10-26T01-33-07Z
slug: src-app-pages-public-landing-landing-ts
---
Method: dual-agent (A: design review · B: detector + headless browser evidence)

## Design Health Score: 21/32 (applicable max; heuristics 7 and 10 n/a for a Persuade landing) → 66%, Acceptable

| # | Heuristic | Score | Key issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Disabled cart/WhatsApp say nothing visible to sighted users |
| 2 | Match System / Real World | 3 | Plain Spanish, Yape/Plin named up front |
| 3 | User Control and Freedom | 3 | Menu closes (X, Escape), scroll cue works |
| 4 | Consistency and Standards | 3 | Tokens consistent; CTA styles differ (ghost vs disabled burgundy) |
| 5 | Error Prevention | 2 | "Pedir ahora" leads to a provisional /catalogo; WhatsApp CTA disabled |
| 6 | Recognition Rather Than Recall | 3 | Categories and steps visible |
| 7 | Flexibility and Efficiency | n/a | Persuade landing |
| 8 | Aesthetic and Minimalist Design | 3 | Calm; four sections repeat the same job |
| 9 | Error Recovery | 2 | Empty states are "Por confirmar" with no way forward |
| 10 | Help and Documentation | n/a | Persuade landing |

## Design Specificity Verdict
Authored but only partly specific. Palette, Baskerville/Limelight pairing, candle-and-bokeh hero and "Tu brindis, a domicilio" give a speakeasy night-in mood that fits delivery liquor. Hero, intro, categories rail, promo cards and steps would survive a rename to any "boutique X a domicilio". Nothing says Lima. The bottle silhouette repeats ~10 times. The coupe in the intro is the most memorable object but sits in a section with no product.
Deterministic scan: detect --json returned [] (exit 0) on src, landing, layouts, shared, styles, index.html. Headless overlay injection ran at 1440 and 360: "[impeccable] No anti-patterns found." No user-visible overlay (headless, no [Human] tab).

## Priority issues
- [P0] No dominant "order now" CTA and a dead end: all "Pedir ahora" are ghost outlines (brief-pinned for the hero), the only burgundy CTA is disabled, no sticky mobile CTA, /catalogo is provisional. Fix: solid burgundy CTA after the steps and a sticky mobile "Pedir" bar; until WhatsApp exists, link to a real channel. Command: bolder / layout.
- [P1] The page never shows product, price or trust signals (no product, "desde S/", delivery time, minimum). Fix: 3-4 real products with prices once Lucia supplies them; until then one honest "catalogo en camino" block instead of three fake promo cards. Command: shape / clarify.
- [P1] Ending on "Por confirmar" x3 + disabled WhatsApp + "Espacio reservado": internal TODOs exposed publicly. Fix: collapse to one calm block with a real channel; legal block as an intentional 18+ / venta responsable notice once the adviser provides text. Command: harden / distill.
- [P2] Redundancy and weak rhythm: announcement bar, hero and intro repeat the same message; 5515px at 360 with large empty bands; centered H2 + centered content repeated. Command: distill / layout.
- [P2] Categories rail and promo cards are low-information: only the first tile fully visible at 360 with no overflow hint; identical bottle tiles; identical "Ver en el catalogo" links (37px tall). Command: adapt / delight.
- [P3] Contrast: nothing fails on visible text. Disabled WhatsApp button 3.04:1 (inactive control, exempt if truly disabled). Small brass text should stay large. A's remark about stone text does not apply: stone is only a tile tint.

## Browser measurements (B): overflow 0 at 360/768/1440; 0 console errors; 2 imgs all with alt attribute; heading outline h1>h2>h3 clean; 44 requests / ~2.6 MB on the dev server (production build ~65 KB JS transferred); targets under 44px: skip link, nav brand, "Ver en el catalogo" (37px), desktop nav links (36px, mouse-driven).

## Persona red flags
- Jordan: no bottle, price or area on the first screen; "Pedir ahora" goes to a provisional catalogue; delivery area "Por confirmar"; disabled WhatsApp reads as broken.
- Riley: disabled cart gives no visible feedback (tooltip invisible on touch); disabled WhatsApp button inert.
- Casey: ~7 thumb scrolls; hero CTA mid-screen and ghost-weight; categories swipe is easy to miss; announcement bar wraps to 2 lines at ~12px uppercase; "Ver en el catalogo" tap area ~37px.

## Minor observations
Wordmark appears in nav and hero at 1440 (nav brand fades in on scroll). 1440 steps left-aligned inside a centered layout. "Ejemplos ilustrativos" note is ~12px, the only cue that promo cards are placeholders. Footer legal links small for a legally important element in Peru. Limelight used once ("promociones"), not yet a system.

## Questions
What does a Lima customer at 11 pm on a Friday need on the first screen: mood or "open now, 30-45 min, minimum S/"? Is a landing with no catalogue, number or hours worth shipping, or one screen with one working WhatsApp link until the data exists? What could only belong to BRINDA, and what gets cut if the answer is "nothing"?
