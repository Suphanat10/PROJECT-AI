from IPython import get_ipython
from IPython.display import display
!pip install ydata-profiling
from ydata_profiling import ProfileReport
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, RandomizedSearchCV
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVR
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.svm import SVR
from sklearn.preprocessing import StandardScaler, PolynomialFeatures, MinMaxScaler # Import MinMaxScaler here
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import numpy as np
from sklearn.preprocessing import LabelEncoder
import seaborn as sns # Import seaborn for scatterplot


file_path_csv = ""
df = pd.read_csv("/updated_traffic_data.csv", dtype={"Date": str})

df.head()
# ลบคอลัมน์ที่ไม่จำเป็น
df = df.drop(columns=['_id', 'No'])

df.info()
df.isnull().sum()

# 📌 แปลงวันที่ และสร้าง Feature ใหม่
df["Date"] = pd.to_datetime(df["Date"], errors="coerce")
df['Day'] = df['Date'].dt.day
df['Month'] = df['Date'].dt.month
df['Year'] = df['Date'].dt.year
df['Weekday'] = df['Date'].dt.weekday
df['is_weekend'] = df['Weekday'].apply(lambda x: 1 if x >= 5 else 0)
df['Day_of_Year'] = df['Date'].dt.dayofyear

# แปลงข้อมูล Road และ Crossroads
label_encoder = LabelEncoder()
df['Road_Encoded'] = label_encoder.fit_transform(df['Road'])
df['Crossroads_Encoded'] = label_encoder.fit_transform(df['Crossroads'])

# คำนวณ Total_Vol ใหม่
df['Total_Vol_Calculated'] = (df['Car_7-9'] + df['Van_7-9'] + df['Bus_7-9'] +
                              df['Minibus_7-9'] + df['Truck_7-9'] + df['3Cycle_7-9'] +
                              df['Car_9-17'] + df['Van_9-17'] + df['Bus_9-17'] +
                              df['Minibus_9-17'] + df['Truck_9-17'] + df['3Cycle_9-17'] +
                              df['Car_17-19'] + df['Van_17-19'] + df['Bus_17-19'] +
                              df['Minibus_17-19'] + df['Truck_17-19'] + df['3Cycle_17-19'])

df['Total_Vol_Lag30'] = df['Total_Vol'].shift(30)
df['Total_Vol_Lag60'] = df['Total_Vol'].shift(60)
# สร้างฟีเจอร์ Lag 60 วัน (2 เดือน)
df['Total_Vol_Lag90'] = df['Total_Vol'].shift(90)

# เติมค่า NaN ด้วย 0
df.fillna(0, inplace=True)

# เลือก Features และ Target
features = ['Day', 'Month', 'Year', 'Weekday', 'is_weekend', 'Day_of_Year', "Total_Vol_Calculated",
            'Road_Encoded', 'Temperature', 'Rainfall', 'Total_Vol_Lag30' , 'Total_Vol_Lag60']

target = 'Total_Vol'

X = df[features]
y = df[target]

# แยกข้อมูลเป็น Train และ Test
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# เพิ่ม Polynomial Features
poly = PolynomialFeatures(degree=3, interaction_only=False, include_bias=False)
X_train_poly = poly.fit_transform(X_train)
X_test_poly = poly.transform(X_test)

# ใช้ MinMaxScaler
scaler = MinMaxScaler()
X_train_scaled = scaler.fit_transform(X_train_poly)
X_test_scaled = scaler.transform(X_test_poly)

# กำหนดพารามิเตอร์สำหรับ GridSearchCV
param_grid = {
    "C": [5000, 10000, 20000, 50000, 100000],
    "gamma": [0.001, 0.01, 0.05, 0.1, 0.5],
    "epsilon": [0.0001, 0.001, 0.01, 0.1, 0.5]
}

# ใช้ GridSearchCV ค้นหาค่าพารามิเตอร์ที่ดีที่สุด
grid_search = GridSearchCV(SVR(kernel="rbf"), param_grid, cv=10, scoring="neg_mean_absolute_error", n_jobs=-1)
grid_search.fit(X_train_scaled, y_train)

# ใช้โมเดล SVR ที่ดีที่สุด
best_svr = grid_search.best_estimator_
y_pred_svr = best_svr.predict(X_test_scaled)

# ฟังก์ชันประเมินผล

def evaluate_model(y_true, y_pred, model_name):
    mae = mean_absolute_error(y_true, y_pred)
    mse = mean_squared_error(y_true, y_pred)
    rmse = np.sqrt(mse)
    r2 = r2_score(y_true, y_pred)

    print(f"📊 {model_name} Model Performance:")
    print(f"MAE  : {mae:.2f}")
    print(f"MSE  : {mse:.2f}")
    print(f"RMSE : {rmse:.2f}")
    print(f"R²   : {r2:.2f}")
    print("-" * 40)

# ประเมินผลโมเดล SVR
evaluate_model(y_test, y_pred_svr, "SVR (Optimized)")

# แสดงตัวอย่างค่าจริงกับค่าพยากรณ์
results_df = pd.DataFrame({
    "Actual": y_test.values,
    "SVR_Predicted": y_pred_svr
})

print("\n🔍 ตัวอย่างผลลัพธ์:")
print(results_df.sample(5))

# แสดงผลลัพธ์ในรูปของกราฟ
plt.figure(figsize=(10, 5))
sns.scatterplot(x=y_test, y=y_pred_svr, alpha=0.6)
plt.xlabel("Actual Traffic Volume")
plt.ylabel("Predicted Traffic Volume")
plt.title("Actual vs. Predicted Traffic Volume (SVR)")
plt.axline((0, 0), slope=1, color="red", linestyle="dashed")
plt.show()

# กราฟเส้นเปรียบเทียบค่าจริงกับค่าพยากรณ์
plt.figure(figsize=(12, 5))
plt.plot(y_test.values, label="Actual", marker="o", linestyle="-")
plt.plot(y_pred_svr, label="Predicted", marker="s", linestyle="--")
plt.xlabel("Sample Index")
plt.ylabel("Traffic Volume")
plt.title("Comparison of Actual vs Predicted Traffic Volume")
plt.legend()
plt.show()