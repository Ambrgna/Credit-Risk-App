from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression


app = FastAPI()

# Allow frontend access (adjust port if needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "FastAPI backend is running"}

# Define the loan model
class Loan(BaseModel):
    person_age: int
    person_income: float
    person_homeownership: str
    person_emplength: int
    loan_intent: str
    loan_grade: str
    loan_amnt: float
    loan_intrate: float
    loan_percentincome: float
    defaultonfile: bool
    credhistlength: int

# Mock ML model prediction
@app.post("/predict/model1")
def predict_model1(loan: Loan):
    df = pd.read_csv('CreditDataCleanOHEVer.csv')

    X = df.drop('loan_status', axis=1)
    y = df['loan_status']
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.3)

    # Train logistic regression model
    model = LogisticRegression(solver="saga", max_iter=2000)
    model.fit(X_train, y_train)

    # Predict
    y_pred = model.predict(X_test)

    # Accuracy
    accuracy = accuracy_score(y_test, y_pred)
    # Name of Model
    name = "Linear Regression"
    
    # Model Prediction
    person_age = loan.person_age
    person_income = loan.person_income
    person_emp_length = loan.person_emplength
    loan_amnt = loan.loan_amnt
    loan_int_rate = loan.loan_intrate
    loan_percent_income = loan.loan_percentincome
    cb_person_cred_hist_length = loan.credhistlength

    person_home_ownership_MORTGAGE = 0
    person_home_ownership_OTHER = 0
    person_home_ownership_OWN = 0
    person_home_ownership_RENT = 0
    if loan.person_homeownership == 'RENT':
        person_home_ownership_RENT = 1
    elif loan.person_homeownership == 'OWN':
        person_home_ownership_OWN = 1
    elif loan.person_homeownership == 'MORTGAGE':
        person_home_ownership_MORTGAGE = 1
    elif loan.person_homeownership == 'OTHER':
        person_home_ownership_OTHER = 1

    

    loan_intent_DEBTCONSOLIDATION = 0
    loan_intent_EDUCATION = 0
    loan_intent_HOMEIMPROVEMENT = 0
    loan_intent_MEDICAL = 0
    loan_intent_PERSONAL = 0
    loan_intent_VENTURE = 0
    if loan.loan_intent == 'DEBT_CONSOLIDATION':
        loan_intent_DEBTCONSOLIDATION = 1
    elif loan.loan_intent == 'EDUCATION':
        loan_intent_EDUCATION = 1
    elif loan.loan_intent == 'HOME_IMPROVEMENT':
        loan_intent_HOMEIMPROVEMENT = 1
    elif loan.loan_intent == 'MEDICAL':
        loan_intent_MEDICAL = 1
    elif loan.loan_intent == 'PERSONAL':
        loan_intent_PERSONAL = 1
    elif loan.loan_intent == 'VENTURE':
        loan_intent_VENTURE = 1

    loan_grade_A = 0
    loan_grade_B = 0
    loan_grade_C = 0
    loan_grade_D = 0
    loan_grade_E = 0
    loan_grade_F = 0
    loan_grade_G = 0
    if loan.loan_grade == 'A':
        loan_grade_A = 1
    elif loan.loan_grade == 'B':
        loan_grade_B = 1
    elif loan.loan_grade == 'C':
        loan_grade_C = 1
    elif loan.loan_grade == 'D':
        loan_grade_D = 1
    elif loan.loan_grade == 'E':
        loan_grade_E = 1
    elif loan.loan_grade == 'F':
        loan_grade_F = 1
    elif loan.loan_grade == 'G':
        loan_grade_G = 1


    cb_person_default_on_file_N = 0
    cb_person_default_on_file_Y = 0
    if loan.defaultonfile:
        cb_person_default_on_file_Y = 1
    else:
        cb_person_default_on_file_N = 1

    example = pd.DataFrame([[
        person_age,
        person_income,
        person_emp_length,
        loan_amnt,
        loan_int_rate,
        loan_percent_income,
        cb_person_cred_hist_length,
        person_home_ownership_MORTGAGE,
        person_home_ownership_OTHER,
        person_home_ownership_OWN,
        person_home_ownership_RENT,
        loan_intent_DEBTCONSOLIDATION,
        loan_intent_EDUCATION,
        loan_intent_HOMEIMPROVEMENT,
        loan_intent_MEDICAL,
        loan_intent_PERSONAL,
        loan_intent_VENTURE,
        loan_grade_A,
        loan_grade_B,
        loan_grade_C,
        loan_grade_D,
        loan_grade_E,
        loan_grade_F,
        loan_grade_G,
        cb_person_default_on_file_N,
        cb_person_default_on_file_Y
    ]], columns=X.columns)

    predicted_status = model.predict(example)[0]

    return {
        "name": name,
        "result": predicted_status,
        "accuracy": accuracy
        }

@app.post("/predict/model2")
def predict_model2(loan: Loan):
    name = loan.loan_intent
    result = loan.person_homeownership
    accuracy = loan.person_age*2

    return {
        "name": name,
        "result": result,
        "accuracy": accuracy
        }
