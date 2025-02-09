from langchain_google_genai import ChatGoogleGenerativeAI
import requests
from dotenv import load_dotenv
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

# Load environment variables
def configure():
    load_dotenv()

# Define the data model
class UserData(BaseModel):
    name: str
    age: float
    income: float
    employment_len: float
    loan_amnt: float
    loan_int_rate: float
    loan_percent_income: float
    cred_hist_len: float
    ownership: str
    loan_intent: str
    creditScore: str

# Initialize FastAPI app
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://servolend-ai.onrender.com",
        "https://servolend-server.onrender.com",
        "http://localhost:3000",
        "https://servolend-analysis.onrender.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Initialize Google Generative AI model
llm = ChatGoogleGenerativeAI(model="gemini-1.5-pro", google_api_key=os.getenv("api_key"))

@app.post('/analyse')
def analyse(data: UserData):
    # Prepare input for the ML model
    model_input = {
        "age": data.age,
        "income": data.income,
        "employment_len": data.employment_len,
        "loan_amnt": data.loan_amnt,
        "loan_int_rate": data.loan_int_rate,
        "loan_percent_income": data.loan_percent_income,
        "cred_hist_len": data.cred_hist_len,
        "ownership": data.ownership,
        "loan_intent": data.loan_intent
    }

    # Call the ML model API
    ml_endpoint = os.getenv("ml_key")  # Ensure this environment variable is set correctly
    response = requests.post(ml_endpoint, json=model_input)

    if response.status_code != 200:
        return {"error": "Failed to fetch loan prediction. Please try again."}

    # Extract prediction probabilities from API response
    response_data = response.json()
    prob_eligible = response_data.get("prob_eligible", 0)  # Default to 0 if missing
    prob_not_eligible = response_data.get("prob_not_eligible", 0)

    # Generate response using LLM
    prompt = f"""
    You are a highly experienced financial advisor reviewing a loan application. Your task is to provide a *structured, professional, and insightful financial assessment* based on the applicant's profile highlighting the numbers. 
    Start the greeting with name input by the user. The whole analysis is with respect to Indian currency so use only ruppee symbol where ever required.

---

## *Applicant Information:*  
- *Name:* {data.name}  
- *Age:* {data.age}  
- *Income:* ${data.income}  
- *Ownership Status:* {data.ownership}  
- *Employment Length:* {data.employment_len} years  
- *Loan Purpose:* {data.loan_intent}  
- *Requested Loan Amount:* ₹{data.loan_amnt}  
- *Interest Rate:* {data.loan_int_rate}%  
- *Loan-to-Income Ratio:* {data.loan_percent_income}%  
- *Credit History Length:* {data.cred_hist_len} years  
- *Credit Score:* {data.creditScore}  

---
Generate only about 6 points with heading and a short description make it very concise not more than 6 points

## *Loan Eligibility Assessment:*  
Based on the backend evaluation system, here are the estimated probabilities:  
-*Probability of Loan Approval:* {prob_eligible:.2f}  
-*Probability of Loan Rejection:* {prob_not_eligible:.2f}  

### *Your Task:*  

#### *1️ For Eligible Applicants (High Probability of Approval)*  
- If the applicant is *likely to be approved*, begin the response with:  
*"Congratulations! Based on your financial profile, you are highly likely to receive loan approval."*  
- Provide a *structured breakdown of key strengths*

#### *2️For Ineligible Applicants (Low Probability of Approval)*  
- If the applicant is *likely to be rejected*, start with:  
  ⚠ “Based on the financial assessment, you may face challenges in securing loan approval. However, there are steps you can take to improve your eligibility.”

Key Rejection Factors & Recommendations based on Income, Debt-to-Income Ratio, credit score, loan amount

### *Formatting & Style Guidelines:*  
✔ *Do NOT mention "model predictions" or "ML-based evaluation."*  
✔ *Maintain a professional, structured, and empathetic tone.*   
✔ *Generate only about 6 points with heading and a short description.*  
✔ *Provide concise responses for approved applicants and detailed improvement plans for ineligible ones.*  
"""



    ans = llm.invoke(prompt)
    return {"message": ans.content}

# Run FastAPI server
configure()

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
