'use client'

import { useEffect, useState } from 'react'
import { AnalysisResult } from '@/lib/types'

function useWindowWidth() {
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024)
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return width
}

interface Props {
  result: AnalysisResult
  idea: string
  onBack: () => void
}

const safe = (v?: string) => v || '—'

function parseScore(s?: string): number {
  if (!s) return 0
  const m = s.match(/(\d+(?:\.\d+)?)\s*\/\s*10/)
  return m ? Math.min(10, Math.max(0, parseFloat(m[1]))) : 0
}

function MetaLabel({ children, color }: { children: string; color?: string }) {
  return (
    <div style={{
      fontFamily: 'var(--mono)', fontSize: 10,
      color: color || 'var(--muted)',
      letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6,
    }}>
      {children}
    </div>
  )
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 14, padding: '1.25rem 1.5rem', ...style,
    }}>
      {children}
    </div>
  )
}

function SectionHeading({ children, accent }: { children: string; accent: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.25rem' }}>
      <div style={{ width: 3, height: 18, borderRadius: 2, background: accent, flexShrink: 0 }} />
      <span style={{
        fontFamily: 'var(--mono)', fontSize: 11, color: accent,
        letterSpacing: '0.12em', textTransform: 'uppercase',
      }}>
        {children}
      </span>
    </div>
  )
}

// ── Animated Score Ring ───────────────────────────────────
function ScoreRing({ score, color, size = 120, label }: {
  score: number; color: string; size?: number; label: string
}) {
  const [displayed, setDisplayed] = useState(0)
  const [offset, setOffset] = useState(0)
  const r = (size - 16) / 2
  const circ = 2 * Math.PI * r

  useEffect(() => {
    const pct = score / 10
    let start: number | null = null
    const duration = 1200
    function animate(ts: number) {
      if (!start) start = ts
      const p = Math.min((ts - start) / duration, 1)
      const ease = 1 - Math.pow(1 - p, 3)
      setDisplayed(Math.round(score * ease))
      setOffset(circ - pct * ease * circ)
      if (p < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [score, circ])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size/2} cy={size/2} r={r} fill="none"
            stroke="var(--border)" strokeWidth={8} />
          <circle cx={size/2} cy={size/2} r={r} fill="none"
            stroke={color} strokeWidth={8}
            strokeDasharray={circ} strokeDashoffset={offset}
            strokeLinecap="round" />
        </svg>
        <div style={{
          position: 'absolute', inset: 0, display: 'flex',
          flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{
            fontFamily: 'var(--serif)',
            fontSize: size > 100 ? 28 : 22,
            color, lineHeight: 1,
          }}>
            {displayed}
          </span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)' }}>/10</span>
        </div>
      </div>
      <span style={{
        fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)',
        letterSpacing: '0.08em', textTransform: 'uppercase',
      }}>
        {label}
      </span>
    </div>
  )
}

// ── Animated Progress Bar ─────────────────────────────────
function ProgressBar({ value, color, label, sublabel }: {
  value: number; color: string; label: string; sublabel?: string
}) {
  const [width, setWidth] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setWidth(Math.min(100, value)), 200)
    return () => clearTimeout(t)
  }, [value])

  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{ fontSize: 12, color: 'var(--text)' }}>{label}</span>
        {sublabel && (
          <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color }}>{sublabel}</span>
        )}
      </div>
      <div style={{ height: 6, background: 'var(--border)', borderRadius: 100, overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: 100,
          background: `linear-gradient(90deg, ${color}88, ${color})`,
          width: `${width}%`,
          transition: 'width 1.2s cubic-bezier(0.34,1.56,0.64,1)',
        }} />
      </div>
    </div>
  )
}

// ── Tech Stack Row ────────────────────────────────────────
const TECH_ICONS: Record<string, string> = {
  frontend: '⬡', backend: '◈', ai_layer: '◉',
  database: '⬢', hosting: '△', avoid: '✕',
}
const TECH_COLORS: Record<string, string> = {
  frontend:  '#7B9E87',
  backend:   '#C8A96E',
  ai_layer:  '#9B7FD4',
  database:  '#4E9EC4',
  hosting:   '#C46B4E',
  avoid:     '#7A7772',
}

function TechRow({ techKey, label, value }: {
  techKey: string; label: string; value: string
}) {
  const color = TECH_COLORS[techKey] || 'var(--muted)'
  const isAvoid = techKey === 'avoid'
  return (
    <div style={{
      display: 'flex', gap: 14, alignItems: 'flex-start',
      padding: '10px 0', borderBottom: '1px solid var(--border)',
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8, flexShrink: 0,
        background: `${color}18`, border: `1px solid ${color}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 14, color,
      }}>
        {TECH_ICONS[techKey] || '◆'}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{
          fontFamily: 'var(--mono)', fontSize: 10, color,
          letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 3,
        }}>
          {label}
        </div>
        <div style={{ fontSize: 13, color: isAvoid ? '#e89880' : 'var(--text)', lineHeight: 1.5 }}>
          {value}
        </div>
      </div>
    </div>
  )
}

// ── Week Timeline ─────────────────────────────────────────
function WeekCard({ num, content, color, isLast }: {
  num: number; content: string; color: string; isLast: boolean
}) {
  const parts = content.split('|').map(p => p.trim())
  const partLabels = ['Build', 'Decision', 'Milestone']
  const partColors = ['var(--sage)', 'var(--gold)', 'var(--terra)']

  return (
    <div style={{ display: 'flex', gap: 0 }}>
      {/* Spine */}
      <div style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', marginRight: 16, flexShrink: 0,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: `${color}18`, border: `2px solid ${color}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--mono)', fontSize: 11, color, fontWeight: 500,
        }}>
          W{num}
        </div>
        {!isLast && (
          <div style={{
            width: 2, flex: 1, minHeight: 24,
            background: `${color}25`, margin: '4px 0',
          }} />
        )}
      </div>
      {/* Content */}
      <div style={{ flex: 1, paddingBottom: isLast ? 0 : 20 }}>
        <div style={{
          background: 'var(--surface2)', borderRadius: 10,
          padding: '12px 14px', borderLeft: `3px solid ${color}`,
        }}>
          {parts.length > 1 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {parts.map((part, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{
                    fontFamily: 'var(--mono)', fontSize: 9,
                    color: partColors[i] || 'var(--muted)',
                    minWidth: 58, paddingTop: 2,
                    letterSpacing: '0.06em', textTransform: 'uppercase', flexShrink: 0,
                  }}>
                    {partLabels[i] || ''}
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--text)', lineHeight: 1.5 }}>{part}</span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: 12, color: 'var(--text)', lineHeight: 1.55, margin: 0 }}>
              {content}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Expert Card ───────────────────────────────────────────
function ExpertCard({ label, role, text, color, bg, icon }: {
  label: string; role: string; text: string
  color: string; bg: string; icon: string
}) {
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 14, padding: '1.25rem', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: color,
      }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <div style={{
          width: 38, height: 38, borderRadius: 10, background: bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
        }}>
          {icon}
        </div>
        <div>
          <div style={{
            fontFamily: 'var(--mono)', fontSize: 10, color,
            letterSpacing: '0.1em', textTransform: 'uppercase',
          }}>
            {label}
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 1 }}>{role}</div>
        </div>
      </div>
      <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.65, margin: 0 }}>{text}</p>
    </div>
  )
}

// ── Moat Bars ─────────────────────────────────────────────
const MOAT_TYPES = [
  { key: 'network_effects', label: 'Network Effects'  },
  { key: 'data',            label: 'Data Advantage'   },
  { key: 'switching_costs', label: 'Switching Costs'  },
  { key: 'brand',           label: 'Brand / Community'},
  { key: 'distribution',    label: 'Distribution Lock'},
]

function MoatBars({ primaryType }: { primaryType: string }) {
  const clean = primaryType.toLowerCase()
  const scores: Record<string, number> = {
    network_effects: 35, data: 35, switching_costs: 35, brand: 35, distribution: 35,
  }
  MOAT_TYPES.forEach(({ key }) => {
    if (clean.includes(key.replace(/_/g, ' ')) || clean.includes(key)) {
      scores[key] = 88
    }
  })
  return (
    <div style={{ marginTop: 4 }}>
      {MOAT_TYPES.map(({ key, label }) => (
        <ProgressBar
          key={key}
          value={scores[key]}
          color={scores[key] > 50 ? 'var(--gold)' : '#383E49'}
          label={label}
          sublabel={scores[key] > 50 ? 'Primary ↑' : 'Weak'}
        />
      ))}
    </div>
  )
}

// ── MAIN COMPONENT ────────────────────────────────────────
export function ResultsReport({ result: d, idea, onBack }: Props) {
  const confScore = parseScore(d.confidence_score?.score)
  const invScore  = parseScore(d.investor_readiness?.score)
  const WEEK_COLORS = ['var(--sage)', 'var(--terra)', 'var(--gold)', '#9B7FD4']
  const width = useWindowWidth()
  const isMobile = width < 640
  const isTablet = width < 900

  return (
    <div style={{ maxWidth: 940, margin: '0 auto', padding: isMobile ? '1.25rem 0.75rem 4rem' : '2rem 1.25rem 6rem' }}>

      {/* ── HEADER ── */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        gap: '1rem', marginBottom: '2.5rem', paddingBottom: '1.5rem',
        borderBottom: '1px solid var(--border)', flexWrap: 'wrap',
      }}>
        <div>
          <div style={{
            fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--gold)',
            letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6,
          }}>
            MentorAI Report
          </div>
          <h2 className="font-serif" style={{
            fontSize: 'clamp(1.4rem,4vw,2.1rem)',
            color: 'var(--text)', marginBottom: 4, lineHeight: 1.1,
          }}>
            {idea}
          </h2>
          <p style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)' }}>
            12-stage analysis complete
          </p>
        </div>
        <button
          onClick={onBack}
          style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            color: 'var(--muted)', padding: '8px 16px', borderRadius: 8,
            fontFamily: 'var(--mono)', fontSize: 11, cursor: 'pointer',
            letterSpacing: '0.05em', whiteSpace: 'nowrap', flexShrink: 0,
          }}
          onMouseEnter={e => {
            const b = e.currentTarget
            b.style.color = 'var(--text)'
            b.style.borderColor = 'var(--gold)'
          }}
          onMouseLeave={e => {
            const b = e.currentTarget
            b.style.color = 'var(--muted)'
            b.style.borderColor = 'var(--border)'
          }}
        >
          ← New Idea
        </button>
      </div>

      {/* ── SCORES + PROBLEM ── */}
      <div style={{
        display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'auto 1fr',
        gap: 12, marginBottom: 12,
      }}>
        <Card style={{
          display: 'flex', flexDirection: isMobile ? 'row' : 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: isMobile ? 20 : 28, padding: isMobile ? '1.25rem' : '1.5rem 2.5rem',
        }}>
          <ScoreRing score={confScore} color="var(--gold)" label="Confidence" size={isMobile ? 90 : 120} />
          <ScoreRing score={invScore}  color="var(--sage)" label="Investor Ready" size={isMobile ? 90 : 120} />
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Card style={{ flex: 1 }}>
            <SectionHeading accent="var(--gold)">Real Problem</SectionHeading>
            <p style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.7, margin: 0 }}>
              {safe(d.real_problem)}
            </p>
          </Card>
          <Card style={{ flex: 1 }}>
            <SectionHeading accent="var(--sage)">Refined Idea</SectionHeading>
            <p style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.7, margin: 0 }}>
              {safe(d.refined_idea)}
            </p>
          </Card>
          <Card style={{
            background: 'rgba(196,107,78,0.06)',
            borderColor: 'rgba(196,107,78,0.2)',
          }}>
            <SectionHeading accent="var(--terra)">Score Reasoning</SectionHeading>
            <p style={{ fontSize: 13, color: '#e8a080', lineHeight: 1.65, margin: 0 }}>
              {safe(d.confidence_score?.reasoning)}
            </p>
          </Card>
        </div>
      </div>

      {/* ── TARGET USERS ── */}
      <Card style={{ marginBottom: 12 }}>
        <SectionHeading accent="var(--gold)">Target Users</SectionHeading>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12, marginBottom: 14 }}>
          <div style={{ background: 'var(--surface2)', borderRadius: 10, padding: '12px 14px' }}>
            <MetaLabel color="var(--gold)">Primary User</MetaLabel>
            <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6, margin: 0 }}>
              {safe(d.target_users?.primary)}
            </p>
          </div>
          <div style={{ background: 'var(--surface2)', borderRadius: 10, padding: '12px 14px' }}>
            <MetaLabel>Secondary User</MetaLabel>
            <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6, margin: 0 }}>
              {safe(d.target_users?.secondary)}
            </p>
          </div>
        </div>
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14 }}>
          <MetaLabel>Pain point — in their voice</MetaLabel>
          <p style={{ fontSize: 15, fontStyle: 'italic', color: 'var(--muted)', lineHeight: 1.7, margin: 0 }}>
            &ldquo;{safe(d.target_users?.pain_point)}&rdquo;
          </p>
        </div>
      </Card>

      {/* ── MARKET ANALYSIS ── */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <Card>
          <SectionHeading accent="var(--terra)">Market Size</SectionHeading>
          <ProgressBar value={100} color="var(--terra)" label="Total Addressable Market (TAM)" />
          <ProgressBar value={62}  color="var(--gold)"  label="Serviceable Addressable Market (SAM)" />
          <ProgressBar value={28}  color="var(--sage)"  label="Realistically Capturable (SOM)" />
          <div style={{ marginTop: 10, padding: '10px 12px', background: 'var(--surface2)', borderRadius: 8 }}>
            <MetaLabel>Figures from analysis</MetaLabel>
            <p style={{ fontSize: 12, color: 'var(--text)', lineHeight: 1.6, margin: 0 }}>
              {safe(d.market?.size)}
            </p>
          </div>
        </Card>
        <Card>
          <SectionHeading accent="var(--terra)">Competitive Landscape</SectionHeading>
          <div style={{ marginBottom: 14 }}>
            <MetaLabel color="var(--terra)">Competitors</MetaLabel>
            <p style={{ fontSize: 12, color: 'var(--text)', lineHeight: 1.65, margin: 0 }}>
              {safe(d.market?.competitors)}
            </p>
          </div>
          <div style={{ paddingTop: 12, borderTop: '1px solid var(--border)' }}>
            <MetaLabel color="var(--sage)">The Whitespace Gap</MetaLabel>
            <p style={{ fontSize: 12, color: 'var(--sage)', lineHeight: 1.65, margin: 0 }}>
              {safe(d.market?.gap)}
            </p>
          </div>
        </Card>
      </div>

      {/* ── MOAT ── */}
      <Card style={{ marginBottom: 12 }}>
        <SectionHeading accent="var(--gold)">Competitive Moat</SectionHeading>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 20 }}>
          <MoatBars primaryType={d.moat?.moat_type || ''} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ background: 'var(--surface2)', borderRadius: 10, padding: '12px 14px' }}>
              <MetaLabel color="var(--gold)">Primary Moat</MetaLabel>
              <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6, margin: '0 0 8px' }}>
                {safe(d.moat?.primary_moat)}
              </p>
              <span style={{
                fontFamily: 'var(--mono)', fontSize: 10, padding: '3px 10px',
                borderRadius: 100, background: 'var(--gold-dim)',
                color: 'var(--gold)', letterSpacing: '0.06em',
              }}>
                {(d.moat?.moat_type || '').replace(/_/g, ' ')}
              </span>
            </div>
            <div style={{ background: 'var(--surface2)', borderRadius: 10, padding: '12px 14px' }}>
              <MetaLabel>90-Day Build Strategy</MetaLabel>
              <p style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.6, margin: 0 }}>
                {safe(d.moat?.build_strategy)}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* ── MVP ── */}
      <Card style={{ marginBottom: 12 }}>
        <SectionHeading accent="var(--sage)">MVP — v1 Scope</SectionHeading>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
          <div>
            <MetaLabel color="var(--sage)">3 Core Features</MetaLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {(d.mvp?.core_features || []).map((f, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 10, alignItems: 'flex-start',
                  padding: '10px 12px', background: 'var(--surface2)',
                  borderRadius: 8, borderLeft: '2px solid var(--sage)',
                }}>
                  <span style={{
                    fontFamily: 'var(--mono)', fontSize: 11,
                    color: 'var(--sage)', minWidth: 16, flexShrink: 0,
                  }}>
                    0{i + 1}
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--text)', lineHeight: 1.55 }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ padding: '12px 14px', background: 'var(--surface2)', borderRadius: 10 }}>
              <MetaLabel>Cut from v1</MetaLabel>
              <p style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.6, margin: 0 }}>
                {safe(d.mvp?.cut_from_v1)}
              </p>
            </div>
            <div style={{
              padding: '12px 14px', borderRadius: 10,
              background: 'rgba(196,107,78,0.07)',
              border: '1px solid rgba(196,107,78,0.2)',
            }}>
              <MetaLabel color="var(--terra)">⚠ Dangerous Assumption</MetaLabel>
              <p style={{ fontSize: 12, color: '#e8a080', lineHeight: 1.6, margin: 0 }}>
                {safe(d.mvp?.dangerous_assumption)}
              </p>
            </div>
            <div style={{ padding: '12px 14px', background: 'var(--surface2)', borderRadius: 10 }}>
              <MetaLabel>Build Time</MetaLabel>
              <p style={{ fontFamily: 'var(--serif)', fontSize: 20, color: 'var(--gold)', margin: 0 }}>
                {safe(d.mvp?.build_time)}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* ── TECH STACK ── */}
      <Card style={{ marginBottom: 12 }}>
        <SectionHeading accent="var(--terra)">Tech Stack</SectionHeading>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '0 24px' }}>
          {(['frontend', 'backend', 'ai_layer', 'database', 'hosting', 'avoid'] as const).map((key) => {
            const labels: Record<string, string> = {
              frontend: 'Frontend', backend: 'Backend', ai_layer: 'AI Layer',
              database: 'Database', hosting: 'Hosting', avoid: 'Avoid Custom',
            }
            const val = d.tech_stack?.[key]
            if (!val) return null
            return <TechRow key={key} techKey={key} label={labels[key]} value={val} />
          })}
        </div>
      </Card>

      {/* ── 30-DAY EXECUTION PLAN ── */}
      <Card style={{ marginBottom: 12 }}>
        <SectionHeading accent="var(--gold)">30-Day Execution Plan</SectionHeading>
        <div style={{ paddingLeft: 4 }}>
          {(['week_1', 'week_2', 'week_3', 'week_4'] as const).map((key, i) => (
            <WeekCard
              key={key}
              num={i + 1}
              content={safe(d.execution_plan?.[key])}
              color={WEEK_COLORS[i]}
              isLast={i === 3}
            />
          ))}
        </div>
      </Card>

      {/* ── GTM ── */}
      <Card style={{ marginBottom: 12 }}>
        <SectionHeading accent="var(--gold)">Go-To-Market</SectionHeading>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 10 }}>
          {([
            ['first_10_users',  'First 10 Users',  'var(--sage)' ],
            ['first_100_users', 'First 100 Users', 'var(--gold)' ],
            ['positioning',     'Positioning',     'var(--terra)'],
            ['pricing',         'Pricing',         '#9B7FD4'     ],
            ['key_partnership', 'Key Partnership', 'var(--sage)' ],
          ] as const).map(([key, label, color]) => {
            const val = d.go_to_market?.[key as keyof typeof d.go_to_market]
            if (!val) return null
            return (
              <div key={key} style={{
                padding: '12px 14px', background: 'var(--surface2)',
                borderRadius: 10, borderLeft: `3px solid ${color}`,
              }}>
                <MetaLabel color={color}>{label}</MetaLabel>
                <p style={{ fontSize: 12, color: 'var(--text)', lineHeight: 1.6, margin: 0 }}>{val}</p>
              </div>
            )
          })}
        </div>
      </Card>

      {/* ── EXPERT PANEL ── */}
      <div style={{ marginBottom: 12 }}>
        <div style={{
          fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)',
          letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10,
        }}>
          Expert Panel
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr 1fr' : '1fr 1fr 1fr', gap: 10 }}>
          <ExpertCard
            label="Founder" role="Been there, failed once"
            text={safe(d.expert_panel?.founder)}
            color="var(--terra)" bg="rgba(196,107,78,0.12)" icon="🔥"
          />
          <ExpertCard
            label="VC" role="100 pitches this year"
            text={safe(d.expert_panel?.vc)}
            color="var(--gold)" bg="rgba(200,169,110,0.12)" icon="💰"
          />
          <ExpertCard
            label="Engineer" role="Solo builder, 6-week clock"
            text={safe(d.expert_panel?.engineer)}
            color="var(--sage)" bg="rgba(123,158,135,0.12)" icon="⚙️"
          />
        </div>
      </div>

      {/* ── INVESTOR READINESS ── */}
      <Card style={{ marginBottom: 12 }}>
        <SectionHeading accent="var(--sage)">Investor Readiness</SectionHeading>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'auto 1fr', gap: 28, alignItems: 'center' }}>
          <ScoreRing score={invScore} color="var(--sage)" label="Fundable" size={isMobile ? 80 : 100} />
          <div>
            <ProgressBar
              value={invScore * 10}
              color="var(--sage)"
              label="Fundability score"
              sublabel={safe(d.investor_readiness?.score)}
            />
            <MetaLabel color="var(--terra)">What to fix</MetaLabel>
            <p style={{ fontSize: 13, color: '#e8a080', lineHeight: 1.65, margin: 0 }}>
              {safe(d.investor_readiness?.what_to_fix)}
            </p>
          </div>
        </div>
      </Card>

      {/* ── WATCH OUT + PIVOT ── */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12 }}>
        <div style={{
          background: 'rgba(196,107,78,0.07)',
          border: '1px solid rgba(196,107,78,0.25)',
          borderRadius: 14, padding: '1.25rem 1.5rem',
        }}>
          <SectionHeading accent="var(--terra)">⚠ Watch Out</SectionHeading>
          <p style={{ fontSize: 13, color: '#e8a080', lineHeight: 1.7, margin: 0 }}>
            {safe(d.watch_out)}
          </p>
        </div>
        <Card>
          <SectionHeading accent="var(--sage)">Pivot Option</SectionHeading>
          <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7, margin: 0 }}>
            {safe(d.pivot_option)}
          </p>
        </Card>
      </div>

    </div>
  )
}
