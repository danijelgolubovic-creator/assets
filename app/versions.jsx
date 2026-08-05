/* versions.jsx — design themes + token-style progress meter */

/* ===== 4 design directions =====
   V1 keeps the refined original. V2/V3/V4 are progressively more aggressive.
   Wheel identity colors (per cfg) stay constant; only the AESTHETIC changes. */
const THEMES = {
  final: {
    key: 'final', name: 'Final', tag: 'FIN',
    // OSNOVA: Refined card/look
    cardBg: 'linear-gradient(180deg, rgba(12,15,32,.72), rgba(7,9,29,.62))',
    border: '1px solid var(--card-glow, #ff40ec)',
    boxShadow: '0 0 0 1px color-mix(in srgb, var(--card-glow,#ff40ec) 22%, transparent), 0 18px 40px -18px color-mix(in srgb, var(--card-glow,#ff40ec) 40%, transparent), inset 0 1px 0 rgba(255,255,255,.05)',
    radius: 18, clip: null, overlay: null,
    glowMul: 1.4, // LOADING ANIMATION feel from Gold Rush (stronger glow)
    rim: 'soft', tokenShape: 'pill', tokenCount: 12,
    accent: '#ff40ec', heading: '#ffffff', headingFx: null,
    titleSpacing: '-.01em',
    frontSize: 172, backSize: 120, bigWheels: true, // SIZES like Midnight
  },
  final2: {
    key: 'final2', name: 'Final v2', tag: 'FIN2',
    // OSNOVA: Refined card/look
    cardBg: 'linear-gradient(180deg, rgba(12,15,32,.72), rgba(7,9,29,.62))',
    border: '1px solid var(--card-glow, #ff40ec)',
    boxShadow: '0 0 0 1px color-mix(in srgb, var(--card-glow,#ff40ec) 22%, transparent), 0 18px 40px -18px color-mix(in srgb, var(--card-glow,#ff40ec) 40%, transparent), inset 0 1px 0 rgba(255,255,255,.05)',
    radius: 18, clip: null, overlay: null,
    glowMul: 1.4, // Gold Rush loading-glow feel, carried into the accumulation meter
    rim: 'soft', tokenShape: 'coin', tokenCount: 12, // Gold Rush coin tokens on the accumulation meter
    accent: '#ff40ec', heading: '#ffffff', headingFx: 'shimmer', // Gold Rush shimmer on the header
    titleSpacing: '-.01em',
    frontSize: 180, backSize: 126, bigWheels: true, // wheel-loader size matches Midnight (V8)
    hideTokenMeter: true, // no "Loading" label / token row under the header
    countdownDays: 7,
  },
  refined: {
    key: 'refined', name: 'Refined', tag: 'V1',
    cardBg: 'linear-gradient(180deg, rgba(12,15,32,.72), rgba(7,9,29,.62))',
    border: '1px solid var(--card-glow, #ff40ec)',
    boxShadow: '0 0 0 1px color-mix(in srgb, var(--card-glow,#ff40ec) 22%, transparent), 0 18px 40px -18px color-mix(in srgb, var(--card-glow,#ff40ec) 40%, transparent), inset 0 1px 0 rgba(255,255,255,.05)',
    radius: 18, clip: null, overlay: null, glowMul: 1,
    rim: 'soft', tokenShape: 'pill', tokenCount: 12,
    accent: '#ff40ec', heading: '#ffffff', headingFx: null,
    titleSpacing: '-.01em',
  },
  gold: {
    key: 'gold', name: 'Gold Rush', tag: 'V3',
    cardBg: 'radial-gradient(120% 100% at 50% -10%, rgba(255,210,62,.18), transparent 55%), linear-gradient(180deg,#2a0c0a,#150406)',
    border: '2px solid #e7b948',
    boxShadow: '0 0 0 1px rgba(255,210,62,.4), 0 14px 40px -14px rgba(0,0,0,.85), 0 0 42px -12px rgba(255,180,40,.6), inset 0 1px 0 rgba(255,232,154,.35)',
    radius: 18, clip: null, overlay: 'velvet', glowMul: 1.4,
    rim: 'gold', tokenShape: 'coin', tokenCount: 9,
    accent: '#ffd23e', heading: '#ffe9a8', headingFx: 'shimmer',
    titleSpacing: '.01em',
  },
  chip: {
    key: 'chip', name: 'Chip Classic', tag: 'V5',
    cardBg: 'linear-gradient(180deg, rgba(18,22,33,.82), rgba(9,11,20,.72))',
    border: '1px solid rgba(70,81,98,.6)',
    boxShadow: '0 0 0 1px rgba(70,81,98,.35), 0 18px 40px -18px rgba(0,0,0,.7), inset 0 1px 0 rgba(255,255,255,.04)',
    radius: 18, clip: null, overlay: null, glowMul: 0.9,
    rim: 'chip', tokenShape: 'chip', tokenCount: 12,
    accent: '#2cdff6', heading: '#ffffff', headingFx: null,
    titleSpacing: '-.01em', chip: true, chipVariant: 'classic',
  },
  chipNeon: {
    key: 'chipNeon', name: 'Chip Neon', tag: 'V6',
    cardBg: 'radial-gradient(120% 90% at 82% 0%, rgba(44,223,246,.12), transparent 55%), linear-gradient(180deg,#0b0f1e,#05070f)',
    border: '1.5px solid rgba(44,223,246,.5)',
    boxShadow: '0 0 0 1px rgba(44,223,246,.3), 0 0 26px -4px rgba(44,223,246,.42), 0 0 50px -8px rgba(255,64,236,.3), inset 0 0 24px -10px rgba(44,223,246,.45)',
    radius: 18, clip: null, overlay: 'scan', glowMul: 1.7,
    rim: 'chip', tokenShape: 'chip', tokenCount: 14,
    accent: '#2cdff6', heading: '#ffffff', headingFx: 'neon',
    titleSpacing: '.015em', chip: true, chipVariant: 'neon', sweep: true,
  },
  neonFrame: {
    key: 'neonFrame', name: 'Neon Frame', tag: 'V7',
    cardBg: 'radial-gradient(120% 90% at 78% 0%, rgba(44,123,255,.16), transparent 55%), linear-gradient(160deg,#0a0e26,#070a1c)',
    border: '1px solid transparent',
    boxShadow: '0 18px 50px -20px rgba(0,0,0,.85)',
    radius: 14, clip: null, overlay: null, glowMul: 1.05,
    rim: 'chip', tokenShape: 'chip', tokenCount: 12,
    accent: '#2cdff6', heading: '#ffffff', headingFx: null,
    titleSpacing: '-.02em', chip: true, chipVariant: 'classic',
    layout: 'cta', chipEqual: true,
    frameGradient: 'linear-gradient(115deg, #ff3df0 0%, #a23bff 35%, #2c6bff 68%, #2cdff6 100%)',
    frameAnim: true,
  },
  midnight: {
    key: 'midnight', name: 'Midnight', tag: 'V8',
    cardBg: 'radial-gradient(120% 90% at 30% 0%, rgba(124,107,255,.14), transparent 55%), linear-gradient(160deg,#0d1130,#080a1e)',
    border: '1px solid transparent',
    boxShadow: '0 18px 50px -20px rgba(0,0,0,.85)',
    radius: 14, clip: null, overlay: null, glowMul: 1,
    rim: 'neon', tokenShape: 'pill', tokenCount: 12,
    accent: '#8c7bff', heading: '#ffffff', headingFx: null,
    titleSpacing: '-.02em',
    layout: 'cta',
    frameGradient: 'linear-gradient(115deg, #6a4bff 0%, #9b5bff 50%, #4bc6ff 100%)',
    frameAnim: true,
  },
  royale: {
    key: 'royale', name: 'Royale', tag: 'V9',
    cardBg: 'radial-gradient(120% 90% at 50% -10%, rgba(255,180,40,.14), transparent 55%), linear-gradient(160deg,#1a1206,#0c0a04)',
    border: '1px solid transparent',
    boxShadow: '0 18px 50px -20px rgba(0,0,0,.85)',
    radius: 14, clip: null, overlay: 'velvet', glowMul: 1.2,
    rim: 'chip', tokenShape: 'chip', tokenCount: 12,
    accent: '#ffce4a', heading: '#ffffff', headingFx: null,
    titleSpacing: '-.02em', chip: true, chipVariant: 'classic',
    layout: 'cta', chipEqual: true,
    frameGradient: 'linear-gradient(115deg, #ffe07a 0%, #ffb52e 45%, #ff7a3d 100%)',
    frameAnim: true,
  },
};
const THEME_ORDER = ['final', 'final2', 'refined', 'gold', 'chip', 'chipNeon', 'neonFrame', 'midnight', 'royale'];
window.THEMES = THEMES;
window.THEME_ORDER = THEME_ORDER;

/* ===== Card decoration overlays (scanlines / velvet / grid / sweep) ===== */
function ThemeOverlay({ theme }) {
  const layers = [];
  if (theme.overlay === 'scan') {
    layers.push(<div key="scan" style={{
      position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: 'inherit', opacity: 0.5,
      background: 'repeating-linear-gradient(0deg, rgba(44,223,246,.06) 0px, rgba(44,223,246,.06) 1px, transparent 1px, transparent 4px)',
      mixBlendMode: 'screen',
    }} />);
  }
  if (theme.overlay === 'velvet') {
    layers.push(<div key="velvet" style={{
      position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: 'inherit', opacity: 0.5,
      background: 'repeating-linear-gradient(115deg, rgba(0,0,0,.18) 0px, rgba(0,0,0,.18) 2px, transparent 2px, transparent 6px)',
    }} />);
  }
  if (theme.overlay === 'grid') {
    layers.push(<div key="grid" style={{
      position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.4,
      background: 'linear-gradient(rgba(182,255,46,.07) 1px, transparent 1px) 0 0/100% 14px, linear-gradient(90deg, rgba(182,255,46,.07) 1px, transparent 1px) 0 0/14px 100%',
    }} />);
    layers.push(<div key="hazard" style={{
      position: 'absolute', top: 0, right: 0, width: 60, height: 8, pointerEvents: 'none',
      background: 'repeating-linear-gradient(45deg,#b6ff2e 0 6px,#0c1108 6px 12px)', opacity: 0.85,
    }} />);
  }
  if (theme.sweep) {
    layers.push(<div key="sweep" style={{
      position: 'absolute', top: 0, left: 0, width: '40%', height: '100%', pointerEvents: 'none',
      background: 'linear-gradient(100deg, transparent, rgba(255,255,255,.18), transparent)',
      animation: 'neonSweep 3.4s ease-in-out infinite', mixBlendMode: 'screen',
    }} />);
  }
  return <>{layers}</>;
}
window.ThemeOverlay = ThemeOverlay;

/* ===== Token meter — progress as a row of tokens; loading token pulses ===== */
function TokenMeter({ cfg, theme, progress, ready, cooldown }) {
  const n = theme.tokenCount;
  const p = ready ? 1 : Math.max(0, Math.min(1, progress / 100));
  const filled = Math.round(p * n);
  const shape = theme.tokenShape;

  // geometry per shape
  const dims = shape === 'coin'
    ? { w: 15, h: 15, r: '50%', gap: 4 }
    : shape === 'chip'
      ? { w: 14, h: 14, r: '50%', gap: 4 }
      : shape === 'rect'
        ? { w: 9, h: 13, r: 1, gap: 3 }
        : { w: 12, h: 8, r: 5, gap: 4 }; // pill

  const tokens = Array.from({ length: n }).map((_, i) => {
    const isFilled = i < filled;
    const isLoading = i === filled && !ready && !cooldown && filled < n;
    const baseBg = isFilled
      ? `linear-gradient(135deg, ${cfg.g0}, ${cfg.g1})`
      : 'rgba(255,255,255,.08)';
    const coinFace = shape === 'coin' && isFilled
      ? `radial-gradient(circle at 35% 30%, #fff8, transparent 45%), conic-gradient(from 0deg, ${cfg.g0}, ${cfg.g1}, ${cfg.g0})`
      : baseBg;
    const isChip = shape === 'chip';
    const chipFace = isChip && isFilled
      ? `radial-gradient(circle at 36% 30%, rgba(255,255,255,.85), transparent 42%), linear-gradient(180deg, ${cfg.g0}, ${cfg.g1})`
      : 'rgb(17,20,27)';
    return (
      <span key={i} style={{
        width: dims.w, height: dims.h, borderRadius: dims.r, flexShrink: 0,
        background: isChip ? chipFace : (shape === 'coin' ? coinFace : baseBg),
        border: isChip
          ? `2px solid ${isFilled ? 'rgba(255,255,255,.55)' : 'rgb(70,81,98)'}`
          : (shape === 'coin' && isFilled ? '1px solid rgba(255,255,255,.5)' : (isFilled ? 'none' : '1px solid rgba(255,255,255,.06)')),
        boxShadow: isFilled ? `0 0 6px -1px ${cfg.glow}` : 'none',
        opacity: isFilled ? 1 : (isChip ? 0.7 : 0.55),
        animation: isLoading ? 'tokenPulse 1s ease-in-out infinite' : (isFilled ? 'tokenPour .4s ease both' : 'none'),
        '--tk-glow': cfg.glow,
        transition: 'background .4s ease',
      }} />
    );
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{
          fontSize: 9, letterSpacing: '.12em', textTransform: 'uppercase', fontWeight: 700,
          color: ready ? 'var(--gold)' : cooldown ? 'var(--ink-mute)' : theme.accent,
          fontFamily: theme.headingFx === 'mono' ? 'ui-monospace, monospace' : 'inherit',
        }}>
          {ready ? 'Charged' : cooldown ? 'Recharging' : 'Loading'}
        </span>
        {!ready && !cooldown && (
          <span style={{ display: 'inline-flex', gap: 3, alignItems: 'center' }}>
            {[0, 1, 2].map((d) => (
              <span key={d} style={{
                width: 3, height: 3, borderRadius: '50%', background: theme.accent,
                animation: 'loadingDot 1.1s ease-in-out infinite', animationDelay: `${d * 0.18}s`,
              }} />
            ))}
          </span>
        )}
      </div>
      <div style={{ display: 'flex', gap: dims.gap, alignItems: 'center', flexWrap: 'nowrap' }}>
        {tokens}
      </div>
    </div>
  );
}
window.TokenMeter = TokenMeter;
