from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import torch  # Make sure this import is included at the top of your file
import torch.nn as nn
import pandas as pd
import numpy as np
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # อนุญาตทุกโดเมน
    allow_credentials=True,
    allow_methods=["*"],  # อนุญาตทุก HTTP Method
    allow_headers=["*"],  # อนุญาตทุก Header
)


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
    
    



class RegressionModel(nn.Module):
    def __init__(self, input_dim):
        super(RegressionModel, self).__init__()
        self.fc = nn.Linear(input_dim, 1)  # สมมติว่าเป็นโมเดล Linear

    def forward(self, x):
        return self.fc(x)

class ClassificationModel(nn.Module):
    def __init__(self, input_dim, num_classes):
        super(ClassificationModel, self).__init__()
        self.fc = nn.Linear(input_dim, num_classes)  # สมมติว่าเป็นโมเดล Linear

    def forward(self, x):
        return self.fc(x)

input_dim = 8  # จำนวนฟีเจอร์
num_classes = 5  # จำนวนคลาสของการจัดหมวดหมู่ (เปลี่ยนตามโมเดลจริง)

# สร้างโมเดลใหม่
regression_model = RegressionModel(input_dim)
classification_model = ClassificationModel(input_dim, num_classes)

# โหลด state_dict ของโมเดล
regression_model.load_state_dict(torch.load("./Machine/Neural_Network/regression_model.pth"), strict=False)

classification_model.load_state_dict(torch.load("./Machine/Neural_Network/classification_model.pth"), strict=False)

# ตั้งให้โมเดลเป็นโหมดประเมินผล
regression_model.eval()
classification_model.eval()

# โหลด MinMaxScaler ที่ใช้ Normalize ข้อมูล
scaler1 = joblib.load("./Machine/Neural_Network/scaler.pkl")

# กำหนดโครงสร้างข้อมูลที่รับจาก API
class InputData(BaseModel):
    PM10: float
    CO: float
    NO2: float
    O3: float
    SO2: float
    Temperature: float
    Humidity: float
    Province: int

@app.post("/api/airquality")
def predict_air_quality(data: InputData):
    input_array = np.array([[data.PM10, data.CO, data.NO2, data.O3, data.SO2, data.Temperature, data.Humidity, data.Province]])
    
    # Normalize ข้อมูล
    input_scaled = scaler1.transform(input_array)

    # แปลงเป็น Tensor
    X_input_tensor = torch.tensor(input_scaled, dtype=torch.float32)

    # ทำนายค่า PM2.5 ด้วย Regression Model
    with torch.no_grad():
        y_reg_pred = regression_model(X_input_tensor)
        pm25_pred = y_reg_pred.cpu().numpy()[0][0]

    # ทำนายหมวดหมู่คุณภาพอากาศด้วย Classification Model
    with torch.no_grad():
        y_cls_pred = classification_model(X_input_tensor)
        y_cls_pred_label = torch.argmax(y_cls_pred, dim=1).cpu().numpy()[0]
        
    
    if int(y_cls_pred_label) == 0:
        y_cls_pred_label = "Good"
    elif int(y_cls_pred_label) == 1:
        y_cls_pred_label = "Moderate"
    elif int(y_cls_pred_label) == 2:
        y_cls_pred_label = "Unhealthy for Sensitive Groups"
            

    # ส่งคืนผลลัพธ์
    return {
        "Predicted_PM2_5": round(float(pm25_pred), 4),
        "Air_Quality_Category": y_cls_pred_label,
         "Model_Used": "Neural Network (Regression & Classification)"
    }