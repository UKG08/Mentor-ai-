import { motion } from "framer-motion";
import { useState } from "react";

function Card({ title, children, delay = 0, highlight = false, danger = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{
        borderRadius: 20, padding: '32px',
        border: danger
          ? '1px solid rgba(239,68,68,0.3)'
          : highlight
          ? '1px solid var(--border-bright)'
          : '1px solid var(--border)',
        background: danger
          ? 'rgba(239,68,68,0.05)'
          : highlight
          ? 'var(--glow)'
          : 'var(--surface)',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {highlight && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 1,
          background: 'linear-gradient(90deg, transparent, var(--accent), transparent)',
        }} />
      )}
      <div style={{
        fontSize: 10, fontFamily: 'var(--font-mono)',
        color: danger ? 'var(--danger)' : 'var(--text3)',
        letterSpacing: '0.15em', marginBottom: 20,
        textTransform: 'uppercase',
      }}>{title}</div>
      {children}
    </motion.div>
  );
}

function Score({ score, label }) {
  const num = parseInt(score);
  const color = num >= 7 ? 'var(--success)' : num >= 5 ? 'var(--warning)' : 'var(--danger)';
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, marginBottom: 16 }}>
      <motion.span
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
        style={{
          fontSize: 80, fontWeight: 800, lineHeight: 1,
          color, fontFamily: 'var(--font-mono)',
        }}
      >{score}</motion.span>
      <span style={{ fontSize: 14, color: 'var(--text3)', marginBottom: 12 }}>{label}</span>
    </div>
  );
}

function Pill({ text, type = 'default' }) {
  const styles = {
    default: { bg: 'var(--glow)', color: 'var(--accent2)', border: 'var(--border-bright)' },
    success: { bg: 'rgba(16,185,129,0.1)', color: 'var(--success)', border: 'rgba(16,185,129,0.3)' },
    warning: { bg: 'rgba(245,158,11,0.1)', color: 'var(--warning)', border: 'rgba(245,158,11,0.3)' },
    danger: { bg: 'rgba(239,68,68,0.1)', color: 'var(--danger)', border: 'rgba(239,68,68,0.3)' },
  };
  const s = styles[type] || styles.default;
  return (
    <span style={{
      padding: '4px 12px', borderRadius: 100,
      background: s.bg, color: s.color,
      border: `1px solid ${s.border}`,
      fontSize: 11, fontFamily: 'var(--font-mono)',
      letterSpacing: '0.05em',
    }}>{text}</span>
  );
}

function InnerBox({ label, value, mono = false }) {
  return (
    <div style={{
      padding: '20px', borderRadius: 14,
      border: '1px solid var(--border)',
      background: 'rgba(7,7,12,0.6)',
    }}>
      <div style={{
        fontSize: 10, color: 'var(--text3)',
        fontFamily: 'var(--font-mono)',
        letterSpacing: '0.12em', marginBottom: 10,
        textTransform: 'uppercase',
      }}>{label}</div>
      <div style={{
        fontSize: 14, color: 'var(--text)',
        lineHeight: 1.6,
        fontFamily: mono ? 'var(--font-mono)' : 'var(--font-display)',
      }}>{value}</div>
    </div>
  );
}

export default function ResultCards({ data }) {
  if (data.error) return (
    <div style={{
      maxWidth: 600, margin: '40px auto', padding: 32,
      borderRadius: 20, border: '1px solid rgba(239,68,68,0.3)',
      background: 'rgba(239,68,68,0.05)',
      color: 'var(--danger)', fontFamily: 'var(--font-mono)',
      textAlign: 'center',
    }}>
      {data.error}
    </div>
  );

  const d = data;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>

      {/* Section header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          textAlign: 'center', marginBottom: 60,
          padding: '0 0 60px',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div style={{
          fontSize: 11, fontFamily: 'var(--font-mono)',
          color: 'var(--text3)', letterSpacing: '0.2em',
          marginBottom: 16,
        }}>ANALYSIS COMPLETE</div>
        <div style={{
          fontSize: 48, fontWeight: 800,
          background: 'linear-gradient(135deg, var(--text), var(--accent2))',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>Your report is ready.</div>
      </motion.div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Confidence Score */}
        <Card title="Confidence score" delay={0} highlight>
          <Score score={d.confidence_score?.score} label="out of 10" />
          <p style={{ color: 'var(--text2)', lineHeight: 1.7, fontSize: 15 }}>
            {d.confidence_score?.reasoning}
          </p>
        </Card>

        {/* Two column */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <Card title="Real problem" delay={0.05}>
            <p style={{ color: 'var(--text)', lineHeight: 1.7, fontSize: 16, fontWeight: 500 }}>
              {d.real_problem}
            </p>
          </Card>
          <Card title="Refined idea" delay={0.08}>
            <p style={{ color: 'var(--text)', lineHeight: 1.7, fontSize: 15 }}>
              {d.refined_idea}
            </p>
          </Card>
        </div>

        {/* Target Users */}
        <Card title="Target users" delay={0.1}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <InnerBox label="Primary user" value={d.target_users?.primary} />
            <InnerBox label="Secondary user" value={d.target_users?.secondary} />
          </div>
          <div style={{
            padding: '16px 20px', borderRadius: 14,
            border: '1px solid var(--border-bright)',
            background: 'var(--glow)',
          }}>
            <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--font-mono)', marginBottom: 8, letterSpacing: '0.12em' }}>PAIN POINT</div>
            <p style={{ color: 'var(--accent2)', fontStyle: 'italic', fontSize: 15, lineHeight: 1.6 }}>
              "{d.target_users?.pain_point}"
            </p>
          </div>
        </Card>

        {/* Market */}
        <Card title="Market analysis" delay={0.15}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <InnerBox label="Competitors" value={d.market?.competitors} />
            <div style={{
              padding: '16px 20px', borderRadius: 14,
              border: '1px solid var(--border-bright)',
              background: 'var(--glow)',
            }}>
              <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--font-mono)', marginBottom: 8, letterSpacing: '0.12em' }}>THE GAP — YOUR OPPORTUNITY</div>
              <p style={{ color: 'var(--accent2)', fontSize: 15, fontWeight: 600, lineHeight: 1.6 }}>{d.market?.gap}</p>
            </div>
            <InnerBox label="Market size" value={d.market?.size} mono />
          </div>
        </Card>

        {/* Moat */}
        <Card title="Competitive moat" delay={0.2}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <Pill text={d.moat?.moat_type} />
            <span style={{ color: 'var(--text)', fontWeight: 600, fontSize: 16 }}>
              {d.moat?.primary_moat}
            </span>
          </div>
          <p style={{ color: 'var(--text2)', lineHeight: 1.7 }}>{d.moat?.build_strategy}</p>
        </Card>

        {/* MVP */}
        <Card title="MVP definition" delay={0.25}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
            {d.mvp?.core_features?.map((f, i) => (
              <div key={i} style={{
                padding: '20px', borderRadius: 14,
                border: '1px solid var(--border)',
                background: 'rgba(7,7,12,0.6)',
              }}>
                <div style={{
                  fontSize: 10, color: 'var(--accent)',
                  fontFamily: 'var(--font-mono)', marginBottom: 10,
                  letterSpacing: '0.12em',
                }}>FEATURE {String(i + 1).padStart(2, '0')}</div>
                <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6 }}>{f}</p>
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <InnerBox label="Cut from v1" value={d.mvp?.cut_from_v1} />
            <InnerBox label="Build time" value={d.mvp?.build_time} mono />
          </div>
          <div style={{
            marginTop: 12, padding: '16px 20px', borderRadius: 14,
            border: '1px solid rgba(239,68,68,0.25)',
            background: 'rgba(239,68,68,0.05)',
          }}>
            <div style={{ fontSize: 10, color: 'var(--danger)', fontFamily: 'var(--font-mono)', marginBottom: 8, letterSpacing: '0.12em' }}>DANGEROUS ASSUMPTION TO VALIDATE</div>
            <p style={{ color: 'var(--text)', fontSize: 14, lineHeight: 1.6 }}>{d.mvp?.dangerous_assumption}</p>
          </div>
        </Card>

        {/* Tech Stack */}
        <Card title="Tech stack" delay={0.3}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {d.tech_stack && Object.entries(d.tech_stack).map(([key, value]) => (
              <InnerBox key={key} label={key.replace(/_/g, ' ')} value={value} />
            ))}
          </div>
        </Card>

        {/* Execution Plan */}
        <Card title="30-day execution plan" delay={0.35}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {d.execution_plan && Object.entries(d.execution_plan).map(([week, plan], i) => (
              <div key={week} style={{
                display: 'flex', gap: 20, alignItems: 'flex-start',
                padding: '20px 0',
                borderBottom: i < 3 ? '1px solid var(--border)' : 'none',
              }}>
                <div style={{
                  width: 80, flexShrink: 0,
                  fontSize: 11, color: 'var(--accent)',
                  fontFamily: 'var(--font-mono)', letterSpacing: '0.1em',
                  paddingTop: 2,
                }}>
                  {week.replace('_', ' ').toUpperCase()}
                </div>
                <div style={{
                  flex: 1, fontSize: 14, color: 'var(--text)',
                  lineHeight: 1.7,
                }}>{plan}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* GTM */}
        <Card title="Go-to-market strategy" delay={0.4}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {d.go_to_market && Object.entries(d.go_to_market).map(([key, value]) => (
              <InnerBox key={key} label={key.replace(/_/g, ' ')} value={value} />
            ))}
          </div>
        </Card>

        {/* Expert Panel */}
        <Card title="Expert panel" delay={0.45}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            {[
              { role: 'Founder', key: 'founder', type: 'warning' },
              { role: 'VC', key: 'vc', type: 'success' },
              { role: 'Engineer', key: 'engineer', type: 'default' },
            ].map(({ role, key, type }) => (
              <div key={key} style={{
                padding: 24, borderRadius: 16,
                border: '1px solid var(--border)',
                background: 'rgba(7,7,12,0.6)',
              }}>
                <Pill text={role} type={type} />
                <p style={{
                  color: 'var(--text2)', fontSize: 13,
                  lineHeight: 1.7, marginTop: 16,
                }}>
                  {d.expert_panel?.[key]}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Two column bottom */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <Card title="Investor readiness" delay={0.5}>
            <Score score={d.investor_readiness?.score} label="fundability" />
            <p style={{ color: 'var(--text2)', lineHeight: 1.7, fontSize: 14 }}>
              {d.investor_readiness?.what_to_fix}
            </p>
          </Card>
          <Card title="Pivot option" delay={0.52}>
            <p style={{ color: 'var(--text)', lineHeight: 1.7, fontSize: 15, marginTop: 8 }}>
              {d.pivot_option}
            </p>
          </Card>
        </div>

        {/* Watch Out */}
        <Card title="⚠ Watch out" delay={0.55} danger>
          <p style={{ color: 'var(--text)', fontSize: 18, fontWeight: 600, lineHeight: 1.6 }}>
            {d.watch_out}
          </p>
        </Card>

      </div>
    </div>
  );
}