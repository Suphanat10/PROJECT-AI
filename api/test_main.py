import pytest
from fastapi.testclient import TestClient
from main import app, make_prediction
import numpy as np

client = TestClient(app)

# --- Traffic API Tests ---

def test_traffic_valid_input():
    payload = {
        "Date": "2023-08-10",
        "Road_Encoded": 1,
        "Temperature": 30.5,
        "Rainfall": 0.0,
        "Total_Vol_Calculated": 10000,
        "Total_Vol_Lag1": 9000,
        "Total_Vol_Lag7": 9500
    }
    response = client.post("/api/traffic/bkk", json=payload)
    assert response.status_code == 200
    assert "Total_Vol_Predicted" in response.json()

def test_traffic_missing_optional_fields():
    payload = {
        "Date": "2023-08-10",
        "Road_Encoded": 2,
        "Temperature": 29,
        "Rainfall": 0.5
    }
    response = client.post("/api/traffic/bkk", json=payload)
    assert response.status_code == 200

def test_traffic_invalid_date_format():
    payload = {
        "Date": "2023-13-40",  # Invalid month and day
        "Road_Encoded": 1,
        "Temperature": 30.5,
        "Rainfall": 0.0
    }
    response = client.post("/api/traffic/bkk", json=payload)
    assert response.status_code == 400
    assert "Invalid date format" in response.json().get("detail", "")

def test_traffic_missing_date():
    payload = {
        "Road_Encoded": 1,
        "Temperature": 30.5,
        "Rainfall": 0.0
    }
    response = client.post("/api/traffic/bkk", json=payload)
    assert response.status_code == 422  # Pydantic validation error

def test_traffic_negative_temperature():
    payload = {
        "Date": "2023-08-10",
        "Road_Encoded": 1,
        "Temperature": -10,
        "Rainfall": 0.0
    }
    response = client.post("/api/traffic/bkk", json=payload)
    assert response.status_code == 200

# --- Air Quality API Tests ---

def test_airquality_valid_input():
    payload = {
        "PM10": 40.0,
        "CO": 0.5,
        "NO2": 30.0,
        "O3": 100.0,
        "SO2": 5.0,
        "Temperature": 28.0,
        "Humidity": 60.0,
        "Province": 1
    }
    response = client.post("/api/airquality", json=payload)
    assert response.status_code == 200
    assert "Predicted_PM2_5" in response.json()

def test_airquality_negative_pollutant():
    payload = {
        "PM10": -1,
        "CO": 0.5,
        "NO2": 30.0,
        "O3": 100.0,
        "SO2": 5.0,
        "Temperature": 28.0,
        "Humidity": 60.0,
        "Province": 1
    }
    response = client.post("/api/airquality", json=payload)
    assert response.status_code == 200
    assert "error" in response.json()

def test_airquality_humidity_too_high():
    payload = {
        "PM10": 40.0,
        "CO": 0.5,
        "NO2": 30.0,
        "O3": 100.0,
        "SO2": 5.0,
        "Temperature": 28.0,
        "Humidity": 110.0,
        "Province": 1
    }
    response = client.post("/api/airquality", json=payload)
    assert response.status_code == 200
    assert "error" in response.json()

def test_airquality_temperature_too_low():
    payload = {
        "PM10": 40.0,
        "CO": 0.5,
        "NO2": 30.0,
        "O3": 100.0,
        "SO2": 5.0,
        "Temperature": -60.0,
        "Humidity": 50.0,
        "Province": 1
    }
    response = client.post("/api/airquality", json=payload)
    assert response.status_code == 200
    assert "error" in response.json()

def test_airquality_missing_field():
    payload = {
        "PM10": 40.0,
        # CO missing
        "NO2": 30.0,
        "O3": 100.0,
        "SO2": 5.0,
        "Temperature": 28.0,
        "Humidity": 50.0,
        "Province": 1
    }
    response = client.post("/api/airquality", json=payload)
    assert response.status_code == 422

# --- Airquality test endpoint ---

def test_airquality_test_endpoint():
    response = client.get("/api/airquality/test")
    assert response.status_code == 200
    data = response.json()
    assert "Predicted_PM2_5" in data
    assert "Air_Quality_Category" in data

# --- make_prediction function tests ---

def test_make_prediction_normal_input():
    input_data = np.array([[40, 0.5, 30, 100, 5, 28, 60, 1]])
    result = make_prediction(input_data)
    assert "Predicted_PM2_5" in result
    assert "Air_Quality_Category" in result

def test_make_prediction_negative_input():
    input_data = np.array([[-10, -0.5, -30, -100, -5, -28, -60, -1]])
    result = make_prediction(input_data)
    assert "Predicted_PM2_5" in result or "error" in result

def test_make_prediction_incorrect_shape():
    input_data = np.array([[40, 0.5]])  # Shape mismatch
    result = make_prediction(input_data)
    assert "error" in result

def test_make_prediction_empty_array():
    input_data = np.array([])
    result = make_prediction(input_data)
    assert "error" in result

def test_make_prediction_all_zero():
    input_data = np.zeros((1,8))
    result = make_prediction(input_data)
    assert "Predicted_PM2_5" in result

# --- Additional edge cases for traffic API ---

def test_traffic_weekend_flag():
    # Test a Saturday date
    payload = {
        "Date": "2023-08-12",  # Saturday
        "Road_Encoded": 1,
        "Temperature": 30,
        "Rainfall": 0
    }
    response = client.post("/api/traffic/bkk", json=payload)
    assert response.status_code == 200
    data = response.json()
    # Traffic severity should be present
    assert "Traffic_Severity" in data

def test_traffic_large_numbers():
    payload = {
        "Date": "2023-08-10",
        "Road_Encoded": 1,
        "Temperature": 1000,
        "Rainfall": 1000,
        "Total_Vol_Calculated": 1000000,
        "Total_Vol_Lag1": 900000,
        "Total_Vol_Lag7": 950000
    }
    response = client.post("/api/traffic/bkk", json=payload)
    assert response.status_code == 200

def test_traffic_string_in_numeric_field():
    payload = {
        "Date": "2023-08-10",
        "Road_Encoded": "abc",  # Invalid
        "Temperature": 30.5,
        "Rainfall": 0.0
    }
    response = client.post("/api/traffic/bkk", json=payload)
    assert response.status_code == 422

def test_airquality_temperature_boundary_low():
    payload = {
        "PM10": 40.0,
        "CO": 0.5,
        "NO2": 30.0,
        "O3": 100.0,
        "SO2": 5.0,
        "Temperature": -50.0,  # boundary
        "Humidity": 60.0,
        "Province": 1
    }
    response = client.post("/api/airquality", json=payload)
    assert response.status_code == 200

def test_airquality_temperature_boundary_high():
    payload = {
        "PM10": 40.0,
        "CO": 0.5,
        "NO2": 30.0,
        "O3": 100.0,
        "SO2": 5.0,
        "Temperature": 60.0,  # boundary
        "Humidity": 60.0,
        "Province": 1
    }
    response = client.post("/api/airquality", json=payload)
    assert response.status_code == 200
