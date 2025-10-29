from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

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
    name = loan.person_homeownership
    result = loan.person_emplength
    accuracy = loan.person_income

    return {
        "name": name,
        "result": result,
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
