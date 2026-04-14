'use client'

import { useEffect, useRef, useState } from 'react'

const STAGES = [
  { num:'01', name:'Problem Deep-Dive',    seconds:4 },
  { num:'02', name:'Persona Mapping',       seconds:4 },
  { num:'03', name:'Market Intelligence',   seconds:5 },
  { num:'04', name:"Devil's Advocate",      seconds:4 },
  { num:'05', name:'Idea Hardening',        seconds:4 },
  { num:'06', name:'Moat Analysis',         seconds:4 },
  { num:'07', name:'Go-To-Market',          seconds:4 },
  { num:'08', name:'MVP Definition',        seconds:5 },
  { num:'09', name:'Tech Architecture',     seconds:4 },
  { num:'10', name:'Execution Plan',        seconds:5 },
  { num:'11', name:'Expert Panel Review',   seconds:5 },
  { num:'12', name:'Final Synthesis',       seconds:6 },
]

export function LoadingPipeline({ idea }: { idea: string }) {
  const [activeIdx, setActiveIdx] = useState(0)
  const [doneIdxs,  setDoneIdxs]  = useState<number[]>([])
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setActiveIdx(0); setDoneIdxs([])
    let current = 0
    function advance() {
      if (current >= STAGES.length) return
      setActiveIdx(current)
      timerRef.current = setTimeout(() => {
        setDoneIdxs(prev => [...prev, current])
        current++
        advance()
      }, STAGES[current].seconds * 1000)
    }
    advance()
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [])

  return (
    <section style={{ minHeight:'100vh', display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center', gap:'2.5rem',
      padding:'2rem 1.5rem', background:'var(--bg)' }}>

      <div style={{ textAlign:'center' }}>
        <p style={{ fontFamily:'var(--mono)', fontSize:11, color:'var(--muted)',
          letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:8 }}>
          Analyzing your idea
        </p>
        <p className="font-serif" style={{ fontSize:'clamp(1.2rem,3vw,1.6rem)',
          color:'var(--text)', maxWidth:560 }}>
          &ldquo;{idea}&rdquo;
        </p>
      </div>

      <div style={{ width:'100%', maxWidth:520 }}>
        {STAGES.map((stage, idx) => {
          const isDone   = doneIdxs.includes(idx)
          const isActive = activeIdx === idx && !isDone
          return (
            <div key={idx} style={{ display:'flex', alignItems:'center', gap:12,
              padding:'9px 0 9px 20px',
              borderLeft:`2px solid ${isDone ? 'var(--sage)' : isActive ? 'var(--gold)' : 'var(--border)'}`,
              opacity: isDone ? 0.55 : isActive ? 1 : 0.25,
              transition:'opacity 0.5s, border-color 0.5s' }}>
              <span style={{ fontFamily:'var(--mono)', fontSize:11, minWidth:24,
                color: isDone ? 'var(--sage)' : isActive ? 'var(--gold)' : 'var(--muted)',
                transition:'color 0.5s' }}>
                {stage.num}
              </span>
              <span style={{ fontSize:13, flex:1,
                color: isActive ? 'var(--text)' : 'var(--muted)', transition:'color 0.5s' }}>
                {stage.name}
              </span>
              {isActive && (
                <div style={{ width:14, height:14, border:'1.5px solid var(--border)',
                  borderTopColor:'var(--gold)', borderRadius:'50%',
                  animation:'spin 0.8s linear infinite', flexShrink:0 }} />
              )}
              {isDone && <span style={{ color:'var(--sage)', fontSize:12, flexShrink:0 }}>✓</span>}
            </div>
          )
        })}
      </div>

      <p style={{ fontFamily:'var(--mono)', fontSize:11, color:'var(--muted)', letterSpacing:'0.06em' }}>
        Running pipeline — this takes about 30 seconds…
      </p>
    </section>
  )
}