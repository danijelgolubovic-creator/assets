/* app.jsx — Landing shell, state, info modal, tweaks, mount */
const { useState: useStateA, useEffect: useEffectA, useRef: useRefA } = React;

const COOLDOWN_SEC = 45;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "version": "final",
  "intensity": "Refined",
  "border": "#ff40ec",
  "showHint": true,
  "autoFill": false
} /*EDITMODE-END*/;

const INTEN_MAP = { Subtle: 'low', Refined: 'mid', Vegas: 'high' };
const VERSION_LABEL = { final: 'Final', refined: 'Refined', gold: 'Gold', chip: 'Chip Classic', chipNeon: 'Chip Neon', neonFrame: 'Neon Frame', midnight: 'Midnight', royale: 'Royale' };
const LABEL_VERSION = { Final: 'final', Refined: 'refined', Gold: 'gold', 'Chip Classic': 'chip', 'Chip Neon': 'chipNeon', 'Neon Frame': 'neonFrame', Midnight: 'midnight', Royale: 'royale' };

/* ---------- small UI bits ---------- */
function StatusBar() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 18px 4px', fontSize: 14 }}>
      <span style={{ fontWeight: 600 }}>9:41</span>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center', opacity: 0.95 }}>
        <span style={{ fontSize: 12 }}>●●●</span>
        <span style={{ fontSize: 12 }}>📶</span>
        <span style={{ display: 'inline-block', width: 22, height: 11, border: '1.4px solid #fff', borderRadius: 3, position: 'relative' }}>
          <span style={{ position: 'absolute', inset: 1.5, background: '#fff', borderRadius: 1 }} />
        </span>
      </div>
    </div>);

}

function Header() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px 10px', background: 'var(--bg)' }}>
      <button style={{ fontSize: 20, lineHeight: 1, color: '#fff', padding: 4 }}>☰</button>
      <div className="u" style={{ fontSize: 19, fontWeight: 800, letterSpacing: '.01em', display: 'flex', alignItems: 'center', gap: 1 }}>
        <span style={{ color: '#fff' }}>VEG</span>
        <span style={{
          width: 16, height: 16, borderRadius: '50%', display: 'inline-block', margin: '0 1px',
          background: 'conic-gradient(from 220deg, #41fe6b, #2cdff6, #0041fe, #41fe6b)',
          boxShadow: '0 0 8px rgba(44,223,246,.6)'
        }} />
        <span style={{ color: '#fff' }}>S</span>
      </div>
      <div style={{ flex: 1 }} />
      <button style={{
        padding: '8px 11px', fontSize: 12, fontWeight: 700, color: '#07091d', whiteSpace: 'nowrap',
        background: 'linear-gradient(90deg,#0041FE,#27B3A6 45%,#41FE6B)', boxShadow: '2px 2px 0 0 #07091d', borderRadius: "0px"
      }}>+ Add Funds</button>
      <button style={{
        width: 34, height: 34, background: 'rgba(255,255,255,.08)',
        border: '1px solid rgba(255,255,255,.12)', fontSize: 15, borderRadius: "0px"
      }}>👤</button>
    </div>);

}

function PromoBanner() {
  return (
    <div style={{
      margin: '4px 12px 0', borderRadius: 0, overflow: 'hidden', position: 'relative', height: 116,
      border: '1px solid #005f82',
      background: `url(${window.LW_BANNER || 'assets/promo-banner.png'}) center/cover no-repeat`
    }}>
    </div>);

}

const NAV = [
{ t: 'BETTING', from: '#2cdff6' },
{ t: 'LIVE', from: '#08ee32' },
{ t: 'CASINO', from: '#c13bff' },
{ t: 'VIRTUAL', from: '#ee8427' }];

function NavTabs() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, padding: '14px 12px 6px' }}>
      {NAV.map((n) =>
      <div key={n.t} style={{
        height: 60, position: 'relative', overflow: 'hidden',
        background: `linear-gradient(165deg, ${n.from} 0%, #1a1e40 62%, #090c24 100%)`,
        boxShadow: '3px 3px 0 0 #000', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 7, borderRadius: "0px"
      }}>
          <span className="u" style={{ fontSize: 10, fontWeight: 700, color: '#fff', letterSpacing: '.04em', textShadow: '0 1px 4px rgba(0,0,0,.9)' }}>{n.t}</span>
        </div>
      )}
    </div>);

}

function MatchRow({ league, time, odds }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10, padding: '12px 12px',
      background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.05)', borderRadius: "0px"
    }}>
      <span style={{ width: 26, height: 26, borderRadius: '50%', background: 'rgba(255,255,255,.07)', display: 'grid', placeItems: 'center', fontSize: 13 }}>⚽</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600 }}>{league}</div>
        <div style={{ fontSize: 11, color: 'var(--ink-mute)' }}>{time}</div>
      </div>
      {['1', 'X', '2'].map((o, i) =>
      <span key={o} style={{
        minWidth: 38, textAlign: 'center', padding: '7px 0', fontSize: 12, fontWeight: 700,
        background: 'rgba(255,255,255,.05)', color: 'var(--ink-dim)', borderRadius: "0px"
      }}>{o}<br /><span style={{ fontSize: 10, color: 'var(--green)' }}>{odds[i]}</span></span>
      )}
    </div>);

}

/* ---------- Info modal ---------- */
function InfoModal({ open, onClose }) {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{ position: 'absolute', inset: 0, zIndex: 99000, background: 'rgba(4,5,15,.6)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'flex-end' }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: '100%', maxHeight: '82%', overflowY: 'auto', borderRadius: '22px 22px 0 0', padding: 22,
        background: 'linear-gradient(180deg,#330182,#1a0a3d)', borderTop: '1px solid rgba(255,255,255,.12)',
        animation: 'risePop .35s ease both'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h2 className="u" style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>How the wheel works</h2>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,.1)', fontSize: 15 }}>✕</button>
        </div>
        {[
        ['Build progress', 'Every bet you place adds progress to that wheel — Sportsbook fills from your sports bets, Gambling from casino play. Swipe to switch between them.'],
        ['Unlock the spin', 'Fill a wheel to 100% and it turns gold — tap it to launch the Lucky Wheel and spin for a prize.'],
        ['Win instantly', 'Land on multipliers up to x10, free spins, or the jackpot. Rewards are credited the moment the wheel stops.'],
        ['Cooldown', 'After a spin the wheel rests on a short cooldown, then starts filling again.']].
        map(([h, b]) =>
        <div key={h} style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--cyan)', marginBottom: 4 }}>{h}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,.78)', lineHeight: 1.55 }}>{b}</div>
          </div>
        )}
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,.5)', borderTop: '1px solid rgba(255,255,255,.12)', paddingTop: 12, marginTop: 4 }}>
          Play responsibly. Must be 18+. All spins are provably fair.
        </div>
      </div>
    </div>);

}

function fmtTime(s) {
  const m = Math.floor(s / 60),ss = s % 60;
  return `${m}:${String(ss).padStart(2, '0')}`;
}

/* ---------- Design-version switcher (chips) ---------- */
function VersionSwitcher({ value, onChange }) {
  const TH = window.THEMES,ORD = window.THEME_ORDER;
  const scrollRef = useRefA(null);
  const drag = useRefA({ down: false, startX: 0, startLeft: 0, moved: 0 });

  const onDown = (e) => {
    const el = scrollRef.current;if (!el) return;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    drag.current = { down: true, startX: x, startLeft: el.scrollLeft, moved: 0 };
  };
  const onMove = (e) => {
    const el = scrollRef.current;if (!el || !drag.current.down) return;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const dx = x - drag.current.startX;
    drag.current.moved = Math.max(drag.current.moved, Math.abs(dx));
    el.scrollLeft = drag.current.startLeft - dx;
  };
  const onUp = () => {drag.current.down = false;};

  return (
    <div ref={scrollRef}
      onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
      onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onUp}
      style={{ display: 'flex', gap: 6, padding: '4px 10px 8px', overflowX: 'auto', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch', touchAction: 'pan-x', scrollSnapType: 'x proximity', cursor: 'grab', userSelect: 'none' }}>
      {ORD.map((k) => {
        const th = TH[k];const on = value === k;
        return (
          <button key={k}
          onClick={() => {if (drag.current.moved < 6) onChange(k);}}
          style={{
            flex: '0 0 auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1,
            padding: '7px 11px', borderRadius: 10, minWidth: 78, scrollSnapAlign: 'start', transition: 'all .25s ease',
            background: on ? 'rgba(255,255,255,.08)' : 'rgba(255,255,255,.02)',
            border: `1px solid ${on ? th.accent : 'rgba(255,255,255,.08)'}`,
            boxShadow: on ? `0 0 14px -4px ${th.accent}, inset 0 0 12px -8px ${th.accent}` : 'none'
          }}>
            <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '.08em', color: on ? th.accent : 'var(--ink-mute)' }}>{th.tag}</span>
            <span className="u" style={{ fontSize: 11, fontWeight: 700, color: on ? '#fff' : 'var(--ink-dim)', whiteSpace: 'nowrap', pointerEvents: 'none' }}>{th.name}</span>
          </button>);

      })}
    </div>);

}

/* ===================== APP ===================== */
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const intensity = INTEN_MAP[t.intensity] || 'mid';
  const theme = (window.THEMES || {})[t.version] || window.THEMES.refined;

  const [wheelState, setWheelState] = useStateA({
    sportsbook: { progress: 60, ready: false, cooldownUntil: 0 },
    gambling: { progress: 25, ready: false, cooldownUntil: 0 }
  });
  const [activeKey, setActiveKey] = useStateA('sportsbook');
  const [spin, setSpin] = useStateA({ open: false, key: null });
  const [info, setInfo] = useStateA(false);
  const [now, setNow] = useStateA(Date.now());

  // clock for cooldowns
  useEffectA(() => {
    const id = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(id);
  }, []);

  // resolve cooldowns -> reset
  useEffectA(() => {
    setWheelState((ws) => {
      let changed = false;const next = { ...ws };
      for (const k of window.ORDER) {
        if (next[k].cooldownUntil && now >= next[k].cooldownUntil) {
          next[k] = { progress: 0, ready: false, cooldownUntil: 0 };changed = true;
        }
      }
      return changed ? next : ws;
    });
  }, [now]);

  // auto-fill demo
  useEffectA(() => {
    if (!t.autoFill) return;
    const id = setInterval(() => {
      setWheelState((ws) => {
        const s = ws[activeKey];
        if (s.ready || s.cooldownUntil) return ws;
        const p = Math.min(100, s.progress + 7);
        return { ...ws, [activeKey]: { ...s, progress: p, ready: p >= 100 } };
      });
    }, 700);
    return () => clearInterval(id);
  }, [t.autoFill, activeKey]);

  const addProgress = (key, amt) => {
    setWheelState((ws) => {
      const s = ws[key];
      if (s.ready || s.cooldownUntil) return ws;
      const p = Math.min(100, s.progress + amt);
      return { ...ws, [key]: { ...s, progress: p, ready: p >= 100 } };
    });
  };

  const resetWheel = (key) => {
    setWheelState((ws) => ({ ...ws, [key]: { progress: 0, ready: false, cooldownUntil: 0 } }));
  };

  const openSpin = (key) => setSpin({ open: true, key });
  const closeSpin = () => {
    const key = spin.key;
    setSpin({ open: false, key: null });
    if (key) {
      setWheelState((ws) => ({ ...ws, [key]: { progress: 0, ready: false, cooldownUntil: Date.now() + COOLDOWN_SEC * 1000 } }));
    }
  };

  // derive display state (inject cooldown string)
  const display = {};
  for (const k of window.ORDER) {
    const s = wheelState[k];
    const cdLeft = s.cooldownUntil ? Math.max(0, Math.ceil((s.cooldownUntil - now) / 1000)) : 0;
    display[k] = { progress: s.progress, ready: s.ready, cooldown: cdLeft ? fmtTime(cdLeft) : null };
  }

  return (
    <div className="stage" style={{ '--phone-max': '440px', '--card-glow': t.border }}>
      <div className="phone">
        <div style={{ background: 'var(--bg)' }}>
          <StatusBar />
          <Header />
        </div>
        <div className="app-scroll">
          <PromoBanner />
          <NavTabs />

          {/* HERO: Lucky Wheel widget */}
          <VersionSwitcher value={t.version} onChange={(v) => setTweak('version', v)} />
          <div style={{ padding: '4px 10px 4px' }}>
            <LuckyWheelWidget
              state={display}
              theme={theme}
              activeKey={activeKey}
              setActiveKey={setActiveKey}
              onAddProgress={addProgress}
              onReset={resetWheel}
              onSpin={openSpin}
              onInfo={() => setInfo(true)}
              intensity={intensity}
              showHint={t.showHint} />
            
          </div>

          {/* context */}
          <div style={{ padding: '14px 12px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="u" style={{ fontSize: 14, fontWeight: 700 }}>Top Matches</span>
            <span style={{ fontSize: 12, color: 'var(--cyan)' }}>See all ›</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '0 12px 28px' }}>
            <MatchRow league="Lakers vs Celtics" time="Today · 21:00" odds={['2.43', '2.40', '2.07']} />
            <MatchRow league="Arsenal vs Chelsea" time="Tomorrow · 18:30" odds={['3.30', '2.53', '1.55']} />
          </div>
        </div>

        <SpinOverlay open={spin.open} cfgKey={spin.key} onClose={closeSpin} intensity={intensity} />
        <InfoModal open={info} onClose={() => setInfo(false)} />
      </div>

      <TweaksPanel>
        <TweakSection label="Design version" />
        <TweakSelect label="Style" value={VERSION_LABEL[t.version] || 'Refined'}
        options={['Final', 'Refined', 'Gold', 'Chip Classic', 'Chip Neon', 'Neon Frame', 'Midnight', 'Royale']}
        onChange={(v) => setTweak('version', LABEL_VERSION[v])} />
        <TweakSection label="Feel" />
        <TweakRadio label="Intensity" value={t.intensity} options={['Subtle', 'Refined', 'Vegas']} onChange={(v) => setTweak('intensity', v)} />
        <TweakColor label="Card glow" value={t.border} options={['#ff40ec', '#2cdff6', '#ffd23e', '#41fe6b']} onChange={(v) => setTweak('border', v)} />
        <TweakSection label="Demo" />
        <TweakToggle label="Auto-fill progress" value={t.autoFill} onChange={(v) => setTweak('autoFill', v)} />
        <TweakToggle label="Show swipe hint" value={t.showHint} onChange={(v) => setTweak('showHint', v)} />
      </TweaksPanel>
    </div>);

}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);