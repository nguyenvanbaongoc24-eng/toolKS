import json
import os
import logging

os.environ["OPENAI_API_KEY"] = "dummy"
os.environ["AI_MODE"] = "local" # Use fallback logic instead of strict cloud

from ai_extraction.security_analyzer import SecurityAnalyzer

logging.basicConfig(level=logging.INFO)

dummy_data = {
    "he_thong_thong_tin": "Hệ thống Quản lý hành chính Demo",
    "E2_firewall_type": "Dùng phần mềm Firewall",
    "l4_bak_has": "Không sao lưu",
    "l3_av_has": "Không",
    "H4_so_vlan": "1"
}

analyzer = SecurityAnalyzer()
results = analyzer.analyze_survey(dummy_data)

print("="*40)
print(json.dumps(results, indent=2, ensure_ascii=False))
