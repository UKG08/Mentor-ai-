export interface ConfidenceScore {
  score: string
  reasoning: string
}
export interface TargetUsers {
  primary: string
  secondary: string
  pain_point: string
}
export interface Market {
  competitors: string
  gap: string
  size: string
}
export interface Moat {
  primary_moat: string
  moat_type: string
  build_strategy: string
}
export interface MVP {
  core_features: string[]
  cut_from_v1: string
  dangerous_assumption: string
  build_time: string
}
export interface TechStack {
  frontend: string
  backend: string
  ai_layer: string
  database: string
  hosting: string
  avoid: string
}
export interface ExecutionPlan {
  week_1: string
  week_2: string
  week_3: string
  week_4: string
}
export interface GoToMarket {
  first_10_users: string
  first_100_users: string
  positioning: string
  pricing: string
  key_partnership: string
}
export interface ExpertPanel {
  founder: string
  vc: string
  engineer: string
}
export interface InvestorReadiness {
  score: string
  what_to_fix: string
}
export interface AnalysisResult {
  confidence_score:   ConfidenceScore
  real_problem:       string
  refined_idea:       string
  target_users:       TargetUsers
  market:             Market
  moat:               Moat
  mvp:                MVP
  tech_stack:         TechStack
  execution_plan:     ExecutionPlan
  go_to_market:       GoToMarket
  expert_panel:       ExpertPanel
  investor_readiness: InvestorReadiness
  watch_out:          string
  pivot_option:       string
  error?: string
  raw?:  string
}