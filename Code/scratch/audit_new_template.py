from docx import Document
import os

path = os.path.join('Code', 'Mẫu phiếu khảo sát.docx')
doc = Document(path)
with open('Code/scratch/audit_results.txt', 'w', encoding='utf-8') as f:
    for i, t in enumerate(doc.tables):
        try:
            # Get text from all cells in the first row to be sure
            cells = [c.text.strip().replace('\n', ' ') for c in t.rows[0].cells]
            header = " | ".join(cells)
            f.write(f"Table {i}: {header[:200]}\n")
            # Also check if it's the right number of columns for our loops
            f.write(f"  Cols: {len(t.rows[0].cells)}\n")
        except Exception as e:
            f.write(f"Table {i}: Error: {e}\n")
