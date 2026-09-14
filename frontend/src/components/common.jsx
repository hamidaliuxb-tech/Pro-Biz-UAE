import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const Reveal = ({ children, delay = 0, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 28 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

export const Overline = ({ children, dark = false }) => (
  <p className={`text-xs font-mono uppercase tracking-[0.25em] mb-4 ${dark ? 'text-gold' : 'text-gold'}`}>{children}</p>
);

export const SectionHeading = ({ overline, title, dark = false, className = '' }) => (
  <Reveal className={className}>
    <Overline dark={dark}>{overline}</Overline>
    <h2 className={`font-serif text-2xl sm:text-3xl lg:text-4xl tracking-tight leading-tight text-balance ${dark ? 'text-cream' : 'text-navy'}`}>
      {title}
    </h2>
  </Reveal>
);

export const GoldButton = ({ to, children, testid, className = '' }) => (
  <Link
    to={to}
    data-testid={testid}
    className={`group inline-flex items-center gap-2 bg-gold text-navy text-sm font-medium tracking-wide px-7 py-3.5 hover:bg-gold-soft transition-colors duration-300 ${className}`}
  >
    {children}
    <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
  </Link>
);

export const GhostButton = ({ to, children, testid, dark = true, className = '' }) => (
  <Link
    to={to}
    data-testid={testid}
    className={`group inline-flex items-center gap-2 border text-sm tracking-wide px-7 py-3.5 transition-colors duration-300 ${
      dark ? 'border-cream/30 text-cream hover:border-gold hover:text-gold' : 'border-navy/30 text-navy hover:border-gold hover:text-gold'
    } ${className}`}
  >
    {children}
    <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
  </Link>
);

export const Marquee = ({ items }) => (
  <div className="overflow-hidden marquee-paused bg-navy-800 border-y border-gold/15 py-6" data-testid="editorial-marquee">
    <div className="flex w-max animate-marquee">
      {[0, 1].map((copy) => (
        <div key={copy} className="flex items-center" aria-hidden={copy === 1}>
          {items.map((item, i) => (
            <span key={i} className="flex items-center">
              <span className="font-serif italic text-xl md:text-2xl text-gold/70 px-10 whitespace-nowrap">{item}</span>
              <span className="text-gold/40 text-[10px]">◆</span>
            </span>
          ))}
        </div>
      ))}
    </div>
  </div>
);

export const PageHero = ({ overline, title, text, image }) => (
  <section className="relative bg-navy pt-36 pb-20 lg:pt-44 lg:pb-28 overflow-hidden grain-overlay">
    {image && (
      <div className="absolute inset-0">
        <img src={image} alt="" className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/85 to-navy/60" />
      </div>
    )}
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
        <Overline dark>{overline}</Overline>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-cream tracking-tight leading-[1.1] max-w-3xl text-balance">{title}</h1>
        {text && <p className="mt-6 text-base sm:text-lg text-cream/70 max-w-2xl leading-relaxed">{text}</p>}
      </motion.div>
    </div>
  </section>
);

export const CTABand = ({ title = 'Every engagement begins with a confidential conversation.', text, dark = true }) => (
  <section className={`${dark ? 'bg-navy-800' : 'bg-cream'} py-20 lg:py-24`}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="gold-hairline mb-14" />
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <Reveal>
          <h2 className={`font-serif text-2xl sm:text-3xl lg:text-4xl tracking-tight max-w-xl text-balance ${dark ? 'text-cream' : 'text-navy'}`}>{title}</h2>
          {text && <p className={`mt-4 text-base max-w-lg ${dark ? 'text-cream/60' : 'text-slate-600'}`}>{text}</p>}
        </Reveal>
        <Reveal delay={0.15}>
          <GoldButton to="/consultation" testid="ctaband-consultation-btn">Book a Confidential Consultation</GoldButton>
        </Reveal>
      </div>
    </div>
  </section>
);
