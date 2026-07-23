# Tutorific

AI-powered online tutoring platform — React frontend + FastAPI backend.

## Structure
```
tutorific/
├── website/tutorific/   # React + Vite frontend
└── api/                 # FastAPI backend
```

## Quick Start

### 1. Supabase — run schema
Create a project at supabase.com, then run `api/schema.sql` in the SQL Editor.

### 2. Backend
```bash
cd api
python -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env           # fill in your 4 API keys
uvicorn main:app --reload      # runs on http://localhost:8000
```

### 3. Frontend
```bash
cd website/tutorific
npm install
cp .env.example .env           # VITE_API_URL=http://localhost:8000
npm run dev                    # runs on http://localhost:5173
```

## Demo Logins
| Portal  | Email                                    | Password      |
|---------|------------------------------------------|---------------|
| Student | emma.johnson@student.tutorific.co.uk     | Tutor-4829-X  |
| Tutor   | ahmed@tutorific.co.uk                    | Ahmed-2024-T  |
| Admin   | admin@tutorific.co.uk                    | admin123      |

## Environment Variables

### `api/.env`
| Key | Where |
|-----|-------|
| `SUPABASE_URL` | Supabase → Settings → API |
| `SUPABASE_SERVICE_KEY` | Supabase → Settings → API → service_role |
| `OPENAI_API_KEY` | platform.openai.com |
| `ASSEMBLYAI_API_KEY` | assemblyai.com |

### `website/tutorific/.env`
| Key | Value |
|-----|-------|
| `VITE_API_URL` | `http://localhost:8000` (dev) or your deployed API URL |
