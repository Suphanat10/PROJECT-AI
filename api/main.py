from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import pandas as pd
import numpy as np
from typing import Optional

app = FastAPI()

# Load models
svr_model = joblib.load("./Machine/SVR/svr_model.pkl")
scaler = joblib.load("./Machine/SVR/scaler.pkl")
poly = joblib.load("./Machine/SVR/poly.pkl")

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

    input_dict["Total_Vol_Calculated"] = input_dict["Total_Vol_Calculated"] or data["Total_Vol_Calculated"].median()
    input_dict["Total_Vol_Lag1"] = input_dict["Total_Vol_Lag1"] or data["Total_Vol_Lag1"].median()
    input_dict["Total_Vol_Lag7"] = input_dict["Total_Vol_Lag7"] or data["Total_Vol_Lag7"].median()
    
    del input_dict["Date"]
    input_df = pd.DataFrame([input_dict]).fillna(0)
    
    try:
        input_poly = poly.transform(input_df[FEATURES])
        input_scaled = scaler.transform(input_poly)
        prediction = svr_model.predict(input_scaled)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in prediction: {str(e)}")
    
    predicted_traffic = prediction[0]
    traffic_severity = "Low Traffic" if predicted_traffic < 10000 else "Moderate Traffic" if predicted_traffic < 20000 else "High Traffic"
    historical_avg = data["Total_Vol_Calculated"].mean()
    traffic_trend = "normal" if abs(predicted_traffic - historical_avg) < 0.1 * historical_avg else "higher than usual" if predicted_traffic > historical_avg else "lower than usual"
    
    return {
        "Total_Vol_Predicted": predicted_traffic,
        "Traffic_Severity": traffic_severity,
        "Traffic_Trend": traffic_trend,
        "Model_Used": "SVR (Support Vector Regression)"
    }

class HospitalInput(BaseModel):
    Distance: float
    Population: int
    Hospital_Code: int
    Bed_Count: int
    Patient_Count: int
    Service_Count: int

hospital_model = joblib.load("./Machine/Neural_Network/hospital_bed_model0-1.pkl")
hospital_scaler = joblib.load("./Machine/Neural_Network/scaler0-1.pkl")


@app.post("/api/hospital")
def predict_hospital(data: HospitalInput):
    input_dict = data.dict()
    input_df = pd.DataFrame([input_dict])

    # ใช้เฉพาะคอลัมน์ที่จำเป็น
    expected_columns = ['Bed_Count', 'Patient_Count', 'Service_Count', 'Population', 'Distance', 'Hospital_Code']
    input_df = input_df.reindex(columns=expected_columns)

    try:
        # แปลงข้อมูลด้วย scaler
        input_scaled = hospital_scaler.transform(input_df)

        # ทำนายจำนวนผู้ป่วยในล่วงหน้า 2, 4, และ 6 ปี
        predictions = {
            f"Patient_Count_Prediction_{years}_years": int(round(hospital_model.predict(input_scaled + years)[0])) 
            for years in [2, 4, 6]
        }
        
        h = hospital_model.predict(input_scaled)
         

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in prediction: {str(e)}")

    return {
        "Predictions": predictions,
        "Input_Data": input_dict,
         "Hospital_Bed_Prediction": h.tolist(),
        "Model_Used": "Neural Network"
    }
