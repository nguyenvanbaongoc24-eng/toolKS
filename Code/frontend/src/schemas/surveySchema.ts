import { SurveySection } from './types';

export const surveySchema: SurveySection[] = [
  {
    id: 'A',
    label: 'Mục A — Thông tin cơ quan / Chủ quản hệ thống',
    questions: [
      { id: 'A1_ten_don_vi', label: 'Tên đơn vị chủ quản hệ thống', type: 'text', required: true, sectionId: 'A' },
      { id: 'A2_ten_he_thong', label: 'Tên hệ thống thông tin', type: 'text', required: true, sectionId: 'A' },
      { id: 'A3_dia_chi', label: 'Địa chỉ trụ sở chính', type: 'text', required: true, sectionId: 'A' },
      { id: 'A4_so_dien_thoai', label: 'Số điện thoại cơ quan', type: 'text', sectionId: 'A' },
      { id: 'A5_email', label: 'Email cơ quan', type: 'text', sectionId: 'A' },
      { id: 'A6_ho_ten_thu_truong', label: 'Họ tên người đứng đầu đơn vị', type: 'text', required: true, sectionId: 'A' },
      { id: 'A6_chuc_vu_thu_truong', label: 'Chức vụ người đứng đầu', type: 'text', required: true, sectionId: 'A', placeholder: 'A6_chuc_vu_thu_truong' },
      { id: 'A7_so_quyet_dinh', label: 'Số Quyết định giao nhiệm vụ', type: 'text', sectionId: 'A' },
    ]
  },
  {
    id: 'B',
    label: 'Mục B — Cán bộ phụ trách CNTT / ATTT',
    questions: [
      { 
        id: 'can_bo_phu_trach', 
        label: 'Danh sách cán bộ chuyên trách', 
        type: 'fieldArray', 
        sectionId: 'B',
        columns: [
          { id: 'ho_ten', label: 'Họ và tên', type: 'text' },
          { id: 'chuc_vu', label: 'Chức vụ', type: 'text' },
          { id: 'so_dt', label: 'Số điện thoại', type: 'text' },
          { id: 'email', label: 'Email', type: 'text' },
          { id: 'trinh_do', label: 'Trình độ/Chuyên ngành', type: 'text' },
          { id: 'chung_chi_attt', label: 'Chứng chỉ ATTT', type: 'text' },
        ]
      },
      { id: 'B2_don_vi_ho_tro', label: 'Đơn vị hỗ trợ kỹ thuật bên ngoài (Tên + SĐT)', type: 'text', sectionId: 'B' },
    ]
  },
  {
    id: 'C',
    label: 'Mục C — Mô tả hệ thống thông tin',
    questions: [
      { id: 'C1_mo_ta_chuc_nang', label: 'Mô tả chức năng chính', type: 'textarea', required: true, sectionId: 'C' },
      { id: 'C2_doi_tuong_nguoi_dung', label: 'Đối tượng người dùng', type: 'textarea', required: true, sectionId: 'C' },
      { id: 'C3_loai_du_lieu', label: 'Loại dữ liệu xử lý/lưu trữ', type: 'textarea', required: true, sectionId: 'C' },
      { 
        id: 'C4_du_lieu_type', 
        label: 'Phân loại dữ liệu', 
        type: 'radio', 
        sectionId: 'C',
        options: ['Cá nhân thông thường', 'Cá nhân nhạy cảm', 'Dữ liệu công', 'Không xác định'],
        checkboxMap: {
          'Cá nhân thông thường': 'C4_du_lieu_ca_nhan_thuong',
          'Cá nhân nhạy cảm': 'C4_du_lieu_ca_nhan_nhay_cam',
          'Dữ liệu công': 'C4_du_lieu_cong',
          'Không xác định': 'C4_khong_xac_dinh'
        }
      },
      { id: 'C5_noi_bo', label: 'Số người dùng nội bộ (người)', type: 'number', required: true, sectionId: 'C' },
      { id: 'C5_ben_ngoai', label: 'Số người dùng bên ngoài (lượt/tháng)', type: 'text', required: true, sectionId: 'C' },
      { id: 'C6_nam_hoat_dong', label: 'Năm bắt đầu hoạt động', type: 'number', sectionId: 'C' },
      { id: 'C7_ket_noi_cap_tren_has', label: 'Kết nối với hệ thống cấp trên', type: 'radio', options: ['Có', 'Không'], required: true, sectionId: 'C' },
      { id: 'C7_ten_he_thong_cap_tren', label: 'Tên hệ thống cấp trên', type: 'text', sectionId: 'C' },
      { id: 'C8_bi_mat_nha_nuoc_has', label: 'Xử lý bí mật nhà nước', type: 'radio', options: ['Có', 'Không'], required: true, sectionId: 'C' },
      { id: 'C8_do_mat', label: 'Độ mật', type: 'text', sectionId: 'C' },
    ]
  },
  {
    id: 'D',
    label: 'Mục D — Thông tin kết nối Internet',
    questions: [
      { 
        id: 'ket_noi_internet', 
        label: 'Danh sách đường truyền', 
        type: 'fieldArray', 
        sectionId: 'D',
        columns: [
          { id: 'isp', label: 'ISP', type: 'text' },
          { id: 'loai_ket_noi', label: 'Loại kết nối', type: 'text' },
          { id: 'bang_thong', label: 'Băng thông', type: 'text' },
          { id: 'vai_tro', label: 'Vai trò', type: 'select', options: ['Chính', 'Dự phòng', 'Chính (duy nhất)'] },
          { id: 'ip_wan', label: 'Loại IP WAN', type: 'select', options: ['Tĩnh', 'Động'] },
          { id: 'ghi_chu', label: 'Ghi chú', type: 'text' },
        ]
      },
      { id: 'D2_router_modem', label: 'Thiết bị MODEM / Gateway (Hãng, IP)', type: 'text', required: true, sectionId: 'D' },
      { id: 'D3_ip_lan_gateway', label: 'Địa chỉ IP LAN của Gateway', type: 'text', required: true, sectionId: 'D' },
    ]
  },
  {
    id: 'E',
    label: 'Mục E — Danh mục thiết bị mạng',
    questions: [
      { 
        id: 'thiet_bi_mang', 
        label: 'Danh sách thiết bị mạng', 
        type: 'fieldArray', 
        sectionId: 'E',
        columns: [
          { id: 'loai_thiet_bi', label: 'Loại (Switch/AP...)', type: 'text' },
          { id: 'hang_san_xuat', label: 'Hãng', type: 'text' },
          { id: 'model', label: 'Model', type: 'text' },
          { id: 'so_serial', label: 'Số Serial', type: 'text' },
          { id: 'vi_tri', label: 'Vị trí', type: 'text' },
          { id: 'nam_mua', label: 'Năm mua', type: 'number' },
        ]
      },
      { 
        id: 'E2_firewall_type', 
        label: 'Trang bị Firewall phần cứng chuyên dụng?', 
        type: 'radio', 
        required: true, 
        sectionId: 'E',
        options: ['Có (phần cứng chuyên dụng)', 'Dùng Firewall tích hợp', 'Dùng phần mềm Firewall'],
        checkboxMap: {
          'Có (phần cứng chuyên dụng)': 'E2_co_firewall',
          'Dùng Firewall tích hợp': 'E2_router_tich_hop',
          'Dùng phần mềm Firewall': 'E2_phan_mem'
        }
      },
    ]
  },
  {
    id: 'F',
    label: 'Mục F — Thiết bị đầu cuối và Máy chủ',
    questions: [
      { id: 'F1_pc_sl', label: 'Số lượng PC', type: 'number', sectionId: 'F' },
      { id: 'F1_pc_os', label: 'Hệ điều hành PC', type: 'text', sectionId: 'F' },
      { id: 'F1_laptop_sl', label: 'Số lượng Laptop', type: 'number', sectionId: 'F' },
      { id: 'F1_laptop_os', label: 'Hệ điều hành Laptop', type: 'text', sectionId: 'F' },
      { id: 'F1_tablet_sl', label: 'Số lượng Tablet', type: 'number', sectionId: 'F' },
      { id: 'F1_mayin_sl', label: 'Số lượng Máy in/Fax', type: 'number', sectionId: 'F' },
      { id: 'F1_dienthoai_sl', label: 'Số lượng Điện thoại công vụ', type: 'number', sectionId: 'F' },
      { id: 'F2_khong_may_chu_has', label: 'Không có máy chủ vật lý', type: 'checkbox', sectionId: 'F' },
      { id: 'F2_luu_tru_o_dau', label: 'Dữ liệu lưu ở đâu (nếu không máy chủ)', type: 'text', sectionId: 'F' },
      { 
        id: 'may_chu', 
        label: 'Danh sách máy chủ', 
        type: 'fieldArray', 
        sectionId: 'F',
        columns: [
          { id: 'vai_tro', label: 'Vai trò', type: 'text' },
          { id: 'hang_model', label: 'Hãng / Model', type: 'text' },
          { id: 'so_serial', label: 'Số serial', type: 'text' },
          { id: 'ram_gb', label: 'RAM (GB)', type: 'number' },
          { id: 'o_cung_tb', label: 'HHDD (TB)', type: 'number' },
          { id: 'he_dieu_hanh', label: 'OS', type: 'text' },
          { id: 'vi_tri', label: 'Vị trí', type: 'text' },
        ]
      },
      { id: 'F3_cloud_has', label: 'Sử dụng Cloud (AWS/Azure/Viettel...)', type: 'radio', options: ['Có', 'Không'], sectionId: 'F' },
      { id: 'F3_ten_cloud', label: 'Tên Cloud/Nhà cung cấp', type: 'text', sectionId: 'F' },
    ]
  },
  {
    id: 'G',
    label: 'Mục G — Hệ thống Camera giám sát',
    questions: [
      { 
        id: 'camera', 
        label: 'Danh sách Camera', 
        type: 'fieldArray', 
        sectionId: 'G',
        columns: [
          { id: 'hang_san_xuat', label: 'Hãng', type: 'text' },
          { id: 'model', label: 'Model', type: 'text' },
          { id: 'so_serial', label: 'Số serial', type: 'text' },
          { id: 'do_phan_giai', label: 'Độ phân giải', type: 'text' },
          { id: 'vi_tri', label: 'Vị trí', type: 'text' },
        ]
      },
      { id: 'G2_dau_ghi_nvr', label: 'Đầu ghi NVR/DVR (Hãng, Model, S/N, Vị trí)', type: 'text', required: true, sectionId: 'G' },
      { id: 'G3_luu_tru_ngay', label: 'Thời gian lưu trữ (ngày)', type: 'text', required: true, sectionId: 'G' },
    ]
  },
  {
    id: 'H',
    label: 'Mục H — Quy hoạch địa chỉ IP LAN',
    questions: [
      { id: 'H1_dai_ip_lan', label: 'Dải IP LAN (VD: 192.168.1.0/24)', type: 'text', required: true, sectionId: 'H' },
      { id: 'H2_ip_gateway', label: 'IP Gateway', type: 'text', required: true, sectionId: 'H' },
      { id: 'H3_dns', label: 'DNS Server', type: 'text', sectionId: 'H' },
      { id: 'H4_co_vlan', label: 'Có chia VLAN', type: 'radio', options: ['Có', 'Không'], required: true, sectionId: 'H' },
      { id: 'H4_so_vlan', label: 'Số lượng VLAN', type: 'number', sectionId: 'H' },
      { id: 'H4_mo_ta_vlan', label: 'Mô tả các VLAN', type: 'textarea', sectionId: 'H' },
      { 
        id: 'ip_tinh', 
        label: 'DS thiết bị dùng IP tĩnh (Tối đa 5)', 
        type: 'fieldArray', 
        sectionId: 'H',
        columns: [
          { id: 'ten_thiet_bi', label: 'Thiết bị', type: 'text' },
          { id: 'dia_chi_ip', label: 'Địa chỉ IP', type: 'text' },
          { id: 'ghi_chu', label: 'Ghi chú', type: 'text' },
        ]
      },
    ]
  },
  {
    id: 'I',
    label: 'Mục I — Ứng dụng và Dịch vụ',
    questions: [
      { 
        id: 'ung_dung', 
        label: 'Danh sách Ứng dụng/Dịch vụ', 
        type: 'fieldArray', 
        sectionId: 'I',
        columns: [
          { id: 'ten', label: 'Tên ứng dụng', type: 'text' },
          { id: 'chuc_nang', label: 'Chức năng', type: 'text' },
          { id: 'don_vi_cung_cap', label: 'Đơn vị cung cấp', type: 'text' },
          { id: 'phien_ban', label: 'Phiên bản', type: 'text' },
          { id: 'ket_noi_internet', label: 'Có kết nối Internet', type: 'select', options: ['Có', 'Không'] },
        ]
      },
    ]
  },
  {
    id: 'L',
    label: 'Mục L — Bảo mật và Kiểm soát',
    questions: [
      // L1
      { 
        id: 'l1_phys_key', 
        label: 'Kiểm soát truy cập vật lý phòng máy chủ', 
        type: 'radio', 
        sectionId: 'L', 
        subsectionId: 'L1',
        options: ['Có khóa cửa (chìa khóa thường)', 'Có khóa cửa + camera giám sát', 'Có thẻ từ / kiểm soát điện tử', 'Không có kiểm soát riêng'],
        checkboxMap: {
          'Có khóa cửa (chìa khóa thường)': 'L1_khoa_cua_thuong',
          'Có khóa cửa + camera giám sát': 'L1_khoa_camera',
          'Có thẻ từ / kiểm soát điện tử': 'L1_the_tu',
          'Không có kiểm soát riêng': 'L1_khong_kiem_soat'
        }
      },
      { id: 'L1_bang_ky_ten', label: 'Có bảng ký tên vào ra', type: 'radio', options: ['Có', 'Không'], sectionId: 'L', subsectionId: 'L1' },
      // L2
      { 
        id: 'l2_pass_policy', 
        label: 'Chính sách mật khẩu', 
        type: 'radio', 
        sectionId: 'L', 
        subsectionId: 'L2',
        options: ['Đã ban hành và áp dụng', 'Có chính sách mật khẩu (chưa văn bản)', 'Không có chính sách thống nhất'],
        checkboxMap: {
          'Đã ban hành và áp dụng': 'L2_chinh_sach_mat_khau',
          'Có chính sách mật khẩu (chưa văn bản)': 'L2_chinh_sach_mat_khau_chua_vb',
          'Không có chính sách thống nhất': 'L2_chinh_sach_khong'
        }
      },
      { id: 'L2_do_dai_min', label: 'Độ dài tối thiểu (ký tự)', type: 'number', sectionId: 'L', subsectionId: 'L2' },
      { id: 'L2_doi_dinh_ky_thang', label: 'Đổi định kỳ (tháng)', type: 'number', sectionId: 'L', subsectionId: 'L2' },
      { 
        id: 'L2_admin_acc_type', 
        label: 'Sử dụng tài khoản Admin', 
        type: 'radio', 
        sectionId: 'L', 
        subsectionId: 'L2',
        options: ['Mỗi cán bộ có tài khoản riêng', 'Dùng chung một tài khoản admin', 'Cả hai hình thức'],
        checkboxMap: {
          'Mỗi cán bộ có tài khoản riêng': 'L2_admin_rieng',
          'Dùng chung một tài khoản admin': 'L2_admin_chung',
          'Cả hai hình thức': 'L2_admin_ca_hai'
        }
      },
      { id: 'L2_2fa_has', label: 'Sử dụng 2FA', type: 'radio', options: ['Có', 'Không'], sectionId: 'L', subsectionId: 'L2' },
      { id: 'L2_2fa_ap_dung_cho', label: '2FA áp dụng cho', type: 'text', sectionId: 'L', subsectionId: 'L2' },
      // L3
      { id: 'l3_av_has', label: 'Có phần mềm diệt Virus', type: 'radio', options: ['Có', 'Không'], sectionId: 'L', subsectionId: 'L3' },
      { id: 'l3_av_name', label: 'Tên phần mềm diệt Virus', type: 'text', sectionId: 'L', subsectionId: 'L3', placeholder: 'L3_ten_phanmem' },
      { id: 'L3_ban_quyen', label: 'Bản quyền', type: 'select', options: ['Có', 'Không', 'Miễn phí'], sectionId: 'L', subsectionId: 'L3' },
      { id: 'L3_cap_nhat', label: 'Cập nhật Virus Pattern', type: 'select', options: ['Tự động', 'Thủ công', 'Không'], sectionId: 'L', subsectionId: 'L3' },
      // L4
      { 
        id: 'l4_bak_has', 
        label: 'Quy trình sao lưu dữ liệu', 
        type: 'radio', 
        sectionId: 'L', 
        subsectionId: 'L4',
        options: ['Có - Tự động', 'Có - Thủ công', 'Không sao lưu'],
        checkboxMap: {
          'Có - Tự động': 'L4_tu_dong',
          'Có - Thủ công': 'L4_thu_cong',
          'Không sao lưu': 'L4_khong'
        }
      },
      { id: 'L4_bak_frequency', label: 'Tần suất sao lưu', type: 'select', options: ['Hàng ngày', 'Tuần', 'Tháng'], sectionId: 'L', subsectionId: 'L4', placeholder: 'L4_co_tan_suat' },
      { id: 'L4_bak_location', label: 'Nơi lưu bản backup', type: 'text', sectionId: 'L', subsectionId: 'L4', placeholder: 'L4_luu_o_dau' },
      { id: 'L4_offsite_has', label: 'Có lưu Off-site', type: 'radio', options: ['Có', 'Không'], sectionId: 'L', subsectionId: 'L4' },
      { id: 'L4_offsite_location', label: 'Địa điểm lưu Off-site', type: 'text', sectionId: 'L', subsectionId: 'L4', placeholder: 'L4_off_site_dia_diem' },
      // L5
      { id: 'l5_log_enabled', label: 'Router/Switch có bật Log', type: 'radio', options: ['Có', 'Chưa kiểm tra', 'Không'], sectionId: 'L', subsectionId: 'L5', checkboxMap: { 'Có': 'L5_co', 'Chưa kiểm tra': 'L5_chua_kiem_tra', 'Không': 'L5_khong' } },
      { id: 'L5_log_retention', label: 'Thời gian lưu Log', type: 'radio', options: ['<3T', '3-6T', '>6T', 'Không lưu'], sectionId: 'L', subsectionId: 'L5', placeholder: 'L5_log_bao_lau' },
      { id: 'L5_siem_has', label: 'Có hệ thống SIEM/Giám sát', type: 'radio', options: ['Có', 'Không'], sectionId: 'L', subsectionId: 'L5', placeholder: 'L5_siem' },
      { id: 'l5_siem_name', label: 'Tên hệ thống SIEM', type: 'text', sectionId: 'L', subsectionId: 'L5', placeholder: 'L5_siem_ten' },
      // L6
      { 
        id: 'l6_incident_has', 
        label: 'Sự cố ATTT trong 2 năm qua', 
        type: 'radio', 
        sectionId: 'L', 
        subsectionId: 'L6',
        options: ['Không có sự cố nào', 'Có sự cố (đã xử lý)', 'Có sự cố (chưa xử lý xong)', 'Không biết'],
        checkboxMap: {
          'Không có sự cố nào': 'L6_khong_su_co',
          'Có sự cố (đã xử lý)': 'L6_co_su_co',
          'Có sự cố (chưa xử lý xong)': 'L6_co_su_co',
          'Không biết': 'L6_khong_biet'
        }
      },
      { id: 'l6_incident_desc', label: 'Mô tả ngắn sự cố', type: 'textarea', sectionId: 'L', subsectionId: 'L6', placeholder: 'L6_su_co' },
      { id: 'l6_incident_resolution', label: 'Cách thức xử lý sự cố', type: 'textarea', sectionId: 'L', subsectionId: 'L6', placeholder: 'L6_xu_ly_nhu_the_nao' },
      // L7
      { 
        id: 'l7_type', 
        label: 'Loại Firewall đang sử dụng (L7.1)', 
        type: 'radio', 
        sectionId: 'L', 
        subsectionId: 'L7',
        options: ['Tường lửa tích hợp Router (SPI)', 'Tường lửa phần cứng chuyên dụng', 'Tường lửa phần mềm trên máy chủ', 'Không có'],
        checkboxMap: {
          'Tường lửa tích hợp Router (SPI)': 'L7_1_router_spi',
          'Tường lửa phần cứng chuyên dụng': 'L7_1_phan_cung',
          'Tường lửa phần mềm trên máy chủ': 'L7_1_phan_mem',
          'Không có': 'L7_1_khong'
        }
      },
      { 
        id: 'L7_2_chinh_sach', 
        label: 'Chính sách mặc định của Firewall (L7.2)', 
        type: 'radio', 
        sectionId: 'L', 
        subsectionId: 'L7',
        options: ['Chặn tất cả (Default Deny)', 'Cho phép tất cả (Default Allow)', 'Chưa cấu hình'],
        checkboxMap: {
          'Chặn tất cả (Default Deny)': 'L7_2_default_deny',
          'Cho phép tất cả (Default Allow)': 'L7_2_default_allow',
          'Chưa cấu hình': 'L7_2_chua_cau_hinh'
        }
      },
      { 
        id: 'L7_3_remote_access', 
        label: 'Truy cập từ xa (L7.3)', 
        type: 'radio', 
        sectionId: 'L', 
        subsectionId: 'L7',
        options: ['Có – qua VPN', 'Có – qua Remote Desktop / AnyDesk', 'Không'],
        checkboxMap: {
          'Có – qua VPN': 'L7_3_vpn',
          'Có – qua Remote Desktop / AnyDesk': 'L7_3_rdp',
          'Không': 'L7_3_khong'
        }
      },
      { id: 'L7_4_cong_mo', label: 'Cổng/Dịch vụ đang mở ra Internet (L7.4)', type: 'textarea', sectionId: 'L', subsectionId: 'L7' },
      // L8
      { id: 'L8_1_co_ups', label: 'Có trang bị UPS', type: 'radio', options: ['Có', 'Không'], sectionId: 'L', subsectionId: 'L8' },
      { id: 'L8_1_ups_hang_model', label: 'Hãng / Model UPS', type: 'text', sectionId: 'L', subsectionId: 'L8' },
      { id: 'L8_1_ups_cong_suat_va', label: 'Công suất (VA)', type: 'number', sectionId: 'L', subsectionId: 'L8' },
      { id: 'L8_1_ups_thoi_gian_phut', label: 'Thời gian lưu điện (~phút)', type: 'number', sectionId: 'L', subsectionId: 'L8' },
      { 
        id: 'L8_2_dieu_hoa', 
        label: 'Hệ thống điều hòa phòng máy chủ', 
        type: 'radio', 
        sectionId: 'L', 
        subsectionId: 'L8',
        options: ['Có – 24/7', 'Có – Giờ hành chính', 'Không'],
        checkboxMap: {
          'Có – 24/7': 'L8_2_247',
          'Có – Giờ hành chính': 'L8_2_hanh_chinh',
          'Không': 'L8_2_khong'
        }
      },
      { id: 'L8_3_binh_chua_chay', label: 'Có bình chữa cháy', type: 'radio', options: ['Có', 'Không'], sectionId: 'L', subsectionId: 'L8', placeholder: 'L8_3_binh_chua_chay' },
      { id: 'L8_3_type_co2', label: 'CO2', type: 'checkbox', sectionId: 'L', subsectionId: 'L8', placeholder: 'L8_3_loai_co2' },
      { id: 'L8_3_type_bot', label: 'Bột khô', type: 'checkbox', sectionId: 'L', subsectionId: 'L8', placeholder: 'L8_3_loai_bot_khô' },
      { id: 'L8_4_mo_ta_phong', label: 'Mô tả phòng thiết bị (S, chìa khóa...)', type: 'textarea', sectionId: 'L', subsectionId: 'L8' },
    ]
  },
  {
    id: 'K',
    label: 'Mục K — Văn bản pháp lý ATTT',
    questions: [
      { id: 'k1_quy_che', label: 'Số QĐ Quy chế ATTT', type: 'text', required: true, sectionId: 'K', placeholder: 'K1_quy_che_attt' },
      { id: 'k2_ke_hoach_ht', label: 'Số Kế hoạch ATTT năm HT', type: 'text', required: true, sectionId: 'K', placeholder: 'K2_ke_hoach_nam_ht' },
      { id: 'k3_ke_hoach_tr', label: 'Số Kế hoạch ATTT năm trước', type: 'text', required: true, sectionId: 'K', placeholder: 'K3_ke_hoach_nam_truoc' },
      { id: 'k4_qd_phan_cong_cb', label: 'Số QĐ phân công cán bộ ATTT', type: 'text', required: true, sectionId: 'K', placeholder: 'K4_qd_phan_cong_cb' },
      { id: 'K5_qd_phe_duyet_httt', label: 'Số QĐ phê duyệt HTTT', type: 'text', sectionId: 'K' },
      { id: 'K6_ung_pho_su_co', label: 'Số VB Quy trình ứng phó sự cố', type: 'text', sectionId: 'K' },
      { id: 'K7_bien_ban_kiem_tra', label: 'Số Biên bản kiểm tra ATTT gần nhất', type: 'text', sectionId: 'K' },
    ]
  },
  {
    id: 'P',
    label: 'Mục P — Mã hóa và Bảo vệ dữ liệu',
    questions: [
      { id: 'p1_protocol', label: 'Giao thức Web sử dụng', type: 'radio', options: ['HTTPS (có chứng chỉ SSL/TLS)', 'HTTP (không mã hóa)', 'Cả hai'], required: true, sectionId: 'P' },
      { id: 'p2_vpn', label: 'Kết nối từ xa qua VPN', type: 'radio', options: ['Có', 'Không'], sectionId: 'P' },
      { id: 'p2_vpn_type', label: 'Loại VPN', type: 'text', sectionId: 'P', placeholder: 'P2_loai_vpn' },
      { 
        id: 'P3_ket_noi_cap_tren_type', 
        label: 'Kết nối lên cấp trên qua', 
        type: 'radio', 
        sectionId: 'P',
        options: ['VPN chuyên dụng', 'Internet (HTTPS)', 'MPLS', 'Không kết nối'],
        checkboxMap: {
          'VPN chuyên dụng': 'P3_vpn_chuyen_dung',
          'Internet (HTTPS)': 'P3_internet_https',
          'MPLS': 'P3_mpls',
          'Không kết nối': 'P3_khong_ket_noi'
        }
      },
      { id: 'P3_1_ten_he_thong_va_phuong_thuc', label: 'Tên hệ thống & Phương thức kết nối', type: 'textarea', sectionId: 'P' },
      { id: 'P4_ma_hoa_luu_tru_has', label: 'Mã hóa dữ liệu lưu trữ', type: 'radio', options: ['Có', 'Không'], sectionId: 'P' },
      { id: 'P4_phuong_phap', label: 'Phần mềm/Phương pháp mã hóa', type: 'text', sectionId: 'P' },
      { id: 'P5_email_sec', label: 'Email công vụ có bảo mật', type: 'radio', options: ['Có', 'Không', 'Không biết'], sectionId: 'P' },
    ]
  },
  {
    id: 'Q',
    label: 'Mục Q — Quản lý vận hành và Vá lỗi',
    questions: [
      { 
        id: 'cap_nhat_he_dieu_hanh', 
        label: 'Quy trình cập nhật OS', 
        type: 'radio', 
        sectionId: 'Q',
        options: ['Hàng tháng', 'Hàng quý', 'Khi có cảnh báo', 'Khác', 'Không có quy trình – Cập nhật tùy lúc', 'Không cập nhật'],
        checkboxMap: {
          'Hàng tháng': 'Q1_update_hang_thang',
          'Hàng quý': 'Q1_update_hang_quy',
          'Khi có cảnh báo': 'Q1_update_canh_bao',
          'Khác': 'Q1_update_khac',
          'Không có quy trình – Cập nhật tùy lúc': 'Q1_update_tuy_luc',
          'Không cập nhật': 'Q1_update_khong'
        }
      },
      { id: 'Q2_cap_nhat_ung_dung', label: 'Cập nhật ứng dụng', type: 'radio', options: ['Có – Tự động', 'Có – Thủ công', 'Không cập nhật'], sectionId: 'Q' },
      { id: 'Q3_nguoi_chiu_trach_nhiem', label: 'Người chịu trách nhiệm vá lỗi', type: 'text', sectionId: 'Q' },
      { id: 'Q4_firmware_mang', label: 'Cập nhật Firmware thiết bị mạng', type: 'text', sectionId: 'Q' },
      { id: 'Q5_theo_doi_canh_bao', label: 'Theo dõi cảnh báo VNCERT/Sở TTTT', type: 'radio', options: ['Có', 'Không', 'Chưa biết'], sectionId: 'Q' },
    ]
  },
  {
    id: 'R',
    label: 'Mục R — Đào tạo và Nhận thức',
    questions: [
      { 
        id: 'dao_tao', 
        label: 'Danh sách hoạt động đào tạo', 
        type: 'fieldArray', 
        sectionId: 'R',
        columns: [
          { id: 'hinh_thuc', label: 'Hình thức', type: 'text' },
          { id: 'don_vi_to_chuc', label: 'Đơn vị tổ chức', type: 'text' },
          { id: 'thoi_gian', label: 'Thời gian', type: 'text' },
          { id: 'so_can_bo', label: 'Số CB tham gia', type: 'number' },
        ]
      },
      { id: 'R2_hinh_thuc_tuyen_truyen', label: 'Hình thức tuyên truyền nội bộ', type: 'text', sectionId: 'R' },
    ]
  },
  {
    id: 'S',
    label: 'Mục S — Kiểm tra và Đánh giá',
    questions: [
      { 
        id: 'kiem_tra_attt', 
        label: 'Lịch sử kiểm tra ATTT', 
        type: 'fieldArray', 
        sectionId: 'S',
        columns: [
          { id: 'loai_kiem_tra', label: 'Loại kiểm tra', type: 'text' },
          { id: 'don_vi_thuc_hien', label: 'Đơn vị thực hiện', type: 'text' },
          { id: 'thoi_gian', label: 'Thời gian', type: 'text' },
          { id: 'ket_qua_so_vb', label: 'Kết quả / Số VB', type: 'text' },
        ]
      },
      { id: 'S2_ke_hoach_tiep_theo', label: 'Kế hoạch kiểm tra tiếp theo', type: 'text', sectionId: 'S' },
    ]
  },
  {
    id: 'T',
    label: 'Mục T — Chi tiết Topology',
    questions: [
      { id: 'T1_1_co_dmz', label: 'Có phân vùng DMZ', type: 'radio', options: ['Có', 'Không'], sectionId: 'T' },
      { id: 'T1_1_may_chu_dmz', label: 'Các máy chủ trong DMZ', type: 'text', sectionId: 'T' },
      { id: 'T1_2_wifi_tach_rieng', label: 'WiFi tách riêng LAN', type: 'radio', options: ['Có', 'Không có WiFi', 'Tách riêng VLAN'], sectionId: 'T' },
      { id: 'T1_3_ssid', label: 'SSID WiFi', type: 'text', sectionId: 'T' },
      { id: 'T1_3_bao_mat_wifi', label: 'Chuẩn bảo mật WiFi', type: 'text', sectionId: 'T' },
      { id: 'T1_4_camera_vlan_has', label: 'Camera nằm trên VLAN riêng', type: 'radio', options: ['Có - VLAN tách biệt', 'Không - Dùng chung LAN'], sectionId: 'T' },
      { 
        id: 'port_switch', 
        label: 'Port Mapping', 
        type: 'fieldArray', 
        sectionId: 'T',
        columns: [
          { id: 'ten_switch', label: 'Tên Switch', type: 'text' },
          { id: 'so_cong', label: 'Tổng cổng', type: 'number' },
          { id: 'cong_su_dung', label: 'Cổng sử dụng', type: 'text' },
        ]
      },
      { id: 'T3_1_co_rack', label: 'Sử dụng tủ Rack', type: 'radio', options: ['Có', 'Không'], sectionId: 'T' },
      { id: 'T3_1_rack_u', label: 'Kích thước Rack (U)', type: 'text', sectionId: 'T' },
      { id: 'T3_1_rack_vi_tri', label: 'Vị trí đặt Rack', type: 'text', sectionId: 'T' },
      { id: 'T3_2_thiet_bi_trong_tu', label: 'Thiết bị trong tủ Rack', type: 'textarea', sectionId: 'T' },
      { id: 'T4_1_loai_cap', label: 'Loại cáp nội bộ', type: 'radio', options: ['Cáp đồng (Cat5e/Cat6)', 'Cáp quang (Fiber)', 'Hỗn hợp'], sectionId: 'T' },
      { id: 'T4_2_cap_isp', label: 'Cáp từ ISP vào Gateway', type: 'text', sectionId: 'T' },
      { 
        id: 'T5_vi_tri', 
        label: 'Vị trí mặt bằng thiết bị', 
        type: 'fieldArray', 
        sectionId: 'T',
        columns: [
          { id: 'ten_thiet_bi', label: 'Thiết bị', type: 'text' },
          { id: 'tang', label: 'Tầng', type: 'text' },
          { id: 'phong_cu_the', label: 'Phòng', type: 'text' },
        ]
      },
    ]
  },
  {
    id: 'M',
    label: 'Mục M — Tài liệu và Ảnh chụp',
    questions: [
      { id: 'M1_status', label: 'M1. Ảnh nhãn Router/Modem', type: 'checkbox', sectionId: 'M', placeholder: 'M1_anh_router' },
      { id: 'M2_status', label: 'M2. Ảnh nhãn Switch', type: 'checkbox', sectionId: 'M', placeholder: 'M2_anh_switch' },
      { id: 'M3_status', label: 'M3. Ảnh nhãn Camera', type: 'checkbox', sectionId: 'M', placeholder: 'M3_anh_camera' },
      { id: 'M4_status', label: 'M4. Ảnh nhãn NVR/DVR', type: 'checkbox', sectionId: 'M', placeholder: 'M4_anh_nvr' },
      { id: 'M9_status', label: 'M9. Scan QĐ Quy chế ATTT', type: 'checkbox', sectionId: 'M', placeholder: 'M9_scan_qd_attt' },
      { id: 'M10_status', label: 'M10. Scan Kế hoạch ATTT', type: 'checkbox', sectionId: 'M', placeholder: 'M10_scan_ke_hoach' },
      { id: 'M11_status', label: 'M11. Scan QĐ phân công cán bộ', type: 'checkbox', sectionId: 'M', placeholder: 'M11_scan_qd_canbo' },
    ]
  },
  {
    id: 'N',
    label: 'Mục N — Xác nhận và Chữ ký',
    questions: [
      { id: 'n_nguoi_lap', label: 'Họ tên người điền phiếu', type: 'text', required: true, sectionId: 'N', placeholder: 'N_nguoi_dien_ho_ten' },
      { id: 'n_ngay_lap', label: 'Ngày điền phiếu', type: 'date', required: true, sectionId: 'N', placeholder: 'N_ngay_dien' },
      { id: 'N_nguoi_kiem_tra_ho_ten', label: 'Họ tên người kiểm tra', type: 'text', required: true, sectionId: 'N' },
      { id: 'N_ngay_kiem_tra', label: 'Ngày kiểm tra', type: 'date', required: true, sectionId: 'N' },
    ]
  },
  {
    id: 'BC',
    label: 'Metadata Báo cáo',
    questions: [
      { id: 'BC_so_bao_cao', label: 'Số báo cáo', type: 'text', sectionId: 'BC' },
      { id: 'BC_ngay_bao_cao', label: 'Ngày báo cáo', type: 'date', sectionId: 'BC' },
      { id: 'BC_nguoi_thuc_hien', label: 'Người thực hiện khảo sát', type: 'text', sectionId: 'BC' },
      { id: 'BC_don_vi_thuc_hien', label: 'Đơn vị thực hiện (Chi nhánh)', type: 'text', sectionId: 'BC' },
      { id: 'BC_ten_tinh', label: 'Tên tỉnh', type: 'text', sectionId: 'BC' },
    ]
  }
];
