# Sử dụng image Python chuẩn và nhẹ
FROM python:3.10-slim

# Thiết lập thư mục làm việc
WORKDIR /app

# Khắc phục lỗi thiếu gói môi trường để cài Tesseract
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    tesseract-ocr-vie \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Cài đặt thư viện Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Sao chép mã nguồn Backend vào VM
COPY . .

# Mở cổng mặc định của Render là 8000
EXPOSE 8000

# Khởi chạy máy chủ FastAPI (Bỏ reload khi chạy thật)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
