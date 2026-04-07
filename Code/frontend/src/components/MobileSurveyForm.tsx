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
    
    // Tab 2: Hạ tầng & Mạng (Mục D, E, F, G, H, I)
    ket_noi_internet: [], D2_router_modem: "", D3_ip_lan_gateway: "",
    thiet_bi_mang: [], E2_firewall_type: "Dùng Firewall tích hợp",
    F1_pc_sl: "", F1_pc_os: "Windows 10/11", F1_laptop_sl: "", F1_laptop_os: "Windows 10/11",
    F1_tablet_sl: "", F1_mayin_sl: "", F1_dienthoai_sl: "",
    F2_khong_may_chu_has: "Không", F2_luu_tru_o_dau: "",
    may_chu: [], F3_cloud_has: "Không", F3_ten_cloud: "",
    camera: [], G2_dau_ghi_nvr: "", G3_luu_tru_ngay: "",
    H1_dai_ip_lan: "", H2_ip_gateway: "", H3_dns: "", H4_co_vlan: "Không", H4_so_vlan: "", H4_mo_ta_vlan: "",
    ip_tinh: [],
    ung_dung: [],
    
    // Tab 3: An toàn Bảo mật (K, L, P, Q)
    k1_quy_che: "", k2_ke_hoach_ht: "", k3_ke_hoach_tr: "", k4_qd_can_bo: "",
    K5_qd_phe_duyet_httt: "", K6_ung_pho_su_co: "", K7_bien_ban_kiem_tra: "",
    l1_phys_key: "Không có kiểm soát riêng", L1_bang_ky_ten: "Không",
    l2_pass_policy: "Không có chính sách thống nhất",
    l3_av_has: "Không", l3_av_name: "",
    l4_bak_has: "Không sao lưu", L4_offsite_has: "Không",
    p1_protocol: "HTTP (không mã hóa)",
    p2_vpn: "Không có VPN", p2_vpn_type: "",
    P3_ket_noi_cap_tren_type: "Không kết nối",
    P4_ma_hoa_luu_tru_has: "Không", P4_phuong_phap: "",
    P5_email_sec: "Không",
    cap_nhat_he_dieu_hanh: "Không", Q2_cap_nhat_ung_dung: "Không", 
    Q3_nguoi_patching: "", Q4_cap_nhat_firmware_tb_mang: "Chưa cập nhật", Q5_theo_doi_canh_bao: "Không",
    
    // Tab 4: Đào tạo & Kiểm tra (R, S)
    dao_tao: [],
    kiem_tra_attt: [],

    // Tab 5: Xác nhận & Hình ảnh (M, N, T, BC)
    ...Array.from({ length: 14 }, (_, i) => ({ [`M${i+1}_status`]: false })).reduce((a, b) => ({ ...a, ...b }), {}),
    n_nguoi_lap: "", n_chuc_vu_lap: "", n_ngay_lap: new Date().toISOString().split('T')[0],
    N_nguoi_kiem_tra_ho_ten: "", N_nguoi_kiem_tra_chuc_vu: "", N_ngay_kiem_tra: "",
    N_thu_truong_ho_ten: "", N_thu_truong_chuc_vu: "", N_ngay_ky: "",
    T1_1_co_dmz: "Không", T1_1_may_chu_dmz: "", 
    T1_2_wifi_tach_rieng: "Không có WiFi",
    T3_1_co_rack: "Không", T3_1_rack_u: "", T3_1_rack_vi_tri: "", T3_2_thiet_bi_trong_tu: "",
    T4_1_loai_cap: "Cáp đồng (Cat5e/Cat6)", T4_2_cap_isp: "",
    BC_so_bao_cao: "", BC_ngay_bao_cao: "", BC_don_vi_thuc_hien: "", 
    BC_qd_ubnd_tinh_so_attt: "", BC_qd_ubnd_tinh_phan_cong: "", BC_ten_tinh: "Lâm Đồng",
    BC_ngay_bao_cao_date: "",
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
  const daoTaoFields = useFieldArray({ control, name: "dao_tao" });
  const kiemTraFields = useFieldArray({ control, name: "kiem_tra_attt" });

  const formData = watch();
  
  useAutoSave(formData, 10000);

  const [showValidationModal, setShowValidationModal] = useState(false);
  
  const calculateProgress = () => {
     const fields = ["ten_don_vi", "he_thong_thong_tin", "nguoi_dung_dau", "dia_chi"];
     const filled = fields.filter(f => !!formData[f as keyof typeof formData]).length;
     return { percent: Math.round((filled / fields.length) * 100), missing: fields.length - filled };
  };

  const Indicator = ({ name, required }: { name: string, required?: boolean }) => {
    const val = formData[name as keyof typeof formData];
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 pb-28 px-2 max-w-full overflow-hidden text-white bg-black/20">
      
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
                        <div className="grid grid-cols-2 gap-2 mt-1">
                           <input {...register(`can_bo_phu_trach.${idx}.ho_ten`)} placeholder="Họ tên" className="form-input text-xs" />
                           <input {...register(`can_bo_phu_trach.${idx}.chuc_vu`)} placeholder="Chức vụ" className="form-input text-xs" />
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-1">
                           <input {...register(`can_bo_phu_trach.${idx}.dien_thoai`)} placeholder="SĐT" className="form-input text-xs" />
                           <input {...register(`can_bo_phu_trach.${idx}.email`)} placeholder="Email" className="form-input text-xs" />
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-1">
                           <input {...register(`can_bo_phu_trach.${idx}.trinh_do`)} placeholder="Trình độ" className="form-input text-xs h-11" />
                           <input {...register(`can_bo_phu_trach.${idx}.chung_chi`)} placeholder="Chứng chỉ ATTT" className="form-input text-xs h-11" />
                        </div>
                     </div>
                  </div>
                ))}
             </div>

             <div className="pt-4 border-t border-white/5 space-y-3">
                <h4 className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">C. Hệ thống thông tin (HTTT)</h4>
                <div><label className="form-label">Tên HTTT (*) <Indicator name="he_thong_thong_tin" required /></label><input {...register("he_thong_thong_tin")} className="form-input" /></div>
                <div><label className="form-label">Mô tả chức năng (C1)</label><textarea {...register("C1_mo_ta_chuc_nang")} className="form-input min-h-[60px]" placeholder="Phục vụ công tác quản lý..." /></div>
                <div><label className="form-label">Đối tượng người dùng (C2)</label><input {...register("C2_doi_tuong_nguoi_dung")} className="form-input" /></div>
                <div className="grid grid-cols-2 gap-2">
                   <div><label className="form-label text-[10px]">Người dùng NB (C5.i)</label><input {...register("C5_noi_bo")} className="form-input h-11" type="number" /></div>
                   <div><label className="form-label text-[10px]">Lượt GD ngoài (C5.ii)</label><input {...register("C5_ben_ngoai")} className="form-input h-11" type="number" /></div>
                </div>
                <div><label className="form-label">Xử lý bí mật NN (C8)</label>
                   <div className="flex gap-2">
                      <select {...register("C8_bi_mat_nha_nuoc_has")} className="form-input flex-1 h-11">
                         <option value="Không">Không</option>
                         <option value="Có">Có</option>
                      </select>
                      {formData.C8_bi_mat_nha_nuoc_has === "Có" && (
                         <select {...register("C8_do_mat")} className="form-input flex-1 h-11">
                            <option value="Mật">Mật</option><option value="Tối mật">Tối mật</option><option value="Tuyệt mật">Tuyệt mật</option>
                         </select>
                      )}
                   </div>
                </div>
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
                    <input {...register(`ket_noi_internet.${idx}.nha_cung_cap`)} placeholder="ISP (VNPT, Viettel...)" className="form-input text-xs mb-2 h-11" />
                    <div className="grid grid-cols-2 gap-2">
                       <input {...register(`ket_noi_internet.${idx}.bang_thong`)} placeholder="Băng thông" className="form-input text-xs h-11" />
                       <select {...register(`ket_noi_internet.${idx}.vai_tro`)} className="form-input text-xs h-11"><option value="Đường chính">Chính</option><option value="Dự phòng">Dự phòng</option></select>
                    </div>
                 </div>
               ))}
               <div className="grid grid-cols-2 gap-2">
                  <div><label className="form-label text-[10px]">Gateway (D2)</label><input {...register("D2_router_modem")} className="form-input h-11 text-xs" /></div>
                  <div><label className="form-label text-[10px]">IP Gateway (D3)</label><input {...register("D3_ip_lan_gateway")} className="form-input h-11 text-xs" /></div>
               </div>
             </div>

             {/* E. Firewall & Switch */}
             <div className="pt-4 border-t border-white/5">
                <div className="flex justify-between items-center mb-3">
                  <label className="form-label font-bold text-rose-400 uppercase text-[10px]">E. Thiết bị mạng & Firewall</label>
                  <button type="button" onClick={() => tbMangFields.append({ loai_thiet_bi: "", hang: "", model: "", serial: "", nam_mua: "" })} className="bg-rose-500/20 text-rose-400 p-1 rounded-lg"><Plus className="w-4 h-4" /></button>
                </div>
                <div className="mb-3">
                   <label className="form-label text-[10px]">Loại Firewall (E2)</label>
                   <select {...register("E2_firewall_type")} className="form-input h-11">
                      <option value="Dùng Firewall tích hợp">Dùng Firewall tích hợp (Router)</option>
                      <option value="Có (phần cứng chuyên dụng)">Có (phần cứng chuyên dụng)</option>
                      <option value="Dùng phần mềm Firewall">Dùng phần mềm Firewall</option>
                   </select>
                </div>
                {tbMangFields.fields.map((field, idx) => (
                  <div key={field.id} className="p-3 bg-white/5 rounded-lg mb-2 border border-white/5">
                     <div className="flex justify-between mb-2">
                        <span className="text-[9px] text-gray-500 uppercase">GATEWAY/SWITCH #{idx+1}</span>
                        <button type="button" onClick={() => tbMangFields.remove(idx)} className="text-rose-400"><Trash2 className="w-3 h-3"/></button>
                     </div>
                     <input {...register(`thiet_bi_mang.${idx}.loai_thiet_bi`)} placeholder="Loại (Switch, AP...)" className="form-input text-xs h-11 mb-2" />
                     <div className="grid grid-cols-2 gap-2">
                        <input {...register(`thiet_bi_mang.${idx}.hang`)} placeholder="Hãng" className="form-input text-xs h-11" />
                        <input {...register(`thiet_bi_mang.${idx}.model`)} placeholder="Model" className="form-input text-xs h-11" />
                     </div>
                  </div>
                ))}
             </div>

             {/* F. Đầu cuối & Máy chủ */}
             <div className="pt-4 border-t border-white/5">
                <h4 className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider mb-2 text-center">F. Thiết bị đầu cuối & Máy chủ</h4>
                <div className="grid grid-cols-2 gap-2 mb-4">
                   {["F1_pc_sl", "F1_laptop_sl", "F1_mayin_sl", "F1_dienthoai_sl"].map(f => (
                      <div key={f} className="flex flex-col">
                         <label className="text-[9px] text-gray-500 mb-1">{f.split('_')[1].toUpperCase()}</label>
                         <input {...register(f as any)} type="number" className="form-input h-11 text-center" placeholder="SL" />
                      </div>
                   ))}
                </div>
                <div className="flex justify-between items-center mb-3">
                  <label className="form-label font-bold text-emerald-300 text-[10px]">MÁY CHỦ VẬT LÝ (F2)</label>
                  <button type="button" onClick={() => mayChuFields.append({ vai_tro: "", hang: "", serial: "", ram: "", hdd: "", vi_tri: "" })} className="bg-emerald-500/20 text-emerald-400 p-1 rounded-lg"><Plus className="w-4 h-4" /></button>
                </div>
                {mayChuFields.fields.map((field, idx) => (
                  <div key={field.id} className="p-3 bg-black/20 rounded-lg mb-2 border border-white/5">
                     <div className="flex justify-between mb-2">
                        <span className="text-[9px] text-gray-400">SERVER #{idx+1}</span>
                        <button type="button" onClick={() => mayChuFields.remove(idx)} className="text-rose-400"><Trash2 className="w-3 h-3"/></button>
                     </div>
                     <input {...register(`may_chu.${idx}.vai_tro`)} placeholder="Vai trò (AD, File...)" className="form-input text-xs h-11 mb-2" />
                     <div className="grid grid-cols-2 gap-2">
                        <input {...register(`may_chu.${idx}.hang`)} placeholder="Hãng/Model" className="form-input text-xs h-11" />
                        <input {...register(`may_chu.${idx}.ram`)} placeholder="RAM" className="form-input text-xs h-11" />
                     </div>
                  </div>
                ))}
             </div>

             {/* G. Camera */}
             <div className="pt-4 border-t border-white/5">
                <div className="flex justify-between items-center mb-3">
                  <label className="form-label font-bold text-blue-400 uppercase text-[10px]">G. Camera & Đầu ghi</label>
                  <button type="button" onClick={() => cameraFields.append({ hang: "", model: "", serial: "", vi_tri: "" })} className="bg-blue-500/20 text-blue-400 p-1 rounded-lg"><Plus className="w-4 h-4" /></button>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                   <div><label className="text-[9px] text-gray-500">Đầu ghi NVR (G2)</label><input {...register("G2_dau_ghi_nvr")} className="form-input h-11 text-xs" /></div>
                   <div><label className="text-[9px] text-gray-500">Lưu trữ (G3)</label><input {...register("G3_luu_tru_ngay")} className="form-input h-11 text-xs" type="number" /></div>
                </div>
                {cameraFields.fields.map((field, idx) => (
                  <div key={field.id} className="p-2 bg-white/5 rounded-lg mb-2 flex items-center gap-2">
                     <input {...register(`camera.${idx}.hang`)} placeholder="Hãng" className="form-input text-xs h-11 flex-1" />
                     <input {...register(`camera.${idx}.vi_tri`)} placeholder="Vị trí" className="form-input text-xs h-11 flex-1" />
                     <button type="button" onClick={() => cameraFields.remove(idx)} className="text-rose-400 p-1"><Trash2 className="w-3.5 h-3.5"/></button>
                  </div>
                ))}
             </div>

             {/* H. LAN & IP & I. Applications */}
             <div className="pt-4 border-t border-white/5 space-y-4">
                <h4 className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">H. Quy hoạch IP LAN</h4>
                <div className="grid grid-cols-2 gap-2">
                   <div><label className="text-[9px] text-gray-500 uppercase">Dải IP (H1)</label><input {...register("H1_dai_ip_lan")} className="form-input h-11 text-xs" /></div>
                   <div><label className="text-[9px] text-gray-500 uppercase">IP Gateway (H2)</label><input {...register("H2_ip_gateway")} className="form-input h-11 text-xs" /></div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                   <div><label className="text-[9px] text-gray-500 uppercase">DNS (H3)</label><input {...register("H3_dns")} className="form-input h-11 text-xs" /></div>
                   <div><label className="text-[9px] text-gray-500 uppercase">VLAN? (H4)</label>
                      <select {...register("H4_co_vlan")} className="form-input h-11">
                         <option value="Không">Không</option><option value="Có">Có</option>
                      </select>
                   </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                   <label className="text-[10px] uppercase font-bold text-amber-400">I. Ứng dụng & Dịch vụ</label>
                   <button type="button" onClick={() => ungDungFields.append({ ten_ung_dung: "", chuc_nang: "", don_vi: "", phien_ban: "" })} className="bg-amber-500/20 text-amber-400 p-1 rounded-lg"><Plus className="w-4 h-4" /></button>
                </div>
                {ungDungFields.fields.map((field, idx) => (
                  <div key={field.id} className="p-3 bg-white/5 rounded-lg mb-2 border border-white/5">
                     <div className="flex justify-between mb-2">
                        <span className="text-[9px] text-gray-500">APP #{idx+1}</span>
                        <button type="button" onClick={() => ungDungFields.remove(idx)} className="text-rose-400"><Trash2 className="w-3 h-3"/></button>
                     </div>
                     <input {...register(`ung_dung.${idx}.ten_ung_dung`)} placeholder="Tên phần mềm" className="form-input text-xs h-11 mb-2" />
                     <input {...register(`ung_dung.${idx}.chuc_nang`)} placeholder="Chức năng chính" className="form-input text-xs h-11" />
                  </div>
                ))}
             </div>
          </div>
        )}
      </div>

      {/* 3. AN TOÀN BẢO MẬT */}
      <div>
         <AccordionHeader id="bao_mat" label="III. An toàn Bảo mật" icon={ShieldAlert} />
         {expandedSection === "bao_mat" && (
           <div className="animate-fade-in p-4 bg-black/40 rounded-xl mb-4 space-y-6 border border-white/5 shadow-inner">
             
             {/* K. Hồ sơ pháp lý */}
             <div className="space-y-3">
                <h4 className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">K. Danh mục hồ sơ hiện có</h4>
                <div className="grid grid-cols-1 gap-2">
                   {[
                      {id: "k1_quy_che", label: "K1. Quy chế ATTT của đơn vị"},
                      {id: "k2_ke_hoach_ht", label: "K2. Danh mục tài sản / HTTT"},
                      {id: "k3_ke_hoach_tr", label: "K3. Kế hoạch ứng phó sự cố"},
                      {id: "k4_qd_can_bo", label: "K4. QĐ phân công Cán bộ phụ trách"},
                      {id: "K5_qd_phe_duyet_httt", label: "K5. QĐ phê duyệt cấp độ HTTT"},
                      {id: "K6_ung_pho_su_co", label: "K6. Biên bản ứng phó sự cố"},
                      {id: "K7_bien_ban_kiem_tra", label: "K7. Biên bản kiểm tra định kỳ"}
                   ].map(k => (
                    <div key={k.id} className="p-3 bg-white/5 rounded border border-white/5">
                       <label className="text-[9px] text-gray-400 block mb-1 uppercase">{k.label}</label>
                       <input {...register(k.id as any)} placeholder="Số hiệu/Ngày ban hành..." className="form-input h-11 text-xs" />
                    </div>
                  ))}
                </div>
             </div>

             {/* L. Kiểm soát truy cập */}
             <div className="pt-4 border-t border-white/5 space-y-4">
                <h4 className="text-[10px] uppercase font-bold text-violet-400 tracking-wider">L. Kiểm soát & Giám sát</h4>
                <div><label className="form-label text-[10px]">Kiểm soát vật lý (L1)</label>
                   <select {...register("l1_phys_key")} className="form-input h-11">
                      <option value="Có khóa cửa (chìa khóa thường)">Có khóa cửa (chìa khóa thường)</option>
                      <option value="Có khóa cửa + camera giám sát">Có khóa cửa + camera giám sát</option>
                      <option value="Có thẻ từ / kiểm soát điện tử">Có thẻ từ / kiểm soát điện tử</option>
                      <option value="Không có kiểm soát riêng">Không có kiểm soát riêng</option>
                   </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                   <div><label className="form-label text-[10px]">Ban hành Pass? (L2)</label>
                      <select {...register("l2_pass_policy")} className="form-input h-11 "><option value="Không">Không</option><option value="Có chính sách mật khẩu">Có</option></select>
                   </div>
                   <div><label className="form-label text-[10px]">Yêu cầu 2FA? (L2.ii)</label>
                      <select {...register("L2_2fa_has")} className="form-input h-11 "><option value="Không">Không</option><option value="Có">Có</option></select>
                   </div>
                </div>
                <div className="bg-rose-500/5 p-4 rounded-lg border border-rose-500/10">
                   <label className="form-label text-rose-400 font-bold mb-3 uppercase text-[10px]">L8. Hạ tầng phòng máy (Server Room)</label>
                   <div className="space-y-4">
                      <div><label className="form-label text-[10px]">UPS (Nguồn dự phòng)? (L8.1)</label>
                         <div className="flex gap-2">
                            <select {...register("L8_1_co_ups")} className="form-input flex-1 h-11 "><option value="Không">Không</option><option value="Có">Có</option></select>
                            {formData.L8_1_co_ups === "Có" && <input {...register("L8_1_ups_hang_model")} className="form-input flex-1 h-11 text-xs" placeholder="Hãng/Model..." />}
                         </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                         <div><label className="form-label text-[10px]">Điều hòa (L8.2)</label>
                            <select {...register("L8_2_dieu_hoa")} className="form-input h-11 "><option value="Không">Không</option><option value="Có – 24/7">24/7</option><option value="Có – Hành chính">Hành chính</option></select>
                         </div>
                         <div><label className="form-label text-[10px]">PCCC (L8.3)</label>
                            <select {...register("L8_3_bin_chua_chay_has")} className="form-input h-11 "><option value="Không">Không</option><option value="Có">Có</option></select>
                         </div>
                      </div>
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                   <div><label className="form-label text-[10px]">Diệt Virus (L3)</label>
                      <select {...register("l3_av_has")} className="form-input h-11 "><option value="Không">Không</option><option value="Có">Có</option></select>
                   </div>
                   {formData.l3_av_has === "Có" && <input {...register("l3_av_name")} placeholder="Tên phần mềm..." className="form-input h-11 text-xs" />}
                </div>
                <div className="grid grid-cols-2 gap-2">
                   <div><label className="form-label text-[10px]">Sao lưu (L4)</label>
                     <select {...register("l4_bak_has")} className="form-input h-11 text-xs">
                        <option value="Có">Có (Tự động)</option>
                        <option value="Thủ công">Thủ công</option>
                        <option value="Không sao lưu">Không</option>
                     </select>
                   </div>
                   <div><label className="form-label text-[10px]">Lưu Log? (L5)</label>
                      <select {...register("l5_log_enabled")} className="form-input h-11 "><option value="Không">Không</option><option value="Có">Có</option></select>
                   </div>
                </div>
             </div>

             {/* P. Mã hóa & VPN */}
             <div className="pt-4 border-t border-white/5 space-y-4">
                <h4 className="text-[10px] uppercase font-bold text-orange-400 tracking-wider">P. Bảo mật kết nối & Mã hóa</h4>
                <div><label className="form-label text-[10px]">Giao thức Web (P1)</label>
                   <select {...register("p1_protocol")} className="form-input h-11">
                      <option value="HTTPS (có chứng chỉ SSL/TLS)">HTTPS (Có mã hóa)</option>
                      <option value="HTTP (không mã hóa)">HTTP (Không mã hóa)</option>
                   </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                   <div><label className="form-label text-[10px]">VPN từ xa (P2)</label>
                      <select {...register("p2_vpn")} className="form-input h-11"><option value="Không">Không</option><option value="Có">Có</option></select>
                   </div>
                   {formData.p2_vpn === "Có" && <input {...register("p2_vpn_type")} className="form-input h-11 text-xs" placeholder="Loại VPN..." />}
                </div>
                <div><label className="form-label text-[10px]">Kết nối cơ quan cấp trên (P3)</label>
                   <select {...register("P3_ket_noi_cap_tren_type")} className="form-input h-11">
                      <option value="Không kết nối">Không kết nối</option>
                      <option value="VPN chuyên dụng">VPN chuyên dụng</option>
                      <option value="MPLS">Đường truyền MPLS</option>
                   </select>
                </div>
             </div>

             {/* Q. Patching */}
             <div className="pt-4 border-t border-white/5 space-y-4">
                <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Q. Bảo trì & Cập nhật</h4>
                <div className="grid grid-cols-2 gap-2">
                   <div><label className="form-label text-[10px]">Cập nhật HĐH (Q1)</label>
                      <select {...register("cap_nhat_he_dieu_hanh")} className="form-input h-11 text-xs"><option value="Không">Không</option><option value="Định kỳ">Định kỳ</option><option value="Thủ công">Thủ công</option></select>
                   </div>
                   <div><label className="form-label text-[10px]">Firmware TB Mạng (Q4)</label>
                      <select {...register("Q4_cap_nhat_firmware_tb_mang")} className="form-input h-11 text-xs"><option value="Đã cập nhật">Đã cập nhật</option><option value="Chưa cập nhật">Chưa cập nhật</option></select>
                   </div>
                </div>
                <div><label className="form-label text-[10px]">Người chịu trách nhiệm (Q3)</label><input {...register("Q3_nguoi_patching")} className="form-input h-11 text-xs" /></div>
             </div>
           </div>
         )}
      </div>

       {/* 4. ĐÀO TẠO & KIỂM TRA */}
       <div>
         <AccordionHeader id="dao_tao" label="IV. Đào tạo & Kiểm tra" icon={GraduationCap} />
         {expandedSection === "dao_tao" && (
            <div className="animate-fade-in p-4 bg-black/40 rounded-xl mb-4 space-y-6 border border-white/5 shadow-inner">
               <div>
                 <div className="flex justify-between items-center mb-3">
                   <label className="form-label font-bold text-emerald-400 uppercase text-[10px]">R. Hoạt động đào tạo ATTT</label>
                   <button type="button" onClick={() => daoTaoFields.append({ hinh_thuc: "", don_vi_to_chuc: "", thoi_gian: "", so_can_bo: "", chung_chi_so_vb: "" })} className="bg-emerald-500/20 text-emerald-400 p-1 rounded-lg"><Plus className="w-4 h-4" /></button>
                 </div>
                 {daoTaoFields.fields.map((field, idx) => (
                   <div key={field.id} className="p-3 bg-white/5 rounded-lg mb-2 border border-white/5">
                     <div className="flex justify-between mb-2"><span className="text-[9px] text-gray-500 uppercase">KHOẢ #{idx+1}</span><button type="button" onClick={() => daoTaoFields.remove(idx)} className="text-rose-400"><Trash2 className="w-3 h-3"/></button></div>
                     <input {...register(`dao_tao.${idx}.hinh_thuc`)} placeholder="Hình thức (VD: Tập huấn...)" className="form-input text-xs h-11 mb-2" />
                     <div className="grid grid-cols-2 gap-2">
                        <input {...register(`dao_tao.${idx}.don_vi_to_chuc`)} placeholder="Đơn vị tổ chức" className="form-input text-xs h-11" />
                        <input {...register(`dao_tao.${idx}.thoi_gian`)} placeholder="Thời gian" className="form-input text-xs h-11" />
                     </div>
                     <div className="grid grid-cols-2 gap-2 mt-2">
                        <input {...register(`dao_tao.${idx}.so_can_bo`)} placeholder="Số cán bộ" className="form-input text-xs h-11" type="number" />
                        <input {...register(`dao_tao.${idx}.chung_chi_so_vb`)} placeholder="Số văn bản/CC" className="form-input text-xs h-11" />
                     </div>
                   </div>
                 ))}
               </div>
               <div className="pt-4 border-t border-white/5">
                 <div className="flex justify-between items-center mb-3">
                   <label className="form-label font-bold text-blue-400 uppercase text-[10px]">S. Kiểm tra, đánh giá định kỳ</label>
                   <button type="button" onClick={() => kiemTraFields.append({ loai_kiem_tra: "", don_vi_thuc_hien: "", thoi_gian: "", ket_qua_so_vb: "" })} className="bg-blue-500/20 text-blue-400 p-1 rounded-lg"><Plus className="w-4 h-4" /></button>
                 </div>
                 {kiemTraFields.fields.map((field, idx) => (
                   <div key={field.id} className="p-3 bg-white/5 rounded-lg mb-2 border border-white/5">
                     <div className="flex justify-between mb-2"><span className="text-[9px] text-gray-500 uppercase">LẦN #{idx+1}</span><button type="button" onClick={() => kiemTraFields.remove(idx)} className="text-rose-400"><Trash2 className="w-3 h-3"/></button></div>
                     <input {...register(`kiem_tra_attt.${idx}.loai_kiem_tra`)} placeholder="Loại (VD: Rà soát...)" className="form-input text-xs h-11 mb-2" />
                     <div className="grid grid-cols-2 gap-2">
                        <input {...register(`kiem_tra_attt.${idx}.don_vi_thuc_hien`)} placeholder="Đơn vị thực hiện" className="form-input text-xs h-11" />
                        <input {...register(`kiem_tra_attt.${idx}.thoi_gian`)} placeholder="Thời gian" className="form-input text-xs h-11" />
                     </div>
                     <input {...register(`kiem_tra_attt.${idx}.ket_qua_so_vb`)} placeholder="Kết quả / Số văn bản" className="form-input text-xs h-11 mt-2" />
                   </div>
                 ))}
               </div>
            </div>
         )}
       </div>

      {/* 5. XÁC NHẬN & HÌNH ẢNH */}
      <div>
         <AccordionHeader id="xac_nhan" label="V. Xác nhận & Hình ảnh" icon={FileText} />
         {expandedSection === "xac_nhan" && (
           <div className="animate-fade-in p-4 bg-black/40 rounded-xl mb-4 space-y-6 border border-white/5 shadow-inner">
              
              {/* M. Checklist Images */}
              <div className="space-y-3">
                 <h4 className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider mb-2">M. Ảnh chụp hiện trường (Checklist)</h4>
                 <div className="grid grid-cols-2 gap-1.5">
                    {[
                       "Modem/Router", "Tủ Rack", "Máy chủ", "Tem Serial",
                       "Hệ điều hành", "Antivirus", "Backup", "Camera/NVR",
                       "UPS/Điều hòa", "PCCC", "Sơ đồ mạng", "Bảng ký tên",
                       "Hệ thống dây", "Tổng quan"
                    ].map((label, i) => (
                       <label key={i} className="flex items-center gap-3 p-2 bg-black/20 rounded active:bg-gray-800 border border-white/5">
                          <input type="checkbox" {...register(`M${i+1}_status` as any)} className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-indigo-500" />
                          <span className="text-[9px] text-gray-300 truncate uppercase">{label}</span>
                       </label>
                    ))}
                 </div>
              </div>

              {/* N. Signatures */}
              <div className="pt-4 border-t border-white/5 space-y-4">
                 <h4 className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">N. Xác nhận chữ ký</h4>
                 <div className="p-3 bg-white/5 rounded border border-white/10">
                   <h3 className="text-[10px] font-bold text-indigo-400 uppercase mb-2">Người lập phiếu</h3>
                   <input {...register("n_nguoi_lap")} className="form-input text-xs mb-2 h-11" placeholder="Họ và tên" />
                   <input {...register("n_ngay_lap")} type="date" className="form-input text-xs h-11" />
                 </div>
                 <div className="p-3 bg-white/5 rounded border border-white/10">
                   <h3 className="text-[10px] font-bold text-emerald-400 uppercase mb-2">Người kiểm tra / Thủ trưởng</h3>
                   <input {...register("N_nguoi_kiem_tra_ho_ten")} className="form-input text-xs mb-2 h-11" placeholder="Họ và tên" />
                   <input {...register("N_ngay_kiem_tra")} type="date" className="form-input text-xs h-11" />
                 </div>
              </div>

              {/* T. Topology */}
              <div className="pt-4 border-t border-white/5 space-y-4">
                   <h4 className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">T. Đặc tả mạng & Vật lý</h4>
                   <div className="grid grid-cols-2 gap-3">
                      <div><label className="text-[9px] text-gray-500 uppercase">DMZ (T1.1)</label>
                         <select {...register("T1_1_co_dmz")} className="form-input h-11"><option value="Không">Không</option><option value="Có">Có</option></select>
                      </div>
                      <div><label className="text-[9px] text-gray-500 uppercase">WiFi riêng? (T1.2)</label>
                         <select {...register("T1_2_wifi_tach_rieng")} className="form-input h-11"><option value="Không">Không</option><option value="Có">Có</option></select>
                      </div>
                   </div>
                   <div className="grid grid-cols-2 gap-3">
                      <div><label className="text-[9px] text-gray-500 uppercase">Tủ Rack (T3)</label>
                         <select {...register("T3_1_co_rack")} className="form-input h-11 "><option value="Không">Không</option><option value="Có">Có</option></select>
                      </div>
                      {formData.T3_1_co_rack === "Có" && <input {...register("T3_1_rack_u")} className="form-input h-11 text-xs" placeholder="Số U (VD: 12U)" />}
                   </div>
              </div>

              {/* BC. Metadata */}
              <div className="pt-4 border-t border-white/5 space-y-3">
                 <h4 className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">BC. Metadata Báo cáo</h4>
                 <div className="grid grid-cols-1 gap-2">
                     <input {...register("BC_so_bao_cao")} placeholder="Số báo cáo (Số: .../BC-PH-ATTT)" className="form-input text-xs h-11" />
                     <input {...register("BC_don_vi_thuc_hien")} placeholder="Đơn vị thực hiện báo cáo" className="form-input text-xs h-11" />
                     <div className="grid grid-cols-2 gap-2">
                        <input {...register("BC_ten_tinh")} placeholder="Tại tỉnh/thành" className="form-input text-xs h-11" />
                        <input {...register("BC_ngay_bao_cao_date")} type="date" className="form-input text-xs h-11" />
                     </div>
                  </div>
              </div>

              <div className="pt-4 border-t border-white/5">
                 <label className="form-label text-white font-bold text-[10px] uppercase">Ghi chú hiện trường</label>
                 <textarea {...register("ghi_chu")} className="form-input min-h-[100px] text-xs" placeholder="Nhập thêm ghi chú quan trọng..."></textarea>
              </div>
           </div>
         )}
      </div>

       {/* BOTTOM ACTION BAR */}
       <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-md border-t border-white/10 p-3 z-50 shadow-[0_-10px_25px_rgba(0,0,0,0.8)]">
         <div className="w-full bg-gray-800 rounded-full h-1 mb-3 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 transition-all duration-500" style={{ width: `${calculateProgress().percent}%` }}></div>
         </div>
         
         <div className="flex flex-col gap-2">
            <div className="flex gap-2">
               <button type="button" onClick={() => handleExport("phieu")} className="flex-1 h-11 bg-indigo-500/20 text-indigo-400 rounded-lg text-[10px] font-bold uppercase border border-indigo-500/30 flex items-center justify-center gap-1.5 active:scale-95 transition-transform"><FileCheck className="w-4 h-4" /> Phiếu</button>
               <button type="button" onClick={() => handleExport("hsdx")} className="flex-1 h-11 bg-purple-500/20 text-purple-400 rounded-lg text-[10px] font-bold uppercase border border-purple-500/30 flex items-center justify-center gap-1.5 active:scale-95 transition-transform"><Shield className="w-4 h-4" /> HSDX</button>
               <button type="button" onClick={() => handleExport("baocao")} className="flex-1 h-11 bg-blue-500/20 text-blue-400 rounded-lg text-[10px] font-bold uppercase border border-blue-500/30 flex items-center justify-center gap-1.5 active:scale-95 transition-transform"><FileText className="w-4 h-4" /> Báo cáo</button>
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
             <button type="button" onClick={() => setShowNetworkModal(false)} className="p-2 bg-white/10 rounded-lg"><X className="w-5 h-5" /></button>
           </div>
           <div className="flex-1 overflow-auto p-4 flex items-start justify-center">
              <NetworkDiagram data={formData} />
           </div>
         </div>
       )}

       {showValidationModal && (
         <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
           <div className="bg-gray-900 border border-white/10 rounded-xl w-full p-6 shadow-2xl relative max-w-sm">
             <div className="w-12 h-12 bg-rose-500/10 rounded-full flex items-center justify-center mb-4 mx-auto"><AlertCircle className="w-6 h-6 text-rose-500" /></div>
             <h2 className="text-xl font-bold text-center mb-2">Thiếu thông tin</h2>
             <div className="bg-black/30 p-4 rounded-lg mb-6 border border-white/5 space-y-2 text-[11px] text-rose-400">
                {!formData.ten_don_vi && <div className="flex items-center gap-2"><XCircle className="w-3 h-3"/> Tên cơ quan chủ quản</div>}
                {!formData.he_thong_thong_tin && <div className="flex items-center gap-2"><XCircle className="w-3 h-3"/> Tên hệ thống thông tin</div>}
             </div>
             <div className="flex gap-3">
               <button type="button" onClick={() => setShowValidationModal(false)} className="flex-1 h-11 bg-white/10 rounded-lg text-white font-bold">Đóng</button>
               <button type="button" onClick={() => { setShowValidationModal(false); handleExport("baocao"); }} className="flex-1 h-11 bg-rose-600 rounded-lg text-white font-bold">Vẫn Xuất</button>
             </div>
           </div>
         </div>
       )}
    </form>
    </>
  );
}