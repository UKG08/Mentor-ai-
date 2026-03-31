import { motion } from "framer-motion";
import { stages } from "./api";

export default function PipelineTracker({ currentStage }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ maxWidth: 680, margin: '0 auto' }}
    >
      <div style={{
        textAlign: 'center', marginBottom: 40,
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          padding: '8px 20px', borderRadius: 100,
          border: '1px solid var(--border-bright)',
          background: 'var(--glow)',
        }}>
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            style={{
              width: 8, height: 8, borderRadius: '50%',
              background: 'var(--accent)',
            }}
          />
          <span style={{
            fontSize: 12, color: 'var(--accent2)',
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.1em',
          }}>
            PIPELINE RUNNING — STAGE {Math.min(currentStage + 1, stages.length)} OF {stages.length}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {stages.map((stage, i) => {
          const done = i < currentStage;
          const active = i === currentStage;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '14px 20px', borderRadius: 14,
                border: `1px solid ${done || active ? 'var(--border-bright)' : 'var(--border)'}`,
                background: done || active ? 'var(--glow)' : 'var(--surface)',
                transition: 'all 0.4s ease',
              }}
            >
              <div style={{
                width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: done ? 'var(--accent)' : active ? 'var(--glow-strong)' : 'var(--surface2)',
                border: `1px solid ${done ? 'var(--accent)' : active ? 'var(--border-bright)' : 'var(--border)'}`,
                fontSize: 11, fontFamily: 'var(--font-mono)',
                color: done ? 'white' : active ? 'var(--accent)' : 'var(--text3)',
                fontWeight: 600,
                transition: 'all 0.4s',
              }}>
                {done ? '✓' : String(i + 1).padStart(2, '0')}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: 13, fontWeight: 500,
                  color: done ? 'var(--text)' : active ? 'var(--accent2)' : 'var(--text3)',
                  transition: 'color 0.4s',
                }}>
                  {stage}
                </div>
              </div>

              {active && (
                <motion.div
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                  style={{
                    fontSize: 10, color: 'var(--accent)',
                    fontFamily: 'var(--font-mono)',
                    letterSpacing: '0.1em',
                  }}
                >
                  RUNNING
                </motion.div>
              )}
              {done && (
                <div style={{
                  fontSize: 10, color: 'var(--success)',
                  fontFamily: 'var(--font-mono)',
                }}>DONE</div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}   