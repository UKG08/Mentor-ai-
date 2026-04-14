'use client'

import { useState, useCallback } from 'react'
import { AnalysisResult } from '@/lib/types'
import { analyzeIdea } from '@/lib/api'

export type AppView = 'landing' | 'loading' | 'results'

export function useAnalysis() {
  const [view,   setView]   = useState<AppView>('landing')
  const [idea,   setIdea]   = useState('')
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error,  setError]  = useState<string | null>(null)

  const submit = useCallback(async () => {
    const trimmed = idea.trim()
    if (!trimmed) return
    setError(null)
    setView('loading')
    setResult(null)
    try {
      const data = await analyzeIdea(trimmed)
      if (data.error) throw new Error(data.error)
      setResult(data)
      setView('results')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Is your backend running?')
      setView('landing')
    }
  }, [idea])

  const reset = useCallback(() => {
    setView('landing')
    setIdea('')
    setResult(null)
    setError(null)
  }, [])

  return { view, idea, result, error, setIdea, submit, reset }
}