/* spin.jsx — Full-screen prize-wheel spin experience */
const { useState: useStateS, useEffect: useEffectS, useRef: useRefS } = React;

const VAULT_BG = 'assets/vault-bg.png';

/* 12 prize segments */
const PRIZES = [
  { t: 'x2',  s: 'multiplier', w: 14 },
  { t: '5 FS', s: 'free spins', w: 12 },
  { t: 'x5',  s: 'multiplier', w: 8 },
  { t: 'x1',  s: 'multiplier', w: 16 },
  { t: 'x10', s: 'mega win',  w: 4 },
  { t: 'x3',  s: 'multiplier', w: 11 },
  { t: 'x2',  s: 'multiplier', w: 14 },
  { t: 'JACKPOT', s: 'top prize', w: 1.5 },
  { t: 'x1',  s: 'multiplier', w: 16 },
  { t: '10 FS', s: 'free spins', w: 9 },
  { t: 'x5',  s: 'multiplier', w: 8 },
  { t: 'x3',  s: 'multiplier', w: 11 },
];
const SEG = PRIZES.length;
const SEG_DEG = 360 / SEG;

function polar(cx, cy, r, deg) {
  const a = (deg - 90) * Math.PI / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}
function wedgePath(cx, cy, r, a1, a2) {
  const [x1, y1] = polar(cx, cy, r, a1);
  const [x2, y2] = polar(cx, cy, r, a2);
  const large = a2 - a1 > 180 ? 1 : 0;
  return `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large} 1 ${x2},${y2} Z`;
}

function pickPrize() {
  const total = PRIZES.reduce((s, p) => s + p.w, 0);
  let r = Math.random() * total;
  for (let i = 0; i < SEG; i++) { r -= PRIZES[i].w; if (r <= 0) return i; }
  return 0;
}

/* The wheel graphic */
function PrizeWheel({ cfg, rotation, spinning }) {
  const segColors = [cfg.g0, '#10131f', cfg.g1, '#10131f', '#ffcf3a', '#10131f'];
  return (
    <div style={{ position: 'relative', width: '100%', aspectRatio: '1', filter: 'drop-shadow(0 24px 60px rgba(0,0,0,.6))' }}>
      {/* glow halo */}
      <div style={{
        position: 'absolute', inset: '-8%', borderRadius: '50%',
        background: `radial-gradient(circle, ${cfg.glow} 0%, transparent 60%)`,
        opacity: spinning ? 0.9 : 0.55, transition: 'opacity .6s ease',
      }} />
      <svg viewBox="0 0 200 200" style={{ position: 'relative', width: '100%', display: 'block' }}>
        <defs>
          <radialGradient id="rim" cx="0.5" cy="0.4" r="0.6">
            <stop offset="0.78" stopColor="#5a4413" />
            <stop offset="0.88" stopColor="#ffe07a" />
            <stop offset="0.95" stopColor="#b8841f" />
            <stop offset="1" stopColor="#3a2a08" />
          </radialGradient>
          <radialGradient id="hub" cx="0.5" cy="0.4" r="0.7">
            <stop offset="0" stopColor="#ffe89a" />
            <stop offset="0.5" stopColor="#f2b531" />
            <stop offset="1" stopColor="#7a5512" />
          </radialGradient>
        </defs>

        {/* outer gold rim */}
        <circle cx="100" cy="100" r="99" fill="url(#rim)" />
        {/* rim studs */}
        {Array.from({ length: 24 }).map((_, i) => {
          const [x, y] = polar(100, 100, 95.5, i * 15);
          return <circle key={i} cx={x} cy={y} r="1.6" fill="#fff7d8" opacity="0.9" />;
        })}

        {/* rotating group */}
        <g style={{
          transformOrigin: '100px 100px',
          transform: `rotate(${rotation}deg)`,
          transition: spinning ? 'transform 4.6s cubic-bezier(.13,.62,.16,1)' : 'none',
        }}>
          <circle cx="100" cy="100" r="88" fill="#0a0d16" />
          {PRIZES.map((p, i) => {
            const a1 = i * SEG_DEG, a2 = (i + 1) * SEG_DEG;
            const mid = a1 + SEG_DEG / 2;
            const [tx, ty] = polar(100, 100, 60, mid);
            const fill = segColors[i % segColors.length];
            const dark = fill === '#10131f';
            return (
              <g key={i}>
                <path d={wedgePath(100, 100, 88, a1, a2)} fill={fill} stroke="rgba(0,0,0,.35)" strokeWidth="0.6" />
                <g transform={`translate(${tx},${ty}) rotate(${mid})`}>
                  <text textAnchor="middle" dominantBaseline="middle" y="-2"
                    fontFamily="Unbounded, sans-serif" fontWeight="700"
                    fontSize={p.t === 'JACKPOT' ? 6 : 11}
                    fill={dark ? '#fff' : (fill === '#ffcf3a' ? '#3a2a08' : '#07091d')}>{p.t}</text>
                  <text textAnchor="middle" dominantBaseline="middle" y="7"
                    fontFamily="Hanken Grotesk, sans-serif" fontSize="3.4" fontWeight="600"
                    fill={dark ? 'rgba(255,255,255,.6)' : 'rgba(7,9,29,.6)'} letterSpacing="0.3">{p.s.toUpperCase()}</text>
                </g>
              </g>
            );
          })}
          {/* spokes */}
          {Array.from({ length: SEG }).map((_, i) => {
            const [x, y] = polar(100, 100, 88, i * SEG_DEG);
            return <line key={i} x1="100" y1="100" x2={x} y2={y} stroke="rgba(255,215,80,.25)" strokeWidth="0.6" />;
          })}
        </g>

        {/* hub */}
        <circle cx="100" cy="100" r="15" fill="url(#hub)" stroke="#5a3f10" strokeWidth="1.5" />
        <circle cx="100" cy="100" r="6" fill="#3a2a08" />
        <circle cx="96" cy="96" r="2.4" fill="#fff7d8" opacity="0.8" />
      </svg>

      {/* pointer (top) */}
      <div style={{
        position: 'absolute', top: '-3%', left: '50%', transform: 'translateX(-50%)',
        width: 0, height: 0, borderLeft: '13px solid transparent', borderRight: '13px solid transparent',
        borderTop: '26px solid #ffd23e', zIndex: 5,
        filter: 'drop-shadow(0 3px 4px rgba(0,0,0,.5))',
      }} />
      <div style={{
        position: 'absolute', top: '-7%', left: '50%', transform: 'translateX(-50%)',
        width: 16, height: 16, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%,#fff,#f2b531)',
        boxShadow: '0 0 8px rgba(255,210,62,.8)', zIndex: 6,
      }} />
    </div>
  );
}

/* ===== Spin overlay ===== */
function SpinOverlay({ open, cfgKey, onClose, intensity }) {
  const cfg = (window.WHEELS || {})[cfgKey] || { g0: '#06D753', g1: '#0084CF', glow: 'rgba(44,223,246,.5)', label: 'Sportsbook' };
  const [phase, setPhase] = useStateS('idle'); // idle -> rising -> spinning -> won
  const [rotation, setRotation] = useStateS(0);
  const [prizeIdx, setPrizeIdx] = useStateS(null);
  const timers = useRefS([]);

  const clearAll = () => { timers.current.forEach(clearTimeout); timers.current = []; };

  useEffectS(() => {
    if (open) {
      setPhase('rising'); setRotation(0); setPrizeIdx(null);
      const t1 = setTimeout(() => startSpin(), 1300);
      timers.current.push(t1);
    } else {
      clearAll(); setPhase('idle');
    }
    return clearAll;
    // eslint-disable-next-line
  }, [open]);

  const startSpin = () => {
    const idx = pickPrize();
    setPrizeIdx(idx);
    const turns = 6 + Math.floor(Math.random() * 2);
    const jitter = (Math.random() * 2 - 1) * (SEG_DEG * 0.24);
    // bring segment idx (center at idx*SEG_DEG) to the top pointer
    const target = turns * 360 + (360 - (idx * SEG_DEG + SEG_DEG / 2)) + jitter;
    setPhase('spinning');
    setTimeout(() => setRotation(target), 50);
    const t2 = setTimeout(() => {
      setPhase('won');
      fireConfetti(intensity);
    }, 4700);
    timers.current.push(t2);
  };

  const fireConfetti = (inten) => {
    if (!window.confetti) return;
    const dur = inten === 'high' ? 2600 : 1800;
    const end = Date.now() + dur;
    const colors = [cfg.g0, cfg.g1, '#ffd23e', '#ffffff'];
    (function frame() {
      window.confetti({ particleCount: 5, angle: 60, spread: 70, origin: { x: 0, y: 0.7 }, colors, zIndex: 100050 });
      window.confetti({ particleCount: 5, angle: 120, spread: 70, origin: { x: 1, y: 0.7 }, colors, zIndex: 100050 });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
    window.confetti({ particleCount: 120, spread: 100, startVelocity: 45, origin: { y: 0.5 }, colors, zIndex: 100050 });
  };

  if (!open && phase === 'idle') return null;
  if (typeof window !== 'undefined') window.__spinPhase = phase;
  const prize = prizeIdx != null ? PRIZES[prizeIdx] : null;

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 100000, overflow: 'hidden' }}>
      {/* dimmed vault backdrop */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(180deg, rgba(4,5,15,.82), rgba(4,5,15,.92)), url(${VAULT_BG}) center/cover`,
        filter: 'blur(2px)', transform: 'scale(1.05)',
      }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(70% 50% at 50% 42%, transparent, rgba(4,5,15,.75))' }} />

      {/* close */}
      {phase !== 'won' && (
        <button onClick={onClose} style={{
          position: 'absolute', top: 16, right: 16, zIndex: 6, width: 38, height: 38, borderRadius: '50%',
          background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.12)', color: '#fff', fontSize: 18,
        }}>✕</button>
      )}

      {/* heading */}
      <div style={{
        position: 'absolute', top: 'max(34px, 7%)', left: 0, right: 0, textAlign: 'center', padding: '0 24px',
        opacity: phase === 'won' ? 0 : 1, transition: 'opacity .4s ease',
      }}>
        <div style={{ fontSize: 12, letterSpacing: '.22em', color: cfg.g1, textTransform: 'uppercase', fontWeight: 700 }}>{cfg.label} reward</div>
        <div className="u" style={{ fontSize: 24, fontWeight: 800, marginTop: 6, textShadow: '0 0 20px rgba(0,0,0,.6)' }}>
          {phase === 'rising' ? 'Get ready…' : 'Spinning!'}
        </div>
      </div>

      {/* wheel */}
      <div style={{
        position: 'absolute', left: '50%', bottom: phase === 'won' ? '50%' : '12%',
        transform: phase === 'won' ? 'translate(-50%, 50%) scale(.62)' : 'translateX(-50%)',
        width: 'min(86vw, 560px)',
        animation: phase === 'rising' ? 'wheelRise 1.3s cubic-bezier(.16,1,.3,1) both' : 'none',
        transition: 'bottom .6s ease, transform .6s ease',
        opacity: phase === 'won' ? 0.5 : 1,
      }}>
        <PrizeWheel cfg={cfg} rotation={rotation} spinning={phase === 'spinning'} />
      </div>

      {/* reward card */}
      {phase === 'won' && prize && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
        }}>
          <div style={{
            width: '100%', maxWidth: 360, borderRadius: 22, padding: '30px 24px 24px', textAlign: 'center',
            background: 'linear-gradient(180deg, rgba(20,24,46,.96), rgba(8,10,26,.98))',
            border: '1px solid rgba(255,210,62,.5)',
            boxShadow: '0 0 0 1px rgba(255,210,62,.15), 0 30px 80px -20px rgba(0,0,0,.8), 0 0 60px -10px rgba(255,210,62,.4)',
            animation: 'risePop .5s cubic-bezier(.16,1,.3,1) both',
          }}>
            <div style={{ fontSize: 12, letterSpacing: '.24em', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 700 }}>You won</div>
            <div className="u" style={{
              fontSize: prize.t === 'JACKPOT' ? 40 : 56, fontWeight: 800, lineHeight: 1, margin: '12px 0 6px',
              background: 'linear-gradient(180deg,#fff8dd,#ffd23e 55%,#f2a012)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 4px 14px rgba(255,210,62,.45))',
            }}>{prize.t}</div>
            <div style={{ fontSize: 14, color: 'var(--ink-dim)', textTransform: 'capitalize' }}>{prize.s}</div>
            <div style={{ fontSize: 13, color: 'var(--ink-mute)', marginTop: 14, lineHeight: 1.5 }}>
              Credited instantly to your {cfg.label.toLowerCase()} balance.
            </div>
            <button onClick={onClose} style={{
              marginTop: 22, width: '100%', padding: '14px', borderRadius: 12, fontWeight: 800, fontSize: 15, color: '#07091d',
              background: 'linear-gradient(90deg,#ffe07a,#ffd23e,#f2a012)',
              boxShadow: '0 12px 30px -10px rgba(255,210,62,.6)',
            }}>Collect reward</button>
          </div>
        </div>
      )}

      <style>{`@keyframes wheelRise{from{transform:translateX(-50%) translateY(60vh);opacity:0}to{transform:translateX(-50%) translateY(0);opacity:1}}`}</style>
    </div>
  );
}
window.SpinOverlay = SpinOverlay;
