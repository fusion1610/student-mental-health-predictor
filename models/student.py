from pydantic import BaseModel, Field
from typing import Literal

class Student(BaseModel):
    age: int = Field(..., ge=10, le=100)

    gender: Literal['Male', 'Female']

    country: Literal['India', 'USA', 'Canada', 'Australia', 
                     'UK', 'Germany', 'Turkey', 'Mexico', 'France', 'Spain', 'Other']
    
    academic_level: Literal['Undergraduate', 'Graduate', 'High School']

    most_used_platform: Literal['Facebook', 'LinkedIn', 'Instagram', 'Snapchat', 'Twitter',
                                'YouTube', 'TikTok', 'LINE', 'KakaoTalk', 'VKontakte', 'WhatsApp',
                                'WeChat']
    
    purpose_of_use: Literal['Networking', 'Education', 'Entertainment', 'News']

    avg_daily_usage_hours: float = Field(..., ge=0, le=24)
    
    daily_unlocks: int = Field(..., ge=0)
    
    study_hours: float = Field(..., ge=0, le=24)
    
    physical_activity_hours: float = Field(..., ge=0, le=24)
    
    sleep_hours_per_night: float = Field(..., ge=0, le=24)
    
    stress_level: Literal['Low', 'Medium', 'High', 'Very High']
    