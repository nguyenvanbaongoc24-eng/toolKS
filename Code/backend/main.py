import os
import tempfile
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Any, Dict
from fastapi.responses import FileResponse

from ocr_service.tesseract_runner import perform_ocr
from ai_extraction.extractor import extract_structured_data
from document_generation.generator import generate_report_docx

app = FastAPI(title="Survey Profiler API - Khảo sát ATTT")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ExtractionResponse(BaseModel):
    ocr_text: str
    extracted_data: Dict[str, Any]

class GenerateDocxRequest(BaseModel):
    data: Dict[str, Any]

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Survey Profiler API is running"}

@app.post("/api/upload", response_model=ExtractionResponse)
async def upload_and_extract(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded")
    
    # Use tempfile for cross-platform compatibility (Windows/Linux)
    tmp_dir = os.path.join(tempfile.gettempdir(), "survey_profiler")
    os.makedirs(tmp_dir, exist_ok=True)
    file_path = os.path.join(tmp_dir, file.filename)
    
    try:
        with open(file_path, "wb") as f:
            content = await file.read()
            f.write(content)
            
        # 1. OCR Extraction
        ocr_text = perform_ocr(file_path)
        if not ocr_text.strip():
            ocr_text = "Không nhận diện được chữ hoặc thiếu tesseract. Mẫu: Tên đơn vị: Sở TT&TT."
        
        # 2. AI Structured Extraction
        extracted_data = extract_structured_data(ocr_text)
        
        return ExtractionResponse(ocr_text=ocr_text, extracted_data=extracted_data)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)

@app.post("/api/generate-docx")
async def generate_docx(req: GenerateDocxRequest):
    try:
        template_dir = os.path.join(os.path.dirname(__file__), "templates")
        os.makedirs(template_dir, exist_ok=True)
        
        template_path = os.path.join(template_dir, "default_template.docx")
        
        tmp_dir = os.path.join(tempfile.gettempdir(), "survey_profiler")
        os.makedirs(tmp_dir, exist_ok=True)
        output_path = os.path.join(tmp_dir, "generated_report.docx")
        
        if not os.path.exists(template_path):
            raise HTTPException(status_code=404, detail="Template default_template.docx not found in templates directory. Please place a .docx template file there.")
            
        result_path = generate_report_docx(template_path, req.data, output_path)
        
        return FileResponse(result_path, filename="BaoCaoKhaoSat.docx", media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document")
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
