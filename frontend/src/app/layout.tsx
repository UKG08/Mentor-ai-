import type { Metadata } from 'next'
import './global.css'

export const metadata: Metadata = {
  title: 'MentorAI — Startup Idea Analyzer',
  description: 'A 12-stage AI reasoning pipeline that thinks like a technical co-founder, VC, and senior engineer.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}