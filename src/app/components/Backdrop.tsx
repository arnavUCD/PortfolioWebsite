import React from 'react';

/**
 * A single fixed page surface shared by every section.
 * Layers, back to front: paper gradient → warm/cool washes →
 * container column rules → grain → top light falloff.
 */
export const Backdrop = () => {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden grain">
      {/* Paper base — cool at the bottom, lighter toward the top */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(178deg, var(--paper-high) 0%, var(--paper) 42%, var(--paper) 68%, var(--paper-low) 100%)'
        }}
      />

      {/* Warm wash, off-center left — the only warmth on the page */}
      <div
        className="absolute -left-[15%] top-[8%] w-[70vw] h-[70vw] rounded-full opacity-[0.55] blur-[140px]"
        style={{ background: 'radial-gradient(closest-side, var(--paper-warm), transparent 72%)' }}
      />

      {/* Cool counterweight, low right */}
      <div
        className="absolute -right-[20%] bottom-[-10%] w-[65vw] h-[65vw] rounded-full opacity-40 blur-[150px]"
        style={{ background: 'radial-gradient(closest-side, #b8ccae, transparent 70%)' }}
      />

      {/* Column rules — quiet structure, aligned with the layout grid */}
      <div className="absolute inset-0 flex justify-center">
        <div className="w-full max-w-[1400px] px-6">
          <div className="h-full rules opacity-70" />
        </div>
      </div>

      {/* Light falloff from the top edge, and a soft floor */}
      <div className="absolute inset-x-0 top-0 h-[45vh] bg-gradient-to-b from-white/35 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[30vh] bg-gradient-to-t from-[#135029]/[0.07] to-transparent" />
    </div>
  );
};
