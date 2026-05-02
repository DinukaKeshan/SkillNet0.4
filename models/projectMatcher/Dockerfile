# Use a lightweight Python base image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy all project files into the container
COPY . .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose the port your Flask app runs on
EXPOSE 5002

# Run the Flask app
CMD ["python", "api/app.py"]