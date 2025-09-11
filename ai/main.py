from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

# Request schema
class EssayRequest(BaseModel):
    text: str
    taskType: str   # "Task1" | "Task2"

# Response schema
class GradingResponse(BaseModel):
    overallBand: float
    taskResponse: float
    coherenceCohesion: float
    lexicalResource: float
    grammaticalRange: float
    feedback: str
    annotations: list
    vocabulary: list
    sentenceTips: list
    structureTips: str | None
    meta: dict

@app.post("/grade", response_model=GradingResponse)
def grade(req: EssayRequest):
    """
    Mock API: luôn trả dữ liệu grading đủ bộ
    để backend + frontend test UI & DB.
    """
    essay_length = len(req.text.split())

    return {
        "overallBand": 7.0,
        "taskResponse": 7.0,
        "coherenceCohesion": 7.0,
        "lexicalResource": 6.5,
        "grammaticalRange": 7.0,
        "feedback": f"Mock grading for {req.taskType}: The essay is well-structured but could use more advanced vocabulary.",
        "annotations": [
            {
                "start": 45,
                "end": 55,
                "errorType": "grammar",
                "suggestion": "should use past tense"
            },
            {
                "start": 120,
                "end": 138,
                "errorType": "wordChoice",
                "suggestion": "replace 'big' with 'significant'"
            }
        ],
        "vocabulary": [
            { "original": "big", "alternative": "significant" },
            { "original": "good", "alternative": "beneficial" }
        ],
        "sentenceTips": [
            "Instead of 'This is a big problem', say 'This poses a significant challenge for society.'"
        ],
        "structureTips": "Expand the introduction with a clear thesis statement.",
        "meta": {
            "wordCount": essay_length,
            "grammarErrorCount": 3,
            "spellingErrorCount": 1,
            "cohesionErrorCount": 2
        }
    }
