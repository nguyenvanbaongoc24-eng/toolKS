from supabase import create_client, Client
from dotenv import load_dotenv

from ocr_service.tesseract_runner import perform_ocr
from ai_extraction.extractor import extract_structured_data, extract_device_data
from document_generation.generator import generate_report_docx
from document_generation.report_generator import generate_survey_report

# Load environment variables
load_dotenv()

app = FastAPI(title="Survey Profiler API - Khảo sát ATTT")

# Initialize Supabase
supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("SUPABASE_ANON_KEY")

if not supabase_url or not supabase_key:
    print("Warning: Supabase credentials not found. DB sync will be disabled.")
    supabase: Client = None
else:
    supabase: Client = create_client(supabase_url, supabase_key)

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

class StaffItem(BaseModel):
    name: str

class SurveyRecord(BaseModel):
    id: Optional[int] = None
    ten_don_vi: str
    doer: str
    status: str
    date: Optional[str] = None
    data: Optional[Dict[str, Any]] = None

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Survey Profiler API is running", "sync": bool(supabase)}

# === STAFF ENDPOINTS ===

@app.get("/api/staff")
async def get_staff():
    if not supabase:
        # Fallback for dev without DB
        return ["Bảo Ngọc", "Anh Tuấn", "Minh Hùng", "Trung Kiên", "Duy Khánh", "Văn Phương", "Đức Thắng"]
    
    try:
        response = supabase.table("staff").select("*").execute()
        return [item["name"] for item in response.data]
    except Exception as e:
        print(f"Error fetching staff: {e}")
        return []

@app.post("/api/staff")
async def save_staff(names: List[str]):
    if not supabase:
        return {"status": "error", "message": "No Database Connection"}
    
    try:
        # Simplest approach: Delete all and re-insert for 100% sync
        supabase.table("staff").delete().neq("id", -1).execute()
        to_insert = [{"name": n} for n in names]
        if to_insert:
            supabase.table("staff").insert(to_insert).execute()
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# === SURVEY ENDPOINTS ===

@app.get("/api/surveys", response_model=List[SurveyRecord])
async def get_surveys():
    if not supabase:
        return []
    
    try:
        response = supabase.table("surveys").select("id, ten_don_vi, doer, status, date, data").order("id", desc=True).execute()
        return response.data
    except Exception as e:
        print(f"Error fetching surveys: {e}")
        return []

@app.post("/api/surveys")
async def save_survey(survey: SurveyRecord):
    if not supabase:
        raise HTTPException(status_code=500, detail="Database not configured")
    
    try:
        payload = {
            "ten_don_vi": survey.ten_don_vi,
            "doer": survey.doer,
            "status": survey.status,
            "date": survey.date or "N/A",
            "data": survey.data or {}
        }
        
        if survey.id:
            # Update
            response = supabase.table("surveys").update(payload).eq("id", survey.id).execute()
        else:
            # Insert
            response = supabase.table("surveys").insert(payload).execute()
            
        return {"status": "success", "id": response.data[0]["id"] if response.data else None}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# === EXISTING ENDPOINTS (OCR/TRANSCRIPTION/DOCX) ===

@app.post("/api/upload", response_model=ExtractionResponse)
async def upload_and_extract(file: UploadFile = File(...)):
    # ... (rest of the file stays the same) ...
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

@app.post("/api/extract-devices")
async def extract_devices(files: List[UploadFile] = File(...)):
    texts = []
    tmp_dir = os.path.join(tempfile.gettempdir(), "survey_profiler_devices")
    os.makedirs(tmp_dir, exist_ok=True)
    
    try:
        for file in files:
            if not file.filename:
                continue
            
            file_path = os.path.join(tmp_dir, file.filename)
            with open(file_path, "wb") as f:
                content = await file.read()
                f.write(content)
                
            ocr_text = perform_ocr(file_path)
            texts.append(ocr_text)
            
            if os.path.exists(file_path):
                os.remove(file_path)
                
        extracted_data = extract_device_data(texts)
        return {"status": "success", "extracted_data": extracted_data}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

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

@app.post("/api/generate-report")
async def generate_report(req: GenerateDocxRequest):
    """Generate a BAO CAO HSDX-style survey report from form data."""
    try:
        tmp_dir = os.path.join(tempfile.gettempdir(), "survey_profiler")
        os.makedirs(tmp_dir, exist_ok=True)
        output_path = os.path.join(tmp_dir, "BaoCaoKhaoSat_ATTT.docx")
        
        result_path = generate_survey_report(req.data, output_path)
        
        return FileResponse(
            result_path, 
            filename="BaoCaoKhaoSat_ATTT.docx", 
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
