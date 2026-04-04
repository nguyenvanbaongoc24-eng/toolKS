"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import SurveyForm from "@/components/SurveyForm";
import { UploadCloud, PenLine, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import axios from "axios";

export default function NewSurveyPage() {
  const [mode, setMode] = useState<"select" | "upload" | "manual">("select");
  const [isLoading, setIsLoading] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:8000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("AI Extraction success:", response.data);
      setExtractedData(response.data.extracted_data);
      setMode("manual");
    } catch (err) {
      console.error(err);
      alert("Lỗi phân tích tài liệu. Xin vui lòng thử lại hoặc điền trực tiếp.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="main-content">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="btn-secondary px-3">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Tạo Hồ sơ Khảo sát Mới</h1>
            <p className="text-sm text-gray-400 mt-1">Tải ảnh phiếu khảo sát hoặc điền trực tiếp</p>
          </div>
        </div>

        {mode === "select" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group">
              <input 
                type="file" 
                accept="image/*,.pdf" 
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                title="Nhấp để tải lên"
              />
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-8 h-8 text-indigo-400" />
              </div>
              <h3 className="text-lg font-bold mb-2">Tải lên ảnh phiếu khảo sát</h3>
              <p className="text-sm text-gray-400 mb-6">Hệ thống sẽ tự động quét bằng AI Llama và điền form.</p>
              <button className="btn-primary w-full justify-center pointer-events-none">
                Bắt đầu Tải lên
              </button>
            </div>
            
            <div className="glass-card p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-cyan-500/50 transition-colors" onClick={() => setMode("manual")}>
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-6">
                <PenLine className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="text-lg font-bold mb-2">Điền trực tiếp</h3>
              <p className="text-sm text-gray-400 mb-6">Không dĩ nhiên có ảnh? Hệ thống sẽ tạo một form trống.</p>
              <button className="btn-secondary w-full justify-center pointer-events-none">
                Bắt đầu Điền Form
              </button>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="glass-card p-12 text-center flex flex-col items-center justify-center">
             <Loader2 className="w-12 h-12 text-indigo-400 animate-spin mb-4" />
             <h3 className="text-xl font-bold mb-2">Đang phân tích tài liệu...</h3>
             <p className="text-gray-400">Tesseract OCR và Llama API đang hoạt động để bóc tách thông tin.</p>
          </div>
        )}

        {mode === "manual" && !isLoading && (
          <div className="max-w-4xl">
            {/* If extractedData is completely empty or we clicked manual, it loads an empty form */}
            <SurveyForm prefilledData={extractedData || undefined} />
          </div>
        )}
      </div>
    </div>
  );
}
