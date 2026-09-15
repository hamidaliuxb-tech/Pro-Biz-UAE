export default function Logo() {
  return (
    <span className="flex items-center gap-3" data-testid="brand-logo">
      <span className="relative w-10 h-10 rounded-[10px] bg-white/[0.06] border border-white/10 flex items-end justify-center gap-[3px] pb-2 overflow-hidden">
        <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#CE1126]" />
        <span className="w-[5px] h-3 rounded-[2px] bg-[#CE1126]" />
        <span className="w-[5px] h-5 rounded-[2px] bg-white" />
        <span className="w-[5px] h-7 rounded-[2px] bg-[#00732F]" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-sans font-semibold text-xl tracking-tight text-white">
          Pro Biz <span className="text-[#CE1126]">UAE</span>
        </span>
        <span className="text-[8px] font-mono uppercase tracking-[0.3em] text-slate-400 mt-1.5">
          Professional Business Services
        </span>
      </span>
    </span>
  );
}
