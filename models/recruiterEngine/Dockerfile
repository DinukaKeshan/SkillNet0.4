FROM python:3.11-slim

WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code and trained model
COPY app.py .
COPY recruiter_engine_ml.py .
COPY model.pkl .

EXPOSE 5004

CMD ["python", "app.py"]
