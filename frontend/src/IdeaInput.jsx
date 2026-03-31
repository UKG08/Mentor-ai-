import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const examples = [
  "An app that helps developers track their mood while coding...",
  "A tool that turns voice notes into structured action items...",
  "A platform for freelancers to manage clients and invoices...",
  "An AI that reviews your pitch deck like a VC would...",
  "A browser extension that summarizes any webpage instantly...",
];

export default function IdeaInput({ onSubmit, loading }) {
  const [idea, setIdea] = useState("");
  const [exIndex, setExIndex] = useState(0);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (loading) return;
    const t = setInterval(() => setExIndex(i => (i + 1) % examples.length), 3500);
    return () => clearInterval(t);
  }, [loading]);

  return (
    <div style={{ width: '100%' }}>
      <motion.div
        animate={{
          boxShadow: focused
            ? '0 0 0 1px var(--accent), 0 0 60px rgba(99,102,241,0.2)'
            : '0 0 0 1px rgba(255,255,255,0.06)',
        }}
        style={{
          background: 'var(--surface)',
          borderRadius: 20, overflow: 'hidden',
          transition: 'box-shadow 0.3s',
        }}
      >
        <textarea
          rows={4}
          value={idea}
          onChange={e => setIdea(e.target.value)}
          placeholder={examples[exIndex]}
          disabled={loading}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: '100%', background: 'transparent',
            border: 'none', outline: 'none',
            padding: '28px 28px 20px',
            fontSize: 18, color: 'var(--text)',
            fontFamily: 'var(--font-display)',
            resize: 'none', lineHeight: 1.6,
          }}
        />
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          borderTop: '1px solid var(--border)',
          background: 'var(--surface2)',
        }}>
          <span style={{
            fontSize: 11, color: 'var(--text3)',
            fontFamily: 'var(--font-mono)',
          }}>
            {idea.length} chars
          </span>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => idea.trim() && onSubmit(idea)}
            disabled={loading || !idea.trim()}
            style={{
              padding: '12px 32px', borderRadius: 12,
              border: 'none', cursor: idea.trim() && !loading ? 'pointer' : 'not-allowed',
              background: idea.trim() && !loading
                ? 'linear-gradient(135deg, var(--accent), var(--accent2))'
                : 'var(--surface)',
              color: idea.trim() && !loading ? 'white' : 'var(--text3)',
              fontSize: 14, fontWeight: 600,
              fontFamily: 'var(--font-display)',
              letterSpacing: '0.5px',
              transition: 'all 0.3s',
              boxShadow: idea.trim() && !loading
                ? '0 0 30px rgba(99,102,241,0.4)'
                : 'none',
            }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  width: 14, height: 14, borderRadius: '50%',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: 'white',
                  display: 'inline-block',
                  animation: 'spin 0.8s linear infinite',
                }} />
                Analyzing...
              </span>
            ) : 'Analyze idea →'}
          </motion.button>
        </div>
      </motion.div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}