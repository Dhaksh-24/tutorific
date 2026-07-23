from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import lessons, recaps, quizzes, webhooks, triggers

app = FastAPI(title="Tutorific AI API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://your-tutorific-domain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(lessons.router,  prefix="/lessons",  tags=["lessons"])
app.include_router(recaps.router,   prefix="/recaps",   tags=["recaps"])
app.include_router(quizzes.router,  prefix="/quizzes",  tags=["quizzes"])
app.include_router(webhooks.router, prefix="/webhooks", tags=["webhooks"])
app.include_router(triggers.router, prefix="/triggers", tags=["triggers"])

@app.get("/health")
def health():
    return {"status": "ok"}
