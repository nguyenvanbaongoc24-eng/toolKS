from docxtpl import DocxTemplate, InlineImage
from docx.shared import Mm
import os

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

    def _get_context(self, data):
        """Common context mapping"""
        context = {
            'ten_don_vi': data.get('ten_don_vi', ''),
            'dia_chi': data.get('dia_chi', ''),
            'nguoi_khao_sat': data.get('nguoi_thuc_hien', ''),
            'ngay_khao_sat': data.get('ngay_khao_sat', '.../.../2026'),
            'he_thong_thong_tin': data.get('he_thong_thong_tin', ''),
            'nguoi_dai_dien': data.get('nguoi_dung_dau', ''),
            'so_dien_thoai': data.get('so_dien_thoai', ''),
            'email': data.get('email', ''),
            'nam_khao_sat': '2026',
            
            # L5: Giám sát & Nhật ký
            'l5_siem_name': data.get('l5_siem_name', ''),
            
            # L6: Sự cố ATTT
            'l6_incident_desc': data.get('l6_incident_desc', ''),
            'l6_incident_resolution': data.get('l6_incident_resolution', ''),

            # Tables
            'may_chu': data.get('may_chu', []),
            'thiet_bi_mang': data.get('thiet_bi_mang', []),
            'ung_dung': data.get('ung_dung', []),
            'camera': data.get('camera', []),
        }

        # Checkbox mappings
        context.update(self._map_checkboxes(data.get('l1_phys_key'), {
            "Có khóa cửa (chìa khóa thường)": "l1_phys_key",
            "Có khóa cửa + camera giám sát": "l1_phys_cam",
            "Có thẻ từ / kiểm soát điện tử": "l1_phys_card",
            "Không có kiểm soát riêng": "l1_phys_none"
        }))
        
        context.update(self._map_checkboxes(data.get('l2_pass_policy'), {
            "Có chính sách mật khẩu": "l2_pass_yes",
            "Không có chính sách thống nhất": "l2_pass_no"
        }))
        context['l2_pass_len'] = data.get('l2_pass_len', '')
        context['l2_pass_time'] = data.get('l2_pass_time', '')

        context.update(self._map_checkboxes(data.get('l3_av_has'), {
            "Có": "l3_av_yes",
            "Không": "l3_av_no"
        }))
        context['l3_av_name'] = data.get('l3_av_name', '')

        context.update(self._map_checkboxes(data.get('l4_bak_has'), {
            "Có": "l4_bak_yes",
            "Thủ công": "l4_bak_manual",
            "Không sao lưu": "l4_bak_none"
        }))
        context['l4_bak_freq'] = data.get('l4_bak_freq', '')

        context.update(self._map_checkboxes(data.get('l5_log_enabled'), {
            "Có": "l5_log_yes",
            "Không biết / Chưa kiểm tra": "l5_log_unknown",
            "Không": "l5_log_no"
        }))
        
        context.update(self._map_checkboxes(data.get('l5_log_retention'), {
            "< 3 tháng": "l5_retention_3m",
            "3 – 6 tháng": "l5_retention_6m",
            "> 6 tháng": "l5_retention_gt6m",
            "Không lưu": "l5_retention_none"
        }))

        context.update(self._map_checkboxes(data.get('l5_siem_has'), {
            "Có": "l5_siem_yes",
            "Không": "l5_siem_no"
        }))

        context.update(self._map_checkboxes(data.get('l6_incident_has'), {
            "Không có sự cố nào": "l6_incident_none",
            "Có": "l6_incident_yes",
            "Không biết / Không ghi nhận": "l6_incident_unknown"
        }))
        
        context.update(self._map_checkboxes(data.get('l7_type'), {
            "Tường lửa tích hợp (SPI)": "l7_type_spi",
            "Tường lửa phần cứng chuyên dụng": "l7_type_hardware",
            "Tường lửa phần mềm trên máy chủ": "l7_type_software"
        }))

        # P: Mã hóa
        context.update(self._map_checkboxes(data.get('p1_protocol'), {
            "HTTPS (có chứng chỉ SSL/TLS)": "p1_https",
            "HTTP (không mã hóa)": "p1_http",
            "Cả hai": "p1_both"
        }))

        context.update(self._map_checkboxes(data.get('p2_vpn'), {
            "Có": "p2_vpn_yes",
            "Không có VPN": "p2_vpn_no"
        }))
        context['p2_vpn_type'] = data.get('p2_vpn_type', '')

        return context

    def generate_phieu_khao_sat(self, data):
        template_path = os.path.join(self.template_dir, 'phieu_khao_sat_template.docx')
        if not os.path.exists(template_path):
            raise FileNotFoundError(f"Template not found: {template_path}")
            
        doc = DocxTemplate(template_path)
        context = self._get_context(data)
        
        output_filename = f"Phieu_Khao_Sat_{data.get('ten_don_vi', 'NoName')}.docx"
        output_path = os.path.join(self.output_dir, output_filename)
        doc.render(context)
        doc.save(output_path)
        return output_path

    def generate_hsdx(self, data, diagram_path=None):
        template_path = os.path.join(self.template_dir, 'hsdx_template.docx')
        if not os.path.exists(template_path):
            raise FileNotFoundError(f"Template not found: {template_path}")
            
        doc = DocxTemplate(template_path)
        context = self._get_context(data)
        
        if diagram_path and os.path.exists(diagram_path):
            context['network_diagram'] = InlineImage(doc, diagram_path, width=Mm(150))
        else:
            context['network_diagram'] = ""
            
        output_filename = f"HSDX_{data.get('ten_don_vi', 'NoName')}.docx"
        output_path = os.path.join(self.output_dir, output_filename)
        doc.render(context)
        doc.save(output_path)
        return output_path

    def generate_bao_cao(self, data):
        template_path = os.path.join(self.template_dir, 'bao_cao_template.docx')
        if not os.path.exists(template_path):
            raise FileNotFoundError(f"Template not found: {template_path}")
            
        doc = DocxTemplate(template_path)
        context = self._get_context(data)
        
        output_filename = f"Bao_Cao_{data.get('ten_don_vi', 'NoName')}.docx"
        output_path = os.path.join(self.output_dir, output_filename)
        doc.render(context)
        doc.save(output_path)
        return output_path
