import os
import re
import time
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

def call_groq(prompt: str, use_large: bool = False) -> str:
    model = "llama-3.3-70b-versatile" if use_large else "llama-3.1-8b-instant"
    max_retries = 5

    for attempt in range(max_retries):
        try:
            response = client.chat.completions.create(
                model=model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
                max_tokens=500 if not use_large else 2000,
            )
            return response.choices[0].message.content

        except Exception as e:
            err = str(e)
            if "rate_limit_exceeded" in err or "429" in err:
                wait = 15 * (attempt + 1)  # 15s, 30s, 45s, 60s, 75s
                print(f"[RateLimit] attempt {attempt+1}, waiting {wait}s...")
                time.sleep(wait)
            else:
                raise

    raise Exception("Max retries exceeded — Groq rate limit persistent")


def clean_json(text: str) -> str:
    text = text.strip()
    text = re.sub(r'```json', '', text, flags=re.IGNORECASE)
    text = re.sub(r'```', '', text)
    start_index = text.find('{')
    end_index = text.rfind('}')
    if start_index != -1 and end_index != -1:
        return text[start_index:end_index + 1]
    return text