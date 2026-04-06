"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import NetworkDiagram from "./NetworkDiagram";
import { 
  Building, Globe, Server, Save, FileDown, Plus, Trash2, 
  Router, Video, MonitorPlay, ShieldAlert, Users, StickyNote,
  FileCheck, Shield, GraduationCap, LayoutPanelLeft, FileText,
  ChevronDown, ChevronUp, Network, X, CheckCircle2, AlertTriangle, AlertCircle, XCircle
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

  const defaultVals = prefilledData || {
    // Internal
    nguoi_thuc_hien: "",
    ngay_khao_sat: new Date().toISOString().split('T')[0],
    
    // Tab 1: Đơn vị & Nhân sự (Mục A, B, C)
    ten_don_vi: "", dia_chi: "", nguoi_dung_dau: "", so_dien_thoai: "", email: "", 
    A6_chuc_vu_thu_truong: "", A7_so_quyet_dinh: "",
    he_thong_thong_tin: "", C1_mo_ta_chuc_nang: "", C2_doi_tuong_nguoi_dung: "", C3_loai_du_lieu: "",
    C4_du_lieu_type: "Không xác định", C5_noi_bo: "", C5_ben_ngoai: "", C6_nam_hoat_dong: "",
    C7_ket_noi_cap_tren_has: "Không", C7_ten_he_thong_cap_tren: "",
    C8_bi_mat_nha_nuoc_has: "Không", C8_do_mat: "",
    can_bo_phu_trach: [],
    
    // Tab 2: Hạ tầng & Mạng (Mục D, E, F, G, H, T)
    ket_noi_internet: [], D2_router_modem: "", D3_ip_lan_gateway: "",
    thiet_bi_mang: [], E2_firewall_type: "Dùng Firewall tích hợp",
    F1_pc_sl: "", F1_pc_os: "Windows 10/11", F1_laptop_sl: "", F1_laptop_os: "Windows 10/11",
    F1_tablet_sl: "", F1_mayin_sl: "", F1_dienthoai_sl: "",
    F2_khong_may_chu_has: "Không", F2_luu_tru_o_dau: "",
    may_chu: [], F3_cloud_has: "Không", F3_ten_cloud: "",
    camera: [], G2_dau_ghi_nvr: "", G3_luu_tru_ngay: "",
    H1_dai_ip_lan: "", H2_ip_gateway: "", H3_dns: "", H4_co_vlan: "Không", H4_so_vlan: "", H4_mo_ta_vlan: "",
    ip_tinh: [],
    T1_1_co_dmz: "Không", T1_1_may_chu_dmz: "", 
    T1_2_wifi_tach_rieng: "Không có WiFi", T1_3_ssid: "", T1_3_bao_mat_wifi: "",
    T1_4_camera_vlan_has: "Cùng mạng LAN",
    T3_1_co_rack: "Không", T3_1_rack_u: "", T3_1_rack_vi_tri: "", T3_2_thiet_bi_trong_tu: "",
    T4_1_loai_cap: "Cáp đồng (Cat5e/Cat6)", T4_2_cap_isp: "",
    T5_vi_tri: [],
    
    // Tab 3: Dịch vụ & Ứng dụng (Mục I, P)
    ung_dung: [],
    p1_protocol: "HTTP (không mã hóa)",
    p2_vpn: "Không có VPN", p2_vpn_type: "",
    P3_ket_noi_cap_tren_type: "Không kết nối", P3_1_ten_he_thong_va_phuong_thuc: "",
    P4_ma_hoa_luu_tru_has: "Không", P4_phuong_phap: "",
    P5_email_sec: "Không",
    
    // Tab 4: An toàn Bảo mật (Mục L, Q, K)
    l1_phys_key: "Không có kiểm soát riêng", L1_bang_ky_ten: "Không",
    l2_pass_policy: "Không có chính sách thống nhất", l2_pass_len: "", l2_pass_time: "",
    L2_admin_acc_type: "Dùng chung một tài khoản admin", L2_2fa_has: "Không",
    l3_av_has: "Không", l3_av_name: "", l3_av_license: "Không", L3_cap_nhat_virus: "Không",
    l4_bak_has: "Không sao lưu", l4_bak_freq: "", L4_offsite_has: "Không",
    l5_log_enabled: "Không", l5_log_retention: "Không lưu", l5_siem_has: "Không", l5_siem_name: "",
    l6_incident_has: "Không có sự cố nào", l6_incident_desc: "", l6_incident_resolution: "",
    l7_type: "Tường lửa tích hợp (SPI)", L7_chinh_sach: "Chưa cấu hình", L7_remote_access: "Không", L7_4_cong_mo: "",
    L8_1_co_ups: "Không", L8_1_ups_hang_model: "", L8_1_ups_cong_suat_va: "", L8_1_ups_thoi_gian_phut: "",
    L8_2_dieu_hoa: "Không", L8_3_bin_chua_chay_has: "Không", L8_4_mo_ta_phong: "",
    cap_nhat_he_dieu_hanh: "Không", Q2_cap_nhat_ung_dung: "Không", Q3_nguoi_chiu_trach_nhiem: "", Q4_firmware_mang: "", Q5_theo_doi_canh_bao: "Không",
    
    k1_quy_che: "", k2_ke_hoach_ht: "", k3_ke_hoach_tr: "", k4_qd_can_bo: "",
    K5_qd_phe_duyet_httt: "", K6_ung_pho_su_co: "", K7_bien_ban_kiem_tra: "",

    // Tab 5: Đánh giá & Xác nhận (Mục M, N, BC)
    ...Array.from({ length: 14 }, (_, i) => ({ [`M${i+1}_status`]: false })).reduce((a, b) => ({ ...a, ...b }), {}),
    n_nguoi_lap: "", n_chuc_vu_lap: "", n_ngay_lap: new Date().toISOString().split('T')[0],
    N_nguoi_kiem_tra_ho_ten: "", N_nguoi_kiem_tra_chuc_vu: "", N_ngay_kiem_tra: "",
    N_thu_truong_ho_ten: "", N_thu_truong_chuc_vu: "", N_ngay_ky: "",
    BC_so_bao_cao: "", BC_ngay_bao_cao: "", BC_don_vi_thuc_hien: "", BC_ten_tinh: "Lâm Đồng",
    ghi_chu: ""
  };

  const { register, control, handleSubmit, watch } = useForm({ defaultValues: defaultVals });

  const canBoFields = useFieldArray({ control, name: "can_bo_phu_trach" });
  const internetFields = useFieldArray({ control, name: "ket_noi_internet" });
  const tbMangFields = useFieldArray({ control, name: "thiet_bi_mang" });
  const mayChuFields = useFieldArray({ control, name: "may_chu" });
  const cameraFields = useFieldArray({ control, name: "camera" });
  const ungDungFields = useFieldArray({ control, name: "ung_dung" });
  const ipTinhFields = useFieldArray({ control, name: "ip_tinh" });
  const viTriFields = useFieldArray({ control, name: "T5_vi_tri" });

  const formData = watch();
  
  useAutoSave(formData, 10000);

  const [showValidationModal, setShowValidationModal] = useState(false);
  
  const calculateProgress = () => {
     const fields = ["ten_don_vi", "he_thong_thong_tin", "nguoi_dung_dau", "dia_chi"];
     const filled = fields.filter(f => !!formData[f]).length;
     return { percent: Math.round((filled / fields.length) * 100), missing: fields.length - filled };
  };

  const Indicator = ({ name, required }: { name: string, required?: boolean }) => {
    const val = formData[name];
    if (!val && required) return <span title="Bắt buộc nhập"><AlertCircle className="w-4 h-4 text-rose-500 inline ml-2" /></span>;
    if (val) return <CheckCircle2 className="w-4 h-4 text-emerald-500 inline ml-2" />;
    return null;
  };

  const handleExport = async (type: "phieu" | "hsdx" | "baocao") => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      let endpoint = "";
      let filename = "";

      if (type === "phieu") {
        endpoint = "/export/phieu-khao-sat";
        filename = `Phieu_Khao_Sat_${formData.ten_don_vi || "ATTT"}.docx`;
      } else if (type === "hsdx") {
        endpoint = "/export/ho-so-de-xuat";
        filename = `HSDX_Cap_Do_${formData.ten_don_vi || "He_Thong"}.docx`;
      } else if (type === "baocao") {
        endpoint = "/export/bao-cao";
        filename = `Bao_Cao_HSDX_${formData.ten_don_vi || "He_Thong"}.docx`;
      }

      const response = await axios.post(`${apiUrl}${endpoint}`, {
        data: formData
      }, { responseType: 'blob' });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
      alert("Lỗi xuất file Word!");
    }
  };

  const onSubmit = async (data: any) => {
    try {
      await axios.post(`${API_URL}/api/surveys`, {
        ten_don_vi: data.ten_don_vi,
        doer: data.nguoi_thuc_hien,
        status: "Đang xử lý",
        data: data
      });
      alert("Hồ sơ đã được lưu thành công!");
    } catch (err) {
      alert("Lỗi lưu hồ sơ!");
    }
  };

  const AccordionHeader = ({ id, label, icon: Icon }: { id: string, label: string, icon: any }) => (
    <button 
      type="button" 
      onClick={() => setExpandedSection(prev => prev === id ? null : id)}
      className="w-full flex items-center justify-between p-4 bg-gray-900/80 border border-white/10 rounded-xl mb-2 font-semibold transition-all hover:bg-gray-800"
    >
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-indigo-400" />
        <span className="text-sm">{label}</span>
      </div>
      {expandedSection === id ? <ChevronUp className="w-5 h-5 text-indigo-400" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
    </button>
  );

  return (
    <>
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 pb-28 px-2 max-w-full overflow-hidden">
      
      {/* 1. ĐƠN VỊ & NHÂN SỰ */}
      <div>
        <AccordionHeader id="don_vi" label="I. Đơn vị & Nhân sự" icon={Building} />
        {expandedSection === "don_vi" && (
          <div className="animate-fade-in p-4 bg-black/40 rounded-xl mb-4 space-y-4 border border-white/5 shadow-inner">
             <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-4 rounded-lg border border-indigo-500/20 mb-2">
                <label className="form-label text-indigo-400 font-bold mb-2">Cán bộ thực hiện (Doer)</label>
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
                  <div><label className="form-label">Điện thoại</label><input {...register("so_dien_thoai")} className="form-input" /></div>
                  <div><label className="form-label">Email</label><input {...register("email")} className="form-input" /></div>
                </div>
                <div><label className="form-label">Thủ trưởng đơn vị</label><input {...register("nguoi_dung_dau")} className="form-input" /></div>
                <div><label className="form-label">Chức vụ</label><input {...register("A6_chuc_vu_thu_truong")} className="form-input" /></div>
             </div>

             <div className="pt-4 border-t border-white/5 space-y-3">
                <h4 className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">C. Hệ thống thông tin (HTTT)</h4>
                <div><label className="form-label">Tên HTTT (*) <Indicator name="he_thong_thong_tin" required /></label><input {...register("he_thong_thong_tin")} className="form-input" /></div>
                <div><label className="form-label">Mô tả chức năng (C1)</label><textarea {...register("C1_mo_ta_chuc_nang")} className="form-input min-h-[60px]" placeholder="Phục vụ công tác quản lý..." /></div>
                <div><label className="form-label">Đối tượng người dùng (C2)</label><input {...register("C2_doi_tuong_nguoi_dung")} className="form-input" placeholder="VD: Cán bộ, người dân..." /></div>
                <div><label className="form-label">Loại dữ liệu xử lý (C3)</label><input {...register("C3_loai_du_lieu")} className="form-input" /></div>
                
                <div>
                   <label className="form-label">Phân loại dữ liệu (C4)</label>
                   <select {...register("C4_du_lieu_type")} className="form-input">
                      <option value="Cá nhân thông thường">Cá nhân thông thường</option>
                      <option value="Cá nhân nhạy cảm">Cá nhân nhạy cảm</option>
                      <option value="Dữ liệu công">Dữ liệu công</option>
                      <option value="Không xác định">Không xác định</option>
                   </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                   <div><label className="form-label text-[10px]">Người dùng NB (C5.i)</label><input {...register("C5_noi_bo")} className="form-input h-9" type="number" /></div>
                   <div><label className="form-label text-[10px]">Lượt GD ngoài (C5.ii)</label><input {...register("C5_ben_ngoai")} className="form-input h-9" type="number" /></div>
                </div>

                <div><label className="form-label text-[10px]">Năm hoạt động (C6)</label><input {...register("C6_nam_hoat_dong")} className="form-input h-9" type="number" /></div>

                <div><label className="form-label">Hệ thống cấp trên (C7)</label>
                   <div className="flex gap-2">
                      <select {...register("C7_ket_noi_cap_tren_has")} className="form-input flex-1 h-9 py-1">
                         <option value="Không">Không</option>
                         <option value="Có">Có</option>
                      </select>
                      {formData.C7_ket_noi_cap_tren_has === "Có" && <input {...register("C7_ten_he_thong_cap_tren")} className="form-input flex-1 h-9" placeholder="Tên hệ thống..." />}
                   </div>
                </div>

                <div><label className="form-label">Xử lý bí mật NN (C8)</label>
                   <div className="flex gap-2">
                      <select {...register("C8_bi_mat_nha_nuoc_has")} className="form-input flex-1 h-9 py-1">
                         <option value="Không">Không</option>
                         <option value="Có">Có</option>
                      </select>
                      {formData.C8_bi_mat_nha_nuoc_has === "Có" && (
                         <select {...register("C8_do_mat")} className="form-input flex-1 h-9 py-1">
                            <option value="Mật">Mật</option>
                            <option value="Tối mật">Tối mật</option>
                            <option value="Tuyệt mật">Tuyệt mật</option>
                         </select>
                      )}
                   </div>
                </div>
             </div>
             
             <div className="pt-4 border-t border-white/5">
                <div className="flex justify-between items-center mb-3">
                  <label className="form-label font-bold mb-0 text-white">B. Nhân sự quản trị / Vận hành</label>
                  <button type="button" onClick={() => canBoFields.append({ ho_ten: "", chuc_vu: "", dien_thoai: "", email: "", trinh_do: "", chung_chi: "" })} className="bg-indigo-500/20 text-indigo-400 p-1.5 rounded-lg"><Plus className="w-4 h-4" /></button>
                </div>
                {canBoFields.fields.map((field, idx) => (
                  <div key={field.id} className="p-4 bg-gray-800/40 rounded-lg mb-3 border border-white/5">
                     <div className="flex justify-between items-center mb-3 border-b border-white/5 pb-2">
                        <span className="text-[10px] font-bold text-gray-500 uppercase">Cán bộ #{idx + 1}</span>
                        <button type="button" onClick={() => canBoFields.remove(idx)} className="text-rose-500 bg-rose-500/10 p-1.5 rounded-md"><Trash2 className="w-3.5 h-3.5"/></button>
                     </div>
                     <div className="space-y-3">
                        <div>
                           <label className="text-[9px] text-gray-400 uppercase">Họ tên & Chức vụ</label>
                           <div className="grid grid-cols-2 gap-2 mt-1">
                              <input {...register(`can_bo_phu_trach.${idx}.ho_ten`)} placeholder="Họ tên" className="form-input text-xs" />
                              <input {...register(`can_bo_phu_trach.${idx}.chuc_vu`)} placeholder="Chức vụ" className="form-input text-xs" />
                           </div>
                        </div>
                        <div>
                           <label className="text-[9px] text-gray-400 uppercase">Liên hệ</label>
                           <div className="grid grid-cols-2 gap-2 mt-1">
                              <input {...register(`can_bo_phu_trach.${idx}.dien_thoai`)} placeholder="SĐT" className="form-input text-xs" />
                              <input {...register(`can_bo_phu_trach.${idx}.email`)} placeholder="Email" className="form-input text-xs" />
                           </div>
                        </div>
                        <input {...register(`can_bo_phu_trach.${idx}.trinh_do`)} placeholder="Trình độ chuyên môn" className="form-input text-xs" />
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}
      </div>

       {/* 2. HẠ TẦNG & MẠNG */}
       <div>
         <AccordionHeader id="ha_tang" label="II. Hạ tầng & Mạng" icon={Router} />
         {expandedSection === "ha_tang" && (
           <div className="animate-fade-in p-4 bg-black/40 rounded-xl mb-4 space-y-6 border border-white/5 shadow-inner">
             
             {/* D. Internet */}
             <div className="space-y-4">
               <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="form-label font-bold text-indigo-400 uppercase text-[10px]">D. Kết nối Internet</label>
                    <button type="button" onClick={() => internetFields.append({ nha_cung_cap: "", loai: "Cáp quang", bang_thong: "", vai_tro: "Đường chính", ip_wan: "Tĩnh" })} className="bg-indigo-500/20 text-indigo-400 p-1 rounded-lg"><Plus className="w-4 h-4" /></button>
                  </div>
                  {internetFields.fields.map((field, idx) => (
                    <div key={field.id} className="p-3 bg-white/5 rounded-lg mb-2 border border-white/5">
                       <div className="flex justify-between mb-2">
                          <span className="text-[9px] text-gray-500">LINE #{idx+1}</span>
                          <button type="button" onClick={() => internetFields.remove(idx)} className="text-rose-400"><Trash2 className="w-3 h-3"/></button>
                       </div>
                       <input {...register(`ket_noi_internet.${idx}.nha_cung_cap`)} placeholder="ISP (VNPT, Viettel...)" className="form-input text-xs mb-2 h-8" />
                       <div className="grid grid-cols-2 gap-2">
                          <input {...register(`ket_noi_internet.${idx}.bang_thong`)} placeholder="Băng thông" className="form-input text-xs h-8" />
                          <select {...register(`ket_noi_internet.${idx}.vai_tro`)} className="form-input text-xs h-8 py-0"><option value="Đường chính">Chính</option><option value="Dự phòng">Dự phòng</option></select>
                       </div>
                    </div>
                  ))}
               </div>
               <div><label className="form-label text-[10px]">Thiết bị Gateway (D2)</label><input {...register("D2_router_modem")} className="form-input h-9" placeholder="Hãng, Model..." /></div>
               <div><label className="form-label text-[10px]">IP LAN Gateway (D3)</label><input {...register("D3_ip_lan_gateway")} className="form-input h-9" placeholder="192.168.1.1" /></div>
             </div>

             {/* E. Firewall & Switch */}
             <div className="pt-4 border-t border-white/5">
               <div className="flex justify-between items-center mb-3">
                 <label className="form-label font-bold text-rose-400 uppercase text-[10px]">E. Firewall & Thiết bị mạng</label>
                 <button type="button" onClick={() => tbMangFields.append({ loai_thiet_bi: "", hang: "", model: "", serial: "", nam_mua: "" })} className="bg-rose-500/20 text-rose-400 p-1 rounded-lg"><Plus className="w-4 h-4" /></button>
               </div>
               <div className="mb-3">
                  <label className="form-label text-[10px]">Loại Firewall (E2)</label>
                  <select {...register("E2_firewall_type")} className="form-input h-9 py-1">
                     <option value="Dùng Firewall tích hợp">Dùng Firewall tích hợp (Router)</option>
                     <option value="Có (phần cứng chuyên dụng)">Có (phần cứng chuyên dụng)</option>
                     <option value="Dùng phần mềm Firewall">Dùng phần mềm Firewall</option>
                  </select>
               </div>
               {tbMangFields.fields.map((field, idx) => (
                 <div key={field.id} className="p-3 bg-white/5 rounded-lg mb-2 border border-white/5">
                    <div className="flex justify-between mb-2">
                       <span className="text-[9px] text-gray-500">SWITCH/AP #{idx+1}</span>
                       <button type="button" onClick={() => tbMangFields.remove(idx)} className="text-rose-400"><Trash2 className="w-3 h-3"/></button>
                    </div>
                    <div className="space-y-2">
                       <input {...register(`thiet_bi_mang.${idx}.loai_thiet_bi`)} placeholder="Loại (VD: Switch 24p)" className="form-input text-xs h-8" />
                       <div className="grid grid-cols-2 gap-2">
                          <input {...register(`thiet_bi_mang.${idx}.hang`)} placeholder="Hãng" className="form-input text-xs h-8" />
                          <input {...register(`thiet_bi_mang.${idx}.serial`)} placeholder="Serial" className="form-input text-xs h-8" />
                       </div>
                    </div>
                 </div>
               ))}
             </div>

             {/* F. Đầu cuối & Máy chủ */}
             <div className="pt-4 border-t border-white/5">
                <h4 className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider mb-3">F. Thiết bị đầu cuối & Máy chủ</h4>
                <div className="grid grid-cols-2 gap-3 mb-4">
                   {["F1_pc_sl", "F1_laptop_sl", "F1_mayin_sl", "F1_dienthoai_sl"].map(f => (
                      <div key={f}>
                         <label className="form-label text-[9px] mb-1">{f.split('_')[1].toUpperCase()}</label>
                         <input {...register(f)} className="form-input h-8 text-center" type="number" placeholder="SL" />
                      </div>
                   ))}
                </div>

                <div className="flex justify-between items-center mb-3">
                  <label className="form-label text-[10px] font-bold text-emerald-300">Máy chủ vật lý (F2)</label>
                  <button type="button" onClick={() => mayChuFields.append({ vai_tro: "", hang: "", serial: "", ram: "", hdd: "", vi_tri: "" })} className="bg-emerald-500/20 text-emerald-400 p-1 rounded-lg"><Plus className="w-4 h-4" /></button>
                </div>
                {mayChuFields.fields.map((field, idx) => (
                  <div key={field.id} className="p-3 bg-black/20 rounded-lg mb-2 border border-white/5">
                     <div className="flex justify-between mb-2">
                        <span className="text-[9px] text-gray-500">SERVER #{idx+1}</span>
                        <button type="button" onClick={() => mayChuFields.remove(idx)} className="text-rose-400"><Trash2 className="w-3 h-3"/></button>
                     </div>
                     <div className="space-y-2">
                        <input {...register(`may_chu.${idx}.vai_tro`)} placeholder="Vai trò (AD, File...)" className="form-input text-xs h-8" />
                        <div className="grid grid-cols-2 gap-2">
                           <input {...register(`may_chu.${idx}.hang`)} placeholder="Hãng/Model" className="form-input text-xs h-8" />
                           <input {...register(`may_chu.${idx}.ram`)} placeholder="RAM" className="form-input text-xs h-8" />
                        </div>
                     </div>
                  </div>
                ))}
                
                <div className="mt-3">
                   <label className="form-label text-[10px]">Điện toán đám mây (F3)</label>
                   <div className="flex gap-2">
                      <select {...register("F3_cloud_has")} className="form-input flex-1 h-8 py-0"><option value="Không">Không</option><option value="Có">Có</option></select>
                      {formData.F3_cloud_has === "Có" && <input {...register("F3_ten_cloud")} className="form-input flex-1 h-8" placeholder="AWS, VNPT..." />}
                   </div>
                </div>
             </div>
             
             {/* G. Camera */}
             <div className="pt-4 border-t border-white/5">
                <div className="flex justify-between items-center mb-3">
                  <label className="form-label font-bold text-blue-400 uppercase text-[10px]">G. Camera / NVR</label>
                  <button type="button" onClick={() => cameraFields.append({ hang: "", model: "", serial: "", vi_tri: "" })} className="bg-blue-500/20 text-blue-400 p-1 rounded-lg"><Plus className="w-4 h-4" /></button>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                   <div><label className="text-[9px] text-gray-500">Đầu ghi NVR (G2)</label><input {...register("G2_dau_ghi_nvr")} className="form-input h-8" /></div>
                   <div><label className="text-[9px] text-gray-500">Lưu trữ (G3)</label><input {...register("G3_luu_tru_ngay")} className="form-input h-8" type="number" /></div>
                </div>
                {cameraFields.fields.map((field, idx) => (
                  <div key={field.id} className="p-2 bg-white/5 rounded-lg mb-2 flex items-center gap-2">
                     <span className="text-[8px] text-gray-500">#{idx+1}</span>
                     <input {...register(`camera.${idx}.hang`)} placeholder="Hãng" className="form-input text-xs h-8 flex-1" />
                     <input {...register(`camera.${idx}.vi_tri`)} placeholder="Vị trí" className="form-input text-xs h-8 flex-1" />
                     <button type="button" onClick={() => cameraFields.remove(idx)} className="text-rose-400"><Trash2 className="w-3.5 h-3.5"/></button>
                  </div>
                ))}
             </div>

             {/* H. LAN & IP */}
             <div className="pt-4 border-t border-white/5 space-y-4">
                <h4 className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">H. Quy hoạch IP LAN</h4>
                <div className="grid grid-cols-2 gap-2">
                   <div><label className="form-label text-[9px]">Dải IP (H1)</label><input {...register("H1_dai_ip_lan")} className="form-input h-8 text-xs" /></div>
                   <div><label className="form-label text-[9px]">DNS (H3)</label><input {...register("H3_dns")} className="form-input h-8 text-xs" /></div>
                </div>
                <div><label className="form-label text-[10px]">Phân chia VLAN? (H4)</label>
                   <select {...register("H4_co_vlan")} className="form-input h-8 py-0">
                      <option value="Không">Không</option>
                      <option value="Có">Có</option>
                   </select>
                </div>
                
                <div className="space-y-2">
                   <div className="flex justify-between items-center"><label className="text-[10px] text-indigo-300">IP Tĩnh (H5)</label><button type="button" onClick={() => ipTinhFields.append({ ten_thiet_bi: "", ip_tinh: "" })} className="text-indigo-400 p-1"><Plus className="w-4 h-4"/></button></div>
                   {ipTinhFields.fields.map((field, idx) => (
                     <div key={field.id} className="flex gap-2">
                        <input {...register(`ip_tinh.${idx}.ten_thiet_bi`)} placeholder="Thiết bị" className="form-input h-8 text-xs flex-1" />
                        <input {...register(`ip_tinh.${idx}.ip_tinh`)} placeholder="IP" className="form-input h-8 text-xs flex-1" />
                        <button type="button" onClick={() => ipTinhFields.remove(idx)} className="text-rose-400"><Trash2 className="w-3 h-3"/></button>
                     </div>
                   ))}
                </div>
             </div>

             {/* T. Topology */}
             <div className="pt-4 border-t border-white/5 space-y-4">
                 <h4 className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">T. Đặc tả mạng & Vật lý</h4>
                 <div className="grid grid-cols-2 gap-3">
                    <div><label className="form-label text-[9px]">DMZ (T1.1)</label>
                       <select {...register("T1_1_co_dmz")} className="form-input h-8 py-0"><option value="Không">Không</option><option value="Có">Có</option></select>
                    </div>
                    <div><label className="form-label text-[9px]">WiFi tách biệt? (T1.2)</label>
                       <select {...register("T1_2_wifi_tach_rieng")} className="form-input h-8 py-0"><option value="Không">Không</option><option value="Có">Có</option></select>
                    </div>
                 </div>
                 <div><label className="form-label text-[9px]">Loại cáp chính (T4.1)</label>
                    <select {...register("T4_1_loai_cap")} className="form-input h-8 py-0">
                       <option value="Cáp đồng (Cat5e/Cat6)">Cáp đồng (Cat6)</option>
                       <option value="Cáp quang (Fiber)">Cáp quang (Fiber)</option>
                    </select>
                 </div>
                 <div className="grid grid-cols-2 gap-3">
                    <div><label className="form-label text-[9px]">Tủ Rack (T3)</label>
                       <select {...register("T3_1_co_rack")} className="form-input h-8 py-0"><option value="Không">Không</option><option value="Có">Có</option></select>
                    </div>
                    {formData.T3_1_co_rack === "Có" && <div><label className="form-label text-[9px]">Số U</label><input {...register("T3_1_rack_u")} className="form-input h-8 text-xs" /></div>}
                 </div>
             </div>
           </div>
         )}
       </div>

       {/* 3. DỊCH VỤ & ỨNG DỤNG */}
       <div>
         <AccordionHeader id="ung_dung" label="III. Dịch vụ & Ứng dụng (v2.6 SYNCED)" icon={MonitorPlay} />
         {expandedSection === "ung_dung" && (
           <div className="animate-fade-in p-4 bg-black/40 rounded-xl mb-4 space-y-6 border border-white/5 shadow-inner">
             {/* I. Ứng dụng */}
             <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="form-label font-bold text-amber-400 uppercase text-[10px]">I. Ứng dụng & Dịch vụ</label>
                  <button type="button" onClick={() => ungDungFields.append({ ten_ung_dung: "", chuc_nang: "", don_vi: "", phien_ban: "" })} className="bg-amber-500/20 text-amber-400 p-1 rounded-lg"><Plus className="w-4 h-4" /></button>
                </div>
                {ungDungFields.fields.map((field, idx) => (
                  <div key={field.id} className="p-3 bg-white/5 rounded-lg mb-2 border border-white/5">
                     <div className="flex justify-between mb-2">
                        <span className="text-[9px] text-gray-500 uppercase">APP #{idx+1}</span>
                        <button type="button" onClick={() => ungDungFields.remove(idx)} className="text-rose-400"><Trash2 className="w-3 h-3"/></button>
                     </div>
                     <input {...register(`ung_dung.${idx}.ten_ung_dung`)} placeholder="Tên ứng dụng (VD: MISA, Văn phòng số...)" className="form-input text-xs h-8 mb-2" />
                     <input {...register(`ung_dung.${idx}.chuc_nang`)} placeholder="Chức năng chính" className="form-input text-xs h-8" />
                  </div>
                ))}
             </div>

             {/* P. Mã hóa & VPN */}
             <div className="pt-4 border-t border-white/5 space-y-4">
                <h4 className="text-[10px] uppercase font-bold text-orange-400 tracking-wider">P. Bảo mật kết nối & Mã hóa</h4>
                <div>
                   <label className="form-label text-[10px]">Giao thức Web (P1)</label>
                   <select {...register("p1_protocol")} className="form-input h-8 py-0">
                      <option value="HTTPS (có chứng chỉ SSL/TLS)">HTTPS (Có mã hóa)</option>
                      <option value="HTTP (không mã hóa)">HTTP (Không mã hóa)</option>
                   </select>
                </div>
                <div>
                   <label className="form-label text-[10px]">VPN kết nối từ xa (P2)</label>
                   <div className="flex gap-2">
                      <select {...register("p2_vpn")} className="form-input flex-1 h-8 py-0"><option value="Không có VPN">Không</option><option value="Có">Có</option></select>
                      {formData.p2_vpn === "Có" && <input {...register("p2_vpn_type")} className="form-input flex-1 h-8" placeholder="Loại VPN..." />}
                   </div>
                </div>
                <div>
                   <label className="form-label text-[10px]">Mã hóa ổ đĩa (P4)</label>
                   <div className="flex gap-2">
                      <select {...register("P4_ma_hoa_luu_tru_has")} className="form-input flex-1 h-8 py-0"><option value="Không">Không</option><option value="Có">Có</option></select>
                      {formData.P4_ma_hoa_luu_tru_has === "Có" && <input {...register("P4_phuong_phap")} className="form-input flex-1 h-8" placeholder="Bitlocker..." />}
                   </div>
                </div>
                <div><label className="form-label text-[10px]">Email Security (P5)</label>
                   <select {...register("P5_email_sec")} className="form-input h-8 py-0"><option value="Không">Không</option><option value="Có">Có</option></select>
                </div>
             </div>
           </div>
         )}
       </div>

       {/* 4. AN TOÀN BẢO MẬT */}
       <div>
         <AccordionHeader id="bao_mat" label="IV. An toàn Bảo mật" icon={ShieldAlert} />
         {expandedSection === "bao_mat" && (
           <div className="animate-fade-in p-4 bg-black/40 rounded-xl mb-4 space-y-5 border border-white/5 shadow-inner">
             
             {/* L. Kiểm soát truy cập */}
             <div className="space-y-4">
                <h4 className="text-[10px] uppercase font-bold text-violet-400 tracking-wider">L. Kiểm soát & Giám sát</h4>
                <div>
                   <label className="form-label text-[10px]">Kiểm soát vật lý (L1)</label>
                   <select {...register("l1_phys_key")} className="form-input h-9 py-1">
                      <option value="Có khóa cửa (chìa khóa thường)">Có khóa cửa (chìa khóa thường)</option>
                      <option value="Có khóa cửa + camera giám sát">Có khóa cửa + camera giám sát</option>
                      <option value="Có thẻ từ / kiểm soát điện tử">Có thẻ từ / kiểm soát điện tử</option>
                      <option value="Không có kiểm soát riêng">Không có kiểm soát riêng</option>
                   </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                   <div><label className="form-label text-[10px]">Ban hành Pass? (L2)</label>
                      <select {...register("l2_pass_policy")} className="form-input h-8 py-0"><option value="Không có chính sách thống nhất">Không</option><option value="Có chính sách mật khẩu">Có</option></select>
                   </div>
                   <div><label className="form-label text-[10px]">Yêu cầu 2FA? (L2.ii)</label>
                      <select {...register("L2_2fa_has")} className="form-input h-8 py-0"><option value="Không">Không</option><option value="Có">Có</option></select>
                   </div>
                </div>
             </div>

             <div className="bg-rose-500/5 p-4 rounded-lg border border-rose-500/10">
               <label className="form-label text-rose-400 font-bold mb-3 uppercase text-[10px]">L8. Hạ tầng phòng máy (Server Room)</label>
               <div className="space-y-4">
                  <div>
                     <label className="form-label text-[10px]">UPS (Nguồn dự phòng)? (L8.1)</label>
                     <div className="flex gap-2">
                        <select {...register("L8_1_co_ups")} className="form-input flex-1 h-8 py-0"><option value="Không">Không</option><option value="Có">Có</option></select>
                        {formData.L8_1_co_ups === "Có" && <input {...register("L8_1_ups_hang_model")} className="form-input flex-1 h-8" placeholder="Hãng..." />}
                     </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                     <div><label className="form-label text-[10px]">Điều hòa (L8.2)</label>
                        <select {...register("L8_2_dieu_hoa")} className="form-input h-8 py-0"><option value="Không">Không</option><option value="Có – 24/7">24/7</option><option value="Có – Giờ hành chính">Hành chính</option></select>
                     </div>
                     <div><label className="form-label text-[10px]">Bình PCCC (L8.3)</label>
                        <select {...register("L8_3_bin_chua_chay_has")} className="form-input h-8 py-0"><option value="Không">Không</option><option value="Có">Có</option></select>
                     </div>
                  </div>
               </div>
             </div>

             <div className="space-y-4 pt-2">
               <div><label className="form-label text-[10px]">Phần mềm diệt Virus (L3)</label>
                  <div className="flex gap-2">
                     <select {...register("l3_av_has")} className="form-input flex-1 h-8 py-0"><option value="Không">Không</option><option value="Có">Có</option></select>
                     {formData.l3_av_has === "Có" && <input {...register("l3_av_name")} placeholder="Tên..." className="form-input flex-1 h-8" />}
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-3">
                  <div><label className="form-label text-[10px]">Sao lưu (L4)</label>
                    <select {...register("l4_bak_has")} className="form-input h-8 py-0">
                       <option value="Có">Có (Tự động)</option>
                       <option value="Thủ công">Thủ công</option>
                       <option value="Không sao lưu">Không</option>
                    </select>
                  </div>
                  <div><label className="form-label text-[10px]">Lưu Log? (L5)</label>
                     <select {...register("l5_log_enabled")} className="form-input h-8 py-0"><option value="Không">Không</option><option value="Có">Có</option></select>
                  </div>
               </div>
               <div><label className="form-label text-[10px]">Sự cố ATTT gần đây (L6)</label>
                  <select {...register("l6_incident_has")} className="form-input h-8 py-0"><option value="Không có sự cố nào">Không có</option><option value="Có">Có sự cố</option></select>
                  {formData.l6_incident_has === "Có" && <textarea {...register("l6_incident_desc")} className="form-input mt-2 min-h-[60px]" placeholder="Mô tả sự cố..." />}
               </div>
               
               <div className="pt-4 border-t border-white/5 space-y-4">
                  <h4 className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">Q. Quản lý bản vá (Patching)</h4>
                  <div><label className="form-label text-[10px]">Bản vá HĐH (Q1)</label>
                     <select {...register("cap_nhat_he_dieu_hanh")} className="form-input h-8 py-0"><option value="Không">Không</option><option value="Định kỳ">Định kỳ</option><option value="Thủ công">Thủ công</option></select>
                  </div>
                  <div><label className="form-label text-[10px]">Bản vá ứng dụng (Q2)</label>
                     <select {...register("Q2_cap_nhat_ung_dung")} className="form-input h-8 py-0"><option value="Không">Không</option><option value="Có">Có</option></select>
                  </div>
                  <div><label className="form-label text-[10px]">Người chịu trách nhiệm (Q3)</label><input {...register("Q3_nguoi_chiu_trach_nhiem")} className="form-input h-8 text-xs" /></div>
               </div>
             </div>
           </div>
         )}
       </div>

      {/* 5. ĐÁNH GIÁ & HỒ SƠ */}
      <div>
        <AccordionHeader id="danh_gia" label="V. Đánh giá & Hồ sơ" icon={LayoutPanelLeft} />
        {expandedSection === "danh_gia" && (
           <div className="animate-fade-in p-4 bg-black/40 rounded-xl mb-4 space-y-6 border border-white/5 shadow-inner">
             {/* K. Hồ sơ pháp lý */}
             <div className="space-y-3">
                <h4 className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">K. Danh mục hồ sơ hiện có</h4>
                <div className="grid grid-cols-1 gap-2">
                   {[
                      {id: "k1_quy_che", label: "Quy chế ATTT (K1)"},
                      {id: "k2_ke_hoach_ht", label: "Kế hoạch HT (K2)"},
                      {id: "K5_qd_phe_duyet_httt", label: "QĐ Phê duyệt Cấp độ (K5)"},
                      {id: "K6_ung_pho_su_co", label: "PA Ứng phó sự cố (K6)"}
                   ].map(k => (
                    <div key={k.id} className="p-3 bg-white/5 rounded border border-white/5">
                       <label className="text-[9px] text-gray-400 block mb-1 uppercase">{k.label}</label>
                       <input {...register(k.id)} placeholder="Số hiệu văn bản..." className="form-input h-8 text-xs" />
                    </div>
                  ))}
                </div>
             </div>

             {/* M. Ảnh chụp checklist */}
             <div className="pt-4 border-t border-white/5">
                <h4 className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider mb-3">M. Ảnh chụp máy hiện trường</h4>
                <div className="grid grid-cols-2 gap-1">
                   {[
                      "Modem", "Tủ Rack", "Máy chủ", "Hệ điều hành",
                      "Antivirus", "Backup", "Camera", "PCCC", "Tổng quan"
                   ].map((label, i) => (
                      <label key={i} className="flex items-center gap-3 p-2 bg-black/20 rounded active:bg-gray-800">
                         <input type="checkbox" {...register(`M${i+1}_status`)} className="w-5 h-5 rounded border-gray-700 bg-gray-800 text-indigo-500" />
                         <span className="text-xs text-gray-300 truncate">{label}</span>
                      </label>
                   ))}
                </div>
             </div>

             {/* BC. Metadata */}
             <div className="pt-4 border-t border-white/5 space-y-3">
                <h4 className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">BC. Metadata Báo cáo</h4>
                <div className="grid grid-cols-2 gap-2">
                   <input {...register("BC_so_bao_cao")} placeholder="Số báo cáo" className="form-input" />
                   <input {...register("BC_ten_tinh")} placeholder="Tại tỉnh" className="form-input" />
                </div>
             </div>

             <div className="pt-4 border-t border-white/5">
                <label className="form-label text-white font-bold">Ghi chú hiện trường</label>
                <textarea {...register("ghi_chu")} className="form-input min-h-[100px]" placeholder="Nhập thêm ghi chú quan trọng..."></textarea>
             </div>
           </div>
        )}
      </div>

      {/* BOTTOM ACTION BAR - RE-DESIGNED FOR MOBILE EXPORTS */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-md border-t border-white/10 p-3 z-50 shadow-[0_-10px_25px_rgba(0,0,0,0.8)]">
        <div className="w-full bg-gray-800 rounded-full h-1 mb-3 overflow-hidden">
           <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 transition-all duration-500" style={{ width: `${calculateProgress().percent}%` }}></div>
        </div>
        
        <div className="flex flex-col gap-2">
           <div className="flex gap-2">
              <button type="button" onClick={() => handleExport("phieu")} className="flex-1 h-10 bg-indigo-500/20 text-indigo-400 rounded-lg text-[10px] font-bold uppercase border border-indigo-500/30 flex items-center justify-center gap-1.5">
                 <FileCheck className="w-4 h-4" /> Phiếu
              </button>
              <button type="button" onClick={() => handleExport("hsdx")} className="flex-1 h-10 bg-purple-500/20 text-purple-400 rounded-lg text-[10px] font-bold uppercase border border-purple-500/30 flex items-center justify-center gap-1.5">
                 <Shield className="w-4 h-4" /> HSDX
              </button>
              <button type="button" onClick={() => handleExport("baocao")} className="flex-1 h-10 bg-blue-500/20 text-blue-400 rounded-lg text-[10px] font-bold uppercase border border-blue-500/30 flex items-center justify-center gap-1.5">
                 <FileText className="w-4 h-4" /> Báo cáo
              </button>
           </div>
           
           <div className="flex gap-2">
              <button type="button" onClick={() => setShowNetworkModal(true)} className="flex-none w-12 h-12 bg-gray-800/80 rounded-xl flex items-center justify-center border border-white/10 active:scale-95 transition-transform">
                 <Network className="w-6 h-6 text-indigo-400" />
              </button>
              <button type="submit" className="flex-1 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl text-white font-bold text-sm uppercase flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg shadow-emerald-500/20">
                 <Save className="w-5 h-5" /> Lưu Hồ Sơ
              </button>
           </div>
        </div>
      </div>

      {/* NETWORK MODAL */}
      {showNetworkModal && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex flex-col">
          <div className="p-4 flex justify-between items-center border-b border-white/10 bg-gray-900">
            <h2 className="font-bold flex items-center gap-2"><Network className="w-5 h-5 text-indigo-400"/> Sơ đồ Topology (Mobile)</h2>
            <button type="button" onClick={() => setShowNetworkModal(false)} className="p-2 bg-white/10 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-auto p-4 flex items-start justify-center">
             <NetworkDiagram data={formData} />
          </div>
        </div>
      )}

      {showValidationModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-white/10 rounded-xl w-full p-6 shadow-2xl relative">
            <div className="w-12 h-12 bg-rose-500/10 rounded-full flex items-center justify-center mb-4 mx-auto">
               <AlertCircle className="w-6 h-6 text-rose-500" />
            </div>
            <h2 className="text-xl font-bold text-center mb-2">Cảnh báo thiếu thông tin</h2>
            <div className="bg-black/30 p-4 rounded-lg mb-6 border border-white/5 space-y-2 text-sm">
               {!formData.ten_don_vi && <div className="flex items-center gap-2 text-rose-400"><XCircle className="w-4 h-4"/> Tên cơ quan chủ quản</div>}
               {!formData.he_thong_thong_tin && <div className="flex items-center gap-2 text-rose-400"><XCircle className="w-4 h-4"/> Tên hệ thống thông tin</div>}
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowValidationModal(false)} className="btn-secondary flex-1 justify-center py-3">Quay lại</button>
              <button type="button" onClick={() => { setShowValidationModal(false); handleExport("baocao"); }} className="btn-primary flex-1 justify-center bg-rose-500 py-3">Vẫn Xuất</button>
            </div>
          </div>
        </div>
      )}
    </form>
    </>
  );
}
