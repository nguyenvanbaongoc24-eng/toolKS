"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm, useWatch, useFieldArray } from "react-hook-form";
import NetworkDiagram from "./NetworkDiagram";
import { 
  Building, Globe, Server, Save, FileDown, Plus, Trash2, 
  Router, Video, MonitorPlay, ShieldAlert, Users, StickyNote,
  FileCheck, Shield, GraduationCap, LayoutPanelLeft, FileText,
  ChevronDown, ChevronUp, Network, X, CheckCircle2, AlertTriangle, AlertCircle, XCircle, Loader2
} from "lucide-react";
import axios from "axios";
import { useAutoSave } from "@/hooks/useAutoSave";
import { surveySchema } from "@/schemas/surveySchema";
import { FormSection } from "./DynamicForm/FormSection";
import { validateSurvey, ValidationResult } from "@/utils/validation";

const MOBILE_SECTIONS = [
  { id: "section_ac", label: "A-C. Đơn vị & Hệ thống", icon: Building },
  { id: "section_di", label: "D-I. Hạ tầng & Mạng", icon: Router },
  { id: "section_kp", label: "K-P. An toàn Bảo mật", icon: ShieldAlert },
  { id: "section_qs", label: "Q-S. Quản lý & Đào tạo", icon: GraduationCap },
  { id: "section_mt", label: "M-T. Xác nhận & Sơ đồ", icon: LayoutPanelLeft }
];

export default function MobileSurveyForm({ prefilledData }: { prefilledData?: any }) {
  const [expandedSection, setExpandedSection] = useState<string | null>("section_ac");
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

  const { register, control, handleSubmit, watch, setValue, getValues } = useForm({
    defaultValues: defaultVals
  });

  const formData = useWatch({ control });
  useAutoSave(formData, 10000);

  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [exportType, setExportType] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const validation = useMemo(() => validateSurvey(formData), [formData]);

  const triggerExport = (type: string) => {
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

  const executeExport = async (type: string) => {
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
      link.click();
      setIsExporting(false);
    } catch (err) {
      clearInterval(progressInterval);
      setIsExporting(false);
      alert("Lỗi xuất file.");
    }
  };

  const AccordionHeader = ({ id, label, icon: Icon }: { id: string, label: string, icon: any }) => (
    <button type="button" onClick={() => setExpandedSection(prev => prev === id ? null : id)} className="w-full flex items-center justify-between p-4 bg-gray-900/80 border border-white/10 rounded-xl mb-2 font-semibold text-white">
      <div className="flex items-center gap-3"><Icon className="w-5 h-5 text-indigo-400" /><span className="text-sm">{label}</span></div>
      {expandedSection === id ? <ChevronUp className="w-5 h-5 text-indigo-400" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
    </button>
  );

  const handleAction = async (data: any, forcedStatus?: string) => {
    try {
      const payload = {
        id: prefilledData?.id,
        ten_don_vi: data.ten_don_vi,
        doer: data.nguoi_thuc_hien,
        status: forcedStatus || data.status || "draft",
        data: { ...data, status: forcedStatus || data.status || "draft" }
      };
      await axios.post(`${API_URL}/api/surveys`, payload);
      alert("Đã lưu!");
      window.location.href = "/";
    } catch (err) {
      alert("Lỗi kết nối máy chủ (Backend). \nLưu ý: Nếu đây là lần truy cập đầu tiên, máy chủ Render có thể mất 1-2 phút để khởi động lại.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-32">
      <form onSubmit={handleSubmit((data) => handleAction(data))} className="p-2 space-y-2">
        {/* Progress Header - height 6px requested */}
        <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-md -mx-2 px-4 py-3 border-b border-indigo-500/30 flex items-center justify-between shadow-lg">
           <div className="flex-1 mr-4">
              <div className="flex justify-between items-center mb-1">
                 <span className={`text-[10px] font-bold uppercase ${validation.progress.color}`}>Tiến độ</span>
                 <span className={`text-[10px] font-bold ${validation.progress.color}`}>{validation.progress.percent}%</span>
              </div>
              <div className="w-full h-[6px] bg-gray-800 rounded-full overflow-hidden">
                 <div className={`h-full transition-all duration-500 ${validation.progress.color.replace('text-', 'bg-')}`} style={{ width: `${validation.progress.percent}%` }} />
              </div>
           </div>
           <div className="text-right">
              <span className="text-[8px] text-gray-500 uppercase block">Thiếu</span>
              <span className="text-[11px] font-bold text-rose-400">{validation.missingFields.length}</span>
           </div>
        </div>

        {MOBILE_SECTIONS.map((tab) => (
          <div key={tab.id}>
            <AccordionHeader id={tab.id} label={tab.label} icon={tab.icon} />
            {expandedSection === tab.id && (
              <div className="animate-fade-in p-2 space-y-4 bg-black/20 rounded-xl mb-4 border border-white/5">
                {tab.id === "section_ac" && (
                  <div className="bg-indigo-500/5 p-4 rounded-lg border border-indigo-500/10 mb-4">
                    <label className="form-label text-indigo-400 font-bold mb-2 block">Cán bộ thực hiện</label>
                    <select {...register("nguoi_thuc_hien")} className="form-input bg-black/40">
                      <option value="">-- Chọn cán bộ --</option>
                      {availableStaff.map(name => <option key={name} value={name}>{name}</option>)}
                    </select>
                  </div>
                )}
                
                {surveySchema
                  .filter(s => s.id === tab.id)
                  .map(section => (
                    <FormSection
                      key={section.id}
                      section={section}
                      register={register}
                      control={control}
                      watch={watch}
                    />
                  ))}
                
                {tab.id === "section_mt" && (
                  <div className="section-card mt-4">
                    <h2 className="section-title">Sơ đồ mạng Logic</h2>
                    <NetworkDiagram data={watch()} />
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {/* Floating Action Bar - height 56px requested */}
        <div className="fixed bottom-0 left-0 right-0 h-[56px] bg-gray-900/90 backdrop-blur-lg border-t border-white/10 px-2 flex items-center z-50">
          <div className="flex gap-2 flex-1 h-full py-1.5">
            <button type="submit" className="flex-1 bg-white/5 hover:bg-white/10 text-white rounded-lg font-bold flex items-center justify-center gap-1.5 border border-white/10 text-sm">
              <Save className="w-4 h-4" /> Lưu
            </button>
            <button type="button" onClick={() => handleAction(watch(), "completed")} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold flex items-center justify-center gap-1.5 text-sm">
              <CheckCircle2 className="w-4 h-4" /> Xong
            </button>
          </div>
          <div className="flex gap-3 px-3 h-full items-center border-l border-white/10 ml-2">
            <button type="button" onClick={() => triggerExport("phieu")} className="text-cyan-400"><FileDown className="w-5 h-5"/></button>
            <button type="button" onClick={() => triggerExport("hsdx")} className="text-emerald-400"><Shield className="w-5 h-5"/></button>
            <button type="button" onClick={() => triggerExport("baocao")} className="text-indigo-400"><FileText className="w-5 h-5"/></button>
          </div>
        </div>
      </form>

      {showValidationModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-white/10 rounded-2xl max-w-2xl w-full p-6 shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <AlertCircle className="w-6 h-6 text-rose-500" />
                    <h2 className="text-lg font-bold">Thông tin còn thiếu</h2>
                </div>
                <button onClick={() => setShowValidationModal(false)}>
                    <XCircle className="w-6 h-6 text-gray-500" />
                </button>
            </div>

            <div className="max-h-[50vh] overflow-y-auto pr-2 mb-6">
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
                        <div className="text-[10px] uppercase font-black text-rose-500 mb-1">{section}</div>
                        <div className="space-y-1">
                            {fields.map((f: any) => (
                                <div key={f.fieldLabel} className="bg-white/5 p-2 rounded text-xs flex items-center gap-2">
                                    <div className="w-1 f h-1 bg-rose-500 rounded-full" />
                                    {f.fieldLabel}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex flex-col gap-2">
                <button 
                  onClick={() => setShowValidationModal(false)} 
                  className="w-full bg-white/10 p-3 rounded-xl font-bold"
                >
                    Quay lại sửa
                </button>
                {exportType && (
                    <button 
                      onClick={() => executeExport(exportType)} 
                      className="w-full bg-rose-600 p-3 rounded-xl font-bold"
                    >
                        Vẫn xuất file
                    </button>
                )}
            </div>
          </div>
        </div>
      )}

      {isExporting && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center p-6 text-center">
          <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
          <h2 className="text-xl font-bold mb-2">Đang tạo văn bản...</h2>
          <div className="w-full max-w-xs h-2 bg-gray-800 rounded-full mt-4 overflow-hidden">
            <div className="h-full bg-indigo-500 transition-all" style={{ width: `${exportProgress}%` }} />
          </div>
        </div>
      )}
    </div>
  );
}
