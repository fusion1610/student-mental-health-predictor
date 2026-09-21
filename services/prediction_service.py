import pandas as pd

def predict_mental_health_score(model, input: pd.DataFrame):
    return model.predict(input)