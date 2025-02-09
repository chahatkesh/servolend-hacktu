# ServoLend 💸

> An AI-powered lending platform that revolutionizes the loan processing experience for both financial institutions and borrowers.

---

![servolend repo cover](https://github.com/user-attachments/assets/27be34cb-fc0f-4a1a-8371-9d495ab0f74f)

## 🛠️ Built With

### Frontend & Design
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Lucide](https://img.shields.io/badge/Lucide-40E0D0?style=for-the-badge&logo=lucide&logoColor=white)](https://lucide.dev/)
[![Lottie](https://img.shields.io/badge/Lottie-FF69B4?style=for-the-badge&logo=airbnb&logoColor=white)](https://airbnb.design/lottie/)

### Backend & API
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Uvicorn](https://img.shields.io/badge/Uvicorn-2E303E?style=for-the-badge&logo=python&logoColor=white)](https://www.uvicorn.org/)

### Machine Learning & Data Science
[![NumPy](https://img.shields.io/badge/NumPy-013243?style=for-the-badge&logo=numpy&logoColor=white)](https://numpy.org/)
[![Pandas](https://img.shields.io/badge/Pandas-150458?style=for-the-badge&logo=pandas&logoColor=white)](https://pandas.pydata.org/)
[![Seaborn](https://img.shields.io/badge/Seaborn-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://seaborn.pydata.org/)
[![Matplotlib](https://img.shields.io/badge/Matplotlib-11557c?style=for-the-badge&logo=python&logoColor=white)](https://matplotlib.org/)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)
[![Pickle](https://img.shields.io/badge/Pickle-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://docs.python.org/3/library/pickle.html)

### AI & Analytics
[![LangChain](https://img.shields.io/badge/LangChain-3178C6?style=for-the-badge&logo=chainlink&logoColor=white)](https://langchain.org/)
[![Gemini](https://img.shields.io/badge/Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)
[![Jupyter](https://img.shields.io/badge/Jupyter-F37626?style=for-the-badge&logo=jupyter&logoColor=white)](https://jupyter.org/)

### Development & Deployment Tools
[![Google Auth](https://img.shields.io/badge/Google_Auth-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://developers.google.com/identity)
[![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)](https://axios-http.com/)
[![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)](https://www.postman.com/)
[![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://render.com/)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/)
[![Notion](https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=notion&logoColor=white)](https://www.notion.so/)

## ✨ Key Features

### 🏦 For Financial Institutions
- **Automated Processing**
  - Reduce manual work by 80% with AI-powered automation
  - Streamline loan application workflows
- **Cost Reduction**
  - Lower operational costs by up to 60% through digitization
  - Optimize resource allocation
- **Risk Management**
  - Advanced analytics for better risk assessment
  - Predictive modeling for default prevention
- **Compliance**
  - Automatic regulatory compliance checks and updates
  - Real-time regulation monitoring

### 👥 For Borrowers
- **Quick Approvals**
  - Get loan decisions in minutes, not days
  - Streamlined application process
- **Transparent Process**
  - Real-time updates and clear progress tracking
  - Detailed status notifications
- **Better Rates**
  - Competitive interest rates through smart matching
  - Personalized loan offers
- **Digital Experience**
  - Paperless process with digital document signing
  - Intuitive user interface

## 📂 Project Structure

```
chahatkesh-servolend-hacktu/
├── client/               # Web application (React with Vite)
├── client_mobile/       # Mobile application (Flutter)
├── ml-services/         # Machine learning services
├── model/              # ML model and datasets
└── server/             # Backend server (Node.js)
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- Flutter SDK
- Python 3.8+
- npm

### Step-by-Step Installation

1. **Clone the Repository**
```bash
git clone https://github.com/chahatkesh/servolend-hacktu.git
cd servolend-hacktu
```

2. **Web Application Setup**
```bash
cd client
npm install
```

3. **Server Setup**
```bash
cd ../server
npm install
```

4. **Mobile App Setup**
```bash
cd ../client_mobile/servolend_ai
flutter pub get
```

## ⚙️ Configuration

1. Create `.env` files in both `client` and `server` directories
2. Configure the following environment variables:

```env
# Server
PORT=3000
MONGODB_URI=mongodb_url
JWT_SECRET=your_random_secret
GOOGLE_CLIENT_ID=google_client_id
GOOGLE_CLIENT_SECRET=google_client_secret
NODE_ENV=development

# Client
VITE_API_URL=http://localhost:3000/
VITE_GOOGLE_CLIENT_ID=google_client_id
```

## 🎯 Running the Application

### Web Application
```bash
cd client
npm run dev
```

### Server
```bash
cd server
npm run dev
```

### Mobile Application
```bash
cd client_mobile/servolend_ai
flutter run
```

## 🔒 Security Features

- Bank-grade encryption for data protection
- JWT-based authentication
- Role-based access control
- Secure document handling
- Regular security audits

## 📱 Mobile Application Features

- Intuitive loan application process
- Document scanning and verification
- Real-time application status
- Push notifications
- Biometric authentication

## 👥 Meet the Team

- **Frontend Development**
  - [Harshvardhan Agarwal](https://github.com/Harshvardhan-91)
  - [Chahat Kesharwani](https://github.com/chahatkesh)
- **Backend Development**
  - [Chahat Kesharwani](https://github.com/chahatkesh)
- **Machine Learning**
  - [Ratinderdeep Singh](https://github.com/iamratinder)
- **Mobile Development**
  - [Jagjit Singh](https://github.com/jagjit0306)
- **Presentation**
  - [Saksham Gupta](https://github.com/saksham240)

## 📬 Contact & Support

Need help? Reach out to us:
- 📧 Email: ckesharwani4@gmail.com
- 🌐 Website: https://servolend-ai.onrender.com

---

Made with ❤️ by Team Rio
