---
target: landing
total_score: 21
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 2
target_identity: "file:C:\\Desktop\\Office\\Personal\\BRINDA\\frontend\\src\\app\\pages\\public\\landing\\landing.ts"
target_fingerprint: "sha256:a1f2480bbeef7af174e79c2d14e4a608c3625e4d0de642760132a8e66bd841fa"
target_path: "C:\\Desktop\\Office\\Personal\\BRINDA\\frontend\\src\\app\\pages\\public\\landing\\landing.ts"
timestamp: 2026-10-26T01-47-10Z
slug: src-app-pages-public-landing-landing-ts
---
Method: dual-agent (A: design review, production view · B: detector + headless browser evidence on the production build). Round 2, after P0/P1/P2 fixes.

## Design Health Score: 21/32 (66%, Acceptable). Heuristics 7 and 10 n/a (Persuade landing). Same total as round 1.

| # | Heuristic | Score | Key issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Cart icon inert, no state; CTAs lead to a provisional /catalogo |
| 2 | Match System / Real World | 3 | Plain Peruvian Spanish; Yape/Plin/WhatsApp named |
| 3 | User Control and Freedom | 3 | Simple page; inert links give no feedback |
| 4 | Consistency and Standards | 3 | Ghost hero CTA (brief) + solid CTA in bar and after steps |
| 5 | Error Prevention | 2 | Legal links and cart look live but are dead |
| 6 | Recognition Rather Than Recall | 3 | Clear 3-step path |
| 7 | Flexibility and Efficiency | n/a | Persuade landing |
| 8 | Aesthetic and Minimalist Design | 3 | Restrained but thin: three sections carry little information |
| 9 | Error Recovery | 2 | Tapping "Pedir ahora" lands on a provisional page |
| 10 | Help and Documentation | n/a | Persuade landing |

## Specificity: authored hero, interchangeable lower page. Detector: [] on all targets (exit 0); headless overlay: "No anti-patterns found" at 1440 and 360 (no user-visible overlay).

## Priority issues
- [P1] Promo band copy cites an example promo ("lleva 3, paga 2") although example promos were ruled out until real data exists. Fix: generic copy. Command: clarify.
- [P1] Too much of the page says "coming soon" (promo band, zones sentence, tiles): ~40% of the 360 scroll. Fix: collapse the promo band to a slim banner; fold zones into a line. Command: distill.
- [P2] Lower page loses the hero's candlelight; identical bottle tiles. Command: bolder (scoped).
- [P2] Dead-end CTAs: Pedir ahora, Ver el catalogo, category tiles, inert cart, dead legal links. Fix: real WhatsApp link once the number exists, or a designed "Catalogo muy pronto" state on /catalogo; hide the cart until it works. Command: harden.
- [P3] Copy repetition across announcement bar, hero and steps. Command: clarify.

## Evidence (B, production build)
No overflow at 360/768/1440; no target under 44 px (none under 24 px); alts present; no console errors; 13 requests, ~529 KB uncompressed including web fonts; order bar hidden at top, visible after scrolling at 360/768, absent at 1440; "Por confirmar" and "Espacio reservado" not visible; contrast of visible text >= 4.61:1 (brindis and numerals, large text).

## Persona red flags
Jordan: nothing shows what is sold; category tiles look tappable but lead to a provisional page. Riley: dead legal links and cart; no visible 18+ statement in production. Casey: hero ghost CTA low weight over bokeh; categories show ~1.5 tiles.

## Minor
Large empty gap under the hero subtitle at 360; hero scroll cue faint at 1440; teal line art can overlap the lead text at 1440; step text small at 1440; Mezcladores tile slightly taller at 1440 (A, unverified); wordmark duplicated hero/footer.

## Questions
Would a shorter page convert better than one that keeps apologising? Where is Lucia's voice? Should an 18+ statement be part of the identity, not only a legal footer?
