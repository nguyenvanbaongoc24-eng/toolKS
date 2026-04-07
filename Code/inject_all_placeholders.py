"""
Comprehensive DOCX Template Injection Script v2.

Reads the original survey DOCX files and replaces hardcoded text
with Jinja2 {{placeholder}} tags so that docxtpl can render them dynamically.

Uses a robust run-merging strategy that handles fragmented XML text.
"""

import os
import re
import copy
import logging
from docx import Document
from docx.oxml.ns import qn

logging.basicConfig(level=logging.INFO, format='%(asctime)s [%(levelname)s] %(message)s')
logger = logging.getLogger(__name__)


def get_full_text_from_runs(runs):
    """Get the combined text from all runs."""
    return ''.join(run.text for run in runs)


def replace_text_preserving_format(paragraph, old_text, new_text):
    """
    Replace old_text with new_text in paragraph, handling text split across runs.
    Strategy: join all run text, find match, then distribute the replacement back.
    """
    full_text = get_full_text_from_runs(paragraph.runs)
    if old_text not in full_text:
        return False
    
    # Replace in the combined text
    new_full_text = full_text.replace(old_text, new_text)
    
    if not paragraph.runs:
        return False
    
    # Clear all runs and put the new text in the first run
    paragraph.runs[0].text = new_full_text
    for run in paragraph.runs[1:]:
        run.text = ''
    
    return True


def replace_in_document(doc, replacements):
    """Replace text throughout the document (paragraphs + tables)."""
    count = 0
    for old_text, new_text in replacements.items():
        # Paragraphs
        for paragraph in doc.paragraphs:
            if old_text in get_full_text_from_runs(paragraph.runs):
                if replace_text_preserving_format(paragraph, old_text, new_text):
                    count += 1
                    logger.info(f"  [P] '{old_text[:50]}' -> '{new_text}'")
        
        # Tables
        for table in doc.tables:
            for row in table.rows:
                for cell in row.cells:
                    for paragraph in cell.paragraphs:
                        if old_text in get_full_text_from_runs(paragraph.runs):
                            if replace_text_preserving_format(paragraph, old_text, new_text):
                                count += 1
                                logger.info(f"  [T] '{old_text[:50]}' -> '{new_text}'")
    
    return count


# ======================================================================
# TEMPLATE 1: Phiếu Khảo Sát ATTT
# ======================================================================

def inject_phieu_khao_sat(src_path, out_path):
    logger.info(f"=== Processing Phieu Khao Sat: {src_path} ===")
    doc = Document(src_path)
    
    # Replacements ordered from most-specific to least-specific
    replacements = {
        # System name (most specific first)
        "Hệ thống thông tin phục vụ hoạt động của UBND xã Lý Nhân": "{{he_thong_thong_tin}}",

        # Leader with full title
        "Ông Trương Tuấn Lực – Chủ tịch Ủy Ban Nhân dân xã Lý Nhân": "{{A6_ho_ten_thu_truong}} – {{A6_chuc_vu_thu_truong}}",

        # Address (with province)
        "thôn 5, xã Lý Nhân, tỉnh Ninh Bình ": "{{dia_chi}} ",
        "thôn 5, xã Lý Nhân, tỉnh Ninh Bình": "{{dia_chi}}",
        "Thôn 5, xã Lý Nhân, tỉnh Ninh Bình": "{{dia_chi}}",
        
        # Organization name variants (most specific first, avoid substring conflicts)
        "xã Lý Nhân, tỉnh Ninh Bình": "{{ten_don_vi}}",
        "ỦY BAN NHÂN DÂN XÃ LÝ NHÂN": "{{ten_don_vi}}",
        "CỦA ỦY BAN NHÂN DÂN XÃ LÝ NHÂN": "CỦA {{ten_don_vi}}",
        "Ủy ban nhân dân xã Lý Nhân": "{{ten_don_vi}}",
        "UBND xã Lý Nhân": "{{ten_don_vi}}",
        "xã Lý Nhân": "{{ten_don_vi}}",

        # Router/Gateway
        "iGate 10.66.138.209": "{{D2_router_modem}}",
        "10.66.138.210": "{{D3_ip_lan_gateway}}",
        
        # Leader name standalone
        "Trương Tuấn Lực": "{{A6_ho_ten_thu_truong}}",

        # Personnel
        "Đỗ Văn Hân": "{{nguoi_khao_sat}}",
        
        # Contact info
        "0395469659": "{{so_dien_thoai}}",
        "handv.xalynhan@ninhbinh.gov.vn": "{{email}}",
        "vanthu.lynhan.gov.ninhbinh.vn": "{{email}}",
        "0919.958.456": "{{so_dien_thoai}}",
        
        # System description details
        "Cán bộ công chức xã (33 người)": "Cán bộ công chức ({{C5_noi_bo}} người)",
        "33 cán bộ": "{{C5_noi_bo}} cán bộ",
        
        # Year
        " Năm 2025": " {{C6_nam_hoat_dong}}",
        "Năm 2025": "{{C6_nam_hoat_dong}}",
        "năm 2026": "năm {{nam_khao_sat}}",
        
        # Province
        "tỉnh Ninh Bình": "tỉnh {{BC_ten_tinh}}",
        "Ninh Bình": "{{BC_ten_tinh}}",
        
        # Muc C: Descriptions 
        "Hệ thống phục vụ hoạt động hành chính của UBND xã: xử lý hồ sơ một cửa (DVCTT), quản lý văn bản điều hành, lưu trữ dữ liệu dân cư, trao đổi email nội bộ ": "{{C1_mo_ta_chuc_nang}}",
        "Hệ thống phục vụ hoạt động hành chính của UBND xã: xử lý hồ sơ một cửa (DVCTT), quản lý văn bản điều hành, lưu trữ dữ liệu dân cư, trao đổi email nội bộ": "{{C1_mo_ta_chuc_nang}}",
        
        # C3: Loai du lieu
        "Dữ liệu cá nhân (CMND, địa chỉ, số điện thoại); hồ sơ hộ tịch; hồ sơ đất đai; văn bản hành chính (không mật).": "{{C3_loai_du_lieu}}",
        
        # C7: Ket noi cap tren 
        "Hệ thống DVCTT tỉnh": "{{C7_ten_he_thong_cap_tren}}",
    }
    
    count = replace_in_document(doc, replacements)
    
    doc.save(out_path)
    logger.info(f"  Total replacements: {count}")
    logger.info(f"  Saved: {out_path}")


# ======================================================================
# TEMPLATE 2: Hồ Sơ Đề Xuất Cấp Độ
# ======================================================================

def inject_hsdx(src_path, out_path):
    logger.info(f"=== Processing HSDX: {src_path} ===")
    doc = Document(src_path)
    
    replacements = {
        # System name (most specific first)
        "Hệ thống thông tin phục vụ hoạt động của UBND xã Lý Nhân": "{{he_thong_thong_tin}}",
        "HỆ THỐNG THÔNG TIN PHỤC VỤ HOẠT ĐỘNG": "{{he_thong_thong_tin}}",
        
        # Leader with full title
        "Ông Trương Tuấn Lực – Chủ tịch Ủy ban nhân dân xã Lý Nhân": "{{A6_ho_ten_thu_truong}} – {{A6_chuc_vu_thu_truong}}",
        "Ông Trương Tuấn Lực – Chủ tịch UBND xã Lý Nhân": "{{A6_ho_ten_thu_truong}} – {{A6_chuc_vu_thu_truong}}",
        
        # Address
        "Thôn 5, xã Lý Nhân, tỉnh Ninh Bình": "{{dia_chi}}",
        "thôn 5, xã Lý Nhân, tỉnh Ninh Bình": "{{dia_chi}}",
        " tỉnh Ninh Bình": " tỉnh {{BC_ten_tinh}}",

        # Organization name variants
        "ỦY BAN NHÂN DÂN XÃ LÝ NHÂN": "{{ten_don_vi}}",
        "CỦA ỦY BAN NHÂN DÂN XÃ LÝ NHÂN": "CỦA {{ten_don_vi}}",
        "Ủy ban nhân dân xã Lý Nhân": "{{ten_don_vi}}",
        "UBND xã Lý Nhân": "{{ten_don_vi}}",
        "xã Lý Nhân": "{{ten_don_vi}}",
        "Lý Nhân": "{{ten_don_vi}}",
        
        # IT personnel
        "ông Đỗ Văn Hân – Chuyên viên văn hóa kiêm nhiệm phụ trách công nghệ thông tin": "{{nguoi_khao_sat}}",
        "ông Đỗ Văn Hân – Chuyên viên văn hóa Số điện thoại: 0395469659 Email: handv.xalynhan@ninhbinh.gov.vn Trình độ: Quản lý văn hóa (kiêm nhiệm CNTT)": "{{nguoi_khao_sat}} (SĐT: {{so_dien_thoai}}, Email: {{email}})",
        "ông Đỗ Văn Hân – Chuyên viên văn hóa": "{{nguoi_khao_sat}}",
        "ông Đỗ Văn Hân": "{{nguoi_khao_sat}}",
        "Đỗ Văn Hân": "{{nguoi_khao_sat}}",
        
        # Leader name standalone
        "Trương Tuấn Lực": "{{A6_ho_ten_thu_truong}}",
        
        # Contact
        "0395469659": "{{so_dien_thoai}}",
        "0919.958.456": "{{so_dien_thoai}}",
        "handv.xalynhan@ninhbinh.gov.vn": "{{email}}",
        
        # Network specifics
        "192.168.11.0/24": "{{H1_dai_ip_lan}}",
        "192.168.11.1 – 192.168.11.254/24": "{{H1_dai_ip_lan}}",
        "192.168.1.1": "{{H2_ip_gateway}}",
        
        # People counts
        "33 người": "{{C5_noi_bo}} người",
        "33 cán bộ": "{{C5_noi_bo}} cán bộ",
        "~200 lượt/tháng": "{{C5_ben_ngoai}} lượt/tháng",
        "600 lượt/tháng": "{{C5_ben_ngoai}} lượt/tháng",

        # Year references
        "Ninh Bình, năm 2026": "{{BC_ten_tinh}}, năm {{nam_khao_sat}}",
        "năm 2026": "năm {{nam_khao_sat}}",
        
        # Province
        "Tỉnh Ninh Bình": "Tỉnh {{BC_ten_tinh}}",
        "tỉnh Ninh Bình": "tỉnh {{BC_ten_tinh}}",
        "Ninh Bình": "{{BC_ten_tinh}}",
    }
    
    count = replace_in_document(doc, replacements)
    
    # Add network_diagram placeholder after section 4.1
    for p in doc.paragraphs:
        if "4.1. Mô hình logic tổng thể" in get_full_text_from_runs(p.runs):
            new_p = doc.add_paragraph()
            new_p.text = "{{network_diagram}}"
            p._element.addnext(new_p._element)
            logger.info("  Added network_diagram placeholder after section 4.1")
            break
    
    doc.save(out_path)
    logger.info(f"  Total replacements: {count}")
    logger.info(f"  Saved: {out_path}")


# ======================================================================
# TEMPLATE 3: Báo Cáo Khảo Sát
# ======================================================================

def inject_bao_cao(src_path, out_path):
    logger.info(f"=== Processing Bao Cao: {src_path} ===")
    doc = Document(src_path)
    
    replacements = {
        # System name
        "Hệ thống thông tin phục vụ hoạt động của UBND xã Lý Nhân": "{{he_thong_thong_tin}}",
        
        # Organization
        "Ủy ban nhân dân xã Lý Nhân": "{{ten_don_vi}}",
        "UBND xã Lý Nhân": "{{ten_don_vi}}",
        "UBND XÃ LÝ NHÂN": "{{ten_don_vi}}",
        "xã Lý Nhân": "{{ten_don_vi}}",
        "Lý Nhân": "{{ten_don_vi}}",
        
        # Address
        "Thôn 5, xã Lý Nhân, tỉnh Ninh Bình": "{{dia_chi}}",
        
        # Date
        "ngày        tháng        năm 2026": "ngày {{n_ngay_lap}}",
        
        # Province
        "Tỉnh Ninh Bình": "Tỉnh {{BC_ten_tinh}}",
        "tỉnh Ninh Bình": "tỉnh {{BC_ten_tinh}}",
        "Ninh Bình": "{{BC_ten_tinh}}",
        
        # Report unit
        "MobiFone Tỉnh Ninh Bình – chi nhánh Tổng Công ty viễn thông MobiFone (MobiFone)": "{{BC_don_vi_thuc_hien}}",
        "MobiFone Tỉnh Ninh Bình": "{{BC_don_vi_thuc_hien}}",
        "MobiFone": "{{BC_don_vi_thuc_hien}}",
        
        # Report number
        "Số:….0/MBF.NBH-KDT": "Số: {{BC_so_bao_cao}}",
        
        # QD references
        "Quyết định số 2223/QĐ-UBND ngày 14/4/2023 của UBND": "Quyết định số {{BC_qd_ubnd_tinh_so_attt}} của UBND",
        "Quyết định số 3614/QĐ-UBND ngày 01/7/2025 của UBND": "Quyết định số {{BC_qd_ubnd_tinh_phan_cong}} của UBND",
    }
    
    count = replace_in_document(doc, replacements)
    
    doc.save(out_path)
    logger.info(f"  Total replacements: {count}")
    logger.info(f"  Saved: {out_path}")


# ======================================================================
# MAIN
# ======================================================================

if __name__ == "__main__":
    src_dir = "d:/ToolKS/Code"
    out_dir = "d:/ToolKS/Code/backend/templates"
    os.makedirs(out_dir, exist_ok=True)
    
    # Backup existing templates
    backup_dir = os.path.join(out_dir, "backup")
    os.makedirs(backup_dir, exist_ok=True)
    
    import shutil
    for f in os.listdir(out_dir):
        if f.endswith('.docx'):
            src = os.path.join(out_dir, f)
            dst = os.path.join(backup_dir, f)
            if os.path.isfile(src):
                shutil.copy2(src, dst)
                logger.info(f"Backed up: {f}")
    
    # Process each template
    phieu_src = os.path.join(src_dir, "Phieu_Khao_Sat_ATTT_Mau_1.docx.docx")
    hsdx_src = os.path.join(src_dir, "HSDXCDAT LY NHAN.docx.docx")
    baocao_src = os.path.join(src_dir, "BAO CAO HSDX.docx.docx")
    
    if os.path.exists(phieu_src):
        inject_phieu_khao_sat(phieu_src, os.path.join(out_dir, "phieu_khao_sat_template.docx"))
    else:
        logger.warning(f"Source not found: {phieu_src}")
    
    if os.path.exists(hsdx_src):
        inject_hsdx(hsdx_src, os.path.join(out_dir, "hsdx_template.docx"))
    else:
        logger.warning(f"Source not found: {hsdx_src}")
    
    if os.path.exists(baocao_src):
        inject_bao_cao(baocao_src, os.path.join(out_dir, "bao_cao_template.docx"))
    else:
        logger.warning(f"Source not found: {baocao_src}")
    
    logger.info("=== Template injection complete! ===")
