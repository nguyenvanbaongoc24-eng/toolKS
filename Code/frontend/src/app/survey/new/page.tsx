"use client";

import { useState, useEffect, Suspense } from "react";
import Sidebar from "@/components/Sidebar";
import SurveyForm from "@/components/SurveyForm";
import MobileSurveyForm from "@/components/MobileSurveyForm";
import { UploadCloud, PenLine, ArrowLeft, Loader2, Camera } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { useIsMobile } from "@/hooks/useIsMobile";
import { getSavedDraft } from "@/hooks/useAutoSave";

function SurveyContent() {
  const [mode, setMode] = useState<"select" | "upload" | "manual">("select");
  const [isLoading, setIsLoading] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);
  const isMobile = useIsMobile(768);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams && searchParams.get("mode") === "manual") {
       const draft = getSavedDraft();
       if (draft) {
          setExtractedData(draft);
          setMode("manual");
       }
    }
  }, [searchParams]);


  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await axios.post(`${apiUrl}/api/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("AI Extraction success:", response.data);
      const mergedData = deepMerge(getSavedDraft() || {}, response.data.extracted_data);
      setExtractedData(mergedData);
      setMode("manual");
    } catch (err) {
      console.error(err);
      alert("Lỗi phân tích tài liệu. Xin vui lòng thử lại hoặc điền trực tiếp.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDevicePhotos = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsLoading(true);
    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append("files", file);
    });

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await axios.post(`${apiUrl}/api/extract-devices`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Device Extraction:", response.data);
      
      const newDevices = response.data.extracted_data;
      const currentDraft = getSavedDraft() || {};
      
      // Merge arrays
      const mergedData = {
        ...currentDraft,
        thiet_bi_mang: [...(currentDraft.thiet_bi_mang || []), ...(newDevices.thiet_bi_mang || [])],
        may_chu: [...(currentDraft.may_chu || []), ...(newDevices.may_chu || [])],
        camera: [...(currentDraft.camera || []), ...(newDevices.camera || [])],
      };
      
      setExtractedData(mergedData);
      setMode("manual");
    } catch (err) {
      console.error(err);
      alert("Lỗi nhận diện thiết bị.");
    } finally {
      setIsLoading(false);
    }
  };

  const deepMerge = (target: any, source: any) => {
    for (const key of Object.keys(source)) {
      if (source[key] instanceof Object && !Array.isArray(source[key])) {
        Object.assign(source[key], deepMerge(target[key] || {}, source[key]));
      } else if (Array.isArray(source[key])) {
        target[key] = [...(target[key] || []), ...source[key]];
      } else {
        if (!target[key]) target[key] = source[key]; // Do not overwrite if manual exists
      }
    }
    return target;
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
            <h1 className="text-2xl font-bold flex items-center gap-2">
               {extractedData?.id ? "Chỉnh sửa Hồ sơ Khảo sát" : "Tạo Hồ sơ Khảo sát Mới"} 
               <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">v2.6</span>
            </h1>
            <p className="text-sm text-gray-400 mt-1">Tải ảnh phiếu khảo sát hoặc điền trực tiếp</p>
          </div>
        </div>

        {mode === "select" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group hover:border-indigo-500/50 transition-colors">
              <input 
                type="file" 
                accept="image/*,.pdf" 
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                title="Nhấp để tải lên bài ghi chép"
              />
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-8 h-8 text-indigo-400" />
              </div>
              <h3 className="text-lg font-bold mb-2">Quét Phiếu Ghi Chép</h3>
              <p className="text-sm text-gray-400 mb-6">Tự động trích xuất thông tin từ giấy nháp ghi tay.</p>
              <button className="btn-primary w-full justify-center pointer-events-none">
                Bắt đầu
              </button>
            </div>
            
            <div className="glass-card p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group hover:border-rose-500/50 transition-colors">
              <input 
                type="file" 
                accept="image/*" 
                multiple
                onChange={handleDevicePhotos}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                title="Chụp ảnh hoặc chọn từ thư viện"
              />
              <div className="w-16 h-16 rounded-2xl bg-rose-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Camera className="w-8 h-8 text-rose-400" />
              </div>
              <h3 className="text-lg font-bold mb-2">Chụp Ảnh Thiết Bị</h3>
              <p className="text-sm text-gray-400 mb-6">Tự động đọc nhãn dán, Serial, Model từ hình chụp.</p>
              <button className="btn-danger w-full justify-center pointer-events-none">
                Mở Camera
              </button>
            </div>
            
            <div className="glass-card p-8 flex flex-col items-center justify-center text-center group hover:border-cyan-500/50 transition-colors">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <PenLine className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="text-lg font-bold mb-2">Điền Thủ Công</h3>
              <p className="text-sm text-gray-400 mb-6">Tự tay điền mọi thông tin vào biểu mẫu chuyên dụng.</p>
              
              <div className="flex flex-col w-full gap-2">
                <button 
                  onClick={() => {
                    const draft = getSavedDraft();
                    if (draft) {
                      setExtractedData(draft);
                    }
                    setMode("manual");
                  }}
                  className="btn-primary w-full justify-center"
                >
                  {getSavedDraft() ? "Tiếp tục Bản nháp" : "Vào Form Trống"}
                </button>
                
                {getSavedDraft() && (
                  <button 
                    onClick={() => {
                      if (confirm("Xác nhận xóa bản nháp hiện tại và bắt đầu hồ sơ mới hoàn toàn?")) {
                        localStorage.removeItem('survey_profiler_draft');
                        setExtractedData(null);
                        setMode("manual");
                      }
                    }}
                    className="text-[10px] text-rose-400 hover:text-rose-300 transition-colors uppercase tracking-widest font-bold mt-1"
                  >
                    Bỏ qua & Tạo mới
                  </button>
                )}
              </div>
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
          <div className="max-w-full xl:pr-10">
            {isMobile ? (
              <MobileSurveyForm prefilledData={extractedData || undefined} />
            ) : (
              <SurveyForm prefilledData={extractedData || undefined} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function NewSurveyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white">Đang tải...</div>}>
      <SurveyContent />
    </Suspense>
  );
}
