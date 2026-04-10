import json
from document_generation.diagram_generator import DiagramGenerator

dummy_data = {
    "he_thong_thong_tin": "Hệ thống Quản lý hành chính xã Demo",
    "ket_noi_internet": [
        {"nha_cung_cap": "VNPT", "bang_thong": "100Mbps"}
    ],
    "E2_firewall_type": "Có (phần cứng chuyên dụng)",
    "thiet_bi_mang": [
        {"loai_thiet_bi": "Switch", "vi_tri": "Tầng 1"},
        {"loai_thiet_bi": "Switch", "vi_tri": "Tầng 2"}
    ],
    "may_chu": [
        {"vai_tro": "Web Server"},
        {"vai_tro": "Database"}
    ],
    "camera": [
        {"vi_tri": "Cổng chính"},
        {"vi_tri": "Hành lang"}
    ],
    "C5_noi_bo": "25"
}

dg = DiagramGenerator(output_dir="d:/ToolKS/Code/backend/generated_docs/diagrams")
path = dg.generate_network_topology(dummy_data, "test_diagram.png")
print("Diagram saved to:", path)
