import { Link } from 'react-router-dom';
import { Linkedin, Instagram, Youtube } from 'lucide-react';
import { SITE, DISCLAIMER_TEXT } from '@/data/site';

const COLUMNS = [
  {
    title: 'Company',
    links: [
      { to: '/about', label: 'About Us' },
      { to: '/leadership', label: 'Leadership' },
      { to: '/contact', label: 'Careers' },
      { to: '/contact', label: 'Contact' },
    ],
  },
  {
    title: 'Services',
    links: [
      { to: '/services/company-formation', label: 'Company Formation' },
      { to: '/services/corporate-structuring', label: 'Corporate Structuring' },
      { to: '/services/business-strategy', label: 'Business Advisory' },
      { to: '/services/banking-support', label: 'Banking Support' },
      { to: '/services/vat-corporate-tax', label: 'Accounting & Tax' },
      { to: '/services/aml-compliance', label: 'Compliance' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { to: '/insights', label: 'Insights' },
      { to: '/jurisdictions', label: 'Jurisdiction Guide' },
      { to: '/structuring', label: 'Structuring' },
      { to: '/consultation', label: 'Consultation' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { to: '/legal/privacy', label: 'Privacy Policy' },
      { to: '/legal/terms', label: 'Terms & Conditions' },
      { to: '/legal/disclaimer', label: 'Disclaimer' },
      { to: '/legal/cookies', label: 'Cookie Policy' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-navy text-cream/70" data-testid="site-footer">
      <div className="gold-hairline" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10">
          <div className="col-span-2">
            <div className="flex flex-col leading-none mb-5">
              <span className="font-serif text-2xl text-cream tracking-tight">Meridian</span>
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-gold">Corporate Partners</span>
            </div>
            <p className="text-sm leading-relaxed mb-6 max-w-xs">
              Strategic corporate solutions for businesses, investors and international entrepreneurs in the UAE and beyond.
            </p>
            <div className="flex gap-4">
              <a href={SITE.linkedin} data-testid="footer-social-linkedin" target="_blank" rel="noopener noreferrer" className="text-cream/50 hover:text-gold transition-colors" aria-label="LinkedIn"><Linkedin size={18} /></a>
              <a href={SITE.instagram} data-testid="footer-social-instagram" target="_blank" rel="noopener noreferrer" className="text-cream/50 hover:text-gold transition-colors" aria-label="Instagram"><Instagram size={18} /></a>
              <a href={SITE.youtube} data-testid="footer-social-youtube" target="_blank" rel="noopener noreferrer" className="text-cream/50 hover:text-gold transition-colors" aria-label="YouTube"><Youtube size={18} /></a>
            </div>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-gold mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} data-testid={`footer-link-${l.label.toLowerCase().replace(/[^a-z]+/g, '-')}`} className="text-sm hover:text-cream transition-colors duration-300">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-8 border-t border-cream/10">
          <p className="text-xs leading-relaxed text-cream/40 max-w-4xl">{DISCLAIMER_TEXT}</p>
          <div className="mt-6 flex flex-col sm:flex-row justify-between gap-3 text-xs text-cream/40">
            <span>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</span>
            <span>{SITE.address}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
