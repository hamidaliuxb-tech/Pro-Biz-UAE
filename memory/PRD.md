# PRD — Pro Biz UAE

## Rebrand (15 Sep 2026)
Business renamed from "Meridian Corporate Partners" to **Pro Biz UAE**. Palette: #111111 black, #CE1126 red, #00732F green, white/#F4F6F8, slate. CSS-built logo lockup in navbar/footer (src/components/Logo.jsx). Internal tokens kept (`navy`=black, `gold`=red).

## Update (17 Sep 2026) — Digital Services & Portfolio
- New hero banner: bright golden-hour Dubai skyline (client-provided) at /app/frontend/public/hero-dubai.webp with strengthened text overlay
- New service: "Website Design & Development" under new "Digital Services" practice group (auto-appears in services grid, service detail page, lead form select, consultation prefill)
- Portfolio ("Our Work", /portfolio + /portfolio/:id): project cards, 8 category filters, case study pages (client/industry/location/type/requirement/solution/screenshots/features/tech/outcome/URL/testimonial), "Looking for a Website Like This? / Discuss Your Project" CTA, home teaser section
- Admin panel: new "Portfolio" tab — full CRUD, publish/unpublish, confidential masking (hides client/URL/testimonial publicly), display order, sample flag
- 2 SAMPLE projects seeded (clearly marked; no fake clients/testimonials)
- Real contact details live site-wide: +971 50 118 4777, enquires@probizuae.com, M11 Ibn Battuta Gate Dubai, WhatsApp 971501184777, map updated
- UAE flag ribbon (red/green/white/black) added to footer top, consultation page and portfolio CTA
- Green accents woven into overlines, section heading underlines, nav active states and hover states site-wide

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
- CMS/Admin panel (14 Sep 2026): /admin now has 3 tabs — Enquiries, Insights manager (create/edit/delete articles with simple body markup: ## heading, > quote, - list), Site Content manager (company name, tagline, phone, WhatsApp, email, address, hours, social URLs, homepage stats — all live site-wide via /api/content + SiteContext)
- Backend CMS endpoints: GET/PUT /api/content, POST/PUT/DELETE /api/insights (all writes admin-key protected)

## Verified
- curl: enquiry create → admin list → status patch → 401 without key; insights list + detail
- E2E screenshots: homepage render, full consultation questionnaire submission, jurisdictions matrix, admin portal login + table

## Credentials
- Admin portal: /admin, key: mcp-admin-7f3d9a21 (test credential, in backend/.env as ADMIN_KEY)

## Backlog
- P0: Replace placeholder brand/contact/stats/leadership with real business data
- P1: Email notifications on enquiry (Resend), Calendly/appointment booking integration
- P1: Per-page SEO meta (react-helmet), FAQ schema markup, sitemap.xml
- P2: CMS editing of service pages & page sections, analytics integration, multi-language (Arabic)
- P2: Careers page, downloadable guides
