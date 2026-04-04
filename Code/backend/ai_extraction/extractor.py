import os
import json
from openai import OpenAI

# Set up client. Defaults to OpenAI, but can be overridden for Local LLM or Groq via env vars.
client = OpenAI(
    api_key=os.environ.get("OPENAI_API_KEY", "dummy_key_if_using_local"),
    base_url=os.environ.get("OPENAI_BASE_URL", "https://api.openai.com/v1")
)

def extract_structured_data(ocr_text: str) -> dict:
    """
    Use LLM to extract structured data from OCR text.
    Return a dictionary matching the Survey Profile schema for 20 sections (A-T).
    """
    
    system_prompt = """
    Bạn là một trợ lý ảo chuyên phân tích dữ liệu văn bản được nhận dạng từ phiếu khảo sát An toàn thông tin.
    Đầu vào là văn bản OCR có thể chứa lỗi nhận dạng hoặc sai chính tả.
    Nhiệm vụ của bạn là trích xuất thông tin và điền vào JSON chính xác theo Schema cho trước. KHÔNG BAO GIỜ TRẢ VỀ MARKDOWN.
    
    CẤU TRÚC JSON BẮT BUỘC TRẢ VỀ:
    {
        "ten_don_vi": "Tên cơ quan/tổ chức",
        "he_thong_thong_tin": "Tên hệ thống",
        "dia_chi": "",
        "nguoi_dung_dau": "",
        "so_dien_thoai": "",
        "email": "",
        "can_bo_phu_trach": [
            {"ho_ten": "", "chuc_vu": "", "dien_thoai": ""}
        ],
        "ket_noi_internet": [
            {"nha_cung_cap": "", "loai": "", "bang_thong": ""}
        ],
        "thiet_bi_mang": [
            {"loai_thiet_bi": "", "hang": "", "model": "", "vi_tri": ""}
        ],
        "may_chu": [
            {"vai_tro": "", "model": "", "he_dieu_hanh": ""}
        ],
        "camera": [],
        "ip_tinh": [],
        "ung_dung": [
            {"ten_ung_dung": "", "don_vi": "", "ket_noi_internet": "Có/Không"}
        ],
        "ma_hoa_du_lieu": "Có/Không",
        "vpn": "Có/Không",
        "email_bao_mat": "Có/Không",
        "chinh_sach_mat_khau": "Có/Không",
        "anti_virus": "Có - Có bản quyền / Có - Miễn phí / Không",
        "tuong_lua_loai": "Tường lửa phần cứng/mềm/tích hợp",
        "tuong_lua_chinh_sach": "",
        "cap_nhat_he_dieu_hanh": "Hàng tháng / Hàng quý / Thủ công / Không",
        "sao_luu": "Có/Không",
        "dao_tao": [],
        "kiem_tra_attt": [],
        "port_switch": [],
        "ghi_chu": "Bất kỳ ghi chú bổ sung nào về ATTT"
    }
    
    Hãy tuân thủ nghiêm ngặt các mảng dữ liệu và Keys. Đầu ra CHỈ LÀ JSON HỢP LỆ.
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
            "can_bo_phu_trach": [],
            "ket_noi_internet": [],
            "thiet_bi_mang": [],
            "may_chu": [],
            "ung_dung": []
        }
