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
            {"ho_ten": "", "chuc_vu": "", "dien_thoai": "", "email": "", "trinh_do": "", "chung_chi": ""}
        ],
        "ket_noi_internet": [
            {"nha_cung_cap": "", "loai": "", "bang_thong": "", "vai_tro": "", "ip_wan": "", "ghi_chu": ""}
        ],
        "thiet_bi_mang": [
            {"loai_thiet_bi": "", "hang": "", "model": "", "serial": "", "vi_tri": "", "nam_mua": "", "ghi_chu": ""}
        ],
        "may_chu": [
            {"vai_tro": "", "hang": "", "model": "", "serial": "", "ram": "", "hdd": "", "he_dieu_hanh": "", "vi_tri": ""}
        ],
        "camera": [
            {"hang": "", "model": "", "serial": "", "do_phan_giai": "", "vi_tri": "", "ghi_chu": ""}
        ],
        "ip_tinh": [
            {"ten_thiet_bi": "", "ip_tinh": "", "ghi_chu": ""}
        ],
        "ung_dung": [
            {"ten_ung_dung": "", "chuc_nang": "", "don_vi": "", "phien_ban": "", "ket_noi_internet": "Có/Không", "ghi_chu": ""}
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
        "ghi_chu": "Bất kỳ ghi chú bổ sung nào về ATTT",
        "confidence_scores": {
            "ten_don_vi": "high|low",
            "he_thong_thong_tin": "high|low",
            "dia_chi": "high|low",
            "nguoi_dung_dau": "high|low",
            "so_dien_thoai": "high|low",
            "email": "high|low",
            "can_bo_phu_trach": "high|low",
            "ket_noi_internet": "high|low",
            "thiet_bi_mang": "high|low",
            "may_chu": "high|low",
            "camera": "high|low",
            "ip_tinh": "high|low",
            "ung_dung": "high|low",
            "ma_hoa_du_lieu": "high|low",
            "vpn": "high|low",
            "email_bao_mat": "high|low",
            "chinh_sach_mat_khau": "high|low",
            "anti_virus": "high|low",
            "tuong_lua_loai": "high|low",
            "tuong_lua_chinh_sach": "high|low",
            "cap_nhat_he_dieu_hanh": "high|low",
            "sao_luu": "high|low",
            "dao_tao": "high|low",
            "kiem_tra_attt": "high|low",
            "port_switch": "high|low",
            "ghi_chu": "high|low"
        }
    }
    
    Hãy tuân thủ nghiêm ngặt các mảng dữ liệu và Keys. Đầu ra CHỈ LÀ JSON HỢP LỆ.
    Chỉ set 'high' nếu thông tin rõ ràng. Set 'low' nếu văn bản không rõ, mờ, bị đoán mò hoặc chỉ có một phần. Nếu trống, set 'low'.
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
            "ung_dung": [],
            "confidence_scores": {}
        }

def extract_device_data(texts: list) -> list:
    """
    Extract structured device information from multiple OCR texts of hardware labels.
    """
    combined_text = "\n\n--- IMAGE SEPARATOR ---\n\n".join(texts)
    
    system_prompt = """
    Bạn là một chuyên gia mạng máy tính và OCR.
    Đầu vào là văn bản OCR được trích xuất từ một hoặc nhiều CẢNH CHỤP NHÃN MÁY MÓC (Tem thiết bị) hoặc TỦ RACK.
    Nhiệm vụ của bạn là nhận diện thiết bị này thuộc loại gì (Router, Switch, Firewall, Wi-Fi, Máy chủ, Camera, NVR) và xuất ra danh sách các thiết bị.
    
    CẤU TRÚC JSON BẮT BUỘC TRẢ VỀ:
    {
        "thiet_bi_mang": [
            {
                "loai_thiet_bi": "Switch / Router / Firewall / WiFi AP / v.v.",
                "hang": "Tên Hãng (Cisco, Mikrotik, HPE, v.v)",
                "model": "Tên Model / P/N",
                "serial": "Số Serial (S/N)",
                "vi_tri": "",
                "nam_mua": "",
                "ghi_chu": "Bất kỳ MAC address hoặc Firmware ver nào tìm thấy"
            }
        ],
        "may_chu": [
            {
                "vai_tro": "Máy chủ / NVR",
                "hang": "Tên hãng (Dell, HP, v.v)",
                "model": "Model máy",
                "serial": "Service Tag / S/N",
                "ram": "",
                "hdd": "",
                "he_dieu_hanh": "",
                "vi_tri": ""
            }
        ],
        "camera": [
            {
                "hang": "Dahua, Hikvision, v.v",
                "model": "",
                "serial": "",
                "do_phan_giai": "",
                "vi_tri": "",
                "ghi_chu": ""
            }
        ]
    }
    
    Nếu bạn không chắc chắn giá trị nào (ví dụ mờ), hãy đặt giá trị rỗng ("") để người dùng tự nhập.
    Chỉ trả về JSON Hợp lệ.
    """
    
    try:
        response = client.chat.completions.create(
            model=os.environ.get("OPENAI_MODEL", "gpt-4o-mini"),
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Trích xuất JSON từ các đoạn văn bản OCR chụp từ thiết bị sau:\n\n{combined_text}"}
            ],
            response_format={ "type": "json_object" },
            temperature=0.1
        )
        
        result_text = response.choices[0].message.content
        return json.loads(result_text)
        
    except Exception as e:
        print(f"AI Device Extraction Error: {e}")
        return {"thiet_bi_mang": [], "may_chu": [], "camera": []}
