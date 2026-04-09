from docxtpl import DocxTemplate
import os

template_path = 'Code/backend/templates/phieu_khao_sat_template.docx'
doc = DocxTemplate(template_path)

# Mock context reflecting the user's screenshot
ctx = {
    'L5_1_log_router_khong_biet': 'CHECKED_51',
    'L5_3_siem_khong': 'CHECKED_53',
    'L6_1_su_co_co': 'CHECKED_61',
}

doc.render(ctx)
xml = doc.get_xml()

print(f"L5.1 Checkbox: {'Success' if 'CHECKED_51' in xml else 'FAILED'}")
print(f"L5.3 Checkbox: {'Success' if 'CHECKED_53' in xml else 'FAILED'}")
print(f"L6.1 Checkbox: {'Success' if 'CHECKED_61' in xml else 'FAILED'}")
