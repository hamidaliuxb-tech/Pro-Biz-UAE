import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LINKS = [
  { to: '/services', label: 'Services' },
  { to: '/jurisdictions', label: 'Jurisdictions' },
  { to: '/structuring', label: 'Structuring' },
  { to: '/about', label: 'About' },
  { to: '/leadership', label: 'Leadership' },
  { to: '/insights', label: 'Insights' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-navy/90 backdrop-blur-md border-b border-gold/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" data-testid="nav-logo-link" className="flex flex-col leading-none" onClick={() => setOpen(false)}>
            <span className="font-serif text-2xl text-cream tracking-tight">Meridian</span>
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-gold">Corporate Partners</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-7">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                data-testid={`nav-link-${l.label.toLowerCase()}`}
                className={({ isActive }) =>
                  `text-[13px] tracking-wide transition-colors duration-300 ${isActive ? 'text-gold' : 'text-cream/70 hover:text-cream'}`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <Link
              to="/consultation"
              data-testid="nav-consultation-button"
              className="ml-2 bg-gold text-navy text-[13px] font-medium tracking-wide px-5 py-2.5 hover:bg-gold-soft transition-colors duration-300"
            >
              Book a Consultation
            </Link>
          </nav>

          <button
            data-testid="nav-mobile-menu-btn"
            className="lg:hidden text-cream p-2"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-navy-800 border-t border-gold/10 overflow-hidden"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {LINKS.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  data-testid={`nav-mobile-link-${l.label.toLowerCase()}`}
                  onClick={() => setOpen(false)}
                  className="text-cream/80 text-base py-1 hover:text-gold transition-colors"
                >
                  {l.label}
                </NavLink>
              ))}
              <Link
                to="/consultation"
                data-testid="nav-mobile-consultation-button"
                onClick={() => setOpen(false)}
                className="mt-3 bg-gold text-navy text-center text-sm font-medium px-5 py-3"
              >
                Book a Confidential Consultation
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
