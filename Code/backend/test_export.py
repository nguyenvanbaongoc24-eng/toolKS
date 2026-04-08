import sys
import os
import logging

# Ensure log output is visible
logging.basicConfig(level=logging.INFO)

# Run this from the backend directory or ensure path is set
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir.endswith("backend"):
    sys.path.append(current_dir)
else:
    sys.path.append(os.path.join(current_dir, "backend"))

from document_generation.document_exporter import DocumentExporter

def test_full_export():
    data = {
        "ten_don_vi": "Test Tòa nhà ABC",
        "he_thong_thong_tin": "Hệ thống Mạng Nội bộ Test",
        "dia_chi": "123 Đường XYZ",
        "so_dien_thoai": "0987654321",
        "email": "test@abc.vn",
        "A6_ho_ten_thu_truong": "Trần Văn Sếp",
        "A6_chuc_vu_thu_truong": "Giám đốc",
        "D2_router_modem": "Router Draytek",
        "nguoi_khao_sat": "Kỹ thuật viên 1",
        "may_chu": [
            {"ten_may_chu": "SRV-01", "hang_san_xuat": "Dell", "model": "R740", "so_serial": "SRV111", "os": "Windows Server 2019", "ghi_chu": "AD"}
        ],
        "thiet_bi_mang": [
            {"ten_thiet_bi": "Core Switch", "hang_san_xuat": "Cisco", "model": "C9200", "so_serial": "SW111", "vi_tri": "Tầng 1"}
        ],
        "ung_dung": [
            {"ten_ung_dung": "Web Portal", "phien_ban": "1.0", "ngon_ngu": "PHP", "nha_phat_trien": "Nội bộ", "ghi_chu": "Public"}
        ],
        "ket_noi_internet": [
            {"nha_cung_cap": "VNPT", "bang_thong": "1Gbps", "loai_thue_bao": "Kênh thuê riêng (Leased Line)"}
        ],
        "camera": [
            {"hang_san_xuat": "Hikvision", "model": "Dome", "so_serial": "CAM1", "do_phan_giai": "2MP", "vi_tri": "Cổng", "ghi_chu": ""}
        ],
        "ip_tinh": [
            {"ten_thiet_bi": "Printer-1", "ip_tinh": "192.168.1.100", "ghi_chu": "Phòng kế toán"}
        ],
        "can_bo_phu_trach": [
            {"ho_ten": "Nguyễn Văn IT", "chuc_vu": "Trưởng phòng IT", "so_dien_thoai": "090123", "email": "it@abc.vn"}
        ],
        "E2_firewall_type": "Có (phần cứng chuyên dụng)",
        "H1_dai_ip_lan": "192.168.1.0/24",
        "H2_ip_gateway": "192.168.1.1",
        "C5_noi_bo": 50,
        "BC_so_bao_cao": "12/BC-ATTT",
        "BC_don_vi_thuc_hien": "Chi nhánh Test",
        "BC_ten_tinh": "Hà Nội",
        "N_nguoi_kiem_tra_ho_ten": "Lê Văn Kiểm",
        "n_nguoi_lap": "Kỹ thuật 1",
        "M1_status": True, 
        "M2_status": True,
        "M3_status": True,
        "M4_status": True,
        "M5_status": True,
        "M6_status": True,
        "M7_status": True,
        "M8_status": True,
        "M9_status": True,
        "M10_status": True,
        "M11_status": True,
        "M12_status": True,
        "M13_status": True,
        "M14_status": True,
    }

    try:
        exporter = DocumentExporter()
        
        print("\n--- TEST: PHIẾU KHẢO SÁT ---")
        phieu_path = exporter.generate_phieu_khao_sat(data)
        print(f"✅ Success: {phieu_path}")
        
        print("\n--- TEST: HSDC ---")
        hsdx_path = exporter.generate_hsdx(data)
        print(f"✅ Success: {hsdx_path}")
        
        print("\n--- TEST: BÁO CÁO ---")
        bc_path = exporter.generate_bao_cao(data)
        print(f"✅ Success: {bc_path}")
        
        print("\n🎉 ALL TESTS PASSED!")
    except Exception as e:
        print(f"\n❌ ERROR: {e}")

if __name__ == "__main__":
    test_full_export()
