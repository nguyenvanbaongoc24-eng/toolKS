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
      const endpoints = { phieu: "generate-docx", hsdx: "generate-hsdx", baocao: "generate-report" };
      const response = await axios.post(`${apiUrl}/api/${endpoints[type]}`, { data: formData }, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}_${formData.ten_don_vi || "survey"}.docx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      alert("Lỗi xuất file!");
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
                <div><label className="form-label">Mô tả chức năng</label><textarea {...register("C1_mo_ta_chuc_nang")} className="form-input min-h-[60px]" /></div>
                <div><label className="form-label">HTTT có bí mật nhà nước?</label>
                   <select {...register("C8_bi_mat_nha_nuoc_has")} className="form-input">
                      <option value="Không">Không</option>
                      <option value="Có">Có</option>
                   </select>
                </div>
             </div>
             
             <div className="pt-4 border-t border-white/5">
                <div className="flex justify-between items-center mb-3">
                  <label className="form-label font-bold mb-0 text-white">B. Nhân sự quản trị / Vận hành</label>
                  <button type="button" onClick={() => canBoFields.append({ ho_ten: "", chuc_vu: "", dien_thoai: "", email: "" })} className="bg-indigo-500/20 text-indigo-400 p-1.5 rounded-lg"><Plus className="w-4 h-4" /></button>
                </div>
                {canBoFields.fields.map((field, idx) => (
                  <div key={field.id} className="p-4 bg-gray-800/40 rounded-lg mb-3 border border-white/5">
                     <div className="flex justify-between items-center mb-3 border-b border-white/5 pb-2">
                        <span className="text-[10px] font-bold text-gray-500">NHÂN SỰ #{idx + 1}</span>
                        <button type="button" onClick={() => canBoFields.remove(idx)} className="text-rose-500 bg-rose-500/10 p-1.5 rounded-md"><Trash2 className="w-3.5 h-3.5"/></button>
                     </div>
                     <div className="space-y-3">
                        <input {...register(`can_bo_phu_trach.${idx}.ho_ten`)} placeholder="Họ tên" className="form-input" />
                        <input {...register(`can_bo_phu_trach.${idx}.dien_thoai`)} placeholder="Điện thoại" className="form-input" />
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
            <div className="space-y-4">
               <div><label className="form-label">Modem / Router chính (D2)</label><input {...register("D2_router_modem")} className="form-input" placeholder="Draytek, Mikrotik..." /></div>
               <div><label className="form-label">Tường lửa (Firewall - E2)</label>
                  <select {...register("E2_firewall_type")} className="form-input">
                     <option value="Dùng Firewall tích hợp">Firewall tích hợp (Draytek/Mikrotik)</option>
                     <option value="Cứng chuyên dụng">Dùng thiết bị cứng chuyên dụng</option>
                     <option value="Không có">Tắt / Không có</option>
                  </select>
               </div>
            </div>

            {/* Thiết bị mạng */}
            <div className="pt-4 border-t border-white/5">
              <div className="flex justify-between items-center mb-3">
                <label className="form-label font-bold mb-0 text-white">E. Switch & Thiết bị mạng</label>
                <button type="button" onClick={() => tbMangFields.append({ loai_thiet_bi: "", hang: "", serial: "" })} className="bg-indigo-500/20 text-indigo-400 p-1.5 rounded-lg"><Plus className="w-4 h-4" /></button>
              </div>
              {tbMangFields.fields.map((field, idx) => (
                <div key={field.id} className="p-4 bg-gray-800/40 rounded-lg mb-3 border border-white/5">
                   <div className="flex justify-between items-center mb-3 border-b border-white/5 pb-2">
                      <span className="text-[10px] font-bold text-gray-500">THIẾT BỊ #{idx + 1}</span>
                      <button type="button" onClick={() => tbMangFields.remove(idx)} className="text-rose-500 bg-rose-500/10 p-1.5 rounded-md"><Trash2 className="w-3.5 h-3.5"/></button>
                   </div>
                   <div className="space-y-2">
                      <input {...register(`thiet_bi_mang.${idx}.loai_thiet_bi`)} placeholder="Loại (VD: Switch 24p)" className="form-input" />
                      <input {...register(`thiet_bi_mang.${idx}.hang`)} placeholder="Hãng/Model" className="form-input" />
                   </div>
                </div>
              ))}
            </div>

            {/* Máy chủ */}
            <div className="pt-4 border-t border-white/5">
              <div className="flex justify-between items-center mb-3">
                <label className="form-label font-bold mb-0 text-white">F. Máy chủ (Server)</label>
                <button type="button" onClick={() => mayChuFields.append({ vai_tro: "", hang: "", serial: "", vi_tri: "" })} className="bg-rose-500/20 text-rose-400 p-1.5 rounded-lg"><Plus className="w-4 h-4" /></button>
              </div>
              {mayChuFields.fields.map((field, idx) => (
                <div key={field.id} className="p-4 bg-gray-800/40 rounded-lg mb-3 border border-red-500/10">
                   <div className="flex justify-between items-center mb-3 border-b border-white/5 pb-2">
                      <span className="text-[10px] font-bold text-gray-500">MÁY CHỦ #{idx + 1}</span>
                      <button type="button" onClick={() => mayChuFields.remove(idx)} className="text-rose-500 bg-rose-500/10 p-1.5 rounded-md"><Trash2 className="w-3.5 h-3.5"/></button>
                   </div>
                   <div className="space-y-2">
                      <input {...register(`may_chu.${idx}.vai_tro`)} placeholder="Vai trò (AD, File Server...)" className="form-input" />
                      <input {...register(`may_chu.${idx}.hang`)} placeholder="Hãng/Model" className="form-input" />
                      <input {...register(`may_chu.${idx}.vi_tri`)} placeholder="Vị trí vật lý" className="form-input" />
                   </div>
                </div>
              ))}
            </div>
            
            {/* Camera */}
            <div className="pt-4 border-t border-white/5">
              <div className="flex justify-between items-center mb-3">
                <label className="form-label font-bold mb-0 text-white">G. Camera / NVR</label>
                <button type="button" onClick={() => cameraFields.append({ vi_tri: "", hang: "" })} className="bg-emerald-500/20 text-emerald-400 p-1.5 rounded-lg"><Plus className="w-4 h-4" /></button>
              </div>
              {cameraFields.fields.map((field, idx) => (
                <div key={field.id} className="p-4 bg-gray-800/40 rounded-lg mb-3 border border-emerald-500/10">
                   <div className="flex justify-between items-center mb-3 border-b border-white/5 pb-2">
                      <span className="text-[10px] font-bold text-gray-500">CAMERA #{idx + 1}</span>
                      <button type="button" onClick={() => cameraFields.remove(idx)} className="text-rose-500 bg-rose-500/10 p-1.5 rounded-md"><Trash2 className="w-3.5 h-3.5"/></button>
                   </div>
                   <input {...register(`camera.${idx}.vi_tri`)} placeholder="Vị trí lắp đặt" className="form-input" />
                </div>
              ))}
            </div>

            {/* Đặc tả Vật lý T */}
            <div className="pt-4 border-t border-white/5 space-y-4">
                <h4 className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">T. Đặc tả mạng & Vật lý</h4>
                <div><label className="form-label">Tủ Rack (T3)</label>
                   <select {...register("T3_1_co_rack")} className="form-input">
                      <option value="Không">Không có</option>
                      <option value="Có">Có tủ Rack riêng</option>
                   </select>
                </div>
                {formData.T3_1_co_rack === "Có" && (
                   <input {...register("T3_1_rack_vi_tri")} className="form-input" placeholder="Vị trí tủ Rack..." />
                )}
                <div><label className="form-label">Loại cáp chính (T4.1)</label>
                   <select {...register("T4_1_loai_cap")} className="form-input">
                      <option value="Cáp đồng (Cat5e/Cat6)">Cáp đồng (Cat6/Cat6)</option>
                      <option value="Cáp quang (Fiber)">Cáp quang (Fiber)</option>
                   </select>
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
            <div className="bg-rose-500/5 p-4 rounded-lg border border-rose-500/10">
              <label className="form-label text-rose-400 font-bold mb-3">L8. An toàn vật lý máy chủ</label>
              <div className="space-y-4">
                 <div>
                    <label className="form-label text-xs">Có UPS (Nguồn dự phòng)?</label>
                    <select {...register("L8_1_co_ups")} className="form-input">
                       <option value="Có">Có sử dụng</option>
                       <option value="Không">Không có</option>
                    </select>
                 </div>
                 {formData.L8_1_co_ups === "Có" && (
                    <input {...register("L8_1_ups_hang_model")} className="form-input" placeholder="Hãng/Model UPS" />
                 )}
                 <div>
                    <label className="form-label text-xs">Có Máy điều hòa (24/7)?</label>
                    <select {...register("L8_2_dieu_hoa")} className="form-input">
                       <option value="Có – 24/7">Có (Chạy 24/7)</option>
                       <option value="Có – Giờ hành chính">Chỉ chạy hành chính</option>
                       <option value="Không">Không có</option>
                    </select>
                 </div>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div><label className="form-label">Phần mềm Virus (L3)</label>
                 <div className="flex gap-2">
                    <select {...register("l3_av_has")} className="form-input flex-1">
                       <option value="Có">Có sử dụng</option>
                       <option value="Không">Không</option>
                    </select>
                    {formData.l3_av_has === "Có" && <input {...register("l3_av_name")} placeholder="Tên..." className="form-input flex-1" />}
                 </div>
              </div>
              <div><label className="form-label">Sao lưu định kỳ (L4)</label>
                 <select {...register("l4_bak_has")} className="form-input">
                    <option value="Có">Có (Tự động)</option>
                    <option value="Thủ công">Có (Thủ công / USB)</option>
                    <option value="Không sao lưu">Không thực hiện</option>
                 </select>
              </div>
              <div><label className="form-label">Cập nhật HĐH (Q1)</label>
                 <select {...register("cap_nhat_he_dieu_hanh")} className="form-input">
                    <option value="Hàng tháng">Định kỳ hàng tháng</option>
                    <option value="Thủ công">Thủ công khi có lỗi</option>
                    <option value="Không">Chưa bao giờ</option>
                 </select>
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
                  {["k1_quy_che", "k2_ke_hoach_ht", "k4_qd_can_bo", "K5_qd_phe_duyet_httt"].map(k => (
                    <div key={k} className="p-3 bg-white/5 rounded border border-white/5">
                       <label className="text-[9px] text-gray-400 block mb-1 uppercase">{k.replace('_', ' ')}</label>
                       <input {...register(k)} placeholder="Số hiệu văn bản..." className="form-input h-8 text-xs" />
                    </div>
                  ))}
                </div>
             </div>

             {/* M. Ảnh chụp checklist */}
             <div className="pt-4 border-t border-white/5">
                <h4 className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider mb-3">M. Checklist Ảnh chụp máy hiện trường</h4>
                <div className="grid grid-cols-1 gap-1">
                   {[1, 2, 3, 5, 6, 7, 8, 9, 14].map(i => (
                      <label key={i} className="flex items-center gap-3 p-2 bg-black/20 rounded active:bg-gray-800">
                         <input type="checkbox" {...register(`M${i}_status`)} className="w-5 h-5 rounded border-gray-700 bg-gray-800 text-indigo-500" />
                         <span className="text-xs text-gray-300">Ảnh {i}. {i===1?'Modem':i===2?'Tủ Rack':i===3?'Máy chủ':i===5?'Hệ điều hành':i===6?'Antivirus':i===7?'Backup':i===8?'Camera':i===9?'PCCC':'Tổng quan'}</span>
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

      {/* BOTTOM ACTION BAR - RE-DESIGNED FOR MOBILE */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-md border-t border-white/10 p-3 z-50 shadow-[0_-10px_25px_rgba(0,0,0,0.5)]">
        <div className="w-full bg-gray-800 rounded-full h-1 mb-3 overflow-hidden">
           <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 transition-all duration-500" style={{ width: `${calculateProgress().percent}%` }}></div>
        </div>
        <div className="flex justify-between gap-2 h-14">
          <button type="button" onClick={() => setShowNetworkModal(true)} className="flex-none w-14 bg-gray-800/80 rounded-xl flex items-center justify-center border border-white/5 active:scale-95 transition-transform">
             <Network className="w-6 h-6 text-indigo-400" />
          </button>
          <button type="button" onClick={() => handleExport("baocao")} className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-white font-bold text-xs uppercase flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg shadow-indigo-500/20">
             <FileText className="w-5 h-5" /> Báo cáo
          </button>
          <button type="submit" className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl text-white font-bold text-xs uppercase flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg shadow-emerald-500/20">
             <Save className="w-5 h-5" /> Lưu
          </button>
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
