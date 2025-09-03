from fastapi import FastAPI
from pydantic import BaseModel


app = FastAPI()


class GradeIn(BaseModel):
text: str


@app.get("/health")
async def health():
return {"ok": True}


@app.post("/grade")
async def grade(inp: GradeIn):
# TODO: replace with real model inference
length = len(inp.text.split())
band = max(5.0, min(9.0, 5.0 + (length / 2000.0) * 4.0))
return {
"band": round(band, 1),
"details": {
"task_response": 6.0,
"coherence": 6.0,
"lexical_resource": 6.0,
"grammar": 6.0
}
}