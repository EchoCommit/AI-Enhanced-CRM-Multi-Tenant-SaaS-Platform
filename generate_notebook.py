import nbformat as nbf
import os

nb = nbf.v4.new_notebook()

code_cells = [
    """# CRM AI Model Training
import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import roc_auc_score, accuracy_score, mean_squared_error, r2_score
import pickle
import joblib
import os""",
    
    """# Load the data
df = pd.read_csv('crm_cleaned_2023_2026.csv')

# Time-based split configuration
# Train: 2023-2024
# Val: 2025
# Test: 2026 (Jan-Feb)
df['created_date'] = pd.to_datetime(df['created_date'])

train_df = df[df['created_date'].dt.year.isin([2023, 2024])]
val_df = df[df['created_date'].dt.year == 2025]
test_df = df[df['created_date'].dt.year == 2026]

print(f"Train size: {len(train_df)}")
print(f"Val size: {len(val_df)}")
print(f"Test size: {len(test_df)}")""",

    """# Preprocessing Setup
categorical_features = ['industry', 'country', 'company_size', 'lead_source', 'subscription_tier', 'ai_tools_used', 'assigned_role', 'usage_bucket', 'period_label']
numeric_features = ['deal_value_usd', 'annual_contract_value', 'num_employees', 'num_activities', 'num_emails_sent', 'num_calls', 'num_meetings', 'response_time_hrs', 'days_in_pipeline', 'sales_cycle_days', 'competitor_mentioned', 'budget_confirmed', 'decision_maker_contact', 'previous_customer', 'nps_score', 'csat_score', 'months_as_customer', 'monthly_revenue', 'mrr_usd', 'support_tickets', 'product_usage_score', 'login_frequency', 'feature_adoption_pct', 'contract_length_months', 'discount_given_pct', 'activity_per_day', 'email_response_ratio', 'engagement_score', 'high_value_deal', 'fast_response', 'at_risk_churn', 'ai_assisted', 'above_avg_cycle']

preprocessor = ColumnTransformer(
    transformers=[
        ('num', StandardScaler(), numeric_features),
        ('cat', OneHotEncoder(handle_unknown='ignore', sparse_output=False), categorical_features)
    ])""",

    """# Model 1: Lead Scoring (Target: lead_hot)
X_train = train_df[numeric_features + categorical_features]
y_train = train_df['lead_hot']
X_val = val_df[numeric_features + categorical_features]
y_val = val_df['lead_hot']
X_test = test_df[numeric_features + categorical_features]
y_test = test_df['lead_hot']

# Preprocess data
X_train_processed = preprocessor.fit_transform(X_train)
X_val_processed = preprocessor.transform(X_val)
X_test_processed = preprocessor.transform(X_test)

# Calculate scale_pos_weight
neg_count = len(y_train) - sum(y_train)
pos_count = sum(y_train)
scale_pos_weight = neg_count / pos_count if pos_count > 0 else 1

lead_model = xgb.XGBClassifier(
    n_estimators=500,
    learning_rate=0.05,
    max_depth=6,
    scale_pos_weight=scale_pos_weight,
    early_stopping_rounds=10,
    eval_metric="auc",
    random_state=42
)

lead_model.fit(
    X_train_processed, y_train,
    eval_set=[(X_val_processed, y_val)],
    verbose=50
)

# Test Performance
y_pred_proba = lead_model.predict_proba(X_test_processed)[:, 1]
auc = roc_auc_score(y_test, y_pred_proba)
print(f"Lead Scoring Test AUC: {auc:.4f}")

# Save model & preprocessor
os.makedirs('models', exist_ok=True)
with open('models/lead_scoring_model.pkl', 'wb') as f:
    pickle.dump(lead_model, f)
with open('models/preprocessor.pkl', 'wb') as f:
    pickle.dump(preprocessor, f)""",

    """# Model 2: Churn Prediction (Target: churned)
# Drop na targets if any
train_churn = train_df.dropna(subset=['churned'])
val_churn = val_df.dropna(subset=['churned'])
test_churn = test_df.dropna(subset=['churned'])

X_train = train_churn[numeric_features + categorical_features]
y_train = train_churn['churned']
X_val = val_churn[numeric_features + categorical_features]
y_val = val_churn['churned']
X_test = test_churn[numeric_features + categorical_features]
y_test = test_churn['churned']

X_train_processed = preprocessor.transform(X_train)
X_val_processed = preprocessor.transform(X_val)
X_test_processed = preprocessor.transform(X_test)

neg_count = len(y_train) - sum(y_train)
pos_count = sum(y_train)
scale_pos_weight = neg_count / pos_count if pos_count > 0 else 1

churn_model = xgb.XGBClassifier(
    n_estimators=500,
    learning_rate=0.05,
    max_depth=6,
    scale_pos_weight=scale_pos_weight,
    early_stopping_rounds=10,
    eval_metric="auc",
    random_state=42
)

churn_model.fit(
    X_train_processed, y_train,
    eval_set=[(X_val_processed, y_val)],
    verbose=50
)

# Test Performance
y_pred_proba = churn_model.predict_proba(X_test_processed)[:, 1]
auc = roc_auc_score(y_test, y_pred_proba)
print(f"Churn Prediction Test AUC: {auc:.4f}")

# Save model
with open('models/churn_model.pkl', 'wb') as f:
    pickle.dump(churn_model, f)""",

    """# Model 3: Deal Close Probability (Target: deal_close_prob)
train_deal = train_df.dropna(subset=['deal_close_prob'])
val_deal = val_df.dropna(subset=['deal_close_prob'])
test_deal = test_df.dropna(subset=['deal_close_prob'])

X_train = train_deal[numeric_features + categorical_features]
y_train = train_deal['deal_close_prob']
X_val = val_deal[numeric_features + categorical_features]
y_val = val_deal['deal_close_prob']
X_test = test_deal[numeric_features + categorical_features]
y_test = test_deal['deal_close_prob']

X_train_processed = preprocessor.transform(X_train)
X_val_processed = preprocessor.transform(X_val)
X_test_processed = preprocessor.transform(X_test)

deal_model = xgb.XGBRegressor(
    n_estimators=500,
    learning_rate=0.05,
    max_depth=6,
    early_stopping_rounds=10,
    eval_metric="rmse",
    random_state=42
)

deal_model.fit(
    X_train_processed, y_train,
    eval_set=[(X_val_processed, y_val)],
    verbose=50
)

# Test Performance
y_pred = deal_model.predict(X_test_processed)
mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)
print(f"Deal Close Probability Test MSE: {mse:.4f}")
print(f"Deal Close Probability Test R2: {r2:.4f}")

# Save model
with open('models/deal_prob_model.pkl', 'wb') as f:
    pickle.dump(deal_model, f)
print("All models successfully trained and saved as .pkl in the models/ directory.")"""
]

cells = [nbf.v4.new_code_cell(code) for code in code_cells]
nb['cells'] = cells

with open('train_models.ipynb', 'w') as f:
    nbf.write(nb, f)
