import os
import json
from openai import OpenAI

class AIRouterService:
    def __init__(self):
        # Configure the local Ollama client (compatible with OpenAI)
        base_url = os.environ.get("OLLAMA_BASE_URL", "http://localhost:11434/v1")
        self.ollama_client = OpenAI(
            api_key="ollama", # dummy key for local
            base_url=base_url
        )
        
        # Configure the Cloud Fallback client (Llama-API)
        self.cloud_client = OpenAI(
            api_key=os.environ.get("OPENAI_API_KEY"),
            base_url=os.environ.get("OPENAI_BASE_URL", "https://api.llama-api.com")
        )
        self.cloud_model = os.environ.get("OPENAI_MODEL", "llama3.1-70b")
        
        # Load model preferences from environment
        self.primary_model = os.environ.get("PRIMARY_MODEL", "llama3")
        self.fallback_model = os.environ.get("FALLBACK_MODEL", "gemma")
        self.validation_model = os.environ.get("VALIDATION_MODEL", "mistral")
        self.ocr_cleanup_model = os.environ.get("OCR_CLEANUP_MODEL", "gemma")

    def _call_model_with_fallback(self, messages, models_to_try, response_format=None, temperature=0.1):
        """
        Attempts to call local models. If all fail, falls back to Cloud AI.
        Returns the content of the response.
        """
        last_exception = None
        
        # STAGE 1: LOCAL OLLAMA ATTEMPTS
        for model in models_to_try:
            print(f"[AIRouter] Stage 1 (Local): Attempting {model}...")
            try:
                kwargs = {
                    "model": model,
                    "messages": messages,
                    "temperature": temperature,
                    "timeout": 30.0 
                }
                if response_format:
                    kwargs["response_format"] = response_format
                
                response = self.ollama_client.chat.completions.create(**kwargs)
                print(f"[AIRouter] Success with local model: {model}")
                return response.choices[0].message.content
                
            except Exception as e:
                print(f"[AIRouter] Local model {model} failed: {e}")
                last_exception = e
                continue
        
        # STAGE 2: CLOUD FALLBACK (LAST RESORT)
        print(f"[AIRouter] STAGE 2: Local AI unreachable. Switching to Cloud ({self.cloud_model})...")
        try:
            kwargs = {
                "model": self.cloud_model,
                "messages": messages,
                "temperature": temperature,
                "timeout": 60.0
            }
            if response_format:
                kwargs["response_format"] = response_format
                
            response = self.cloud_client.chat.completions.create(**kwargs)
            print(f"[AIRouter] Success with Cloud Fallback!")
            return response.choices[0].message.content
        except Exception as cloud_e:
            print(f"[AIRouter] CRITICAL: Cloud fallback also failed: {cloud_e}")
            raise Exception(f"All AI providers (Local & Cloud) are unreachable. Last error: {cloud_e}")

    def clean_ocr_text(self, raw_ocr_text: str) -> str:
        """
        Task 1: Use Gemma (fallback: Llama3) to clean up OCR errors and fix Vietnamese spelling.
        """
        system_prompt = "Bạn là chuyên gia về tiếng Việt. Hãy sửa các lỗi chính tả, lỗi font chữ do quá trình OCR gây ra trong văn bản đầu vào. Chỉ trả về văn bản đã sửa, tuyệt đối không giải thích thêm."
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": raw_ocr_text}
        ]
        
        models = [self.ocr_cleanup_model, self.primary_model]
        
        try:
            cleaned_text = self._call_model_with_fallback(messages, models, temperature=0.1)
            return cleaned_text
        except Exception as e:
            print(f"clean_ocr_text failed, returning raw text: {e}")
            return raw_ocr_text

    def extract_json(self, cleaned_text: str, json_schema: str) -> dict:
        """
        Task 2: Use Llama3 (fallback: Gemma, Mistral) to extract structured JSON.
        """
        messages = [
            {"role": "system", "content": json_schema},
            {"role": "user", "content": f"Trích xuất JSON từ đoạn text sau:\n\n{cleaned_text}"}
        ]
        
        models = [self.primary_model, self.fallback_model, self.validation_model]
        
        try:
            # We enforce json object format. If Ollama model doesn't support json_object natively, it may warn
            result_text = self._call_model_with_fallback(messages, models, response_format={"type": "json_object"}, temperature=0.1)
            return json.loads(result_text)
        except Exception as e:
            print(f"extract_json failed: {e}")
            raise e

    def analyze_device_specs(self, combined_text: str, json_schema: str) -> dict:
        """
        Task 3: Use Mistral (fallback: Llama3) for device spec analysis.
        """
        messages = [
            {"role": "system", "content": json_schema},
            {"role": "user", "content": f"Trích xuất JSON từ các đoạn văn bản OCR chụp từ thiết bị sau:\n\n{combined_text}"}
        ]
        
        models = [self.validation_model, self.primary_model]
        
        try:
            result_text = self._call_model_with_fallback(messages, models, response_format={"type": "json_object"}, temperature=0.1)
            return json.loads(result_text)
        except Exception as e:
            print(f"analyze_device_specs failed: {e}")
            raise e

# Instantiate the singleton service
ai_router = AIRouterService()
