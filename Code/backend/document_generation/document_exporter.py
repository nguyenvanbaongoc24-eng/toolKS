from docxtpl import DocxTemplate, InlineImage
from docx.shared import Mm
import os
import logging
import traceback
from .diagram_generator import DiagramGenerator
from ai_extraction.security_analyzer import SecurityAnalyzer

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

class DocumentExporter:
    def __init__(self, template_dir="templates", output_dir="generated_docs"):
        # Make paths absolute relative to backend root
        backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.template_dir = os.path.join(backend_dir, "templates")
        self.output_dir = os.path.join(backend_dir, "generated_docs")
        
        if not os.path.exists(self.output_dir):
            os.makedirs(self.output_dir, exist_ok=True)

    def _map_checkboxes(self, value, mapping):
        """
        Maps a form value to multiple Word placeholders for checkboxes.
        Example: mapping = {"yes": "l5_log_yes", "no": "l5_log_no"}
        If value == "yes", context will be {"l5_log_yes": "☒", "l5_log_no": "☐"}
        """
        context = {}
        for option, placeholder in mapping.items():
            context[placeholder] = "☒" if str(value).lower() == str(option).lower() else "☐"
        return context

    def _get_hsdx_logic(self, data):
        """Logic for calculating Appendix I & II compliance in HSDX (based on PROMPT Section III.512)"""
        logic = {}
        
        # Appendix I & II Compliance Status
        logic['logic_policy_ok'] = "Đã đáp ứng" if data.get('k1_quy_che') and "Chưa ban hành" not in str(data.get('k1_quy_che')) else "Chưa đáp ứng"
        logic['logic_vlan_ok'] = "Đã đáp ứng" if data.get('H4_co_vlan') == "Có" and data.get('T1_2_wifi_tach_rieng') == "Tách riêng VLAN" else "Chưa đáp ứng"
        logic['logic_firewall_ok'] = "Đã đáp ứng" if data.get('L7_1_loai') and data.get('L7_1_loai') != "Chưa cấu hình" else "Chưa đáp ứng"
        logic['logic_av_ok'] = "Đã đáp ứng" if data.get('l3_av_has') == "Có" and data.get('L3_ban_quyen') == "Có" else "Chưa đáp ứng"
        logic['logic_pass_ok'] = "Đã đáp ứng" if data.get('l2_pass_policy') == "Có chính sách mật khẩu" else "Chưa đáp ứng"
        logic['logic_backup_ok'] = "Đã đáp ứng" if data.get('l4_bak_has') == "Có" and data.get('L4_off_site') == "Có" else "Chưa đáp ứng"
        logic['logic_log_ok'] = "Đã đáp ứng" if data.get('l5_log_enabled') == "Có" else "Chưa đáp ứng"
        logic['logic_training_ok'] = "Đã đáp ứng" if len(data.get('dao_tao') or []) >= 1 else "Chưa đáp ứng"
        logic['logic_audit_ok'] = "Đã đáp ứng" if len(data.get('kiem_tra_attt') or []) >= 1 else "Chưa đáp ứng"
        logic['logic_https_ok'] = "Đã đáp ứng" if data.get('p1_protocol') == "HTTPS (có chứng chỉ SSL/TLS)" else "Chưa đáp ứng"
        logic['logic_enc_ok'] = "Đã đáp ứng" if data.get('P4_ma_hoa_luu_tru_has') == "Có" else "Chưa đáp ứng"
        
        return logic

    def _get_report_logic(self, data):
        """Logic for generating issues and recommendations for the Report (based on PROMPT Section III.560)"""
        problems = []
        solutions = []

        # 1. Network Segmentation (Mục H4)
        if data.get('H4_co_vlan') != "Có":
            problems.append("- Hệ thống mạng chưa được thực hiện phân vùng mạng (VLAN) để cách ly các vùng chức năng.")
            solutions.append("- Thực hiện cấu hình phân chia VLAN trên các thiết bị Switch để tách biệt mạng máy chủ, máy trạm và camera.")

        # 2. Wifi Separation (Mục T1.2)
        if data.get('T1_2_wifi_tach_rieng') == "Không có WiFi":
            pass 
        elif data.get('T1_2_wifi_tach_rieng') != "Tách riêng VLAN":
            problems.append("- Mạng WiFi cho người dùng chưa được tách riêng khỏi mạng LAN nội bộ có dây.")
            solutions.append("- Quy hoạch lại mạng WiFi, sử dụng VLAN riêng và chính sách bảo mật WPA2/WPA3 Enterprise.")

        # 3. Network Diagram (Mặc định)
        problems.append("- Chưa có sơ đồ mạng tổng thể và quy hoạch địa chỉ IP chi tiết bằng văn bản.")
        solutions.append("- Hoàn thiện sơ đồ topology vật lý và logic, cập nhật vào hồ sơ quản trị hệ thống.")

        # 4. Firewall (Mục E2)
        if data.get('E2_firewall_type') != "Có (phần cứng chuyên dụng)":
            problems.append("- Chưa có thiết bị Tường lửa (Firewall) phần cứng chuyên dụng để kiểm soát sâu lưu lượng mạng.")
            solutions.append("- Đầu tư thiết bị Tường lửa phần cứng (Next-Gen Firewall) để bảo vệ mạng biên và ngăn chặn tấn công.")

        # 5. Antivirus (Mục L3)
        if data.get('l3_av_has') != "Có":
            problems.append("- Hệ thống chưa được trang bị phần mềm diệt virus tập trung trên các máy chủ và máy trạm.")
            solutions.append("- Trang bị phần mềm diệt virus bản quyền (Kaspersky, Trend Micro...) và thiết lập chế độ cập nhật tự động.")

        # 6. Policies (Mục K1, K4)
        if not data.get('k1_quy_che') or "Chưa ban hành" in str(data.get('k1_quy_che')):
            problems.append("- Chưa ban hành Quy chế bảo đảm an toàn thông tin nội bộ theo quy định.")
            solutions.append("- Xây dựng và ban hành Quyết định phê duyệt Quy chế ATTT dựa trên các tiêu cực của Nghị định 85/2016/NĐ-CP.")
        
        if not data.get('k4_qd_can_bo') or "Chưa ban hành" in str(data.get('k4_qd_can_bo')):
            problems.append("- Chưa có Quyết định phân công cán bộ chuyên trách hoặc đầu mối phụ trách ATTT.")
            solutions.append("- Ban hành văn bản phân công nhiệm vụ cụ thể cho cán bộ phụ trách quản trị mạng và bảo mật.")

        # 7. Backup & Incident (Mục L4, K6)
        if data.get('l4_bak_has') == "Không sao lưu" or (not data.get('K6_ung_pho_su_co') or "Chưa ban hành" in str(data.get('K6_ung_pho_su_co'))):
            problems.append("- Chưa hoàn thiện phương án sao lưu dữ liệu dự phòng và quy trình ứng phó sự cố mạng.")
            solutions.append("- Thiết lập quy trình sao lưu 3-2-1 (3 bản sao, 2 loại phương tiện, 1 bản off-site) và diễn tập ứng cứu sự cố.")

        # 8. Training (Mục R1)
        if not data.get('dao_tao') or len(data.get('dao_tao') or []) == 0:
            problems.append("- Cán bộ, công chức chưa được tham gia các khóa đào tạo hoặc tập huấn nâng cao nhận thức ATTT định kỳ.")
            solutions.append("- Tổ chức các đợt phổ biến kiến thức ATTT nội bộ hoặc cử cán bộ tham gia các lớp bồi dưỡng chuyên môn.")

        # 9. UPS (Mục L8.1)
        if data.get('L8_1_co_ups') != "Có":
            problems.append("- Phòng đặt thiết bị mạng/máy chủ chưa được trang bị bộ lưu điện (UPS) đảm bảo duy trì nguồn điện.")
            solutions.append("- Bổ sung thiết bị UPS có công suất tối thiểu 2KVA để duy trì hoạt động và bảo vệ phần cứng khi mất điện.")

        return {
            'problems': "\n".join(problems),
            'solutions': "\n".join(solutions),
            'has_problems': len(problems) > 1 # Always has diagram problem
        }

    def _get_context(self, data):
        """Common context mapping aligning with PROMPT_WEBAPP_ATTT.md Section II/VIII"""
        # A1-A7: Thông tin đơn vị
        context = {
            'A1_ten_don_vi': data.get('ten_don_vi', ''),
            'A2_ten_he_thong': data.get('he_thong_thong_tin', ''),
            'A3_dia_chi': data.get('dia_chi', ''),
            'A4_so_dien_thoai': data.get('so_dien_thoai', ''),
            'A5_email': data.get('email', ''),
            'A6_ho_ten_thu_truong': data.get('A6_ho_ten_thu_truong', '') or data.get('nguoi_dung_dau', ''),
            'A6_chuc_vu_thu_truong': data.get('A6_chuc_vu_thu_truong', ''),
            'A7_so_quyet_dinh': data.get('A7_so_quyet_dinh', ''),
            
            # Legacy keys for backward compatibility
            'ten_don_vi': data.get('ten_don_vi', ''),
            'dia_chi': data.get('dia_chi', ''),
            'he_thong_thong_tin': data.get('he_thong_thong_tin', ''),
            'nguoi_thuc_hien': data.get('nguoi_thuc_hien', ''),
            'ngay_khao_sat': data.get('ngay_khao_sat', ''),

            # Mục C: Mô tả HTTT
            'C1_mo_ta_chuc_nang': data.get('C1_mo_ta_chuc_nang', ''),
            'C2_doi_tuong_nguoi_dung': data.get('C2_doi_tuong_nguoi_dung', ''),
            'C3_loai_du_lieu': data.get('C3_loai_du_lieu', ''),
            'C5_noi_bo': data.get('C5_noi_bo', ''),
            'C5_ben_ngoai': data.get('C5_ben_ngoai', ''),
            'C6_nam_hoat_dong': data.get('C6_nam_hoat_dong', ''),
            'C7_ten_he_thong_cap_tren': data.get('C7_ten_he_thong_cap_tren', ''),
            'C8_do_mat': data.get('C8_do_mat', ''),

            # Mục D/H: Kết nối & IP
            'D2_router_modem': data.get('D2_router_modem', ''),
            'D3_ip_lan_gateway': data.get('D3_ip_lan_gateway', ''),
            'H1_dai_ip_lan': data.get('H1_dai_ip_lan', ''),
            'H2_ip_gateway': data.get('H2_ip_gateway', ''),
            'H3_dns': data.get('H3_dns', ''),
            'H4_so_vlan': data.get('H4_so_vlan', ''),
            'H4_mo_ta_vlan': data.get('H4_mo_ta_vlan', ''),

            # Mục F/G: Thiết bị & Camera
            'F1_pc_sl': data.get('F1_pc_sl', ''),
            'F1_pc_os': data.get('F1_pc_os', ''),
            'F1_laptop_sl': data.get('F1_laptop_sl', ''),
            'F1_laptop_os': data.get('F1_laptop_os', ''),
            'F1_tablet_sl': data.get('F1_tablet_sl', ''),
            'F1_mayin_sl': data.get('F1_mayin_sl', ''),
            'F1_dienthoai_sl': data.get('F1_dienthoai_sl', ''),
            'F2_luu_tru_o_dau': data.get('F2_luu_tru_o_dau', ''),
            'F3_ten_cloud': data.get('F3_ten_cloud', ''),
            'G2_dau_ghi_nvr': data.get('G2_dau_ghi_nvr', ''),
            'G3_luu_tru_ngay': data.get('G3_luu_tru_ngay', ''),

            # Mục L: Bảo mật
            'l5_siem_name': data.get('l5_siem_name', ''),
            'l6_incident_desc': data.get('l6_incident_desc', ''),
            'l6_incident_resolution': data.get('l6_incident_resolution', ''),
            'L7_4_cong_mo': data.get('L7_4_cong_mo', ''),
            'L8_1_ups_hang_model': data.get('L8_1_ups_hang_model', ''),
            'L8_1_ups_cong_suat_va': data.get('L8_1_ups_cong_suat_va', ''),
            'L8_1_ups_thoi_gian_phut': data.get('L8_1_ups_thoi_gian_phut', ''),
            'L8_4_mo_ta_phong': data.get('L8_4_mo_ta_phong', ''),

            # Mục P/Q/R/S/T: Nâng cao
            'P3_1_ten_he_thong_va_phuong_thuc': data.get('P3_1_ten_he_thong_va_phuong_thuc', ''),
            'P4_phuong_phap': data.get('P4_phuong_phap', ''),
            'Q3_nguoi_chiu_trach_nhiem': data.get('Q3_nguoi_chiu_trach_nhiem', ''),
            'Q4_firmware_mang': data.get('Q4_firmware_mang', ''),
            'Q5_theo_doi_canh_bao': data.get('Q5_theo_doi_canh_bao', ''),
            'R2_hinh_thuc_tuyen_truyen': data.get('R2_hinh_thuc_tuyen_truyen', ''),
            'S2_ke_hoach_tiep_theo': data.get('S2_ke_hoach_tiep_theo', ''),
            'T1_1_may_chu_dmz': data.get('T1_1_may_chu_dmz', ''),
            'T1_3_ssid': data.get('T1_3_ssid', ''),
            'T1_3_bao_mat_wifi': data.get('T1_3_bao_mat_wifi', ''),
            'T3_1_rack_u': data.get('T3_1_rack_u', ''),
            'T3_1_rack_vi_tri': data.get('T3_1_rack_vi_tri', ''),
            'T3_2_thiet_bi_trong_tu': data.get('T3_2_thiet_bi_trong_tu', ''),
            'T4_2_cap_isp': data.get('T4_2_cap_isp', ''),

            # Mục K: Pháp lý
            'K1_quy_che_attt': data.get('k1_quy_che', ''),
            'K2_ke_hoach_nam_ht': data.get('k2_ke_hoach_ht', ''),
            'K3_ke_hoach_nam_truoc': data.get('k3_ke_hoach_tr', ''),
            'K4_qd_phan_cong_cb': data.get('k4_qd_can_bo', ''),
            'K5_qd_phe_duyet_httt': data.get('K5_qd_phe_duyet_httt', ''),
            'K6_ung_pho_su_co': data.get('K6_ung_pho_su_co', ''),
            'K7_bien_ban_kiem_tra': data.get('K7_bien_ban_kiem_tra', ''),

            # Mục N: Chữ ký
            'N_nguoi_dien_ho_ten': data.get('n_nguoi_lap', ''),
            'N_nguoi_dien_chuc_vu': data.get('n_chuc_vu_lap', ''),
            'N_ngay_dien': data.get('n_ngay_lap', ''),
            'N_nguoi_kiem_tra_ho_ten': data.get('N_nguoi_kiem_tra_ho_ten', ''),
            'N_nguoi_kiem_tra_chuc_vu': data.get('N_nguoi_kiem_tra_chuc_vu', ''),
            'N_ngay_kiem_tra': data.get('N_ngay_kiem_tra', ''),
            'N_thu_truong_ho_ten': data.get('A6_ho_ten_thu_truong', ''),
            'N_thu_truong_chuc_vu': data.get('A6_chuc_vu_thu_truong', ''),
            'N_ngay_ky': data.get('N_ngay_ky', ''),

            # Cài đặt báo cáo
            'BC_so_bao_cao': data.get('BC_so_bao_cao', ''),
            'BC_ngay_bao_cao': data.get('BC_ngay_bao_cao', ''),
            'BC_nguoi_thuc_hien': data.get('BC_nguoi_thuc_hien', ''),
            'BC_don_vi_thuc_hien': data.get('BC_don_vi_thuc_hien', ''),
            'BC_ten_tinh': data.get('BC_ten_tinh', ''),
            
            # Tables (Iterables)
            'B_can_bo': data.get('can_bo_phu_trach', []),
            'D1_duong_truyen': data.get('ket_noi_internet', []),
            'E1_thiet_bi_mang': data.get('thiet_bi_mang', []),
            'F2_may_chu': data.get('may_chu', []),
            'G1_camera': data.get('camera', []),
            'H5_ip_tinh': data.get('ip_tinh', []),
            'I1_ung_dung': data.get('ung_dung', []),
            'R1_dao_tao': data.get('dao_tao', []),
            'S1_kiem_tra': data.get('kiem_tra_attt', []),
            'T2_port_mapping': data.get('port_switch', []),
            'T5_vi_tri': data.get('T5_vi_tri', []),
            
            # Current time context
            'nam_hien_tai': '2026',
        }

        # Checkbox Logic: Mapping ☐ to ☒ based on choices
        # Section C4
        context.update(self._map_checkboxes(data.get('C4_du_lieu_type'), {
            "Cá nhân thông thường": "C4_du_lieu_ca_nhan_thuong",
            "Cá nhân nhạy cảm": "C4_du_lieu_ca_nhan_nhay_cam",
            "Dữ liệu công": "C4_du_lieu_cong",
            "Không xác định": "C4_khong_xac_dinh"
        }))
        
        # Section C7, C8
        context.update(self._map_checkboxes(data.get('C7_ket_noi_cap_tren_has'), {"Có": "C7_ket_noi_cap_tren"}))
        context.update(self._map_checkboxes(data.get('C8_bi_mat_nha_nuoc_has'), {"Có": "C8_bi_mat_nha_nuoc"}))

        # Section E2
        context.update(self._map_checkboxes(data.get('E2_firewall_type'), {
            "Có (phần cứng chuyên dụng)": "E2_co_firewall",
            "Dùng Firewall tích hợp": "E2_router_tich_hop",
            "Dùng phần mềm Firewall": "E2_phan_mem"
        }))

        # Section F2, F3
        context.update(self._map_checkboxes(data.get('F2_khong_may_chu_has'), {"Có": "F2_khong_co_may_chu"}))
        context.update(self._map_checkboxes(data.get('F3_cloud_has'), {"Có": "F3_cloud"}))

        # Section L1, L2, L3, L4, L5, L6, L7, L8
        context.update(self._map_checkboxes(data.get('l1_phys_key'), {
            "Có khóa cửa (chìa khóa thường)": "L1_khoa_cua_thuong",
            "Có khóa cửa + camera giám sát": "L1_khoa_camera",
            "Có thẻ từ / kiểm soát điện tử": "L1_the_tu",
            "Không có kiểm soát riêng": "L1_khong_kiem_soat"
        }))
        context.update(self._map_checkboxes(data.get('l2_pass_policy'), {"Có chính sách mật khẩu": "L2_chinh_sach_mat_khau"}))
        context.update(self._map_checkboxes(data.get('L2_admin_acc_type'), {
            "Mỗi cán bộ có tài khoản riêng": "L2_admin_rieng",
            "Dùng chung một tài khoản admin": "L2_admin_chung",
            "Cả hai hình thức": "L2_admin_ca_hai"
        }))
        context.update(self._map_checkboxes(data.get('L2_2fa_has'), {"Có": "L2_xac_thuc_2fa"}))
        context.update(self._map_checkboxes(data.get('l3_av_has'), {"Có": "L3_co_antivirus"}))
        context.update(self._map_checkboxes(data.get('l4_bak_has'), {
            "Có": "L4_co_tan_suat", 
            "Thủ công": "L4_thu_cong", 
            "Không sao lưu": "L4_khong"
        }))
        context.update(self._map_checkboxes(data.get('l5_log_enabled'), {"Có": "L5_ghi_log"}))
        context.update(self._map_checkboxes(data.get('l6_incident_has'), {
            "Không có sự cố nào": "L6_khong_su_co",
            "Có": "L6_co_su_co",
            "Không biết": "L6_khong_biet"
        }))
        context.update(self._map_checkboxes(data.get('l7_type'), {
            "Tường lửa tích hợp (SPI)": "L7_1_router_spi",
            "Tường lửa phần cứng chuyên dụng": "L7_1_phan_cung",
            "Tường lửa phần mềm trên máy chủ": "L7_1_phan_mem"
        }))
        context.update(self._map_checkboxes(data.get('L8_2_dieu_hoa'), {
            "Có – 24/7": "L8_2_247",
            "Có – Giờ hành chính": "L8_2_hanh_chinh",
            "Không": "L8_2_khong"
        }))

        # Section P
        context.update(self._map_checkboxes(data.get('p1_protocol'), {"HTTPS (có chứng chỉ SSL/TLS)": "P1_giao_thuc_web_https", "HTTP (không mã hóa)": "P1_giao_thuc_web_http"}))
        context.update(self._map_checkboxes(data.get('P3_ket_noi_cap_tren_type'), {
            "VPN chuyên dụng": "P3_vpn_chuyen_dung",
            "Internet (HTTPS)": "P3_internet_https",
            "MPLS": "P3_mpls",
            "Không kết nối": "P3_khong_ket_noi"
        }))

        # Section T
        context.update(self._map_checkboxes(data.get('T1_2_wifi_tach_rieng'), {
            "Tách riêng VLAN": "T1_wifi_vlan",
            "Có": "T1_wifi_yes", 
            "Không có WiFi": "T1_wifi_none"
        }))

        # Photos M1-M14
        for i in range(1, 15):
            val = data.get(f"M{i}_status")
            context[f"M{i}_status_ok"] = "☒ Đã có" if val else "☐ Chưa có"

        # Specialized logic for HSDX and Report
        context.update(self._get_hsdx_logic(data))
        context.update(self._get_report_logic(data))

        return context

    def generate_phieu_khao_sat(self, data):
        template_path = os.path.join(self.template_dir, 'phieu_khao_sat_template.docx')
        if not os.path.exists(template_path):
            raise FileNotFoundError(f"Template not found: {template_path}")
            
        doc = DocxTemplate(template_path)
        context = self._get_context(data)
        
        # Debug: Log key context values before rendering
        logger.info("="*60)
        logger.info("EXPORTING: Phiếu Khảo Sát ATTT")
        logger.info("="*60)
        for key in ['ten_don_vi', 'dia_chi', 'he_thong_thong_tin', 'so_dien_thoai', 'email', 
                     'A6_ho_ten_thu_truong', 'D2_router_modem', 'nguoi_khao_sat']:
            logger.info(f"  {key} = {context.get(key, '(NOT SET)')}")
        logger.info(f"  Tables: may_chu={len(context.get('may_chu', []))}, thiet_bi_mang={len(context.get('thiet_bi_mang', []))}, ung_dung={len(context.get('ung_dung', []))}")
        logger.info(f"  Template: {template_path}")
        
        output_filename = f"Phieu_Khao_Sat_{data.get('ten_don_vi', 'NoName')}.docx"
        output_path = os.path.join(self.output_dir, output_filename)
        try:
            doc.render(context)
            doc.save(output_path)
            logger.info(f"  Output: {output_path}")
            logger.info("="*60)
            return output_path
        except Exception as e:
            logger.error(f"Render error in Phieu Khao Sat: {e}")
            traceback.print_exc()
            raise e

    def generate_hsdx(self, data, diagram_path=None):
        template_path = os.path.join(self.template_dir, 'hsdx_template.docx')
        if not os.path.exists(template_path):
            raise FileNotFoundError(f"Template not found: {template_path}")
            
        doc = DocxTemplate(template_path)
        context = self._get_context(data)
        
        # Automatically generate diagram if not provided
        if not diagram_path:
            try:
                dg = DiagramGenerator(output_dir=self.output_dir)
                diagram_filename = f"network_{data.get('ten_don_vi', 'Unknown').replace(' ', '_')}.png"
                diagram_path = dg.generate_network_topology(data, diagram_filename)
            except Exception as e:
                logger.error(f"Failed to generate network diagram: {e}")
                diagram_path = None
        
        if diagram_path and os.path.exists(diagram_path):
            context['network_diagram'] = InlineImage(doc, diagram_path, width=Mm(150))
        else:
            context['network_diagram'] = ""
        
        # Debug: Log key context values
        logger.info("="*60)
        logger.info("EXPORTING: Hồ Sơ Đề Xuất Cấp Độ")
        logger.info("="*60)
        for key in ['ten_don_vi', 'dia_chi', 'he_thong_thong_tin', 'so_dien_thoai', 'email',
                     'A6_ho_ten_thu_truong', 'H1_dai_ip_lan', 'H2_ip_gateway', 'nguoi_khao_sat']:
            logger.info(f"  {key} = {context.get(key, '(NOT SET)')}")
        logger.info(f"  Network diagram: {'YES' if diagram_path else 'NO'}")
        logger.info(f"  Template: {template_path}")
            
        output_filename = f"HSDX_{data.get('ten_don_vi', 'NoName')}.docx"
        output_path = os.path.join(self.output_dir, output_filename)
        try:
            doc.render(context)
            doc.save(output_path)
            logger.info(f"  Output saved: {output_path}")
            return output_path
        except Exception as e:
            logger.error(f"Render error in HSDX: {e}")
            traceback.print_exc()
            raise e

    def generate_bao_cao(self, data):
        template_path = os.path.join(self.template_dir, 'bao_cao_template.docx')
        if not os.path.exists(template_path):
            raise FileNotFoundError(f"Template not found: {template_path}")
            
        doc = DocxTemplate(template_path)
        context = self._get_context(data)
        
        # Override hardcoded logic with intelligent RAG analysis
        try:
            analyzer = SecurityAnalyzer()
            ai_results = analyzer.analyze_survey(data)
            context['problems'] = ai_results.get('problems', context.get('problems'))
            context['solutions'] = ai_results.get('solutions', context.get('solutions'))
        except Exception as e:
            logger.warning(f"Could not perform Intelligent Security Analysis: {e}")
            
        # Debug: Log key context values
        logger.info("="*60)
        logger.info("EXPORTING: Báo Cáo Khảo Sát")
        logger.info("="*60)
        for key in ['ten_don_vi', 'dia_chi', 'he_thong_thong_tin', 'BC_so_bao_cao',
                     'BC_don_vi_thuc_hien', 'BC_ten_tinh', 'problems', 'solutions']:
            val = context.get(key, '(NOT SET)')
            if isinstance(val, str) and len(val) > 100:
                val = val[:100] + '...'
            logger.info(f"  {key} = {val}")
        logger.info(f"  Template: {template_path}")
        
        output_filename = f"Bao_Cao_{data.get('ten_don_vi', 'NoName')}.docx"
        output_path = os.path.join(self.output_dir, output_filename)
        try:
            doc.render(context)
            doc.save(output_path)
            logger.info(f"  Output saved: {output_path}")
            return output_path
        except Exception as e:
            logger.error(f"Render error in Bao Cao: {e}")
            traceback.print_exc()
            raise e
