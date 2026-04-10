import os
import sys
import logging
from docxtpl import DocxTemplate

# Add the backend to path
sys.path.append(os.path.join(os.getcwd(), 'Code', 'backend'))

from document_generation.document_exporter import DocumentExporter

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_export():
    exporter = DocumentExporter(
        template_dir='Code/backend/templates',
        output_dir='Code/backend/generated_docs'
    )
    
    # Mock data - minimal
    mock_data = {
        "ten_don_vi": "Đơn vị thử nghiệm",
        "A1_ten_don_vi": "Đơn vị thử nghiệm A1",
        "can_bo_phu_trach": [
            {"ho_ten": "Nguyễn Văn A", "chuc_vu": "Cán bộ QT"}
        ]
    }
    
    try:
        print("Starting test export...")
        path = exporter.generate_phieu_khao_sat(mock_data)
        print(f"Success! File generated at: {path}")
    except Exception as e:
        print(f"FAILED: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_export()
