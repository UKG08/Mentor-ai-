# ============================================================
# MentorAI Prompt Pipeline — v2
# ============================================================
#
# PIPELINE (12 stages → 1 final JSON report):
#
#   1.  expand_idea          Raw idea → real problem
#   2.  map_persona          Problem → exact human with pain
#   3.  market_intelligence  Persona → competitive landscape
#   4.  devil_advocate       Idea + market → brutal critique
#   5.  stress_test          Critique → refined, battle-tested idea
#   6.  moat_analysis        Refined idea → defensibility map
#   7.  gtm_strategy         Refined idea → 90-day distribution plan
#   8.  define_mvp           Refined idea → v1 scope (solo-dev sized)
#   9.  architect_tech       MVP → pragmatic tech stack
#   10. plan_execution       MVP + tech + GTM → week-by-week 30-day plan
#   11. panel_review         Everything → founder / VC / engineer voices
#   12. final_synthesis      All stages → structured JSON report
#
# DESIGN PRINCIPLES:
#   - Every stage threads ALL upstream context it needs (no cold hallucination)
#   - Role anchoring + chain-of-thought framing on every stage
#   - Solo-dev constraint is explicit where it matters (MVP, tech, execution)
#   - _CORE_RULES injected at the end of every intermediate prompt
#   - final_synthesis outputs ONLY JSON — no fences, no preamble
#
# USAGE:
#   Each function takes string arguments and returns a prompt string.
#   Pass the returned string to your LLM call.
#   Feed each stage's output as input to the next stage.
#
#   Example:
#       prompt   = expand_idea("an app that reminds you to drink water")
#       expanded = llm(prompt)
#
#       prompt  = map_persona(expanded)
#       persona = llm(prompt)
#       ...
# ============================================================

from textwrap import dedent


# ── Shared rules injected into every intermediate stage ──────
# Not injected into final_synthesis (which outputs JSON only).

_CORE_RULES = dedent("""
    Rules:
    - Be specific. Name real companies, real job titles, real dollar amounts.
    - Avoid buzzwords: "seamless", "leverage", "synergy", "game-changer".
    - If you're uncertain about something, say so — don't fabricate.
    - No JSON. No markdown headers. Plain analytical prose only.
""").strip()


# ── Helpers ──────────────────────────────────────────────────

def _section(label: str, content: str) -> str:
    """Formats a labeled input block for multi-input prompts."""
    return f"[{label}]\n{content}\n"


# ════════════════════════════════════════════════════════════
# STAGE 1 — Expand the idea into a real problem statement
# ════════════════════════════════════════════════════════════

def expand_idea(idea: str) -> str:
    """
    Input:  raw idea string from the user
    Output: 4-5 sentence problem analysis
    """
    return dedent(f"""
        You are a problem analyst with 20 years of experience dissecting startup ideas.
        A founder gave you this rough idea: "{idea}"

        Most people describe a solution, not the actual problem they have.
        Your task: cut through the surface and find the REAL pain underneath.

        Think step by step before writing your answer:
        1. What daily frustration or workflow breakdown does this idea address?
        2. Who is suffering from this problem right now, and what is their current workaround?
        3. Why hasn't this been solved well yet — is it a technical limit, a timing issue,
           or has everyone tried and failed?
        4. What is the single non-obvious insight that makes this idea worth pursuing?

        Write your final answer in 4-5 tight sentences.
        Prioritize sharp insight over description.

        {_CORE_RULES}
    """).strip()


# ════════════════════════════════════════════════════════════
# STAGE 2 — Map the exact persona who has this problem
# ════════════════════════════════════════════════════════════

def map_persona(expanded_idea: str) -> str:
    """
    Input:  output of expand_idea
    Output: 5-6 sentence persona analysis (primary + secondary user)
    """
    return dedent(f"""
        You are a user researcher who has run hundreds of customer discovery interviews.

        {_section("Problem to solve", expanded_idea)}

        Paint a razor-sharp picture of the exact human being who has this problem.
        Do not use vague segments like "developers" or "small businesses".

        Cover all four angles:
        1. Job title, seniority level, and company size — as specific as possible.
        2. The exact daily workflow step where they hit this pain point.
        3. What they currently do to work around it (the "good enough" hack they rely on).
        4. Why that workaround frustrates them enough to consider paying for something better.

        Then: describe one SECONDARY user who has the same problem from a completely
        different context — different industry, job, or use case.

        Write your answer in 5-6 sentences total.

        {_CORE_RULES}
    """).strip()


# ════════════════════════════════════════════════════════════
# STAGE 3 — Market intelligence
# ════════════════════════════════════════════════════════════

def market_intelligence(expanded_idea: str, persona: str) -> str:
    """
    Input:  output of expand_idea, output of map_persona
    Output: 5-6 sentence competitive + market size analysis
    """
    return dedent(f"""
        You are a market analyst who has covered B2B and consumer software for 15 years.

        {_section("Problem being solved", expanded_idea)}
        {_section("Target user", persona)}

        Conduct a sharp competitive and market analysis:
        1. Name 2-3 companies that have already attempted to solve this exact problem.
           For each: what did they build, and why did it succeed, stall, or fail?
        2. What specific gap still exists that none of them cleanly filled?
        3. Realistic market size: give a TAM and SAM figure with a brief reasoning chain.
           Use dollar ranges — do not say "large" or "growing" without numbers.
        4. Is this market currently expanding, flat, or declining? Why?

        Be honest. If it's overcrowded or shrinking, say so directly.
        Write your answer in 5-6 sentences.

        {_CORE_RULES}
    """).strip()


# ════════════════════════════════════════════════════════════
# STAGE 4 — Devil's advocate: destroy the idea
# ════════════════════════════════════════════════════════════

def devil_advocate(expanded_idea: str, market: str) -> str:
    """
    Input:  output of expand_idea, output of market_intelligence
    Output: 5-6 sentence brutal critique from 4 attack angles
    """
    return dedent(f"""
        You are a brutally honest startup critic — part YC partner, part short-seller.
        Your job is to find every reason this idea will fail BEFORE anyone builds it.

        {_section("Idea", expanded_idea)}
        {_section("Market context", market)}

        Attack it from exactly these four angles:
        1. USER BEHAVIOR — What habit or inertia will prevent people from actually switching?
        2. MARKET REALITY — Why is the timing wrong, the wedge too small, or the moat nonexistent?
        3. BUILDABILITY — What makes this technically or operationally harder than it looks?
        4. GROWTH — Why will getting the first 1,000 paying users be brutal and expensive?

        Be specific. Name the exact assumptions the founder is making that are likely wrong.
        Do not soften the feedback.
        Write your answer in 5-6 punchy sentences.

        {_CORE_RULES}
    """).strip()


# ════════════════════════════════════════════════════════════
# STAGE 5 — Stress test: rebuild the idea after the attack
# ════════════════════════════════════════════════════════════

def stress_test(expanded_idea: str, criticism: str) -> str:
    """
    Input:  output of expand_idea, output of devil_advocate
    Output: 5-6 sentences ending in one refined idea statement
    """
    return dedent(f"""
        You are a resilient startup strategist who has salvaged ideas after brutal feedback.

        {_section("Original problem", expanded_idea)}
        {_section("Criticism", criticism)}

        Stress-test the idea against every critique:
        1. Which criticisms are FATAL and force a fundamental pivot or rethink?
        2. Which criticisms are REAL but solvable with a smarter scope, positioning, or wedge?
        3. What is the refined, battle-hardened version of this idea that survives the attack?

        Do not defend the original idea. Improve it.
        Write your answer in 5-6 sentences.
        End with exactly ONE sentence that defines the refined idea clearly.

        {_CORE_RULES}
    """).strip()


# ════════════════════════════════════════════════════════════
# STAGE 6 — Moat analysis: map defensibility
# ════════════════════════════════════════════════════════════

def moat_analysis(refined_idea: str, market: str, persona: str) -> str:
    """
    Input:  output of stress_test, market_intelligence, map_persona
    Output: 5-6 sentences covering 5 moat types + one priority recommendation
    """
    return dedent(f"""
        You are a competitive strategy expert focused on defensibility and durable advantage.

        {_section("Refined idea", refined_idea)}
        {_section("Market landscape", market)}
        {_section("Target user", persona)}

        Evaluate what structural moat this product can realistically build.
        For each moat type, assign: Strong / Weak / Not Applicable — and give one reason why.

        1. NETWORK EFFECTS — does value compound as more users join?
        2. DATA ADVANTAGE — does the product get smarter or stickier with usage over time?
        3. SWITCHING COSTS — how painful is it for a user to leave after 6 months of use?
        4. BRAND / COMMUNITY — can this become the category-defining name in its niche?
        5. DISTRIBUTION LOCK-IN — is there a channel or partnership others can't easily replicate?

        End with: one sentence naming the strongest moat to focus on first, and why.
        Write your answer in 5-6 sentences.

        {_CORE_RULES}
    """).strip()


# ════════════════════════════════════════════════════════════
# STAGE 7 — Go-to-market strategy
# ════════════════════════════════════════════════════════════

def gtm_strategy(refined_idea: str, persona: str, moat: str) -> str:
    """
    Input:  output of stress_test, map_persona, moat_analysis
    Output: 5-6 sentences covering 5 GTM dimensions
    """
    return dedent(f"""
        You are a go-to-market strategist who has launched 20+ products from zero.

        {_section("Refined idea", refined_idea)}
        {_section("Target user", persona)}
        {_section("Competitive moat to build", moat)}

        Design a concrete GTM playbook for the first 90 days.
        Answer each of these five questions specifically:

        1. FIRST 10 USERS — where exactly do you find them (community, platform, event)?
           What do you say in the outreach message? What do you offer them?
        2. FIRST 100 USERS — what one channel is repeatable and organic (no paid ads)?
        3. POSITIONING — write one sentence: who it's for and why it's different from alternatives.
        4. PRICING — what is the first pricing tier in exact dollar amounts, and what model
           (monthly SaaS, one-time, usage-based, freemium)?
        5. KEY PARTNERSHIP — one integration or distribution partner that creates a shortcut
           to the first 100 users. Name the specific company or platform.

        "Content marketing" and "word of mouth" are not answers — be tactical.
        Write your answer in 5-6 sentences.

        {_CORE_RULES}
    """).strip()


# ════════════════════════════════════════════════════════════
# STAGE 8 — Define the MVP (solo-dev scoped)
# ════════════════════════════════════════════════════════════

def define_mvp(refined_idea: str, persona: str, criticism: str) -> str:
    """
    Input:  output of stress_test, map_persona, devil_advocate
    Output: 5-6 sentences scoping v1 for one developer
    """
    return dedent(f"""
        You are a product manager obsessed with radical simplicity and fast validation.

        {_section("Refined idea", refined_idea)}
        {_section("Primary user", persona)}
        {_section("Key risks to validate against", criticism)}

        Define the absolute minimum viable product.
        Not the vision — the smallest slice that simultaneously:
        (a) delivers genuine value to the primary user on day one, and
        (b) tests the single most dangerous assumption in the business.

        Be explicit about:
        1. The 3 features (hard maximum) that must exist in v1.
           For each, state why it earns its place and what assumption it tests.
        2. What is explicitly NOT being built in v1, and why cutting it makes v1 stronger.
        3. The one hypothesis that — if wrong — would invalidate the whole idea.
        4. A realistic build-time estimate for ONE developer working full-time.

        Write your answer in 5-6 sentences.

        {_CORE_RULES}
    """).strip()


# ════════════════════════════════════════════════════════════
# STAGE 9 — Tech stack (solo-dev, pragmatic)
# ════════════════════════════════════════════════════════════

def architect_tech(mvp: str, refined_idea: str) -> str:
    """
    Input:  output of define_mvp, stress_test
    Output: 5-7 sentences covering full stack + what NOT to build custom
    """
    return dedent(f"""
        You are a senior software architect who ships fast, pragmatic products.
        You are advising a solo developer who needs to move quickly.

        {_section("MVP scope", mvp)}
        {_section("Core idea", refined_idea)}

        Choose an exact tech stack optimized in this order:
        speed to ship > maintainability > scalability.
        Justify each choice in one sentence.

        Cover every layer:
        - Frontend: framework + reason
        - Backend: language/framework + reason
        - AI/ML layer: specific model, API, or library + reason
        - Database: type (SQL/NoSQL/vector) + specific tool + reason
        - Hosting/infra: platform + reason
        - Key third-party services that replace weeks of custom work

        Flag 1-2 things that will be tempting to over-engineer in v1 — and name the
        simpler alternative a solo dev should use instead.

        Write your answer in 5-7 sentences.

        {_CORE_RULES}
    """).strip()


# ════════════════════════════════════════════════════════════
# STAGE 10 — 30-day execution plan (solo-dev)
# ════════════════════════════════════════════════════════════

def plan_execution(mvp: str, tech: str, gtm: str) -> str:
    """
    Input:  output of define_mvp, architect_tech, gtm_strategy
    Output: week-by-week breakdown for one developer over 30 days
    """
    return dedent(f"""
        You are a hands-on startup coach who has helped solo founders ship in 30 days.

        {_section("MVP scope", mvp)}
        {_section("Tech stack", tech)}
        {_section("Go-to-market plan", gtm)}

        Write a specific, honest week-by-week execution plan.
        Assume: one developer, working full-time, no teammates, no budget for contractors.

        For each of the four weeks, state exactly:
        - WHAT GETS BUILT: specific components or features, not "build the backend"
        - CRITICAL DECISION: one key technical or product decision to make or validate that week
        - USER-FACING MILESTONE: one concrete thing a real person can see or react to by Friday

        Keep it realistic. A solo dev can ship roughly one meaningful feature per day.
        Include GTM steps in weeks 3 and 4 — building without reaching users is a failure mode.

        Format:
        WEEK 1: ...
        WEEK 2: ...
        WEEK 3: ...
        WEEK 4: ...

        {_CORE_RULES}
    """).strip()


# ════════════════════════════════════════════════════════════
# STAGE 11 — Expert panel review
# ════════════════════════════════════════════════════════════

def panel_review(refined_idea: str, mvp: str, execution: str, moat: str) -> str:
    """
    Input:  output of stress_test, define_mvp, plan_execution, moat_analysis
    Output: three distinct expert voices, 2-3 sentences each
    """
    return dedent(f"""
        You are roleplaying three distinct experts reviewing this startup together.
        Each voice must be independent — no overlap, no agreeing with each other.

        {_section("Idea", refined_idea)}
        {_section("MVP", mvp)}
        {_section("Execution plan", execution)}
        {_section("Moat", moat)}

        Write exactly three voices, each 2-3 sentences:

        FOUNDER (built something very similar 3 years ago and failed):
        - What was the exact mistake that killed your version?
        - One concrete thing you'd do differently from day one.

        VC (has reviewed 100 pitches in this exact category this year):
        - Would you write a pre-seed check today? Be direct: yes or no, and why.
        - What single milestone would flip your answer?

        ENGINEER (hired to build this alone with a 6-week deadline):
        - What is the hardest technical problem that nobody in the room is talking about?
        - What existing tool or API would you use to survive it?

        {_CORE_RULES}
    """).strip()


# ════════════════════════════════════════════════════════════
# STAGE 12 — Final synthesis → structured JSON report
# ════════════════════════════════════════════════════════════

def final_synthesis(
    idea: str,
    expanded: str,
    persona: str,
    market: str,
    criticism: str,
    refined: str,
    moat: str,
    gtm: str,
    mvp: str,
    tech: str,
    execution: str,
    panel: str,
) -> str:
    """
    Input:  all 11 upstream stage outputs + original idea
    Output: ONLY valid JSON — no preamble, no fences, no trailing text

    JSON schema:
        confidence_score        → score + reasoning
        real_problem            → one sentence
        refined_idea            → two sentences
        target_users            → primary, secondary, pain_point
        market                  → competitors, gap, size
        moat                    → primary_moat, moat_type, build_strategy
        mvp                     → core_features[], cut_from_v1,
                                  dangerous_assumption, build_time
        tech_stack              → frontend, backend, ai_layer, database,
                                  hosting, avoid
        execution_plan          → week_1…week_4 (build | decision | milestone)
        go_to_market            → first_10_users, first_100_users, positioning,
                                  pricing, key_partnership
        expert_panel            → founder, vc, engineer
        investor_readiness      → score, what_to_fix
        watch_out               → single biggest mistake
        pivot_option            → closest adjacent idea if core stalls
    """
    return dedent(f"""
        You are MentorAI — a technical co-founder, product strategist, and startup mentor
        with deep experience across B2B SaaS, developer tools, and consumer products.

        You have completed an 11-stage deep analysis of a startup idea.
        All research is provided below. Your task: distill everything into one
        authoritative, structured final report.

        Do NOT add new opinions or invent new information.
        Distill, sharpen, and reconcile what the research already found.
        If stages contradict each other, resolve the conflict using the most specific evidence.

        ── RESEARCH INPUTS ─────────────────────────────────────────────
        {_section("Original idea", idea)}
        {_section("Expanded problem (Stage 1)", expanded)}
        {_section("Target persona (Stage 2)", persona)}
        {_section("Market analysis (Stage 3)", market)}
        {_section("Critique (Stage 4)", criticism)}
        {_section("Refined idea (Stage 5)", refined)}
        {_section("Moat analysis (Stage 6)", moat)}
        {_section("Go-to-market strategy (Stage 7)", gtm)}
        {_section("MVP definition (Stage 8)", mvp)}
        {_section("Tech stack (Stage 9)", tech)}
        {_section("Execution plan (Stage 10)", execution)}
        {_section("Expert panel (Stage 11)", panel)}
        ── END INPUTS ──────────────────────────────────────────────────

        Output ONLY valid JSON. No preamble, no explanation, no markdown fences.
        Every string value must be populated — no nulls, no "N/A", no empty strings.

        {{
          "confidence_score": {{
            "score": "X/10",
            "reasoning": "Two sentences: what drives the score up and what holds it down."
          }},
          "real_problem": "The actual pain point in one crisp sentence.",
          "refined_idea": "The battle-tested, stronger version of the idea in 2 sentences.",
          "target_users": {{
            "primary": "Specific person: job title, seniority, company size.",
            "secondary": "Second archetype and why they care about this differently.",
            "pain_point": "Exact daily frustration — write it in the user's own voice."
          }},
          "market": {{
            "competitors": "2-3 named companies that tried this, and what happened to each.",
            "gap": "The specific whitespace none of them filled.",
            "size": "TAM and SAM with dollar figures and a one-line reasoning chain."
          }},
          "moat": {{
            "primary_moat": "The one moat to build first and why it's achievable.",
            "moat_type": "network_effects | data | switching_costs | brand | distribution",
            "build_strategy": "Concrete action to start building this moat in the first 90 days."
          }},
          "mvp": {{
            "core_features": [
              "Feature 1: name — why it earns its place",
              "Feature 2: name — why it earns its place",
              "Feature 3: name — why it earns its place"
            ],
            "cut_from_v1": "What was cut and the reason cutting it makes v1 stronger.",
            "dangerous_assumption": "The one hypothesis this MVP must validate to proceed.",
            "build_time": "Realistic calendar estimate for one developer full-time."
          }},
          "tech_stack": {{
            "frontend": "Tool — one-line reason",
            "backend": "Tool — one-line reason",
            "ai_layer": "Model/API/library — one-line reason",
            "database": "Type + specific tool — one-line reason",
            "hosting": "Platform — one-line reason",
            "avoid": "What NOT to build custom in v1 and what to use instead."
          }},
          "execution_plan": {{
            "week_1": "What gets built | Critical decision | User-facing milestone",
            "week_2": "What gets built | Critical decision | User-facing milestone",
            "week_3": "What gets built | Critical decision | User-facing milestone",
            "week_4": "What ships publicly | First user feedback loop | GTM action taken"
          }},
          "go_to_market": {{
            "first_10_users": "Exact channel, outreach message, and what you offer them.",
            "first_100_users": "Repeatable organic channel — specific, not 'word of mouth'.",
            "positioning": "One sentence: who it's for and what makes it different.",
            "pricing": "First tier in exact dollar amount and billing model.",
            "key_partnership": "Named company or platform and how it unlocks early distribution."
          }},
          "expert_panel": {{
            "founder": "The exact mistake to avoid — from someone who already made it.",
            "vc": "Pre-seed fundable? Yes/No + reason + the milestone that changes the answer.",
            "engineer": "Hardest hidden technical challenge + the shortcut to survive it."
          }},
          "investor_readiness": {{
            "score": "X/10",
            "what_to_fix": "Two specific things that would make this more fundable."
          }},
          "watch_out": "The single most common mistake that kills ideas exactly like this.",
          "pivot_option": "If the core idea stalls at 50 users, the closest adjacent version that works."
        }}
    """).strip()