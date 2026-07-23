import os
from supabase import create_client, Client
from openai import AsyncOpenAI
import assemblyai as aai
from dotenv import load_dotenv

load_dotenv()

# ── Supabase ──────────────────────────────────────────────
SUPABASE_URL: str = os.environ["SUPABASE_URL"]
SUPABASE_SERVICE_KEY: str = os.environ["SUPABASE_SERVICE_KEY"]

def get_supabase() -> Client:
    return create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

# ── OpenAI ────────────────────────────────────────────────
openai_client = AsyncOpenAI(api_key=os.environ["OPENAI_API_KEY"])

# ── AssemblyAI ────────────────────────────────────────────
aai.settings.api_key = os.environ["ASSEMBLYAI_API_KEY"]

# ── Constants ─────────────────────────────────────────────
EMBEDDING_MODEL     = "text-embedding-3-small"
LLM_MODEL           = "gpt-4o-mini"
CHUNK_SIZE_TOKENS   = 400
CHUNK_OVERLAP       = 60
TOP_K_CHUNKS        = 6
QUIZ_FAIL_THRESHOLD = 0.6
TALK_TIME_THRESHOLD = 0.8
LATENCY_MULTIPLIER  = 1.8
DECAY_THRESHOLD     = 0.35
DECAY_HALF_LIFE_DAYS = 14
