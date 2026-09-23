export const SITE = {
  name: 'Pro Biz UAE',
  shortName: 'Pro Biz UAE',
  tagline: 'Strategic corporate solutions for entrepreneurs, investors and international businesses establishing, expanding and operating in the UAE.',
  phone: '+971 50 118 4777',
  whatsapp: '971501184777',
  email: 'enquiries@probizuae.com',
  address: 'M11, Ibn Battuta Gate, Jebel Ali, Dubai, United Arab Emirates',
  hours: 'Monday – Friday · 9:00 – 18:00 GST',
  facebook: 'https://www.facebook.com',
  linkedin: 'https://www.linkedin.com',
  instagram: 'https://www.instagram.com',
  youtube: 'https://www.youtube.com',
};

export const IMAGES = {
  hero: '/hero-dubai-luxury.jpg',
  tower: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?crop=entropy&cs=srgb&fm=jpg&q=85',
  boardroom: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?crop=entropy&cs=srgb&fm=jpg&q=85',
  skyline: '/images/dubai_market_entry.jpg',
  difc: 'https://images.unsplash.com/photo-1546412414-e1885259563a?crop=entropy&cs=srgb&fm=jpg&q=85',
  facade: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?crop=entropy&cs=srgb&fm=jpg&q=85',
  partnerMale: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?crop=entropy&cs=srgb&fm=jpg&q=85',
  partnerFemale: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?crop=entropy&cs=srgb&fm=jpg&q=85',
  advisor: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?crop=entropy&cs=srgb&fm=jpg&q=85',
  meeting: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?crop=entropy&cs=srgb&fm=jpg&q=85',
  banking: '/images/corporate_banking.jpg',
  realestate: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?crop=entropy&cs=srgb&fm=jpg&q=85',
};

export const STATS = [
  { value: '150+', label: 'Businesses Supported' },
  { value: '40+', label: 'Years of Combined Experience' },
  { value: '21+', label: 'Markets Connected' },
  { value: '18+', label: 'Professional Partnerships' },
];

export const MARQUEE_ITEMS = [
  'UAE Corporate Services',
  'Business Advisory',
  'Corporate Structuring',
  'Compliance',
  'Market Entry',
  'Banking Support',
  'Investor Services',
  'Governance',
];

export const PILLARS = [
  { title: 'Strategic', text: 'We look beyond incorporation to understand your long-term objectives — and structure for them from day one.' },
  { title: 'Connected', text: 'Access to a professional ecosystem covering banking, accounting, tax, legal, compliance and corporate services.' },
  { title: 'Experienced', text: 'Executive-level understanding of business operations and the UAE corporate environment.' },
  { title: 'Discreet', text: 'Client confidentiality and professional handling of sensitive corporate information, without exception.' },
  { title: 'Practical', text: 'Solutions designed around real operational requirements — not theoretical frameworks.' },
  { title: 'Relationship Driven', text: 'We aim to become a long-term corporate partner rather than a transactional service provider.' },
];

export const PROCESS_STEPS = [
  { num: '01', title: 'Discover', text: 'Understand your business, ownership, objectives and requirements.' },
  { num: '02', title: 'Structure', text: 'Evaluate appropriate UAE corporate and operating structures.' },
  { num: '03', title: 'Plan', text: 'Develop an implementation roadmap covering licensing, banking, compliance and operations.' },
  { num: '04', title: 'Execute', text: 'Coordinate implementation with relevant authorities and professional partners.' },
  { num: '05', title: 'Support', text: 'Provide ongoing corporate administration and strategic support as the business evolves.' },
];

export const SECTORS = [
  'Financial Services', 'Fintech', 'Trading', 'Real Estate', 'Construction', 'Technology',
  'Professional Services', 'E-commerce', 'Logistics', 'Hospitality', 'Healthcare',
  'Family Businesses', 'Investment Companies',
];

export const JURISDICTION_CHIPS = [
  'Dubai Mainland', 'Abu Dhabi Mainland', 'DIFC', 'ADGM', 'DMCC', 'JAFZA', 'IFZA',
  'Meydan', 'RAKEZ', 'Sharjah Free Zones', 'International Structures',
];

export const JURISDICTION_MATRIX = {
  columns: [
    { key: 'mainland', title: 'UAE Mainland', tag: 'Onshore · DED / emirate authority' },
    { key: 'freezone', title: 'Free Zone', tag: 'DMCC · IFZA · JAFZA · RAKEZ' },
    { key: 'financial', title: 'Financial Free Zone', tag: 'DIFC · ADGM · Common law' },
    { key: 'international', title: 'International', tag: 'Cross-border & offshore' },
  ],
  rows: [
    { label: 'Ownership', values: {
      mainland: 'Up to 100% foreign ownership for most activities',
      freezone: '100% foreign ownership',
      financial: '100% foreign ownership',
      international: 'Full foreign ownership, jurisdiction dependent' } },
    { label: 'Business Activities', values: {
      mainland: 'Unrestricted UAE market access; widest activity scope',
      freezone: 'Activities defined by the zone’s licensing framework',
      financial: 'Financial, holding, professional and regulated activities',
      international: 'Holding, investment and international trading' } },
    { label: 'Office Requirements', values: {
      mainland: 'Physical office typically required (Ejari in Dubai)',
      freezone: 'Flexi-desk to dedicated offices, zone dependent',
      financial: 'Premises within the centre; substance requirements',
      international: 'Registered agent; minimal physical presence' } },
    { label: 'Regulatory Environment', values: {
      mainland: 'UAE federal law and emirate-level authorities',
      freezone: 'Zone authority regulation under UAE federal law',
      financial: 'Independent common-law courts and regulators (DFSA / FSRA)',
      international: 'Jurisdiction-specific regulation and treaties' } },
    { label: 'Banking Considerations', values: {
      mainland: 'Broad banking appetite; strong local commercial profile',
      freezone: 'Good access; zone reputation influences bank review',
      financial: 'Preferred for financial and investment businesses',
      international: 'Banking assessed case-by-case; substance is key' } },
    { label: 'Tax Considerations', values: {
      mainland: '9% corporate tax on taxable income above threshold; 5% VAT',
      freezone: 'Potential 0% on qualifying income, subject to conditions',
      financial: 'Corporate tax applies; treaties and frameworks available',
      international: 'Dependent on jurisdiction and residency position' } },
    { label: 'Investment Requirements', values: {
      mainland: 'No minimum capital for most activities; cost varies by activity',
      freezone: 'Package-based; varies significantly by zone',
      financial: 'Higher setup and ongoing substance costs',
      international: 'Typically cost-efficient; substance considerations apply' } },
    { label: 'Suitability', values: {
      mainland: 'Trading, retail, government contracts, UAE-wide operations',
      freezone: 'SMEs, e-commerce, consultancies, international trade',
      financial: 'Funds, holding companies, financial services, family offices',
      international: 'Asset holding, IP, cross-border investment structures' } },
  ],
};

export const HOME_FAQS = [
  { q: 'Can a foreign national own 100% of a UAE company?', a: 'In most cases, yes. The majority of mainland activities now permit full foreign ownership, and free zones have always offered 100% foreign ownership. Certain strategic activities remain subject to specific requirements, which we assess during the structuring stage.' },
  { q: 'How long does it take to establish a UAE company?', a: 'Timelines depend on jurisdiction, activity and documentation readiness. A straightforward free zone incorporation may complete within days; mainland and regulated activities take longer due to approvals. Banking and residency processes follow their own timelines. We provide a realistic roadmap before any engagement begins.' },
  { q: 'Do you guarantee corporate bank account opening?', a: 'No — and you should be cautious of any firm that does. Banking approval remains subject to the individual bank’s KYC, compliance and credit policies. Our role is to prepare a credible corporate profile and documentation, and to coordinate introductions to appropriate banking partners.' },
  { q: 'What is the difference between mainland and free zone?', a: 'Mainland companies can trade freely across the UAE market and are regulated by emirate-level authorities. Free zone companies operate within a specific zone’s framework with streamlined administration and potential tax advantages, but face restrictions on direct mainland trading. Our jurisdiction comparison outlines the full picture.' },
  { q: 'Do you provide legal or tax advice?', a: 'We coordinate legal, tax and audit services through our network of licensed and regulated professional partners where applicable. Our role is structural design, coordination and ongoing corporate administration — ensuring the right qualified professionals are engaged at the right time.' },
  { q: 'How are your fees structured?', a: 'Every engagement begins with a defined scope and a transparent, written proposal. We do not publish generic price lists because well-structured corporate work is not generic — but you will always know the full cost before committing.' },
];

export const DISCLAIMER_TEXT = 'Information provided on this website is for general informational purposes only and does not constitute legal, tax, financial or investment advice. Certain services may require approval, licensing or advice from appropriately authorised professionals or regulatory authorities. Service availability and requirements are subject to applicable UAE laws, regulations and authority requirements.';

export const PARTNER_NOTE = 'Delivered through our network of licensed and regulated professional partners where applicable.';
