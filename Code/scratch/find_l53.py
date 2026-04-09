from docx import Document
import sys

# Set output encoding to UTF-8
sys.stdout.reconfigure(encoding='utf-8')

doc = Document('Code/backend/templates/phieu_khao_sat_template.docx')
for i, p in enumerate(doc.paragraphs):
    if i >= 138 and i <= 145:
        print(f"{i}: [{p.text.strip()}]")
