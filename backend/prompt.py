from textwrap import dedent

def expand_idea(idea: str) -> str:
    return dedent(f"""
        You are a startup problem analyst.
        Idea: "{idea}"
        In 3 sentences: what is the real pain, who has it, and why hasn't it been solved?
        Be specific. No buzzwords.
    """).strip()


def map_persona(expanded: str) -> str:
    return dedent(f"""
        You are a user researcher.
        Problem: {expanded}
        In 3 sentences describe the exact person with this pain: job title, company size,
        daily workflow step where pain hits, and their current workaround.
        Also name one secondary user type in 1 sentence.
    """).strip()


def market_intelligence(expanded: str, persona: str) -> str:
    return dedent(f"""
        You are a market analyst.
        Problem: {expanded}
        User: {persona}
        In 4 sentences: name 2 competitors and what happened to them, the gap they missed,
        and TAM/SAM with dollar figures.
    """).strip()


def devil_advocate(expanded: str, market: str) -> str:
    return dedent(f"""
        You are a brutal startup critic.
        Idea: {expanded}
        Market: {market}
        In 4 sentences attack: user behavior inertia, market timing, build complexity,
        and why getting first 1000 users will be hard.
    """).strip()


def stress_test(expanded: str, criticism: str) -> str:
    return dedent(f"""
        You are a startup strategist.
        Original idea: {expanded}
        Criticism: {criticism}
        In 3 sentences: which criticisms are fatal vs fixable, and what is the refined idea?
        End with exactly one sentence defining the improved idea.
    """).strip()


def moat_analysis(refined: str, market: str, persona: str) -> str:
    return dedent(f"""
        You are a competitive strategy expert.
        Idea: {refined}
        In 3 sentences: rate network effects, data advantage, and switching costs
        as Strong/Weak/NA with one reason each. End with the one moat to build first.
    """).strip()


def gtm_strategy(refined: str, persona: str, moat: str) -> str:
    return dedent(f"""
        You are a GTM strategist.
        Idea: {refined}
        User: {persona}
        In 4 sentences answer: where to find first 10 users (exact community/platform),
        one organic channel for first 100, positioning in one sentence,
        and exact pricing model with dollar amount.
    """).strip()


def define_mvp(refined: str, persona: str, criticism: str) -> str:
    return dedent(f"""
        You are a product manager obsessed with simplicity.
        Idea: {refined}
        User: {persona}
        Risks: {criticism}
        In 4 sentences: list exactly 3 v1 features and why each earns its place,
        what to cut, and the one dangerous assumption to validate.
        Include a realistic solo-dev build time estimate.
    """).strip()


def architect_tech(mvp: str, refined: str) -> str:
    return dedent(f"""
        You are a senior architect advising a solo developer.
        MVP: {mvp}
        In 4 sentences recommend: frontend, backend, database, hosting, and AI layer.
        One sentence per layer with reason. Flag one thing NOT to build custom.
    """).strip()


def plan_execution(mvp: str, tech: str, gtm: str) -> str:
    return dedent(f"""
        You are a startup coach.
        MVP: {mvp}
        Tech: {tech}
        GTM: {gtm}
        Write a 4-week plan for one solo developer. For each week one sentence covering:
        what gets built, key decision, and user-facing milestone.
        Format: WEEK 1: ... WEEK 2: ... WEEK 3: ... WEEK 4: ...
    """).strip()


def panel_review(refined: str, mvp: str, execution: str, moat: str) -> str:
    return dedent(f"""
        You are roleplaying 3 experts reviewing this startup.
        Idea: {refined}
        MVP: {mvp}
        Write exactly 3 voices, 2 sentences each:
        FOUNDER: mistake to avoid from experience + one thing to do differently.
        VC: yes/no on pre-seed check + what milestone changes the answer.
        ENGINEER: hardest hidden technical problem + tool/API to solve it.
    """).strip()


def final_synthesis(
    idea, expanded, persona, market,
    criticism, refined, moat, gtm,
    mvp, tech, execution, panel
) -> str:
    return dedent(f"""
        You are MentorAI. Distill this startup research into one JSON report.
        Output ONLY valid JSON. No preamble, no markdown fences, no trailing text.

        INPUTS:
        Idea: {idea}
        Problem: {expanded}
        Persona: {persona}
        Market: {market}
        Critique: {criticism}
        Refined: {refined}
        Moat: {moat}
        GTM: {gtm}
        MVP: {mvp}
        Tech: {tech}
        Execution: {execution}
        Panel: {panel}

        {{
          "confidence_score": {{"score": "X/10", "reasoning": "two sentences"}},
          "real_problem": "one sentence",
          "refined_idea": "two sentences",
          "target_users": {{
            "primary": "job title, seniority, company size",
            "secondary": "second archetype and why they care",
            "pain_point": "exact frustration in user's own voice"
          }},
          "market": {{
            "competitors": "2 named companies and what happened",
            "gap": "specific whitespace none filled",
            "size": "TAM and SAM with dollar figures"
          }},
          "moat": {{
            "primary_moat": "the one moat to build first",
            "moat_type": "network_effects|data|switching_costs|brand|distribution",
            "build_strategy": "concrete 90-day action"
          }},
          "mvp": {{
            "core_features": ["Feature 1", "Feature 2", "Feature 3"],
            "cut_from_v1": "what was cut and why",
            "dangerous_assumption": "hypothesis to validate",
            "build_time": "realistic estimate for one developer"
          }},
          "tech_stack": {{
            "frontend": "tool and reason",
            "backend": "tool and reason",
            "ai_layer": "model/api and reason",
            "database": "type and tool and reason",
            "hosting": "platform and reason",
            "avoid": "what not to build custom"
          }},
          "execution_plan": {{
            "week_1": "build | decision | milestone",
            "week_2": "build | decision | milestone",
            "week_3": "build | decision | milestone",
            "week_4": "ships | feedback loop | GTM action"
          }},
          "go_to_market": {{
            "first_10_users": "exact channel and outreach",
            "first_100_users": "repeatable organic channel",
            "positioning": "one sentence who and why different",
            "pricing": "exact dollar amount and model",
            "key_partnership": "named company and why"
          }},
          "expert_panel": {{
            "founder": "mistake to avoid",
            "vc": "fundable yes/no and milestone",
            "engineer": "hard problem and shortcut"
          }},
          "investor_readiness": {{
            "score": "X/10",
            "what_to_fix": "two specific things"
          }},
          "watch_out": "single biggest mistake that kills ideas like this",
          "pivot_option": "closest adjacent idea if core stalls"
        }}
    """).strip()