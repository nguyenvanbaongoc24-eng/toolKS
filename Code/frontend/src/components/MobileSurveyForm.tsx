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
    ten_don_vi: "", dia_chi: "", nguoi_dung_dau: "", so_dien_thoai: "", email: "",
    he_thong_thong_tin: "",
    can_bo_phu_trach: [],
    ket_noi_internet: [], 
    thiet_bi_mang: [],
    may_chu: [],
    camera: [],
    ip_tinh: [],
    ung_dung: [],
    ma_hoa_du_lieu: "Không", vpn: "Không", email_bao_mat: "Không",
    chinh_sach_mat_khau: "Không", anti_virus: "Không", sao_luu: "Không", 
    tuong_lua_loai: "", tuong_lua_chinh_sach: "",
    cap_nhat_he_dieu_hanh: "Không",
    dao_tao: [],
    kiem_tra_attt: [],
    port_switch: [],
    ghi_chu: ""
  };

  const { register, control, handleSubmit } = useForm({ defaultValues: defaultVals });

  const canBoFields = useFieldArray({ control, name: "can_bo_phu_trach" });
  const internetFields = useFieldArray({ control, name: "ket_noi_internet" });
  const tbMangFields = useFieldArray({ control, name: "thiet_bi_mang" });
  const mayChuFields = useFieldArray({ control, name: "may_chu" });
  const cameraFields = useFieldArray({ control, name: "camera" });
  const ungDungFields = useFieldArray({ control, name: "ung_dung" });
  const ipTinhFields = useFieldArray({ control, name: "ip_tinh" });
  const daoTaoFields = useFieldArray({ control, name: "dao_tao" });
  const kiemTraFields = useFieldArray({ control, name: "kiem_tra_attt" });

  const formData = useWatch({ control });
  
  useAutoSave(formData, 10000);

  const [showValidationModal, setShowValidationModal] = useState(false);
  
  const calculateProgress = () => {
     const fields = ["ten_don_vi", "he_thong_thong_tin", "nguoi_dung_dau", "dia_chi"];
     const filled = fields.filter(f => !!formData[f]).length;
     return { percent: Math.round((filled / fields.length) * 100), missing: fields.length - filled };
  };

  const Indicator = ({ name, required }: { name: string, required?: boolean }) => {
    const val = formData[name];
    const conf = formData.confidence_scores?.[name];
    if (!val && required) return <span title="Bắt buộc nhập"><AlertCircle className="w-4 h-4 text-rose-500 inline ml-2" /></span>;
    if (conf === 'low') return <span title="AI chưa chắc chắn. Vui lòng kiểm tra lại."><AlertTriangle className="w-4 h-4 text-amber-500 inline ml-2" /></span>;
    if (val) return <CheckCircle2 className="w-4 h-4 text-emerald-500 inline ml-2" />;
    return null;
  };

  const handleExport = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await axios.post(`${apiUrl}/api/generate-docx`, { data: formData }, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Phieu_Khao_Sat_ATTT.docx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      alert("Lỗi xuất file Word!");
    }
  };

  const handleExportReport = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await axios.post(`${apiUrl}/api/generate-report`, { data: formData }, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'BaoCaoKhaoSat_ATTT.docx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      alert("Lỗi xuất Báo cáo Khảo sát!");
    }
  };

  const triggerExportReport = () => {
    const missingRequired = ["ten_don_vi", "he_thong_thong_tin"].filter(f => !formData[f]);
    if (missingRequired.length > 0) {
       setShowValidationModal(true);
       return;
    }
    handleExportReport();
  };

  const onSubmit = async (data: any) => {
    try {
      await axios.post(`${API_URL}/api/surveys`, {
        ten_don_vi: data.ten_don_vi,
        doer: data.nguoi_thuc_hien,
        status: "Đang xử lý",
        data: data
      });
      alert("Hồ sơ đã được lưu vào Database thành công!");
    } catch (err) {
      alert("Lỗi lưu hồ sơ vào Database!");
    }
  };

  const toggleSection = (id: string) => {
    setExpandedSection(prev => prev === id ? null : id);
  };

  const AccordionHeader = ({ id, label, icon: Icon }: { id: string, label: string, icon: any }) => (
    <button 
      type="button" 
      onClick={() => toggleSection(id)}
      className="w-full flex items-center justify-between p-4 bg-gray-900/50 border border-white/10 rounded-xl mb-2 font-semibold"
    >
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-indigo-400" />
        {label}
      </div>
      {expandedSection === id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
    </button>
  );

  return (
    <>
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 pb-28 px-2">
      
      {/* 1. ĐƠN VỊ */}
      <div>
        <AccordionHeader id="don_vi" label="I. Đơn vị & Nhân sự" icon={Building} />
        {expandedSection === "don_vi" && (
          <div className="p-4 bg-black/20 rounded-xl mb-4 space-y-4 border border-white/5">
            <div className="bg-indigo-500/10 border border-indigo-500/20 p-3 rounded-lg mb-2">
              <label className="form-label text-indigo-400">Cán bộ thực hiện (Doer)</label>
              <select {...register("nguoi_thuc_hien")} className="form-input min-h-[44px]">
                <option value="">-- Chọn người làm hồ sơ --</option>
                {availableStaff.map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>
            <div><label className="form-label">Tên cơ quan (*) <Indicator name="ten_don_vi" required /></label><input {...register("ten_don_vi")} className="form-input min-h-[44px]" /></div>
            <div><label className="form-label">Hệ thống thông tin (*) <Indicator name="he_thong_thong_tin" required /></label><input {...register("he_thong_thong_tin")} className="form-input min-h-[44px]" /></div>
            <div><label className="form-label">Người đứng đầu <Indicator name="nguoi_dung_dau" /></label><input {...register("nguoi_dung_dau")} className="form-input min-h-[44px]" /></div>
            <div><label className="form-label">Địa chỉ <Indicator name="dia_chi" /></label><input {...register("dia_chi")} className="form-input min-h-[44px]" /></div>
            <div><label className="form-label">Điện thoại <Indicator name="so_dien_thoai" /></label><input {...register("so_dien_thoai")} className="form-input min-h-[44px]" /></div>
            <div><label className="form-label">Email <Indicator name="email" /></label><input {...register("email")} className="form-input min-h-[44px]" /></div>
            
            <div className="pt-4 border-t border-white/10">
              <div className="flex justify-between items-center mb-4">
                <label className="form-label font-bold mb-0 text-white">Cán bộ phụ trách</label>
                <button type="button" onClick={() => canBoFields.append({ ho_ten: "", chuc_vu: "", dien_thoai: "", email: "", trinh_do: "", chung_chi: "" })} className="btn-add py-2"><Plus className="w-4 h-4" /> Thêm</button>
              </div>
              {canBoFields.fields.map((field, idx) => (
                <div key={field.id} className="relative p-4 bg-gray-800/50 rounded-lg mb-3 border border-white/5 space-y-3">
                   <div><label className="form-label">Họ tên</label><input {...register(`can_bo_phu_trach.${idx}.ho_ten`)} className="form-input min-h-[44px]" /></div>
                   <div><label className="form-label">Đ.thoại</label><input {...register(`can_bo_phu_trach.${idx}.dien_thoai`)} className="form-input min-h-[44px]" /></div>
                   <button type="button" onClick={() => canBoFields.remove(idx)} className="absolute top-2 right-2 p-2 text-rose-500 rounded-lg bg-rose-500/10"><Trash2 className="w-4 h-4"/></button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. HẠ TẦNG */}
      <div>
        <AccordionHeader id="ha_tang" label="II. Hạ tầng & Mạng" icon={Router} />
        {expandedSection === "ha_tang" && (
          <div className="p-4 bg-black/20 rounded-xl mb-4 space-y-6 border border-white/5">
            {/* Thiết bị mạng */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="form-label font-bold mb-0 text-white">Router/Switch</label>
                <button type="button" onClick={() => tbMangFields.append({ loai_thiet_bi: "", hang: "", serial: "", vi_tri: "" })} className="btn-add py-2"><Plus className="w-4 h-4" /></button>
              </div>
              {tbMangFields.fields.map((field, idx) => (
                <div key={field.id} className="relative p-4 bg-gray-800/50 rounded-lg mb-3 border border-white/5 space-y-3">
                   <div><label className="form-label">Loại (VD: Switch)</label><input {...register(`thiet_bi_mang.${idx}.loai_thiet_bi`)} className="form-input min-h-[44px]" /></div>
                   <div><label className="form-label">Hãng</label><input {...register(`thiet_bi_mang.${idx}.hang`)} className="form-input min-h-[44px]" /></div>
                   <div><label className="form-label">Serial</label><input {...register(`thiet_bi_mang.${idx}.serial`)} className="form-input min-h-[44px]" /></div>
                   <div><label className="form-label">Vị trí</label><input {...register(`thiet_bi_mang.${idx}.vi_tri`)} className="form-input min-h-[44px]" /></div>
                   <button type="button" onClick={() => tbMangFields.remove(idx)} className="absolute top-2 right-2 p-2 text-rose-500 rounded-lg bg-rose-500/10"><Trash2 className="w-4 h-4"/></button>
                </div>
              ))}
            </div>

            {/* Máy chủ */}
            <div className="pt-4 border-t border-white/10">
              <div className="flex justify-between items-center mb-4">
                <label className="form-label font-bold mb-0 text-white">Máy chủ</label>
                <button type="button" onClick={() => mayChuFields.append({ vai_tro: "", hang: "", serial: "" })} className="btn-add py-2"><Plus className="w-4 h-4" /></button>
              </div>
              {mayChuFields.fields.map((field, idx) => (
                <div key={field.id} className="relative p-4 bg-gray-800/50 rounded-lg mb-3 border border-white/5 space-y-3">
                   <div><label className="form-label">Vai trò</label><input {...register(`may_chu.${idx}.vai_tro`)} className="form-input min-h-[44px]" /></div>
                   <div><label className="form-label">Hãng</label><input {...register(`may_chu.${idx}.hang`)} className="form-input min-h-[44px]" /></div>
                   <button type="button" onClick={() => mayChuFields.remove(idx)} className="absolute top-2 right-2 p-2 text-rose-500 rounded-lg bg-rose-500/10"><Trash2 className="w-4 h-4"/></button>
                </div>
              ))}
            </div>
            
            {/* Camera */}
            <div className="pt-4 border-t border-white/10">
              <div className="flex justify-between items-center mb-4">
                <label className="form-label font-bold mb-0 text-white">Camera</label>
                <button type="button" onClick={() => cameraFields.append({ vi_tri: "", hang: "" })} className="btn-add py-2"><Plus className="w-4 h-4" /></button>
              </div>
              {cameraFields.fields.map((field, idx) => (
                <div key={field.id} className="relative p-4 bg-gray-800/50 rounded-lg mb-3 border border-white/5 space-y-3">
                   <div><label className="form-label">Vị trí</label><input {...register(`camera.${idx}.vi_tri`)} className="form-input min-h-[44px]" /></div>
                   <button type="button" onClick={() => cameraFields.remove(idx)} className="absolute top-2 right-2 p-2 text-rose-500 rounded-lg bg-rose-500/10"><Trash2 className="w-4 h-4"/></button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. DỊCH VỤ & ỨNG DỤNG */}
      <div>
        <AccordionHeader id="ung_dung" label="III. Dịch vụ & Ứng dụng" icon={MonitorPlay} />
        {expandedSection === "ung_dung" && (
          <div className="p-4 bg-black/20 rounded-xl mb-4 space-y-4 border border-white/5">
            <div className="flex justify-between items-center mb-4">
              <label className="form-label font-bold mb-0 text-white">Phần mềm / Ứng dụng</label>
              <button type="button" onClick={() => ungDungFields.append({ ten_ung_dung: "", chuc_nang: "" })} className="btn-add py-2"><Plus className="w-4 h-4" /></button>
            </div>
             {ungDungFields.fields.map((field, idx) => (
               <div key={field.id} className="relative p-4 bg-gray-800/50 rounded-lg mb-3 border border-white/5 space-y-3">
                  <div><label className="form-label">Tên Ứng dụng</label><input {...register(`ung_dung.${idx}.ten_ung_dung`)} className="form-input min-h-[44px]" /></div>
                  <div><label className="form-label">Chức năng</label><input {...register(`ung_dung.${idx}.chuc_nang`)} className="form-input min-h-[44px]" /></div>
                  <button type="button" onClick={() => ungDungFields.remove(idx)} className="absolute top-2 right-2 p-2 text-rose-500 rounded-lg bg-rose-500/10"><Trash2 className="w-4 h-4"/></button>
               </div>
             ))}
          </div>
        )}
      </div>

      {/* 4. AN TOÀN BẢO MẬT */}
      <div>
        <AccordionHeader id="bao_mat" label="IV. An toàn Bảo mật" icon={ShieldAlert} />
        {expandedSection === "bao_mat" && (
          <div className="p-4 bg-black/20 rounded-xl mb-4 space-y-4 border border-white/5">
            <div>
              <label className="form-label">Chính sách mật khẩu mạnh</label>
              <select {...register("chinh_sach_mat_khau")} className="form-input min-h-[44px]">
                <option value="Có">Có áp dụng</option>
                <option value="Không">Không áp dụng, tự do</option>
              </select>
            </div>
            <div>
              <label className="form-label">Phần mềm Anti-virus</label>
              <select {...register("anti_virus")} className="form-input min-h-[44px]">
                <option value="Có - Có bản quyền">Có mua bản quyền</option>
                <option value="Có - Miễn phí">Dùng bản miễn phí</option>
                <option value="Không">Không cài đặt</option>
              </select>
            </div>
            <div>
              <label className="form-label">Tường lửa (Firewall)</label>
              <input {...register("tuong_lua_loai")} className="form-input min-h-[44px]" />
            </div>
          </div>
        )}
      </div>

      {/* 5. ĐÁNH GIÁ & KHÁC */}
      <div>
        <AccordionHeader id="danh_gia" label="V. Đánh giá & Sơ đồ" icon={LayoutPanelLeft} />
        {expandedSection === "danh_gia" && (
           <div className="p-4 bg-black/20 rounded-xl mb-4 space-y-4 border border-white/5">
             <div className="flex justify-between items-center mb-4">
              <label className="form-label font-bold mb-0 text-white">Chương trình đào tạo ATTT</label>
              <button type="button" onClick={() => daoTaoFields.append({ chu_de: "", nam: "" })} className="btn-add py-2"><Plus className="w-4 h-4" /></button>
             </div>
             {daoTaoFields.fields.map((field, idx) => (
                <div key={field.id} className="relative p-2 pl-4 bg-gray-800/50 rounded-lg mb-2 flex items-center gap-2">
                   <input {...register(`dao_tao.${idx}.chu_de`)} placeholder="Chủ đề..." className="form-input min-h-[44px] flex-1" />
                   <button type="button" onClick={() => daoTaoFields.remove(idx)} className="p-3 text-rose-500 rounded-lg bg-rose-500/10"><Trash2 className="w-4 h-4"/></button>
                </div>
             ))}

             <div className="flex justify-between items-center mt-6 mb-4">
              <label className="form-label font-bold mb-0 text-white">Kiểm tra Đánh giá ATTT</label>
              <button type="button" onClick={() => kiemTraFields.append({ don_vi_thuc_hien: "", nam: "" })} className="btn-add py-2"><Plus className="w-4 h-4" /></button>
             </div>
             {kiemTraFields.fields.map((field, idx) => (
                <div key={field.id} className="relative p-2 pl-4 bg-gray-800/50 rounded-lg mb-2 flex items-center gap-2">
                   <input {...register(`kiem_tra_attt.${idx}.don_vi_thuc_hien`)} placeholder="Đơn vị kiểm tra..." className="form-input min-h-[44px] flex-1" />
                   <button type="button" onClick={() => kiemTraFields.remove(idx)} className="p-3 text-rose-500 rounded-lg bg-rose-500/10"><Trash2 className="w-4 h-4"/></button>
                </div>
             ))}

             <div className="mt-6">
                <label className="form-label text-white font-bold">Ghi chú thêm</label>
                <textarea {...register("ghi_chu")} className="form-input min-h-[100px]" placeholder="Nhập thêm ghi chú..."></textarea>
             </div>
           </div>
        )}
      </div>

      {/* BOTTOM ACTION BAR - MOBILE STYLE */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur border-t border-gray-800 p-3 z-50">
        <div className="w-full bg-gray-800 rounded-full h-1.5 mb-2 overflow-hidden">
           <div className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500" style={{ width: `${calculateProgress().percent}%` }}></div>
        </div>
        <div className="flex justify-between gap-2">
          <button type="button" onClick={() => setShowNetworkModal(true)} className="flex-1 btn-secondary flex-col gap-1 py-2 h-auto text-xs justify-center bg-gray-800/50">
             <Network className="w-5 h-5 text-indigo-400" /> Sơ đồ
          </button>
          <button type="button" onClick={triggerExportReport} className="flex-1 btn-primary flex-col gap-1 py-2 h-auto text-xs justify-center bg-gradient-to-t from-orange-600 to-amber-500 border-none">
             <FileText className="w-5 h-5" /> Báo cáo
          </button>
          <button type="submit" className="flex-1 btn-primary flex-col gap-1 py-2 h-auto text-xs justify-center bg-gradient-to-t from-indigo-600 to-violet-500 border-none">
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
              <button type="button" onClick={() => { setShowValidationModal(false); handleExportReport(); }} className="btn-primary flex-1 justify-center bg-rose-500 py-3">Vẫn Xuất</button>
            </div>
          </div>
        </div>
      )}
    </form>
    </>
  );
}
