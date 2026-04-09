"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm, useWatch, useFieldArray } from "react-hook-form";
import NetworkDiagram from "./NetworkDiagram";
import { 
  Building, Globe, Server, Save, FileDown, Plus, Trash2, 
  Router, Video, MonitorPlay, ShieldAlert, Users, StickyNote,
  FileCheck, Shield, GraduationCap, LayoutPanelLeft, FileText,
  CheckCircle2, AlertTriangle, AlertCircle, XCircle, Loader2
} from "lucide-react";
import axios from "axios";
import { useAutoSave } from "@/hooks/useAutoSave";
import { surveySchema } from "@/schemas/surveySchema";
import { FormSection } from "./DynamicForm/FormSection";
import { validateSurvey, ValidationResult } from "@/utils/validation";

const TABS = [
  { id: "section_ac", label: "A-C. Đơn vị & Hệ thống", icon: Building },
  { id: "section_di", label: "D-I. Hạ tầng & Mạng", icon: Router },
  { id: "section_kp", label: "K-P. An toàn Bảo mật", icon: ShieldAlert },
  { id: "section_qs", label: "Q-S. Quản lý & Đào tạo", icon: GraduationCap },
  { id: "section_mt", label: "M-T. Xác nhận & Sơ đồ", icon: LayoutPanelLeft }
];

export default function SurveyForm({ prefilledData }: { prefilledData?: any }) {
  const [activeTab, setActiveTab] = useState<string>("section_ac");
  const [availableStaff, setAvailableStaff] = useState<string[]>([]);
  const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/$/, '');
  // Force redeploy to sync env vars

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/staff`);
        setAvailableStaff(res.data);
      } catch (err) {
        console.error("Error fetching staff:", err);
      }
    };
    fetchStaff();
  }, [API_URL]);


  const defaultVals = {
    ...(prefilledData || {}),
    nguoi_thuc_hien: prefilledData?.doer || prefilledData?.nguoi_thuc_hien || (typeof window !== "undefined" ? localStorage.getItem("last_survey_doer") : "") || "",
    ngay_khao_sat: prefilledData?.date || prefilledData?.ngay_khao_sat || new Date().toISOString().split('T')[0],
  };

  const { register, handleSubmit, control, watch, reset, setValue, getValues } = useForm({
    defaultValues: defaultVals
  });

  const currentDoer = watch("nguoi_thuc_hien");
  useEffect(() => {
    if (currentDoer) {
      localStorage.setItem("last_survey_doer", currentDoer);
    }
  }, [currentDoer]);

  useEffect(() => {
    if (prefilledData && Object.keys(prefilledData).length > 0) {
      Object.keys(prefilledData).forEach(key => {
        setValue(key as any, prefilledData[key]);
      });
      const doerVal = prefilledData.doer || prefilledData.nguoi_thuc_hien;
      if (doerVal) {
        setValue("nguoi_thuc_hien", doerVal);
        localStorage.setItem("last_survey_doer", doerVal);
      }
    }
  }, [prefilledData, setValue]);

  const formData = useWatch({ control });
  useAutoSave(formData, 10000);

  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [exportType, setExportType] = useState<"phieu" | "hsdx" | "baocao" | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);

  const activeSections = useMemo(() => {
    return surveySchema.filter(s => s.id === activeTab);
  }, [activeTab]);

  const validation = useMemo(() => validateSurvey(formData), [formData]);

  const triggerExport = (type: "phieu" | "hsdx" | "baocao") => {
    const currentData = getValues();
    const result = validateSurvey(currentData);
    
    if (!result.isValid) {
       setValidationResult(result);
       setShowValidationModal(true);
       setExportType(type);
       return;
    }
    executeExport(type);
  };

  const executeExport = async (type: "phieu" | "hsdx" | "baocao") => {
    setShowValidationModal(false);
    setIsExporting(true);
    setExportProgress(10);
    const progressInterval = setInterval(() => {
      setExportProgress(prev => (prev < 90 ? prev + 5 : prev));
    }, 400);

    try {
      const currentData = getValues();
      const endpoint = type === "phieu" ? "/export/phieu-khao-sat" : type === "hsdx" ? "/export/ho-so-de-xuat" : "/export/bao-cao";
      const filename = `${type.toUpperCase()}_${(currentData.ten_don_vi || "ATTT").replace(/\s+/g, "_")}.docx`;

      const response = await axios.post(`${API_URL}${endpoint}`, { data: currentData }, { responseType: 'blob' });
      
      setExportProgress(100);
      clearInterval(progressInterval);

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsExporting(false);
    } catch (err) {
      clearInterval(progressInterval);
      setIsExporting(false);
      alert("Lỗi xuất file Word.");
    }
  };

  const handleComplete = async () => {
    const currentData = getValues();
    const result = validateSurvey(currentData);
    if (!result.isValid) {
      setValidationResult(result);
      setShowValidationModal(true);
      return;
    }
    if (confirm("Xác nhận hoàn thành hồ sơ?")) {
      setIsCompleting(true);
      await handleAction(currentData, "completed");
      setIsCompleting(false);
    }
  };

  const onSubmit = async (data: any) => {
    await handleAction(data);
  };

  const handleAction = async (data: any, forcedStatus?: string) => {
    setIsSaving(true);
    try {
      const payload = {
        id: prefilledData?.id,
        ten_don_vi: data.ten_don_vi,
        doer: data.nguoi_thuc_hien,
        status: forcedStatus || data.status || "draft",
        data: { ...data, status: forcedStatus || data.status || "draft" }
      };
      await axios.post(`${API_URL}/api/surveys`, payload);
      alert("Lưu thành công!");
      window.location.href = "/";
    } catch (err) {
      alert("Lỗi kết nối máy chủ (Backend). \nLưu ý: Nếu đây là lần truy cập đầu tiên, máy chủ Render có thể mất 1-2 phút để khởi động lại.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-24">
      
      {/* TABS NAVIGATION */}
      <div className="flex flex-wrap gap-2 mb-8 glass-card p-2 rounded-xl sticky top-4 z-50">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive ? "bg-indigo-500 text-white shadow-lg" : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="space-y-8 animate-fade-in mb-32">
        {activeSections.map((section) => (
          <FormSection
            key={section.id}
            section={section}
            register={register}
            control={control}
            watch={watch}
          />
        ))}

        {activeTab === "section_mt" && (
          <div className="section-card">
            <h2 className="section-title">
              Sơ đồ mạng Logic
            </h2>
            <NetworkDiagram data={watch()} />
          </div>
        )}
      </div>

      {/* ACTION BAR */}
      <div className="fixed bottom-6 left-[280px] right-6 bg-gray-900/60 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl z-[60]">
        <div className="flex justify-between gap-4 w-full px-2 items-center">
          <div className="flex items-center gap-8 hidden xl:flex">
             <div className="text-right">
                <div className="text-[10px] text-indigo-400 uppercase font-black tracking-widest">Tiến độ</div>
                <div className={`text-2xl font-black ${validation.progress.color}`}>{validation.progress.percent}%</div>
             </div>
             <div className="w-48 h-3 bg-black/40 rounded-full overflow-hidden border border-white/5">
                <div className={`h-full transition-all duration-1000 ${validation.progress.color.replace('text-', 'bg-')}`} style={{ width: `${validation.progress.percent}%` }} />
             </div>
          </div>

          <div className="flex justify-end gap-3 flex-1 items-center">
            <button type="submit" disabled={isSaving} className="btn-secondary px-6">
               {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-5 h-5" />}
               Lưu Nháp
            </button>
            <button type="button" onClick={handleComplete} disabled={isCompleting} className="btn-primary px-8">
               {isCompleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
               Hoàn thành
            </button>
            <div className="flex items-center gap-2 border-l border-white/10 pl-3">
              <button type="button" onClick={() => triggerExport("phieu")} className="p-3 text-cyan-400 hover:bg-white/5 rounded-xl"><FileDown /></button>
              <button type="button" onClick={() => triggerExport("hsdx")} className="p-3 text-emerald-400 hover:bg-white/5 rounded-xl"><Shield /></button>
              <button type="button" onClick={() => triggerExport("baocao")} className="p-3 text-indigo-400 hover:bg-white/5 rounded-xl"><FileText /></button>
            </div>
          </div>
        </div>
      </div>

      {showValidationModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-white/10 rounded-2xl max-w-2xl w-full p-8 shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-rose-500/20 rounded-xl flex items-center justify-center">
                        <AlertCircle className="w-6 h-6 text-rose-500" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Thông tin còn thiếu</h2>
                        <p className="text-sm text-gray-400">Vui lòng hoàn thiện các mục bắt buộc sau trước khi xuất bản.</p>
                    </div>
                </div>
                <button onClick={() => setShowValidationModal(false)} className="text-gray-500 hover:text-white transition-colors">
                    <XCircle className="w-6 h-6" />
                </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto custom-scrollbar pr-2 mb-8">
                {validationResult?.missingFields.reduce((groups: any, field) => {
                    if (!groups[field.sectionLabel]) groups[field.sectionLabel] = [];
                    groups[field.sectionLabel].push(field);
                    return groups;
                }, {} as any) && Object.entries(validationResult?.missingFields.reduce((groups: any, field) => {
                    if (!groups[field.sectionLabel]) groups[field.sectionLabel] = [];
                    groups[field.sectionLabel].push(field);
                    return groups;
                }, {} as any)).map(([section, fields]: [any, any]) => (
                    <div key={section} className="mb-4">
                        <div className="text-[10px] uppercase font-black text-rose-500 mb-2 tracking-widest">{section}</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {fields.map((f: any) => (
                                <div key={f.fieldLabel} className="bg-white/5 border border-white/5 p-3 rounded-lg text-sm flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-rose-500 rounded-full shrink-0" />
                                    {f.fieldLabel}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <button 
                  type="button"
                  onClick={() => setShowValidationModal(false)} 
                  className="btn-secondary"
                >
                    Tiếp tục chỉnh sửa
                </button>
                {exportType && (
                    <button 
                      type="button"
                      onClick={() => executeExport(exportType)} 
                      className="bg-rose-600 hover:bg-rose-500 text-white px-6 py-2.5 rounded-xl font-bold transition-all"
                    >
                        Vẫn xuất file
                    </button>
                )}
            </div>
          </div>
        </div>
      )}
      {/* PROGRESS MODAL */}
      {isExporting && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-fade-in">
          <div className="bg-gray-900 border border-white/10 p-8 rounded-3xl shadow-2xl max-w-sm w-full">
            <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mx-auto mb-6" />
            <h2 className="text-xl font-bold mb-2">Đang tạo văn bản...</h2>
            <p className="text-gray-400 text-sm mb-6">Vui lòng chờ trong giây lát</p>
            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-500 transition-all duration-300 shadow-[0_0_10px_rgba(99,102,241,0.5)]" 
                style={{ width: `${exportProgress}%` }} 
              />
            </div>
            <div className="mt-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
              {exportProgress}% hoàn thành
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
