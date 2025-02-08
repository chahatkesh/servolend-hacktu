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
    allow_origins=["*"],  # Allows all origins
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
    Start the greeting with name input by the user.

---

## *Applicant Information:*  
- *Name:* {data.name}  
- *Age:* {data.age}  
- *Income:* ${data.income}  
- *Ownership Status:* {data.ownership}  
- *Employment Length:* {data.employment_len} years  
- *Loan Purpose:* {data.loan_intent}  
- *Requested Loan Amount:* ${data.loan_amnt}  
- *Interest Rate:* {data.loan_int_rate}%  
- *Loan-to-Income Ratio:* {data.loan_percent_income}%  
- *Credit History Length:* {data.cred_hist_len} years  
- *Credit Score:* {data.creditScore}  

---

## *Loan Eligibility Assessment:*  
Based on the backend evaluation system, here are the estimated probabilities:  
- ✅ *Probability of Loan Approval:* {prob_eligible:.2f}  
- ❌ *Probability of Loan Rejection:* {prob_not_eligible:.2f}  

### *Your Task:*  

#### *1️⃣ For Eligible Applicants (High Probability of Approval)*  
- If the applicant is *likely to be approved*, begin the response with:  
  ✅ *"Congratulations! Based on your financial profile, you are highly likely to receive loan approval."*  
- Provide a *structured breakdown of key strengths*, such as:  b
  - *Stable income* and employment history  
  - *Good credit score and long credit history*  
  - *Low debt-to-income ratio*  
  - *Manageable loan amount relative to income*  
- Offer *brief financial advice* to maintain or improve their standing.  

#### *2️⃣ For Ineligible Applicants (Low Probability of Approval)*  
- If the applicant is *likely to be rejected*, start with:  
  ⚠ “Based on the financial assessment, you may face challenges in securing loan approval. However, there are steps you can take to improve your eligibility.”

Key Rejection Factors & Recommendations
	1.	Income – If your income is insufficient for the requested loan amount, consider exploring higher-paying job opportunities or additional income sources to strengthen your financial position.
	2.	Debt-to-Income Ratio – A high debt-to-income ratio can impact your approval chances. Prioritizing debt repayment strategies before reapplying can help improve this metric.
	3.	Credit Score – A low credit score or poor payment history may reduce approval chances. To improve your score, focus on making timely payments, reducing credit utilization, and maintaining responsible credit habits.
	4.	Credit History Length – A short credit history may not provide enough data for a strong evaluation. Keeping credit accounts open and avoiding unnecessary credit checks can help build a more favorable credit profile over time.
	5.	Employment Stability – An unstable job history can be a concern for lenders. Maintaining steady employment for at least 6 to 12 months before reapplying can improve your financial reliability.
	6.	Loan Amount – If the loan amount is too high relative to your income, consider applying for a lower amount or opting for a secured loan to increase your chances of approval.

By addressing these factors, you can enhance your loan eligibility and improve your chances of approval in the future.
#### *3️⃣ Additional Financial Guidance:*  
- *Alternative Solutions:* Suggest options like *co-signers*, secured loans, or government-backed loan programs.  
- *Reapplication Timeline:* Provide a timeframe (e.g., *6-12 months*) for when they should consider reapplying based on improvements.  

---

### *Formatting & Style Guidelines:*  
✔ *Do NOT mention "model predictions" or "ML-based evaluation."*  
✔ *Maintain a professional, structured, and empathetic tone.*  
✔ *Use a clean Markdown format for readability, including proper white space for clarity.*  
✔ *Provide concise responses for approved applicants and detailed improvement plans for ineligible ones.*  
"""



    ans = llm.invoke(prompt)
    return {"message": ans.content}

# Run FastAPI server
configure()

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
