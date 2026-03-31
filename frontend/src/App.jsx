import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { analyzeIdea, stages } from "./api";
import IdeaInput from "./IdeaInput";
import PipelineTracker from "./PipelineTracker";
import ResultCards from "./ResultCards";

function GridBackground() {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none'
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99,102,241,0.12), transparent)'
      }} />
      <div style={{
        position: 'absolute', top: '20%', left: '10%', width: 300, height: 300,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.06), transparent 70%)',
        animation: 'float 8s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute', bottom: '20%', right: '10%', width: 200, height: 200,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(129,140,248,0.05), transparent 70%)',
        animation: 'float 10s ease-in-out infinite reverse',
      }} />
    </div>
  );
}

function Orb({ size, x, y, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 1 }}
      style={{
        position: 'absolute', width: size, height: size,
        borderRadius: '50%', left: x, top: y,
        background: 'radial-gradient(circle at 30% 30%, rgba(99,102,241,0.15), transparent 70%)',
        border: '1px solid rgba(99,102,241,0.1)',
        animation: `float ${6 + delay * 2}s ease-in-out infinite`,
      }}
    />
  );
}

export default function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentStage, setCurrentStage] = useState(-1);
  const [phase, setPhase] = useState("hero");
  const resultRef = useRef(null);

  async function handleSubmit(idea) {
    setResult(null);
    setLoading(true);
    setCurrentStage(0);
    setPhase("analyzing");
    try {
      const data = await analyzeIdea(idea, setCurrentStage);
      setResult(data);
      setPhase("results");
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch (err) {
      setResult({ error: "Backend not running. Start uvicorn first." });
      setPhase("results");
    } finally {
      setLoading(false);
      setCurrentStage(-1);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', position: 'relative' }}>
      <GridBackground />

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* Nav */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '24px 48px',
            borderBottom: '1px solid var(--border)',
            backdropFilter: 'blur(20px)',
            position: 'sticky', top: 0, zIndex: 100,
            background: 'rgba(7,7,12,0.8)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, fontWeight: 800,
            }}>M</div>
            <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.5px' }}>MentorAI</span>
          </div>
          <div style={{
            padding: '6px 16px', borderRadius: 100,
            border: '1px solid var(--border-bright)',
            background: 'var(--glow)',
            fontSize: 11, fontFamily: 'var(--font-mono)',
            color: 'var(--accent2)', letterSpacing: '0.1em',
          }}>
            12-STAGE REASONING PIPELINE
          </div>
        </motion.nav>

        {/* Hero */}
        <section style={{
          minHeight: '90vh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '80px 24px', textAlign: 'center', position: 'relative',
        }}>
          <Orb size={400} x="60%" y="10%" delay={0.5} />
          <Orb size={200} x="5%" y="30%" delay={0.8} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 16px 6px 8px', borderRadius: 100,
              border: '1px solid var(--border-bright)',
              background: 'var(--glow)', marginBottom: 40,
            }}
          >
            <span style={{
              background: 'var(--accent)', color: 'white',
              fontSize: 10, fontFamily: 'var(--font-mono)',
              padding: '2px 8px', borderRadius: 100, letterSpacing: '0.1em',
            }}>NEW</span>
            <span style={{ fontSize: 12, color: 'var(--accent2)', fontFamily: 'var(--font-mono)' }}>
              The AI that thinks before it speaks
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            style={{
              fontSize: 'clamp(48px, 8vw, 96px)',
              fontWeight: 800, lineHeight: 1.0,
              letterSpacing: '-3px', marginBottom: 32,
              maxWidth: 900,
            }}
          >
            Turn your idea into
            <br />
            <span style={{
              background: 'linear-gradient(135deg, var(--accent), var(--accent2), #C084FC)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              an execution system.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{
              fontSize: 20, color: 'var(--text2)', maxWidth: 560,
              lineHeight: 1.7, marginBottom: 64,
            }}
          >
            Not a chatbot. A 12-stage reasoning pipeline that thinks like
            a founder, VC, and engineer — simultaneously.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{ width: '100%', maxWidth: 700 }}
          >
            <IdeaInput onSubmit={handleSubmit} loading={loading} />
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            style={{
              display: 'flex', gap: 48, marginTop: 64,
              borderTop: '1px solid var(--border)', paddingTop: 48,
            }}
          >
            {[
              { num: '12', label: 'Reasoning stages' },
              { num: '6', label: 'Expert lenses' },
              { num: '∞', label: 'Ideas analyzed' },
            ].map(({ num, label }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: 36, fontWeight: 800,
                  background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>{num}</div>
                <div style={{ fontSize: 12, color: 'var(--text3)', fontFamily: 'var(--font-mono)', marginTop: 4 }}>
                  {label}
                </div>
              </div>
            ))}
          </motion.div>
        </section>

        {/* Pipeline Tracker */}
        <AnimatePresence>
          {loading && (
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ padding: '0 24px 80px' }}
            >
              <PipelineTracker currentStage={currentStage} />
            </motion.section>
          )}
        </AnimatePresence>

        {/* Results */}
        <div ref={resultRef}>
          <AnimatePresence>
            {result && !loading && (
              <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ padding: '0 24px 120px' }}
              >
                <ResultCards data={result} />
              </motion.section>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          style={{
            textAlign: 'center', padding: '40px 24px',
            borderTop: '1px solid var(--border)',
            color: 'var(--text3)', fontSize: 12,
            fontFamily: 'var(--font-mono)',
          }}
        >
          MENTORAI — THE CO-FOUNDER THAT NEVER SLEEPS
        </motion.footer>

      </div>
    </div>
  );
}