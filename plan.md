# RECOVPH Prompt 4 — Static Recovery and Innovation Explorers

## Objective
Extend the existing RECOVPH website with a frontend-only Recovery Directory Explorer, a Feature Explorer, and informational detail routes for every existing directory and planned feature. Preserve all current home sections, navigation, launch copy, visual identity, 24 recovery categories/items, 25 planned innovations, the 18 source-backed PSGC regions, FAQ, privacy and safety content, and the existing static-only architecture. This is an extension of the Vite/React/TypeScript/Wouter application, not a rebuild.

## Implementation

- Add `/directories`, `/directories/:slug`, `/features`, and `/features/:slug` to the current Wouter route table. Retain `/` and the existing not-found route. Keep `client/public/manus-routes.json` synchronized with these public route patterns; use dynamic `:slug` patterns, not fabricated record IDs.
- Build structured explorer metadata from the existing `directories` and `features` arrays. Preserve the homepage’s current category grouping while assigning each of its 24 directory ideas to exactly one of Prompt 4’s 13 topic categories. Derive the on-page informational topic count from those content records. Add search keywords only as static vocabulary synonyms for existing ideas, never as user submissions or live recovery listings.
- Give each directory detail view its existing title/icon/description, purpose, intended beneficiaries, covered information types, a hypothetical planned reporting pathway, appropriate safety caveats, related existing feature links, and a clear Coming Soon status. Add the five explicit related-feature recommendations from the prompt. No report submission or active case lookup is provided.
- Classify all 25 existing planned features under the seven requested filter categories. Each feature’s list card will include its existing icon/name/description plus category, intended users, potential benefit, and a Coming Soon badge. Each detail route will clearly separate the future concept, intended problem, planned approach, users, related directories, and privacy/safety considerations.
- Implement directory search across title, item-type keywords, category, and existing description; category and feature-category controls; clear search/filters; and accessible empty states, all in React state over static data only. Label the directory search as informational, explicitly not a search of actual lost/found submissions.
- Reuse the established RECOVPH royal-blue/golden-yellow/white/navy design and shared header/footer. Add shared explorer layout, breadcrumb, catalog switch, search/filter controls, and directory/feature catalog-card primitives. Keep controls keyboard-accessible, responsive, and readable on narrow screens.
- Connect Home, About, existing Recovery Directories/Features sections, both explorer pages, and both detail routes through working links. Use homepage section links that work from any route and add explicit links from existing home sections to both explorers. Update the shared footer with Directory Explorer and Feature Explorer links.
- Keep the implementation entirely frontend-only: no database, API, auth, report forms, admin features, operational statistics, simulated listings, or participating-organization claims.

## Design decisions
Reuse the existing RECOVPH visual system: modern public-service editorial styling, white and pale-blue canvas, deep-navy headings, royal-blue navigation/action colors, restrained golden highlights, rounded cards, clear Coming Soon badges, subtle hover/entrance motion, and high-contrast typography. Explorer pages use a strong but compact title area, search and horizontal category chips, scannable cards, and breadcrumbs; detail pages use a readable single-column content hierarchy with a related-features/directories sidebar or responsive stacked panel. Preserve the shared site header and dark footer. Avoid additional visual assets or dependencies for this content-heavy phase.

## Project structure
- `client/src/App.tsx` — retain the current Wouter router and register explorer/detail route patterns.
- `client/src/data/siteContent.ts` — source-of-truth existing homepage content remains intact.
- `client/src/data/explorerContent.ts` — static explorer categories, descriptions, keywords, detail copy, related links, and derived catalogs from existing content.
- `client/src/components/explorer/ExplorerFrame.tsx` — shared RECOVPH header/footer wrapper, page intro, breadcrumbs, cross-explorer navigation, and Coming Soon callouts.
- `client/src/components/explorer/ExplorerControls.tsx` — accessible search, clear-search/filter actions, category filters, and empty state.
- `client/src/components/explorer/CatalogCards.tsx` — shared linked directory and feature cards with icons and status.
- `client/src/pages/DirectoryExplorer.tsx` and `DirectoryDetail.tsx` — directory listing/filter/search and slug-based educational detail.
- `client/src/pages/FeatureExplorer.tsx` and `FeatureDetail.tsx` — feature-category explorer and slug-based educational detail.
- `client/src/components/site/SiteHeader.tsx` and `SiteFooter.tsx` — retain current links, support section links from nested routes, and expose both explorer routes.
- `client/src/index.css` — responsive explorer pages and controls using existing variables and breakpoints.
- `client/public/manus-routes.json` — route declaration for the current single-page home, both explorer pages, and dynamic detail patterns.

## Delivery
Validate the route manifest against routes in `App.tsx`; verify category/search state only filters static items; confirm all 24 directories, 25 features, and the source-backed 18 PSGC regions remain present; run TypeScript and static production build checks; verify navigation/detail/empty states and mobile layout; keep auto-publishing disabled and save the completed project through its existing canonical checkpoint workflow.


# RECOVPH Prompt 5 — Nationwide Philippine Geographic Explorer

## Objective
Extend the current site (do not rebuild it) with a frontend-only explorer for the full official Philippine Standard Geographic Code hierarchy: Country → Region → Province → City/Municipality → Barangay. Use the PSA Third Quarter 2026 publication dataset, the latest masterlist available on 9 November 2026, as of 30 September 2026. The PSA workbook is linked from the official PSGC publications page. Preserve all current homepage, recovery directory, feature, FAQ, privacy, and safety sections; no database or backend is added.

## Data sourcing and normalization
- Source workbook: `https://psa.gov.ph/system/files/scd/PSGC-3Q-2026-Publication-Datafile.xlsx`; PSA PSGC reference page: `https://psa.gov.ph/classification/psgc`; dataset status and counts verified against the PSA Third Quarter 2026 release (published 12 October 2026).
- Normalize the workbook’s `PSGC` sheet into static JSON, preserving each PSGC as a zero-padded string, official source name, source geographic level, city class, parent code(s), and administrative classification. Do not include population or income data because they are not required.
- Validate official-level totals against the workbook and PSA release: 18 regions; 82 provinces; 149 `City`-level rows (33 HUC, 5 ICC, 111 CC); 1,493 municipalities; 42,010 barangays. Preserve 14 `SubMun` rows as a separate Manila subdivision level. Keep the unlevelled City of Isabela record and BARMM Special Geographic Area grouping visible as special PSGC entries rather than silently discarding them or adding them to official geographic-level totals; exclude blank/footnote rows.
- Derive parents using PSGC code structure, typed geographic levels, city class, and workbook notes rather than physical proximity alone. Preserve NCR’s lack of provinces and Pateros as a direct NCR municipality. Place HUC/ICC cities at their region level unless the source confirms a continuing province assignment; retain Lucena City `0431200000` under Quezon `0405600000` while showing PSA’s statistical-purpose qualification, which is not a legal ruling on city status. Represent Isabela’s `0990100000` “City of Isabela (Not a Province)” row as a special province-code grouping under Region IX, not as a province; its actual child `0990101000` City of Isabela is a City-level CC record within that grouping, never Basilan or BARMM. Keep the BARMM Special Geographic Area as a special grouping (not a province) with its coded municipalities and barangays. Present Manila’s 14 `SubMun` entries as non-municipal districts.
- Store the full normalized source file under `client/public/data/psgc-2026-q3.json`; generate a small `client/src/data/psgc-region-summary.json` from that same file for the homepage cards. Show source link, edition/as-of date, publication date, and last-verified date in the UI. Keep source-data concerns separate from UI components so the JSON can be migrated in a future phase.

## Pages and interactions
- Update the homepage section title to “RECOVPH Nationwide Coverage” and subtitle to “Designed to Connect Every Filipino Community – From Regions to Barangays.” Keep the planned-only notice, the existing Philippine archipelago silhouette, 18 linked region cards, and a Geographic Explorer button. Each region card includes official name/code, a short introductory line, and region counts for provinces, cities, municipalities, and barangays computed from the verified dataset.
- Add `/geography` for nationwide search and the 18-region directory. Add `/geography/region/:code`, `/geography/province/:code`, `/geography/locality/:code`, `/geography/barangay/:code`, and `/geography/special-area/:code` detail routes using official PSGC codes. Maintain the route manifest for these patterns.
- Provide functional, local search over region/province/city/municipality/barangay names and official codes; partial matches show a complete disambiguating hierarchy, exact source names, codes, classification, and a link to the matching detail page. Similar barangay names remain distinct by parent and PSGC code. Region, province, city/municipality and barangay selectors cascade using the dataset; allow the alternate special-code branches without inventing a province for NCR, HUC/ICC, Isabela City, Manila’s SubMun, or the BARMM Special Geographic Area.
- Region pages list their actual provinces and direct cities/municipalities/special groupings; province pages list actual component cities and municipalities; local-government pages list their real child barangays. Barangay directories include search and A–Z/number navigation, with responsive result presentation and a clear parent breadcrumb.
- Use the existing Philippine outline as an explicitly illustrative silhouette, not as a selectable administrative-boundary map. Use real interactive region cards/selectors instead of painting fabricated region polygons. Selecting a region card opens that region’s source-backed page.
- On every geographic detail route include “RECOVPH Services Planned for This Location” with eight Coming Soon categories exactly as requested: Lost and Found; Document Recovery; Pet Recovery; Vehicle Recovery; Community Assistance; Transport Lost and Found; Disaster Recovery; Organization Participation.
- Every geographic page explains that browsing is informational, PSGC-based, and does not indicate RECOVPH operations. Do not show fake local reports, people, centers, partners, active cases, or live nationwide coverage.

## Project structure and serving
- `scripts/build_psgc_dataset.py` — local workbook normalization, source-level checks, explicit exception handling, region-summary generation, and reproducible compact JSON/gzip output; it is a maintenance script only and is not part of the website runtime.
- `client/public/data/psgc-2026-q3.json` and `.json.gz` — full normalized official hierarchy plus its compact transfer version, fetched only by geographic explorer/detail routes.
- `client/src/data/psgc-region-summary.json` — small computed region cards data used by Home.
- `client/src/data/psgcTypes.ts` and `psgcUtils.ts` — separate data shapes, hierarchy routes, indexes, breadcrumb utilities, and record labels; source metadata is embedded in the generated files.
- `client/src/hooks/usePsgcDataset.ts` — lazy/cached gzip-aware read-only JSON loader, with fallback and count validation.
- `client/src/components/geography/` — reusable source-status, geography cards, and planned-service cards.
- `client/src/pages/GeographyExplorer.tsx` and `GeographyDetail.tsx` — nationwide search/selection and the official-code detail routes.
- `client/src/App.tsx`, `client/src/pages/Home.tsx`, shared site navigation/footer and `client/src/index.css` — add routes, existing homepage entry points, and responsive RECOVPH-styled views.
- Keep the current Vite/React/TypeScript/Wouter static app. Load the full dataset only when the geographic explorer/detail pages need it; do not add APIs, login, backend, Supabase, a database, authentication, an admin portal, recovery reporting, or extra image assets.

## Design
Reuse the existing RECOVPH public-service visual system, colors, typography, shared navigation/footer, Coming Soon badge, rounded cards, and reduced-motion-aware transitions. Use a compact searchable table/card hierarchy with visible codes and breadcrumbs. The Philippines SVG remains an illustrative map; visual selection is through real source-backed region cards because PSGC code data is not a complete interactive boundary file.
