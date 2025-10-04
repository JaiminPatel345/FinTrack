# OCR Service Dockerfile
# Build context: root of workspace (.)
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies for Tesseract OCR
RUN apt-get update && apt-get install -y tesseract-ocr libtesseract-dev && rm -rf /var/lib/apt/lists/*

# Copy requirements file
COPY server/ocr-service/requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY server/ocr-service .

EXPOSE 5006
CMD ["python", "app.py"]
