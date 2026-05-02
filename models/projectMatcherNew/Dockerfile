FROM python:3.11-slim

WORKDIR /app

# Install system dependencies for building native extensions
RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc g++ && \
    rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY api/ ./api/
COPY generate_dataset.py .
COPY train_model.py .

# Copy trained model (if exists — will be generated at build time if not)
COPY model/ ./model/

EXPOSE 5003

CMD ["python", "api/app.py"]
