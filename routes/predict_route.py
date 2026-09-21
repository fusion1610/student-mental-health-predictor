from fastapi import APIRouter, Request
from models.student import Student
import pandas as pd
from services.prediction_service import predict_mental_health_score
from models.prediction_response import PredictionResponse

route = APIRouter()

@route.post('/predict', response_model=PredictionResponse)
def predict(request: Request, data: Student):
    top_countries = ['India','USA','Canada','Australia','UK','Germany','Turkey','Mexico','France','Spain']
            
    grouped_country = data.country if data.country in top_countries else 'Other'
            
    input_rows = pd.DataFrame([{
            'Age': data.age,
            'Gender': data.gender,
            'Country': data.country,
            'Academic_Level': data.academic_level,
            'Most_Used_Platform': data.most_used_platform,
            'Purpose_Of_Use': data.purpose_of_use,
            'Avg_Daily_Usage_Hours': data.avg_daily_usage_hours,
            'Daily_Unlocks': data.daily_unlocks,
            'Study_Hours': data.study_hours,
            'Physical_Activity_Hours': data.physical_activity_hours,
            'Sleep_Hours_Per_Night': data.sleep_hours_per_night,
            'Stress_Level': data.stress_level,
            'Grouped_country': grouped_country
    }])
            
    model = request.app.state.model
            
    prediction = predict_mental_health_score(model, input_rows)[0]
            
    return PredictionResponse(predicted_mental_health_score=round(float(prediction), 2))