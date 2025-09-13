# grading.py
from typing import Dict

def generate_grading(text: str, task_type: str) -> Dict:
    """
    Mock grading function. Later you can replace this with GPT API or fine-tuned model.
    """
    essay_length = len(text.split())

    return {
        "overallBand": 7.0,
        "taskResponse": 6.5,
        "coherenceCohesion": 7.0,
        "lexicalResource": 6.5,
        "grammaticalRange": 6.0,
        "feedback": f"[MOCK] Grading for {task_type}. Essay length {essay_length} words.",
        "annotations": [
            {"start": 10, "end": 20, "errorType": "grammar", "suggestion": "use past tense"},
            {"start": 30, "end": 40, "errorType": "wordChoice", "suggestion": "replace 'big' with 'significant'"}
        ],
        "vocabulary": [
            {"original": "big", "alternative": "significant"},
            {"original": "good", "alternative": "beneficial"}
        ],
        "sentenceTips": [
            "Instead of 'This is a big problem', say 'This poses a significant challenge for society.'"
        ],
        "structureTips": "Expand the introduction with a clear thesis statement.",
        "meta": {
            "wordCount": essay_length,
            "grammarErrorCount": 2,
            "spellingErrorCount": 1
        }
    }
