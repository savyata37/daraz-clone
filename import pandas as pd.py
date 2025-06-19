import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import xgboost as xgb
from datetime import datetime
from pytrends.request import TrendReq
import pickle, os

from sklearn.model_selection import train_test_split, RandomizedSearchCV
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
from ratelimit import limits, sleep_and_retry
from tenacity import retry, wait_exponential, stop_after_attempt

# --- 1. Feature Engineering ---
df['last_restocked_date'] = pd.to_datetime(df['last_restocked_date'], format="%m/%d/%Y")
today = datetime.today()

df['days_since_restock'] = (today - df['last_restocked_date']).dt.days
df['revenue'] = df['selling_price'] * df['sales_volume']
df['profit_per_unit'] = df['selling_price'] - df['base_price']
df['total_profit'] = df['profit_per_unit'] * df['sales_volume']
df['price_elasticity_proxy'] = df['sales_volume'] / df['selling_price']
df['product_category_code'] = df['product_category'].astype('category').cat.codes
df['brand_code'] = df['brand_name'].astype('category').cat.codes
df['cat_brand_interaction'] = df['product_category_code'] * df['brand_code']

df['month'] = df['last_restocked_date'].dt.month
df['day_of_week'] = df['last_restocked_date'].dt.dayofweek
df['is_weekend'] = df['day_of_week'].isin([5,6]).astype(int)

df = df.sort_values(['product_id', 'last_restocked_date'])
df['rolling_sales_7d'] = df.groupby('product_id')['sales_volume'].transform(lambda x: x.rolling(window=7, min_periods=1).mean())

df['days_since_last_restock'] = (pd.to_datetime("today") - df['last_restocked_date']).dt.days
df['price_margin'] = df['selling_price'] - df['base_price']
df['discount_rate'] = df['price_margin'] / df['base_price']
df['sales_rate'] = df['sales_volume'] / df['days_since_last_restock'].replace(0, 1)

# One-hot encode
df_encoded = pd.get_dummies(df, columns=['product_category', 'brand_name'], drop_first=True)

# --- 2. Google Trends Integration ---
pytrends = TrendReq(hl='en-US', tz=360, timeout=(10, 25))
CACHE_FILE = 'google_trends_cache.pkl'
if os.path.exists(CACHE_FILE):
    with open(CACHE_FILE, 'rb') as f:
        seasonality_cache = pickle.load(f)
else:
    seasonality_cache = {}

ONE_MINUTE = 60

@sleep_and_retry
@limits(calls=15, period=ONE_MINUTE)
@retry(wait=wait_exponential(multiplier=1, min=4, max=60), stop=stop_after_attempt(5))
def fetch_google_trend(keyword):
    try:
        pytrends.build_payload([keyword], timeframe='today 12-m')
        df_trend = pytrends.interest_over_time()
        return df_trend[keyword] if not df_trend.empty else None
    except Exception as e:
        print(f"Error fetching trend for {keyword}: {e}")
        return None

def get_trend_score(keyword, date):
    if keyword not in seasonality_cache:
        series = fetch_google_trend(keyword)
        seasonality_cache[keyword] = series
        with open(CACHE_FILE, 'wb') as f:
            pickle.dump(seasonality_cache, f)
    else:
        series = seasonality_cache[keyword]

    if series is None: return np.nan
    try:
        return series.iloc[series.index.get_loc(pd.to_datetime(date), method='nearest')]
    except: return np.nan

print("📊 Fetching Google Trends scores...")
df_encoded['google_trend_score'] = df_encoded.apply(
    lambda row: get_trend_score(row['product_category'], row['last_restocked_date']), axis=1
)
df_encoded['google_trend_score'].fillna(df_encoded['google_trend_score'].median(), inplace=True)
print("✅ Google Trends added.")

# --- 3. Prepare DataFrames ---
model_df = df_encoded.copy()

# Remove leakage features for restock model
leakage_features = [
    'rolling_sales_7d', 'sales_rate', 'total_profit', 'discount_rate',
    'revenue', 'days_since_last_restock', 'profit_per_unit',
    'price_margin', 'price_elasticity_proxy'
]

X_price = model_df.drop(columns=['selling_price'])
y_price = model_df['selling_price']

X_restock = model_df.drop(columns=['stock_left'] + leakage_features)
y_restock = np.log1p(model_df['stock_left'])

# --- 4. Visualize Distributions ---
sns.histplot(model_df['stock_left'], kde=True)
plt.title("Distribution of Stock Left")
plt.show()

sns.histplot(y_restock, kde=True)
plt.title("Log-Transformed Stock Left")
plt.show()

# --- 5. Train-Test Split ---
X_train_price, X_test_price, y_train_price, y_test_price = train_test_split(
    X_price, y_price, test_size=0.2, random_state=42)

X_train_restock, X_test_restock, y_train_restock, y_test_restock = train_test_split(
    X_restock, y_restock, test_size=0.2, random_state=42)

# --- 6. Train Pricing Model (Random Forest) ---
rf = RandomForestRegressor(random_state=42)
param_dist = {
    'n_estimators': [100, 200],
    'max_depth': [10, 20, None],
    'min_samples_split': [2, 5],
    'min_samples_leaf': [1, 2],
    'max_features': ['auto', 'sqrt']
}
random_search = RandomizedSearchCV(
    rf, param_distributions=param_dist, n_iter=10,
    cv=3, verbose=1, random_state=42, n_jobs=-1, scoring='neg_mean_squared_error'
)
random_search.fit(X_train_price, y_train_price)
best_rf = random_search.best_estimator_
y_pred_price = best_rf.predict(X_test_price)

# --- 7. Train Restock Model (XGBoost) ---
dtrain = xgb.DMatrix(X_train_restock, label=y_train_restock)
dtest = xgb.DMatrix(X_test_restock, label=y_test_restock)

params = {
    'objective': 'reg:squarederror',
    'eval_metric': 'rmse',
    'seed': 42,
    'eta': 0.1,
    'max_depth': 6,
    'subsample': 0.8,
    'colsample_bytree': 0.8
}

restock_xgb = xgb.train(
    params, dtrain, num_boost_round=100,
    evals=[(dtest, 'eval')], early_stopping_rounds=10, verbose_eval=False
)

# Convert predictions back
y_pred_restock_log = restock_xgb.predict(dtest)
y_pred_restock = np.expm1(y_pred_restock_log)
y_test_restock_raw = np.expm1(y_test_restock)

# --- 8. Evaluation ---
def evaluate_model(y_true, y_pred, model_name):
    rmse = np.sqrt(mean_squared_error(y_true, y_pred))
    r2 = r2_score(y_true, y_pred)
    mae = mean_absolute_error(y_true, y_pred)
    print(f"--- {model_name} ---")
    print(f"RMSE: {rmse:.4f}")
    print(f"R² Score: {r2:.4f}")
    print(f"MAE: {mae:.4f}\n")

evaluate_model(y_test_price, y_pred_price, "Pricing Model (Random Forest)")
evaluate_model(y_test_restock_raw, y_pred_restock, "Restock Model (XGBoost)")

# --- 9. Feature Importances ---
def plot_feature_importance(model, features, title):
    importances = model.feature_importances_ if hasattr(model, 'feature_importances_') else None
    if importances is not None:
        importance_df = pd.DataFrame({'Feature': features, 'Importance': importances})
        importance_df = importance_df.sort_values(by='Importance', ascending=False)
        plt.figure(figsize=(10,6))
        sns.barplot(data=importance_df, x='Importance', y='Feature')
        plt.title(title)
        plt.tight_layout()
        plt.show()

plot_feature_importance(best_rf, X_price.columns, "Feature Importance - Pricing Model")
plot_feature_importance(restock_xgb, X_restock.columns, "Feature Importance - Restock Model")
