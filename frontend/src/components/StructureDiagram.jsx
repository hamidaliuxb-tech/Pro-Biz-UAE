import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Landmark, Building2, Gem } from 'lucide-react';

const NODES = [
  {
    id: 'founder',
    icon: User,
    title: 'Founder / Investor',
    tag: 'Ownership Layer',
    desc: 'The individual, family or investor group whose interests the structure exists to protect. Ownership, control rights and succession provisions are defined at this level.',
  },
  {
    id: 'holding',
    icon: Landmark,
    title: 'Holding Company',
    tag: 'Consolidation Layer',
    desc: 'The strategic centre of the structure — consolidating ownership, ring-fencing value from operational risk, and providing the platform for succession, investment and exit.',
  },
  {
    id: 'operating',
    icon: Building2,
    title: 'Operating Company / SPV',
    tag: 'Activity Layer',
    desc: 'The entities that trade, contract and employ. SPVs isolate individual assets or ventures so risk never travels across the portfolio.',
  },
  {
    id: 'asset',
    icon: Gem,
    title: 'Investment / Asset',
    tag: 'Value Layer',
    desc: 'Real estate, businesses, portfolios and intellectual property — held within governed, transferable and financeable vehicles.',
  },
];

export default function StructureDiagram() {
  const [active, setActive] = useState('holding');
  const activeNode = NODES.find((n) => n.id === active);

  return (
    <div className="grid lg:grid-cols-2 gap-10 items-center" data-testid="structure-diagram">
      <div className="flex flex-col items-center">
        {NODES.map((node, i) => {
          const Icon = node.icon;
          const isActive = active === node.id;
          return (
            <div key={node.id} className="flex flex-col items-center w-full">
              <motion.button
                onClick={() => setActive(node.id)}
                data-testid={`structuring-node-${node.id === 'operating' ? 'operating-co' : node.id === 'holding' ? 'holding-co' : node.id}`}
                whileHover={{ scale: 1.02 }}
                className={`w-full max-w-sm border px-6 py-5 text-left transition-colors duration-300 flex items-center gap-4 ${
                  isActive ? 'border-gold bg-navy-700' : 'border-cream/15 bg-navy-800 hover:border-gold/50'
                }`}
              >
                <Icon size={22} className={isActive ? 'text-gold' : 'text-cream/50'} />
                <div>
                  <p className={`font-serif text-lg leading-tight ${isActive ? 'text-gold-bright' : 'text-cream'}`}>{node.title}</p>
                  <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-cream/40 mt-1">{node.tag}</p>
                </div>
              </motion.button>
              {i < NODES.length - 1 && (
                <div className="flex flex-col items-center py-1">
                  <div className="w-px h-6 bg-gold/40" />
                  <div className="w-1.5 h-1.5 rotate-45 bg-gold/60" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeNode.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.4 }}
          className="border border-gold/25 bg-navy-800 p-8 lg:p-10"
          data-testid="structure-detail-panel"
        >
          <p className="text-xs font-mono uppercase tracking-[0.25em] text-gold mb-3">{activeNode.tag}</p>
          <h3 className="font-serif text-2xl text-cream mb-4">{activeNode.title}</h3>
          <p className="text-cream/70 leading-relaxed text-base">{activeNode.desc}</p>
          <div className="gold-hairline mt-8" />
          <p className="mt-6 text-xs text-cream/40 leading-relaxed">
            Legal and tax advice is provided by appropriately licensed professional partners where required.
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
