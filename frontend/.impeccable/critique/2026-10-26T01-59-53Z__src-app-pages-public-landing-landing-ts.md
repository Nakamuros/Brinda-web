---
target: landing
total_score: 23
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 2
target_identity: "file:C:\\Desktop\\Office\\Personal\\BRINDA\\frontend\\src\\app\\pages\\public\\landing\\landing.ts"
target_fingerprint: "sha256:a1f2480bbeef7af174e79c2d14e4a608c3625e4d0de642760132a8e66bd841fa"
target_path: "C:\\Desktop\\Office\\Personal\\BRINDA\\frontend\\src\\app\\pages\\public\\landing\\landing.ts"
timestamp: 2026-10-26T01-59-53Z
slug: src-app-pages-public-landing-landing-ts
---
Method: dual-agent (A: design review, production view · B: detector + headless browser evidence on the production build). Round 3.

## Design Health Score: 23/32 (72%, Good band by percentage). Heuristics 7 and 10 n/a. Reviewer note: A scored heuristic 9 at 3 ("nothing to recover from") and heuristic 5 at 3 (+18 notice present); earlier rounds scored both 2, so about one point of the +2 is scorer drift, the rest comes from real fixes.

| # | Heuristic | Score | Key issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Cart inert, no badge |
| 2 | Match System / Real World | 3 | Plain local copy |
| 3 | User Control and Freedom | 3 | Inert cart/legal links |
| 4 | Consistency and Standards | 3 | Ghost/solid CTA split follows the brief |
| 5 | Error Prevention | 3 | +18 notice present |
| 6 | Recognition Rather Than Recall | 3 | Rail hides tiles beyond the second at 360 |
| 7 | Flexibility and Efficiency | n/a | Persuade landing |
| 8 | Aesthetic and Minimalist Design | 3 | Empty bottle placeholders add noise |
| 9 | Error Recovery | 3 | Little to recover from |
| 10 | Help and Documentation | n/a | Persuade landing |
Adjustment: -1 for thin content (no hours/zones/contact) = 23/32.

## Specificity: distinct mood (bar at night), generic skeleton; mood 3/5, content 2/5. Detector [] on all targets; overlay "No anti-patterns found" (headless, no user-visible overlay).

## Priority issues
- [P1] The page never answers "do you deliver to me, and when?" (zones "muy pronto", no hours, no WhatsApp contact). Needs owner facts; if unknown, reword as an action with a real WhatsApp link. clarify.
- [P1] Mobile hero loses its signature: candle cropped at the right edge, glass small at the bottom. Recompose candle and glass at 360. layout / adapt.
- [P2] Below the fold is three "muy pronto" blocks in a row (categories placeholders, combos, zones). Merge combos and zones into one compact strip. distill.
- [P2] CTA duplication on mobile: the sticky bar overlaps the in-page "Pedir ahora" after "Como pedir". Hide the bar while the in-page CTA is visible. polish.
- [P3] Rail on mobile shows two very tall tiles; consider shorter tiles or a 2-column grid. adapt.

## Evidence (B, production)
Detector clean; no overflow at 360/768/1440; no target under 44 px (none under 24); 2 img, all with alt; console clean; 13 requests, ~530 KB uncompressed incl. ~105 KB web fonts; contrast of visible text >= 4.61:1 (large text), 7.10+ for small text; order bar off-screen at top, visible after scroll at 360/768, not rendered at 1440; placeholders not visible in production (only the sr-only cart label); +18 notice present at all widths.

## Personas
Jordan: hero ghost CTA small over bokeh; destination is a provisional catalogue. Riley: inert cart and legal links, no feedback on touch. Casey: small letter-spaced caps; rail needs a horizontal swipe.

## Minor
Announcement bar repeats the hero subtitle; Mezcladores tile slightly taller at 1440 (reported twice, unverified); wordmark repeated; copyright line very small. A's remark that the hamburger has no label is wrong: it has an sr-only "Abrir menu".

## Questions
Should the landing be one screen plus "Escribenos" until there is real content? Is "Pedir ahora" honest when the catalogue is empty? What single detail is only BRINDA's?
