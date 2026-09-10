import { Activity, AlertTriangle, Check, HeartPulse, Newspaper, ShieldCheck, Zap } from 'lucide-react';
import credereLogo from '../../assets/credere-navy.png';

const Waveform = ({ color = '#51b89d' }: { color?: string }) => (
  <svg viewBox="0 0 320 72" className="h-auto w-full" aria-hidden>
    {/* Downsampled from SignalGenerator/stage2/model_input.json in the project repo. */}
    <path d="M0 49.1 3.4 55 6.7 37.2 10.1 57.4 13.5 61.9 16.8 33.3 20.2 49.9 23.6 47.4 26.9 48.9 30.3 48.5 33.7 51.2 37.1 55.5 40.4 55.1 43.8 32.9 47.2 49.5 50.5 53.9 53.9 48.4 57.3 48.3 60.6 51.6 64 57 67.4 57.7 70.7 35.1 74.1 54.1 77.5 54.9 80.8 47.7 84.2 51 87.6 52.8 90.9 62 94.3 51.6 97.7 33 101.1 55.9 104.4 45.8 107.8 48.6 111.2 54.2 114.5 55.1 117.9 55.2 121.3 48.6 124.6 49.7 128 51.2 131.4 48.1 134.7 50.3 138.1 50.4 141.5 50 144.8 6 148.2 51.5 151.6 46.6 154.9 52.5 158.3 48.3 161.7 54.3 165.1 47.3 168.4 53.3 171.8 6 175.2 48.2 178.5 51.3 181.9 49.2 185.3 57 188.6 42.9 192 53.3 195.4 48.1 198.7 6.1 202.1 47.9 205.5 52.5 208.8 55.9 212.2 49.6 215.6 52.5 218.9 43 222.3 54.7 225.7 57.9 229.1 36.2 232.4 49 235.8 49.8 239.2 43.2 242.5 48 245.9 39.7 249.3 49.7 252.6 56.2 256 38.5 259.4 50.2 262.7 49.5 266.1 51.9 269.5 52.5 272.8 46.7 276.2 54.7 279.6 41.6 282.9 39.8 286.3 51.6 289.7 46.3 293.1 47.3 296.4 48.2 299.8 50.4 303.2 52.4 306.5 11.5 309.9 39.5 313.3 57.2 316.6 50.4 320 47.4" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CardioVisual = () => (
  <div className="project-visual cardio-visual">
    <div className="visual-orb -right-16 -top-14 bg-[#55b99e]/25" />
    <div className="visual-label"><HeartPulse className="h-3.5 w-3.5" /> Live monitor</div>
    <div className="device-card relative z-10 mx-auto w-[82%] max-w-[350px]">
      <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.18em] text-white/50">
        <span>CardioSense</span><span className="flex items-center gap-1 text-[#75cbb4]"><i className="h-1.5 w-1.5 rounded-full bg-current" /> Live</span>
      </div>
      <div className="mt-7 flex items-start justify-between">
        <div>
          <p className="text-[10px] text-white/45">Current rhythm</p>
          <p className="mt-1 text-xl font-medium text-white">Normal rhythm</p>
        </div>
        <span className="rounded-full bg-[#75cbb4]/15 p-2 text-[#75cbb4]"><Check className="h-4 w-4" /></span>
      </div>
      <div className="my-5"><Waveform /></div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-white/[0.055] p-3"><span className="text-2xl text-white">72</span><span className="ml-1 text-[9px] text-white/40">BPM</span></div>
        <div className="rounded-xl bg-white/[0.055] p-3"><span className="text-2xl text-white">91%</span><span className="ml-1 text-[9px] text-white/40">CONF.</span></div>
      </div>
    </div>
    <div className="floating-chip bottom-6 right-5 rotate-3"><Activity className="h-3.5 w-3.5 text-[#75cbb4]" /> 10s window</div>
  </div>
);

const CredereVisual = () => (
  <div className="project-visual verity-visual">
    <div className="visual-orb -left-20 -top-20 bg-[#78bbff]/30" />
    <div className="visual-label text-[#142a6a]"><ShieldCheck className="h-3.5 w-3.5" /> Evidence-led automation</div>
    <div className="relative z-10 mx-auto w-[86%] max-w-[380px]">
      <div className="rounded-2xl border border-[#142a6a]/10 bg-white/90 p-5 shadow-[0_25px_60px_-28px_rgba(20,42,106,.6)]">
        <img src={credereLogo} alt="Credere" className="mb-4 h-auto w-28" />
        <div className="flex items-center justify-between border-b border-black/[0.07] pb-4">
          <div><p className="text-[9px] uppercase tracking-[0.16em] text-black/35">Bank payment</p><p className="mt-1 font-data text-lg">$18,400.00</p></div>
          <span className="rounded-md bg-[#e6f4ef] px-2 py-1 text-[9px] font-medium text-[#0a7f5f]">CONFIRMED</span>
        </div>
        <div className="space-y-3 pt-4 text-[10px]">
          <div className="flex justify-between"><span className="text-black/40">Reference</span><span className="font-data">INV-2048</span></div>
          <div className="flex justify-between"><span className="text-black/40">Matched to</span><span>Northstar Labs</span></div>
          <div className="flex justify-between"><span className="text-black/40">Action</span><span className="text-[#175ba6]">Payment posted</span></div>
        </div>
      </div>
      <div className="absolute -bottom-10 -left-7 w-[74%] -rotate-3 rounded-xl border border-white/60 bg-[#142a6a] p-4 text-white shadow-2xl">
        <p className="text-[8px] uppercase tracking-[0.18em] text-white/45">Audit entry</p>
        <p className="mt-2 text-[10px] leading-relaxed text-white/80">Evidence cleared · actor marked automated · write reconciled</p>
      </div>
    </div>
  </div>
);

const InfraVisual = () => (
  <div className="project-visual infra-visual">
    <div className="visual-orb -right-16 top-4 bg-[#f4a261]/25" />
    <div className="visual-label"><Zap className="h-3.5 w-3.5 text-[#ffb470]" /> Fleet intelligence</div>
    <div className="relative z-10 mx-auto w-[88%] max-w-[390px] rounded-2xl border border-white/10 bg-[#18191b]/95 p-6 text-white shadow-2xl">
      <div className="flex items-center justify-between">
        <div><p className="text-[9px] uppercase tracking-[0.16em] text-white/35">Charger CHG-004821</p><p className="mt-1 text-lg font-medium">Failure risk</p></div>
        <div className="relative grid h-14 w-14 place-items-center rounded-full border-[5px] border-[#f06b55] text-sm font-semibold">87%</div>
      </div>
      <div className="mt-5 rounded-xl bg-white/[0.055] p-4">
        <div className="flex items-center gap-2 text-[10px] text-[#ffb470]"><AlertTriangle className="h-3.5 w-3.5" /> Failure likely within 24h</div>
        <p className="mt-3 text-xs leading-relaxed text-white/75">Reduce load; inspect cooling and airflow. Consider taking offline.</p>
      </div>
      <div className="mt-4 space-y-2">
        {[['Thermal stress', '84%'], ['Error density', '61%'], ['Voltage drift', '38%']].map(([label, value]) => (
          <div key={label} className="flex items-center gap-3 text-[9px] text-white/45">
            <span className="w-20">{label}</span>
            <span className="h-1 flex-1 overflow-hidden rounded-full bg-white/10"><i className="block h-full rounded-full bg-[#ff9d62]" style={{ width: value }} /></span>
            <span>{value}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const NewsVisual = () => (
  <div className="project-visual news-visual">
    <div className="visual-orb -left-10 -top-10 bg-[#d4a373]/25" />
    <div className="visual-label text-[#40362d]"><Newspaper className="h-3.5 w-3.5" /> Credibility analysis</div>
    <div className="relative z-10 mx-auto w-[86%] max-w-[380px] rounded-2xl border border-black/[0.08] bg-[#fffef9]/95 p-6 shadow-[0_28px_65px_-32px_rgba(70,50,35,.55)]">
      <p className="text-[9px] uppercase tracking-[0.16em] text-black/35">Article review · just now</p>
      <p className="mt-3 text-base font-medium leading-snug text-[#292520]">Independent analysis finds context missing from viral claim</p>
      <div className="my-4 h-px bg-black/[0.07]" />
      <div className="flex items-center gap-4">
        <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full border-[5px] border-[#6f9274]"><span className="text-sm font-semibold">82%</span></div>
        <div><p className="text-xs font-medium text-[#446449]">Likely credible</p><p className="mt-1 text-[10px] leading-relaxed text-black/45">Classical + transformer ensemble agree.</p></div>
      </div>
      <div className="mt-5 rounded-lg bg-[#f2eee5] px-3 py-2 text-[9px] text-black/50">Uncertain range 35–65% → defer verdict</div>
    </div>
  </div>
);

export const ProjectVisual = ({ projectId }: { projectId: string }) => {
  if (projectId === 'cardiosense') return <CardioVisual />;
  if (projectId === 'verity-ai') return <CredereVisual />;
  if (projectId === 'infracopilot-ai') return <InfraVisual />;
  return <NewsVisual />;
};
