"use client";

import { useForm, useFieldArray, useWatch } from "react-hook-form";
import NetworkDiagram from "./NetworkDiagram";
import { 
  Building, Globe, Server, Save, FileDown, Plus, Trash2, 
  Router, Video, MonitorPlay, ShieldAlert, Users, StickyNote
} from "lucide-react";
import axios from "axios";

export default function SurveyForm({ prefilledData }: { prefilledData?: any }) {
  const defaultVals = prefilledData || {
    ten_don_vi: "", dia_chi: "", nguoi_dung_dau: "", so_dien_thoai: "", email: "", so_can_bo: 0,
    ket_noi_internet: { nha_cung_cap: "", loai_ket_noi: "", bang_thong: "", ip_wan: "" },
    thiet_bi_mang: [], camera: [], may_chu: [], ung_dung: [],
    nhan_su: "", ghi_chu: ""
  };

  const { register, control, handleSubmit } = useForm({ defaultValues: defaultVals });

  // Arrays
  const tbMangFields = useFieldArray({ control, name: "thiet_bi_mang" });
  const cameraFields = useFieldArray({ control, name: "camera" });
  const mayChuFields = useFieldArray({ control, name: "may_chu" });
  const ungDungFields = useFieldArray({ control, name: "ung_dung" });

  const formData = useWatch({ control });

  const handleExport = async () => {
    try {
      const response = await axios.post("http://localhost:8000/api/generate-docx", {
        data: formData
      }, { responseType: 'blob' });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'BaoCaoKhaoSat_ATTT.docx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
      alert("Lỗi xuất file Word!");
    }
  };

  const onSubmit = (data: any) => {
    console.log("Saving...", data);
    alert("Hồ sơ đã được lưu tạm!");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-24">
      {/* A. THÔNG TIN CHUNG */}
      <div className="section-card">
        <h2 className="section-title"><span className="section-badge">A</span> <Building className="w-5 h-5 text-indigo-400" /> Thông tin chung</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="form-label">Tên cơ quan / Đơn vị</label>
            <input {...register("ten_don_vi")} className="form-input" />
          </div>
          <div><label className="form-label">Người đứng đầu</label><input {...register("nguoi_dung_dau")} className="form-input" /></div>
          <div><label className="form-label">Địa chỉ trụ sở</label><input {...register("dia_chi")} className="form-input" /></div>
          <div><label className="form-label">Điện thoại</label><input {...register("so_dien_thoai")} className="form-input" /></div>
          <div><label className="form-label">Email</label><input {...register("email")} className="form-input" /></div>
          <div><label className="form-label">Số lượng cán bộ (Người)</label><input type="number" {...register("so_can_bo")} className="form-input" /></div>
        </div>
      </div>

      {/* B. INTERNET */}
      <div className="section-card">
        <h2 className="section-title"><span className="section-badge bg-cyan-500">B</span> <Globe className="w-5 h-5 text-cyan-400" /> Kết nối Internet</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="form-label">Nhà cung cấp (ISP)</label><input {...register("ket_noi_internet.nha_cung_cap")} className="form-input" /></div>
          <div><label className="form-label">Loại đường truyền</label><input {...register("ket_noi_internet.loai_ket_noi")} className="form-input" /></div>
          <div><label className="form-label">Băng thông</label><input {...register("ket_noi_internet.bang_thong")} className="form-input" /></div>
          <div><label className="form-label">Địa chỉ IP WAN</label><input {...register("ket_noi_internet.ip_wan")} className="form-input" /></div>
        </div>
      </div>

      {/* C. NETWORK DEVICES */}
      <div className="section-card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="section-title mb-0"><span className="section-badge bg-rose-500">C</span> <Router className="w-5 h-5 text-rose-400" /> Thiết bị mạng / Bảo mật</h2>
          <button type="button" onClick={() => tbMangFields.append({ loai_thiet_bi: "", hang_san_xuat: "", model: "", vi_tri: "" })} className="btn-add"><Plus className="w-4 h-4" /> Thêm</button>
        </div>
        <div className="space-y-3">
          {tbMangFields.fields.map((field, idx) => (
            <div key={field.id} className="flex gap-2 items-end bg-black/20 p-3 rounded-lg border border-white/5">
              <div className="flex-1"><label className="form-label">Loại</label><input {...register(`thiet_bi_mang.${idx}.loai_thiet_bi`)} className="form-input" placeholder="Router" /></div>
              <div className="flex-1"><label className="form-label">Hãng</label><input {...register(`thiet_bi_mang.${idx}.hang_san_xuat`)} className="form-input" /></div>
              <div className="flex-1"><label className="form-label">Model</label><input {...register(`thiet_bi_mang.${idx}.model`)} className="form-input" /></div>
              <div className="flex-1"><label className="form-label">Vị trí</label><input {...register(`thiet_bi_mang.${idx}.vi_tri`)} className="form-input" /></div>
              <button type="button" onClick={() => tbMangFields.remove(idx)} className="btn-danger h-[42px]"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      </div>

      {/* E. SERVERS */}
      <div className="section-card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="section-title mb-0"><span className="section-badge bg-emerald-500">E</span> <Server className="w-5 h-5 text-emerald-400" /> Máy chủ</h2>
          <button type="button" onClick={() => mayChuFields.append({ ten: "", he_dieu_hanh: "", ram: "", o_cung: "" })} className="btn-add"><Plus className="w-4 h-4" /> Thêm</button>
        </div>
        <div className="space-y-3">
          {mayChuFields.fields.map((field, idx) => (
            <div key={field.id} className="flex gap-2 items-end bg-black/20 p-3 rounded-lg border border-white/5">
              <div className="flex-1"><label className="form-label">Tên</label><input {...register(`may_chu.${idx}.ten`)} className="form-input" /></div>
              <div className="flex-1"><label className="form-label">Hệ điều hành</label><input {...register(`may_chu.${idx}.he_dieu_hanh`)} className="form-input" /></div>
              <div className="flex-1"><label className="form-label">RAM</label><input {...register(`may_chu.${idx}.ram`)} className="form-input" /></div>
              <div className="flex-1"><label className="form-label">Ổ cứng</label><input {...register(`may_chu.${idx}.o_cung`)} className="form-input" /></div>
              <button type="button" onClick={() => mayChuFields.remove(idx)} className="btn-danger h-[42px]"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      </div>

      {/* F. APPS */}
      <div className="section-card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="section-title mb-0"><span className="section-badge bg-amber-500">F</span> <MonitorPlay className="w-5 h-5 text-amber-400" /> Ứng dụng & Phần mềm</h2>
          <button type="button" onClick={() => ungDungFields.append({ ten_ung_dung: "", don_vi_cung_cap: "" })} className="btn-add"><Plus className="w-4 h-4" /> Thêm</button>
        </div>
        <div className="space-y-3">
          {ungDungFields.fields.map((field, idx) => (
            <div key={field.id} className="flex gap-2 items-end bg-black/20 p-3 rounded-lg border border-white/5">
              <div className="flex-1"><label className="form-label">Tên phần mềm</label><input {...register(`ung_dung.${idx}.ten_ung_dung`)} className="form-input" /></div>
              <div className="flex-1"><label className="form-label">Vị trí/Máy chủ cài đặt</label><input {...register(`ung_dung.${idx}.don_vi_cung_cap`)} className="form-input" /></div>
              <button type="button" onClick={() => ungDungFields.remove(idx)} className="btn-danger h-[42px]"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      </div>

      {/* H. HR & NOTES */}
      <div className="section-card">
        <h2 className="section-title"><span className="section-badge bg-violet-500">H</span> <Users className="w-5 h-5 text-violet-400" /> Nhân lực & Ghi chú (I)</h2>
        <div className="grid grid-cols-1 gap-4">
          <div><label className="form-label">Thông tin chức năng, nhân sự phụ trách ATTT</label><textarea {...register("nhan_su")} className="form-input min-h-[80px]" /></div>
          <div><label className="form-label">Ghi chú bổ sung (Kết luận)</label><textarea {...register("ghi_chu")} className="form-input min-h-[80px]" /></div>
        </div>
      </div>

      {/* NETWORK PREVIEW */}
      <div className="section-card">
        <h2 className="section-title">Sơ đồ mạng tổng quan</h2>
        <NetworkDiagram data={formData} />
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur border-t border-gray-800 p-4" style={{ marginLeft: "260px" }}>
        <div className="flex justify-end gap-3 max-w-4xl mx-auto">
          <button type="submit" className="btn-primary">
            <Save className="w-4 h-4" /> Lưu Hồ sơ
          </button>
          <button type="button" onClick={handleExport} className="btn-secondary">
            <FileDown className="w-4 h-4 text-emerald-400" /> Xuất Word (.docx)
          </button>
        </div>
      </div>
    </form>
  );
}
