from fastapi import FastAPI, HTTPException 
from pydantic import BaseModel
import joblib
import pandas as pd
import numpy as np
from fastapi.middleware.cors import CORSMiddleware  # ✅ ใช้ของ FastAPI แทน Flask
from typing import Optional

app = FastAPI()

# ✅ เพิ่ม CORS Middleware ที่ถูกต้อง
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # อนุญาตทุกโดเมน
    allow_credentials=True,
    allow_methods=["*"],  # อนุญาตทุก HTTP Method
    allow_headers=["*"],  # อนุญาตทุก Header
)

# โหลดโมเดล
svr_model = joblib.load("./Machine/SVR/svr_model.pkl")
scaler = joblib.load("./Machine/SVR/scaler.pkl")
poly = joblib.load("./Machine/SVR/poly.pkl")

# โหลดข้อมูลจราจร
data = pd.read_csv('./data/updated_traffic_data.csv')

FEATURES = ['Day', 'Month', 'Year', 'Weekday', 'is_weekend', 'Day_of_Year', 
            'Total_Vol_Calculated', 'Road_Encoded', 'Temperature', 'Rainfall', 
            'Total_Vol_Lag1', 'Total_Vol_Lag7']

class TrafficInput(BaseModel):
    Date: str
    Road_Encoded: int
    Temperature: float
    Rainfall: float
    Total_Vol_Calculated: Optional[float] = None
    Total_Vol_Lag1: Optional[float] = None
    Total_Vol_Lag7: Optional[float] = None

@app.post("/api/traffic/bkk")
def predict_traffic(data: TrafficInput):
    input_dict = data.dict()

    try:
        input_dict["Date"] = pd.to_datetime(input_dict["Date"], errors="coerce")
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid date format")

    if pd.isnull(input_dict["Date"]):
        raise HTTPException(status_code=400, detail="Invalid date format")

    input_dict.update({
        "Day": input_dict["Date"].day,
        "Month": input_dict["Date"].month,
        "Year": input_dict["Date"].year,
        "Weekday": input_dict["Date"].weekday(),
        "is_weekend": 1 if input_dict["Date"].weekday() >= 5 else 0,
        "Day_of_Year": input_dict["Date"].dayofyear
    })

    del input_dict["Date"]

    if input_dict["Total_Vol_Calculated"] is None:
        input_dict["Total_Vol_Calculated"] = data["Total_Vol_Calculated"].mean()
    
    if input_dict["Total_Vol_Lag1"] is None:
        input_dict["Total_Vol_Lag1"] = data["Total_Vol_Lag1"].mean()
    
    if input_dict["Total_Vol_Lag7"] is None:
        input_dict["Total_Vol_Lag7"] = data["Total_Vol_Lag7"].mean()
    
    input_df = pd.DataFrame([input_dict]).fillna(0)

    try:
        input_poly = poly.transform(input_df[FEATURES])
        input_scaled = scaler.transform(input_poly)
        prediction = svr_model.predict(input_scaled)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in prediction: {str(e)}")
    
    predicted_traffic = prediction[0]
    
    traffic_severity = "Low Traffic" if predicted_traffic < 10000 else "Moderate Traffic" if predicted_traffic < 20000 else "High Traffic"

    historical_avg = 15000
    traffic_trend = "normal" if abs(predicted_traffic - historical_avg) < 0.1 * historical_avg else "higher than usual" if predicted_traffic > historical_avg else "lower than usual"

    return {
        "Total_Vol_Predicted": predicted_traffic,
        "Traffic_Severity": traffic_severity,
        "Traffic_Trend": traffic_trend,
        "Model_Used": "SVR (Support Vector Regression)"
    }

