import os
from docxtpl import DocxTemplate

def generate_report_docx(template_path: str, data: dict, output_path: str) -> str:
    """
    Generate a Word document by injecting JSON data into a Jinja template .docx file using docxtpl.
    """
    try:
        if not os.path.exists(template_path):
            raise FileNotFoundError(f"Template not found at {template_path}")
            
        doc = DocxTemplate(template_path)
        
        # docxtpl uses context dictionary to replace Jinja tags like {{ ten_don_vi }}
        doc.render(data)
        
        doc.save(output_path)
        return output_path
        
    except Exception as e:
        print(f"Document Generation Error: {e}")
        return ""
