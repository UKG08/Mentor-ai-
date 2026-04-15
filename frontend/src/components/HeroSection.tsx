'use client'

import { useEffect, useRef, useState } from 'react'

function useWindowWidth() {
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024)
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return width
}

const PAIN_WORDS = [
  'what do I build first', 'is this even worth it', 'where do I start',
  'will anyone use this', 'how do I validate', "what's the MVP",
  'am I too late', 'should I pivot', "who's my target",
  "what's the tech stack", 'how do I monetize', 'is this scalable',
  'do I need a co-founder', "what's my moat", 'can I raise funding',
  'what should I cut', 'who are my competitors', 'how do I price this',
]

const STAGES = [
  '01 Problem', '02 Persona', '03 Market', '04 Critique',
  '05 Hardening', '06 Moat', '07 GTM', '08 MVP',
  '09 Tech', '10 Execution', '11 Panel', '12 Synthesis',
]

interface HeroSectionProps {
  idea: string
  error: string | null
  onIdeaChange: (v: string) => void
  onSubmit: () => void
}

export function HeroSection({ idea, error, onIdeaChange, onSubmit }: HeroSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const width = useWindowWidth()
  const isMobile = width < 640

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    PAIN_WORDS.forEach((word, i) => {
      const el = document.createElement('span')
      el.textContent = word
      el.style.cssText = `
        position:absolute; font-family:var(--mono); font-size:11px;
        color:var(--muted); pointer-events:none; user-select:none;
        white-space:nowrap;
        left:${Math.random() * 86 + 2}%; top:${Math.random() * 86 + 2}%;
        opacity:0;
        animation: driftIn 3s ease-out ${i * 0.2}s forwards,
                   pulseGlow ${4 + Math.random() * 3}s ease-in-out ${i * 0.2 + 3}s infinite;
      `
      container.appendChild(el)
    })
    return () => { container.innerHTML = '' }
  }, [])

  return (
    <section style={{ minHeight:'100vh', display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center', position:'relative',
      overflow:'hidden', padding:'2rem', background:'var(--bg)' }}>

      {/* Grid */}
      <div className="absolute inset-0 bg-grid pointer-events-none" />

      {/* Glow orb */}
      <div style={{ position:'absolute', width:700, height:700, borderRadius:'50%',
        background:'radial-gradient(circle, rgba(200,169,110,0.07) 0%, transparent 70%)',
        top:'50%', left:'50%', transform:'translate(-50%,-55%)', pointerEvents:'none' }} />

      {/* Pain words */}
      <div ref={containerRef} style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none' }} />

      {/* Content */}
      <div style={{ position:'relative', zIndex:2, textAlign:'center', maxWidth:640, width:'100%' }}>

        <div className="pill" style={{ color:'var(--gold)', marginBottom:'2rem', display:'inline-flex' }}>
          <span style={{ width:6, height:6, borderRadius:'50%', background:'var(--gold)',
            animation:'blink 2s ease-in-out infinite', display:'inline-block' }} />
          12-Stage AI Reasoning Pipeline
        </div>

        <h1 className="font-serif" style={{ fontSize:'clamp(2.2rem,6vw,4.2rem)', lineHeight:1.08,
          color:'var(--text)', opacity:0, animation:'revealUp 0.7s ease 0.2s forwards', marginBottom:'1.25rem' }}>
          You have the idea.<br />
          <em style={{ color:'var(--gold)', fontStyle:'italic' }}>We&apos;ll tell you the truth.</em>
        </h1>

        <p style={{ fontSize:'1rem', color:'var(--muted)', lineHeight:1.65, maxWidth:480,
          margin:'0 auto 2.5rem', opacity:0, animation:'revealUp 0.7s ease 0.4s forwards' }}>
          MentorAI thinks like a technical co-founder, a VC, and a senior engineer — simultaneously.
          Drop your idea. Get a complete execution brief in ~30 seconds.
        </p>

        {/* Input */}
        <div style={{ opacity:0, animation:'revealUp 0.7s ease 0.6s forwards' }}>
          <div style={{
            display:'flex', flexDirection: isMobile ? 'column' : 'row',
            border:'1.5px solid var(--border)', borderRadius:10,
            background:'var(--surface)', overflow:'hidden', transition:'border-color 0.25s' }}
            onFocus={e => (e.currentTarget.style.borderColor = 'var(--gold)')}
            onBlur={e  => (e.currentTarget.style.borderColor = 'var(--border)')}>
            <input
              value={idea}
              onChange={e => onIdeaChange(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && onSubmit()}
              placeholder="Describe your startup idea..."
              maxLength={500}
              style={{ flex:1, background:'transparent', border:'none', outline:'none',
                padding:'1rem 1.25rem', fontFamily:'var(--sans)', fontSize:'0.95rem', color:'var(--text)' }}
            />
            <button onClick={onSubmit} disabled={!idea.trim()}
              style={{ background:'var(--gold)', color:'#0C0E11', border:'none',
                padding: isMobile ? '0.85rem 1.5rem' : '0 1.5rem',
                fontFamily:'var(--sans)', fontWeight:600,
                fontSize:'0.9rem', cursor: idea.trim() ? 'pointer' : 'not-allowed',
                opacity: idea.trim() ? 1 : 0.5, transition:'background 0.2s', whiteSpace:'nowrap' }}>
              Analyze →
            </button>
          </div>

          {error && (
            <div style={{ marginTop:10, padding:'10px 14px', background:'var(--terra-dim)',
              border:'1px solid rgba(196,107,78,0.35)', borderRadius:8,
              fontSize:13, color:'var(--terra)', fontFamily:'var(--mono)', textAlign:'left' }}>
              {error}
            </div>
          )}
        </div>

        {/* Trust */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap: isMobile ? '1rem' : '2rem',
          marginTop:'1.5rem', opacity:0, animation:'revealUp 0.7s ease 0.8s forwards', flexWrap:'wrap' }}>
          {['No login required','Groq + Llama 3.3 70B','~30 seconds'].map(label => (
            <div key={label} style={{ display:'flex', alignItems:'center', gap:6 }}>
              <span style={{ width:6, height:6, borderRadius:'50%', background:'var(--sage)', display:'inline-block' }} />
              <span style={{ fontFamily:'var(--mono)', fontSize:11, color:'var(--muted)' }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Stage pills */}
        <div style={{ display:'flex', flexWrap:'wrap', justifyContent:'center', gap:6,
          marginTop:'2.5rem', opacity:0, animation:'revealUp 0.7s ease 1s forwards' }}>
          {STAGES.map(s => (
            <span key={s} style={{ fontFamily:'var(--mono)', fontSize:10, padding:'3px 10px',
              border:'1px solid var(--border)', borderRadius:100, color:'var(--muted-2)', letterSpacing:'0.05em' }}>
              {s}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
