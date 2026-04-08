# Sử dụng image Python chuẩn và nhẹ
FROM python:3.10-slim

# Ngăn Python tạo file .pyc và bật log trực tiếp
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Thiết lập thư mục làm việc
WORKDIR /app

# Khắc phục lỗi thiếu gói môi trường và cài Tesseract (Lớp này được cache lâu nhất)
RUN apt-get update && apt-get install -y --no-install-recommends \
    tesseract-ocr \
    tesseract-ocr-vie \
    libgl1 \
    libglib2.0-0 \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Cài đặt thư viện Python (Thực hiện trước khi copy code để tận dụng cache)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Sao chép mã nguồn Backend vào VM
COPY . .

# Mở cổng mặc định của Render là 8000
EXPOSE 8000

# Khởi chạy máy chủ FastAPI
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
