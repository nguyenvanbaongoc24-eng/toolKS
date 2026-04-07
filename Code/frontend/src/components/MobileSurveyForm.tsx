"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import NetworkDiagram from "./NetworkDiagram";
import { 
  Building, Globe, Server, Save, FileDown, Plus, Trash2, 
  Router, Video, MonitorPlay, ShieldAlert, Users, StickyNote,
  FileCheck, Shield, GraduationCap, LayoutPanelLeft, FileText,
  ChevronDown, ChevronUp, Network, X, CheckCircle2, AlertTriangle, AlertCircle, XCircle, Loader2
} from "lucide-react";
import axios from "axios";
import { useAutoSave } from "@/hooks/useAutoSave";

export default function MobileSurveyForm({ prefilledData }: { prefilledData?: any }) {
  const [expandedSection, setExpandedSection] = useState<string | null>("don_vi");
  const [showNetworkModal, setShowNetworkModal] = useState(false);
  const [availableStaff, setAvailableStaff] = useState<string[]>([]);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/staff`);
        setAvailableStaff(res.data);
      } catch (err) {
        console.error("Theo dõi lỗi staff:", err);
      }
    };
    fetchStaff();
  }, []);

  useEffect(() => {
    // Crucial: Clear ID from prefilled results or drafts when explicitly creating a NEW survey
    // This prevents accidental overwriting of old survey records.
    if (typeof window !== "undefined" && window.location.pathname.endsWith("/survey/new")) {
       if (prefilledData?.id) {
          console.warn("Detected ID in NEW survey route. Clearing ID to prevent overwrite.");
          delete prefilledData.id;
       }
    }
  }, [prefilledData]);

  const defaultVals = {
    ...(prefilledData || {}),
    // Map backend 'doer' to frontend 'nguoi_thuc_hien'
    nguoi_thuc_hien: prefilledData?.doer || prefilledData?.nguoi_thuc_hien || (typeof window !== "undefined" ? localStorage.getItem("last_survey_doer") : "") || "",
    ngay_khao_sat: prefilledData?.date || prefilledData?.ngay_khao_sat || new Date().toISOString().split('T')[0],
    
    // Tab 1: Đơn vị & Nhân sự (Mục A, B, C)
    ten_don_vi: "", dia_chi: "", A6_ho_ten_thu_truong: "", so_dien_thoai: "", email: "", 
    A6_chuc_vu_thu_truong: "", A7_so_quyet_dinh: "",
    he_thong_thong_tin: "", C1_mo_ta_chuc_nang: "", C2_doi_tuong_nguoi_dung: "", C3_loai_du_lieu: "",
    C4_du_lieu_type: "Không xác định", C5_noi_bo: "", C5_ben_ngoai: "", C6_nam_hoat_dong: "",
    C7_ket_noi_cap_tren_has: "Không", C7_ten_he_thong_cap_tren: "",
    C8_bi_mat_nha_nuoc_has: "Không", C8_do_mat: "",
    can_bo_phu_trach: [],
    B2_don_vi_ho_tro: "",
    
    // Tab 2: Hạ tầng & Mạng (Mục D, E, F, G, H, T)
    ket_noi_internet: [], D2_router_modem: "", D3_ip_lan_gateway: "",
    thiet_bi_mang: [], E2_firewall_type: "Dùng Firewall tích hợp",
    F1_pc_sl: "", F1_pc_os: "Windows 10/11", F1_laptop_sl: "", F1_laptop_os: "Windows 10/11",
    F1_tablet_sl: "", F1_mayin_sl: "", F1_dienthoai_sl: "",
    F2_khong_may_chu_has: "Không", F2_luu_tru_o_dau: "",
    may_chu: [], F3_cloud_has: "Không", F3_ten_cloud: "",
    camera: [{ hang_san_xuat: "", model: "", so_serial: "", do_phan_giai: "", vi_tri: "", ghi_chu: "" }], 
    G2_dau_ghi_nvr: "", G3_luu_tru_ngay: "",
    H1_dai_ip_lan: "", H2_ip_gateway: "", H3_dns: "", H4_co_vlan: "Không", H4_so_vlan: "", H4_mo_ta_vlan: "",
    ip_tinh: [],
    T1_1_co_dmz: "Không", T1_1_may_chu_dmz: "", 
    T1_2_wifi_tach_rieng: "Không có WiFi", T1_3_ssid: "", T1_3_bao_mat_wifi: "",
    T1_4_camera_vlan_has: "Cùng mạng LAN",
    T2_port_mapping: [{ ten_switch: "", so_cong: "", port_map: "", ghi_chu: "" }],
    T3_1_co_rack: "Không", T3_1_rack_u: "", T3_1_rack_vi_tri: "", T3_2_thiet_bi_trong_tu: "",
    T4_1_loai_cap: "Cáp đồng (Cat5e/Cat6)", T4_2_cap_isp: "",
    
    // Tab 3: Dịch vụ & Ứng dụng (Mục I, P)
    ung_dung: [],
    p1_protocol: "HTTP (không mã hóa)",
    p2_vpn: "Không có VPN", p2_vpn_type: "",
    P3_ket_noi_cap_tren_type: "Không kết nối", P3_1_ten_he_thong_va_phuong_thuc: "",
    P4_ma_hoa_luu_tru_has: "Không", P4_phuong_phap: "",
    P5_email_sec: "Không",
    
    // Tab 4: An toàn Bảo mật (Mục L, Q, K)
    l1_phys_key: "Không có kiểm soát riêng", L1_bang_ky_ten: "Không",
    l2_pass_policy: "Không có chính sách thống nhất", l2_pass_len: "8", l2_pass_time: "3",
    L2_admin_acc_type: "Dùng chung một tài khoản admin", L2_2fa_has: "Không",
    l3_av_has: "Không", l3_av_name: "", l3_av_license: "Có bản quyền", L3_cap_nhat_virus: "Tự động",
    l4_bak_has: "Không sao lưu", l4_bak_freq: "Hàng ngày", L4_offsite_has: "Không", L4_luu_o_dau: "Ổ cứng ngoài",
    l5_log_enabled: "Không", l5_log_retention: "3 tháng", l5_siem_has: "Không", l5_siem_name: "",
    l6_incident_has: "Không có sự cố nào", l6_incident_desc: "", l6_incident_resolution: "",
    l7_type: "Tường lửa tích hợp (SPI)", L7_chinh_sach: "Chưa cấu hình", L7_remote_access: "Không", L7_4_cong_mo: "",
    L8_1_co_ups: "Không", L8_1_ups_hang_model: "", L8_1_ups_cong_suat_va: "", L8_1_ups_thoi_gian_phut: "",
    L8_2_dieu_hoa: "Không", L8_3_bin_chua_chay_has: "Không", L8_4_mo_ta_phong: "",
    cap_nhat_he_dieu_hanh: "Không", Q2_cap_nhat_ung_dung: "Không", Q3_nguoi_chiu_trach_nhiem: "", Q4_firmware_mang: "", Q5_theo_doi_canh_bao: "Không",
    
    k1_quy_che: "", k2_ke_hoach_ht: "", k3_ke_hoach_tr: "", k4_qd_can_bo: "",
    K5_qd_phe_duyet_httt: "", K6_ung_pho_su_co: "", K7_bien_ban_kiem_tra: "",
    
    // Tab 4.ii: Đào tạo & Kiểm tra (Mục R, S)
    dao_tao: [],
    kiem_tra_attt: [],
    S2_danh_gia_last: "", 
    
    // Tab 5: Đánh giá & Xác nhận (Mục M, N, BC)
    ...Array.from({ length: 14 }, (_, i) => ({ [`M${i+1}_status`]: false })).reduce((a, b: any) => ({ ...a, ...b }), {}),
    n_nguoi_lap: "", n_chuc_vu_lap: "", n_ngay_lap: new Date().toISOString().split('T')[0],
    N_nguoi_kiem_tra_ho_ten: "", N_nguoi_kiem_tra_chuc_vu: "", N_ngay_kiem_tra: "",
    N_thu_truong_ho_ten: "", N_thu_truong_chuc_vu: "", N_ngay_ky: "",
    
    BC_ten_tinh: "",
    
    ghi_chu: "",
    ...prefilledData
  };

  const { register, control, handleSubmit, watch } = useForm({ defaultValues: defaultVals });

  const canBoFields = useFieldArray({ control, name: "can_bo_phu_trach" });
  const internetFields = useFieldArray({ control, name: "ket_noi_internet" });
  const tbMangFields = useFieldArray({ control, name: "thiet_bi_mang" });
  const mayChuFields = useFieldArray({ control, name: "may_chu" });
  const cameraFields = useFieldArray({ control, name: "camera" });
  const ungDungFields = useFieldArray({ control, name: "ung_dung" });
  const ipTinhFields = useFieldArray({ control, name: "ip_tinh" });
  const daoTaoFields = useFieldArray({ control, name: "dao_tao" });
  const kiemTraFields = useFieldArray({ control, name: "kiem_tra_attt" });
  const portMappingFields = useFieldArray({ control, name: "T2_port_mapping" });

  const formData = watch();
  useAutoSave(formData, 10000);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const calculateProgress = () => {
     // A more comprehensive progress calculation across all sections
     const countFields = (obj: any): { filled: number, total: number } => {
        let filled = 0;
        let total = 0;
        const ignore = ["id", "status", "date", "ngay_khao_sat", "data", "ghi_chu", "BC_ten_tinh"];
        
        Object.keys(obj).forEach(key => {
           if (ignore.includes(key)) return;
           const val = obj[key];
           if (Array.isArray(val)) {
              if (val.length > 0) filled++;
              total++;
           } else if (typeof val === "object" && val !== null) {
              const sub = countFields(val);
              filled += sub.filled;
              total += sub.total;
           } else {
              if (val !== "" && val !== null && val !== undefined && val !== "Không xác định") filled++;
              total++;
           }
        });
        return { filled, total };
     };

     const { filled, total } = countFields(formData);
     // We normalize total to a reasonable number of "core" questions for a better UX
     // The form has ~100+ raw fields, let's target about 50 key data points.
     const percent = Math.min(100, Math.round((filled / 60) * 100)); 
     return { percent, missing: Math.max(0, 60 - filled) };
  };

  const Indicator = ({ name, required }: { name: string, required?: boolean }) => {
    const val = formData[name as keyof typeof formData];
    if (!val && required) return <AlertCircle className="w-4 h-4 text-rose-500 inline ml-2" />;
    if (val) return <CheckCircle2 className="w-4 h-4 text-emerald-500 inline ml-2" />;
    return null;
  };

   const [isCompleting, setIsCompleting] = useState(false);
   const progress = calculateProgress();

  const handleComplete = async () => {
    if (!formData.ten_don_vi || !formData.he_thong_thong_tin) {
      setShowValidationModal(true);
      return;
    }
    if (confirm("Xác nhận hoàn thành hồ sơ này? Sau khi hoàn thành, trạng thái sẽ chuyển sang 'Hoàn thành'.")) {
      setIsCompleting(true);
      await handleAction(formData, "completed");
      setIsCompleting(false);
    }
  };

  const onSubmit = async (data: any) => {
    await handleAction(data);
  };

  const handleAction = async (data: any, forcedStatus?: string) => {
    if (!data.ten_don_vi || !data.he_thong_thong_tin) {
      setShowValidationModal(true);
      return;
    }
    
    setIsSaving(true);
    try {
      // Save last doer for auto-fill
      if (data.nguoi_thuc_hien) {
        localStorage.setItem("last_survey_doer", data.nguoi_thuc_hien);
      }

      const payload = {
        id: prefilledData?.id,
        ten_don_vi: data.ten_don_vi,
        doer: data.nguoi_thuc_hien,
        status: forcedStatus || data.status || "draft",
        date: data.ngay_khao_sat || new Date().toISOString().split('T')[0],
        data: { ...data, status: forcedStatus || data.status || "draft" }
      };
      
      const response = await axios.post(`${API_URL}/api/surveys`, payload);
      if (response.data.status === "success") {
        alert(prefilledData?.id ? "Cập nhật thành công!" : "Lưu hồ sơ mới thành công!");
        window.location.href = "/";
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi khi kết nối máy chủ.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = async (type: string) => {
     try {
       const endpoint = type === "phieu" ? "/export/phieu-khao-sat" : type === "hsdx" ? "/export/ho-so-de-xuat" : "/export/bao-cao";
       const filename = `${type.toUpperCase()}_${formData.ten_don_vi || "ATTT"}.docx`;
       const response = await axios.post(`${API_URL}${endpoint}`, { data: formData }, { responseType: 'blob' });
       const url = window.URL.createObjectURL(new Blob([response.data]));
       const link = document.createElement('a');
       link.href = url;
       link.setAttribute('download', filename);
       document.body.appendChild(link);
       link.click();
     } catch (err) { console.error("Export error:", err); }
  };

  const AccordionHeader = ({ id, label, icon: Icon }: { id: string, label: string, icon: any }) => (
    <button type="button" onClick={() => setExpandedSection(prev => prev === id ? null : id)} className="w-full flex items-center justify-between p-4 bg-gray-900/80 border border-white/10 rounded-xl mb-2 font-semibold">
      <div className="flex items-center gap-3"><Icon className="w-5 h-5 text-indigo-400" /><span className="text-sm">{label}</span></div>
      {expandedSection === id ? <ChevronUp className="w-5 h-5 text-indigo-400" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
    </button>
  );

  return (
    <>
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 pb-28 px-2 max-w-full overflow-hidden text-white bg-black/20 relative">
      {/* Sticky Progress Bar */}
      <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-md -mx-2 px-4 py-2 border-b border-indigo-500/30 flex items-center justify-between shadow-lg">
         <div className="flex-1 mr-4">
            <div className="flex justify-between items-center mb-1">
               <span className="text-[10px] font-bold uppercase text-indigo-400">Tiến độ hoàn thành</span>
               <span className="text-[10px] font-bold text-indigo-400">{progress.percent}%</span>
            </div>
            <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden border border-white/5">
               <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" 
                  style={{ width: `${progress.percent}%` }}
               />
            </div>
         </div>
         <div className="text-right">
            <span className="text-[8px] text-gray-500 uppercase block">Còn thiếu</span>
            <span className="text-[11px] font-mono font-bold text-rose-400">{progress.missing}</span>
         </div>
      </div>

      <AccordionHeader id="don_vi" label="I. Đơn vị & Nhân sự" icon={Building} />
      {expandedSection === "don_vi" && (
        <div className="animate-fade-in p-4 bg-black/40 rounded-xl mb-4 space-y-4 border border-white/5 shadow-inner">
           <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-4 rounded-lg border border-indigo-500/20 mb-2">
              <label className="form-label text-indigo-400 font-bold mb-2">Cán bộ thực hiện</label>
              <select {...register("nguoi_thuc_hien")} className="form-input bg-black/40">
                <option value="">-- Chọn cán bộ --</option>
                {availableStaff.map(name => <option key={name} value={name}>{name}</option>)}
              </select>
           </div>
           
           <div className="space-y-3">
              <h4 className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">A. Thông tin đơn vị</h4>
              <div><label className="form-label">Tên cơ quan (*) <Indicator name="ten_don_vi" required /></label><input {...register("ten_don_vi")} className="form-input" /></div>
              <div><label className="form-label">Địa chỉ</label><input {...register("dia_chi")} className="form-input" /></div>
              <div className="grid grid-cols-2 gap-2">
                <div><label className="form-label text-[10px]">Điện thoại</label><input {...register("so_dien_thoai")} className="form-input h-11" /></div>
                <div><label className="form-label text-[10px]">Email</label><input {...register("email")} className="form-input h-11" /></div>
              </div>
               <div><label className="form-label text-[10px]">Số quyết định quy định chức năng nhiệm vụ (A7)</label><input {...register("A7_so_quyet_dinh")} className="form-input h-11" /></div>
               <div className="grid grid-cols-2 gap-2">
                 <div><label className="form-label text-[10px]">Thủ trưởng (A6)</label><input {...register("A6_ho_ten_thu_truong")} className="form-input h-11" placeholder="Họ tên" /></div>
                 <div><label className="form-label text-[10px]">Chức vụ (A6.ii)</label><input {...register("A6_chuc_vu_thu_truong")} className="form-input h-11" placeholder="Chức vụ" /></div>
               </div>
            </div>

            <div className="pt-4 border-t border-white/5">
               <div className="flex justify-between items-center mb-3">
                 <label className="form-label font-bold mb-0 text-white">B. Nhân sự & Đơn vị hỗ trợ</label>
                 <button type="button" onClick={() => canBoFields.append({ ho_ten: "", chuc_vu: "", so_dt: "", email: "", trinh_do: "", chung_chi_attt: "" })} className="bg-indigo-500/20 text-indigo-400 p-1.5 rounded-lg"><Plus className="w-4 h-4" /></button>
               </div>
               <div className="mb-4">
                  <label className="form-label text-[10px]">Đơn vị hỗ trợ kỹ thuật (B2)</label>
                  <input {...register("B2_don_vi_ho_tro")} className="form-input h-11" placeholder="Tên đơn vị & SĐT hỗ trợ..." />
               </div>
               {canBoFields.fields.map((field, idx) => (
                 <div key={field.id} className="p-4 bg-gray-800/40 rounded-lg mb-3 border border-white/5 shadow-lg">
                    <div className="flex justify-between items-center mb-3 border-b border-white/5 pb-2">
                       <span className="text-[10px] font-bold text-gray-500 uppercase">Cán bộ #{idx + 1}</span>
                       <button type="button" onClick={() => canBoFields.remove(idx)} className="text-rose-500 bg-rose-500/10 p-1.5 rounded-md"><Trash2 className="w-3.5 h-3.5"/></button>
                    </div>
                    <div className="space-y-3">
                       <input {...register(`can_bo_phu_trach.${idx}.ho_ten`)} placeholder="Họ tên" className="form-input text-xs" />
                       <div className="grid grid-cols-2 gap-2 mt-1">
                          <input {...register(`can_bo_phu_trach.${idx}.chuc_vu`)} placeholder="Chức vụ" className="form-input text-xs" />
                          <input {...register(`can_bo_phu_trach.${idx}.so_dt`)} placeholder="SĐT" className="form-input text-xs" />
                       </div>
                       <div className="grid grid-cols-2 gap-2 mt-1">
                          <input {...register(`can_bo_phu_trach.${idx}.email`)} placeholder="Email" className="form-input text-xs" />
                          <input {...register(`can_bo_phu_trach.${idx}.trinh_do`)} placeholder="Trình độ" className="form-input text-xs" />
                       </div>
                    </div>
                 </div>
               ))}
            </div>

           <div className="pt-4 border-t border-white/5 space-y-3">
              <h4 className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">C. Hệ thống thông tin (HTTT)</h4>
              <div><label className="form-label">Tên HTTT (*) <Indicator name="he_thong_thong_tin" required /></label><input {...register("he_thong_thong_tin")} className="form-input" /></div>
              <div><label className="form-label">Mô tả chức năng (C1)</label><textarea {...register("C1_mo_ta_chuc_nang")} className="form-input min-h-[60px] text-xs" /></div>
              <div className="grid grid-cols-2 gap-2">
                 <div><label className="form-label text-[10px]">Đối tượng người dùng (C2)</label><input {...register("C2_doi_tuong_nguoi_dung")} className="form-input h-11 text-xs" /></div>
                 <div><label className="form-label text-[10px]">Loại dữ liệu (C3)</label><input {...register("C3_loai_du_lieu")} className="form-input h-11 text-xs" /></div>
              </div>
              <div className="p-3 bg-white/5 rounded border border-white/5">
                 <label className="form-label text-[10px]">Phân loại dữ liệu (C4)</label>
                 <select {...register("C4_du_lieu_type")} className="form-input h-11 text-xs">
                   <option value="Không xác định">Không xác định</option>
                   <option value="Cá nhân thông thường">Cá nhân thông thường</option>
                   <option value="Cá nhân nhạy cảm">Cá nhân nhạy cảm</option>
                   <option value="Dữ liệu công">Dữ liệu công</option>
                 </select>
              </div>
              <div className="grid grid-cols-3 gap-2">
                 <div><label className="form-label text-[10px]">Nội bộ (người)</label><input {...register("C5_noi_bo")} className="form-input h-11 text-xs" type="number" /></div>
                 <div><label className="form-label text-[10px]">Bên ngoài (lượt)</label><input {...register("C5_ben_ngoai")} className="form-input h-11 text-xs" /></div>
                 <div><label className="form-label text-[10px]">Năm HĐ (C6)</label><input {...register("C6_nam_hoat_dong")} className="form-input h-11 text-xs" /></div>
              </div>
              <div className="p-3 bg-white/5 rounded border border-white/5">
                 <label className="form-label text-[10px]">Kết nối hệ thống cấp trên? (C7)</label>
                 <div className="flex gap-2">
                   <select {...register("C7_ket_noi_cap_tren_has")} className="form-input flex-1 h-11">
                      <option value="Không">Không</option><option value="Có">Có</option>
                   </select>
                   {formData.C7_ket_noi_cap_tren_has === "Có" && <input {...register("C7_ten_he_thong_cap_tren")} className="form-input flex-1 h-11 text-xs" placeholder="Tên hệ thống..." />}
                 </div>
              </div>
              <div className="p-3 bg-white/5 rounded border border-white/5">
                 <label className="form-label text-[10px]">Bí mật nhà nước? (C8)</label>
                 <div className="flex gap-2">
                   <select {...register("C8_bi_mat_nha_nuoc_has")} className="form-input flex-1 h-11">
                      <option value="Không">Không</option><option value="Có">Có</option>
                   </select>
                   {formData.C8_bi_mat_nha_nuoc_has === "Có" && <input {...register("C8_do_mat")} className="form-input flex-1 h-11 text-xs" placeholder="Độ mật..." />}
                 </div>
              </div>
           </div>
        </div>
      )}

      <AccordionHeader id="ha_tang" label="II. Hạ tầng & Mạng" icon={Router} />
      {expandedSection === "ha_tang" && (
        <div className="animate-fade-in p-4 bg-black/40 rounded-xl mb-4 space-y-6 border border-white/5 shadow-inner">
           <div className="space-y-4">
             <div className="flex justify-between items-center mb-2">
               <label className="form-label font-bold text-indigo-400 uppercase text-[10px]">D. Kết nối Internet</label>
               <button type="button" onClick={() => internetFields.append({ isp: "", loai_ket_noi: "Cáp quang", bang_thong: "", vai_tro: "Đường chính", ip_wan: "IP Tĩnh", ghi_chu: "" })} className="bg-indigo-500/20 text-indigo-400 p-1 rounded-lg"><Plus className="w-4 h-4" /></button>
             </div>
             {internetFields.fields.map((field, idx) => (
               <div key={field.id} className="p-3 bg-white/5 rounded-lg mb-2 border border-white/5 shadow-md font-sans">
                  <div className="flex justify-between mb-2">
                     <span className="text-[9px] text-gray-500 font-bold uppercase">Line #{idx+1}</span>
                     <button type="button" onClick={() => internetFields.remove(idx)} className="text-rose-400"><Trash2 className="w-3 h-3"/></button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                     <input {...register(`ket_noi_internet.${idx}.isp`)} placeholder="ISP (VNPT...)" className="form-input text-xs h-11" />
                     <input {...register(`ket_noi_internet.${idx}.loai_ket_noi`)} placeholder="Loại (Fiber...)" className="form-input text-xs h-11" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                     <input {...register(`ket_noi_internet.${idx}.bang_thong`)} placeholder="Băng thông" className="form-input text-xs h-11" />
                     <input {...register(`ket_noi_internet.${idx}.ip_wan`)} placeholder="IP WAN" className="form-input text-xs h-11" />
                  </div>
               </div>
             ))}
           </div>

           <div className="pt-4 border-t border-white/5">
              <div className="flex justify-between items-center mb-3">
                <label className="form-label font-bold text-rose-400 uppercase text-[10px]">E. Thiết bị mạng & Firewall</label>
                <button type="button" onClick={() => tbMangFields.append({ loai_thiet_bi: "", hang_san_xuat: "", model: "", so_serial: "", vi_tri: "", nam_mua: "", ghi_chu: "" })} className="bg-rose-500/20 text-rose-400 p-1 rounded-lg"><Plus className="w-4 h-4" /></button>
              </div>
              <div className="bg-white/5 p-3 rounded-lg border border-white/5 mb-3">
                 <label className="form-label text-[10px] text-rose-400 uppercase font-bold">Hình thức Firewall (E2)</label>
                 <select {...register("E2_firewall_type")} className="form-input h-11 text-xs">
                   <option value="Có (phần cứng chuyên dụng)">Có (phần cứng chuyên dụng)</option>
                   <option value="Dùng Firewall tích hợp">Dùng Firewall tích hợp</option>
                   <option value="Dùng phần mềm Firewall">Dùng phần mềm Firewall</option>
                 </select>
              </div>
              {tbMangFields.fields.map((field, idx) => (
                <div key={field.id} className="p-3 bg-white/5 rounded-lg mb-2 border border-white/5 shadow-md">
                   <div className="flex justify-between mb-2"><span className="text-[9px] text-gray-500 font-bold uppercase">Thiết bị #{idx+1}</span><button type="button" onClick={() => tbMangFields.remove(idx)} className="text-rose-400"><Trash2 className="w-3 h-3"/></button></div>
                   <input {...register(`thiet_bi_mang.${idx}.loai_thiet_bi`)} placeholder="Switch, AP, Firewall..." className="form-input text-xs h-11 mb-2" />
                   <div className="grid grid-cols-2 gap-2 mt-1">
                     <input {...register(`thiet_bi_mang.${idx}.hang_san_xuat`)} placeholder="Hãng sản xuất" className="form-input text-xs h-11" />
                     <input {...register(`thiet_bi_mang.${idx}.model`)} placeholder="Model" className="form-input text-xs h-11" />
                   </div>
                   <div className="grid grid-cols-2 gap-2 mt-2">
                     <input {...register(`thiet_bi_mang.${idx}.so_serial`)} placeholder="Số Serial (S/N)" className="form-input text-xs h-11" />
                     <input {...register(`thiet_bi_mang.${idx}.vi_tri`)} placeholder="Vị trí lắp đặt" className="form-input text-xs h-11" />
                   </div>
                   <div className="grid grid-cols-2 gap-2 mt-2">
                     <input {...register(`thiet_bi_mang.${idx}.nam_mua`)} placeholder="Năm mua" className="form-input text-xs h-11" />
                     <input {...register(`thiet_bi_mang.${idx}.ghi_chu`)} placeholder="Ghi chú" className="form-input text-xs h-11" />
                   </div>
                </div>
              ))}
           </div>

           <div className="pt-4 border-t border-white/5">
              <label className="form-label font-bold text-emerald-300 text-[10px] uppercase">F. Máy chủ & Đầu cuối</label>
              <div className="grid grid-cols-2 gap-2 mb-4">
                 <div className="flex flex-col gap-1">
                    <label className="text-[9px] text-gray-500 uppercase">SL Máy tính (F1)</label>
                    <div className="flex gap-1">
                       <input {...register("F1_pc_sl")} placeholder="PC" className="form-input h-11 text-xs text-center" type="number" />
                       <input {...register("F1_laptop_sl")} placeholder="Laptop" className="form-input h-11 text-xs text-center" type="number" />
                    </div>
                 </div>
                 <div className="flex flex-col gap-1">
                    <label className="text-[9px] text-gray-500 uppercase">HĐH (F1)</label>
                    <input {...register("F1_pc_os")} placeholder="Win 10, macOS..." className="form-input h-11 text-xs" />
                 </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-4">
                 <input {...register("F1_tablet_sl")} placeholder="Tablet" className="form-input h-11 text-xs text-center" type="number" />
                 <input {...register("F1_mayin_sl")} placeholder="Máy in" className="form-input h-11 text-xs text-center" type="number" />
                 <input {...register("F1_dienthoai_sl")} placeholder="SĐT vụ" className="form-input h-11 text-xs text-center" type="number" />
              </div>

              <div className="p-3 bg-white/5 rounded-lg border border-white/5 mb-4">
                 <div className="flex justify-between items-center mb-2">
                    <label className="text-[10px] text-emerald-300 font-bold uppercase">Máy chủ vật lý (F2)</label>
                    <select {...register("F2_khong_may_chu_has")} className="bg-black/40 border-none text-[9px] text-white rounded">
                       <option value="Không">Có máy chủ</option>
                       <option value="Có">Không có</option>
                    </select>
                 </div>
                 {formData.F2_khong_may_chu_has === "Có" && (
                    <input {...register("F2_luu_tru_o_dau")} placeholder="Dữ liệu lưu ở đâu?" className="form-input h-11 text-xs mb-2" />
                 )}
                 <div className="flex justify-between items-center mt-2 border-t border-white/5 pt-2">
                    <label className="text-[10px] text-sky-400 font-bold uppercase">Dịch vụ Cloud (F3)</label>
                    <select {...register("F3_cloud_has")} className="bg-black/40 border-none text-[9px] text-white rounded">
                       <option value="Không">Không dùng</option>
                       <option value="Có">Có dùng</option>
                    </select>
                 </div>
                 {formData.F3_cloud_has === "Có" && (
                    <input {...register("F3_ten_cloud")} placeholder="Tên dịch vụ/nhà cung cấp..." className="form-input h-11 text-xs mt-2" />
                 )}
              </div>

              <div className="flex justify-between items-center mb-3">
                <label className="text-[10px] text-emerald-300 font-bold">DANH SÁCH MÁY CHỦ CHI TIẾT</label>
                <button type="button" onClick={() => mayChuFields.append({ vai_tro: "", hang_model: "", so_serial: "", ram_gb: "", o_cung_tb: "", he_dieu_hanh: "", vi_tri: "" })} className="bg-emerald-500/20 text-emerald-400 p-1 rounded-lg"><Plus className="w-4 h-4" /></button>
              </div>
              {mayChuFields.fields.map((field, idx) => (
                 <div key={field.id} className="p-3 bg-black/40 rounded-lg mb-2 border border-white/5">
                    <div className="flex justify-between mb-2"><span className="text-[9px] text-gray-500 uppercase font-bold">Server #{idx+1}</span><button type="button" onClick={() => mayChuFields.remove(idx)} className="text-rose-400"><Trash2 className="w-3 h-3"/></button></div>
                    <input {...register(`may_chu.${idx}.vai_tro`)} placeholder="Vai trò (File server / Web / CSDL...)" className="form-input text-xs h-11 mb-2" />
                    <div className="grid grid-cols-2 gap-2 mb-2">
                       <input {...register(`may_chu.${idx}.hang_model`)} placeholder="Hãng / Model" className="form-input text-xs h-11" />
                       <input {...register(`may_chu.${idx}.so_serial`)} placeholder="Số serial (S/N)" className="form-input text-xs h-11" />
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                       <input {...register(`may_chu.${idx}.ram_gb`)} placeholder="RAM (GB)" className="form-input text-xs h-11" type="number" />
                       <input {...register(`may_chu.${idx}.o_cung_tb`)} placeholder="Ổ cứng (TB)" className="form-input text-xs h-11" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                       <input {...register(`may_chu.${idx}.he_dieu_hanh`)} placeholder="Hệ điều hành" className="form-input text-xs h-11" />
                       <input {...register(`may_chu.${idx}.vi_tri`)} placeholder="Vị trí (Tầng - Phòng)" className="form-input text-xs h-11" />
                    </div>
                 </div>
              ))}
            </div>
            
            <div className="pt-4 border-t border-white/5 space-y-4">
               <div className="flex justify-between items-center mb-3">
                  <label className="text-[10px] uppercase font-bold text-sky-400">G. Danh mục Camera (G1)</label>
                  <button type="button" onClick={() => cameraFields.append({ hang_san_xuat: "", model: "", so_serial: "", do_phan_giai: "", vi_tri: "", ghi_chu: "" })} className="bg-sky-500/20 text-sky-400 p-1.5 rounded-lg flex items-center gap-1">
                     <Plus className="w-4 h-4" /> <span className="text-[9px]">THÊM CAMERA</span>
                  </button>
               </div>

               {cameraFields.fields.map((field, idx) => (
                  <div key={field.id} className="p-3 bg-white/5 rounded-lg border border-white/5 shadow-md">
                     <div className="flex justify-between mb-2"><span className="text-[9px] text-gray-500 uppercase font-bold">Camera #{idx+1}</span><button type="button" onClick={() => cameraFields.remove(idx)} className="text-rose-400 p-1"><Trash2 className="w-3.5 h-3.5"/></button></div>
                     <div className="grid grid-cols-2 gap-2 mb-2">
                        <input {...register(`camera.${idx}.hang_san_xuat`)} placeholder="Hãng sản xuất (*)" className="form-input text-xs h-11" />
                        <input {...register(`camera.${idx}.model`)} placeholder="Model (*)" className="form-input text-xs h-11" />
                     </div>
                     <div className="grid grid-cols-2 gap-2 mb-2">
                        <input {...register(`camera.${idx}.so_serial`)} placeholder="Số Serial (S/N) (*)" className="form-input text-xs h-11" />
                        <input {...register(`camera.${idx}.do_phan_giai`)} placeholder="Độ phân giải" className="form-input text-xs h-11" />
                     </div>
                     <input {...register(`camera.${idx}.vi_tri`)} placeholder="Vị trí lắp đặt (*)" className="form-input text-xs h-11 mb-2" />
                     <input {...register(`camera.${idx}.ghi_chu`)} placeholder="Ghi chú (góc quay, ngoài trời...)" className="form-input text-xs h-11" />
                  </div>
               ))}

               <div className="pt-2 border-t border-white/5 mt-2 space-y-3">
                  <div className="p-3 bg-white/5 rounded border border-white/5">
                     <label className="form-label text-[10px] text-sky-400 font-bold uppercase mb-2 block">G2. Đầu ghi camera (NVR/DVR) (*)</label>
                     <input {...register("G2_dau_ghi_nvr")} placeholder="Hãng, model, số serial, vị trí..." className="form-input h-11 text-xs" />
                  </div>
                  <div className="p-3 bg-white/5 rounded border border-white/5">
                     <label className="form-label text-[10px] text-sky-400 font-bold uppercase mb-2 block">G3. Thời gian lưu trữ (Số ngày)</label>
                     <input {...register("G3_luu_tru_ngay")} placeholder="Số ngày lưu trữ thực tế (Vd: 30 ngày)" className="form-input h-11 text-xs" />
                  </div>
               </div>
            </div>

           <div className="pt-4 border-t border-white/5">
              <div className="flex justify-between items-center mb-2">
                 <label className="text-[10px] uppercase font-bold text-indigo-400">H. Quy hoạch địa chỉ IP (LAN)</label>
                 <button type="button" onClick={() => ipTinhFields.append({ ten_thiet_bi: "", dia_chi_ip: "", ghi_chu: "" })} className="bg-indigo-500/20 text-indigo-400 p-1 rounded-lg"><Plus className="w-4 h-4" /></button>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-3">
                 <div><label className="form-label text-[9px]">Dải IP LAN (H1)</label><input {...register("H1_dai_ip_lan")} placeholder="192.168.1.0/24" className="form-input h-11 text-xs" /></div>
                 <div><label className="form-label text-[9px]">Gateway (H2)</label><input {...register("H2_ip_gateway")} placeholder="192.168.1.1" className="form-input h-11 text-xs" /></div>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-3">
                 <div><label className="form-label text-[9px]">DNS Server (H3)</label><input {...register("H3_dns")} className="form-input h-11 text-xs" /></div>
                 <div>
                    <label className="form-label text-[9px]">Có VLAN? (H4)</label>
                    <div className="flex gap-1">
                       <select {...register("H4_co_vlan")} className="form-input h-11 text-xs flex-1">
                          <option value="Không">K</option><option value="Có">C</option>
                       </select>
                       {watch("H4_co_vlan") === "Có" && <input {...register("H4_so_vlan")} placeholder="SL" className="form-input h-11 text-xs w-12 text-center" />}
                    </div>
                 </div>
              </div>
              {watch("H4_co_vlan") === "Có" && (
                 <textarea {...register("H4_mo_ta_vlan")} placeholder="Mô tả VLAN..." className="form-input min-h-[60px] text-xs mb-3" />
              )}
              <label className="text-[9px] uppercase font-bold text-gray-500 mb-2 block">Dánh sách IP Tĩnh (H5)</label>
              {ipTinhFields.fields.map((field, idx) => (
                 <div key={field.id} className="p-3 bg-white/5 rounded-lg mb-2 border border-white/5 flex flex-col gap-2 shadow-md">
                     <div className="flex justify-between items-center"><span className="text-[9px] text-gray-500 uppercase font-bold">IP Tĩnh #{idx+1}</span><button type="button" onClick={() => ipTinhFields.remove(idx)} className="text-rose-400"><Trash2 className="w-3.5 h-3.5"/></button></div>
                     <div className="grid grid-cols-2 gap-2">
                        <input {...register(`ip_tinh.${idx}.ten_thiet_bi`)} placeholder="Tên thiết bị" className="form-input text-xs h-11" />
                        <input {...register(`ip_tinh.${idx}.dia_chi_ip`)} placeholder="Địa chỉ IP" className="form-input text-xs h-11" />
                     </div>
                     <input {...register(`ip_tinh.${idx}.ghi_chu`)} placeholder="Ghi chú" className="form-input text-xs h-11" />
                 </div>
              ))}
           </div>

            <div className="pt-4 border-t border-white/5 space-y-3">
               <h4 className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">T. Sơ đồ mạng & Kết nối vật lý</h4>
               <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                     <div className="p-3 bg-white/5 rounded border border-white/5 text-white">
                        <label className="text-[9px] text-gray-500 block uppercase">Có DMZ? (T1.1) (*)</label>
                        <select {...register("T1_1_co_dmz")} className="form-input h-11 text-xs bg-gray-800">
                           <option value="Không">Không</option><option value="Có">Có DMZ</option>
                        </select>
                        {watch("T1_1_co_dmz") === "Có" && <input {...register("T1_1_may_chu_dmz")} placeholder="Máy chủ trong DMZ..." className="form-input h-11 text-xs mt-2" />}
                     </div>
                     <div className="p-3 bg-white/5 rounded border border-white/5 text-white">
                        <label className="text-[9px] text-gray-500 block uppercase">Tách VLAN Camera? (T1.4) (*)</label>
                        <select {...register("T1_4_camera_vlan_has")} className="form-input h-11 text-xs bg-gray-800">
                           <option value="Có - VLAN tách biệt">Có tách VLAN</option>
                           <option value="Không - Dùng chung LAN">Dùng chung LAN</option>
                        </select>
                     </div>
                  </div>
                  <div className="p-3 bg-white/5 rounded border border-white/5 text-white">
                     <label className="text-[9px] text-gray-500 block uppercase mb-1">Mạng WiFi (T1.2 & T1.3) (*)</label>
                     <select {...register("T1_2_wifi_tach_rieng")} className="form-input h-11 text-xs bg-gray-800 mb-2">
                        <option value="Không có WiFi">K.có WiFi</option>
                        <option value="Có - VLAN/Subnet tách riêng">Có tách VLAN riêng</option>
                        <option value="Không - Dùng chung IP LAN">Dùng chung IP LAN</option>
                     </select>
                     {watch("T1_2_wifi_tach_rieng") !== "Không có WiFi" && (
                        <div className="grid grid-cols-2 gap-2">
                           <input {...register("T1_3_ssid")} placeholder="SSID (Tên WiFi)" className="form-input h-11 text-xs" />
                           <input {...register("T1_3_bao_mat_wifi")} placeholder="Bảo mật (WPA2...)" className="form-input h-11 text-xs" />
                        </div>
                     )}
                  </div>
                  
                  <div className="p-3 bg-indigo-500/5 rounded border border-indigo-500/10">
                     <div className="flex justify-between items-center mb-2">
                        <label className="text-[10px] uppercase font-bold text-indigo-400">T2. KẾT NỐI VẬT LÝ SWITCH (PORT MAPPING)</label>
                        <button type="button" onClick={() => portMappingFields.append({ ten_switch: "", so_cong: "", port_map: "", ghi_chu: "" })} className="bg-indigo-500/20 text-indigo-400 p-1 rounded-lg"><Plus className="w-4 h-4" /></button>
                     </div>
                     {portMappingFields.fields.map((field, idx) => (
                        <div key={field.id} className="p-3 bg-white/5 rounded-lg mb-2 border border-white/5 shadow-md">
                           <div className="flex justify-between mb-2">
                              <span className="text-[9px] text-gray-500 font-bold uppercase">Switch #{idx+1}</span>
                              <button type="button" onClick={() => portMappingFields.remove(idx)} className="text-rose-400"><Trash2 className="w-3.5 h-3.5"/></button>
                           </div>
                           <div className="grid grid-cols-3 gap-2 mb-2">
                              <input {...register(`T2_port_mapping.${idx}.ten_switch`)} placeholder="Tên Switch" className="form-input text-xs h-11 col-span-2" />
                              <input {...register(`T2_port_mapping.${idx}.so_cong`)} placeholder="SL Cổng" className="form-input text-xs h-11 text-center" />
                           </div>
                           <textarea {...register(`T2_port_mapping.${idx}.port_map`)} placeholder="Mô tả cổng (Vd: Port 1->Modem, Port 2->Server...)" className="form-input min-h-[60px] text-xs" />
                        </div>
                     ))}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                     <div className="p-3 bg-white/5 rounded border border-white/5 text-white">
                        <label className="text-[9px] text-gray-500 block uppercase">Tủ Rack? (T3.1)</label>
                        <div className="flex gap-1">
                           <select {...register("T3_1_co_rack")} className="form-input h-11 text-xs bg-gray-800 flex-1">
                              <option value="Không">K</option><option value="Có">Có</option>
                           </select>
                           {watch("T3_1_co_rack") === "Có" && <input {...register("T3_1_rack_u")} placeholder="U" className="form-input h-11 text-xs w-10 text-center" />}
                        </div>
                     </div>
                     <div className="p-3 bg-white/5 rounded border border-white/5 text-white">
                        <label className="text-[9px] text-gray-500 block uppercase">Loại cáp (T4.1)</label>
                        <select {...register("T4_1_loai_cap")} className="form-input h-11 text-xs bg-gray-800">
                           <option value="Cáp đồng (Cat5e/Cat6)">Cáp đồng</option>
                           <option value="Cáp quang">Cáp quang</option>
                        </select>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      )}

      <AccordionHeader id="bao_mat" label="III. An toàn Bảo mật" icon={ShieldAlert} />
      {expandedSection === "bao_mat" && (
        <div className="p-4 bg-black/40 rounded-xl mb-4 space-y-6 border border-white/5 shadow-inner">
           <div className="space-y-3">
              <h4 className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">K. Danh mục hồ sơ hiện có</h4>
              <div className="grid grid-cols-1 gap-2">
                {[
                   {id: "k1_quy_che", label: "K1. Quy chế ATTT"},
                   {id: "k2_ke_hoach_ht", label: "K2. Kế hoạch ATTT năm HT"},
                   {id: "k3_ke_hoach_tr", label: "K3. Kế hoạch ATTT năm trước"},
                   {id: "k4_qd_can_bo", label: "K4. QĐ phân công cán bộ"},
                   {id: "K5_qd_phe_duyet_httt", label: "K5. QĐ phê duyệt cấp độ"},
                   {id: "K6_ung_pho_su_co", label: "K6. Quy trình ứng phó sự cố"},
                   {id: "K7_bien_ban_kiem_tra", label: "K7. Biên bản kiểm tra ATTT"}
                ].map(k => (
                  <div key={k.id} className="p-3 bg-white/5 rounded border border-white/5">
                     <label className="text-[9px] text-gray-400 block mb-1 uppercase">{k.label}</label>
                     <input {...register(k.id as any)} className="form-input h-11 text-xs" placeholder="Số/ngày ban hành..." />
                  </div>
                ))}
              </div>
           </div>
           
           <div className="pt-4 border-t border-white/5 space-y-4">
               <h4 className="text-[10px] uppercase font-bold text-violet-400 tracking-wider">L. Kiểm soát truy cập & Giám sát</h4>
               <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 bg-white/5 rounded border border-white/5">
                     <label className="form-label text-[10px]">Kiểm soát vật lý (L1)</label>
                     <select {...register("l1_phys_key")} className="form-input h-11 text-xs bg-gray-900 text-white">
                        <option value="Có khóa cửa (chìa khóa thường)">Có khóa cửa (chìa khóa thường)</option>
                        <option value="Có khóa cửa + camera giám sát">Có khóa cửa + camera giám sát</option>
                        <option value="Có thẻ từ / kiểm soát điện tử">Có thẻ từ / kiểm soát điện tử</option>
                        <option value="Không có kiểm soát riêng">Không có kiểm soát riêng</option>
                     </select>
                  </div>
                  <div className="p-3 bg-white/5 rounded border border-white/5">
                     <label className="form-label text-[10px]">Bảng ký tên? (L1.ii)</label>
                     <div className="flex gap-4 items-center h-11 text-white">
                        <label className="flex items-center gap-1"><input type="radio" {...register("L1_bang_ky_ten")} value="Có" /> Có</label>
                        <label className="flex items-center gap-1"><input type="radio" {...register("L1_bang_ky_ten")} value="Không" /> Không</label>
                     </div>
                  </div>
               </div>

               <div className="p-3 bg-white/5 rounded border border-white/5">
                  <label className="form-label text-[10px]">Chính sách mật khẩu (L2)</label>
                  <select {...register("l2_pass_policy")} className="form-input h-11 text-xs mb-2 bg-gray-800 text-white">
                     <option value="Đã ban hành và áp dụng">Đã ban hành và áp dụng</option>
                     <option value="Có chính sách mật khẩu (chưa văn bản)">Có chính sách mật khẩu (chưa văn bản)</option>
                     <option value="Không có chính sách thống nhất">Không có chính sách thống nhất</option>
                  </select>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                     <div>
                        <label className="text-[9px] text-gray-500 uppercase block mb-1">Độ dài tối thiểu</label>
                        <input {...register("l2_pass_len")} className="form-input h-11 text-xs" type="number" />
                     </div>
                     <div>
                        <label className="text-[9px] text-gray-500 uppercase block mb-1">Thay đổi định kỳ (tháng)</label>
                        <input {...register("l2_pass_time")} className="form-input h-11 text-xs" type="number" />
                     </div>
                  </div>
               </div>

               <div className="p-3 bg-white/5 rounded border border-white/5">
                  <div className="flex justify-between items-center mb-2">
                     <label className="form-label text-[10px] mb-0">Công cụ diệt Virus (L3)</label>
                     <select {...register("l3_av_has")} className="bg-black/40 border-none text-[9px] text-white rounded">
                        <option value="Có cài đặt">Có cài đặt</option>
                        <option value="Không">Không</option>
                     </select>
                  </div>
                  {watch("l3_av_has") !== "Không" && (
                     <div className="space-y-2">
                        <input {...register("l3_av_name")} placeholder="Tên phần mềm..." className="form-input h-11 text-xs" />
                        <div className="grid grid-cols-2 gap-2">
                           <select {...register("l3_av_license")} className="form-input h-11 text-xs bg-gray-800 text-white">
                              <option value="Còn hạn">Còn hạn</option>
                              <option value="Hết hạn">Hết hạn</option>
                              <option value="Không bản quyền">K.bản quyền</option>
                           </select>
                           <select {...register("L3_cap_nhat_virus")} className="form-input h-11 text-xs bg-gray-800 text-white">
                              <option value="Tự động">Cập nhật tự động</option>
                              <option value="Thủ công">Cập nhật thủ công</option>
                           </select>
                        </div>
                     </div>
                  )}
               </div>

               <div className="p-3 bg-white/5 rounded border border-white/5">
                  <label className="form-label text-[10px]">Sao lưu dữ liệu (L4)</label>
                  <select {...register("l4_bak_has")} className="form-input h-11 text-xs mb-2 bg-gray-800 text-white">
                     <option value="Có - Thủ công (USB/Ổ cứng)">Có - Thủ công (USB/Ổ cứng)</option>
                     <option value="Có - Tự động (Server/Cloud)">Có - Tự động (Server/Cloud)</option>
                     <option value="Không sao lưu">Không sao lưu</option>
                  </select>
                  <input {...register("L4_luu_o_dau")} placeholder="Tên thiết bị lưu trữ (Vd: Ổ cứng ngoài)" className="form-input h-11 text-xs mb-2" />
                  <div className="flex items-center gap-4 p-1">
                     <span className="text-[9px] text-gray-400 uppercase font-bold text-white">Sao lưu Offsite?</span>
                     <label className="flex items-center gap-2 text-xs text-white"><input type="radio" {...register("L4_offsite_has")} value="Có" /> Có</label>
                     <label className="flex items-center gap-2 text-xs text-white"><input type="radio" {...register("L4_offsite_has")} value="Không" /> Không</label>
                  </div>
               </div>

               <div className="p-3 bg-white/5 rounded border border-white/5 text-white">
                  <div className="flex justify-between items-center mb-2">
                     <label className="form-label text-[10px] mb-0">Nhật ký hệ thống (Logs) (L5)</label>
                     <select {...register("l5_log_enabled")} className="bg-black/40 border-none text-[9px] rounded">
                        <option value="Có">Có lưu</option>
                        <option value="Không">Không</option>
                     </select>
                  </div>
                  {watch("l5_log_enabled") === "Có" && (
                     <div className="grid grid-cols-2 gap-2">
                        <input {...register("l5_log_retention")} placeholder="Thời gian lưu (tháng)" className="form-input h-11 text-xs" />
                        <select {...register("l5_siem_has")} className="form-input h-11 text-xs bg-gray-800">
                           <option value="Không">K.có SIEM</option><option value="Có">Dùng SIEM</option>
                        </select>
                     </div>
                  )}
               </div>

               <div className="p-3 bg-white/5 rounded border border-white/5 text-white">
                  <label className="form-label text-[10px]">Sự cố ATTT trong 1 năm qua (L6)</label>
                  <select {...register("l6_incident_has")} className="form-input h-11 text-xs mb-2 bg-gray-800">
                     <option value="Không có sự cố nào">Không có sự cố nào</option>
                     <option value="Có sự cố (đã xử lý)">Có sự cố (đã xử lý)</option>
                     <option value="Có sự cố (chưa xử lý xong)">Có sự cố (chưa xử lý xong)</option>
                  </select>
                  {watch("l6_incident_has") !== "Không có sự cố nào" && (
                     <textarea {...register("l6_incident_desc")} placeholder="Mô tả sự cố và cách khắc phục..." className="form-input min-h-[60px] text-xs" />
                  )}
               </div>

               <div className="grid grid-cols-1 gap-2">
                  <div className="p-3 bg-white/5 rounded border border-white/5 text-white">
                     <label className="form-label text-[10px]">Tường lửa (Firewall) (L7)</label>
                     <select {...register("l7_type")} className="form-input h-11 text-xs mb-2 bg-gray-800">
                        <option value="Cứng chuyên dụng">Cứng chuyên dụng</option>
                        <option value="Tích hợp trên Router">Tích hợp trên Router</option>
                        <option value="Phần mềm">Phần mềm</option>
                        <option value="Không có">Không có</option>
                     </select>
                     <div className="grid grid-cols-2 gap-2">
                        <input {...register("L7_chinh_sach")} placeholder="Chính sách (Vd: Deny all)" className="form-input h-11 text-xs" />
                        <input {...register("L7_4_cong_mo")} placeholder="Các cổng mở..." className="form-input h-11 text-xs" />
                     </div>
                  </div>
                  
                  <div className="p-3 bg-white/5 rounded border border-white/10">
                     <label className="text-[10px] uppercase font-bold text-gray-400 block mb-3 border-b border-white/5 pb-1">Hạ tầng phòng máy (L8)</label>
                     <div className="space-y-3">
                        <div className="bg-black/20 p-2 rounded">
                           <label className="text-[9px] text-gray-500 uppercase block mb-1">Bộ lưu điện (UPS) (L8.1)</label>
                           <div className="grid grid-cols-3 gap-2 text-white">
                              <input {...register("L8_1_ups_hang_model")} placeholder="Hãng/Model" className="form-input h-11 text-xs col-span-2" />
                              <input {...register("L8_1_ups_thoi_gian_phut")} placeholder="Phút" className="form-input h-11 text-xs text-center" />
                           </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-white">
                           <div className="bg-black/20 p-2 rounded">
                              <label className="text-[9px] text-gray-500 uppercase block mb-1">Điều hòa (L8.2)</label>
                              <select {...register("L8_2_dieu_hoa")} className="form-input h-11 text-xs bg-gray-800"><option value="Có">Có</option><option value="Không">Không</option></select>
                           </div>
                           <div className="bg-black/20 p-2 rounded">
                              <label className="text-[9px] text-gray-500 uppercase block mb-1">PCCC (L8.3)</label>
                              <select {...register("L8_3_bin_chua_chay_has")} className="form-input h-11 text-xs"><option value="Có">Có</option><option value="Không">Không</option></select>
                           </div>
                        </div>
                        <textarea {...register("L8_4_mo_ta_phong")} placeholder="Mô tả hiện trạng phòng máy (L8.4)..." className="form-input min-h-[60px] text-xs" />
                     </div>
                  </div>
               </div>
            </div>

            <div className="pt-4 border-t border-white/5 space-y-4">
               <h4 className="text-[10px] uppercase font-bold text-violet-400 tracking-wider">P. Bảo mật kết nối & Mã hóa</h4>
               <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 bg-white/5 rounded border border-white/5 text-white">
                     <label className="text-[9px] text-gray-500 uppercase block mb-1">Giao thức Web (P1)</label>
                     <select {...register("p1_protocol")} className="form-input h-11 text-xs bg-gray-800">
                        <option value="HTTPS (có mã hóa)">HTTPS (có mã hóa)</option>
                        <option value="HTTP (không mã hóa)">HTTP (không mã hóa)</option>
                     </select>
                  </div>
                  <div className="p-3 bg-white/5 rounded border border-white/5 text-white">
                     <label className="text-[9px] text-gray-500 uppercase block mb-1">Kết nối cấp trên (P3)</label>
                     <select {...register("P3_ket_noi_cap_tren_type")} className="form-input h-11 text-xs bg-gray-800">
                        <option value="Có - Qua Internet (HTTPS)">Có - Qua Internet (HTTPS)</option>
                        <option value="Có - Mạng truyền số liệu CD">Có - Mạng truyền số liệu CD</option>
                        <option value="Có - VPN">Có - VPN</option>
                        <option value="Không kết nối">Không kết nối</option>
                     </select>
                  </div>
               </div>
               <div className="p-3 bg-white/5 rounded border border-white/5 text-white">
                  <label className="text-[9px] text-gray-500 uppercase block mb-1">VPN kết nối từ xa? (P2.i)</label>
                  <select {...register("p2_vpn")} className="form-input h-11 text-xs bg-gray-800">
                     <option value="Không sử dụng">Không sử dụng</option>
                     <option value="SSL VPN">SSL VPN</option>
                     <option value="IPsec VPN">IPsec VPN</option>
                     <option value="OpenVPN">OpenVPN</option>
                     <option value="Khác">Khác</option>
                  </select>
               </div>
               <div className="grid grid-cols-2 gap-2 text-white">
                  <div className="p-3 bg-white/5 rounded border border-white/5">
                     <label className="text-[9px] text-gray-500 uppercase block mb-1">Mã hóa lưu trữ? (P4.i)</label>
                     <div className="flex gap-4 items-center h-11">
                        <label className="flex items-center gap-2"><input type="radio" {...register("P4_ma_hoa_luu_tru_has")} value="Có" /> Có</label>
                        <label className="flex items-center gap-2"><input type="radio" {...register("P4_ma_hoa_luu_tru_has")} value="Không" /> Không</label>
                     </div>
                  </div>
                  <div className="p-3 bg-white/5 rounded border border-white/5">
                     <label className="text-[9px] text-gray-500 uppercase block mb-1">Antispam/Email Sec (P5)</label>
                     <div className="flex gap-4 items-center h-11">
                        <label className="flex items-center gap-2"><input type="radio" {...register("P5_email_sec")} value="Có" /> Có</label>
                        <label className="flex items-center gap-2"><input type="radio" {...register("P5_email_sec")} value="Không" /> Không</label>
                     </div>
                  </div>
               </div>
            </div>

            <div className="pt-4 border-t border-white/5 space-y-4">
               <h4 className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">Q. Vận hành & Giám sát</h4>
               <div className="grid grid-cols-2 gap-2 text-white">
                  <div className="p-3 bg-white/5 rounded border border-white/5">
                     <label className="text-[9px] text-gray-500 uppercase block mb-1">Update HĐH (Q1)</label>
                     <select {...register("cap_nhat_he_dieu_hanh")} className="form-input h-11 text-xs bg-gray-800">
                        <option value="Hàng tháng">Hàng tháng</option>
                        <option value="Thủ công">Thủ công</option>
                        <option value="Không">Không</option>
                     </select>
                  </div>
                  <div className="p-3 bg-white/5 rounded border border-white/5">
                     <label className="text-[9px] text-gray-500 uppercase block mb-1">Update App (Q2)</label>
                     <select {...register("Q2_cap_nhat_ung_dung")} className="form-input h-11 text-xs bg-gray-800">
                        <option value="Tự động">Tự động</option>
                        <option value="Không">Không</option>
                     </select>
                  </div>
               </div>
               <div className="p-3 bg-white/5 rounded border border-white/5 text-white">
                  <label className="text-[9px] text-gray-500 uppercase block mb-1">Người vận hành (Q3) (*)</label>
                  <input {...register("Q3_nguoi_chiu_trach_nhiem")} placeholder="Tên cán bộ phụ trách..." className="form-input h-11 text-xs" />
               </div>
               <div className="grid grid-cols-2 gap-2 text-white">
                  <div className="p-3 bg-white/5 rounded border border-white/5">
                     <label className="text-[9px] text-gray-500 uppercase block mb-1">Firmware (Q4)</label>
                     <select {...register("Q4_firmware_mang")} className="form-input h-11 text-xs bg-gray-800">
                        <option value="Đã cập nhật">Đã cập nhật</option>
                        <option value="Chưa cập nhật">Chưa cập nhật</option>
                     </select>
                  </div>
                  <div className="p-3 bg-white/5 rounded border border-white/5">
                     <label className="text-[9px] text-gray-500 uppercase block mb-1">Cảnh báo (Q5)</label>
                     <select {...register("Q5_theo_doi_canh_bao")} className="form-input h-11 text-xs bg-gray-800">
                        <option value="Có">Có theo dõi</option>
                        <option value="Không">Không</option>
                     </select>
                  </div>
               </div>
            </div>
         </div>
      )}

      <AccordionHeader id="dao_tao" label="IV. Đào tạo & Kiểm tra" icon={Shield} />
      {expandedSection === "dao_tao" && (
        <div className="p-4 bg-black/40 rounded-xl mb-4 space-y-6 border border-white/5 shadow-inner text-white">
           <div className="space-y-4">
              <div className="flex justify-between items-center">
                 <label className="text-[10px] uppercase font-bold text-amber-400">R. Đào tạo ATTT</label>
                 <button type="button" onClick={() => daoTaoFields.append({ noi_dung: "", doi_tuong: "", thoi_gian: "", don_vi_chu_tri: "" })} className="bg-amber-500/20 text-amber-500 p-1 rounded-lg"><Plus className="w-4 h-4" /></button>
              </div>
              {daoTaoFields.fields.map((field, idx) => (
                <div key={field.id} className="p-3 bg-white/5 rounded-lg mb-2 border border-white/5 shadow-md">
                   <div className="flex justify-between mb-2"><span className="text-[9px] text-gray-500 uppercase font-bold">Khóa #{idx+1}</span><button type="button" onClick={() => daoTaoFields.remove(idx)} className="text-rose-400"><Trash2 className="w-3 h-3"/></button></div>
                   <input {...register(`dao_tao.${idx}.noi_dung`)} placeholder="Nội dung đào tạo" className="form-input text-xs h-11 mb-2" />
                   <div className="grid grid-cols-2 gap-2">
                      <input {...register(`dao_tao.${idx}.doi_tuong`)} placeholder="Đối tượng" className="form-input text-xs h-11" />
                      <input {...register(`dao_tao.${idx}.thoi_gian`)} placeholder="Thời gian (năm)" className="form-input text-xs h-11" />
                   </div>
                </div>
              ))}
           </div>
           <div className="pt-4 border-t border-white/5 space-y-4">
              <div className="flex justify-between items-center">
                 <label className="text-[10px] uppercase font-bold text-sky-400">S. Kiểm tra & Đánh giá</label>
                 <button type="button" onClick={() => kiemTraFields.append({ hinh_thuc: "", noi_dung: "", ket_qua: "", ngay_kiem_tra: "" })} className="bg-sky-500/20 text-sky-500 p-1 rounded-lg"><Plus className="w-4 h-4" /></button>
              </div>
              <div className="p-3 bg-white/5 rounded border border-white/5 mb-3">
                  <label className="text-[9px] text-gray-500 uppercase block mb-1">Kết quả đánh giá ATTT gần nhất (S2)</label>
                  <select {...register("S2_danh_gia_last")} className="form-input h-11 text-xs bg-gray-800">
                     <option value="Chưa đánh giá">Chưa đánh giá</option>
                     <option value="Đạt yêu cầu">Đạt yêu cầu</option>
                     <option value="Đạt yêu cầu nhưng cần khắc phục">Đạt yêu cầu nhưng cần khắc phục</option>
                     <option value="Không đạt yêu cầu">Không đạt yêu cầu</option>
                  </select>
               </div>
              {kiemTraFields.fields.map((field, idx) => (
                <div key={field.id} className="p-3 bg-white/5 rounded-lg mb-2 border border-white/5 shadow-md">
                   <div className="flex justify-between mb-2"><span className="text-[9px] text-gray-500 uppercase font-bold">Lượt #{idx+1}</span><button type="button" onClick={() => kiemTraFields.remove(idx)} className="text-rose-400"><Trash2 className="w-3 h-3"/></button></div>
                   <input {...register(`kiem_tra_attt.${idx}.hinh_thuc`)} placeholder="Hình thức (Tự kiểm tra...)" className="form-input text-xs h-11 mb-2" />
                   <input {...register(`kiem_tra_attt.${idx}.noi_dung`)} placeholder="Nội dung kiểm tra" className="form-input text-xs h-11 mb-2" />
                   <div className="grid grid-cols-2 gap-2">
                      <input {...register(`kiem_tra_attt.${idx}.ket_qua`)} placeholder="Kết quả" className="form-input text-xs h-11" />
                      <input {...register(`kiem_tra_attt.${idx}.ngay_kiem_tra`)} type="date" className="form-input text-xs h-11" />
                   </div>
                </div>
              ))}
           </div>
        </div>
      )}

      <AccordionHeader id="xac_nhan" label="V. Xác nhận & Hình ảnh" icon={FileText} />
      {expandedSection === "xac_nhan" && (
        <div className="p-4 bg-black/40 rounded-xl mb-4 space-y-6 border border-white/5 shadow-inner">
           <div className="grid grid-cols-2 gap-1.5 mb-4">
              {[
                 "D1. Modem/Router", "D2. Switch/Rack", "F2. Máy chủ vật lý", "F1. Máy tính/Laptop",
                 "G1-G2. Camera/NVR", "E2. Firewall cứng", "T3. Tủ Rack/Phòng máy", "E1. Tem nhãn thiết bị",
                 "H5. Bảng IP Tĩnh", "L3. Antivirus", "L4. Sao lưu dữ liệu", "L8. PCCC/UPS",
                 "T1. Sơ đồ mạng dán tường", "N. Ký xác nhận"
              ].map((label, i) => (
                 <label key={i} className="flex items-center gap-3 p-2 bg-black/20 rounded border border-white/5">
                    <input type="checkbox" {...register(`M${i+1}_status` as any)} className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-indigo-500" />
                    <span className="text-[9px] text-gray-300 truncate uppercase">{label}</span>
                 </label>
              ))}
           </div>
           <div className="pt-4 border-t border-white/5 space-y-4">
             <div className="p-3 bg-white/5 rounded border border-white/10">
               <h3 className="text-[10px] uppercase font-bold text-indigo-400 mb-3">N. Xác nhận Hồ sơ</h3>
               <div className="space-y-3">
                  <div className="p-2 bg-black/20 rounded border border-white/5">
                     <label className="text-[9px] text-gray-500 uppercase block mb-1">Người trực tiếp khảo sát</label>
                     <input {...register("n_nguoi_lap")} className="form-input text-xs h-11" placeholder="Họ và tên" />
                  </div>
                  <div className="p-2 bg-black/20 rounded border border-white/5">
                     <label className="text-[9px] text-gray-500 uppercase block mb-1">Cán bộ kiểm tra (phía đơn vị)</label>
                     <div className="grid grid-cols-2 gap-2">
                        <input {...register("N_nguoi_kiem_tra_ho_ten")} className="form-input text-xs h-11" placeholder="Họ tên" />
                        <input {...register("N_nguoi_kiem_tra_chuc_vu")} className="form-input text-xs h-11" placeholder="Chức vụ" />
                     </div>
                  </div>
                  <div className="p-2 bg-black/20 rounded border border-white/5">
                     <label className="text-[9px] text-gray-500 uppercase block mb-1">Thủ trưởng đơn vị (Ký đóng dấu)</label>
                     <div className="grid grid-cols-2 gap-2">
                        <input {...register("N_thu_truong_ho_ten")} className="form-input text-xs h-11" placeholder="Họ tên" />
                        <input {...register("N_thu_truong_chuc_vu")} className="form-input text-xs h-11" placeholder="Chức vụ" />
                     </div>
                  </div>
               </div>
             </div>
             <div className="p-3 bg-white/5 rounded border border-white/10">
               <h4 className="text-[10px] uppercase font-bold text-emerald-400 mb-3">BC. Metadata Báo cáo</h4>
               <div className="grid grid-cols-2 gap-2 mb-2">
                  <input {...register("BC_so_bao_cao")} placeholder="Số báo cáo" className="form-input text-xs h-11" />
                  <input {...register("BC_ngay_bao_cao")} placeholder="Ngày báo cáo" type="date" className="form-input text-xs h-11" />
               </div>
               <input {...register("BC_don_vi_thuc_hien")} placeholder="Đơn vị lập báo cáo (Công ty...)" className="form-input text-xs h-11 mb-2" />
               <input {...register("BC_ten_tinh")} placeholder="Tên tỉnh (Ninh Bình...)" className="form-input text-xs h-11" />
             </div>
             <div className="pt-2">
                <label className="form-label text-white font-bold text-[10px] uppercase">Ghi chú hiện trường</label>
                <textarea {...register("ghi_chu")} className="form-input min-h-[100px] text-xs" placeholder="..." />
             </div>
           </div>
           <button type="submit" disabled={isSaving} className={`w-full h-14 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 uppercase tracking-widest active:scale-95 transition-transform ${isSaving ? 'opacity-70 grayscale' : ''}`}>
             {isSaving ? (
               <>
                 <Loader2 className="w-6 h-6 animate-spin" /> Đang lưu hồ sơ...
               </>
              ) : (
                <>
                  <Save className="w-6 h-6" /> Lưu tạm thời (Draft)
                </>
              )}
            </button>

            <button 
              type="button" 
              onClick={handleComplete}
              disabled={isSaving || isCompleting}
              className={`w-full h-14 mt-3 bg-gradient-to-r from-amber-500 to-rose-500 rounded-xl text-white font-bold flex flex-col items-center justify-center shadow-lg shadow-rose-500/20 uppercase tracking-widest active:scale-95 transition-all ${isCompleting ? 'opacity-70' : ''}`}
            >
              {isCompleting ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <div className="flex items-center gap-2">
                     <CheckCircle2 className="w-5 h-5" /> 
                     <span>Xác nhận Hoàn thành</span>
                  </div>
                  <span className="text-[8px] opacity-70 normal-case font-normal mt-0.5">Chuyển sang trạng thái chính thức</span>
                </>
              )}
            </button>
        </div>
      )}

      {/* BOTTOM ACTION BAR (Floating) */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-md border-t border-white/10 p-3 z-50 flex gap-2 shadow-2xl">
         <button type="button" onClick={() => handleExport("phieu")} className="flex-1 h-11 bg-indigo-500/20 text-indigo-400 rounded-lg text-[10px] font-bold uppercase border border-indigo-500/30">Phiếu</button>
         <button type="button" onClick={() => handleExport("hsdx")} className="flex-1 h-11 bg-purple-500/20 text-purple-400 rounded-lg text-[10px] font-bold uppercase border border-purple-500/30">HSDX</button>
         <button type="button" onClick={() => handleExport("baocao")} className="flex-1 h-11 bg-blue-500/20 text-blue-400 rounded-lg text-[10px] font-bold uppercase border border-blue-500/30">Báo cáo</button>
         <button type="button" onClick={() => setShowNetworkModal(true)} className="w-12 h-11 bg-gray-800 rounded-lg flex items-center justify-center"><Network className="w-5 h-5 text-indigo-400" /></button>
      </div>

       {showNetworkModal && (
         <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex flex-col">
           <div className="p-4 flex justify-between items-center border-b border-white/10 bg-gray-900">
             <h2 className="font-bold text-sm uppercase flex items-center gap-2"><Network className="w-5 h-5 text-indigo-400"/> Sơ đồ Topology</h2>
             <button type="button" onClick={() => setShowNetworkModal(false)} className="p-2 bg-white/10 rounded-lg"><X className="w-5 h-5" /></button>
           </div>
           <div className="flex-1 overflow-auto p-4 flex items-start justify-center">
              <NetworkDiagram data={formData} />
           </div>
         </div>
       )}

       {showValidationModal && (
         <div className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
           <div className="bg-gray-900 border border-white/10 rounded-xl w-full p-6 max-w-sm text-center">
             <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
             <h2 className="text-xl font-bold mb-2">Thiếu thông tin</h2>
             <p className="text-xs text-gray-400 mb-6 uppercase tracking-wider">Vui lòng điền đủ Tên cơ quan và Tên hệ thống (HTTT)</p>
             <button type="button" onClick={() => setShowValidationModal(false)} className="w-full h-12 bg-indigo-600 rounded-lg font-bold uppercase">Đóng</button>
           </div>
         </div>
       )}
    </form>
    </>
  );
}
