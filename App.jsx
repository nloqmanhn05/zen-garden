import { useState, useEffect, useRef, useCallback } from "react";

// ─── Tree Growth Stage (SVG-based, always fits 160×240) ───────────────────────
const TreeStage = ({ progress, bloomed }) => {
  const p = bloomed ? 100 : progress;

  // All stages rendered as a single SVG, 160×240, bottom-anchored
  return (
    <svg
      width="160" height="240"
      viewBox="0 0 160 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block", flexShrink: 0, overflow: "visible" }}
    >
      <defs>
        <radialGradient id="groundGrad" cx="50%" cy="40%">
          <stop offset="0%" stopColor="#8B6343"/>
          <stop offset="100%" stopColor="#5c3d1e"/>
        </radialGradient>
        <linearGradient id="trunkGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#7a4f2d"/>
          <stop offset="40%" stopColor="#a0632d"/>
          <stop offset="100%" stopColor="#6b3e1e"/>
        </linearGradient>
        <radialGradient id="canopy1" cx="40%" cy="40%">
          <stop offset="0%" stopColor="#6abf6a"/>
          <stop offset="100%" stopColor="#2d7a32"/>
        </radialGradient>
        <radialGradient id="canopy2" cx="40%" cy="40%">
          <stop offset="0%" stopColor="#52b055"/>
          <stop offset="100%" stopColor="#1e5c22"/>
        </radialGradient>
        <radialGradient id="canopy3" cx="40%" cy="40%">
          <stop offset="0%" stopColor="#78cc78"/>
          <stop offset="100%" stopColor="#3a8c3f"/>
        </radialGradient>
        <radialGradient id="bloomCanopy" cx="40%" cy="40%">
          <stop offset="0%" stopColor="#88d888"/>
          <stop offset="100%" stopColor="#2d7a32"/>
        </radialGradient>
        <filter id="softGlow">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="bloomGlow">
          <feGaussianBlur stdDeviation="5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* ── Ground / Soil mound ───────────────────────────────────────── */}
      <ellipse cx="80" cy="228" rx="52" ry="12" fill="url(#groundGrad)"/>
      <ellipse cx="80" cy="225" rx="46" ry="8" fill="#a07848" opacity="0.5"/>

      {/* ── Stage 1 (0%): Seed ───────────────────────────────────────── */}
      {p === 0 && (
        <>
          <ellipse cx="80" cy="220" rx="10" ry="7" fill="#c9a84c"/>
          <ellipse cx="80" cy="218" rx="8" ry="5" fill="#e8c97a" opacity="0.7"/>
          {/* crack lines */}
          <line x1="80" y1="214" x2="78" y2="219" stroke="#a07828" strokeWidth="1" strokeLinecap="round"/>
          <line x1="80" y1="214" x2="82" y2="219" stroke="#a07828" strokeWidth="1" strokeLinecap="round"/>
        </>
      )}

      {/* ── Stage 2 (1–25%): Seedling with 2 tiny leaves ─────────────── */}
      {p > 0 && p <= 25 && (() => {
        const grow = p / 25;
        const trunkH = 15 + grow * 20;
        const leafS = grow;
        const ty = 228 - trunkH;
        return (
          <>
            {/* thin trunk */}
            <rect x="78" y={ty} width="4" height={trunkH} rx="2" fill="url(#trunkGrad)"/>
            {/* left tiny leaf */}
            <ellipse
              cx={72} cy={ty + 4}
              rx={10 * leafS} ry={6 * leafS}
              fill="#5cb85c"
              transform={`rotate(-30, 72, ${ty + 4})`}
              opacity={leafS}
            />
            {/* right tiny leaf */}
            <ellipse
              cx={88} cy={ty + 4}
              rx={10 * leafS} ry={6 * leafS}
              fill="#4aaa4a"
              transform={`rotate(30, 88, ${ty + 4})`}
              opacity={leafS}
            />
          </>
        );
      })()}

      {/* ── Stage 3 (26–50%): Sapling with branching ─────────────────── */}
      {p > 25 && p <= 50 && (() => {
        const grow = (p - 25) / 25;
        const trunkH = 40 + grow * 35;
        const ty = 228 - trunkH;
        const canopyR = 20 + grow * 18;
        return (
          <>
            {/* trunk */}
            <rect x="77" y={ty} width="6" height={trunkH} rx="3" fill="url(#trunkGrad)"/>
            {/* left branch */}
            <line x1="80" y1={ty + trunkH * 0.45} x2={80 - 18 * grow} y2={ty + trunkH * 0.2}
              stroke="#8b5e2d" strokeWidth={3 * grow} strokeLinecap="round"/>
            {/* right branch */}
            <line x1="80" y1={ty + trunkH * 0.45} x2={80 + 18 * grow} y2={ty + trunkH * 0.2}
              stroke="#8b5e2d" strokeWidth={3 * grow} strokeLinecap="round"/>
            {/* main canopy */}
            <circle cx="80" cy={ty + 2} r={canopyR} fill="url(#canopy1)"/>
            {/* side puffs */}
            <circle cx={80 - canopyR * 0.7} cy={ty + canopyR * 0.4} r={canopyR * 0.7 * grow} fill="url(#canopy2)" opacity="0.9"/>
            <circle cx={80 + canopyR * 0.7} cy={ty + canopyR * 0.4} r={canopyR * 0.7 * grow} fill="url(#canopy3)" opacity="0.9"/>
          </>
        );
      })()}

      {/* ── Stage 4 (51–75%): Young tree, fuller canopy ───────────────── */}
      {p > 50 && p <= 75 && (() => {
        const grow = (p - 50) / 25;
        const trunkH = 80 + grow * 20;
        const ty = 228 - trunkH;
        const cR = 38 + grow * 10;
        return (
          <>
            {/* trunk with texture lines */}
            <rect x="75" y={ty} width="10" height={trunkH} rx="5" fill="url(#trunkGrad)"/>
            <line x1="79" y1={ty + 10} x2="77" y2={ty + 40} stroke="#6b3e1e" strokeWidth="1" opacity="0.4" strokeLinecap="round"/>
            <line x1="81" y1={ty + 20} x2="83" y2={ty + 55} stroke="#6b3e1e" strokeWidth="1" opacity="0.3" strokeLinecap="round"/>
            {/* branches */}
            <line x1="80" y1={ty + trunkH * 0.5} x2={80 - 28} y2={ty + trunkH * 0.28}
              stroke="#8b5e2d" strokeWidth="4" strokeLinecap="round"/>
            <line x1="80" y1={ty + trunkH * 0.5} x2={80 + 28} y2={ty + trunkH * 0.28}
              stroke="#8b5e2d" strokeWidth="4" strokeLinecap="round"/>
            <line x1="80" y1={ty + trunkH * 0.3} x2={80 - 16} y2={ty + trunkH * 0.1}
              stroke="#8b5e2d" strokeWidth="3" strokeLinecap="round"/>
            <line x1="80" y1={ty + trunkH * 0.3} x2={80 + 16} y2={ty + trunkH * 0.1}
              stroke="#8b5e2d" strokeWidth="3" strokeLinecap="round"/>
            {/* canopy layers */}
            <circle cx={80 - cR * 0.55} cy={ty + cR * 0.55} r={cR * 0.72} fill="url(#canopy2)" opacity="0.95"/>
            <circle cx={80 + cR * 0.55} cy={ty + cR * 0.55} r={cR * 0.72} fill="url(#canopy2)" opacity="0.95"/>
            <circle cx="80" cy={ty + cR * 0.2} r={cR} fill="url(#canopy1)"/>
            <circle cx="80" cy={ty - cR * 0.15} r={cR * 0.65} fill="url(#canopy3)" opacity="0.9"/>
          </>
        );
      })()}

      {/* ── Stage 5 (76–99%): Mature tree ─────────────────────────────── */}
      {p > 75 && !bloomed && (() => {
        const grow = (p - 75) / 25;
        const trunkH = 105 + grow * 10;
        const ty = 228 - trunkH;
        const cR = 50 + grow * 4;
        return (
          <>
            {/* trunk */}
            <rect x="73" y={ty} width="14" height={trunkH} rx="7" fill="url(#trunkGrad)"/>
            <line x1="78" y1={ty + 8} x2="75" y2={ty + 55} stroke="#6b3e1e" strokeWidth="1.5" opacity="0.35" strokeLinecap="round"/>
            <line x1="82" y1={ty + 18} x2="85" y2={ty + 65} stroke="#6b3e1e" strokeWidth="1.5" opacity="0.3" strokeLinecap="round"/>
            {/* branches */}
            <line x1="80" y1={ty + trunkH * 0.52} x2={80 - 36} y2={ty + trunkH * 0.28} stroke="#8b5e2d" strokeWidth="5" strokeLinecap="round"/>
            <line x1="80" y1={ty + trunkH * 0.52} x2={80 + 36} y2={ty + trunkH * 0.28} stroke="#8b5e2d" strokeWidth="5" strokeLinecap="round"/>
            <line x1="80" y1={ty + trunkH * 0.32} x2={80 - 22} y2={ty + trunkH * 0.12} stroke="#8b5e2d" strokeWidth="3.5" strokeLinecap="round"/>
            <line x1="80" y1={ty + trunkH * 0.32} x2={80 + 22} y2={ty + trunkH * 0.12} stroke="#8b5e2d" strokeWidth="3.5" strokeLinecap="round"/>
            {/* full canopy */}
            <circle cx={80 - cR * 0.5} cy={ty + cR * 0.6} r={cR * 0.75} fill="url(#canopy2)" opacity="0.95"/>
            <circle cx={80 + cR * 0.5} cy={ty + cR * 0.6} r={cR * 0.75} fill="url(#canopy2)" opacity="0.95"/>
            <circle cx="80" cy={ty + cR * 0.25} r={cR} fill="url(#canopy1)"/>
            <circle cx="80" cy={ty - cR * 0.1} r={cR * 0.7} fill="url(#canopy3)" opacity="0.85"/>
            {/* subtle highlight */}
            <circle cx={72} cy={ty - cR * 0.05} r={cR * 0.3} fill="white" opacity="0.08"/>
          </>
        );
      })()}

      {/* ── Stage 6 (bloomed / 100%): Full majestic tree with glow ──────── */}
      {bloomed && (() => {
        const trunkH = 115;
        const ty = 228 - trunkH;
        const cR = 56;
        return (
          <>
            <style>{`
              @keyframes treeGlow {
                0%,100% { opacity: 0.15; }
                50% { opacity: 0.35; }
              }
              @keyframes leafShimmer {
                0%,100% { opacity: 0.9; }
                50% { opacity: 1; }
              }
              @keyframes starPop {
                0% { opacity:0; transform: scale(0); }
                60% { opacity:1; transform: scale(1.3); }
                100% { opacity:1; transform: scale(1); }
              }
            `}</style>
            {/* glow aura */}
            <circle cx="80" cy={ty + cR * 0.25} r={cR + 18}
              fill="#4ade80" opacity="0.12"
              style={{ animation: "treeGlow 2.5s ease-in-out infinite" }}
            />
            {/* trunk */}
            <rect x="72" y={ty} width="16" height={trunkH} rx="8" fill="url(#trunkGrad)"/>
            <line x1="78" y1={ty + 8} x2="74" y2={ty + 60} stroke="#6b3e1e" strokeWidth="1.5" opacity="0.35" strokeLinecap="round"/>
            <line x1="82" y1={ty + 20} x2="86" y2={ty + 72} stroke="#6b3e1e" strokeWidth="1.5" opacity="0.3" strokeLinecap="round"/>
            {/* branches */}
            <line x1="80" y1={ty + trunkH * 0.52} x2={80 - 40} y2={ty + trunkH * 0.28} stroke="#8b5e2d" strokeWidth="6" strokeLinecap="round"/>
            <line x1="80" y1={ty + trunkH * 0.52} x2={80 + 40} y2={ty + trunkH * 0.28} stroke="#8b5e2d" strokeWidth="6" strokeLinecap="round"/>
            <line x1="80" y1={ty + trunkH * 0.32} x2={80 - 24} y2={ty + trunkH * 0.1} stroke="#8b5e2d" strokeWidth="4" strokeLinecap="round"/>
            <line x1="80" y1={ty + trunkH * 0.32} x2={80 + 24} y2={ty + trunkH * 0.1} stroke="#8b5e2d" strokeWidth="4" strokeLinecap="round"/>
            {/* canopy — deep layers */}
            <circle cx={80 - cR * 0.52} cy={ty + cR * 0.65} r={cR * 0.78} fill="url(#canopy2)" opacity="0.95"/>
            <circle cx={80 + cR * 0.52} cy={ty + cR * 0.65} r={cR * 0.78} fill="url(#canopy2)" opacity="0.95"/>
            <circle cx="80" cy={ty + cR * 0.28} r={cR} fill="url(#bloomCanopy)"
              style={{ animation: "leafShimmer 2s ease-in-out infinite" }}
            />
            <circle cx="80" cy={ty - cR * 0.08} r={cR * 0.72} fill="url(#canopy3)" opacity="0.9"/>
            {/* highlight */}
            <circle cx={72} cy={ty - cR * 0.04} r={cR * 0.32} fill="white" opacity="0.1"/>
            {/* sparkle dots */}
            {[[-28, -cR * 0.1], [28, -cR * 0.05], [0, -cR * 0.5], [-38, cR * 0.45], [38, cR * 0.4]].map(([dx, dy], i) => (
              <circle key={i}
                cx={80 + dx} cy={ty + cR * 0.25 + dy}
                r="4"
                fill="#fef08a"
                opacity="0"
                style={{ animation: `starPop 0.5s ease-out ${0.1 + i * 0.12}s forwards` }}
              />
            ))}
          </>
        );
      })()}
    </svg>
  );
};

// ─── Main App ────────────────────────────────────────────────────────────────
export default function ZenGarden() {
  const [tab, setTab] = useState("garden");
  const [timerDuration, setTimerDuration] = useState(25 * 60);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [bloomed, setBloomed] = useState(false);

  const [tasks, setTasks] = useState([
    { id: 1, text: "Morning meditation", done: true },
    { id: 2, text: "Deep work: Design System", done: false },
    { id: 3, text: "Review wellness goals", done: false },
  ]);
  const [newTask, setNewTask] = useState("");
  const [trophies, setTrophies] = useState([]);

  const [showBloomMsg, setShowBloomMsg] = useState(false);
  const [customMin, setCustomMin] = useState("25");
  const [customSec, setCustomSec] = useState("0");
  const intervalRef = useRef(null);
  const [tabTransition, setTabTransition] = useState(false);

  // Load from storage on mount
  useEffect(() => {
    try {
      const saved = {
        tasks: JSON.parse(localStorage.getItem("zg_tasks") || "null"),
        trophies: JSON.parse(localStorage.getItem("zg_trophies") || "[]"),
      };
      if (saved.tasks) setTasks(saved.tasks);
      if (saved.trophies) setTrophies(saved.trophies);
    } catch (e) {}
  }, []);

  // Persist
  useEffect(() => {
    try {
      localStorage.setItem("zg_tasks", JSON.stringify(tasks));
    } catch (e) {}
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem("zg_trophies", JSON.stringify(trophies));
    } catch (e) {}
  }, [trophies]);

  // Timer logic
  useEffect(() => {
    if (running && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            setBloomed(true);
            setShowBloomMsg(true);
            const trophy = { id: Date.now(), date: new Date().toLocaleDateString(), duration: timerDuration };
            setTrophies(prev => [trophy, ...prev]);
            setTimeout(() => setShowBloomMsg(false), 4000);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, timerDuration]);

  const progress = bloomed ? 100 : Math.round(((timerDuration - timeLeft) / timerDuration) * 100);

  const handleStart = () => setRunning(true);
  const handlePause = () => setRunning(false);
  const handleReset = () => {
    setRunning(false);
    setBloomed(false);
    setTimeLeft(timerDuration);
  };
  const handleSetTimer = () => {
    const m = Math.max(0, parseInt(customMin) || 0);
    const s = Math.max(0, Math.min(59, parseInt(customSec) || 0));
    const d = m * 60 + s;
    if (d < 1) return;
    setTimerDuration(d);
    setTimeLeft(d);
    setRunning(false);
    setBloomed(false);
  };


  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks(prev => [...prev, { id: Date.now(), text: newTask.trim(), done: false }]);
    setNewTask("");
  };
  const toggleTask = (id) => setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const deleteTask = (id) => setTasks(prev => prev.filter(t => t.id !== id));

  const switchTab = (t) => {
    setTabTransition(true);
    setTimeout(() => { setTab(t); setTabTransition(false); }, 150);
  };

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const secs = String(timeLeft % 60).padStart(2, "0");
  const completedTasks = tasks.filter(t => t.done).length;

  return (
    <div style={{
      minHeight: "100dvh", background: "#FDFBF7",
      fontFamily: "'Inter', sans-serif",
      display: "flex", flexDirection: "column",
      maxWidth: 430, margin: "0 auto",
      position: "relative", overflow: "hidden"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.08); } }
        @keyframes glowPulse { 0%,100% { box-shadow: 0 0 8px rgba(129,199,132,0.4); } 50% { box-shadow: 0 0 20px rgba(129,199,132,0.8), 0 0 40px rgba(129,199,132,0.3); } }
        @keyframes ripple { 0% { transform: scale(0); opacity: 1; } 100% { transform: scale(2.5); opacity: 0; } }
        @keyframes bloomMsg { 0% { transform: translateY(20px) scale(0.8); opacity: 0; } 20% { transform: translateY(0) scale(1); opacity: 1; } 80% { transform: translateY(0) scale(1); opacity: 1; } 100% { transform: translateY(-10px) scale(0.9); opacity: 0; } }
        .tab-content { animation: fadeIn 0.2s ease-out; }
        .task-item { transition: all 0.3s ease; }
        .water-btn:active { transform: scale(0.92); }
        input:focus { outline: none; }
        ::-webkit-scrollbar { width: 0; }
      `}</style>


      {/* Header */}
      <header style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "8px 20px 12px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 12,
            background: "rgba(129,199,132,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20
          }}>🌿</div>
          <span style={{ fontSize: 20, fontWeight: 900, letterSpacing: -0.5, color: "#1e293b" }}>
            Zen Garden
          </span>
        </div>
        <div style={{
          fontSize: 12, fontWeight: 700, color: "#81C784",
          background: "rgba(129,199,132,0.12)",
          padding: "4px 12px", borderRadius: 99
        }}>
          {trophies.length} 🌳 grown
        </div>
      </header>

      {/* Tab Content */}
      <main style={{
        flex: 1, overflowY: "auto", paddingBottom: 90,
        opacity: tabTransition ? 0 : 1, transition: "opacity 0.15s"
      }} className="tab-content">

        {/* ── GARDEN TAB ─────────────────────────────── */}
        {tab === "garden" && (
          <div style={{ padding: "0 20px", animation: "slideUp 0.3s ease-out" }}>
            {/* Session label */}
            <div style={{
              background: "rgba(255,255,255,0.8)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.6)",
              borderRadius: 16, padding: "12px 20px",
              textAlign: "center", marginBottom: 20,
              boxShadow: "0 2px 16px rgba(0,0,0,0.04)"
            }}>
              <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 3, color: "#81C784", textTransform: "uppercase", marginBottom: 2 }}>
                Current Session
              </div>
              <div style={{ fontSize: 17, fontWeight: 700, color: "#1e293b" }}>
                {running ? "🧘 Focus Mode Active" : bloomed ? "✨ Session Complete!" : "Ready to Focus"}
              </div>
            </div>

            {/* Bloom Message */}
            {showBloomMsg && (
              <div style={{
                position: "fixed", top: "40%", left: "50%", transform: "translateX(-50%)",
                background: "linear-gradient(135deg, #4ade80, #16a34a)",
                color: "white", padding: "16px 28px", borderRadius: 20,
                fontWeight: 800, fontSize: 18, textAlign: "center",
                boxShadow: "0 8px 32px rgba(74,222,128,0.4)",
                animation: "bloomMsg 4s ease-out forwards",
                zIndex: 100, whiteSpace: "nowrap"
              }}>
                🌳 Your tree is fully grown!<br />
                <span style={{ fontSize: 13, fontWeight: 500, opacity: 0.9 }}>Trophy added to your garden</span>
              </div>
            )}

            {/* Timer Ring + Flower */}
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              position: "relative", marginBottom: 20
            }}>
              {/* Progress Ring */}
              <div style={{ position: "relative", width: 280, height: 280 }}>
                <svg style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)" }} width="280" height="280">
                  <circle cx="140" cy="140" r="126" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                  <circle
                    cx="140" cy="140" r="126" fill="none"
                    stroke={bloomed ? "#f472b6" : "#81C784"}
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 126}`}
                    strokeDashoffset={`${2 * Math.PI * 126 * (1 - progress / 100)}`}
                    style={{ transition: "stroke-dashoffset 1s linear, stroke 0.5s" }}
                  />
                </svg>

                {/* Flower container — fixed size, clipped to circle, centered */}
                <div style={{
                  position: "absolute",
                  top: 10, left: 10, right: 10, bottom: 10,
                  borderRadius: "50%",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(253,251,247,0.6)"
                }}>
                  <div style={{
                    transform: "scale(0.85)",
                    transformOrigin: "center center",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    <TreeStage progress={progress} bloomed={bloomed} />
                  </div>
                </div>

                {/* Timer display pinned to bottom of ring */}
                <div style={{
                  position: "absolute",
                  bottom: 8,
                  left: "50%", transform: "translateX(-50%)",
                  background: "rgba(255,255,255,0.95)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.9)",
                  borderRadius: 99, padding: "6px 22px",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                  zIndex: 10, whiteSpace: "nowrap"
                }}>
                  <span style={{ fontSize: 30, fontWeight: 900, letterSpacing: -2, color: "#1e293b", fontVariantNumeric: "tabular-nums" }}>
                    {mins}:{secs}
                  </span>
                </div>
              </div>
            </div>

            {/* Progress label */}
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <span style={{ fontSize: 13, color: "#64748b", fontWeight: 600 }}>
                {progress === 0 ? "Plant your seed — start the timer" :
                  progress <= 25 ? "🌱 Seedling sprouting..." :
                    progress <= 50 ? "🌿 Sapling growing..." :
                      progress <= 75 ? "🌲 Young tree rising..." :
                        progress < 100 ? "🌳 Almost fully grown..." :
                          "🌳 Fully grown!"}
              </span>
            </div>

            {/* Controls */}
            <div style={{ display: "flex", gap: 10, marginBottom: 16, justifyContent: "center" }}>
              {!running && !bloomed && (
                <button onClick={handleStart} style={{
                  flex: 1, maxWidth: 160, padding: "14px 0",
                  background: "linear-gradient(135deg, #81C784, #4ade80)",
                  color: "white", border: "none", borderRadius: 14,
                  fontSize: 15, fontWeight: 800, cursor: "pointer",
                  boxShadow: "0 4px 16px rgba(129,199,132,0.4)",
                  fontFamily: "inherit"
                }}>
                  ▶ Start
                </button>
              )}
              {running && (
                <button onClick={handlePause} style={{
                  flex: 1, maxWidth: 160, padding: "14px 0",
                  background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
                  color: "white", border: "none", borderRadius: 14,
                  fontSize: 15, fontWeight: 800, cursor: "pointer",
                  boxShadow: "0 4px 16px rgba(245,158,11,0.4)",
                  fontFamily: "inherit"
                }}>
                  ⏸ Pause
                </button>
              )}
              <button onClick={handleReset} style={{
                flex: 1, maxWidth: 100, padding: "14px 0",
                background: "rgba(0,0,0,0.06)", color: "#64748b",
                border: "1px solid rgba(0,0,0,0.08)", borderRadius: 14,
                fontSize: 15, fontWeight: 800, cursor: "pointer",
                fontFamily: "inherit"
              }}>
                ↺ Reset
              </button>
            </div>

            {/* Custom Timer */}
            <div style={{
              background: "rgba(255,255,255,0.7)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.5)",
              borderRadius: 16, padding: "14px 16px",
              marginBottom: 16,
              boxShadow: "0 2px 12px rgba(0,0,0,0.04)"
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>
                Set Timer
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 4 }}>
                  <input
                    type="number" min="0" max="180" value={customMin}
                    onChange={e => setCustomMin(e.target.value)}
                    onBlur={e => setCustomMin(String(Math.max(0, parseInt(e.target.value) || 0)))}
                    style={{
                      width: "100%", padding: "8px 12px",
                      background: "#f8fafc", border: "1px solid #e2e8f0",
                      borderRadius: 10, fontSize: 16, fontWeight: 700,
                      color: "#1e293b", textAlign: "center", fontFamily: "inherit"
                    }}
                  />
                  <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>min</span>
                </div>
                <span style={{ fontSize: 18, color: "#cbd5e1", fontWeight: 300 }}>:</span>
                <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 4 }}>
                  <input
                    type="number" min="0" max="59" value={customSec}
                    onChange={e => setCustomSec(e.target.value)}
                    onBlur={e => setCustomSec(String(Math.max(0, Math.min(59, parseInt(e.target.value) || 0))))}
                    style={{
                      width: "100%", padding: "8px 12px",
                      background: "#f8fafc", border: "1px solid #e2e8f0",
                      borderRadius: 10, fontSize: 16, fontWeight: 700,
                      color: "#1e293b", textAlign: "center", fontFamily: "inherit"
                    }}
                  />
                  <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>sec</span>
                </div>
                <button onClick={handleSetTimer} style={{
                  padding: "8px 16px",
                  background: "linear-gradient(135deg, #81C784, #22c55e)",
                  color: "white", border: "none", borderRadius: 10,
                  fontSize: 13, fontWeight: 800, cursor: "pointer",
                  fontFamily: "inherit", whiteSpace: "nowrap"
                }}>
                  Set
                </button>
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
              <div style={{
                background: "rgba(255,255,255,0.7)", backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.5)",
                borderRadius: 16, padding: "14px 16px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.04)"
              }}>
                <div style={{ fontSize: 20, marginBottom: 4 }}>🌳</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: 2, textTransform: "uppercase" }}>Trees</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: "#1e293b" }}>Level {Math.max(1, Math.floor(trophies.length / 3) + 1)}</div>
              </div>
            </div>
          </div>
        )}

        {/* ── TASKS TAB ──────────────────────────────── */}
        {tab === "tasks" && (
          <div style={{ padding: "0 20px", animation: "slideUp 0.3s ease-out" }}>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: 24, fontWeight: 900, color: "#1e293b", marginBottom: 4, letterSpacing: -0.5 }}>
                Today's Intentions
              </h2>
              <p style={{ fontSize: 13, color: "#94a3b8", fontWeight: 500 }}>
                {completedTasks} of {tasks.length} tasks completed
              </p>
            </div>

            {/* Progress bar */}
            <div style={{ height: 6, background: "#e2e8f0", borderRadius: 99, marginBottom: 20, overflow: "hidden" }}>
              <div style={{
                height: "100%",
                width: tasks.length ? `${(completedTasks / tasks.length) * 100}%` : "0%",
                background: "linear-gradient(90deg, #81C784, #4ade80)",
                borderRadius: 99, transition: "width 0.5s cubic-bezier(0.34,1.56,0.64,1)"
              }} />
            </div>

            {/* Input */}
            <div style={{
              display: "flex", gap: 8, marginBottom: 20,
              background: "rgba(255,255,255,0.8)", backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.6)",
              borderRadius: 14, padding: "4px 4px 4px 16px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)"
            }}>
              <input
                value={newTask}
                onChange={e => setNewTask(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addTask()}
                placeholder="Add a new focus..."
                style={{
                  flex: 1, background: "none", border: "none",
                  fontSize: 14, color: "#1e293b", fontFamily: "inherit"
                }}
              />
              <button onClick={addTask} style={{
                width: 38, height: 38, borderRadius: 10,
                background: "linear-gradient(135deg, #81C784, #22c55e)",
                color: "white", border: "none", fontSize: 22,
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 300
              }}>+</button>
            </div>

            {/* Task list */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {tasks.map(task => (
                <div key={task.id} className="task-item" style={{
                  display: "flex", alignItems: "center", gap: 12,
                  background: "rgba(255,255,255,0.8)", backdropFilter: "blur(12px)",
                  border: task.done ? "1px solid #e2e8f0" : "1px solid rgba(255,255,255,0.6)",
                  borderLeft: task.done ? "1px solid #e2e8f0" : "4px solid #81C784",
                  borderRadius: 14, padding: "14px 16px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
                }}>
                  <button onClick={() => toggleTask(task.id)} style={{
                    width: 26, height: 26, borderRadius: 8, border: "none",
                    background: task.done ? "linear-gradient(135deg, #81C784, #22c55e)" : "white",
                    border: task.done ? "none" : "2px solid #e2e8f0",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", flexShrink: 0, transition: "all 0.2s"
                  }}>
                    {task.done && <span style={{ fontSize: 14, color: "white", fontWeight: 900 }}>✓</span>}
                  </button>
                  <span style={{
                    flex: 1, fontSize: 15, fontWeight: 500, color: task.done ? "#94a3b8" : "#1e293b",
                    textDecoration: task.done ? "line-through" : "none",
                    transition: "all 0.3s"
                  }}>{task.text}</span>
                  <button onClick={() => deleteTask(task.id)} style={{
                    background: "none", border: "none", color: "#cbd5e1",
                    cursor: "pointer", fontSize: 18, padding: "2px 4px", lineHeight: 1
                  }}>×</button>
                </div>
              ))}
              {tasks.length === 0 && (
                <div style={{ textAlign: "center", padding: "40px 0", color: "#cbd5e1" }}>
                  <div style={{ fontSize: 48, marginBottom: 8 }}>🌱</div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>Add your first intention</div>
                </div>
              )}
            </div>

            {/* Quote */}
            <div style={{
              marginTop: 24,
              background: "linear-gradient(135deg, rgba(129,199,132,0.08), rgba(96,165,250,0.08))",
              border: "1px solid rgba(255,255,255,0.4)",
              borderRadius: 16, padding: "18px 20px", textAlign: "center"
            }}>
              <p style={{ fontSize: 13, color: "#64748b", fontStyle: "italic", lineHeight: 1.6 }}>
                "The secret of getting ahead is getting started."
              </p>
            </div>
          </div>
        )}

        {/* ── PROFILE TAB ────────────────────────────── */}
        {tab === "profile" && (
          <div style={{ animation: "slideUp 0.3s ease-out" }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 20px 16px" }}>
              <span style={{ fontSize: 14, color: "#94a3b8" }}>⚙️</span>
              <span style={{ fontSize: 17, fontWeight: 800, color: "#1e293b" }}>Zen Profile</span>
              <span style={{ fontSize: 14, color: "#81C784" }}>↗</span>
            </div>

            {/* Avatar + info */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "0 20px 24px" }}>
              <div style={{ position: "relative", marginBottom: 16 }}>
                <div style={{
                  width: 100, height: 100, borderRadius: "50%",
                  background: "linear-gradient(135deg, #bbf7d0, #86efac)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 48, border: "4px solid rgba(129,199,132,0.2)",
                  boxShadow: "0 4px 24px rgba(129,199,132,0.2)"
                }}>🌺</div>
                <div style={{
                  position: "absolute", bottom: 4, right: 4,
                  background: "#81C784", borderRadius: "50%",
                  width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center",
                  border: "2px solid #FDFBF7", fontSize: 12
                }}>✓</div>
              </div>
              <div style={{ fontSize: 24, fontWeight: 900, color: "#1e293b", letterSpacing: -0.5, marginBottom: 8 }}>
                Zen Gardener
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{
                  background: "rgba(129,199,132,0.15)", color: "#16a34a",
                  padding: "3px 12px", borderRadius: 99, fontSize: 12, fontWeight: 800,
                  textTransform: "uppercase", letterSpacing: 1
                }}>
                  Level {Math.max(1, Math.floor(trophies.length / 3) + 1)}
                </span>
                <span style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>
                  {trophies.length < 5 ? "Seedling" : trophies.length < 15 ? "Sprouter" : trophies.length < 30 ? "Bloomer" : "Master Florist"}
                </span>
              </div>
              <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 6 }}>
                {trophies.length} sessions completed
              </div>
            </div>

            {/* Stats cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, padding: "0 20px 24px" }}>
              {[
                { icon: "🌳", label: "Total Grown", value: trophies.length, change: "+12%" },
                { icon: "✅", label: "Tasks Done", value: tasks.filter(t => t.done).length, change: "" },
                { icon: "🔥", label: "Streak", value: `${Math.min(trophies.length, 248)}d`, change: "🎯" },
              ].map((s, i) => (
                <div key={i} style={{
                  background: "rgba(255,255,255,0.8)", backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.6)",
                  borderRadius: 16, padding: "16px",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.04)"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontSize: 22 }}>{s.icon}</span>
                    {s.change && <span style={{ fontSize: 11, fontWeight: 700, color: "#81C784" }}>{s.change}</span>}
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: 2, textTransform: "uppercase", marginBottom: 2 }}>
                    {s.label}
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 900, color: "#1e293b" }}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* Trophies */}
            <div style={{ padding: "0 20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <span style={{ fontSize: 18, fontWeight: 900, color: "#1e293b" }}>Tree Trophies</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#81C784" }}>View All</span>
              </div>

              {trophies.length === 0 ? (
                <div style={{ textAlign: "center", padding: "32px 0", color: "#cbd5e1" }}>
                  <div style={{ fontSize: 40, marginBottom: 8 }}>🌱</div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>Complete a session to earn trophies!</div>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
                  {trophies.slice(0, 6).map((t, i) => (
                    <div key={t.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                      <div style={{
                        width: "100%", aspectRatio: 1,
                        background: "rgba(129,199,132,0.1)",
                        border: "1px solid rgba(129,199,132,0.2)",
                        borderRadius: 16,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 36, animation: i === 0 ? "pulse 2s ease-in-out infinite" : "none"
                      }}>🌳</div>
                      <span style={{ fontSize: 9, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 1, textAlign: "center" }}>
                        {t.date}
                      </span>
                    </div>
                  ))}
                  {/* Locked trophies */}
                  {[...Array(Math.max(0, 6 - trophies.length))].map((_, i) => (
                    <div key={`lock-${i}`} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity: 0.35 }}>
                      <div style={{
                        width: "100%", aspectRatio: 1,
                        background: "#f1f5f9", border: "1px solid #e2e8f0",
                        borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 28, color: "#94a3b8"
                      }}>🔒</div>
                      <span style={{ fontSize: 9, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1 }}>
                        Locked
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav style={{
        position: "fixed", bottom: 16, left: "50%", transform: "translateX(-50%)",
        width: "calc(100% - 32px)", maxWidth: 398,
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.6)",
        borderRadius: 99, padding: "6px 8px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        zIndex: 50
      }}>
        {[
          { id: "garden", icon: "🌱", label: "Garden" },
          { id: "tasks", icon: "✅", label: "Focus" },
          { id: "profile", icon: "🧘", label: "Profile" },
        ].map(item => (
          <button key={item.id} onClick={() => switchTab(item.id)} style={{
            flex: 1, padding: "10px 4px",
            background: tab === item.id ? "linear-gradient(135deg, #81C784, #4ade80)" : "none",
            border: "none", borderRadius: 99,
            color: tab === item.id ? "white" : "#94a3b8",
            cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
            fontFamily: "inherit"
          }}>
            <span style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1 }}>
              {item.label}
            </span>
          </button>
        ))}
      </nav>

      {/* Background blobs */}
      <div style={{
        position: "fixed", top: -60, left: -60, width: 200, height: 200,
        background: "rgba(129,199,132,0.06)", borderRadius: "50%",
        filter: "blur(40px)", pointerEvents: "none", zIndex: 0
      }} />
      <div style={{
        position: "fixed", bottom: 100, right: -60, width: 200, height: 200,
        background: "rgba(96,165,250,0.06)", borderRadius: "50%",
        filter: "blur(40px)", pointerEvents: "none", zIndex: 0
      }} />
    </div>
  );
}
