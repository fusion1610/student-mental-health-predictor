from pydantic import BaseModel, Field
from typing import Literal

class PredictionResponse(BaseModel):
    predicted_mental_health_score: float