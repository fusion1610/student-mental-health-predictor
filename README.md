# 🧠 Student Mental Health Score Prediction

A full-stack machine learning application that predicts a student's mental health score based on demographic information, academic habits, social media usage, lifestyle, sleep, physical activity, and stress level.

The project combines a **Machine Learning model**, **FastAPI backend**, **HTML/CSS/JavaScript frontend**, and **Docker** for deployment.

---

## 🚀 Live Demo

> Add your Render deployment URL here after deployment.

**Live Application:** `https://student-mental-health-predictor-3ssw.onrender.com/`

**API Documentation:** `https://student-mental-health-predictor-3ssw.onrender.com/docs`

---

## 📌 Features

* 🧠 Machine learning-based mental health score prediction
* ⚡ FastAPI REST API
* 🎨 Modern dark-themed responsive frontend
* 📱 Mobile-friendly UI
* 🔐 Pydantic request validation
* 🐳 Dockerized application
* ☁️ Deployable on Render
* 📊 Interactive prediction form
* 🔄 Real-time prediction without page reload
* ⚠️ Client-side and server-side validation
* 📖 Automatic Swagger API documentation

---

## 🏗️ Tech Stack

### Machine Learning

* Python
* Numpy
* Pandas
* Scikit-learn
* Random Forest Regressor
* Jupyter Notebook

### Backend

* FastAPI
* Uvicorn
* Pydantic

### Frontend

* HTML5
* CSS3
* Vanilla JavaScript
* Responsive Design

### Deployment

* Docker
* GitHub
* Render

---

## 📂 Project Structure

```text
student-mental-health/
│
├── main.py
├── requirements.txt
├── Dockerfile
├── .dockerignore
│
├── Mental_Health_Model.pkl
├── ML_Project.ipynb
├── Student Social Media And Mental Health Impact.csv
│
├── models/
│   ├── __init__.py
│   ├── student.py
│   └── prediction_response.py
│
├── routes/
│   ├── __init__.py
│   └── predict_route.py
│
├── services/
│   ├── __init__.py
│   └── prediction_service.py
│
└── frontend/
    ├── index.html
    ├── style.css
    └── script.js
```

The original machine learning experimentation notebook is kept outside the Docker image using `.dockerignore`.

---

## 🧠 Input Features

The prediction model uses the following features:

| Feature                   | Description                                |
| ------------------------- | ------------------------------------------ |
| `Age`                     | Student's age                              |
| `Gender`                  | Student's gender                           |
| `Country`                 | Student's country                          |
| `Academic_Level`          | High School, Undergraduate, or Graduate    |
| `Most_Used_Platform`      | Most frequently used social media platform |
| `Purpose_Of_Use`          | Primary reason for using social media      |
| `Avg_Daily_Usage_Hours`   | Average daily social media usage           |
| `Daily_Unlocks`           | Number of daily phone unlocks              |
| `Study_Hours`             | Daily study hours                          |
| `Physical_Activity_Hours` | Daily physical activity                    |
| `Sleep_Hours_Per_Night`   | Average sleep duration                     |
| `Stress_Level`            | Reported stress level                      |
| `Grouped_country`         | Grouped country category used by the model |

---

## 🔌 API

### Prediction Endpoint

```http
POST /predict
```

### Request

Example request body:

```json
{
    "age": 21,
    "gender": "Male",
    "country": "India",
    "academic_level": "Undergraduate",
    "most_used_platform": "Instagram",
    "purpose_of_use": "Entertainment",
    "avg_daily_usage_hours": 5.5,
    "daily_unlocks": 80,
    "study_hours": 6,
    "physical_activity_hours": 1.5,
    "sleep_hours_per_night": 7,
    "stress_level": "Medium"
}
```

### Response

```json
{
    "predicted_mental_health_score": 7.35
}
```

---

## 📖 API Documentation

FastAPI automatically generates interactive API documentation.

After starting the application, open:

```text
http://localhost:8000/docs
```

This provides an interactive Swagger UI where you can test the `/predict` endpoint.

---

# 💻 Running Locally

## 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Navigate into the project:

```bash
cd student-mental-health
```

---

## 2. Create a virtual environment

### Windows

```bash
python -m venv .venv
```

Activate it:

```bash
venv\Scripts\activate
```

### macOS / Linux

```bash
python3 -m venv venv
```

Activate it:

```bash
source venv/bin/activate
```

---

## 3. Install dependencies

```bash
pip install -r requirements.txt
```

---

## 4. Start FastAPI

```bash
uvicorn main:app --reload
```

The application will be available at:

```text
http://127.0.0.1:8000
```

Open the frontend at:

```text
http://127.0.0.1:8000
```

API documentation:

```text
http://127.0.0.1:8000/docs
```

---

# 🐳 Running with Docker

## Build the Docker image

From the project root:

```bash
docker build -t student-mental-health .
```

## Run the container

```bash
docker run --rm -p 8000:8000 student-mental-health
```

Then open:

```text
http://localhost:8000
```

API documentation:

```text
http://localhost:8000/docs
```

---

## 🐳 Docker Architecture

The Docker image contains:

```text
Python
   │
   ├── FastAPI
   │
   ├── Machine Learning Model
   │      └── Mental_Health_Model.pkl
   │
   └── Frontend
          ├── index.html
          ├── style.css
          └── script.js
```

FastAPI serves both the frontend and prediction API from the same application.

This means the browser communicates with:

```text
/predict
```

instead of using a hard-coded backend URL.

---

# 🚀 Deploying to Render

This project can be deployed as a Docker-based Web Service on Render.

## 1. Push the project to GitHub

```bash
git add .
git commit -m "Initial project setup"
git push
```

## 2. Create a Render Web Service

In Render:

```text
New
  ↓
Web Service
  ↓
Connect GitHub repository
```

Select this repository.

## 3. Configure the service

Use:

```text
Environment: Docker
Branch: main
Instance Type: Free
```

Render will automatically detect the `Dockerfile`.

No separate frontend deployment is required.

---

## 🌐 Deployment Architecture

```text
                 GitHub
                    │
                    ▼
                 Render
                    │
             Docker Container
                    │
        ┌───────────┴───────────┐
        │                       │
     FastAPI                Frontend
        │                       │
        ▼                       │
 Mental Health Model             │
        │                       │
        └───────────┬───────────┘
                    │
                    ▼
                  User
```

---

# 🧪 Example Prediction

Example student:

```text
Age:                    21
Gender:                 Male
Country:                India
Academic Level:         Undergraduate
Most Used Platform:     Instagram
Purpose:                Entertainment
Daily Usage:            5.5 hours
Daily Unlocks:          80
Study Hours:            6 hours
Physical Activity:      1.5 hours
Sleep:                  7 hours
Stress Level:            Medium
```

Example API response:

```json
{
    "predicted_mental_health_score": 7.35
}
```

The actual prediction depends on the trained machine learning model.

---

# ⚠️ Important Note

This project provides a **machine learning prediction**, not a medical or clinical diagnosis.

The predicted score should not be used as a substitute for professional mental-health assessment or medical advice.

The accuracy and usefulness of the prediction depend on the quality, representativeness, preprocessing, and limitations of the dataset and trained model.

---