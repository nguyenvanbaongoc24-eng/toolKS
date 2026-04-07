from docxtpl import DocxTemplate, InlineImage
from docx.shared import Mm
import os
import logging
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
        """Logic for calculating Appendix I & II compliance in HSDX"""
        logic = {}
        
        # Appendix I: Technical (P.I)
        logic['P1_network_status'] = "Đã đáp ứng" if data.get('E2_firewall_type') == "Có (phần cứng chuyên dụng)" else "Chưa đáp ứng"
        logic['P2_endpoint_status'] = "Đã đáp ứng" if data.get('l3_av_has') == "Có" else "Chưa đáp ứng"
        logic['P3_app_status'] = "Đã đáp ứng" if data.get('p1_protocol') == "HTTPS (có chứng chỉ SSL/TLS)" else "Chưa đáp ứng"
        logic['P4_data_status'] = "Đã đáp ứng" if data.get('l4_bak_has') and data.get('l4_bak_has') != "Không sao lưu" else "Chưa đáp ứng"
        logic['P5_device_status'] = "Đã đáp ứng" if data.get('Q4_firmware_mang') == "Đã cập nhật mới nhất" else "Chưa đáp ứng"

        # Appendix II: Management (P.II)
        logic['P6_policy_status'] = "Đã đáp ứng" if data.get('l2_pass_policy') == "Có chính sách mật khẩu" else "Chưa đáp ứng"
        logic['P7_personnel_status'] = "Đã đáp ứng" if len(data.get('can_bo_phu_trach', [])) > 0 else "Chưa đáp ứng"
        logic['P8_log_status'] = "Đã đáp ứng" if data.get('l5_log_enabled') == "Có" else "Chưa đáp ứng"
        logic['P9_training_status'] = "Đã đáp ứng" if data.get('R2_co_tuyen_truyen') == "Có" or len(data.get('dao_tao', [])) > 0 else "Chưa đáp ứng"
        logic['P10_check_status'] = "Đã đáp ứng" if len(data.get('kiem_tra_attt', [])) > 0 else "Chưa đáp ứng"
        
        return logic

    def _get_report_logic(self, data):
        """Logic for generating issues and recommendations for the Report"""
        problems = []
        solutions = []

        # 1. Antivirus (Mục L3)
        if data.get('l3_av_has') != "Có":
            problems.append("- Hệ thống chưa được trang bị phần mềm diệt virus tập trung trên các máy chủ và máy trạm (L3).")
            solutions.append("- Trang bị phần mềm diệt virus bản quyền (Kaspersky, Trend Micro...) để bảo vệ hệ thống trước mã độc.")
        elif data.get('l3_av_license') != "Có bản quyền":
            problems.append("- Phần mềm diệt virus hiện có chưa được trang bị bản quyền đầy đủ hoặc đã hết hạn.")
            solutions.append("- Rà soát và gia hạn bản quyền phần mềm diệt virus để đảm bảo tính năng cập nhật mẫu mã độc mới nhất.")

        # 2. Firewall (Mục E2)
        if data.get('E2_firewall_type') != "Có (phần cứng chuyên dụng)":
            problems.append("- Chưa có thiết bị Tường lửa (Firewall) phần cứng chuyên dụng để kiểm soát sâu lưu lượng mạng (E2).")
            solutions.append("- Đầu tư thiết bị Tường lửa phần cứng (Next-Gen Firewall) để ngăn chặn tấn công và lọc nội dung độc hại.")

        # 3. Encryption (Mục P1)
        if data.get('p1_protocol') != "HTTPS (có chứng chỉ SSL/TLS)":
            problems.append("- Ứng dụng Web chưa được mã hóa truyền dẫn (HTTPS), tiềm ẩn nguy cơ lộ lọt mật khẩu trên đường truyền (P1).")
            solutions.append("- Triển khai chứng chỉ SSL/TLS cho các ứng dụng Web để mã hóa dữ liệu trao đổi giữa người dùng và máy chủ.")

        # 4. Backup (Mục L4)
        if data.get('l4_bak_has') == "Không sao lưu":
            problems.append("- Chưa có phương án sao lưu dữ liệu định kỳ, nguy cơ mất dữ liệu khi xảy ra sự cố phần cứng hoặc Ransomware (L4).")
            solutions.append("- Xây dựng quy trình sao lưu dữ liệu tự động ra thiết bị lưu trữ ngoài hoặc Cloud và kiểm định định kỳ.")

        # 5. Policies & Training (Mục L2, R2)
        if data.get('l2_pass_policy') != "Có chính sách mật khẩu":
            problems.append("- Chưa có chính sách mật khẩu thống nhất về độ dài, độ phức tạp và định kỳ thay đổi (L2).")
            solutions.append("- Ban hành quy chế ATTT, trong đó quy định rõ tiêu chuẩn mật khẩu mạnh cho toàn bộ cán bộ.")
        
        if data.get('R2_co_tuyen_truyen') != "Có":
            problems.append("- Chưa tổ chức các đợt tuyên truyền, phổ biến kiến thức về ATTT cho cán bộ, công chức (R2).")
            solutions.append("- Tổ chức định kỳ các buổi tập huấn, tuyên truyền nhận thức về các hình thức tấn công mạng lừa đảo.")

        # 6. Physical & Environment (Mục L8)
        if data.get('L8_1_co_ups') != "Có":
            problems.append("- Phòng máy chủ chưa được trang bị bộ lưu điện (UPS), dễ gây hỏng hóc thiết bị khi mất điện đột ngột (L8.1).")
            solutions.append("- Trang bị bộ lưu điện có công suất phù hợp để duy trì hoạt động và tắt máy chủ an toàn khi mất điện.")
        
        if data.get('L8_3_bin_chua_chay_has') != "Có":
            problems.append("- Khu vực đặt thiết bị mạng/máy chủ chưa trang bị bình chữa cháy chuyên dụng cho thiết bị điện (L8.3).")
            solutions.append("- Bổ sung bình chữa cháy khí CO2 hoặc bột chuyên dụng tại vị trí đặt tủ mạng/phòng máy chủ.")

        if not problems:
            problems.append("- Không có vấn đề tồn tại lớn về ATTT tại thời điểm khảo sát.")
            solutions.append("- Tiếp tục duy trì và cập nhật thường xuyên các phương án bảo mật hiện có.")

        return {
            'problems': "\n".join(problems),
            'solutions': "\n".join(solutions),
            'has_problems': len(problems) > 0 and not problems[0].startswith("- Không có")
        }

    def _get_context(self, data):
        """Common context mapping with advanced reasoning"""
        context = {
            # Mục A: Thông tin đơn vị
            'ten_don_vi': data.get('ten_don_vi', ''),
            'dia_chi': data.get('dia_chi', ''),
            'so_dien_thoai': data.get('so_dien_thoai', ''),
            'email': data.get('email', ''),
            'A6_ho_ten_thu_truong': data.get('nguoi_dung_dau', ''),
            'A6_chuc_vu_thu_truong': data.get('A6_chuc_vu_thu_truong', ''),
            'A7_so_quyet_dinh': data.get('A7_so_quyet_dinh', ''),
            
            # Mục C: Thông tin hệ thống
            'he_thong_thong_tin': data.get('he_thong_thong_tin', ''),
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

            # Mục F: Thiết bị đầu cuối
            'F1_pc_sl': data.get('F1_pc_sl', ''),
            'F1_pc_os': data.get('F1_pc_os', ''),
            'F1_laptop_sl': data.get('F1_laptop_sl', ''),
            'F1_laptop_os': data.get('F1_laptop_os', ''),
            'F1_tablet_sl': data.get('F1_tablet_sl', ''),
            'F1_mayin_sl': data.get('F1_mayin_sl', ''),
            'F1_dienthoai_sl': data.get('F1_dienthoai_sl', ''),
            'F2_luu_tru_o_dau': data.get('F2_luu_tru_o_dau', ''),
            'F3_ten_cloud': data.get('F3_ten_cloud', ''),

            # Mục G: Camera
            'G2_dau_ghi_nvr': data.get('G2_dau_ghi_nvr', ''),
            'G3_luu_tru_ngay': data.get('G3_luu_tru_ngay', ''),

            # Mục L: Lịch sử & Giám sát
            'l5_siem_name': data.get('l5_siem_name', ''),
            'l6_incident_desc': data.get('l6_incident_desc', ''),
            'l6_incident_resolution': data.get('l6_incident_resolution', ''),
            'L7_4_cong_mo': data.get('L7_4_cong_mo', ''),
            'L8_1_ups_hang_model': data.get('L8_1_ups_hang_model', ''),
            'L8_1_ups_cong_suat_va': data.get('L8_1_ups_cong_suat_va', ''),
            'L8_1_ups_thoi_gian_phut': data.get('L8_1_ups_thoi_gian_phut', ''),
            'L8_4_mo_ta_phong': data.get('L8_4_mo_ta_phong', ''),

            # Mục P: Mã hóa
            'p2_vpn_type': data.get('p2_vpn_type', ''),
            'P3_1_ten_he_thong_va_phuong_thuc': data.get('P3_1_ten_he_thong_va_phuong_thuc', ''),
            'P4_phuong_phap': data.get('P4_phuong_phap', ''),

            # Mục T: Topology Details
            'T1_1_may_chu_dmz': data.get('T1_1_may_chu_dmz', ''),
            'T1_3_ssid': data.get('T1_3_ssid', ''),
            'T1_3_bao_mat_wifi': data.get('T1_3_bao_mat_wifi', ''),
            'T3_1_rack_u': data.get('T3_1_rack_u', ''),
            'T3_1_rack_vi_tri': data.get('T3_1_rack_vi_tri', ''),
            'T3_2_thiet_bi_trong_tu': data.get('T3_2_thiet_bi_trong_tu', ''),
            'T4_2_cap_isp': data.get('T4_2_cap_isp', ''),

            # Mục K: Pháp lý
            'k1_quy_che': data.get('k1_quy_che', ''),
            'k2_ke_hoach_ht': data.get('k2_ke_hoach_ht', ''),
            'k3_ke_hoach_tr': data.get('k3_ke_hoach_tr', ''),
            'k4_qd_can_bo': data.get('k4_qd_can_bo', ''),
            'K5_qd_phe_duyet_httt': data.get('K5_qd_phe_duyet_httt', ''),
            'K6_ung_pho_su_co': data.get('K6_ung_pho_su_co', ''),
            'K7_bien_ban_kiem_tra': data.get('K7_bien_ban_kiem_tra', ''),

            # Mục N: Chữ ký
            'n_nguoi_lap': data.get('n_nguoi_lap', ''),
            'n_chuc_vu_lap': data.get('n_chuc_vu_lap', ''),
            'n_ngay_lap': data.get('n_ngay_lap', ''),
            'N_nguoi_kiem_tra_ho_ten': data.get('N_nguoi_kiem_tra_ho_ten', ''),
            'N_nguoi_kiem_tra_chuc_vu': data.get('N_nguoi_kiem_tra_chuc_vu', ''),
            'N_ngay_kiem_tra': data.get('N_ngay_kiem_tra', ''),
            'N_ngay_ky': data.get('N_ngay_ky', ''),

            # Mục Q, R, S: Quản lý
            'Q1_os_update': data.get('cap_nhat_he_dieu_hanh', ''),
            'Q2_app_update': data.get('Q2_cap_nhat_ung_dung', ''),
            'Q3_nguoi_patching': data.get('Q3_nguoi_chiu_trach_nhiem', ''),
            'Q4_firmware_mang': data.get('Q4_firmware_mang', ''),
            'Q5_theo_doi_canh_bao': data.get('Q5_theo_doi_canh_bao', ''),
            'R2_co_tuyen_truyen': data.get('R2_co_tuyen_truyen', ''),
            'R2_hinh_thuc_tuyen_truyen': data.get('R2_hinh_thuc_tuyen_truyen', ''),
            'S2_ke_hoach_tiep_theo': data.get('S2_ke_hoach_tiep_theo', ''),

            # Thông tin Báo cáo (BC)
            'BC_so_bao_cao': data.get('BC_so_bao_cao', ''),
            'BC_ngay_bao_cao': data.get('BC_ngay_bao_cao', '') or data.get('BC_ngay_bao_cao_date', ''),
            'BC_don_vi_thuc_hien': data.get('BC_don_vi_thuc_hien', ''),
            'BC_qd_ubnd_tinh_so_attt': data.get('BC_qd_ubnd_tinh_so_attt', ''),
            'BC_qd_ubnd_tinh_phan_cong': data.get('BC_qd_ubnd_tinh_phan_cong', ''),
            'BC_ten_tinh': data.get('BC_ten_tinh', ''),

            # Tables
            'may_chu': data.get('may_chu', []),
            'thiet_bi_mang': data.get('thiet_bi_mang', []),
            'ung_dung': data.get('ung_dung', []),
            'camera': data.get('camera', []),
            'can_bo': data.get('can_bo_phu_trach', []),
            'ip_tinh': data.get('ip_tinh', []),
            'dao_tao': data.get('dao_tao', []),
            'kiem_tra': data.get('kiem_tra_attt', []),
            'D1_duong_truyen': data.get('ket_noi_internet', []),
            'T2_port_mapping': data.get('port_switch', []),
            'T5_vi_tri': data.get('T5_vi_tri', []),
            
            'nguoi_khao_sat': data.get('nguoi_thuc_hien', ''),
            'ngay_khao_sat': data.get('ngay_khao_sat', '.../.../2026'),
            'nam_khao_sat': '2026',
        }

        # Checkbox mappings - Mass Update
        # Mục C
        context.update(self._map_checkboxes(data.get('C4_du_lieu_type'), {
            "Cá nhân thông thường": "C4_ca_nhan_thuong",
            "Cá nhân nhạy cảm": "C4_ca_nhan_nhay_cam",
            "Dữ liệu công": "C4_du_lieu_cong",
            "Không xác định": "C4_khong_xac_dinh"
        }))
        context.update(self._map_checkboxes(data.get('C7_ket_noi_cap_tren_has'), {"Có": "C7_cap_tren_yes", "Không": "C7_cap_tren_no"}))
        context.update(self._map_checkboxes(data.get('C8_bi_mat_nha_nuoc_has'), {"Có": "C8_mat_yes", "Không": "C8_mat_no"}))

        # Mục E
        context.update(self._map_checkboxes(data.get('E2_firewall_type'), {
            "Có (phần cứng chuyên dụng)": "E2_co_firewall",
            "Dùng Firewall tích hợp": "E2_router_tich_hop",
            "Dùng phần mềm Firewall": "E2_phan_mem"
        }))

        # Mục F
        context.update(self._map_checkboxes(data.get('F2_khong_may_chu_has'), {"Có": "F2_no_server_yes", "Không": "F2_no_server_no"}))
        context.update(self._map_checkboxes(data.get('F3_cloud_has'), {"Có": "F3_cloud_yes", "Không": "F3_cloud_no"}))

        # Mục H
        context.update(self._map_checkboxes(data.get('H4_co_vlan'), {"Có": "H4_vlan_yes", "Không": "H4_vlan_no"}))

        # Mục L
        context.update(self._map_checkboxes(data.get('L1_bang_ky_ten'), {"Có": "L1_sign_yes", "Không": "L1_sign_no"}))
        context.update(self._map_checkboxes(data.get('l1_phys_key'), {
            "Có khóa cửa (chìa khóa thường)": "l1_phys_key",
            "Có khóa cửa + camera giám sát": "l1_phys_cam",
            "Có thẻ từ / kiểm soát điện tử": "l1_phys_card",
            "Không có kiểm soát riêng": "l1_phys_none"
        }))
        context.update(self._map_checkboxes(data.get('l2_pass_policy'), {"Có chính sách mật khẩu": "l2_pass_yes", "Không có chính sách thống nhất": "l2_pass_no"}))
        context.update(self._map_checkboxes(data.get('L2_2fa_has'), {"Có": "L2_2fa_yes", "Không": "L2_2fa_no"}))
        context.update(self._map_checkboxes(data.get('l3_av_has'), {"Có": "l3_av_yes", "Không": "l3_av_no"}))
        context.update(self._map_checkboxes(data.get('l4_bak_has'), {"Có": "l4_bak_yes", "Thủ công": "l4_bak_manual", "Không sao lưu": "l4_bak_none"}))
        context.update(self._map_checkboxes(data.get('l5_log_enabled'), {"Có": "l5_log_yes", "Không": "l5_log_no"}))
        context.update(self._map_checkboxes(data.get('l6_incident_has'), {"Không có sự cố nào": "l6_incident_none", "Có": "l6_incident_yes"}))
        
        # Mục P
        context.update(self._map_checkboxes(data.get('p1_protocol'), {"HTTPS (có chứng chỉ SSL/TLS)": "p1_https", "HTTP (không mã hóa)": "p1_http", "Cả hai": "p1_both"}))
        context.update(self._map_checkboxes(data.get('p2_vpn'), {"Có": "p2_vpn_yes", "Không có VPN": "p2_vpn_no"}))
        context.update(self._map_checkboxes(data.get('P3_ket_noi_cap_tren_type'), {"VPN chuyên dụng": "P3_vpn", "Internet (HTTPS)": "P3_https", "MPLS": "P3_mpls", "Không kết nối": "P3_none"}))
        context.update(self._map_checkboxes(data.get('P4_ma_hoa_luu_tru_has'), {"Có": "P4_en_yes", "Không": "P4_en_no"}))
        context.update(self._map_checkboxes(data.get('P5_email_sec'), {"Có": "P5_email_yes", "Không": "P5_email_no"}))

        # Mục Q
        context.update(self._map_checkboxes(data.get('cap_nhat_he_dieu_hanh'), {"Hàng tháng": "Q1_monthly", "Định kỳ": "Q1_periodic", "Thủ công": "Q1_manual", "Không": "Q1_none"}))
        context.update(self._map_checkboxes(data.get('Q2_cap_nhat_ung_dung'), {"Tự động": "Q2_auto", "Có": "Q2_yes", "Không": "Q2_none"}))

        # Mục T
        context.update(self._map_checkboxes(data.get('T1_1_co_dmz'), {"Có": "T1_dmz_yes", "Không": "T1_dmz_no"}))
        context.update(self._map_checkboxes(data.get('T1_2_wifi_tach_rieng'), {"Tách riêng VLAN": "T1_wifi_vlan", "Có": "T1_wifi_yes", "Không có WiFi": "T1_wifi_none"}))
        context.update(self._map_checkboxes(data.get('T3_1_co_rack'), {"Có": "T3_rack_yes", "Không": "T3_rack_no"}))
        context.update(self._map_checkboxes(data.get('T4_1_loai_cap'), {"Cáp quang (Fiber)": "T4_fiber", "Cáp đồng (Cat5e/Cat6)": "T4_copper", "Không dây": "T4_wireless"}))

        # Mục M: Photos Checklist
        for i in range(1, 15):
            key = f"M{i}_status"
            context[key] = "☒ Đã có" if data.get(key) else "☐ Chưa có"

        # Add logic results (Issues/Recommendations)
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
        doc.render(context)
        doc.save(output_path)
        logger.info(f"  Output: {output_path}")
        logger.info("="*60)
        return output_path

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
        doc.render(context)
        doc.save(output_path)
        logger.info(f"  Output: {output_path}")
        logger.info("="*60)
        return output_path

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
        doc.render(context)
        doc.save(output_path)
        logger.info(f"  Output: {output_path}")
        logger.info("="*60)
        return output_path
