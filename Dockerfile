FROM python:3.14-slim

# Prevent Python from creating .pyc files
# and make logs appear immediately.
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Application directory
WORKDIR /app

# Install Python dependencies first.
# This improves Docker build caching.
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Copy application source
COPY main.py .
COPY Mental_Health_Model.pkl .

COPY models ./models
COPY routes ./routes
COPY services ./services
COPY frontend ./frontend

# Render provides the PORT environment variable.
# Use 8000 locally if PORT is not defined.
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]