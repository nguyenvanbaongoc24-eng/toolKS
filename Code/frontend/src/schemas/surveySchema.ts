import { SurveySection } from './types';

export const surveySchema: SurveySection[] = [
  {
    id: 'section_ac',
    label: 'A-C. Đơn vị & Hệ thống',
    questions: [
      // Mục A
      { id: 'A1_ten_don_vi', label: 'Tên đơn vị chủ quản hệ thống', type: 'text', required: true, sectionId: 'section_ac' },
      { id: 'A2_ten_he_thong', label: 'Tên hệ thống thông tin', type: 'text', required: true, sectionId: 'section_ac' },
      { id: 'A3_dia_chi', label: 'Địa chỉ trụ sở chính', type: 'text', required: true, sectionId: 'section_ac' },
      { id: 'A4_so_dien_thoai', label: 'Số điện thoại cơ quan', type: 'text', sectionId: 'section_ac' },
      { id: 'A5_email', label: 'Email cơ quan', type: 'text', sectionId: 'section_ac' },
      { id: 'A6_ho_ten_thu_truong', label: 'Họ tên người đứng đầu đơn vị', type: 'text', required: true, sectionId: 'section_ac' },
      { id: 'A6_chuc_vu_thu_truong', label: 'Chức vụ người đứng đầu', type: 'text', required: true, sectionId: 'section_ac', placeholder: 'A6_chuc_vu_thu_truong' },
      { id: 'A7_so_quyet_dinh', label: 'Số Quyết định giao nhiệm vụ', type: 'text', sectionId: 'section_ac' },
      // Mục B
      { 
        id: 'can_bo_phu_trach', 
        label: 'Danh sách cán bộ chuyên trách', 
        type: 'fieldArray', 
        sectionId: 'section_ac',
        columns: [
          { id: 'ho_ten', label: 'Họ và tên', type: 'text' },
          { id: 'chuc_vu', label: 'Chức vụ', type: 'text' },
          { id: 'so_dt', label: 'Số điện thoại', type: 'text' },
          { id: 'email', label: 'Email', type: 'text' },
          { id: 'trinh_do', label: 'Trình độ/Chuyên ngành', type: 'text' },
          { id: 'chung_chi_attt', label: 'Chứng chỉ ATTT', type: 'text' },
        ]
      },
      { id: 'B2_don_vi_ho_tro', label: 'Đơn vị hỗ trợ kỹ thuật bên ngoài (Tên + SĐT)', type: 'text', sectionId: 'section_ac' },
      // Mục C
      { id: 'C1_mo_ta_chuc_nang', label: 'Mô tả chức năng chính', type: 'textarea', required: true, sectionId: 'section_ac' },
      { id: 'C2_doi_tuong_nguoi_dung', label: 'Đối tượng người dùng', type: 'textarea', required: true, sectionId: 'section_ac' },
      { id: 'C3_loai_du_lieu', label: 'Loại dữ liệu xử lý/lưu trữ', type: 'textarea', required: true, sectionId: 'section_ac' },
      { 
        id: 'C4_du_lieu_type', 
        label: 'Phân loại dữ liệu', 
        type: 'radio', 
        sectionId: 'section_ac',
        options: ['Cá nhân thông thường', 'Cá nhân nhạy cảm', 'Dữ liệu công', 'Không xác định'],
        checkboxMap: {
          'Cá nhân thông thường': 'C4_du_lieu_ca_nhan_thuong',
          'Cá nhân nhạy cảm': 'C4_du_lieu_ca_nhan_nhay_cam',
          'Dữ liệu công': 'C4_du_lieu_cong',
          'Không xác định': 'C4_khong_xac_dinh'
        }
      },
      { id: 'C5_noi_bo', label: 'Số người dùng nội bộ (người)', type: 'number', required: true, sectionId: 'section_ac' },
      { id: 'C5_ben_ngoai', label: 'Số người dùng bên ngoài (lượt/tháng)', type: 'text', required: true, sectionId: 'section_ac' },
      { id: 'C6_nam_hoat_dong', label: 'Năm bắt đầu hoạt động', type: 'number', sectionId: 'section_ac' },
      { id: 'C7_ket_noi_cap_tren_has', label: 'Kết nối với hệ thống cấp trên', type: 'radio', options: ['Có', 'Không'], required: true, sectionId: 'section_ac' },
      { id: 'C7_ten_he_thong_cap_tren', label: 'Tên hệ thống cấp trên', type: 'text', sectionId: 'section_ac' },
      { id: 'C8_bi_mat_nha_nuoc_has', label: 'Xử lý bí mật nhà nước', type: 'radio', options: ['Có', 'Không'], required: true, sectionId: 'section_ac' },
      { id: 'C8_do_mat', label: 'Độ mật', type: 'text', sectionId: 'section_ac' },
    ]
  },
  {
    id: 'section_di',
    label: 'D-I. Hạ tượng & Mạng',
    questions: [
      // Mục D
      { 
        id: 'ket_noi_internet', 
        label: 'Danh sách đường truyền', 
        type: 'fieldArray', 
        sectionId: 'section_di',
        columns: [
          { id: 'isp', label: 'ISP', type: 'text' },
          { id: 'loai_ket_noi', label: 'Loại kết nối', type: 'text' },
          { id: 'bang_thong', label: 'Băng thông', type: 'text' },
          { id: 'vai_tro', label: 'Vai trò', type: 'select', options: ['Chính', 'Dự phòng', 'Chính (duy nhất)'] },
          { id: 'ip_wan', label: 'Loại IP WAN', type: 'select', options: ['Tĩnh', 'Động'] },
          { id: 'ghi_chu', label: 'Ghi chú', type: 'text' },
        ]
      },
      { id: 'D2_router_modem', label: 'Thiết bị MODEM / Gateway (Hãng, IP)', type: 'text', required: true, sectionId: 'section_di' },
      { id: 'D3_ip_lan_gateway', label: 'Địa chỉ IP LAN của Gateway', type: 'text', required: true, sectionId: 'section_di' },
      // Mục E
      { 
        id: 'thiet_bi_mang', 
        label: 'Danh sách thiết bị mạng', 
        type: 'fieldArray', 
        sectionId: 'section_di',
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
        sectionId: 'section_di',
        options: ['Có (phần cứng chuyên dụng)', 'Dùng Firewall tích hợp', 'Dùng phần mềm Firewall'],
        checkboxMap: {
          'Có (phần cứng chuyên dụng)': 'E2_co_firewall',
          'Dùng Firewall tích hợp': 'E2_router_tich_hop',
          'Dùng phần mềm Firewall': 'E2_phan_mem'
        }
      },
      // Mục F
      { id: 'F1_pc_sl', label: 'Số lượng PC', type: 'number', sectionId: 'section_di' },
      { id: 'F1_pc_os', label: 'Hệ điều hành PC', type: 'text', sectionId: 'section_di' },
      { id: 'F1_laptop_sl', label: 'Số lượng Laptop', type: 'number', sectionId: 'section_di' },
      { id: 'F1_laptop_os', label: 'Hệ điều hành Laptop', type: 'text', sectionId: 'section_di' },
      { id: 'F1_tablet_sl', label: 'Số lượng Tablet', type: 'number', sectionId: 'section_di' },
      { id: 'F1_mayin_sl', label: 'Số lượng Máy in/Fax', type: 'number', sectionId: 'section_di' },
      { id: 'F1_dienthoai_sl', label: 'Số lượng Điện thoại công vụ', type: 'number', sectionId: 'section_di' },
      { id: 'F2_khong_may_chu_has', label: 'Không có máy chủ vật lý', type: 'checkbox', sectionId: 'section_di' },
      { id: 'F2_luu_tru_o_dau', label: 'Dữ liệu lưu ở đâu (nếu không máy chủ)', type: 'text', sectionId: 'section_di' },
      { 
        id: 'may_chu', 
        label: 'Danh sách máy chủ', 
        type: 'fieldArray', 
        sectionId: 'section_di',
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
      { id: 'F3_cloud_has', label: 'Sử dụng Cloud (AWS/Azure/Viettel...)', type: 'radio', options: ['Có', 'Không'], sectionId: 'section_di' },
      { id: 'F3_ten_cloud', label: 'Tên Cloud/Nhà cung cấp', type: 'text', sectionId: 'section_di' },
      // Mục G
      { 
        id: 'camera', 
        label: 'Danh sách Camera', 
        type: 'fieldArray', 
        sectionId: 'section_di',
        columns: [
          { id: 'hang_san_xuat', label: 'Hãng', type: 'text' },
          { id: 'model', label: 'Model', type: 'text' },
          { id: 'so_serial', label: 'Số serial', type: 'text' },
          { id: 'do_phan_giai', label: 'Độ phân giải', type: 'text' },
          { id: 'vi_tri', label: 'Vị trí', type: 'text' },
        ]
      },
      { id: 'G2_dau_ghi_nvr', label: 'Đầu ghi NVR/DVR (Hãng, Model, S/N, Vị trí)', type: 'text', required: true, sectionId: 'section_di' },
      { id: 'G3_luu_tru_ngay', label: 'Thời gian lưu trữ (ngày)', type: 'text', required: true, sectionId: 'section_di' },
      // Mục H
      { id: 'H1_dai_ip_lan', label: 'Dải IP LAN (VD: 192.168.1.0/24)', type: 'text', required: true, sectionId: 'section_di' },
      { id: 'H2_ip_gateway', label: 'IP Gateway', type: 'text', required: true, sectionId: 'section_di' },
      { id: 'H3_dns', label: 'DNS Server', type: 'text', sectionId: 'section_di' },
      { id: 'H4_co_vlan', label: 'Có chia VLAN', type: 'radio', options: ['Có', 'Không'], required: true, sectionId: 'section_di' },
      { id: 'H4_so_vlan', label: 'Số lượng VLAN', type: 'number', sectionId: 'section_di' },
      { id: 'H4_mo_ta_vlan', label: 'Mô tả các VLAN', type: 'textarea', sectionId: 'section_di' },
      { 
        id: 'ip_tinh', 
        label: 'DS thiết bị dùng IP tĩnh (Tối đa 5)', 
        type: 'fieldArray', 
        sectionId: 'section_di',
        columns: [
          { id: 'ten_thiet_bi', label: 'Thiết bị', type: 'text' },
          { id: 'dia_chi_ip', label: 'Địa chỉ IP', type: 'text' },
          { id: 'ghi_chu', label: 'Ghi chú', type: 'text' },
        ]
      },
      // Mục I
      { 
        id: 'ung_dung', 
        label: 'Danh sách Ứng dụng/Dịch vụ', 
        type: 'fieldArray', 
        sectionId: 'section_di',
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
    id: 'section_kp',
    label: 'K-P. An toàn Bảo mật',
    questions: [
      // Mục K
      { id: 'k1_quy_che', label: 'Số QĐ Quy chế ATTT', type: 'text', required: true, sectionId: 'section_kp', placeholder: 'K1_quy_che_attt' },
      { id: 'k2_ke_hoach_ht', label: 'Số Kế hoạch ATTT năm HT', type: 'text', required: true, sectionId: 'section_kp', placeholder: 'K2_ke_hoach_nam_ht' },
      { id: 'k3_ke_hoach_tr', label: 'Số Kế hoạch ATTT năm trước', type: 'text', required: true, sectionId: 'section_kp', placeholder: 'K3_ke_hoach_nam_truoc' },
      { id: 'k4_qd_phan_cong_cb', label: 'Số QĐ phân công cán bộ ATTT', type: 'text', required: true, sectionId: 'section_kp', placeholder: 'K4_qd_phan_cong_cb' },
      { id: 'K5_qd_phe_duyet_httt', label: 'Số QĐ phê duyệt HTTT', type: 'text', sectionId: 'section_kp' },
      { id: 'K6_ung_pho_su_co', label: 'Số VB Quy trình ứng phó sự cố', type: 'text', sectionId: 'section_kp' },
      { id: 'K7_bien_ban_kiem_tra', label: 'Số Biên bản kiểm tra ATTT gần nhất', type: 'text', sectionId: 'section_kp' },
      // Mục L (Trích lược các ý chính)
      { 
        id: 'l1_phys_key', 
        label: 'Kiểm soát vật lý phòng máy chủ', 
        type: 'radio', 
        sectionId: 'section_kp', 
        subsectionId: 'L1',
        options: ['Có khóa cửa', 'Thẻ từ / Kiểm soát điện tử', 'Không có kiểm soát'],
        checkboxMap: { 'Có khóa cửa': 'L1_khoa_cua_thuong', 'Thẻ từ / Kiểm soát điện tử': 'L1_the_tu', 'Không có kiểm soát': 'L1_khong_kiem_soat' }
      },
      { id: 'L2_pass_policy', label: 'Có chính sách mật khẩu', type: 'radio', options: ['Có', 'Không'], sectionId: 'section_kp', subsectionId: 'L2' },
      { id: 'l3_av_has', label: 'Có phần mềm diệt Virus', type: 'radio', options: ['Có', 'Không'], sectionId: 'section_kp', subsectionId: 'L3' },
      { id: 'l4_bak_has', label: 'Quy trình sao lưu dữ liệu', type: 'radio', options: ['Tự động', 'Thủ công', 'Không có'], sectionId: 'section_kp', subsectionId: 'L4' },
      { 
        id: 'l7_type', 
        label: 'Loại Firewall (L7.1)', 
        type: 'radio', 
        sectionId: 'section_kp', 
        subsectionId: 'L7',
        options: ['Router SPI', 'Phần cứng chuyên dụng', 'Phần mềm', 'Không có'],
        checkboxMap: { 'Router SPI': 'L7_1_router_spi', 'Phần cứng chuyên dụng': 'L7_1_phan_cung', 'Phần mềm': 'L7_1_phan_mem', 'Không có': 'L7_1_khong' }
      },
      { id: 'L7_4_cong_mo', label: 'Cổng mở ra Internet (L7.4)', type: 'textarea', sectionId: 'section_kp', subsectionId: 'L7' },
      { id: 'L8_1_co_ups', label: 'Có trang bị UPS', type: 'radio', options: ['Có', 'Không'], sectionId: 'section_kp', subsectionId: 'L8' },
      // Mục P
      { id: 'p1_protocol', label: 'Giao thức Web sử dụng', type: 'radio', options: ['HTTPS (chứng chỉ SSL/TLS)', 'HTTP (không mã hóa)', 'Cả hai'], required: true, sectionId: 'section_kp' },
      { 
        id: 'P3_ket_noi_cap_tren_type', 
        label: 'Kết nối lên cấp trên qua', 
        type: 'radio', 
        sectionId: 'section_kp',
        options: ['VPN chuyên dụng', 'Internet (HTTPS)', 'MPLS', 'Không kết nối'],
        checkboxMap: { 'VPN chuyên dụng': 'P3_vpn_chuyen_dung', 'Internet (HTTPS)': 'P3_internet_https', 'MPLS': 'P3_mpls', 'Không kết nối': 'P3_khong_ket_noi' }
      },
    ]
  },
  {
    id: 'section_qs',
    label: 'Q-S. Quản lý & Đào tạo',
    questions: [
      // Mục Q
      { id: 'cap_nhat_he_dieu_hanh', label: 'Quy trình cập nhật OS', type: 'select', options: ['Hàng tháng', 'Hàng quý', 'Khi có cảnh báo', 'Không cập nhật'], sectionId: 'section_qs' },
      { id: 'Q5_theo_doi_canh_bao', label: 'Theo dõi cảnh báo VNCERT/Sở TTTT', type: 'radio', options: ['Có', 'Không'], sectionId: 'section_qs' },
      // Mục R
      { 
        id: 'dao_tao', 
        label: 'Hoạt động đào tạo ATTT', 
        type: 'fieldArray', 
        sectionId: 'section_qs',
        columns: [
          { id: 'hinh_thuc', label: 'Hình thức', type: 'text' },
          { id: 'thoi_gian', label: 'Thời gian', type: 'text' },
          { id: 'so_can_bo', label: 'Số CB tham gia', type: 'number' },
        ]
      },
      // Mục S
      { id: 'S2_ke_hoach_tiep_theo', label: 'Kế hoạch kiểm tra tiếp theo', type: 'text', sectionId: 'section_qs' },
    ]
  },
  {
    id: 'section_mt',
    label: 'M-T. Xác nhận & Sơ đồ',
    questions: [
      // Mục M
      { id: 'M1_status', label: 'M1. Ảnh nhãn Router/Modem', type: 'checkbox', sectionId: 'section_mt', placeholder: 'M1_anh_router' },
      { id: 'M9_status', label: 'M9. Scan QĐ Quy chế ATTT', type: 'checkbox', sectionId: 'section_mt', placeholder: 'M9_scan_qd_attt' },
      // Mục T
      { id: 'T1_1_co_dmz', label: 'Có phân vùng DMZ', type: 'radio', options: ['Có', 'Không'], sectionId: 'section_mt' },
      { id: 'T1_2_wifi_tach_rieng', label: 'WiFi tách riêng LAN', type: 'radio', options: ['Có', 'Không', 'Tách VLAN'], sectionId: 'section_mt' },
      { 
        id: 'port_switch', 
        label: 'Port Mapping', 
        type: 'fieldArray', 
        sectionId: 'section_mt',
        columns: [
          { id: 'ten_switch', label: 'Tên Switch', type: 'text' },
          { id: 'so_cong', label: 'Tổng cổng', type: 'number' },
          { id: 'cong_su_dung', label: 'Cổng sử dụng', type: 'text' },
        ]
      },
      // Mục N (Xác nhận)
      { id: 'n_nguoi_lap', label: 'Họ tên người điền phiếu', type: 'text', required: true, sectionId: 'section_mt', placeholder: 'N_nguoi_dien_ho_ten' },
      { id: 'n_ngay_lap', label: 'Ngày lập', type: 'date', required: true, sectionId: 'section_mt', placeholder: 'N_ngay_dien' },
    ]
  }
];
