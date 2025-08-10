from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import torch  # Make sure this import is included at the top of your file
import torch.nn as nn
import pandas as pd
import numpy as np
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import pathlib

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
    input_dict = data.model_dump()

    try:
        input_dict["Date"] = pd.to_datetime(input_dict["Date"], errors="coerce")
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid date format")

    if pd.isnull(input_dict["Date"]):
        raise HTTPException(status_code=400, detail="Invalid date format")

    # ตรวจสอบช่วงค่า Temperature (อนุญาตแค่ -50 ถึง 60)
    if input_dict["Temperature"] < -50 or input_dict["Temperature"] > 60:
        raise HTTPException(status_code=400, detail="Temperature must be between -50 and 60 °C")        

    try:
        weekday = input_dict["Date"].weekday()
        is_weekend_flag = 1 if weekday >= 5 else 0
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Date processing error: {str(e)}")

    input_dict.update({
        "Day": input_dict["Date"].day,
        "Month": input_dict["Date"].month,
        "Year": input_dict["Date"].year,
        "Weekday": weekday,
        "is_weekend": is_weekend_flag,
        "Day_of_Year": input_dict["Date"].dayofyear
    })

    del input_dict["Date"]

    # เติมค่า default จากค่าเฉลี่ยใน historical_data หากค่าใดเป็น None
    if input_dict["Total_Vol_Calculated"] is None:
        input_dict["Total_Vol_Calculated"] = historical_data["Total_Vol_Calculated"].mean()
    
    if input_dict["Total_Vol_Lag1"] is None:
        input_dict["Total_Vol_Lag1"] = historical_data["Total_Vol_Lag1"].mean()
    
    if input_dict["Total_Vol_Lag7"] is None:
        input_dict["Total_Vol_Lag7"] = historical_data["Total_Vol_Lag7"].mean()
    
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
    
    
class RegressionModel(torch.nn.Module):
    def __init__(self, input_dim):
        super(RegressionModel, self).__init__()
        self.fc = torch.nn.Linear(input_dim, 1)

    def forward(self, x):
        return self.fc(x)

class ClassificationModel(torch.nn.Module):
    def __init__(self, input_dim, num_classes):
        super(ClassificationModel, self).__init__()
        self.fc = torch.nn.Linear(input_dim, num_classes)

    def forward(self, x):
        return torch.softmax(self.fc(x), dim=1)


device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

input_dim = 8
num_classes = 3


regression_model = RegressionModel(input_dim)
classification_model = ClassificationModel(input_dim, num_classes)


regression_model.load_state_dict(torch.load("./Machine/Neural_Network/regression_model.pth"), strict=False)
classification_model.load_state_dict(torch.load("./Machine/Neural_Network/classification_model.pth"), strict=False)


regression_model.eval()
classification_model.eval()
regression_model.to(device)
classification_model.to(device)


scaler_path = pathlib.Path("./Machine/Neural_Network/scaler.pkl")
try:
    if scaler_path.exists():
        scaler1 = joblib.load(scaler_path)
        print("Scaler loaded successfully")
    else:
        print(f"Warning: Scaler not found at {scaler_path}. Will use default normalization.")
        scaler1 = None
except Exception as e:
    print(f"Error loading scaler: {e}")
    scaler1 = None


class InputData(BaseModel):
    PM10: float
    CO: float
    NO2: float
    O3: float
    SO2: float
    Temperature: float
    Humidity: float
    Province: int


def make_prediction(input_data):
    try:
        
        if scaler1 is not None:
            input_data_scaled = scaler1.transform(input_data)
            print("Using loaded scaler for normalization")
        else:
            print("Using fallback normalization")
            input_data_scaled = (input_data - np.min(input_data)) / (np.max(input_data) - np.min(input_data))

        
        X_input_tensor = torch.tensor(input_data_scaled, dtype=torch.float32).to(device)

        
        with torch.no_grad():
            y_reg_pred = regression_model(X_input_tensor)
            pm25_pred_raw = float(y_reg_pred.cpu().numpy()[0][0])
            pm25_pred = max(0, pm25_pred_raw) 

        
        with torch.no_grad():
            y_cls_pred = classification_model(X_input_tensor)
            class_probabilities = y_cls_pred.cpu().numpy()[0]
            y_cls_pred_label = torch.argmax(y_cls_pred, dim=1).cpu().numpy()[0]

        category_map = {0: "Good", 1: "Moderate", 2: "Unhealthy for Sensitive Groups"}
        air_quality_category = category_map.get(int(y_cls_pred_label), "Unknown")

        return {
            "Predicted_PM2_5": round(pm25_pred, 4),
            "Air_Quality_Category": air_quality_category,
            "Category_Probabilities": {
                "Good": float(round(class_probabilities[0], 4)),
                "Moderate": float(round(class_probabilities[1], 4)),
                "Unhealthy_for_Sensitive_Groups": float(round(class_probabilities[2], 4))
            },
            "Model_Used": "Neural Network (Regression & Classification)"
        }
    except Exception as e:
        return {"error": f"Prediction error: {str(e)}"}


@app.post("/api/airquality")
def predict_air_quality(data: InputData):
    
    if data.PM10 < 0 or data.CO < 0 or data.NO2 < 0 or data.O3 < 0 or data.SO2 < 0:
        return {"error": "Air pollutant values cannot be negative"}

    if data.Humidity < 0 or data.Humidity > 100:
        return {"error": "Humidity must be between 0 and 100"}

    if data.Temperature < -50 or data.Temperature > 60:
        return {"error": "Temperature must be between -50 and 60°C"}

    
    input_data = np.array([[data.PM10, data.CO, data.NO2, data.O3, data.SO2, data.Temperature, data.Humidity, data.Province]])

    return make_prediction(input_data)

@app.get("/api/airquality/test")
def predict_air_quality_test():
    
    input_data = np.array([[40, 0.5, 30, 100, 5, 28.0, 60, 1]])
    return make_prediction(input_data)


@app.on_event("startup")
async def startup_event():
    print("Starting up...")
    try:
        assert regression_model is not None
        assert classification_model is not None
        assert scaler1 is not None
        print("Models and scaler loaded successfully.")
    except AssertionError:
        print("Error: One or more components failed to load.")