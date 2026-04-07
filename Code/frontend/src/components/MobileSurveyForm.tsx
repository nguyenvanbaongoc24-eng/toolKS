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
    nguoi_thuc_hien: "",
    ngay_khao_sat: new Date().toISOString().split('T')[0],
    ten_don_vi: "", dia_chi: "", A6_ho_ten_thu_truong: "", so_dien_thoai: "", email: "", 
    A6_chuc_vu_thu_truong: "", A7_so_quyet_dinh: "",
    he_thong_thong_tin: "", C1_mo_ta_chuc_nang: "", C2_doi_tuong_nguoi_dung: "", C3_loai_du_lieu: "",
    C4_du_lieu_type: "Không xác định", C5_noi_bo: "", C5_ben_ngoai: "", C6_nam_hoat_dong: "",
    C7_ket_noi_cap_tren_has: "Không", C7_ten_he_thong_cap_tren: "",
    C8_bi_mat_nha_nuoc_has: "Không", C8_do_mat: "",
    can_bo_phu_trach: [],
    ket_noi_internet: [], D2_router_modem: "", D3_ip_lan_gateway: "",
    thiet_bi_mang: [], E2_firewall_type: "Dùng Firewall tích hợp",
    F1_pc_sl: "", F1_pc_os: "Windows 10/11", F1_laptop_sl: "", F1_laptop_os: "Windows 10/11",
    F1_tablet_sl: "", F1_mayin_sl: "", F1_dienthoai_sl: "",
    may_chu: [], camera: [], G2_dau_ghi_nvr: "", G3_luu_tru_ngay: "",
    H1_dai_ip_lan: "", H2_ip_gateway: "", H3_dns: "", H4_co_vlan: "Không", H4_so_vlan: "", H4_mo_ta_vlan: "",
    ip_tinh: [], ung_dung: [],
    k1_quy_che: "", k2_ke_hoach_ht: "", k3_ke_hoach_tr: "", k4_qd_can_bo: "",
    K5_qd_phe_duyet_httt: "", K6_ung_pho_su_co: "", K7_bien_ban_kiem_tra: "",
    l1_phys_key: "Không có kiểm soát riêng", l3_av_has: "Không", l4_bak_has: "Không sao lưu",
    l5_log_enabled: "Không", BC_so_bao_cao: "", BC_ngay_bao_cao: "", BC_don_vi_thuc_hien: "",
    BC_ten_tinh: "", ghi_chu: "",
    ...Array.from({ length: 14 }, (_, i) => ({ [`M${i+1}_status`]: false })).reduce((a, b) => ({ ...a, ...b }), {}),
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
     const fields = ["ten_don_vi", "he_thong_thong_tin", "dia_chi"];
     const filled = fields.filter(f => !!formData[f as keyof typeof formData]).length;
     return { percent: Math.round((filled / fields.length) * 100), missing: fields.length - filled };
  };

  const Indicator = ({ name, required }: { name: string, required?: boolean }) => {
    const val = formData[name as keyof typeof formData];
    if (!val && required) return <AlertCircle className="w-4 h-4 text-rose-500 inline ml-2" />;
    if (val) return <CheckCircle2 className="w-4 h-4 text-emerald-500 inline ml-2" />;
    return null;
  };

  const onSubmit = async (data: any) => {
    if (!data.ten_don_vi || !data.he_thong_thong_tin) {
      setShowValidationModal(true);
      return;
    }
    // Handle submission logic...
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 pb-28 px-2 max-w-full overflow-hidden text-white bg-black/20">
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
           </div>

           <div className="pt-4 border-t border-white/5">
              <div className="flex justify-between items-center mb-3">
                <label className="form-label font-bold mb-0 text-white">B. Nhân sự quản trị / Vận hành</label>
                <button type="button" onClick={() => canBoFields.append({ ho_ten: "", chuc_vu: "", so_dt: "", email: "", trinh_do: "", chung_chi_attt: "" })} className="bg-indigo-500/20 text-indigo-400 p-1.5 rounded-lg"><Plus className="w-4 h-4" /></button>
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
                   </div>
                </div>
              ))}
           </div>

           <div className="pt-4 border-t border-white/5 space-y-3">
              <h4 className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">C. Hệ thống thông tin (HTTT)</h4>
              <div><label className="form-label">Tên HTTT (*) <Indicator name="he_thong_thong_tin" required /></label><input {...register("he_thong_thong_tin")} className="form-input" /></div>
              <div><label className="form-label">Mô tả chức năng (C1)</label><textarea {...register("C1_mo_ta_chuc_nang")} className="form-input min-h-[60px] text-xs" /></div>
              <div className="p-3 bg-white/5 rounded border border-white/5">
                 <label className="form-label text-[10px]">Kết nối hệ thống cấp trên? (C7)</label>
                 <div className="flex gap-2">
                   <select {...register("C7_ket_noi_cap_tren_has")} className="form-input flex-1 h-11">
                      <option value="Không">Không</option><option value="Có">Có</option>
                   </select>
                   {formData.C7_ket_noi_cap_tren_has === "Có" && <input {...register("C7_ten_he_thong_cap_tren")} className="form-input flex-1 h-11 text-xs" placeholder="Tên hệ thống..." />}
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
              {tbMangFields.fields.map((field, idx) => (
                <div key={field.id} className="p-3 bg-white/5 rounded-lg mb-2 border border-white/5 shadow-md">
                   <div className="flex justify-between mb-2"><span className="text-[9px] text-gray-500 font-bold uppercase">Thiết bị #{idx+1}</span><button type="button" onClick={() => tbMangFields.remove(idx)} className="text-rose-400"><Trash2 className="w-3 h-3"/></button></div>
                   <input {...register(`thiet_bi_mang.${idx}.loai_thiet_bi`)} placeholder="Switch, AP, Firewall..." className="form-input text-xs h-11 mb-2" />
                   <div className="grid grid-cols-2 gap-2 mt-1">
                     <input {...register(`thiet_bi_mang.${idx}.hang_san_xuat`)} placeholder="Hãng sản xuất" className="form-input text-xs" />
                     <input {...register(`thiet_bi_mang.${idx}.model`)} placeholder="Model" className="form-input text-xs" />
                   </div>
                </div>
              ))}
           </div>

           <div className="pt-4 border-t border-white/5">
              <label className="form-label font-bold text-emerald-300 text-[10px] uppercase">F. Máy chủ & Đầu cuối</label>
              <div className="grid grid-cols-2 gap-2 mb-4">
                 <input {...register("F1_pc_sl")} placeholder="SL PC" className="form-input h-11 text-xs" type="number" />
                 <input {...register("F1_laptop_sl")} placeholder="SL Laptop" className="form-input h-11 text-xs" type="number" />
              </div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-[10px] text-emerald-300 font-bold">MÁY CHỦ VẬT LÝ</label>
                <button type="button" onClick={() => mayChuFields.append({ vai_tro: "", hang_model: "", so_serial: "", ram_gb: "", o_cung_tb: "", he_dieu_hanh: "", vi_tri: "" })} className="bg-emerald-500/20 text-emerald-400 p-1 rounded-lg"><Plus className="w-4 h-4" /></button>
              </div>
              {mayChuFields.fields.map((field, idx) => (
                 <div key={field.id} className="p-3 bg-black/40 rounded-lg mb-2 border border-white/5">
                    <div className="flex justify-between mb-2"><span className="text-[9px] text-gray-500 uppercase font-bold">Server #{idx+1}</span><button type="button" onClick={() => mayChuFields.remove(idx)} className="text-rose-400"><Trash2 className="w-3 h-3"/></button></div>
                    <input {...register(`may_chu.${idx}.vai_tro`)} placeholder="Vai trò (AD, File...)" className="form-input text-xs h-11 mb-2" />
                    <div className="grid grid-cols-2 gap-2 mb-2">
                       <input {...register(`may_chu.${idx}.hang_model`)} placeholder="Hãng / Model" className="form-input text-xs h-11" />
                       <input {...register(`may_chu.${idx}.ram_gb`)} placeholder="RAM (GB)" className="form-input text-xs h-11" />
                    </div>
                 </div>
              ))}
           </div>
           
           <div className="pt-4 border-t border-white/5">
              <div className="flex justify-between items-center mb-2">
                 <label className="text-[10px] uppercase font-bold text-indigo-400">H5. Danh sách IP Tĩnh</label>
                 <button type="button" onClick={() => ipTinhFields.append({ ten_thiet_bi: "", dia_chi_ip: "", ghi_chu: "" })} className="bg-indigo-500/20 text-indigo-400 p-1 rounded-lg"><Plus className="w-4 h-4" /></button>
              </div>
              {ipTinhFields.fields.map((field, idx) => (
                 <div key={field.id} className="p-3 bg-white/5 rounded-lg mb-2 border border-white/5 flex flex-col gap-2 shadow-md">
                     <div className="flex justify-between items-center"><span className="text-[9px] text-gray-500 uppercase font-bold">IP Tĩnh #{idx+1}</span><button type="button" onClick={() => ipTinhFields.remove(idx)} className="text-rose-400"><Trash2 className="w-3.5 h-3.5"/></button></div>
                     <input {...register(`ip_tinh.${idx}.ten_thiet_bi`)} placeholder="Tên thiết bị gán IP" className="form-input text-xs h-11" />
                     <input {...register(`ip_tinh.${idx}.dia_chi_ip`)} placeholder="Địa chỉ IP" className="form-input text-xs h-11" />
                 </div>
              ))}
           </div>

           <div className="pt-4 border-t border-white/5 transition-all">
              <div className="flex justify-between items-center mb-3">
                 <label className="text-[10px] uppercase font-bold text-amber-500">I. Ứng dụng & Dịch vụ</label>
                 <button type="button" onClick={() => ungDungFields.append({ ten: "", chuc_nang: "", don_vi_cung_cap: "", phien_ban: "", ket_noi_internet: "Có", ghi_chu: "" })} className="bg-amber-500/20 text-amber-500 p-1 rounded-lg"><Plus className="w-4 h-4" /></button>
              </div>
              {ungDungFields.fields.map((field, idx) => (
                <div key={field.id} className="p-4 bg-white/5 rounded-xl mb-3 border border-white/5 shadow-inner">
                   <div className="flex justify-between mb-3 border-b border-white/5 pb-2"><span className="text-[10px] text-gray-500 font-bold uppercase">App #{idx+1}</span><button type="button" onClick={() => ungDungFields.remove(idx)} className="text-rose-500 bg-rose-500/10 p-1.5 rounded-md"><Trash2 className="w-3.5 h-3.5"/></button></div>
                   <input {...register(`ung_dung.${idx}.ten`)} placeholder="Tên phần mềm" className="form-input text-xs h-11 mb-2" />
                   <input {...register(`ung_dung.${idx}.don_vi_cung_cap`)} placeholder="Đơn vị cung cấp" className="form-input text-xs h-11 mb-2" />
                </div>
              ))}
           </div>
        </div>
      )}

      <AccordionHeader id="bao_mat" label="III. An toàn Bảo mật" icon={ShieldAlert} />
      {expandedSection === "bao_mat" && (
        <div className="p-4 bg-black/40 rounded-xl mb-4 space-y-6 border border-white/5 shadow-inner">
           <div className="space-y-3">
              <h4 className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">K. Danh mục hồ sơ hiện có</h4>
              {[
                 {id: "k1_quy_che", label: "K1. Quy chế ATTT"},
                 {id: "k2_ke_hoach_ht", label: "K2. Danh mục tài sản"},
                 {id: "K5_qd_phe_duyet_httt", label: "K5. QĐ phê duyệt cấp độ"}
              ].map(k => (
                <div key={k.id} className="p-3 bg-white/5 rounded border border-white/5">
                   <label className="text-[9px] text-gray-400 block mb-1 uppercase">{k.label}</label>
                   <input {...register(k.id as any)} className="form-input h-11 text-xs" placeholder="Số/ngày ban hành..." />
                </div>
              ))}
           </div>
           
           <div className="pt-4 border-t border-white/5 space-y-4">
              <h4 className="text-[10px] uppercase font-bold text-violet-400 tracking-wider">L. Kiểm soát & Giám sát</h4>
              <div><label className="form-label text-[10px]">Kiểm soát vật lý (L1)</label>
                 <select {...register("l1_phys_key")} className="form-input h-11 text-xs">
                    <option value="Không có kiểm soát riêng">Không có kiểm soát riêng</option>
                    <option value="Có khóa cửa (chìa khóa thường)">Có khóa cửa (chìa khóa thường)</option>
                    <option value="Có khóa cửa + camera giám sát">Có khóa cửa + camera giám sát</option>
                    <option value="Có thẻ từ / kiểm soát điện tử">Có thẻ từ / kiểm soát điện tử</option>
                 </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                 <div><label className="form-label text-[10px]">Diệt Virus (L3)</label><select {...register("l3_av_has")} className="form-input h-11 text-xs"><option value="Không">Không</option><option value="Có">Có</option></select></div>
                 <div><label className="form-label text-[10px]">Sao lưu (L4)</label><select {...register("l4_bak_has")} className="form-input h-11 text-xs"><option value="Không sao lưu">Không</option><option value="Có">Có (Tự động)</option><option value="Thủ công">Thủ công</option></select></div>
              </div>
              <div><label className="form-label text-[10px]">Nhật ký hệ thống (L5)</label>
                 <select {...register("l5_log_enabled")} className="form-input h-11 text-xs">
                    <option value="Không">Không lưu nhật ký</option>
                    <option value="Có">Có lưu nhật ký (Syslog/EventLog)</option>
                 </select>
              </div>
              <div className="p-3 bg-indigo-500/5 rounded border border-indigo-500/10">
                 <h4 className="text-[10px] uppercase font-bold text-indigo-400 mb-2">P. Bảo mật đường truyền</h4>
                 <div className="space-y-3">
                    <div><label className="text-[9px] text-gray-500 uppercase">Giao thức (P1)</label><select {...register("p1_protocol")} className="form-input h-11 text-xs"><option value="HTTPS (có chứng chỉ SSL/TLS)">HTTPS</option><option value="HTTP (không mã hóa)">HTTP</option><option value="Cả hai">Cả hai</option></select></div>
                    <div><label className="text-[9px] text-gray-500 uppercase">Sử dụng VPN? (P2)</label><select {...register("p2_vpn")} className="form-input h-11 text-xs"><option value="Không có VPN">Không</option><option value="Có">Có (Client-to-Site/Site-to-Site)</option></select></div>
                 </div>
              </div>
              <div className="p-3 bg-emerald-500/5 rounded border border-emerald-500/10">
                 <h4 className="text-[10px] uppercase font-bold text-emerald-400 mb-2">Q. Cập nhật & Bảo trì</h4>
                 <div className="grid grid-cols-2 gap-2">
                    <div><label className="text-[9px] text-gray-500 uppercase">Update HĐH (Q1)</label><select {...register("cap_nhat_he_dieu_hanh")} className="form-input h-11 text-xs"><option value="Hàng tháng">Hàng tháng</option><option value="Thủ công">Thủ công</option><option value="Không">Không</option></select></div>
                    <div><label className="text-[9px] text-gray-500 uppercase">Update App (Q2)</label><select {...register("Q2_cap_nhat_ung_dung")} className="form-input h-11 text-xs"><option value="Tự động">Tự động</option><option value="Không">Không</option></select></div>
                 </div>
              </div>
           </div>
        </div>
      )}

      <AccordionHeader id="xac_nhan" label="IV. Xác nhận & Hình ảnh" icon={FileText} />
      {expandedSection === "xac_nhan" && (
        <div className="p-4 bg-black/40 rounded-xl mb-4 space-y-6 border border-white/5 shadow-inner">
           <div className="grid grid-cols-2 gap-1.5 mb-4">
              {["Modem", "Tủ Rack", "Máy chủ", "Tem Serial", "HĐH", "Antivirus", "Sơ đồ mạng", "Tổng quan"].map((label, i) => (
                 <label key={i} className="flex items-center gap-3 p-2 bg-black/20 rounded border border-white/5">
                    <input type="checkbox" {...register(`M${i+1}_status` as any)} className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-indigo-500" />
                    <span className="text-[9px] text-gray-300 truncate uppercase">{label}</span>
                 </label>
              ))}
           </div>
           <div className="pt-4 border-t border-white/5 space-y-4">
             <div className="p-3 bg-white/5 rounded border border-white/10">
               <h3 className="text-[10px] uppercase font-bold text-indigo-400 mb-2">Người lập phiếu</h3>
               <input {...register("n_nguoi_lap")} className="form-input text-xs mb-2 h-11" placeholder="Họ và tên" />
               <input {...register("n_ngay_lap")} type="date" className="form-input text-xs h-11" />
             </div>
             <div className="p-3 bg-white/5 rounded border border-white/10">
               <h4 className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Metadata Báo cáo</h4>
               <input {...register("BC_so_bao_cao")} placeholder="Số báo cáo" className="form-input text-xs h-11 mb-2" />
               <input {...register("BC_don_vi_thuc_hien")} placeholder="Đơn vị thực hiện báo cáo" className="form-input text-xs h-11" />
             </div>
             <div className="pt-2">
                <label className="form-label text-white font-bold text-[10px] uppercase">Ghi chú hiện trường</label>
                <textarea {...register("ghi_chu")} className="form-input min-h-[100px] text-xs" placeholder="..." />
             </div>
           </div>
           <button type="submit" className="w-full h-14 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 uppercase tracking-widest active:scale-95 transition-transform">
             <Save className="w-6 h-6" /> Lưu hồ sơ khảo sát
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
