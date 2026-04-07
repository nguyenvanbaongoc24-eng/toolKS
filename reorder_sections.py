import re

file_path = r'd:\ToolKS\Code\frontend\src\components\MobileSurveyForm.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Define Section B regex (Personnel)
# Starts with <div className="pt-4 border-t border-white/5"> and contains "B. Nhân sự"
section_b_pattern = r'(\n\s+<div className="pt-4 border-t border-white/5">\s+<div className="flex justify-between items-center mb-3">\s+<label className="form-label font-bold mb-0 text-white">B\. Nhân sự quản trị / Vận hành</label>.*?{canBoFields\.fields\.map.*?</div>\s+</div>\n\s+</div>)'
# Actually, the structure is a bit nested. Let's use a more robust approach.

def move_sections(text):
    # Find Section B block
    # Start: line with B. Nhân sự
    # End: the </div> that closes the block started with <div className="pt-4 border-t border-white/5">
    
    lines = text.splitlines()
    
    start_b = -1
    for i, line in enumerate(lines):
        if 'B. Nhân sự quản trị / Vận hành' in line:
            # Go up to find the start of the section
            for j in range(i, 0, -1):
                if '<div className="pt-4 border-t border-white/5">' in lines[j]:
                    start_b = j
                    break
            break
            
    if start_b == -1:
        return text, "Could not find Section B"

    # Find the end of Section B (matching the div at start_b)
    depth = 0
    end_b = -1
    for i in range(start_b, len(lines)):
        depth += lines[i].count('<div')
        depth -= lines[i].count('</div>')
        if depth == 0:
            end_b = i
            break
            
    if end_b == -1:
        return text, "Could not find end of Section B"

    section_b = lines[start_b:end_b+1]
    del lines[start_b:end_b+1]
    
    # Find Section C start
    start_c = -1
    for i, line in enumerate(lines):
        if 'C. Hệ thống thông tin (HTTT)' in line:
            for j in range(i, 0, -1):
                if '<div className="pt-4 border-t border-white/5' in lines[j]:
                    start_c = j
                    break
            break
            
    if start_c == -1:
        return text, "Could not find Section C"
        
    # Insert B before C
    new_lines = lines[:start_c] + section_b + lines[start_c:]
    return '\n'.join(new_lines), "Success"

new_content, status = move_sections(content)
print(status)

if status == "Success":
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
