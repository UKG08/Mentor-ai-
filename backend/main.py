import json
import asyncio
import time
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from prompt import (
    expand_idea, map_persona, market_intelligence,
    devil_advocate, stress_test, moat_analysis,
    gtm_strategy, define_mvp, architect_tech,
    plan_execution, panel_review, final_synthesis
)
from groq_client import call_groq, clean_json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class IdeaRequest(BaseModel):
    idea: str

@app.post("/analyze")
async def analyze_idea(request: IdeaRequest):
    idea = request.idea

    def run_pipeline():
        def step(prompt, large=False):
            result = call_groq(prompt, use_large=large)
            time.sleep(2)  # 2s pause keeps tokens/min well under 6k limit
            return result

        # Stages 1–11: fast 8B model
        expanded  = step(expand_idea(idea))
        persona   = step(map_persona(expanded))
        market    = step(market_intelligence(expanded, persona))
        criticism = step(devil_advocate(expanded, market))
        refined   = step(stress_test(expanded, criticism))
        moat      = step(moat_analysis(refined, market, persona))
        gtm       = step(gtm_strategy(refined, persona, moat))
        mvp       = step(define_mvp(refined, persona, criticism))
        tech      = step(architect_tech(mvp, refined))
        execution = step(plan_execution(mvp, tech, gtm))
        panel     = step(panel_review(refined, mvp, execution, moat))

        # Stage 12: best model for final JSON output
        final = step(
            final_synthesis(
                idea, expanded, persona, market,
                criticism, refined, moat, gtm,
                mvp, tech, execution, panel
            ),
            large=True
        )
        return final

    loop = asyncio.get_event_loop()
    final = await loop.run_in_executor(None, run_pipeline)

    try:
        cleaned_data = clean_json(final)
        result = json.loads(cleaned_data)
    except Exception as e:
        result = {"error": "Could not parse final output", "raw": final}

    return result