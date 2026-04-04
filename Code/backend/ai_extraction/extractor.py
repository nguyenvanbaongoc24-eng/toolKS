import os
import json
from openai import OpenAI
from pydantic import BaseModel
from typing import List, Optional

# Set up client. Defaults to OpenAI, but can be overridden for Local LLM or Groq via env vars.
# OPENAI_API_KEY
# OPENAI_BASE_URL (optional)
client = OpenAI(
    api_key=os.environ.get("OPENAI_API_KEY", "dummy_key_if_using_local"),
    base_url=os.environ.get("OPENAI_BASE_URL", "https://api.openai.com/v1")
)

def extract_structured_data(ocr_text: str) -> dict:
    """
    Use LLM to extract structured data from OCR text.
    Return a dictionary matching the Survey Profile schema.
    """
    
    system_prompt = """
    Bạn là một trợ lý ảo chuyên phân tích dữ liệu văn bản được nhận dạng từ phiếu khảo sát An toàn thông tin.
    Đầu vào là văn bản OCR có thể chứa lỗi nhận dạng hoặc sai chính tả.
    Nhiệm vụ của bạn là trích xuất thông tin và điền vào JSON chính xác theo Schema cho trước.
    Ngữ cảnh:
    - ten_don_vi: Tên cơ quan, tổ chức
    - dia_chi: Địa chỉ
    - nguoi_dung_dau: Lãnh đạo hoặc Người đứng đầu
    - so_dien_thoai / email / so_can_bo
    - ket_noi_internet: Gồm nha_cung_cap, loai_ket_noi, bang_thong, ip_wan
    - thiet_bi_mang: Danh sách các thiết bị (loai_thiet_bi, hang_san_xuat, model, serial, vi_tri)
    - camera: Danh sách (hang, model, serial, vi_tri)
    - may_chu: Danh sách (vai_tro, hang_model, he_dieu_hanh, ram, o_cung)
    - ung_dung: Danh sách (ten_ung_dung, chuc_nang, don_vi_cung_cap, ket_noi_internet)
    
    Đầu ra CHỈ LÀ JSON. KHÔNG markdown, KHÔNG text thừa.
    """
    
    try:
        response = client.chat.completions.create(
            model=os.environ.get("OPENAI_MODEL", "gpt-4o-mini"),
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Trích xuất JSON từ đoạn text sau:\n\n{ocr_text}"}
            ],
            response_format={ "type": "json_object" },
            temperature=0.1
        )
        
        result_text = response.choices[0].message.content
        return json.loads(result_text)
        
    except Exception as e:
        print(f"AI Extraction Error: {e}")
        # Return fallback empty structure
        return {
            "ten_don_vi": "",
            "dia_chi": "",
            "nguoi_dung_dau": "",
            "so_dien_thoai": "",
            "email": "",
            "so_can_bo": 0,
            "ket_noi_internet": {},
            "thiet_bi_mang": [],
            "camera": [],
            "may_chu": [],
            "ung_dung": []
        }
