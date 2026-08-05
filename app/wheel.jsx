/* wheel.jsx — Progress ring + swipeable Lucky Wheel widget (theme-aware) */
const { useState, useRef, useEffect, useCallback } = React;

/* ----- Wheel configs (identity colors, constant across themes) ----- */
const WHEELS = {
  sportsbook: {
    key: 'sportsbook', label: 'Sportsbook',
    g0: '#06D753', g1: '#0084CF', glow: 'rgba(44,223,246,.55)', accent: '#2cdff6'
  },
  gambling: {
    key: 'gambling', label: 'Gambling',
    g0: '#C13BFF', g1: '#EE8427', glow: 'rgba(193,59,255,.5)', accent: '#c13bff'
  }
};
const ORDER = ['sportsbook', 'gambling'];

/* ----- Countdown hook — fixed target set once on mount, ticks every second ----- */
function useCountdown(days) {
  const [target] = useState(() => Date.now() + days * 24 * 60 * 60 * 1000);
  const [left, setLeft] = useState(() => Math.max(0, target - Date.now()));
  useEffect(() => {
    const id = setInterval(() => setLeft(Math.max(0, target - Date.now())), 1000);
    return () => clearInterval(id);
  }, [target]);
  const totalSec = Math.floor(left / 1000);
  return {
    d: Math.floor(totalSec / 86400),
    h: Math.floor(totalSec % 86400 / 3600),
    m: Math.floor(totalSec % 3600 / 60),
    s: totalSec % 60
  };
}

/* ----- Small "Ends in ..." countdown badge ----- */
function CountdownBadge({ theme }) {
  const { d, h, m, s } = useCountdown(theme.countdownDays);
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 5,
      fontSize: 10.5, fontWeight: 700, letterSpacing: '.02em', color: theme.accent
    }}>
      <span style={{ fontSize: 11 }}>⏳</span>
      <span>
        Ends in {d}d {String(h).padStart(2, '0')}h {String(m).padStart(2, '0')}m {String(s).padStart(2, '0')}s
      </span>
    </div>
  );
}

/* ----- Poker-chip progress loader (V5/V6) — faithful to the Figma token ----- */
function ChipRing({ cfg, theme, progress, ready, cooldown, size = 128, intensity = 'mid', snap = false }) {
  const neon = theme.chipVariant === 'neon';
  const R = 68,C = 2 * Math.PI * R;
  const p = ready ? 1 : Math.max(0, Math.min(1, progress / 100));
  const off = C * (1 - p);
  const uid = `${cfg.key}-${theme.key}`;
  const arc0 = ready ? '#FFE15A' : cfg.g0;
  const arc1 = ready ? '#FF9D2E' : cfg.g1;
  const glowAmt = (intensity === 'high' ? 1.4 : intensity === 'low' ? 0.6 : 1) * (theme.glowMul || 1);

  // leading loading dot — start at top (-90deg) and sweep clockwise
  const charging = !ready && !cooldown;
  const showDot = charging && p > 0.02 && p < 0.985;
  const ang = -Math.PI / 2 + p * 2 * Math.PI;
  const dx = 100 + R * Math.cos(ang),dy = 100 + R * Math.sin(ang);

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      {neon &&
      <div style={{
        position: 'absolute', inset: -size * 0.05, borderRadius: '50%',
        background: `conic-gradient(from 0deg, ${cfg.g0}, ${cfg.g1}, ${cfg.g0})`,
        filter: `blur(${size * 0.07}px)`, opacity: ready ? 0.75 : 0.4,
        animation: 'spinSlow 9s linear infinite', pointerEvents: 'none'
      }} />
      }
      <img src={window.LW_BEZEL || 'assets/token-bezel.png'} alt="" draggable="false" style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
        filter: neon ? 'saturate(1.15) brightness(1.06) drop-shadow(0 0 6px rgba(44,223,246,.4))' : 'none'
      }} />
      <svg viewBox="0 0 200 200" width={size} height={size} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        <defs>
          <linearGradient id={`cg-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={arc0} />
            <stop offset="0.5" stopColor={arc1} />
            <stop offset="1" stopColor={arc0} />
            <animateTransform attributeName="gradientTransform" type="rotate"
            from="0 0.5 0.5" to="360 0.5 0.5" dur="7s" repeatCount="indefinite" />
          </linearGradient>
          <filter id={`cf-${uid}`} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation={(ready ? 3.4 : 2.3) * glowAmt} result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {/* dark inner well */}
        <circle cx="100" cy="100" r="74" fill="rgb(17,20,27)" />
        <circle cx="100" cy="100" r="74" fill="none" stroke="rgba(255,255,255,.05)" strokeWidth="1" />
        {/* track */}
        <circle cx="100" cy="100" r={R} fill="none" stroke="rgb(70,81,98)" strokeWidth="6" />
        {/* progress arc */}
        <circle cx="100" cy="100" r={R} fill="none"
        stroke={`url(#cg-${uid})`} strokeWidth="6" strokeLinecap="round"
        strokeDasharray={C} strokeDashoffset={off}
        transform="rotate(-90 100 100)"
        filter={neon ? `url(#cf-${uid})` : undefined}
        style={{ transition: snap ? 'none' : 'stroke-dashoffset .9s cubic-bezier(.22,1,.36,1)' }} />
        {showDot &&
        <g>
            <circle cx={dx} cy={dy} r="7" fill={arc1} opacity="0.35"
          style={{ transformOrigin: `${dx}px ${dy}px`, animation: 'loadingDot 1s ease-in-out infinite' }} />
            <circle cx={dx} cy={dy} r="3.4" fill="#fff" style={{ filter: `drop-shadow(0 0 5px ${arc1})` }} />
          </g>
        }
      </svg>
    </div>);

}
window.ChipRing = ChipRing;

/* ----- Progress ring (SVG, parametric, theme-aware) ----- */
function ProgressRing({ cfg, theme, progress, ready, cooldown, size = 128, intensity = 'mid', snap = false }) {
  if (theme.chip) {
    return <ChipRing cfg={cfg} theme={theme} progress={progress} ready={ready} cooldown={cooldown} size={size} intensity={intensity} snap={snap} />;
  }
  const R = 86,C = 2 * Math.PI * R;
  const p = ready ? 1 : Math.max(0, Math.min(1, progress / 100));
  const off = C * (1 - p);
  const uid = `${cfg.key}-${theme.key}`;
  const gid = `grad-${uid}`;
  const ticks = 48;
  const glowAmt = (intensity === 'high' ? 1.4 : intensity === 'low' ? 0.5 : 1) * (theme.glowMul || 1);

  const rim = theme.rim;
  const litColor = ready ? '#FFD23E' : rim === 'gold' ? '#ffd23e' : rim === 'cyber' ? '#b6ff2e' : cfg.accent;
  const outerFill = rim === 'gold' ? '#1a0d09' : rim === 'cyber' ? '#0a0f06' : '#0c0f1a';
  const innerFill = rim === 'gold' ? '#140805' : rim === 'cyber' ? '#070a05' : '#0a0d16';

  // leading "loading zone" dot (same coordinate frame as the arc group)
  const showDot = !ready && !cooldown && p > 0.02 && p < 0.985;
  const dotRad = p * 2 * Math.PI;
  const dx = 100 + R * Math.cos(dotRad),dy = 100 + R * Math.sin(dotRad);

  return (
    <svg viewBox="0 0 200 200" width={size} height={size} style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={ready ? '#FFE15A' : cfg.g0} />
          <stop offset="0.5" stopColor={ready ? '#FF9D2E' : cfg.g1} />
          <stop offset="1" stopColor={ready ? '#FFE15A' : cfg.g0} />
          <animateTransform attributeName="gradientTransform" type="rotate"
          from="0 0.5 0.5" to="360 0.5 0.5" dur="7s" repeatCount="indefinite" />
        </linearGradient>
        <radialGradient id={`gold-${uid}`} cx="0.5" cy="0.38" r="0.62">
          <stop offset="0.74" stopColor="#5a4413" />
          <stop offset="0.85" stopColor="#ffe07a" />
          <stop offset="0.93" stopColor="#b8841f" />
          <stop offset="1" stopColor="#3a2a08" />
        </radialGradient>
        <filter id={`f-${uid}`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation={(ready ? 4.2 : 3) * glowAmt} result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* outer body / rim */}
      {rim === 'gold' ?
      <>
          <circle cx="100" cy="100" r="98" fill={`url(#gold-${uid})`} />
          <circle cx="100" cy="100" r="90" fill={outerFill} />
        </> :
      rim === 'neon' ?
      <>
          <circle cx="100" cy="100" r="96" fill={outerFill} />
          <circle cx="100" cy="100" r="96" fill="none" stroke={cfg.accent} strokeWidth="1.4"
        style={{ filter: `drop-shadow(0 0 5px ${cfg.accent})` }} />
        </> :
      rim === 'cyber' ?
      <>
          <circle cx="100" cy="100" r="96" fill={outerFill} />
          <circle cx="100" cy="100" r="96" fill="none" stroke="#b6ff2e" strokeWidth="1.4" strokeDasharray="3 4" opacity="0.8" />
        </> :

      <>
          <circle cx="100" cy="100" r="96" fill={outerFill} />
          <circle cx="100" cy="100" r="96" fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="1" />
        </>
      }

      {/* tick ring */}
      <g opacity={ready ? 0.95 : 0.55}>
        {Array.from({ length: ticks }).map((_, i) => {
          const a = i / ticks * Math.PI * 2;
          const lit = i / ticks <= p;
          const r1 = 92,r2 = 96.5;
          return (
            <line key={i}
            x1={100 + r1 * Math.cos(a)} y1={100 + r1 * Math.sin(a)}
            x2={100 + r2 * Math.cos(a)} y2={100 + r2 * Math.sin(a)}
            stroke={lit ? litColor : 'rgba(255,255,255,.12)'}
            strokeWidth="2" strokeLinecap="round" />);

        })}
      </g>

      {/* track */}
      <circle cx="100" cy="100" r={R} fill="none" stroke={rim === 'gold' ? '#3a2410' : '#2a3140'} strokeWidth="12" />
      {/* progress arc */}
      <circle cx="100" cy="100" r={R} fill="none"
      stroke={`url(#${gid})`} strokeWidth="12" strokeLinecap="round"
      strokeDasharray={C} strokeDashoffset={off}
      transform="rotate(-90 100 100)"
      filter={`url(#f-${uid})`}
      style={{ transition: snap ? 'none' : 'stroke-dashoffset .9s cubic-bezier(.22,1,.36,1)' }} />

      {/* leading loading-zone pulse dot — shares the arc's rotate(-90) frame */}
      {showDot &&
      <g transform="rotate(-90 100 100)">
          <circle cx={dx} cy={dy} r="9" fill={cfg.g1} opacity="0.35"
        style={{ transformOrigin: `${dx}px ${dy}px`, animation: 'loadingDot 1s ease-in-out infinite' }} />
          <circle cx={dx} cy={dy} r="4.2" fill="#fff"
        style={{ filter: `drop-shadow(0 0 6px ${cfg.g1})` }} />
        </g>
      }

      {/* inner well */}
      <circle cx="100" cy="100" r="70" fill={innerFill} />
      <circle cx="100" cy="100" r="70" fill="none" stroke="rgba(255,255,255,.05)" strokeWidth="1" />
    </svg>);

}
window.ProgressRing = ProgressRing;

/* ----- A single wheel token (ring + centre label) ----- */
function WheelToken({ cfg, theme, progress, ready, cooldown, front, size, intensity, onClick }) {
  const dim = front ? 1 : 0.5;
  const readyGlow = 'rgba(255,210,62,.55)';

  // Per-version "ready to spin" motion (RNG fun). V1 Refined + V5 Chip Classic
  // are intentionally left as-is (glow pulse only).
  const READY_MOTION = {
    final: 'chipRock 1.7s ease-in-out infinite',       // Final — Gold Rush loading animation
    final2: 'chipRock 1.7s ease-in-out infinite',      // Final v2 — same Gold Rush feel
    gold: 'chipRock 1.7s ease-in-out infinite',       // V3 — rocks like the header
    chipNeon: 'chipPulse 1.25s ease-in-out infinite', // V6 — scale pulse
    neonFrame: 'chipBob 1.2s ease-in-out infinite',   // V7 — bobs up/down
    midnight: 'chipWobble 1.5s ease-in-out infinite', // V8 — jelly wobble
    royale: 'chipTilt 2.4s ease-in-out infinite'      // V9 — 3D tilt sway
  };
  const readyMotion = ready && front ? READY_MOTION[theme.key] : null;

  // Reveal animation: when this slot becomes front OR the wheel shown in the
  // front slot changes identity (swipe/switch), sweep the arc + percent up
  // from 0 to its real progress with an eased count-up — every time.
  const [disp, setDisp] = useState(front ? 0 : progress);
  const [snap, setSnap] = useState(false);
  const lastReveal = useRef(null); // cfg.key last revealed while front
  const prevProg = useRef(progress); // last progress value we settled on
  const raf = useRef(0);

  // shared eased count-up tween from `a` to `b` driving both arc + percent
  const runTween = useCallback((a, b, dur) => {
    cancelAnimationFrame(raf.current);
    setSnap(true);
    const t0 = performance.now();
    const ease = (x) => 1 - Math.pow(1 - x, 3);
    const tick = (now) => {
      const k = Math.min(1, (now - t0) / dur);
      setDisp(a + (b - a) * ease(k));
      if (k < 1) raf.current = requestAnimationFrame(tick);else
      setSnap(false);
    };
    setDisp(a);
    raf.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    cancelAnimationFrame(raf.current);
    const isNewFront = front && lastReveal.current !== cfg.key;
    if (isNewFront && !ready && !cooldown) {
      // full reveal: sweep 0 -> progress when this wheel comes to the front
      runTween(0, progress, 900);
      lastReveal.current = cfg.key;
    } else if (front && !ready && !cooldown && progress !== prevProg.current) {
      // progress changed while already in front (e.g. +15% bet): count up smoothly
      runTween(prevProg.current, progress, 650);
    } else {
      setSnap(false);setDisp(progress); // stay in sync while front, or when in back
      if (!front) lastReveal.current = null; // re-arm so it replays next time it fronts
    }
    prevProg.current = progress;
    return () => cancelAnimationFrame(raf.current);
  }, [front, cfg.key, progress, ready, cooldown, runTween]);

  return (
    <div
      onClick={onClick}
      style={{
        position: 'relative', width: size, height: size,
        display: 'grid', placeItems: 'center', cursor: 'pointer', perspective: 600,
        filter: front ?
        `drop-shadow(0 8px 22px rgba(0,0,0,.55)) drop-shadow(0 0 ${(ready ? 26 : 16) * (theme.glowMul || 1)}px ${ready ? readyGlow : cfg.glow})` :
        'drop-shadow(0 6px 14px rgba(0,0,0,.5))',
        opacity: dim,
        animation: ready && front ? 'pulseGlow 1.8s ease-in-out infinite' : 'none',
        transition: 'filter .4s ease, opacity .5s ease'
      }}>

      <div style={{
        position: 'relative', width: size, height: size, display: 'grid', placeItems: 'center',
        transformStyle: 'preserve-3d',
        animation: readyMotion ? `${readyMotion}` : 'none'
      }}>
        <ProgressRing cfg={cfg} theme={theme} progress={disp} ready={ready} cooldown={cooldown} size={size} intensity={intensity} snap={snap} />
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', textAlign: 'center', pointerEvents: 'none'
        }}>
          {cooldown ?
          <>
              <span style={{ fontSize: size * 0.072, color: 'var(--ink-mute)', letterSpacing: '.02em' }}>Unlocked in</span>
              <span className="u" style={{ fontSize: size * 0.16, fontWeight: 700, color: '#fff', marginTop: 2 }}>{cooldown}</span>
            </> :
          ready ?
          <>
              <span style={{ fontSize: size * 0.082, color: 'var(--yellow)', fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase' }}>Ready to</span>
              <span className="u" style={{ fontSize: size * 0.2, fontWeight: 800, color: 'var(--yellow)', lineHeight: 1, marginTop: 2, textShadow: '0 0 14px rgba(255,246,0,.6)' }}>SPIN</span>
            </> :

          <>
              <span style={{ fontSize: size * 0.082, color: 'var(--ink-dim)', fontWeight: 500 }}>{cfg.label}</span>
              <span className="u" style={{ fontSize: size * (theme.chip ? 0.16 : 0.205), fontWeight: 700, color: '#fff', lineHeight: 1, marginTop: 1 }}>{Math.round(disp)}%</span>
            </>
          }
        </div>
      </div>
    </div>);

}

/* ----- Swipe dots indicator ----- */
function SwipeDots({ active, theme }) {
  return (
    <div style={{ display: 'flex', gap: 5, justifyContent: 'flex-start' }}>
      {ORDER.map((k) =>
      <span key={k} style={{
        width: active === k ? 16 : 6, height: 6, borderRadius: 3,
        background: active === k ? theme.accent : 'rgba(255,255,255,.28)',
        boxShadow: active === k ? `0 0 6px ${theme.accent}` : 'none',
        transition: 'all .35s cubic-bezier(.22,1,.36,1)'
      }} />
      )}
    </div>);

}

/* ===== The Lucky Wheel widget card ===== */
function LuckyWheelWidget({ state, theme, activeKey, setActiveKey, onAddProgress, onReset, onSpin, onInfo, intensity, showHint }) {
  const drag = useRef({ x: 0, on: false, moved: 0 });
  const [dx, setDx] = useState(0);

  const idx = ORDER.indexOf(activeKey);
  const otherKey = ORDER[(idx + 1) % ORDER.length];
  const switchTo = useCallback((k) => {if (k !== activeKey) setActiveKey(k);}, [activeKey, setActiveKey]);

  const onDown = (e) => {const x = e.touches ? e.touches[0].clientX : e.clientX;drag.current = { x, on: true, moved: 0 };};
  const onMove = (e) => {
    if (!drag.current.on) return;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const d = x - drag.current.x;drag.current.moved = d;
    setDx(Math.max(-60, Math.min(60, d)));
  };
  const onUp = () => {
    if (!drag.current.on) return;
    const d = drag.current.moved;drag.current.on = false;setDx(0);
    if (Math.abs(d) > 36) switchTo(otherKey);
  };

  const cfgActive = WHEELS[activeKey];
  const cfgBack = WHEELS[otherKey];
  const sActive = state[activeKey];
  const sBack = state[otherKey];
  const equal = theme.chipEqual || theme.layout === 'cta';
  const cta = theme.layout === 'cta';
  const frame = theme.frameGradient;
  const FRONT = theme.frontSize != null ? theme.frontSize : cta ? 180 : equal ? 122 : 138,BACK = theme.backSize != null ? theme.backSize : cta ? 126 : equal ? 85 : 96;
  const mono = theme.headingFx === 'mono';

  const headingStyle = { fontSize: 17, fontWeight: 700, letterSpacing: theme.titleSpacing, color: theme.heading };
  if (theme.headingFx === 'neon') headingStyle.textShadow = `0 0 10px ${theme.accent}, 0 0 20px ${theme.accent}66`;
  if (theme.headingFx === 'shimmer') Object.assign(headingStyle, {
    background: 'linear-gradient(90deg,#7a5512,#ffe89a 40%,#fff 50%,#ffe89a 60%,#7a5512)',
    backgroundSize: '200% 100%', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
    animation: 'goldShimmer 3.2s linear infinite'
  });
  if (mono) {headingStyle.fontFamily = 'ui-monospace, monospace';headingStyle.textTransform = 'uppercase';}

  const baseSize = cta ? 180 : FRONT;
  const backRight = cta ? 90 : 90;
  const backScale = +(BACK / baseSize).toFixed(3); // shrink the unfocused token

  const rightCluster =
  <div
    className="no-select"
    onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
    onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onUp}
    style={cta ? {
      position: 'absolute', right: -12, top: '50%', transform: 'translateY(-50%)',
      width: 180, height: 180, zIndex: 8, touchAction: 'pan-y',
      filter: 'drop-shadow(0 12px 24px rgba(0,0,0,.55))'
    } : {
      position: 'relative', width: theme.bigWheels ? 210 : 188, height: theme.bigWheels ? 188 : 170, flexShrink: 0, touchAction: 'pan-y', alignSelf: 'center'
    }}>
      {ORDER.map((k) => {
        const isA = k === activeKey;
        const w = WHEELS[k];const s = state[k];
        return (
          <div key={k} style={{
            position: 'absolute', top: '50%', right: isA ? 0 : backRight,
            transformOrigin: 'center center',
            transform: `translateY(-50%) translateX(${dx * (isA ? 1 : 0.4)}px) scale(${isA ? 1 : backScale}) rotate(${isA ? dx * 0.05 : 0}deg)`,
            transition: drag.current.on ? 'none' : 'right .55s cubic-bezier(.22,1,.36,1), transform .55s cubic-bezier(.22,1,.36,1), opacity .55s ease',
            zIndex: isA ? 3 : 1, opacity: isA ? 1 : 0.92
          }}>
            <WheelToken cfg={w} theme={theme} progress={s.progress} ready={s.ready} cooldown={s.cooldown}
            front={isA} size={baseSize} intensity={intensity}
            onClick={() => {if (isA) {if (s.ready && !s.cooldown) onSpin(k);} else switchTo(k);}} />
          </div>);

      })}
    </div>;


  return (
    <div style={{ position: 'relative', padding: '2px' }}>
      <div style={{ position: 'relative' }}>
      <div style={{ ...{ ...{
              position: 'relative',
              background: theme.cardBg,
              backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
              border: frame ? '1px solid transparent' : theme.border, borderImage: theme.borderImage || undefined,
              boxShadow: frame ? `0 18px 50px -20px rgba(0,0,0,.85), 0 0 28px -10px ${theme.accent}` : theme.boxShadow,
              borderRadius: theme.radius, clipPath: theme.clip || undefined,
              padding: cta ? '18px 16px' : '16px 14px', display: 'flex', alignItems: 'stretch', gap: 8,
              minHeight: 188, overflow: 'hidden',
              animation: theme.headingFx === 'neon' ? 'neonFlicker 6s linear infinite' : 'none'
            }, borderRadius: "0px", width: "416px", height: cta ? "auto" : "204px", minHeight: cta ? 0 : 188, gap: "0px" }, height: cta ? "auto" : theme.bigWheels ? "196px" : "160px", alignItems: "center", padding: "24px 16px 16px", margin: "8px 0px 24px", width: "416px" }}>
        <ThemeOverlay theme={theme} />

        {/* animated gradient border (screenshot frame) */}
        {frame &&
          <div style={{
            position: 'absolute', inset: 0, borderRadius: 'inherit', padding: 2, pointerEvents: 'none', zIndex: 6,
            background: frame, backgroundSize: '220% 220%',
            animation: theme.frameAnim ? 'frameFlow 7s ease infinite' : 'none',
            WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
            WebkitMaskComposite: 'xor', maskComposite: 'exclude'
          }} />
          }

        {/* accent wash following active wheel */}
        <div style={{
            position: 'absolute', right: -40, top: -30, width: 220, height: 220, borderRadius: '50%',
            background: `radial-gradient(circle, ${cfgActive.glow} 0%, transparent 62%)`,
            opacity: intensity === 'low' ? 0.18 : 0.34 * (theme.glowMul || 1), pointerEvents: 'none',
            transition: 'background .5s ease'
          }} />

        {/* LEFT */}
        {cta ?
          <div style={{ flex: '0 0 auto', position: 'relative', zIndex: 12, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: "flex-start" }}>
          <div style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: 26, fontWeight: 800, color: '#fff', letterSpacing: '-.02em', lineHeight: 1.02, whiteSpace: 'nowrap' }}>Lucky wheel</div>
          <div style={{ fontSize: 12.5, color: 'var(--ink-dim)', lineHeight: 1.4, marginTop: 7, maxWidth: 172 }}>
            Swipe left or right to track the progress of wheel
          </div>
          {theme.countdownDays && <CountdownBadge theme={theme} />}
          <button onClick={onInfo} style={{
              marginTop: 16, alignSelf: 'flex-start', padding: '12px 18px', borderRadius: 0,
              fontSize: 13.5, fontWeight: 800, color: '#07091d', whiteSpace: 'nowrap',
              fontFamily: "'Hanken Grotesk',sans-serif",
              background: 'linear-gradient(90deg,#0041FE 0%, #27B3A6 45%, #41FE6B 100%)',
              boxShadow: '2px 2px 0 0 #07091d'
            }}>How wheel works</button>
          <div style={{ marginTop: 14 }}><SwipeDots active={activeKey} theme={theme} /></div>
        </div> :

          <div style={{ flex: '1 1 0', minWidth: 0, position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column' }}>
          <div className="u" style={headingStyle}>Lucky wheel</div>
          <div style={{ fontSize: 11, color: 'var(--ink-dim)', lineHeight: 1.4, marginTop: 3, maxWidth: 150 }}>
            Swipe to switch · fill the tokens to charge each wheel
          </div>
          {theme.countdownDays && <CountdownBadge theme={theme} />}

          {/* token meter (hidden on chip loaders — the chip itself shows progress) */}
          {!theme.chip && !theme.hideTokenMeter &&
            <div style={{ marginTop: 11 }}>
              <TokenMeter cfg={cfgActive} theme={theme} progress={sActive.progress} ready={sActive.ready} cooldown={sActive.cooldown} />
            </div>
            }

          <div style={{ marginTop: 'auto', paddingTop: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={onInfo} style={{ ...{
                  padding: '7px 11px', borderRadius: mono ? 2 : 7, fontSize: 11.5, fontWeight: 700, color: '#07091d', whiteSpace: 'nowrap',
                  background: 'linear-gradient(90deg,#0041FE 0%, #27B3A6 45%, #41FE6B 100%)',
                  boxShadow: '2px 2px 0 0 #07091d'
                }, borderRadius: "0px" }}>How it works</button>
            <SwipeDots active={activeKey} theme={theme} />
          </div>
        </div>
          }

        {!cta && rightCluster}
      </div>
      {cta && rightCluster}
      </div>

      {/* Demo control */}
      <div style={{ display: 'flex', gap: 8, marginTop: 10, alignItems: 'center' }}>
        <button onClick={() => {if (sActive.cooldown) onReset(activeKey);else if (sActive.ready) onSpin(activeKey);else onAddProgress(activeKey, 15);}}
        style={{ ...{
            flex: 1, padding: '12px', borderRadius: theme.headingFx === 'mono' ? 3 : 11, fontSize: 13, fontWeight: 800, whiteSpace: 'nowrap',
            textTransform: mono ? 'uppercase' : 'none', letterSpacing: mono ? '.04em' : 'normal',
            color: sActive.cooldown ? '#fff' : sActive.ready ? '#3a2a08' : '#06210f',
            background: sActive.cooldown ? 'rgba(255,255,255,.08)' :
            sActive.ready ? 'linear-gradient(90deg,#ffe07a,#ffd23e,#f2a012)' :
            `linear-gradient(90deg, ${cfgActive.g0}, ${cfgActive.g1})`,
            border: sActive.cooldown ? '1px solid rgba(255,255,255,.25)' : 'none',
            boxShadow: sActive.cooldown ? 'none' :
            sActive.ready ? '0 8px 22px -8px rgba(255,210,62,.7)' :
            '0 6px 16px -10px ' + cfgActive.glow,
            transition: 'all .3s ease'
          }, borderRadius: "0px" }}>
          {sActive.cooldown ? `↺ Reset · ${sActive.cooldown}` : sActive.ready ? '✨ Spin the wheel now' : `Place a ${cfgActive.label} bet  +15%`}
        </button>
      </div>
      {showHint &&
      <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--ink-mute)', marginTop: 8 }}>
          ← swipe the wheels to switch · fill the tokens to unlock the spin
        </div>
      }
    </div>);

}
window.LuckyWheelWidget = LuckyWheelWidget;
window.WHEELS = WHEELS;
window.ORDER = ORDER;