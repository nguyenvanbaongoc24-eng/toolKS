import json
import logging
import numpy as np
from typing import List, Dict, Any
from .ai_router import ai_router

logger = logging.getLogger(__name__)

# Very basic ATTT Knowledge Base (mocked for simplicity, in reality would load from PDFs)
ATTT_KNOWLEDGE_BASE = [
    "Theo điều 10 Thông tư 12/2022/TT-BTTTT: Hệ thống phải trang bị thiết bị tường lửa (Firewall) chuyên dụng để kiểm soát truy cập và phòng chống tấn công mạng.",
    "Theo tiêu chuẩn TCVN 11930:2017: Mạng nội bộ phải được phân vùng (VLAN) giữa khu vực máy chủ (Server/DMZ) và mạng máy trạm để cách ly rủi ro.",
    "Quản lý log: Tất cả thiết bị mạng, máy chủ quan trọng phải được lưu trữ nhật ký hệ thống (log) tập trung tối thiểu 3 tháng để phục vụ truy vết sự cố.",
    "Bảo mật thiết bị đầu cuối: Các máy trạm, máy chủ phải được cài đặt phần mềm phòng chống mã độc (Antivirus) có bản quyền và tự động cập nhật mẫu nhận diện mới nhất.",
    "Sao lưu dự phòng: Dữ liệu quan trọng, cấu hình hệ thống phải được sao lưu định kỳ ít nhất 1 lần/tuần và lưu trữ offline để chống Ransomware.",
    "Chính sách mật khẩu: Người dùng phải tuân thủ chính sách mật khẩu mạnh (trên 8 ký tự, có chữ hoa, thường, số và ký tự đặc biệt), thay đổi định kỳ 3 hoặc 6 tháng/lần."
]

class TinyVectorDB:
    """A lightweight numpy-based vector database to avoid C++ dependency issues on Python 3.14"""
    def __init__(self, ai_client):
        self.ai_client = ai_client
        self.documents = []
        self.embeddings = []
        logger.info("Initializing TinyVectorDB...")
        
    def _get_embedding(self, text: str) -> np.ndarray:
        # In cloud mode, use OpenAI embeddings
        try:
            res = self.ai_client.cloud_client.embeddings.create(
                input=[text],
                model="text-embedding-3-small"
            )
            return np.array(res.data[0].embedding)
        except Exception as e:
            # Fallback for offline/local: Dummy random embedding (just for structural completion if no API key)
            logger.warning(f"Embedding failed, using fallback: {e}")
            return np.random.rand(1536)
            
    def add_documents(self, docs: List[str]):
        self.documents.extend(docs)
        for doc in docs:
            self.embeddings.append(self._get_embedding(doc))
            
    def search(self, query: str, top_k: int = 2) -> List[str]:
        if not self.embeddings:
            return []
        query_emb = self._get_embedding(query)
        # Cosine similarity
        similarities = []
        for doc_emb in self.embeddings:
            sim = np.dot(query_emb, doc_emb) / (np.linalg.norm(query_emb) * np.linalg.norm(doc_emb) + 1e-10)
            similarities.append(sim)
        
        # Get top k indices
        top_indices = np.argsort(similarities)[-top_k:][::-1]
        return [self.documents[i] for i in top_indices]

class SecurityAnalyzer:
    def __init__(self):
        self.vdb = TinyVectorDB(ai_router)
        self.vdb.add_documents(ATTT_KNOWLEDGE_BASE)
        
    def analyze_survey(self, survey_data: dict) -> dict:
        """
        Uses RAG to find relevant security regulations based on survey weaknesses,
        then uses LLM to format them into problems and solutions.
        """
        logger.info("Starting AI Security Analysis...")
        
        # 1. Identify potential weaknesses from data
        weaknesses = []
        if survey_data.get('E2_firewall_type') != "Có (phần cứng chuyên dụng)":
            weaknesses.append("Hệ thống thiếu thiết bị Firewall phần cứng chuyên dụng bảo vệ mạng biên.")
        
        if survey_data.get('l4_bak_has') == "Không sao lưu":
            weaknesses.append("Chưa thực hiện sao lưu dự phòng định kỳ.")
            
        if survey_data.get('l3_av_has') != "Có":
            weaknesses.append("Máy trạm/máy chủ thiếu phần mềm Antivirus.")
            
        if survey_data.get('H4_so_vlan', '1') in ['1', '0', '']:
            weaknesses.append("Hệ thống mạng phẳng (chưa chia VLAN), không cô lập được vùng rủi ro.")

        # If no explicit weaknesses found, provide generic check
        if not weaknesses:
            weaknesses.append("Hệ thống cần đánh giá tổng thể độ an toàn mật khẩu, cấu hình và giám sát.")

        # 2. RAG Retrieval: For each weakness, get official regulation context
        context_blocks = []
        for weakness in weaknesses:
            docs = self.vdb.search(weakness, top_k=1)
            if docs:
                context_blocks.append(f"Quy định tham chiếu cho vấn đề [{weakness}]: {docs[0]}")
                
        rag_context = "\n".join(context_blocks)
        
        # 3. LLM Generation
        prompt = f"""
Bạn là một chuyên gia tư vấn an toàn thông tin (ATTT). Dựa trên các lỗ hổng kỹ thuật phát hiện được sau đây và các quy định/tiêu chuẩn ATTT tham chiếu, hãy tạo ra danh sách các vấn đề và giải pháp tư vấn cho tổ chức.

[Các điểm yếu phát hiện]
{chr(10).join(f"- {w}" for w in weaknesses)}

[Tiêu chuẩn & Quy định Tham chiếu (RAG Context)]
{rag_context}

YÊU CẦU:
Trả về kết quả dưới định dạng JSON duy nhất, có cấu trúc sau:
{{
  "problems": "- [Vấn đề 1]\\n- [Vấn đề 2]",
  "solutions": "- [Giải pháp 1]\\n- [Giải pháp 2]"
}}

Không đưa thêm bất kỳ bình luận nào ngoài mã JSON.
        """
        
        messages = [
            {"role": "system", "content": "You are a cybersecurity expert. Reply only with valid JSON."},
            {"role": "user", "content": prompt}
        ]
        
        try:
            models = [ai_router.primary_model, ai_router.fallback_model]
            response_text = ai_router._call_model_with_fallback(messages, models, response_format={"type": "json_object"})
            result = json.loads(response_text)
            logger.info("AI Analysis completed successfully.")
            return result
        except Exception as e:
            logger.error(f"AI Analysis failed: {e}")
            # Fallback to hardcoded logic if LLM fails
            return {
                "problems": "\n".join([f"- {w}" for w in weaknesses]),
                "solutions": "\n".join([f"- Cần khắc phục: {w.lower()}" for w in weaknesses])
            }
