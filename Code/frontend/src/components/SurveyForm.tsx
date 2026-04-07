"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import NetworkDiagram from "./NetworkDiagram";
import { 
  Building, Globe, Server, Save, FileDown, Plus, Trash2, 
  Router, Video, MonitorPlay, ShieldAlert, Users, StickyNote,
  FileCheck, Shield, GraduationCap, LayoutPanelLeft, FileText,
  CheckCircle2, AlertTriangle, AlertCircle, XCircle, Loader2
} from "lucide-react";
import axios from "axios";
import { useAutoSave } from "@/hooks/useAutoSave";

const TABS = [
  { id: "don_vi", label: "A-C. Đơn vị & Hệ thống", icon: Building },
  { id: "ha_tang", label: "D-I. Hạ tầng & Mạng", icon: Router },
  { id: "bao_mat", label: "K-P. An toàn Bảo mật", icon: ShieldAlert },
  { id: "quan_ly", label: "Q-S. Quản lý & Đào tạo", icon: GraduationCap },
  { id: "hinh_anh", label: "M-T. Xác nhận & Sơ đồ", icon: LayoutPanelLeft }
];

export default function SurveyForm({ prefilledData }: { prefilledData?: any }) {
  const [activeTab, setActiveTab] = useState<"don_vi" | "ha_tang" | "bao_mat" | "quan_ly" | "hinh_anh">("don_vi");
  const [availableStaff, setAvailableStaff] = useState<string[]>([]);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.pathname.endsWith("/survey/new")) {
       if (prefilledData?.id) {
          delete prefilledData.id;
       }
       // Auto-fill doer from localStorage if creating a new survey
       const lastDoer = localStorage.getItem("last_survey_doer");
       if (lastDoer && !prefilledData?.doer && !prefilledData?.nguoi_thuc_hien) {
          // We'll handle this in the defaultVals or use setValue from useForm if needed
       }
    }
  }, [prefilledData]);

  const defaultVals = {
    ...(prefilledData || {}),
    nguoi_thuc_hien: prefilledData?.doer || prefilledData?.nguoi_thuc_hien || (typeof window !== "undefined" ? localStorage.getItem("last_survey_doer") : "") || "",
    ngay_khao_sat: prefilledData?.date || prefilledData?.ngay_khao_sat || new Date().toISOString().split('T')[0],
    
    ten_don_vi: prefilledData?.ten_don_vi || "",
    dia_chi: prefilledData?.dia_chi || "",
    A6_ho_ten_thu_truong: prefilledData?.A6_ho_ten_thu_truong || "",
    so_dien_thoai: prefilledData?.so_dien_thoai || "",
    email: prefilledData?.email || "",
    A6_chuc_vu_thu_truong: prefilledData?.A6_chuc_vu_thu_truong || "",
    A7_so_quyet_dinh: prefilledData?.A7_so_quyet_dinh || "",
    he_thong_thong_tin: prefilledData?.he_thong_thong_tin || "",
    C1_mo_ta_chuc_nang: prefilledData?.C1_mo_ta_chuc_nang || "",
    C2_doi_tuong_nguoi_dung: prefilledData?.C2_doi_tuong_nguoi_dung || "",
    C3_loai_du_lieu: prefilledData?.C3_loai_du_lieu || "",
    C4_du_lieu_type: prefilledData?.C4_du_lieu_type || "Không xác định",
    C5_noi_bo: prefilledData?.C5_noi_bo || "",
    C5_ben_ngoai: prefilledData?.C5_ben_ngoai || "",
    C6_nam_hoat_dong: prefilledData?.C6_nam_hoat_dong || "",
    C7_ket_noi_cap_tren_has: prefilledData?.C7_ket_noi_cap_tren_has || "Không",
    C7_ten_he_thong_cap_tren: prefilledData?.C7_ten_he_thong_cap_tren || "",
    C8_bi_mat_nha_nuoc_has: prefilledData?.C8_bi_mat_nha_nuoc_has || "Không",
    C8_do_mat: prefilledData?.C8_do_mat || "",
    can_bo_phu_trach: prefilledData?.can_bo_phu_trach || [],
    
    // Tab 2 properties
    ket_noi_internet: prefilledData?.ket_noi_internet || [],
    D2_router_modem: prefilledData?.D2_router_modem || "",
    D3_ip_lan_gateway: prefilledData?.D3_ip_lan_gateway || "",
    thiet_bi_mang: prefilledData?.thiet_bi_mang || [],
    E2_firewall_type: prefilledData?.E2_firewall_type || "Dùng Firewall tích hợp",
    F1_pc_sl: prefilledData?.F1_pc_sl || "",
    F1_pc_os: prefilledData?.F1_pc_os || "Windows 10/11",
    F1_laptop_sl: prefilledData?.F1_laptop_sl || "",
    F1_laptop_os: prefilledData?.F1_laptop_os || "Windows 10/11",
    F1_tablet_sl: prefilledData?.F1_tablet_sl || "",
    F1_mayin_sl: prefilledData?.F1_mayin_sl || "",
    F1_dienthoai_sl: prefilledData?.F1_dienthoai_sl || "",
    F2_khong_may_chu_has: prefilledData?.F2_khong_may_chu_has || "Không",
    F2_luu_tru_o_dau: prefilledData?.F2_luu_tru_o_dau || "",
    may_chu: prefilledData?.may_chu || [],
    F3_cloud_has: prefilledData?.F3_cloud_has || "Không",
    F3_ten_cloud: prefilledData?.F3_ten_cloud || "",
    camera: prefilledData?.camera || [],
    G2_dau_ghi_nvr: prefilledData?.G2_dau_ghi_nvr || "",
    G3_luu_tru_ngay: prefilledData?.G3_luu_tru_ngay || "",
    H1_dai_ip_lan: prefilledData?.H1_dai_ip_lan || "",
    H2_ip_gateway: prefilledData?.H2_ip_gateway || "",
    H3_dns: prefilledData?.H3_dns || "",
    H4_co_vlan: prefilledData?.H4_co_vlan || "Không",
    H4_so_vlan: prefilledData?.H4_so_vlan || "",
    H4_mo_ta_vlan: prefilledData?.H4_mo_ta_vlan || "",
    ip_tinh: prefilledData?.ip_tinh || [],
    
    // Tab 2 detail Section T
    T1_1_co_dmz: prefilledData?.T1_1_co_dmz || "Không",
    T1_1_may_chu_dmz: prefilledData?.T1_1_may_chu_dmz || "",
    T1_2_wifi_tach_rieng: prefilledData?.T1_2_wifi_tach_rieng || "Không có WiFi",
    T1_3_ssid: prefilledData?.T1_3_ssid || "",
    T1_3_bao_mat_wifi: prefilledData?.T1_3_bao_mat_wifi || "",
    T1_4_camera_vlan_has: prefilledData?.T1_4_camera_vlan_has || "Không - Dùng chung LAN",
    T3_1_co_rack: prefilledData?.T3_1_co_rack || "Không",
    T3_1_rack_u: prefilledData?.T3_1_rack_u || "",
    T3_1_rack_vi_tri: prefilledData?.T3_1_rack_vi_tri || "",
    T3_2_thiet_bi_trong_tu: prefilledData?.T3_2_thiet_bi_trong_tu || "",
    T4_1_loai_cap: prefilledData?.T4_1_loai_cap || "Cáp đồng (Cat5e/Cat6)",
    T4_2_cap_isp: prefilledData?.T4_2_cap_isp || "",
    T5_vi_tri: prefilledData?.T5_vi_tri || [],

    // Tab 3
    ung_dung: prefilledData?.ung_dung || [],
    p1_protocol: prefilledData?.p1_protocol || "HTTPS (có chứng chỉ SSL/TLS)",
    p2_vpn: prefilledData?.p2_vpn || "Không có VPN",
    p2_vpn_type: prefilledData?.p2_vpn_type || "",
    P3_ket_noi_cap_tren_type: prefilledData?.P3_ket_noi_cap_tren_type || "Không kết nối",
    P3_1_ten_he_thong_va_phuong_thuc: prefilledData?.P3_1_ten_he_thong_va_phuong_thuc || "",
    P4_ma_hoa_luu_tru_has: prefilledData?.P4_ma_hoa_luu_tru_has || "Không",
    P4_phuong_phap: prefilledData?.P4_phuong_phap || "",
    P5_email_sec: prefilledData?.P5_email_sec || "Không",

    // Tab 4
    l1_phys_key: prefilledData?.l1_phys_key || "Không có kiểm soát riêng",
    L1_bang_ky_ten: prefilledData?.L1_bang_ky_ten || "Không",
    l2_pass_policy: prefilledData?.l2_pass_policy || "Không có chính sách thống nhất",
    l2_pass_len: prefilledData?.l2_pass_len || "8",
    l2_pass_time: prefilledData?.l2_pass_time || "3",
    L2_admin_acc_type: prefilledData?.L2_admin_acc_type || "Dùng chung một tài khoản admin",
    L2_2fa_has: prefilledData?.L2_2fa_has || "Không",
    l3_av_has: prefilledData?.l3_av_has || "Không",
    l3_av_name: prefilledData?.l3_av_name || "",
    l3_av_license: prefilledData?.l3_av_license || "Có bản quyền",
    L3_cap_nhat_virus: prefilledData?.L3_cap_nhat_virus || "Tự động",
    l4_bak_has: prefilledData?.l4_bak_has || "Không sao lưu",
    l4_bak_freq: prefilledData?.l4_bak_freq || "Hàng ngày",
    L4_offsite_has: prefilledData?.L4_offsite_has || "Không",
    L4_luu_o_dau: prefilledData?.L4_luu_o_dau || "Ổ cứng ngoài",
    l5_log_enabled: prefilledData?.l5_log_enabled || "Không",
    l5_log_retention: prefilledData?.l5_log_retention || "3 tháng",
    l5_siem_has: prefilledData?.l5_siem_has || "Không",
    l5_siem_name: prefilledData?.l5_siem_name || "",
    l6_incident_has: prefilledData?.l6_incident_has || "Không có sự cố nào",
    l6_incident_desc: prefilledData?.l6_incident_desc || "",
    l6_incident_resolution: prefilledData?.l6_incident_resolution || "",
    l7_type: prefilledData?.l7_type || "Tường lửa tích hợp (SPI)",
    L7_chinh_sach: prefilledData?.L7_chinh_sach || "Chưa cấu hình",
    L7_remote_access: prefilledData?.L7_remote_access || "Không",
    L7_4_cong_mo: prefilledData?.L7_4_cong_mo || "",
    L8_1_co_ups: prefilledData?.L8_1_co_ups || "Không",
    L8_1_ups_hang_model: prefilledData?.L8_1_ups_hang_model || "",
    L8_1_ups_cong_suat_va: prefilledData?.L8_1_ups_cong_suat_va || "",
    L8_1_ups_thoi_gian_phut: prefilledData?.L8_1_ups_thoi_gian_phut || "",
    L8_2_dieu_hoa: prefilledData?.L8_2_dieu_hoa || "Không",
    L8_3_bin_chua_chay_has: prefilledData?.L8_3_bin_chua_chay_has || "Không",
    L8_4_mo_ta_phong: prefilledData?.L8_4_mo_ta_phong || "",
    cap_nhat_he_dieu_hanh: prefilledData?.cap_nhat_he_dieu_hanh || "Hàng tháng",
    Q2_cap_nhat_ung_dung: prefilledData?.Q2_cap_nhat_ung_dung || "Có",
    Q3_nguoi_chiu_trach_nhiem: prefilledData?.Q3_nguoi_chiu_trach_nhiem || "",
    Q4_firmware_mang: prefilledData?.Q4_firmware_mang || "Đã cập nhật mới nhất",
    Q5_theo_doi_canh_bao: prefilledData?.Q5_theo_doi_canh_bao || "Thường xuyên",
    k1_quy_che: prefilledData?.k1_quy_che || "",
    k2_ke_hoach_ht: prefilledData?.k2_ke_hoach_ht || "",
    k3_ke_hoach_tr: prefilledData?.k3_ke_hoach_tr || "",
    k4_qd_can_bo: prefilledData?.k4_qd_can_bo || "",
    K5_qd_phe_duyet_httt: prefilledData?.K5_qd_phe_duyet_httt || "",
    K6_ung_pho_su_co: prefilledData?.K6_ung_pho_su_co || "",
    K7_bien_ban_kiem_tra: prefilledData?.K7_bien_ban_kiem_tra || "",

    // Tab 5
    ...Array.from({ length: 14 }, (_, i) => ({ [`M${i+1}_status`]: prefilledData?.[`M${i+1}_status`] || false })).reduce((a, b) => ({ ...a, ...b }), {}),
    n_nguoi_lap: prefilledData?.n_nguoi_lap || "",
    n_chuc_vu_lap: prefilledData?.n_chuc_vu_lap || "",
    n_ngay_lap: prefilledData?.n_ngay_lap || new Date().toISOString().split('T')[0],
    N_nguoi_kiem_tra_ho_ten: prefilledData?.N_nguoi_kiem_tra_ho_ten || "",
    N_nguoi_kiem_tra_chuc_vu: prefilledData?.N_nguoi_kiem_tra_chuc_vu || "",
    N_ngay_kiem_tra: prefilledData?.N_ngay_kiem_tra || "",
    N_thu_truong_ho_ten: prefilledData?.N_thu_truong_ho_ten || "",
    N_thu_truong_chuc_vu: prefilledData?.N_thu_truong_chuc_vu || "",
    N_ngay_ky: prefilledData?.N_ngay_ky || "",
    
    BC_so_bao_cao: prefilledData?.BC_so_bao_cao || "",
    BC_ngay_bao_cao: prefilledData?.BC_ngay_bao_cao || new Date().toISOString().split('T')[0],
    BC_nguoi_thuc_hien: prefilledData?.BC_nguoi_thuc_hien || "",
    BC_don_vi_thuc_hien: prefilledData?.BC_don_vi_thuc_hien || "Công ty Cổ phần Công nghệ ABC",
    BC_qd_ubnd_tinh_so_attt: prefilledData?.BC_qd_ubnd_tinh_so_attt || "",
    BC_qd_ubnd_tinh_phan_cong: prefilledData?.BC_qd_ubnd_tinh_phan_cong || "",
    BC_ten_tinh: prefilledData?.BC_ten_tinh || "Ninh Bình",
    
    dao_tao: prefilledData?.dao_tao || [],
    R2_co_tuyen_truyen: prefilledData?.R2_co_tuyen_truyen || "Không",
    R2_hinh_thuc_tuyen_truyen: prefilledData?.R2_hinh_thuc_tuyen_truyen || "",
    kiem_tra_attt: prefilledData?.kiem_tra_attt || [],
    S2_ke_hoach_tiep_theo: prefilledData?.S2_ke_hoach_tiep_theo || "",
    port_switch: prefilledData?.port_switch || [],
    ghi_chu: prefilledData?.ghi_chu || ""
  };


  const { register, control, handleSubmit, watch, formState: { errors } } = useForm({ defaultValues: defaultVals });

  // Arrays
  const canBoFields = useFieldArray({ control, name: "can_bo_phu_trach" });
  const internetFields = useFieldArray({ control, name: "ket_noi_internet" });
  const tbMangFields = useFieldArray({ control, name: "thiet_bi_mang" });
  const mayChuFields = useFieldArray({ control, name: "may_chu" });
  const cameraFields = useFieldArray({ control, name: "camera" });
  const ungDungFields = useFieldArray({ control, name: "ung_dung" });
  const ipTinhFields = useFieldArray({ control, name: "ip_tinh" });
  const daoTaoFields = useFieldArray({ control, name: "dao_tao" });
  const kiemTraFields = useFieldArray({ control, name: "kiem_tra_attt" });
  const portSwitchFields = useFieldArray({ control, name: "port_switch" });

  const formData = useWatch({ control });
  
  // Custom hook for auto save
  useAutoSave(formData, 10000);
  
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [exportType, setExportType] = useState<"phieu" | "hsdx" | "baocao" | null>(null);

  const [isCompleting, setIsCompleting] = useState(false);

  const calculateProgress = () => {
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
     const { filled } = countFields(formData);
     const percent = Math.min(100, Math.round((filled / 85) * 100));
     return { percent, missing: Math.max(0, 85 - filled) };
  };

  const Indicator = ({ name, required }: { name: string, required?: boolean }) => {
    //@ts-ignore
    const val = formData[name];
    //@ts-ignore
    const conf = formData.confidence_scores?.[name];
    
    if (!val && required) return <span title="Bắt buộc nhập"><AlertCircle className="w-4 h-4 text-rose-500 inline ml-2" /></span>;
    if (conf === 'low') return <span title="AI chưa chắc chắn. Vui lòng kiểm tra lại."><AlertTriangle className="w-4 h-4 text-amber-500 inline ml-2" /></span>;
    if (val) return <CheckCircle2 className="w-4 h-4 text-emerald-500 inline ml-2" />;
    return null;
  };

  const triggerExport = (type: "phieu" | "hsdx" | "baocao") => {
    //@ts-ignore
    const missingRequired = ["ten_don_vi", "he_thong_thong_tin"].filter(f => !formData[f]);
    if (missingRequired.length > 0) {
       setShowValidationModal(true);
       setExportType(type);
       return;
    }
    executeExport(type);
  };

  const executeExportWrapper = () => {
    if (exportType) executeExport(exportType);
  };

  const executeExport = async (type: "phieu" | "hsdx" | "baocao") => {
    setShowValidationModal(false);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      let endpoint = "";
      let filename = "";

      if (type === "phieu") {
        endpoint = "/export/phieu-khao-sat";
        filename = "Phieu_Khao_Sat_ATTT.docx";
      } else if (type === "hsdx") {
        endpoint = "/export/ho-so-de-xuat";
        filename = "Ho_So_De_Xuat_Cap_Do.docx";
      } else if (type === "baocao") {
        endpoint = "/export/bao-cao";
        filename = "Bao_Cao_HSDX.docx";
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

  const handleComplete = async () => {
    if (!formData.ten_don_vi || !formData.he_thong_thong_tin) {
      setShowValidationModal(true);
      setActiveTab("don_vi");
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
      setActiveTab("don_vi");
      return;
    }
    
    setIsSaving(true);
    try {
      // Save last doer for auto-fill in next new survey
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
              onClick={() => setActiveTab(tab.id as any)}
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
          {/* THÔNG TIN ĐƠN VỊ - MỤC A */}
          <div className="section-card">
            <h2 className="section-title">
              <span className="section-badge bg-indigo-500">A</span> Mục A. Thông tin cơ quan & Thủ trưởng
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-lg mb-2">
                <label className="form-label text-indigo-400">Người phụ trách hồ sơ (Lưu nội bộ, không xuất file)</label>
                <select {...register("nguoi_thuc_hien")} className="form-input">
                  <option value="">-- Chọn cán bộ thực hiện (Doer) --</option>
                  {availableStaff.map(name => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="form-label">Tên cơ quan chủ quản (*) <Indicator name="ten_don_vi" required /></label>
                <input {...register("ten_don_vi")} className="form-input" />
              </div>
              <div>
                <label className="form-label">Người đứng đầu (Họ tên) (A6) <Indicator name="A6_ho_ten_thu_truong" /></label>
                <input {...register("A6_ho_ten_thu_truong")} className="form-input" />
              </div>
              <div>
                <label className="form-label">Chức vụ người đứng đầu (A6.ii)</label>
                <input {...register("A6_chuc_vu_thu_truong")} className="form-input" placeholder="VD: Chủ tịch UBND huyện" />
              </div>
              <div className="md:col-span-2">
                <label className="form-label">Địa chỉ trụ sở <Indicator name="dia_chi" /></label>
                <input {...register("dia_chi")} className="form-input" />
              </div>
              <div>
                <label className="form-label">Điện thoại <Indicator name="so_dien_thoai" /></label>
                <input {...register("so_dien_thoai")} className="form-input" />
              </div>
              <div>
                <label className="form-label">Email cơ quan <Indicator name="email" /></label>
                <input {...register("email")} className="form-input" />
              </div>
              <div className="md:col-span-2">
                <label className="form-label">Số quyết định giao nhiệm vụ (nếu có - A7)</label>
                <input {...register("A7_so_quyet_dinh")} className="form-input" placeholder="VD: 123/QĐ-UBND" />
              </div>
            </div>
          </div>

          {/* MỤC B: CÁN BỘ PHỤ TRÁCH ATTT (Moved up v2.8) */}
          <div className="section-card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="section-title mb-0"><span className="section-badge bg-fuchsia-500">B</span> Mục B. Cán bộ phụ trách ATTT</h2>
              <button type="button" onClick={() => canBoFields.append({ ho_ten: "", chuc_vu: "", so_dt: "", email: "", trinh_do: "", chung_chi_attt: "" })} className="btn-add"><Plus className="w-4 h-4" /> Thêm cán bộ</button>
            </div>
            <div className="space-y-3">
              {canBoFields.fields.map((field, idx) => (
                <div key={field.id} className="flex gap-2 items-start bg-black/20 p-3 rounded-lg border border-white/5 relative">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 flex-1">
                    <div><label className="form-label">Họ và tên</label><input {...register(`can_bo_phu_trach.${idx}.ho_ten`)} className="form-input" /></div>
                    <div><label className="form-label">Chức vụ</label><input {...register(`can_bo_phu_trach.${idx}.chuc_vu`)} className="form-input" /></div>
                    <div><label className="form-label">Điện thoại</label><input {...register(`can_bo_phu_trach.${idx}.so_dt`)} className="form-input" /></div>
                    <div><label className="form-label">Email</label><input {...register(`can_bo_phu_trach.${idx}.email`)} className="form-input" /></div>
                    <div><label className="form-label">Trình độ / Chuyên ngành</label><input {...register(`can_bo_phu_trach.${idx}.trinh_do`)} className="form-input" /></div>
                    <div><label className="form-label">Chứng chỉ ATTT (nếu có)</label><input {...register(`can_bo_phu_trach.${idx}.chung_chi_attt`)} className="form-input" /></div>
                  </div>
                  <button type="button" onClick={() => canBoFields.remove(idx)} className="btn-danger h-[42px] mt-7"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </div>

          {/* MỤC C: MÔ TẢ HỆ THỐNG */}
          <div className="section-card">
            <h2 className="section-title">
              <span className="section-badge bg-blue-500">C</span> Mục C. Mô tả hệ thống thông tin
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 text-sm text-gray-400 mb-2 italic">
                Cung cấp thông tin chi tiết về hệ thống thông tin (HTTT) cần được phân loại cấp độ.
              </div>
              <div className="md:col-span-2">
                <label className="form-label">Tên hệ thống thông tin cần phân loại (*) <Indicator name="he_thong_thong_tin" required /></label>
                <input {...register("he_thong_thong_tin")} className="form-input" />
              </div>
              <div className="md:col-span-2">
                <label className="form-label">Mô tả chức năng, nhiệm vụ chính (C1)</label>
                <textarea {...register("C1_mo_ta_chuc_nang")} className="form-input" rows={2} placeholder="Hệ điều hành, phần mềm ứng dụng, dịch vụ cung cấp..." />
              </div>
              <div>
                <label className="form-label">Đối tượng người dùng (C2)</label>
                <input {...register("C2_doi_tuong_nguoi_dung")} className="form-input" placeholder="VD: Cán bộ, CV, Người dân, Doanh nghiệp..." />
              </div>
              <div>
                <label className="form-label">Loại hình dữ liệu xử lý (C3)</label>
                <input {...register("C3_loai_du_lieu")} className="form-input" placeholder="VD: Dữ liệu hồ sơ hành chính, kết quả TTHC..." />
              </div>

              <div className="md:col-span-2">
                <label className="form-label">Phân loại dữ liệu chính (C4 - Chọn mục phù hợp nhất)</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {["Cá nhân thông thường", "Cá nhân nhạy cảm", "Dữ liệu công", "Không xác định"].map(val => (
                    <label key={val} className="flex items-center space-x-2 cursor-pointer transition-colors hover:text-blue-400">
                      <input type="radio" value={val} {...register("C4_du_lieu_type")} className="text-blue-600" />
                      <span className="text-xs">{val}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="form-label">Số người dùng nội bộ (C5.i)</label>
                <input {...register("C5_noi_bo")} className="form-input" type="number" />
              </div>
              <div>
                <label className="form-label">Số người dùng bên ngoài (C5.ii)</label>
                <input {...register("C5_ben_ngoai")} className="form-input" type="number" />
              </div>
              <div>
                <label className="form-label">Năm hệ thống bắt đầu hoạt động (C6)</label>
                <input {...register("C6_nam_hoat_dong")} className="form-input" placeholder="VD: 2021" />
              </div>

              <div>
                <label className="form-label">Kết nối với hệ thống cấp trên (C7)</label>
                <div className="flex gap-4 mt-2">
                  {["Có", "Không"].map(val => (
                    <label key={val} className="flex items-center space-x-2">
                      <input type="radio" value={val} {...register("C7_ket_noi_cap_tren_has")} />
                      <span className="text-sm">{val}</span>
                    </label>
                  ))}
                </div>
                {watch("C7_ket_noi_cap_tren_has") === "Có" && (
                  <input {...register("C7_ten_he_thong_cap_tren")} className="form-input mt-2" placeholder="Tên hệ thống cấp trên..." />
                )}
              </div>

              <div>
                <label className="form-label">Có xử lý bí mật nhà nước (C8)</label>
                <div className="flex gap-4 mt-2">
                  {["Có", "Không"].map(val => (
                    <label key={val} className="flex items-center space-x-2">
                      <input type="radio" value={val} {...register("C8_bi_mat_nha_nuoc_has")} />
                      <span className="text-sm">{val}</span>
                    </label>
                  ))}
                </div>
                {watch("C8_bi_mat_nha_nuoc_has") === "Có" && (
                  <select {...register("C8_do_mat")} className="form-input mt-2">
                    <option value="">-- Chọn độ mật --</option>
                    <option value="Tuyệt mật">Tuyệt mật</option>
                    <option value="Tối mật">Tối mật</option>
                    <option value="Mật">Mật</option>
                  </select>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: HẠ TẦNG & MẠNG */}
      {activeTab === "ha_tang" && (
        <div className="space-y-6 animate-fade-in">
          {/* MỤC D: KẾT NỐI INTERNET */}
          <div className="section-card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="section-title mb-0"><span className="section-badge bg-cyan-500">D</span> Mục D. Kết nối Internet & Gateway</h2>
              <button type="button" onClick={() => internetFields.append({ isp: "", loai_ket_noi: "Cáp quang", bang_thong: "", vai_tro: "Đường chính", ip_wan: "IP Tĩnh", ghi_chu: "" })} className="btn-add"><Plus className="w-4 h-4" /> Thêm đường truyền</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="form-label">Thiết bị Modem/Router Gateway (D2)</label>
                <input {...register("D2_router_modem")} className="form-input" placeholder="Hãng, Model..." />
              </div>
              <div>
                <label className="form-label">Địa chỉ IP LAN Gateway (D3)</label>
                <input {...register("D3_ip_lan_gateway")} className="form-input" placeholder="VD: 192.168.1.1" />
              </div>
            </div>
            <div className="space-y-3">
              {internetFields.fields.map((field, idx) => (
                <div key={field.id} className="bg-black/20 p-4 rounded-lg border border-white/5 relative">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div><label className="form-label">Vai trò</label><select {...register(`ket_noi_internet.${idx}.vai_tro`)} className="form-input py-2"><option value="Đường chính">Đường chính (duy nhất)</option><option value="Đường dự phòng">Đường dự phòng</option></select></div>
                    <div><label className="form-label">ISP (Nhà cung cấp)</label><input {...register(`ket_noi_internet.${idx}.isp`)} className="form-input" /></div>
                    <div><label className="form-label">Loại kết nối</label><input {...register(`ket_noi_internet.${idx}.loai_ket_noi`)} className="form-input" placeholder="Cáp quang, FTTH..." /></div>
                    <div><label className="form-label">Băng thông (Mbps)</label><input {...register(`ket_noi_internet.${idx}.bang_thong`)} className="form-input" /></div>
                    <div><label className="form-label">IP WAN</label><input {...register(`ket_noi_internet.${idx}.ip_wan`)} className="form-input" placeholder="IP Tĩnh/Động" /></div>
                    <div><label className="form-label">Ghi chú</label><input {...register(`ket_noi_internet.${idx}.ghi_chu`)} className="form-input" /></div>
                  </div>
                  <button type="button" onClick={() => internetFields.remove(idx)} className="absolute top-2 right-2 text-red-500 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </div>

          {/* MỤC E: THIẾT BỊ MẠNG & FIREWALL */}
          <div className="section-card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="section-title mb-0"><span className="section-badge bg-rose-500">E</span> Mục E. Thiết bị mạng & Firewall</h2>
              <button type="button" onClick={() => tbMangFields.append({ loai_thiet_bi: "", hang_san_xuat: "", model: "", so_serial: "", vi_tri: "", nam_mua: "", ghi_chu: "" })} className="btn-add"><Plus className="w-4 h-4" /> Thêm thiết bị</button>
            </div>
            <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-lg mb-4">
              <label className="form-label text-rose-400">Hình thức trang bị Tường lửa (Firewall - E2)</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                {[
                  { label: "Có (phần cứng chuyên dụng)", val: "Có (phần cứng chuyên dụng)" },
                  { label: "Dùng Firewall tích hợp", val: "Dùng Firewall tích hợp" },
                  { label: "Dùng phần mềm Firewall", val: "Dùng phần mềm Firewall" }
                ].map(item => (
                  <label key={item.val} className="flex items-center space-x-2 cursor-pointer">
                    <input type="radio" value={item.val} {...register("E2_firewall_type")} className="text-rose-500" />
                    <span className="text-sm">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              {tbMangFields.fields.map((field, idx) => (
                <div key={field.id} className="bg-black/20 p-4 rounded-lg border border-white/5 relative">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div><label className="form-label">Loại thiết bị</label><input {...register(`thiet_bi_mang.${idx}.loai_thiet_bi`)} className="form-input" placeholder="Switch, AP..." /></div>
                    <div><label className="form-label">Hãng sản xuất</label><input {...register(`thiet_bi_mang.${idx}.hang_san_xuat`)} className="form-input" /></div>
                    <div><label className="form-label">Model</label><input {...register(`thiet_bi_mang.${idx}.model`)} className="form-input" /></div>
                    <div><label className="form-label">Số Serial</label><input {...register(`thiet_bi_mang.${idx}.so_serial`)} className="form-input" /></div>
                    <div><label className="form-label">Vị trí lắp đặt</label><input {...register(`thiet_bi_mang.${idx}.vi_tri`)} className="form-input" /></div>
                    <div><label className="form-label">Năm mua</label><input {...register(`thiet_bi_mang.${idx}.nam_mua`)} className="form-input" /></div>
                    <div className="md:col-span-2"><label className="form-label">Ghi chú</label><input {...register(`thiet_bi_mang.${idx}.ghi_chu`)} className="form-input" /></div>
                  </div>
                  <button type="button" onClick={() => tbMangFields.remove(idx)} className="absolute top-2 right-2 text-red-500 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </div>

          {/* MỤC F: THIẾT BỊ ĐẦU CUỐI & MÁY CHỦ */}
          <div className="section-card">
            <h2 className="section-title"><span className="section-badge bg-emerald-500">F</span> Mục F. Thiết bị đầu cuối & Máy chủ</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6 pt-2">
              <div className="form-group">
                <label className="form-label text-[10px] uppercase tracking-wider text-gray-500">Máy tính bàn (F1.1)</label>
                <div className="flex items-center gap-2">
                  <input {...register("F1_pc_sl")} className="form-input text-center" placeholder="SL" type="number" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label text-[10px] uppercase tracking-wider text-gray-500">Laptop (F1.2)</label>
                <input {...register("F1_laptop_sl")} className="form-input text-center" placeholder="SL" type="number" />
              </div>
              <div className="form-group">
                <label className="form-label text-[10px] uppercase tracking-wider text-gray-500">Máy in (F1.4)</label>
                <input {...register("F1_mayin_sl")} className="form-input text-center" placeholder="SL" type="number" />
              </div>
              <div className="form-group">
                <label className="form-label text-[10px] uppercase tracking-wider text-gray-500">Điện thoại (F1.5)</label>
                <input {...register("F1_dienthoai_sl")} className="form-input text-center" placeholder="SL" type="number" />
              </div>
              <div className="form-group">
                <label className="form-label text-[10px] uppercase tracking-wider text-gray-500">Hệ điều hành chính</label>
                <input {...register("F1_pc_os")} className="form-input text-xs" />
              </div>
            </div>

            <div className="bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-lg mb-6">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div>
                  <label className="form-label">Không có máy chủ vật lý? (F2)</label>
                  <div className="flex gap-4 mt-1">
                    {["Có", "Không"].map(val => (
                      <label key={val} className="flex items-center space-x-2">
                        <input type="radio" value={val} {...register("F2_khong_may_chu_has")} />
                        <span className="text-sm">{val}</span>
                      </label>
                    ))}
                  </div>
                </div>
                {watch("F2_khong_may_chu_has") === "Có" && (
                  <div className="flex-1">
                    <label className="form-label">Nơi lưu trữ/xử lý thay thế (F2.ii)</label>
                    <input {...register("F2_luu_tru_o_dau")} className="form-input" placeholder="VD: Thuê Cloud, dùng máy trạm làm máy chủ..." />
                  </div>
                )}
                <div>
                  <label className="form-label">Dùng dịch vụ Điện toán đám mây? (F3)</label>
                  <div className="flex gap-4 mt-1">
                    {["Có", "Không"].map(val => (
                      <label key={val} className="flex items-center space-x-2">
                        <input type="radio" value={val} {...register("F3_cloud_has")} />
                        <span className="text-sm">{val}</span>
                      </label>
                    ))}
                  </div>
                </div>
                {watch("F3_cloud_has") === "Có" && (
                  <div className="flex-1">
                    <label className="form-label">Tên nhà cung cấp Cloud (F3.ii)</label>
                    <input {...register("F3_ten_cloud")} className="form-input" placeholder="VD: AWS, Azure, Viettel, VNPT..." />
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center mb-4">
               <h3 className="text-sm font-semibold text-emerald-400">Danh sách máy chủ chi tiết (F2)</h3>
               <button type="button" onClick={() => mayChuFields.append({ vai_tro: "", hang_model: "", so_serial: "", ram_gb: "", o_cung_tb: "", he_dieu_hanh: "", vi_tri: "" })} className="btn-add text-[10px] py-1">Thêm dòng</button>
            </div>
            <div className="space-y-2">
              {mayChuFields.fields.map((field, idx) => (
                <div key={field.id} className="bg-black/20 p-3 rounded-lg border border-white/5 relative">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div><label className="form-label text-[10px]">Vai trò (AD, Web...)</label><input {...register(`may_chu.${idx}.vai_tro`)} className="form-input text-xs" /></div>
                    <div><label className="form-label text-[10px]">Hãng / Model</label><input {...register(`may_chu.${idx}.hang_model`)} className="form-input text-xs" /></div>
                    <div><label className="form-label text-[10px]">Số Serial</label><input {...register(`may_chu.${idx}.so_serial`)} className="form-input text-xs" /></div>
                    <div><label className="form-label text-[10px]">RAM (GB)</label><input {...register(`may_chu.${idx}.ram_gb`)} className="form-input text-xs" type="number" /></div>
                    <div><label className="form-label text-[10px]">Ổ cứng (TB)</label><input {...register(`may_chu.${idx}.o_cung_tb`)} className="form-input text-xs" /></div>
                    <div><label className="form-label text-[10px]">Hệ điều hành</label><input {...register(`may_chu.${idx}.he_dieu_hanh`)} className="form-input text-xs" /></div>
                    <div><label className="form-label text-[10px]">Vị trí đặt</label><input {...register(`may_chu.${idx}.vi_tri`)} className="form-input text-xs" /></div>
                  </div>
                  <button type="button" onClick={() => mayChuFields.remove(idx)} className="absolute top-2 right-2 text-red-400 hover:text-red-300"><Trash2 className="w-3 h-3" /></button>
                </div>
              ))}
            </div>
          </div>

          {/* MỤC G & H: CAMERA & IP */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="section-card">
              <h2 className="section-title"><span className="section-badge bg-blue-500">G</span> Mục G. Hệ thống Camera</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                <div><label className="form-label text-xs">Model đầu ghi NVR (G2)</label><input {...register("G2_dau_ghi_nvr")} className="form-input text-xs" /></div>
                <div><label className="form-label text-xs">Số ngày lưu trữ (G3)</label><input {...register("G3_luu_tru_ngay")} className="form-input text-xs" type="number" /></div>
              </div>
              <div className="space-y-2">
                {cameraFields.fields.map((field, idx) => (
                  <div key={field.id} className="bg-black/20 p-3 rounded-lg border border-white/5 relative">
                    <div className="grid grid-cols-2 gap-2">
                      <div><label className="form-label text-[10px]">Hãng SX</label><input {...register(`camera.${idx}.hang_san_xuat`)} className="form-input text-xs" /></div>
                      <div><label className="form-label text-[10px]">Model</label><input {...register(`camera.${idx}.model`)} className="form-input text-xs" /></div>
                      <div><label className="form-label text-[10px]">Số Serial</label><input {...register(`camera.${idx}.so_serial`)} className="form-input text-xs" /></div>
                      <div><label className="form-label text-[10px]">Độ phân giải</label><input {...register(`camera.${idx}.do_phan_giai`)} className="form-input text-xs" /></div>
                      <div className="col-span-2"><label className="form-label text-[10px]">Vị trí & Ghi chú</label><input {...register(`camera.${idx}.vi_tri`)} className="form-input text-xs" /></div>
                    </div>
                    <button type="button" onClick={() => cameraFields.remove(idx)} className="absolute top-2 right-2 text-red-400"><Trash2 className="w-3 h-3" /></button>
                  </div>
                ))}
                <button type="button" onClick={() => cameraFields.append({ hang_san_xuat: "", model: "", so_serial: "", do_phan_giai: "", vi_tri: "", ghi_chu: "" })} className="text-[10px] text-blue-400 hover:underline">+ Thêm camera</button>
              </div>
            </div>

            <div className="section-card">
              <h2 className="section-title"><span className="section-badge bg-indigo-500">H</span> Mục H. Quy hoạch mạng LAN</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                <div><label className="form-label text-xs">Dải IP LAN (H1)</label><input {...register("H1_dai_ip_lan")} className="form-input text-xs" placeholder="VD: 10.0.0.0/24" /></div>
                <div><label className="form-label text-xs">Địa chỉ IP Gateway (H2)</label><input {...register("H2_ip_gateway")} className="form-input text-xs" placeholder="VD: 192.168.1.1" /></div>
                <div><label className="form-label text-xs">DNS Server (H3)</label><input {...register("H3_dns")} className="form-input text-xs" placeholder="VD: 8.8.8.8" /></div>
                <div className="md:col-span-2">
                   <label className="form-label text-xs">Phân chia VLAN? (H4)</label>
                   <div className="flex items-center gap-4 mt-1">
                      {["Có", "Không"].map(v => (
                        <label key={v} className="flex items-center space-x-1 text-xs">
                          <input type="radio" value={v} {...register("H4_co_vlan")} />
                          <span>{v}</span>
                        </label>
                      ))}
                      {watch("H4_co_vlan") === "Có" && (
                        <input {...register("H4_mo_ta_vlan")} className="form-input text-xs flex-1" placeholder="Số lượng/Mục đích..." />
                      )}
                   </div>
                </div>
              </div>
              <div className="space-y-2">
                {ipTinhFields.fields.map((field, idx) => (
                  <div key={field.id} className="flex gap-2 items-center bg-black/20 p-2 rounded-lg border border-white/5">
                    <input {...register(`ip_tinh.${idx}.ten_thiet_bi`)} className="form-input text-xs flex-1" placeholder="Thiết bị/Người dùng" />
                    <input {...register(`ip_tinh.${idx}.dia_chi_ip`)} className="form-input text-xs flex-1" placeholder="IP Tĩnh" />
                    <input {...register(`ip_tinh.${idx}.ghi_chu`)} className="form-input text-xs flex-1" placeholder="Ghi chú" />
                    <button type="button" onClick={() => ipTinhFields.remove(idx)} className="text-red-400"><Trash2 className="w-3 h-3" /></button>
                  </div>
                ))}
                <button type="button" onClick={() => ipTinhFields.append({ ten_thiet_bi: "", dia_chi_ip: "", ghi_chu: "" })} className="text-[10px] text-indigo-400 hover:underline">+ Thêm IP tĩnh</button>
              </div>
            </div>
          </div>

            <div className="section-card">
              <div className="flex justify-between items-center mb-4">
                <h2 className="section-title mb-0"><span className="section-badge bg-amber-500">I</span> Mục I. Ứng dụng & Dịch vụ CNTT</h2>
                <button type="button" onClick={() => ungDungFields.append({ ten: "", chuc_nang: "", don_vi_cung_cap: "", phien_ban: "", ket_noi_internet: "Có", ghi_chu: "" })} className="btn-add"><Plus className="w-4 h-4" /> Thêm App</button>
              </div>
              <div className="space-y-3">
                {ungDungFields.fields.map((field, idx) => (
                  <div key={field.id} className="bg-black/20 p-4 rounded-lg border border-white/5 relative">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div><label className="form-label text-[10px]">Tên ứng dụng</label><input {...register(`ung_dung.${idx}.ten`)} className="form-input text-xs" /></div>
                      <div><label className="form-label text-[10px]">Chức năng chính</label><input {...register(`ung_dung.${idx}.chuc_nang`)} className="form-input text-xs" /></div>
                      <div><label className="form-label text-[10px]">Đơn vị cung cấp</label><input {...register(`ung_dung.${idx}.don_vi_cung_cap`)} className="form-input text-xs" /></div>
                      <div><label className="form-label text-[10px]">Phiên bản</label><input {...register(`ung_dung.${idx}.phien_ban`)} className="form-input text-xs" /></div>
                      <div><label className="form-label text-[10px]">Kết nối Internet?</label><select {...register(`ung_dung.${idx}.ket_noi_internet`)} className="form-input text-xs py-1"><option value="Có">Có</option><option value="Không">Không</option></select></div>
                      <div><label className="form-label text-[10px]">Ghi chú (URL/User...)</label><input {...register(`ung_dung.${idx}.ghi_chu`)} className="form-input text-xs" /></div>
                    </div>
                    <button type="button" onClick={() => ungDungFields.remove(idx)} className="absolute top-2 right-2 text-red-400"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </div>

        </div>
      )}

      {/* TAB 3: AN TOÀN BẢO MẬT (K, L, P) */}
      {activeTab === "bao_mat" && (
        <div className="space-y-6 animate-fade-in">
          {/* MỤC K: HỒ SƠ PHÁP LÝ */}
          <div className="section-card">
            <h2 className="section-title"><span className="section-badge bg-stone-500">K</span> Mục K. Danh mục Hồ sơ / Tài liệu</h2>
            <div className="space-y-2">
              {[
                { id: "k1_quy_che", label: "K1. Quy chế ATTT của đơn vị" },
                { id: "k2_ke_hoach_ht", label: "K2. Danh mục tài sản / HTTT" },
                { id: "k3_ke_hoach_tr", label: "K3. Kế hoạch ứng phó sự cố" },
                { id: "k4_qd_can_bo", label: "K4. QĐ phân công Cán bộ phụ trách" },
                { id: "K5_qd_phe_duyet_httt", label: "K5. QĐ phê duyệt cấp độ HTTT" },
                { id: "K6_ung_pho_su_co", label: "K6. Biên bản ứng phó sự cố" },
                { id: "K7_bien_ban_kiem_tra", label: "K7. Biên bản kiểm tra định kỳ" }
              ].map(item => (
                <div key={item.id} className="flex flex-col gap-1 p-2 bg-stone-500/5 border border-stone-500/20 rounded">
                  <label className="font-medium text-stone-300 text-[10px] uppercase">{item.label}</label>
                  <input {...register(item.id)} className="form-input text-[11px] h-10" placeholder="Số hiệu/Ngày ban hành..." />
                </div>
              ))}
            </div>
          </div>

          {/* MỤC L: KIỂM SOÁT VÀ GIÁM SÁT */}
          <div className="section-card">
            <h2 className="section-title"><span className="section-badge bg-violet-500">L</span> Mục L. Kiểm soát truy cập & Giám sát</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="form-label text-xs">Kiểm soát vật lý (L1)</label>
                  <select {...register("l1_phys_key")} className="form-input text-xs py-1">
                    <option value="Có khóa cửa (chìa khóa thường)">Có khóa cửa (chìa khóa thường)</option>
                    <option value="Có khóa cửa + camera giám sát">Có khóa cửa + camera giám sát</option>
                    <option value="Có thẻ từ / kiểm soát điện tử">Có thẻ từ / kiểm soát điện tử</option>
                    <option value="Không có kiểm soát riêng">Không có kiểm soát riêng</option>
                  </select>
                </div>
                <div>
                  <label className="form-label text-xs">Phòng máy có bảng ký tên ra vào? (L1.ii)</label>
                  <div className="flex gap-4">
                    {["Có", "Không"].map(v => <label key={v} className="flex items-center space-x-1 text-xs"><input type="radio" value={v} {...register("L1_bang_ky_ten")} /><span>{v}</span></label>)}
                  </div>
                </div>
                <div className="bg-white/5 p-3 rounded-lg border border-white/5 space-y-2">
                  <label className="form-label text-xs font-bold text-violet-400">Chính sách mật khẩu (L2)</label>
                  <select {...register("l2_pass_policy")} className="form-input text-xs py-1">
                    <option value="Có chính sách mật khẩu">Đã ban hành và áp dụng</option>
                    <option value="Không có chính sách thống nhất">Chưa có chính sách thống nhất</option>
                  </select>
                  <div className="grid grid-cols-2 gap-2">
                    <div><label className="text-[10px]">Độ dài tối thiểu</label><input {...register("l2_pass_len")} className="form-input text-xs" /></div>
                    <div><label className="text-[10px]">Thay đổi định kỳ (tháng)</label><input {...register("l2_pass_time")} className="form-input text-xs" /></div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white/5 p-3 rounded-lg border border-white/5 space-y-2">
                  <label className="form-label text-xs font-bold text-emerald-400">Công cụ diệt Virus (L3)</label>
                  <div className="flex gap-2">
                    <select {...register("l3_av_has")} className="form-input text-xs py-1 flex-1">
                      <option value="Có">Có cài đặt</option>
                      <option value="Không">Chưa cài đặt</option>
                    </select>
                    {watch("l3_av_has") === "Có" && <input {...register("l3_av_name")} placeholder="Tên phần mềm..." className="form-input text-xs py-1 flex-1" />}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                     <select {...register("l3_av_license")} className="form-input text-xs py-1"><option value="Có bản quyền">Có bản quyền</option><option value="Miễn phí">Miễn phí</option><option value="Hết hạn">Hết hạn</option></select>
                     <select {...register("L3_cap_nhat_virus")} className="form-input text-xs py-1"><option value="Tự động">Tự động cập nhật</option><option value="Thủ công">Cập nhật thủ công</option><option value="Không cập nhật">Không cập nhật</option></select>
                  </div>
                </div>
                <div className="bg-white/5 p-3 rounded-lg border border-white/5 space-y-2">
                  <label className="form-label text-xs font-bold text-blue-400">Sao lưu dữ liệu (L4)</label>
                  <select {...register("l4_bak_has")} className="form-input text-xs py-1">
                    <option value="Có - Tự động">Có - Tự động</option>
                    <option value="Thủ công">Có - Thủ công (USB/Ổ cứng)</option>
                    <option value="Không sao lưu">Không có phương án sao lưu</option>
                  </select>
                  <div className="grid grid-cols-1 gap-2">
                    <input {...register("L4_luu_o_dau")} className="form-input text-xs" placeholder="Nơi lưu trữ (VD: NAS, Ổ cứng ngoài...)" />
                    <div className="flex gap-4">
                      <label className="text-[10px]">Sao lưu Offsite?</label>
                      {["Có", "Không"].map(v => <label key={v} className="flex items-center space-x-1 text-xs"><input type="radio" value={v} {...register("L4_offsite_has")} /><span>{v}</span></label>)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* MỤC P: MÃ HÓA & KẾT NỐI */}
          <div className="section-card">
            <h2 className="section-title"><span className="section-badge bg-orange-500">P</span> Mục P. Bảo mật kết nối & Mã hóa</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="form-label">Giao thức ứng dụng Web (P1)</label>
                  <select {...register("p1_protocol")} className="form-input py-1 text-sm">
                    <option value="HTTPS (có chứng chỉ SSL/TLS)">HTTPS (Có mã hóa)</option>
                    <option value="HTTP (không mã hóa)">HTTP (Không mã hóa)</option>
                    <option value="Cả hai">Cả hai</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Sử dụng VPN kết nối từ xa? (P2.i)</label>
                  <select {...register("p2_vpn")} className="form-input py-1 text-sm">
                    <option value="Có">Có sử dụng</option>
                    <option value="Không có VPN">Không sử dụng</option>
                  </select>
                  {watch("p2_vpn") === "Có" && (
                    <input {...register("p2_vpn_type")} className="form-input mt-2 text-xs" placeholder="Loại VPN (FortiClient, AnyConnect...)" />
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="form-label">Kết nối với mạng cơ quan cấp trên? (P3)</label>
                  <select {...register("P3_ket_noi_cap_tren_type")} className="form-input py-1 text-sm">
                    <option value="Không kết nối">Không kết nối</option>
                    <option value="VPN chuyên dụng">Có - VPN chuyên dụng (P3.i)</option>
                    <option value="Internet (HTTPS)">Có - Qua Internet (HTTPS)</option>
                    <option value="MPLS">Có - Đường truyền MPLS</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Mã hóa lưu trữ? (P4)</label>
                    <div className="flex gap-4 mt-1">
                      {["Có", "Không"].map(v => <label key={v} className="flex items-center space-x-1 text-xs"><input type="radio" value={v} {...register("P4_ma_hoa_luu_tru_has")} /><span>{v}</span></label>)}
                    </div>
                  </div>
                  <div>
                    <label className="form-label">Email Security? (P5)</label>
                    <div className="flex gap-4 mt-1">
                      {["Có", "Không"].map(v => <label key={v} className="flex items-center space-x-1 text-xs"><input type="radio" value={v} {...register("P5_email_sec")} /><span>{v}</span></label>)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* MỤC L8: AN TOÀN VẬT LÝ PHÒNG MÁY CHỦ */}
          <div className="section-card">
            <h2 className="section-title"><span className="section-badge bg-blue-600">L8</span> Mục L8. An toàn vật lý & Môi trường</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-500/5 p-4 rounded-lg border border-blue-500/10">
                <label className="form-label">Hệ thống nguồn dự phòng (UPS - L8.1)</label>
                <div className="flex gap-4 mb-2">
                   {["Có", "Không"].map(v => <label key={v} className="flex items-center space-x-1 text-xs"><input type="radio" value={v} {...register("L8_1_co_ups")} /><span>{v}</span></label>)}
                </div>
                {watch("L8_1_co_ups") === "Có" && (
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <input {...register("L8_1_ups_hang_model")} className="form-input text-xs" placeholder="Hãng/Model UPS" />
                    <input {...register("L8_1_ups_cong_suat_va")} className="form-input text-xs" placeholder="Công suất (VA)" />
                    <input {...register("L8_1_ups_thoi_gian_phut")} className="form-input text-xs md:col-span-2" placeholder="Thời gian dự phòng (phút)" />
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label text-xs">Điều hòa (L8.2)</label>
                    <select {...register("L8_2_dieu_hoa")} className="form-input text-xs py-1">
                      <option value="Có – 24/7">Có - Chạy 24/7</option>
                      <option value="Có – Giờ hành chính">Có - Chạy giờ hành chính</option>
                      <option value="Không">Không có</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label text-xs">PCCC (L8.3)</label>
                    <div className="flex gap-2">
                       {["Có", "Không"].map(v => <label key={v} className="flex items-center space-x-1 text-xs"><input type="radio" value={v} {...register("L8_3_bin_chua_chay_has")} /><span>{v}</span></label>)}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="form-label text-xs">Mô tả phòng máy chủ (L8.4)</label>
                  <textarea {...register("L8_4_mo_ta_phong")} className="form-input text-xs" rows={1} placeholder="Vị trí đặt tủ mạng, điều kiện phòng..." />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: QUẢN LÝ & ĐÀO TẠO (Q-S) */}
      {activeTab === "quan_ly" && (
        <div className="space-y-6 animate-fade-in">
          {/* MỤC Q: PATCH MANAGEMENT */}
          <div className="section-card">
            <h2 className="section-title"><span className="section-badge bg-slate-500">Q</span> Mục Q. Bảo trì & Cập nhật phần mềm</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="form-label text-xs">Cập nhật HĐH máy chủ/trạm (Q1)</label>
                <select {...register("cap_nhat_he_dieu_hanh")} className="form-input text-xs py-1">
                  <option value="Hàng tháng">Định kỳ hàng tháng</option>
                  <option value="Hàng quý">Định kỳ hàng quý</option>
                  <option value="Thủ công">Cập nhật thủ công</option>
                  <option value="Không">Chưa thực hiện</option>
                </select>
              </div>
              <div>
                <label className="form-label text-xs">Cập nhật phần mềm ứng dụng (Q2)</label>
                <select {...register("Q2_cap_nhat_ung_dung")} className="form-input text-xs py-1">
                  <option value="Tự động">Cập nhật tự động</option>
                  <option value="Có">Có cập nhật định kỳ</option>
                  <option value="Không">Chưa thực hiện</option>
                </select>
              </div>
              <div>
                <label className="form-label text-xs">Cán bộ chịu trách nhiệm (Q3)</label>
                <input {...register("Q3_nguoi_chiu_trach_nhiem")} className="form-input text-xs h-9" placeholder="Họ và tên..." />
              </div>
              <div>
                 <label className="form-label text-xs">Cập nhật Firmware TB Mạng (Q4)</label>
                 <select {...register("Q4_firmware_mang")} className="form-input text-xs py-1">
                    <option value="Đã cập nhật mới nhất">Đã cập nhật mới nhất</option>
                    <option value="Chưa cập nhật">Chưa cập nhật thường xuyên</option>
                 </select>
              </div>
              <div>
                <label className="form-label text-xs">Theo dõi cảnh báo ATTT (Q5)</label>
                <select {...register("Q5_theo_doi_canh_bao")} className="form-input text-xs py-1">
                  <option value="Thường xuyên">Kiểm tra thường xuyên (VNCERT...)</option>
                  <option value="Thỉnh thoảng">Thỉnh thoảng</option>
                  <option value="Không">Chưa có người theo dõi</option>
                </select>
              </div>
            </div>
          </div>

          {/* MỤC R: ĐÀO TẠO */}
          <div className="section-card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="section-title mb-0"><span className="section-badge bg-emerald-500">R</span> Mục R. Đào tạo & Nhận thức ATTT</h2>
              <button type="button" onClick={() => daoTaoFields.append({ hinh_thuc: "", don_vi_to_chuc: "", thoi_gian: "", so_can_bo: "", chung_chi_so_vb: "" })} className="btn-add"><Plus className="w-4 h-4" /> Thêm khóa học</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
               <div className="bg-emerald-500/5 p-4 rounded-lg border border-emerald-500/10">
                  <label className="form-label">Tổ chức tuyên truyền ATTT nội bộ? (R2)</label>
                  <div className="flex gap-4 mt-1">
                    {["Có", "Không"].map(v => <label key={v} className="flex items-center space-x-1 text-xs"><input type="radio" value={v} {...register("R2_co_tuyen_truyen")} /><span>{v}</span></label>)}
                  </div>
                  {watch("R2_co_tuyen_truyen") === "Có" && (
                    <input {...register("R2_hinh_thuc_tuyen_truyen")} className="form-input mt-2 text-xs" placeholder="Hình thức (Email, Họp, Poster...)" />
                  )}
               </div>
            </div>

            <div className="space-y-3">
              {daoTaoFields.fields.map((field, idx) => (
                <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-black/20 p-3 rounded-lg border border-white/5 relative">
                  <div className="md:col-span-2 text-xs"><label className="form-label text-[10px]">Hình thức (Tập huấn, hội thảo...)</label><input {...register(`dao_tao.${idx}.hinh_thuc`)} className="form-input h-10" /></div>
                  <div className="text-xs"><label className="form-label text-[10px]">Thời gian</label><input {...register(`dao_tao.${idx}.thoi_gian`)} className="form-input h-10" /></div>
                  <div className="text-xs"><label className="form-label text-[10px]">Số cán bộ</label><input {...register(`dao_tao.${idx}.so_can_bo`)} className="form-input h-10" type="number" /></div>
                  <div className="md:col-span-2 text-xs"><label className="form-label text-[10px]">Đơn vị tổ chức</label><input {...register(`dao_tao.${idx}.don_vi_to_chuc`)} className="form-input h-10" /></div>
                  <div className="md:col-span-2 text-xs"><label className="form-label text-[10px]">Chứng chỉ / Số văn bản</label><input {...register(`dao_tao.${idx}.chung_chi_so_vb`)} className="form-input h-10" /></div>
                  <button type="button" onClick={() => daoTaoFields.remove(idx)} className="absolute top-2 right-2 text-rose-500"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </div>

          {/* MỤC S: KIỂM TRA */}
          <div className="section-card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="section-title mb-0"><span className="section-badge bg-blue-500">S</span> Mục S. Kiểm tra & Đánh giá định kỳ</h2>
              <button type="button" onClick={() => kiemTraFields.append({ loai_kiem_tra: "", don_vi_thuc_hien: "", thoi_gian: "", ket_qua_so_vb: "" })} className="btn-add"><Plus className="w-4 h-4" /> Thêm lần kiểm tra</button>
            </div>
            
            <div className="mb-4">
              <label className="form-label text-xs">Kế hoạch kiểm tra ATTT tiếp theo (Dự kiến - S2)</label>
              <input {...register("S2_ke_hoach_tiep_theo")} className="form-input text-xs" placeholder="Thời gian và nội dung dự kiến..." />
            </div>

            <div className="space-y-3">
              {kiemTraFields.fields.map((field, idx) => (
                <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-black/20 p-3 rounded-lg border border-white/5 relative">
                  <div className="md:col-span-2 text-xs"><label className="form-label text-[10px]">Loại (Pentest, Rà soát, ATTT...)</label><input {...register(`kiem_tra_attt.${idx}.loai_kiem_tra`)} className="form-input h-10" /></div>
                  <div className="text-xs"><label className="form-label text-[10px]">Thời gian</label><input {...register(`kiem_tra_attt.${idx}.thoi_gian`)} className="form-input h-10" /></div>
                  <div className="md:col-span-2 text-xs"><label className="form-label text-[10px]">Đơn vị thực hiện</label><input {...register(`kiem_tra_attt.${idx}.don_vi_thuc_hien`)} className="form-input h-10" /></div>
                  <div className="md:col-span-2 text-xs"><label className="form-label text-[10px]">Kết quả / Số văn bản</label><input {...register(`kiem_tra_attt.${idx}.ket_qua_so_vb`)} className="form-input h-10" /></div>
                  <button type="button" onClick={() => kiemTraFields.remove(idx)} className="absolute top-2 right-2 text-rose-500"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: XÁC NHẬN & HÌNH ẢNH (M-T) */}
      {activeTab === "hinh_anh" && (
        <div className="space-y-6 animate-fade-in pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* MỤC M: DANH MỤC ẢNH CHỤP */}
            <div className="section-card">
              <h2 className="section-title"><span className="section-badge bg-emerald-600">M</span> Mục M. Hồ sơ ảnh chụp (Checklist)</h2>
              <div className="grid grid-cols-1 gap-1">
                {[
                  "1. Ảnh chụp Modem/Router (Mặt trước/sau)",
                  "2. Ảnh chụp Tủ Rack/Thiết bị mạng",
                  "3. Ảnh chụp Máy chủ (Server)",
                  "4. Ảnh chụp Tem nhãn Serial máy chủ",
                  "5. Ảnh chụp Màn hình HĐH máy chủ (OS)",
                  "6. Ảnh chụp Màn hình Antivirus",
                  "7. Ảnh chụp Màn hình Backup",
                  "8. Ảnh chụp Hệ thống Camera/Đầu ghi",
                  "9. Ảnh chụp UPS/Điều hòa",
                  "10. Ảnh chụp PCCC phòng máy",
                  "11. Ảnh chụp Sơ đồ mạng dán tại phòng",
                  "12. Ảnh chụp Bảng ký tên ra vào",
                  "13. Ảnh chụp Cáp mạng/Hệ thống dây",
                  "14. Ảnh chụp Tổng quan phòng máy"
                ].map((text, i) => (
                  <label key={i} className="flex items-center space-x-3 p-2 hover:bg-white/5 rounded cursor-pointer transition-colors">
                    <input type="checkbox" {...register(`M${i+1}_status`)} className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-emerald-500" />
                    <span className="text-xs text-gray-300">{text}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* MỤC N: XÁC NHẬN CHỮ KÝ */}
            <div className="section-card">
              <h2 className="section-title"><span className="section-badge bg-indigo-500">N</span> Mục N. Xác nhận chữ ký</h2>
              <div className="space-y-4">
                <div className="p-3 bg-white/5 rounded border border-white/10">
                  <h3 className="text-[10px] font-bold text-indigo-400 uppercase mb-2">Người lập phiếu</h3>
                  <input {...register("n_nguoi_lap")} className="form-input text-xs mb-2" placeholder="Họ và tên" />
                  <input {...register("n_ngay_lap")} type="date" className="form-input text-xs" />
                </div>
                <div className="p-3 bg-white/5 rounded border border-white/10">
                  <h3 className="text-[10px] font-bold text-emerald-400 uppercase mb-2">Người kiểm tra</h3>
                  <input {...register("N_nguoi_kiem_tra_ho_ten")} className="form-input text-xs mb-2" placeholder="Họ và tên" />
                  <input {...register("N_ngay_kiem_tra")} type="date" className="form-input text-xs" />
                </div>
              </div>
            </div>
          </div>

          {/* MỤC T: CHI TIẾT TOPOLOGY (KẾT NỐI VẬT LÝ) */}
          <div className="section-card border-indigo-500/20">
            <h2 className="section-title text-indigo-400"><span className="section-badge bg-indigo-500">T</span> Mục T. Chi tiết Kết nối & Topology (T1-T4)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="form-label text-xs">Vùng DMZ (T1.1)</label>
                    <select {...register("T1_1_co_dmz")} className="form-input text-xs py-1">
                      <option value="Không">Không có</option>
                      <option value="Có">Có DMZ</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label text-xs">Phân vùng Camera (T1.4)</label>
                    <select {...register("T1_4_camera_vlan_has")} className="form-input text-xs py-1">
                      <option value="Không - Dùng chung LAN">Dùng chung LAN</option>
                      <option value="Có - VLAN tách biệt">VLAN tách biệt</option>
                    </select>
                  </div>
                </div>
                <div>
                   <label className="form-label text-xs">Mạng WiFi nội bộ/khách (T1.2 & T1.3)</label>
                   <div className="grid grid-cols-2 gap-2">
                     <select {...register("T1_2_wifi_tach_rieng")} className="form-input text-xs py-1">
                        <option value="Không có WiFi">Không có WiFi</option>
                        <option value="Có">Có WiFi</option>
                        <option value="Tách riêng VLAN">VLAN tách biệt</option>
                     </select>
                     {watch("T1_2_wifi_tach_rieng") !== "Không có WiFi" && <input {...register("T1_3_ssid")} placeholder="Tên SSID" className="form-input text-xs h-9" />}
                   </div>
                </div>
                <div>
                  <label className="form-label text-xs">Thông tin Tủ Rack (T3)</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input {...register("T3_rack_u")} className="form-input text-xs h-9" placeholder="Số U (VD: 12U)" />
                    <input {...register("T3_rack_vi_tri")} className="form-input text-xs h-9" placeholder="Vị trí tủ" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="form-label text-xs">Loại cáp mạng sử dụng (T4)</label>
                  <select {...register("T4_1_loai_cap")} className="form-input text-xs py-1">
                    <option value="Cáp đồng (Cat5e/Cat6)">Cáp đồng</option>
                    <option value="Cáp quang (Fiber)">Cáp quang</option>
                    <option value="Hỗn hợp">Hỗn hợp</option>
                  </select>
                </div>
                <div className="bg-black/20 p-3 rounded border border-white/5">
                   <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-bold text-indigo-300 uppercase">T2. Port Switch Mapping</span>
                      <button type="button" onClick={() => portSwitchFields.append({ ten_switch: "", so_cong: "", cong_su_dung: "" })} className="btn-add py-1 px-2 text-[8px]"><Plus className="w-2 h-2"/> Thêm</button>
                   </div>
                   <div className="max-h-32 overflow-y-auto space-y-1 pr-1">
                      {portSwitchFields.fields.map((field, idx) => (
                        <div key={field.id} className="flex gap-1">
                           <input {...register(`port_switch.${idx}.ten_switch`)} className="form-input text-[10px] h-7 bg-transparent" placeholder="Tên SW" />
                           <input {...register(`port_switch.${idx}.so_cong`)} className="form-input text-[10px] h-7 w-12 bg-transparent" placeholder="Tổng" />
                           <input {...register(`port_switch.${idx}.cong_su_dung`)} className="form-input text-[10px] h-7 w-12 bg-transparent" placeholder="Dùng" />
                           <button type="button" onClick={() => portSwitchFields.remove(idx)} className="text-rose-500"><Trash2 className="w-3 h-3"/></button>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-indigo-500/10">
               <h3 className="text-[10px] font-bold text-gray-500 uppercase mb-3">Sơ đồ Topology (Vẽ tự động)</h3>
               <NetworkDiagram data={formData} />
            </div>
          </div>

          {/* MỤC BC: BÁO CÁO */}
          <div className="section-card border-dashed border-indigo-500/30 bg-indigo-500/5">
            <h2 className="section-title"><span className="section-badge bg-indigo-600">BC</span> Metadata Báo cáo Khảo sát</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               <div>
                 <label className="form-label text-xs">Số báo cáo (BC_so_bao_cao)</label>
                 <input {...register("BC_so_bao_cao")} className="form-input text-xs" placeholder="VD: 45/MBF.NBH-KDT" />
               </div>
               <div>
                 <label className="form-label text-xs">Ngày báo cáo (BC_ngay_bao_cao)</label>
                 <input {...register("BC_ngay_bao_cao")} type="date" className="form-input text-xs" />
               </div>
               <div>
                 <label className="form-label text-xs">Người thực hiện báo cáo (BC_nguoi_thuc_hien)</label>
                 <input {...register("BC_nguoi_thuc_hien")} className="form-input text-xs" placeholder="Họ và tên kỹ thuật viên" />
               </div>
               <div className="lg:col-span-2">
                 <label className="form-label text-xs">Đơn vị thực hiện khảo sát (BC_don_vi_thuc_hien)</label>
                 <input {...register("BC_don_vi_thuc_hien")} className="form-input text-xs" placeholder="Tên chi nhánh/Công ty thực hiện" />
               </div>
               <div>
                 <label className="form-label text-xs">Tên tỉnh (BC_ten_tinh)</label>
                 <input {...register("BC_ten_tinh")} className="form-input text-xs" />
               </div>
               <div className="md:col-span-2">
                 <label className="form-label text-xs">Số QĐ UBND tỉnh về ATTT mạng (BC_qd_ubnd_tinh_so_attt)</label>
                 <input {...register("BC_qd_ubnd_tinh_so_attt")} className="form-input text-xs" />
               </div>
               <div className="md:col-span-2">
                 <label className="form-label text-xs">Số QĐ UBND tỉnh phân công đơn vị chuyên trách (BC_qd_ubnd_tinh_phan_cong)</label>
                 <input {...register("BC_qd_ubnd_tinh_phan_cong")} className="form-input text-xs" />
               </div>
            </div>
          </div>
        </div>
      )}
      {/* BOTTOM ACTION BAR - ENHANCED & STICKY */}
      <div className="fixed bottom-6 left-[280px] right-6 bg-gray-900/40 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[60] transition-all hover:border-white/20">
        <div className="flex justify-between gap-4 w-full px-2 items-center">
          <div className="flex items-center gap-8 hidden xl:flex border-r border-white/10 pr-8 mr-2">
             <div className="text-right">
                <div className="text-[10px] text-indigo-400 uppercase font-black tracking-widest mb-0.5">Tiến độ hồ sơ</div>
                <div className="text-2xl font-black text-white tabular-nums tracking-tighter">{calculateProgress().percent}<span className="text-xs text-gray-500 ml-0.5">%</span></div>
             </div>
             <div className="w-48 h-3 bg-black/40 rounded-full overflow-hidden border border-white/5 p-[2px] shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-600 via-cyan-400 to-emerald-400 rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(34,211,238,0.4)] relative" 
                  style={{ width: `${calculateProgress().percent}%` }}
                >
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem] animate-[progress-stripe_1s_linear_infinite]"></div>
                </div>
             </div>
          </div>

          <div className="flex justify-end gap-3 flex-1 items-center">
            <button 
              type="submit" 
              disabled={isSaving || isCompleting} 
              className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm transition-all shadow-xl active:scale-95 bg-white/5 hover:bg-white/10 text-white border border-white/10 disabled:opacity-50"
            >
               {isSaving ? <Loader2 className="w-4 h-4 animate-spin text-indigo-400" /> : <Save className="w-5 h-5 text-indigo-400" />}
               Lưu Nháp
            </button>

            <button 
              type="button" 
              onClick={handleComplete}
              disabled={isSaving || isCompleting}
              className="group flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl font-black text-sm transition-all shadow-2xl active:scale-95 bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400/20 disabled:opacity-50 relative overflow-hidden"
            >
               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
               {isCompleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
               Xác nhận Hoàn thành
            </button>
            
            <div className="w-[1px] h-10 bg-white/10 mx-3 hidden md:block"></div>

            <div className="flex items-center gap-2">
              <button type="button" onClick={() => triggerExport("phieu")} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors text-cyan-400" title="Xuất Phiếu Khảo Sát">
                <FileDown className="w-6 h-6" />
              </button>
              <button type="button" onClick={() => triggerExport("hsdx")} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors text-emerald-400" title="Xuất Hồ Sơ Đề Xuất">
                <Shield className="w-6 h-6" />
              </button>
              <button type="button" onClick={() => triggerExport("baocao")} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors text-indigo-400" title="Xuất Báo Cáo Khảo Sát">
                <FileText className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {showValidationModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-gray-900 border border-white/10 rounded-xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <div className="w-12 h-12 bg-rose-500/10 rounded-full flex items-center justify-center mb-4 mx-auto">
               <AlertCircle className="w-6 h-6 text-rose-500" />
            </div>
            <h2 className="text-xl font-bold text-center mb-2">Cảnh báo thiếu thông tin</h2>
            <p className="text-gray-400 text-sm text-center mb-6">Bạn đang bỏ trống các trường dữ liệu quan trọng bắt buộc phải có cho báo cáo.</p>
            
            <div className="bg-black/30 p-4 rounded-lg mb-6 border border-white/5 space-y-2 text-sm">
               {!formData.ten_don_vi && <div className="flex items-center gap-2 text-rose-400"><XCircle className="w-4 h-4"/> Tên cơ quan chủ quản</div>}
               {!formData.he_thong_thong_tin && <div className="flex items-center gap-2 text-rose-400"><XCircle className="w-4 h-4"/> Tên hệ thống thông tin</div>}
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => setShowValidationModal(false)} className="btn-secondary flex-1 justify-center py-3">
                Quay lại bổ sung
              </button>
              <button type="button" onClick={() => executeExport(exportType || "phieu")} className="btn-primary flex-1 justify-center bg-rose-600 py-3">
                Vẫn Xuất (Bỏ qua)
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
