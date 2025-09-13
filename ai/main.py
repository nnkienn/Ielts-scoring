# main.py
from fastapi import FastAPI
from pydantic import BaseModel
from grading import generate_grading

app = FastAPI()

class EssayRequest(BaseModel):
    text: str
    taskType: str

@app.post("/grade")
def grade(req: EssayRequest):
    return generate_grading(req.text, req.taskType)

@app.get("/health")
def health():
    return {"status": "ok"}
