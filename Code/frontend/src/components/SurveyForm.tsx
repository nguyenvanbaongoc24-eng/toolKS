"use client";

import { useState } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import NetworkDiagram from "./NetworkDiagram";
import { 
  Building, Globe, Server, Save, FileDown, Plus, Trash2, 
  Router, Video, MonitorPlay, ShieldAlert, Users, StickyNote,
  FileCheck, Shield, GraduationCap, LayoutPanelLeft
} from "lucide-react";
import axios from "axios";

const TABS = [
  { id: "don_vi", label: "I. Đơn vị & Nhân sự", icon: Building },
  { id: "ha_tang", label: "II. Hạ tầng & Mạng", icon: Router },
  { id: "ung_dung", label: "III. Dịch vụ & Ứng dụng", icon: MonitorPlay },
  { id: "bao_mat", label: "IV. An toàn Bảo mật", icon: ShieldAlert },
  { id: "danh_gia", label: "V. Đánh giá & Sơ đồ", icon: LayoutPanelLeft }
];

export default function SurveyForm({ prefilledData }: { prefilledData?: any }) {
  const [activeTab, setActiveTab] = useState("don_vi");

  const defaultVals = prefilledData || {
    // Tab 1
    ten_don_vi: "", dia_chi: "", nguoi_dung_dau: "", so_dien_thoai: "", email: "", 
    he_thong_thong_tin: "",
    can_bo_phu_trach: [],
    
    // Tab 2
    ket_noi_internet: [], // Mảng kết nối
    thiet_bi_mang: [],
    may_chu: [],
    camera: [],
    ip_tinh: [],
    
    // Tab 3
    ung_dung: [],
    ma_hoa_du_lieu: "Không", vpn: "Không", email_bao_mat: "Không",
    
    // Tab 4
    chinh_sach_mat_khau: "Không", anti_virus: "Không", sao_luu: "Không", 
    tuong_lua_loai: "", tuong_lua_chinh_sach: "",
    cap_nhat_he_dieu_hanh: "Không",
    
    // Tab 5
    dao_tao: [],
    kiem_tra_attt: [],
    port_switch: [],
    ghi_chu: ""
  };

  const { register, control, handleSubmit } = useForm({ defaultValues: defaultVals });

  // Arrays
  const canBoFields = useFieldArray({ control, name: "can_bo_phu_trach" });
  const internetFields = useFieldArray({ control, name: "ket_noi_internet" });
  const tbMangFields = useFieldArray({ control, name: "thiet_bi_mang" });
  const mayChuFields = useFieldArray({ control, name: "may_chu" });
  const cameraFields = useFieldArray({ control, name: "camera" });
  const ungDungFields = useFieldArray({ control, name: "ung_dung" });
  const ipTinhFields = useFieldArray({ control, name: "ip_tinh" });
  const daoTaoFields = useFieldArray({ control, name: "dao_tao" });
  const portSwitchFields = useFieldArray({ control, name: "port_switch" });

  const formData = useWatch({ control });

  const handleExport = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await axios.post(`${apiUrl}/api/generate-docx`, {
        data: formData
      }, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Phieu_Khao_Sat_ATTT.docx');
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
    alert("Hồ sơ đã được lưu tạm. Dữ liệu form cập nhật thành công.");
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
                isActive ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20" : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: ĐƠN VỊ & NHÂN SỰ */}
      {activeTab === "don_vi" && (
        <div className="space-y-6 animate-fade-in">
          <div className="section-card">
            <h2 className="section-title"><span className="section-badge">A</span> Mục A & C. Thông tin chung</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="form-label">Tên cơ quan chủ quản (*)</label>
                <input {...register("ten_don_vi")} className="form-input" />
              </div>
              <div className="md:col-span-2">
                <label className="form-label">Tên hệ thống thông tin cần phân loại (*)</label>
                <input {...register("he_thong_thong_tin")} className="form-input" />
              </div>
              <div><label className="form-label">Người đứng đầu</label><input {...register("nguoi_dung_dau")} className="form-input" /></div>
              <div><label className="form-label">Địa chỉ trụ sở</label><input {...register("dia_chi")} className="form-input" /></div>
              <div><label className="form-label">Điện thoại</label><input {...register("so_dien_thoai")} className="form-input" /></div>
              <div><label className="form-label">Email cơ quan</label><input {...register("email")} className="form-input" /></div>
            </div>
          </div>

          <div className="section-card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="section-title mb-0"><span className="section-badge bg-fuchsia-500">B</span> Mục B. Cán bộ phụ trách ATTT</h2>
              <button type="button" onClick={() => canBoFields.append({ ho_ten: "", chuc_vu: "", dien_thoai: "" })} className="btn-add"><Plus className="w-4 h-4" /> Thêm cán bộ</button>
            </div>
            <div className="space-y-3">
              {canBoFields.fields.map((field, idx) => (
                <div key={field.id} className="flex gap-2 items-end bg-black/20 p-3 rounded-lg border border-white/5">
                  <div className="flex-1"><label className="form-label">Họ và tên</label><input {...register(`can_bo_phu_trach.${idx}.ho_ten`)} className="form-input" /></div>
                  <div className="flex-1"><label className="form-label">Chức vụ</label><input {...register(`can_bo_phu_trach.${idx}.chuc_vu`)} className="form-input" /></div>
                  <div className="flex-1"><label className="form-label">Điện thoại</label><input {...register(`can_bo_phu_trach.${idx}.dien_thoai`)} className="form-input" /></div>
                  <button type="button" onClick={() => canBoFields.remove(idx)} className="btn-danger h-[42px]"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: HẠ TẦNG & MẠNG */}
      {activeTab === "ha_tang" && (
        <div className="space-y-6 animate-fade-in">
          
          <div className="section-card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="section-title mb-0"><span className="section-badge bg-cyan-500">D</span> Mục D. Kết nối Internet</h2>
              <button type="button" onClick={() => internetFields.append({ nha_cung_cap: "", loai: "", bang_thong: "" })} className="btn-add"><Plus className="w-4 h-4" /> Thêm đường truyền</button>
            </div>
            <div className="space-y-3">
              {internetFields.fields.map((field, idx) => (
                <div key={field.id} className="flex gap-2 items-end bg-black/20 p-3 rounded-lg border border-white/5">
                  <div className="flex-1"><label className="form-label">ISP</label><input {...register(`ket_noi_internet.${idx}.nha_cung_cap`)} className="form-input" /></div>
                  <div className="flex-1"><label className="form-label">Loại kết nối</label><input {...register(`ket_noi_internet.${idx}.loai`)} className="form-input" /></div>
                  <div className="flex-1"><label className="form-label">Băng thông</label><input {...register(`ket_noi_internet.${idx}.bang_thong`)} className="form-input" /></div>
                  <button type="button" onClick={() => internetFields.remove(idx)} className="btn-danger h-[42px]"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </div>

          <div className="section-card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="section-title mb-0"><span className="section-badge bg-rose-500">E</span> Mục E. Thiết bị mạng (Router/Switch)</h2>
              <button type="button" onClick={() => tbMangFields.append({ loai_thiet_bi: "", hang: "", model: "", serial: "", vi_tri: "" })} className="btn-add"><Plus className="w-4 h-4" /> Thêm thiết bị</button>
            </div>
            <div className="space-y-3">
              {tbMangFields.fields.map((field, idx) => (
                <div key={field.id} className="flex gap-2 items-end bg-black/20 p-3 rounded-lg border border-white/5">
                  <div className="flex-1"><label className="form-label">Loại</label><input {...register(`thiet_bi_mang.${idx}.loai_thiet_bi`)} className="form-input" /></div>
                  <div className="flex-1"><label className="form-label">Hãng</label><input {...register(`thiet_bi_mang.${idx}.hang`)} className="form-input" /></div>
                  <div className="flex-1"><label className="form-label">Model</label><input {...register(`thiet_bi_mang.${idx}.model`)} className="form-input" /></div>
                  <div className="flex-1"><label className="form-label">Vị trí (Tầng-Phòng)</label><input {...register(`thiet_bi_mang.${idx}.vi_tri`)} className="form-input" /></div>
                  <button type="button" onClick={() => tbMangFields.remove(idx)} className="btn-danger h-[42px]"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </div>

          <div className="section-card">
            <div className="flex justify-between items-center mb-4">
               <h2 className="section-title mb-0"><span className="section-badge bg-emerald-500">F</span> Mục F. Máy chủ</h2>
               <button type="button" onClick={() => mayChuFields.append({ vai_tro: "", model: "", he_dieu_hanh: "" })} className="btn-add"><Plus className="w-4 h-4" /> Thêm máy chủ</button>
            </div>
            <div className="space-y-3">
              {mayChuFields.fields.map((field, idx) => (
                <div key={field.id} className="flex gap-2 items-end bg-black/20 p-3 rounded-lg border border-white/5">
                  <div className="flex-1"><label className="form-label">Vai trò</label><input {...register(`may_chu.${idx}.vai_tro`)} className="form-input" /></div>
                  <div className="flex-1"><label className="form-label">Server Model</label><input {...register(`may_chu.${idx}.model`)} className="form-input" /></div>
                  <div className="flex-1"><label className="form-label">HĐH</label><input {...register(`may_chu.${idx}.he_dieu_hanh`)} className="form-input" /></div>
                  <button type="button" onClick={() => mayChuFields.remove(idx)} className="btn-danger h-[42px]"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DỊCH VỤ & ỨNG DỤNG */}
      {activeTab === "ung_dung" && (
        <div className="space-y-6 animate-fade-in">
          <div className="section-card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="section-title mb-0"><span className="section-badge bg-amber-500">I</span> Mục I. Ứng dụng & Dịch vụ CNTT</h2>
              <button type="button" onClick={() => ungDungFields.append({ ten_ung_dung: "", don_vi: "", ket_noi_internet: "" })} className="btn-add"><Plus className="w-4 h-4" /> Thêm App</button>
            </div>
            <div className="space-y-3">
              {ungDungFields.fields.map((field, idx) => (
                <div key={field.id} className="flex gap-2 items-end bg-black/20 p-3 rounded-lg border border-white/5">
                  <div className="flex-1"><label className="form-label">Tên phần mềm</label><input {...register(`ung_dung.${idx}.ten_ung_dung`)} className="form-input" /></div>
                  <div className="flex-1"><label className="form-label">Đơn vị PT/Cung cấp</label><input {...register(`ung_dung.${idx}.don_vi`)} className="form-input" /></div>
                  <div className="flex-1"><label className="form-label">Có Internet?</label><input {...register(`ung_dung.${idx}.ket_noi_internet`)} className="form-input" placeholder="Có/Không" /></div>
                  <button type="button" onClick={() => ungDungFields.remove(idx)} className="btn-danger h-[42px]"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </div>

          <div className="section-card">
            <h2 className="section-title"><span className="section-badge bg-orange-500">P</span> Mục P. Mã hóa / Chứng thư số</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Kết nối sử dụng VPN không?</label>
                <select {...register("vpn")} className="form-input py-2">
                  <option value="Có">Có (SSL VPN / IPSec)</option>
                  <option value="Không">Không</option>
                </select>
              </div>
              <div>
                <label className="form-label">Dữ liệu lưu trữ có mã hóa?</label>
                <select {...register("ma_hoa_du_lieu")} className="form-input py-2">
                  <option value="Có">Có mã hóa lưu trữ</option>
                  <option value="Không">Không mã hóa</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: AN TOÀN BẢO MẬT */}
      {activeTab === "bao_mat" && (
        <div className="space-y-6 animate-fade-in">
          <div className="section-card">
            <h2 className="section-title"><span className="section-badge bg-red-500">L</span> Mục L. Hiện trạng bảo mật & Tường lửa</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Chính sách mật khẩu mạnh</label>
                <select {...register("chinh_sach_mat_khau")} className="form-input py-2">
                  <option value="Có">Có áp dụng định kỳ</option>
                  <option value="Không">Không áp dụng, tự do</option>
                </select>
              </div>
              <div>
                <label className="form-label">Phần mềm Anti-virus (Endpoint)</label>
                <select {...register("anti_virus")} className="form-input py-2">
                  <option value="Có - Có bản quyền">Có mua bản quyền</option>
                  <option value="Có - Miễn phí">Dùng bản miễn phí</option>
                  <option value="Không">Không cài đặt</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="form-label">Loại Tường lửa (Firewall)</label>
                <input {...register("tuong_lua_loai")} className="form-input" placeholder="Tường lửa phần cứng chuyên dụng / Tích hợp Router" />
              </div>
            </div>
          </div>

          <div className="section-card">
            <h2 className="section-title"><span className="section-badge bg-violet-500">Q</span> Mục Q. Quản lý lỗ hổng & Vá lỗi</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="form-label">Có quy trình cập nhật Hệ điều hành không?</label>
                <select {...register("cap_nhat_he_dieu_hanh")} className="form-input py-2">
                  <option value="Hàng tháng">Có - Hàng tháng</option>
                  <option value="Hàng quý">Có - Hàng quý</option>
                  <option value="Thủ công">Không định kỳ - Thủ công</option>
                  <option value="Không">Không bao giờ cập nhật</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: ĐÁNH GIÁ & SƠ ĐỒ */}
      {activeTab === "danh_gia" && (
        <div className="space-y-6 animate-fade-in">
          
          <div className="section-card">
            <h2 className="section-title"><span className="section-badge bg-blue-500">R</span> Đào tạo & <span className="section-badge bg-emerald-500 ml-2">S</span> Kiểm tra ATTT</h2>
            <div className="grid grid-cols-1 gap-4">
               <div>
                  <label className="form-label">Cán bộ đã được tập huấn ATTT chưa? Liệt kê nếu có:</label>
                  <textarea {...register("ghi_chu")} className="form-input min-h-[100px]" placeholder="VD: 3 cán bộ tập huấn 9/2023 do Sở TTTT tổ chức." />
               </div>
            </div>
          </div>

          <div className="section-card">
            <h2 className="section-title"><span className="section-badge bg-gray-600">T</span> Sơ đồ Topology Tự động</h2>
            <p className="text-sm text-gray-400 mb-4">Dựa trên dữ liệu từ Tab II & III, hệ thống tự động vẽ sơ đồ mạng Logic.</p>
            <NetworkDiagram data={formData} />
          </div>
        </div>
      )}

      {/* BOTTOM ACTION BAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur border-t border-gray-800 p-4" style={{ marginLeft: "260px" }}>
        <div className="flex justify-end gap-3 max-w-4xl mx-auto">
          <button type="submit" className="btn-primary">
            <Save className="w-4 h-4" /> Lưu Form
          </button>
          <button type="button" onClick={handleExport} className="btn-secondary">
            <FileDown className="w-4 h-4 text-emerald-400" /> Xuất File Word
          </button>
        </div>
      </div>
    </form>
  );
}
