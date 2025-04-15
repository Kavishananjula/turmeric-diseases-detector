# 🌿 Plant Disease Detection System

This project is a mobile-based **Plant Disease Detection System** powered by **React Native** (frontend) and **FastAPI** (backend). It allows users to capture or upload plant images, send them to the server, and get disease predictions using a trained **TensorFlow** model.

---

## 📱 Frontend - React Native

### Features:
- Capture or upload plant images
- Send image to backend for prediction
- Display disease name and possible remedy
- Clean and user-friendly UI

### Run Frontend:

1. Navigate to the `frontend` directory:

```bash
cd frontend


Install dependencies:

npm install
Start the React Native server (using Expo):

npx expo start
📱 Use the Expo Go app on your phone to scan the QR code and run the app.


⚙️ Backend - FastAPI

Features:
Accepts image uploads via POST request

Loads and predicts plant disease using a trained TensorFlow model

Returns disease name and confidence score

Run Backend:

1. Navigate to the backend directory:
cd backend

2. Create a virtual environment and activate it:
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

3. Install dependencies:
pip install -r requirements.txt

4. Start the FastAPI server:
uvicorn main:app --reload

5. Open in browser:
http://127.0.0.1:8000/docs
🧪 You can test the API endpoints directly from the Swagger UI.



✅ Requirements

Frontend
Node.js
Expo CLI
React Native

Backend
Python 3.8+
FastAPI
Uvicorn
TensorFlow