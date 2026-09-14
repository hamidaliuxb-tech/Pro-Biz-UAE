# PRD — Meridian Corporate Partners

## Original Problem Statement
Premium, sophisticated, high-conversion corporate website for a UAE-based Corporate Services Provider (CSP), Business Advisory, Corporate Structuring and Investment Support firm. Positioning: "Strategic Corporate Solutions for Businesses, Investors & International Entrepreneurs in the UAE and Beyond." Must feel like a top-tier international advisory firm (McKinsey/BCG-calibre), NOT a low-cost company-formation agency. Deep navy + champagne gold + light editorial sections. Awwwards-level craft: kinetic hero with masked line-by-line reveal, numbered manifesto chapters, slow editorial marquee, framer-motion reveals, lenis smooth scroll, parallax hero.

## User Choices (confirmed)
- Placeholder premium brand: "Meridian Corporate Partners", Dubai placeholder contact details
- Enquiries saved to MongoDB + simple admin portal
- Insights functional with 6 sample articles in DB
- Statistics and leadership: tasteful placeholders (no invented figures/claims)
- Visual direction: deep navy + champagne gold, light editorial sections

## Architecture
- Frontend: React 19 + Tailwind + framer-motion + lenis + react-router (multi-page), shadcn ui
- Backend: FastAPI + MongoDB (motor), BaseDocument/PyObjectId pattern
- Fonts: Cormorant Garamond (headings), Outfit (body), IBM Plex Mono (overlines/data)

## Implemented (14 Sep 2026)
- Homepage with exact 15-block hierarchy: kinetic masked hero ("Build. Structure. Grow. Protect."), editorial marquee, trust section with [XX] placeholder stats, 4-practice services grid, Why-Us six pillars, market entry, governance, banking (with KYC disclaimer), investor section with interactive holding-structure diagram, 13 sectors, 5-step process, insights preview (from DB), FAQ accordion, CTA band
- 16 service detail pages (4 practice groups), each with what/who/why/process/considerations/role/partners/timeline/documents/FAQs/CTA
- Jurisdictions page: ecosystem chips + interactive Mainland/FreeZone/FinancialFZ/International comparison (desktop matrix table, mobile tabs)
- Structuring page: interactive structure visualizer + governance
- Smart 4-step consultation questionnaire (dynamic, review step, posts to DB)
- Contact page: full lead form, WhatsApp CTA, Google Maps embed, office details
- About (story/mission/vision/values), Leadership (3 placeholder profiles, clearly marked)
- Insights: DB-backed listing with category filters + article pages with author/date/reading time/related articles (6 seeded articles)
- Admin portal (/admin, key-protected): enquiries table, status filter + updates, CSV export
- Legal pages: Privacy, Terms, Disclaimer, Cookies
- SEO: meta titles/descriptions/keywords, Organization JSON-LD schema
- Compliance: banking "no guarantee" disclaimer, licensed-partner notes, full legal disclaimer in footer

## Verified
- curl: enquiry create → admin list → status patch → 401 without key; insights list + detail
- E2E screenshots: homepage render, full consultation questionnaire submission, jurisdictions matrix, admin portal login + table

## Credentials
- Admin portal: /admin, key: mcp-admin-7f3d9a21 (test credential, in backend/.env as ADMIN_KEY)

## Backlog
- P0: Replace placeholder brand/contact/stats/leadership with real business data
- P1: Email notifications on enquiry (Resend), Calendly/appointment booking integration
- P1: Per-page SEO meta (react-helmet), FAQ schema markup, sitemap.xml
- P2: CMS-style admin editing of insights, analytics integration, multi-language (Arabic)
- P2: Careers page, downloadable guides
