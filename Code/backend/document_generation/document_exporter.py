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
        Uses 'V' (checkmark) instead of '☒'.
        """
        context = {}
        for option, placeholder in mapping.items():
            context[placeholder] = "V" if str(value).lower() == str(option).lower() else "☐"
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
        """
        Dynamically builds the context mapping based on input data.
        Aligns with the schema-driven architecture of the frontend.
        """
        # 1. Start with raw data (all fields)
        context = {k: v for k, v in data.items() if not isinstance(v, (list, dict))}
        
        # 2. Add standardized A1-A7 aliases (for template compatibility)
        context.update({
            'A1_ten_don_vi': data.get('ten_don_vi', ''),
            'A2_ten_he_thong': data.get('he_thong_thong_tin', ''),
            'A3_dia_chi': data.get('dia_chi', ''),
            'A4_so_dien_thoai': data.get('so_dien_thoai', ''),
            'A5_email': data.get('email', ''),
            'A6_ho_ten_thu_truong': data.get('A6_ho_ten_thu_truong', '') or data.get('nguoi_dung_dau', ''),
            'A6_chuc_vu_thu_truong': data.get('A6_chuc_vu_thu_truong', ''),
            'A7_so_quyet_dinh': data.get('A7_so_quyet_dinh', '') or data.get('so_quyet_dinh', ''),
            
            'nguoi_thuc_hien': data.get('nguoi_thuc_hien', ''),
            'ngay_khao_sat': data.get('ngay_khao_sat', ''),
            'nam_hien_tai': '2026',
        })

        # 3. Process Tables (FieldArrays) with index
        table_keys = {
            'can_bo_phu_trach': 'B_can_bo',
            'ket_noi_internet': 'D1_duong_truyen',
            'thiet_bi_mang': 'E1_thiet_bi_mang',
            'may_chu': 'F2_may_chu',
            'camera': 'G1_camera',
            'ip_tinh': 'H5_ip_tinh',
            'ung_dung': 'I1_ung_dung',
            'dao_tao': 'R1_dao_tao',
            'kiem_tra_attt': 'S1_kiem_tra',
            'port_switch': 'T2_port_mapping',
            'T5_vi_tri': 'T5_vi_tri'
        }
        for data_key, template_key in table_keys.items():
            rows = data.get(data_key, [])
            if isinstance(rows, list):
                context[template_key] = [{'idx': i+1, **row} for i, row in enumerate(rows)]
            else:
                context[template_key] = []

        # 4. Legal Documents Table (K_van_ban)
        context['K_van_ban'] = [
            {'idx': 1, 'loai': 'Quy chế ATTT', 'so': data.get('k1_quy_che', '')},
            {'idx': 2, 'loai': 'Kế hoạch HT', 'so': data.get('k2_ke_hoach_ht', '')},
            {'idx': 3, 'loai': 'Kế hoạch TR', 'so': data.get('k3_ke_hoach_tr', '')},
            {'idx': 4, 'loai': 'QĐ Cán bộ', 'so': data.get('k4_qd_can_bo', '')},
            {'idx': 5, 'loai': 'QĐ Phê duyệt HTTT', 'so': data.get('K5_qd_phe_duyet_httt', '')},
            {'idx': 6, 'loai': 'Quy trình ứng phó', 'so': data.get('K6_ung_pho_su_co', '')},
            {'idx': 7, 'loai': 'Biên bản kiểm tra', 'so': data.get('K7_bien_ban_kiem_tra', '')},
        ]

        # 5. Photos (M1-M14)
        for i in range(1, 15):
            key = f"M{i}_status"
            context[f"{key}_ok"] = "V Đã có" if data.get(key) else "☐ Chưa có"

        # 6. Checkbox Logic - Mapping 'V' or '☐' based on multi-choice values
        # Mapping dict: {FieldID: {OptionValue: PlaceholderName}}
        checkbox_mappings = {
            'C4_du_lieu_type': {
                "Cá nhân thông thường": "C4_du_lieu_ca_nhan_thuong",
                "Cá nhân nhạy cảm": "C4_du_lieu_ca_nhan_nhay_cam",
                "Dữ liệu công": "C4_du_lieu_cong",
                "Không xác định": "C4_khong_xac_dinh"
            },
            'E2_firewall_type': {
                "Có (phần cứng chuyên dụng)": "E2_co_firewall",
                "Dùng Firewall tích hợp": "E2_router_tich_hop",
                "Dùng phần mềm Firewall": "E2_phan_mem"
            },
            'l1_phys_key': {
                "Có khóa cửa (chìa khóa thường)": "L1_khoa_cua_thuong",
                "Có khóa cửa + camera giám sát": "L1_khoa_camera",
                "Có thẻ từ / kiểm soát điện tử": "L1_the_tu",
                "Không có kiểm soát riêng": "L1_khong_kiem_soat"
            },
            'l2_pass_policy': {
                "Đã ban hành và áp dụng": "L2_chinh_sach_mat_khau",
                "Có chính sách mật khẩu (chưa văn bản)": "L2_chinh_sach_mat_khau_chua_vb",
                "Không có chính sách thống nhất": "L2_chinh_sach_khong"
            },
            'L2_admin_acc_type': {
                "Mỗi cán bộ có tài khoản riêng": "L2_admin_rieng",
                "Dùng chung một tài khoản admin": "L2_admin_chung",
                "Cả hai hình thức": "L2_admin_ca_hai"
            },
            'l3_av_has': {"Có": "L3_co_antivirus", "Không": "L3_khong_antivirus"},
            'l4_bak_has': {
                "Có - Tự động": "L4_tu_dong",
                "Có - Thủ công": "L4_thu_cong", 
                "Không sao lưu": "L4_khong"
            },
            'l6_incident_has': {
                "Không có sự cố nào": "L6_khong_su_co",
                "Có sự cố (đã xử lý)": "L6_co_su_co_da_xl",
                "Có sự cố (chưa xử lý xong)": "L6_co_su_co_chua_xl"
            },
            'l7_type': {
                "Cứng chuyên dụng": "L7_1_phan_cung",
                "Tường lửa tích hợp (SPI)": "L7_1_router_spi",
                "Phần mềm": "L7_1_phan_mem",
                "Không có": "L7_1_khong"
            },
            'L8_2_dieu_hoa': {"Có – 24/7": "L8_2_247", "Có – Giờ hành chính": "L8_2_hanh_chinh", "Không": "L8_2_khong"},
            'p1_protocol': {"HTTPS (có chứng chỉ SSL/TLS)": "P1_giao_thuc_web_https", "HTTP (không mã hóa)": "P1_giao_thuc_web_http"},
            'P3_ket_noi_cap_tren_type': {
                "VPN chuyên dụng": "P3_vpn_chuyen_dung",
                "Internet (HTTPS)": "P3_internet_https",
                "MPLS": "P3_mpls",
                "Không kết nối": "P3_khong_ket_noi"
            },
            'P4_ma_hoa_luu_tru_has': {"Có – Phần mềm/phương pháp": "P4_ma_hoa_co", "Không mã hóa dữ liệu lưu trữ": "P4_ma_hoa_khong"},
            'T1_2_wifi_tach_rieng': {"Tách riêng VLAN": "T1_wifi_vlan", "Có": "T1_wifi_yes", "Không có WiFi": "T1_wifi_none"},
            'T4_1_loai_cap': {"Cáp đồng (Cat5e/Cat6)": "T4_1_cap_dong", "Cáp quang (Fiber)": "T4_1_cap_quang", "Hỗn hợp": "T4_1_hon_hop"}
        }

        for field_id, mapping in checkbox_mappings.items():
            context.update(self._map_checkboxes(data.get(field_id), mapping))

        # 7. Specialized Logic for HSDX and Report
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
        logger.info(f"  Tables: can_bo={len(context.get('B_can_bo', []))}, thiet_bi={len(context.get('E1_thiet_bi_mang', []))}, may_chu={len(context.get('F2_may_chu', []))}, camera={len(context.get('G1_camera', []))}")
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
            logger.error(f"Render error in Phieu Khao Sat: {str(e)}")
            traceback.print_exc()
            raise Exception(f"Phieu Export Error: {str(e)}")

    def generate_hsdx(self, data):
        template_path = os.path.join(self.template_dir, 'hsdx_template.docx')
        if not os.path.exists(template_path):
            raise FileNotFoundError(f"Template not found: {template_path}")
            
        doc = DocxTemplate(template_path)
        context = self._get_context(data)
        
        # Generate both Diagrams
        try:
            dg = DiagramGenerator(output_dir=self.output_dir)
            
            # 1. Logical Diagram
            logic_filename = f"logic_{data.get('ten_don_vi', 'Unknown').replace(' ', '_')}.png"
            logic_path = dg.generate_logical_diagram(data, logic_filename)
            context['logical_diagram'] = InlineImage(doc, logic_path, width=Mm(150))
            
            # 2. Physical Diagram
            phys_filename = f"phys_{data.get('ten_don_vi', 'Unknown').replace(' ', '_')}.png"
            phys_path = dg.generate_physical_diagram(data, phys_filename)
            context['physical_diagram'] = InlineImage(doc, phys_path, width=Mm(150))
            
            # Backward compatibility for templates using 'network_diagram'
            context['network_diagram'] = context['logical_diagram']
            
        except Exception as e:
            logger.error(f"Failed to generate network diagrams: {e}")
            context['logical_diagram'] = ""
            context['physical_diagram'] = ""
            context['network_diagram'] = ""
        
        output_filename = f"HSDX_{data.get('ten_don_vi', 'NoName')}.docx"
        output_path = os.path.join(self.output_dir, output_filename)
        try:
            doc.render(context)
            doc.save(output_path)
            logger.info(f"  Output saved: {output_path}")
            return output_path
        except Exception as e:
            logger.error(f"Render error in HSDX: {str(e)}")
            traceback.print_exc()
            raise Exception(f"HSDX Export Error: {str(e)}")

    def generate_bao_cao(self, data):
        template_path = os.path.join(self.template_dir, 'bao_cao_template.docx')
        if not os.path.exists(template_path):
            raise FileNotFoundError(f"Template not found: {template_path}")
            
        doc = DocxTemplate(template_path)
        context = self._get_context(data)
        
        # Override with AI Analysis if available
        try:
            analyzer = SecurityAnalyzer()
            ai_results = analyzer.analyze_survey(data)
            context['problems'] = ai_results.get('problems', context.get('problems'))
            context['solutions'] = ai_results.get('solutions', context.get('solutions'))
        except Exception as e:
            logger.warning(f"Could not perform Intelligent Security Analysis: {e}")
            
        output_filename = f"Bao_Cao_{data.get('ten_don_vi', 'NoName')}.docx"
        output_path = os.path.join(self.output_dir, output_filename)
        try:
            doc.render(context)
            doc.save(output_path)
            logger.info(f"  Output saved: {output_path}")
            return output_path
        except Exception as e:
            logger.error(f"Render error in Bao Cao: {str(e)}")
            traceback.print_exc()
            raise Exception(f"Bao Cao Export Error: {str(e)}")
