import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.decomposition import PCA
from sklearn.preprocessing import PolynomialFeatures

# ✅ โหลดข้อมูล
df = pd.read_csv("/simulated_air_quality_data.csv")

import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.decomposition import PCA
from sklearn.preprocessing import PolynomialFeatures


df = pd.read_csv("/simulated_air_quality_data.csv")


print("ข้อมูลที่หายไปในแต่ละคอลัมน์:")
print(df.isnull().sum())


df['CO'].fillna(df['CO'].mean(), inplace=True)  
df.dropna(inplace=True)  


numerical_cols = df.select_dtypes(include=np.number).columns
Q1 = df[numerical_cols].quantile(0.25)
Q3 = df[numerical_cols].quantile(0.75)
IQR = Q3 - Q1


outliers = ((df[numerical_cols] < (Q1 - 1.5 * IQR)) | (df[numerical_cols] > (Q3 + 1.5 * IQR)))


print("ค่าผิดปกติในแต่ละคอลัมน์:")
print(outliers.sum())


df = df[~outliers.any(axis=1)]


df['Date'] = pd.to_datetime(df['Date'], errors='coerce')


df.drop(columns=['Province'], inplace=True)  


print("ข้อมูลหลังจากทำความสะอาด:")
print(df.head())

missing_values = df.isnull().sum()
print("Missing Values in Each Column:")
print(missing_values)

missing_percentage = (df.isnull().sum() / len(df)) * 100
print("\nPercentage of Missing Values:")
print(missing_percentage)

df.fillna(df.mean(), inplace=True)  

df.interpolate(method='linear', inplace=True)  

df.fillna(method='ffill', inplace=True)  

df.fillna(method='bfill', inplace=True) 
df.fillna(df.mean(), inplace=True)  

df.interpolate(method='linear', inplace=True)  

df.fillna(method='ffill', inplace=True) 

df.fillna(method='bfill', inplace=True)  


assert df.isnull().sum().sum() == 0, "There are still missing values in the dataset!"


df = df.dropna(subset=["PM10", "CO", "NO2", "O3", "SO2", "Temperature", "Humidity"]).reset_index(drop=True)


df["PM2.5"] = 0.3 * df["PM10"] + 0.2 * df["CO"] + 0.1 * df["NO2"] + 0.2 * df["O3"] + 0.1 * df["SO2"] + 0.1 * df["Temperature"]

# Create Air Quality category for classification
def categorize_air_quality(pm25):
    if pm25 <= 50:
        return 0  # Good
    elif pm25 <= 100:
        return 1  # Moderate
    else:
        return 2  # Unhealthy

df["AirQualityCategory"] = df["PM2.5"].apply(categorize_air_quality)


if 'Province' in df.columns:
    df["Province"] = df["Province"].astype("category").cat.codes
else:
    print("Warning: 'Province' column not found. Skipping categorical conversion.")
    df["Province"] = 0


feature_cols = ["PM10", "CO", "NO2", "O3", "SO2", "Temperature", "Humidity", "Province"]
X = df[feature_cols].values
y_regression = df["PM2.5"].values  
y_classification = df["AirQualityCategory"].values  


scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)


X_tensor = torch.tensor(X_scaled, dtype=torch.float32)
y_reg_tensor = torch.tensor(y_regression, dtype=torch.float32).view(-1, 1)
y_cls_tensor = torch.tensor(y_classification, dtype=torch.long)


X_train, X_test, y_reg_train, y_reg_test, y_cls_train, y_cls_test = train_test_split(
    X_tensor, y_reg_tensor, y_cls_tensor, test_size=0.2, random_state=42
)


batch_size = 32
train_loader_reg = DataLoader(TensorDataset(X_train, y_reg_train), batch_size=batch_size, shuffle=True)
test_loader_reg = DataLoader(TensorDataset(X_test, y_reg_test), batch_size=batch_size, shuffle=False)
train_loader_cls = DataLoader(TensorDataset(X_train, y_cls_train), batch_size=batch_size, shuffle=True)
test_loader_cls = DataLoader(TensorDataset(X_test, y_cls_test), batch_size=batch_size, shuffle=False)


class RegressionNN(nn.Module):
    def __init__(self, input_size):
        super(RegressionNN, self).__init__()
        self.model = nn.Sequential(
            nn.Linear(input_size, 128),
            nn.ReLU(),
            nn.BatchNorm1d(128),
            nn.Dropout(0.2),
            nn.Linear(128, 64),
            nn.ReLU(),
            nn.BatchNorm1d(64),
            nn.Dropout(0.2),
            nn.Linear(64, 32),
            nn.ReLU(),
            nn.Linear(32, 1)  
        )

    def forward(self, x):
        return self.model(x)


class ClassificationNN(nn.Module):
    def __init__(self, input_size, num_classes):
        super(ClassificationNN, self).__init__()
        self.model = nn.Sequential(
            nn.Linear(input_size, 64),
            nn.ReLU(),
            nn.Linear(64, 32),
            nn.ReLU(),
            nn.Linear(32, num_classes)  
        )

    def forward(self, x):
        return self.model(x)


device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
input_size = X_train.shape[1]
num_classes = 3  

regression_model = RegressionNN(input_size).to(device)
classification_model = ClassificationNN(input_size, num_classes).to(device)


criterion_reg = nn.MSELoss()
criterion_cls = nn.CrossEntropyLoss()
optimizer_reg = optim.Adam(regression_model.parameters(), lr=0.0005)
optimizer_cls = optim.Adam(classification_model.parameters(), lr=0.001)


def train_model(model, criterion, optimizer, train_loader, num_epochs=500):
    model.train()
    for epoch in range(num_epochs):
        total_loss = 0
        for X_batch, y_batch in train_loader:
            X_batch, y_batch = X_batch.to(device), y_batch.to(device)
            optimizer.zero_grad()
            predictions = model(X_batch)
            loss = criterion(predictions, y_batch)
            loss.backward()
            optimizer.step()
            total_loss += loss.item()
        print(f"Epoch {epoch+1}/{num_epochs}, Loss: {total_loss/len(train_loader):.4f}")


print("Training Regression Model...")
train_model(regression_model, criterion_reg, optimizer_reg, train_loader_reg)


print("Training Classification Model...")
train_model(classification_model, criterion_cls, optimizer_cls, train_loader_cls)


def evaluate_model(model, test_loader, task="regression"):
    model.eval()
    total_loss = 0
    correct = 0
    y_true, y_pred = [], []
    with torch.no_grad():
        for X_batch, y_batch in test_loader:
            X_batch, y_batch = X_batch.to(device), y_batch.to(device)
            predictions = model(X_batch)
            if task == "regression":
                loss = criterion_reg(predictions, y_batch)
                total_loss += loss.item()
                y_true.extend(y_batch.cpu().numpy())
                y_pred.extend(predictions.cpu().numpy())
            else:
                loss = criterion_cls(predictions, y_batch)
                total_loss += loss.item()
                preds = torch.argmax(predictions, dim=1)
                correct += (preds == y_batch).sum().item()
                y_true.extend(y_batch.cpu().numpy())
                y_pred.extend(preds.cpu().numpy())
    if task == "regression":
        print(f"Test Loss (MSE): {total_loss/len(test_loader):.4f}")
        print(f"Mean Absolute Error: {mean_absolute_error(y_true, y_pred):.4f}")
        print(f"Mean Squared Error: {mean_squared_error(y_true, y_pred):.4f}")
        print(f"R² Score: {r2_score(y_true, y_pred):.4f}")
    else:
        accuracy = correct / len(test_loader.dataset)
        print(f"Test Accuracy: {accuracy:.4f}")
        print("Classification Report:\n", classification_report(y_true, y_pred))


print("Evaluating Regression Model...")
evaluate_model(regression_model, test_loader_reg, task="regression")


print("Evaluating Classification Model...")
evaluate_model(classification_model, test_loader_cls, task="classification")


