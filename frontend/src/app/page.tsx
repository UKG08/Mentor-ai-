'use client'

import { useAnalysis }     from '@/hooks/useAnalysis'
import { HeroSection }     from '@/components/HeroSection'
import { LoadingPipeline } from '@/components/LoadingPipeline'
import { ResultsReport }   from '@/components/ResultsReport'

export default function MentorAIPage() {
  const { view, idea, result, error, setIdea, submit, reset } = useAnalysis()

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {view === 'landing' && (
        <HeroSection
          idea={idea}
          error={error}
          onIdeaChange={setIdea}
          onSubmit={submit}
        />
      )}
      {view === 'loading' && <LoadingPipeline idea={idea} />}
      {view === 'results' && result && (
        <ResultsReport result={result} idea={idea} onBack={reset} />
      )}
    </main>
  )
}