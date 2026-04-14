import { AnalysisResult } from './types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export async function analyzeIdea(idea: string): Promise<AnalysisResult> {
  const response = await fetch(`${API_URL}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idea }),
  })
  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Backend error ${response.status}: ${text}`)
  }
  return response.json()
}