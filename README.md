🌱 AgroCloud – AI-Based Smart Irrigation System

AgroCloud is an intelligent, cloud-ready irrigation management system that uses machine learning to predict whether irrigation is required based on environmental and agricultural conditions.

The project aims to help farmers make data-driven decisions, reduce water wastage, and improve crop productivity.

🚀 Features
🔐 User Authentication (Login / Signup)
🤖 AI-based Irrigation Prediction
👨‍🌾 Farmer Dashboard
📊 Data Visualization & Analytics
🕒 Prediction History Tracking
☁️ Cloud-Ready Architecture
🧠 How It Works
-> User logs into the platform
-> Inputs environmental data:
     Temperature
     Humidity
     Rainfall
     Soil Type
     Crop Type
-> Data is sent to the backend API
-> Machine Learning model processes the input
-> Prediction is generated:
      Irrigation Needed
      No Irrigation Needed
-> Result is stored in the database
-> Dashboard displays insights and history

🏗️ Tech Stack: 

🔹 Frontend
React.js
Tailwind CSS

🔹 Backend
Python (Flask)
REST APIs

🔹 Machine Learning
Scikit-learn
Model exported as .pkl

🔹 Database & Authentication (Current)
Firebase Authentication
Firebase Firestore

☁️ Cloud Perspective
Currently, AgroCloud uses Firebase for rapid development and real-time database capabilities.
However, the system is designed to be cloud-independent and scalable.

🔄 Planned AWS Migration

We are planning to migrate to AWS services for production-level deployment:
🖥️ AWS EC2 – Backend hosting
🗄️ DynamoDB – Scalable NoSQL database
📡 AWS IoT Core – Real-time sensor integration
📊 CloudWatch – Monitoring & logging

  ha# AgroCloud — Smart Irrigation System

## Project Structure
```
agrocloud/
├── backend/        # Flask API + ML model
├── frontend/       # React + Vite + Tailwind
├── data/           # irrigation.csv dataset
└── Model/          # train_model.py + model pkl
```

## Setup & Run

### Backend (Python Flask)

```bash
cd backend
pip install -r requirements.txt
python app.py
```
> Runs on http://localhost:5000
> Requires `firebase-key.json` in the backend/ folder (already included).

### Frontend (React + Vite)

```bash
cd frontend
npm install
cp .env.example .env        # or create .env manually
npm run dev
```
> Runs on http://localhost:5173

### .env file for frontend
```
VITE_API_BASE_URL=http://localhost:5000
```
