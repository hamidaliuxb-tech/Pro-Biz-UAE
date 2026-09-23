export const DEFAULT_JURISDICTIONS = {
  hero: {
    overline: 'Your Gateway to the UAE',
    title: 'One Country. Many Jurisdictions. One Right Answer — Yours.',
    text: 'The UAE offers mainland, free zone, financial free zone and international structures, each with distinct advantages. We help you compare them honestly — because not every structure is appropriate for every business.',
  },
  chips: [
    'Dubai Mainland', 'Abu Dhabi Mainland', 'DIFC', 'ADGM', 'DMCC', 'JAFZA', 'IFZA',
    'Meydan', 'RAKEZ', 'Sharjah Free Zones', 'International Structures',
  ],
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
      mainland: 'Standard UAE corporate tax regime applies (0% / 9%)',
      freezone: 'Qualifying Free Zone Person (QFZP) 0% relief potentially available',
      financial: 'Zone tax guarantees; standard federal rules where relevant',
      international: 'Tax residency and treaty access depend on jurisdiction' } },
  ],
};
