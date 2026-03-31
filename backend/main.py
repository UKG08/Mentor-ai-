import json
import asyncio
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
        expanded  = call_groq(expand_idea(idea))
        persona   = call_groq(map_persona(expanded))
        market    = call_groq(market_intelligence(expanded, persona))
        criticism = call_groq(devil_advocate(expanded, market))
        refined   = call_groq(stress_test(expanded, criticism))
        moat      = call_groq(moat_analysis(refined, market, persona))
        gtm       = call_groq(gtm_strategy(refined, persona, moat))
        mvp       = call_groq(define_mvp(refined, persona, criticism))
        tech      = call_groq(architect_tech(mvp, refined))
        execution = call_groq(plan_execution(mvp, tech, gtm))
        panel     = call_groq(panel_review(refined, mvp, execution, moat))
        final     = call_groq(final_synthesis(
            idea, expanded, persona, market,
            criticism, refined, moat, gtm,
            mvp, tech, execution, panel
        ))
        return final

    loop = asyncio.get_event_loop()
    final = await loop.run_in_executor(None, run_pipeline)

    try:
        result = json.loads(clean_json(final))
    except Exception as e:
        result = {"error": "Could not parse final output", "raw": final}

    return result