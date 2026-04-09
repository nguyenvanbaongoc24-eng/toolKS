import { SurveySection } from './types';

export const surveySchema: SurveySection[] = [
  {
    id: 'section_ac',
    label: 'A-C. Đơn vị & Hệ thống',
    questions: [
      // Mục A
      { id: 'A1_ten_don_vi', label: 'A1. Tên đơn vị chủ quản hệ thống', type: 'text', required: true, sectionId: 'section_ac', subsectionId: 'A' },
      { id: 'A2_ten_he_thong', label: 'A2. Tên hệ thống thông tin', type: 'text', required: true, sectionId: 'section_ac', subsectionId: 'A' },
      { id: 'A3_dia_chi', label: 'A3. Địa chỉ trụ sở chính', type: 'text', required: true, sectionId: 'section_ac', subsectionId: 'A' },
      { id: 'A4_so_dien_thoai', label: 'A4. Số điện thoại cơ quan', type: 'text', sectionId: 'section_ac', subsectionId: 'A' },
      { id: 'A5_email', label: 'A5. Email cơ quan', type: 'text', sectionId: 'section_ac', subsectionId: 'A' },
      { id: 'A6_ho_ten_thu_truong', label: 'A6. Họ tên người đứng đầu đơn vị (Thủ trưởng)', type: 'text', required: true, sectionId: 'section_ac', subsectionId: 'A' },
      { id: 'A6_chuc_vu_thu_truong', label: 'A6.1. Chức vụ Thủ trưởng', type: 'text', required: true, sectionId: 'section_ac', subsectionId: 'A' },
      { id: 'A7_so_quyet_dinh', label: 'A7. Số Quyết định giao nhiệm vụ quản lý hệ thống', type: 'text', sectionId: 'section_ac', subsectionId: 'A' },
      
      // Mục B
      { 
        id: 'can_bo_phu_trach', 
        label: 'B. Danh sách cán bộ phụ trách CNTT/ATTT', 
        type: 'fieldArray', 
        sectionId: 'section_ac',
        columns: [
          { id: 'ho_ten', label: 'Họ và tên', type: 'text' },
          { id: 'chuc_vu', label: 'Chức vụ', type: 'text' },
          { id: 'so_dt', label: 'Số điện thoại', type: 'text' },
          { id: 'email', label: 'Email', type: 'text' },
          { id: 'trinh_do', label: 'Trình độ đào tạo', type: 'text' },
          { id: 'chung_chi_attt', label: 'Chứng chỉ ATTT', type: 'text' },
        ]
      },
      { id: 'B2_don_vi_ho_tro', label: 'B2. Đơn vị hỗ trợ kỹ thuật bên ngoài (Tên + SĐT)', type: 'text', sectionId: 'section_ac' },
      
      // Mục C
      { id: 'C1_mo_ta_chuc_nang', label: 'C1. Mô tả chức năng chính của hệ thống', type: 'textarea', required: true, sectionId: 'section_ac', subsectionId: 'C' },
      { id: 'C2_doi_tuong_nguoi_dung', label: 'C2. Đối tượng người dùng hệ thống', type: 'textarea', required: true, sectionId: 'section_ac', subsectionId: 'C' },
      { id: 'C3_loai_du_lieu', label: 'C3. Loại dữ liệu được xử lý/lưu trữ', type: 'textarea', required: true, sectionId: 'section_ac', subsectionId: 'C' },
      { 
        id: 'C4_du_lieu_type', 
        label: 'C4. Phân loại mức độ nhạy cảm của dữ liệu', 
        type: 'radio', 
        sectionId: 'section_ac',
        subsectionId: 'C',
        options: ['Cá nhân thông thường', 'Cá nhân nhạy cảm', 'Dữ liệu công', 'Không xác định'],
        checkboxMap: {
          'Cá nhân thông thường': 'C4_du_lieu_ca_nhan_thuong',
          'Cá nhân nhạy cảm': 'C4_du_lieu_ca_nhan_nhay_cam',
          'Dữ liệu công': 'C4_du_lieu_cong',
          'Không xác định': 'C4_khong_xac_dinh'
        }
      },
      { id: 'C5_noi_bo', label: 'C5. Số người dùng nội bộ (người)', type: 'number', required: true, sectionId: 'section_ac', subsectionId: 'C' },
      { id: 'C5_ben_ngoai', label: 'C5.1. Số người dùng bên ngoài (lượt/tháng)', type: 'text', required: true, sectionId: 'section_ac', subsectionId: 'C' },
      { id: 'C6_nam_hoat_dong', label: 'C6. Hệ thống hoạt động từ năm', type: 'number', sectionId: 'section_ac', subsectionId: 'C' },
      { id: 'C7_ket_noi_cap_tren_has', label: 'C7. Kết nối với hệ thống của cơ quan cấp trên', type: 'radio', options: ['Có', 'Không'], required: true, sectionId: 'section_ac', subsectionId: 'C' },
      { id: 'C7_ten_he_thong_cap_tren', label: 'C7.1. Tên hệ thống cấp trên (nếu Có)', type: 'text', sectionId: 'section_ac', subsectionId: 'C' },
      { id: 'C8_bi_mat_nha_nuoc_has', label: 'C8. Cơ sở dữ liệu có chứa Bí mật nhà nước', type: 'radio', options: ['Có', 'Không'], required: true, sectionId: 'section_ac', subsectionId: 'C' },
      { id: 'C8_do_mat', label: 'C8.1. Độ mật (nếu Có)', type: 'text', sectionId: 'section_ac', subsectionId: 'C' },
    ]
  },
  {
    id: 'section_di',
    label: 'D-I. Hạ tầng & Mạng',
    questions: [
      // Mục D
      { 
        id: 'ket_noi_internet', 
        label: 'D1. Danh sách đường truyền Internet', 
        type: 'fieldArray', 
        sectionId: 'section_di',
        columns: [
          { id: 'isp', label: 'Nhà cung cấp (ISP)', type: 'text' },
          { id: 'loai_ket_noi', label: 'Loại kết nối (Cáp quang/4G...)', type: 'text' },
          { id: 'bang_thong', label: 'Băng thông', type: 'text' },
          { id: 'vai_tro', label: 'Vai trò (Chính/Dự phòng)', type: 'select', options: ['Chính', 'Dự phòng', 'Chính (duy nhất)'] },
          { id: 'ip_wan', label: 'Loại IP WAN', type: 'select', options: ['Tĩnh', 'Động'] },
        ]
      },
      { id: 'D2_router_modem', label: 'D2. Thiết bị Router/Modem Gateway (Hãng, Model, IP)', type: 'text', required: true, sectionId: 'section_di' },
      { id: 'D3_ip_lan_gateway', label: 'D3. Địa chỉ IP LAN của Router/Gateway chính', type: 'text', required: true, sectionId: 'section_di' },
      
      // Mục E
      { 
        id: 'thiet_bi_mang', 
        label: 'E1. Danh mục các thiết bị mạng', 
        type: 'fieldArray', 
        sectionId: 'section_di',
        columns: [
          { id: 'loai_thiet_bi', label: 'Loại thiết bị', type: 'text' },
          { id: 'hang_san_xuat', label: 'Hãng sản xuất', type: 'text' },
          { id: 'model', label: 'Model', type: 'text' },
          { id: 'so_serial', label: 'Số Serial (S/N)', type: 'text' },
          { id: 'vi_tri', label: 'Vị trí lắp đặt', type: 'text' },
          { id: 'nam_mua', label: 'Năm mua/lắp', type: 'number' },
        ]
      },
      { 
        id: 'E2_firewall_type', 
        label: 'E2. Trang bị thiết bị Tường lửa (Firewall) phần cứng?', 
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
      { id: 'F1_pc_sl', label: 'F1.1. Số lượng Máy tính để bàn (PC)', type: 'number', sectionId: 'section_di' },
      { id: 'F1_pc_os', label: 'F1.2. Hệ điều hành chính (PC)', type: 'text', sectionId: 'section_di' },
      { id: 'F1_laptop_sl', label: 'F1.3. Số lượng Laptop', type: 'number', sectionId: 'section_di' },
      { id: 'F1_laptop_os', label: 'F1.4. Hệ điều hành chính (Laptop)', type: 'text', sectionId: 'section_di' },
      { id: 'F1_tablet_sl', label: 'F1.5. Số lượng Tablet', type: 'number', sectionId: 'section_di' },
      { id: 'F1_mayin_sl', label: 'F1.6. Số lượng Máy in / Scan / Fax', type: 'number', sectionId: 'section_di' },
      { id: 'F1_dienthoai_sl', label: 'F1.7. Số lượng Điện thoại công vụ', type: 'number', sectionId: 'section_di' },
      { id: 'F2_khong_may_chu_has', label: 'F2. Đánh dấu nếu không có Máy chủ vật lý', type: 'checkbox', sectionId: 'section_di' },
      { id: 'F2_luu_tru_o_dau', label: 'F2.1. Nơi lưu trữ dữ liệu (nếu không dùng máy chủ)', type: 'text', sectionId: 'section_di' },
      { 
        id: 'may_chu', 
        label: 'F2.2. Danh sách máy chủ chi tiết', 
        type: 'fieldArray', 
        sectionId: 'section_di',
        columns: [
          { id: 'vai_tro', label: 'Vai trò/Chức năng', type: 'text' },
          { id: 'hang_model', label: 'Hãng / Model', type: 'text' },
          { id: 'so_serial', label: 'Số Serial', type: 'text' },
          { id: 'ram_gb', label: 'RAM (GB)', type: 'number' },
          { id: 'o_cung_tb', label: 'Ổ cứng (TB)', type: 'number' },
          { id: 'he_dieu_hanh', label: 'Hệ điều hành', type: 'text' },
          { id: 'vi_tri', label: 'Vị trí đặt', type: 'text' },
        ]
      },
      { id: 'F3_cloud_has', label: 'F3. Sử dụng dịch vụ điện toán đám mây (Cloud)', type: 'radio', options: ['Có', 'Không'], sectionId: 'section_di' },
      { id: 'F3_ten_cloud', label: 'F3.1. Tên dịch vụ / Nhà cung cấp Cloud', type: 'text', sectionId: 'section_di' },
      
      // Mục G
      { 
        id: 'camera', 
        label: 'G1. Danh sách hệ thống Camera giám sát (CCTV)', 
        type: 'fieldArray', 
        sectionId: 'section_di',
        columns: [
          { id: 'hang_san_xuat', label: 'Hãng', type: 'text' },
          { id: 'model', label: 'Model', type: 'text' },
          { id: 'so_serial', label: 'Số Serial', type: 'text' },
          { id: 'do_phan_giai', label: 'Độ phân giải', type: 'text' },
          { id: 'vi_tri', label: 'Vị trí lắp đặt', type: 'text' },
        ]
      },
      { id: 'G2_dau_ghi_nvr', label: 'G2. Đầu ghi NVR/DVR (Hãng, Model, S/N, Vị trí)', type: 'text', required: true, sectionId: 'section_di' },
      { id: 'G3_luu_tru_ngay', label: 'G3. Thời gian lưu giữ dữ liệu camera (ngày)', type: 'text', required: true, sectionId: 'section_di' },
      
      // Mục H
      { id: 'H1_dai_ip_lan', label: 'H1. Dải địa chỉ IP LAN (VD: 192.168.1.0/24)', type: 'text', required: true, sectionId: 'section_di' },
      { id: 'H2_ip_gateway', label: 'H2. Địa chỉ IP Gateway / Router chính', type: 'text', required: true, sectionId: 'section_di' },
      { id: 'H3_dns', label: 'H3. Máy chủ DNS sử dụng', type: 'text', sectionId: 'section_di' },
      { id: 'H4_co_vlan', label: 'H4. Có thực hiện phân chia mạng ảo (VLAN)', type: 'radio', options: ['Có', 'Không'], required: true, sectionId: 'section_di' },
      { id: 'H4_so_vlan', label: 'H4.1. Số lượng VLAN đang sử dụng', type: 'number', sectionId: 'section_di' },
      { id: 'H4_mo_ta_vlan', label: 'H4.2. Mô tả các phân vùng VLAN', type: 'textarea', sectionId: 'section_di' },
      { 
        id: 'ip_tinh', 
        label: 'H5. Danh sách các thiết bị quy hoạch IP tĩnh', 
        type: 'fieldArray', 
        sectionId: 'section_di',
        columns: [
          { id: 'ten_thiet_bi', label: 'Thiết bị / Vai trò', type: 'text' },
          { id: 'dia_chi_ip', label: 'Địa chỉ IP', type: 'text' },
          { id: 'ghi_chu', label: 'Ghi chú', type: 'text' },
        ]
      },
      
      // Mục I
      { 
        id: 'ung_dung', 
        label: 'I1. Danh sách các Ứng dụng và Dịch vụ CNTT', 
        type: 'fieldArray', 
        sectionId: 'section_di',
        columns: [
          { id: 'ten', label: 'Tên Ứng dụng / Dịch vụ', type: 'text' },
          { id: 'chuc_nang', label: 'Chức năng chính', type: 'text' },
          { id: 'don_vi_cung_cap', label: 'Đơn vị cung cấp', type: 'text' },
          { id: 'phien_ban', label: 'Phiên bản', type: 'text' },
          { id: 'ket_noi_internet', label: 'Kết nối Internet', type: 'select', options: ['Có', 'Không'] },
        ]
      },
    ]
  },
  {
    id: 'section_kp',
    label: 'K-P. An toàn Bảo mật',
    questions: [
      // Mục K
      { id: 'k1_quy_che', label: 'K1. Số VB QĐ ban hành Quy chế ATTT của đơn vị', type: 'text', required: true, sectionId: 'section_kp', subsectionId: 'K' },
      { id: 'k2_ke_hoach_ht', label: 'K2. Số VB Kế hoạch ATTT năm hiện tại', type: 'text', required: true, sectionId: 'section_kp', subsectionId: 'K' },
      { id: 'k3_ke_hoach_tr', label: 'K3. Số VB Kế hoạch ATTT năm trước', type: 'text', required: true, sectionId: 'section_kp', subsectionId: 'K' },
      { id: 'k4_qd_phan_cong_cb', label: 'K4. Số VB QĐ phân công cán bộ phụ trách CNTT/ATTT', type: 'text', required: true, sectionId: 'section_kp', subsectionId: 'K' },
      { id: 'K5_qd_phe_duyet_httt', label: 'K5. Số VB QĐ Phê duyệt cấp độ Hệ thống thông tin', type: 'text', sectionId: 'section_kp', subsectionId: 'K' },
      { id: 'K6_ung_pho_su_co', label: 'K6. Số VB Quy trình ứng phó sự cố ATTT', type: 'text', sectionId: 'section_kp', subsectionId: 'K' },
      { id: 'K7_bien_ban_kiem_tra', label: 'K7. Số Biên bản kiểm tra ATTT gần nhất', type: 'text', sectionId: 'section_kp', subsectionId: 'K' },
      
      // Mục L1
      { 
        id: 'l1_phys_key', 
        label: 'L1.1. Kiểm soát vật lý vào/ra phòng đặt máy chủ', 
        type: 'radio', 
        sectionId: 'section_kp', 
        subsectionId: 'L1',
        options: ['Có khóa cửa', 'Có khóa + Camera', 'Thẻ từ / Kiểm soát điện tử', 'Không có kiểm soát'],
        checkboxMap: { 'Có khóa cửa': 'L1_khoa_cua_thuong', 'Có khóa + Camera': 'L1_khoa_camera', 'Thẻ từ / Kiểm soát điện tử': 'L1_the_tu', 'Không có kiểm soát': 'L1_khong_kiem_soat' }
      },
      { id: 'L1_bang_ky_ten', label: 'L1.2. Có bảng/sổ theo dõi ký tên vào ra phòng thiết bị', type: 'radio', options: ['Có', 'Không'], sectionId: 'section_kp', subsectionId: 'L1' },
      
      // Mục L2
      { id: 'L2_pass_policy', label: 'L2.1. Có chính sách thiết lập mật khẩu an toàn', type: 'radio', options: ['Có', 'Không'], sectionId: 'section_kp', subsectionId: 'L2' },
      { id: 'L2_do_dai_min', label: 'L2.2. Độ dài tối thiểu yêu cầu (ký tự)', type: 'number', sectionId: 'section_kp', subsectionId: 'L2' },
      { id: 'L2_doi_dinh_ky_thang', label: 'L2.3. Quy định đổi mật khẩu định kỳ (tháng)', type: 'number', sectionId: 'section_kp', subsectionId: 'L2' },
      { 
        id: 'L2_admin_su_dung', 
        label: 'L2.4. Trách nhiệm sử dụng tài khoản quản trị (Admin)', 
        type: 'radio', 
        sectionId: 'section_kp', 
        subsectionId: 'L2',
        options: ['Mỗi cán bộ có tài khoản riêng', 'Dùng chung một tài khoản admin', 'Cả hai hình thức'],
        checkboxMap: { 'Mỗi cán bộ có tài khoản riêng': 'L2_admin_rieng', 'Dùng chung một tài khoản admin': 'L2_admin_chung', 'Cả hai hình thức': 'L2_admin_ca_hai' }
      },
      { id: 'L2_xac_thuc_2fa', label: 'L2.5. Có sử dụng Xác thực hai yếu tố (2FA)', type: 'radio', options: ['Có', 'Không'], sectionId: 'section_kp', subsectionId: 'L2' },
      { id: 'L2_2fa_ap_dung_cho', label: 'L2.5.1. Các hệ thống áp dụng 2FA', type: 'text', sectionId: 'section_kp', subsectionId: 'L2' },
      
      // Mục L3
      { id: 'l3_av_has', label: 'L3.1. Có trang bị phần mềm diệt Virus (Antivirus)', type: 'radio', options: ['Có', 'Không'], sectionId: 'section_kp', subsectionId: 'L3' },
      { id: 'L3_ten_phanmem', label: 'L3.2. Tên giải pháp Antivirus đang dùng', type: 'text', sectionId: 'section_kp', subsectionId: 'L3' },
      { id: 'L3_ban_quyen', label: 'L3.3. Tình trạng bản quyền phần mềm', type: 'select', options: ['Có', 'Không', 'Miễn phí'], sectionId: 'section_kp', subsectionId: 'L3' },
      { id: 'L3_cap_nhat', label: 'L3.4. Chế độ cập nhật định nghĩa virus', type: 'select', options: ['Tự động', 'Thủ công', 'Không'], sectionId: 'section_kp', subsectionId: 'L3' },
      
      // Mục L4
      { 
        id: 'l4_bak_has', 
        label: 'L4.1. Có quy trình sao lưu (Backup) dữ liệu định kỳ', 
        type: 'radio', 
        sectionId: 'section_kp', 
        subsectionId: 'L4',
        options: ['Hàng ngày / Tuần / Tháng', 'Thủ công khi nhớ', 'Không sao lưu'],
        checkboxMap: { 'Hàng ngày / Tuần / Tháng': 'L4_co_tan_suat', 'Thủ công khi nhớ': 'L4_thu_cong', 'Không sao lưu': 'L4_khong' }
      },
      { id: 'L4_luu_o_dau', label: 'L4.2. Vị trí lưu trữ dữ liệu sao lưu', type: 'text', sectionId: 'section_kp', subsectionId: 'L4' },
      { id: 'L4_off_site', label: 'L4.3. Sao lưu có lưu tại vị trí vật lý khác (Off-site)', type: 'radio', options: ['Có', 'Không'], sectionId: 'section_kp', subsectionId: 'L4' },
      { id: 'L4_off_site_dia_diem', label: 'L4.3.1. Địa điểm lưu trữ Off-site', type: 'text', sectionId: 'section_kp', subsectionId: 'L4' },
      
      // Mục L5
      { 
        id: 'L5_ghi_log', 
        label: 'L5.1. Các thiết bị mạng có bật tính năng ghi nhật ký (Log)', 
        type: 'radio', 
        sectionId: 'section_kp', 
        subsectionId: 'L5',
        options: ['Có', 'Không biết', 'Không'],
        checkboxMap: { 'Có': 'L5_co', 'Không biết': 'L5_chua_kiem_tra', 'Không': 'L5_khong' }
      },
      { id: 'L5_log_bao_lau', label: 'L5.2. Thời gian lưu trữ nhật ký Log', type: 'select', options: ['< 3 tháng', '3-6 tháng', '> 6 tháng', 'Không lưu'], sectionId: 'section_kp', subsectionId: 'L5' },
      { id: 'L5_siem', label: 'L5.3. Có trang bị hệ thống giám sát tập trung (SIEM)', type: 'radio', options: ['Có', 'Không'], sectionId: 'section_kp', subsectionId: 'L5' },
      
      // Mục L6
      { 
        id: 'L6_su_co', 
        label: 'L6.1. Lịch sử xảy ra sự cố ATTT trong 2 năm qua', 
        type: 'radio', 
        sectionId: 'section_kp', 
        subsectionId: 'L6',
        options: ['Không có sự cố nào', 'Có sự cố', 'Không ghi nhận'],
        checkboxMap: { 'Không có sự cố nào': 'L6_khong_su_co', 'Có sự cố': 'L6_co_su_co', 'Không ghi nhận': 'L6_khong_biet' }
      },
      { id: 'L6_xu_ly_nhu_the_nao', label: 'L6.2. Phương thức/Quy trình đã xử lý sự cố', type: 'textarea', sectionId: 'section_kp', subsectionId: 'L6' },
      
      // Mục L7
      { 
        id: 'l7_type', 
        label: 'L7.1. Loại tường lửa (Firewall) đang sử dụng', 
        type: 'radio', 
        sectionId: 'section_kp', 
        subsectionId: 'L7',
        options: ['Phần cứng chuyên dụng', 'Router SPI', 'Phần mềm', 'Không có'],
        checkboxMap: { 'Router SPI': 'L7_1_router_spi', 'Phần cứng chuyên dụng': 'L7_1_phan_cung', 'Phần mềm': 'L7_1_phan_mem', 'Không có': 'L7_1_khong' }
      },
      { 
        id: 'L7_2_chinh_sach', 
        label: 'L7.2. Chính sách mặc định trên tường lửa', 
        type: 'radio', 
        sectionId: 'section_kp', 
        subsectionId: 'L7',
        options: ['Chặn tất cả (Default Deny)', 'Cho phép tất cả (Default Allow)', 'Chưa cấu hình'],
        checkboxMap: { 'Chặn tất cả (Default Deny)': 'L7_2_default_deny', 'Cho phép tất cả (Default Allow)': 'L7_2_default_allow', 'Chưa cấu hình': 'L7_2_chua_cau_hinh' }
      },
      { 
        id: 'L7_3_remote_access', 
        label: 'L7.3. Cách thức cho phép Truy cập từ xa vào nội bộ', 
        type: 'radio', 
        sectionId: 'section_kp', 
        subsectionId: 'L7',
        options: ['Có - qua VPN', 'Có - qua Teamview/Anydesk', 'Không'],
        checkboxMap: { 'Có - qua VPN': 'L7_3_vpn', 'Có - qua Teamview/Anydesk': 'L7_3_rdp', 'Không': 'L7_3_khong' }
      },
      { id: 'L7_4_cong_mo', label: 'L7.4. Danh sách các Cổng/Dịch vụ mở ra Internet', type: 'textarea', sectionId: 'section_kp', subsectionId: 'L7' },
      
      // Mục L8
      { id: 'L8_1_co_ups', label: 'L8.1. Có bộ lưu điện (UPS) cho phòng thiết bị', type: 'radio', options: ['Có', 'Không'], sectionId: 'section_kp', subsectionId: 'L8' },
      { id: 'L8_1_ups_hang_model', label: 'L8.1.1. Hãng / Model UPS', type: 'text', sectionId: 'section_kp', subsectionId: 'L8' },
      { id: 'L8_1_ups_cong_suat_va', label: 'L8.1.2. Công suất UPS (VA)', type: 'number', sectionId: 'section_kp', subsectionId: 'L8' },
      { id: 'L8_1_ups_thoi_gian_phut', label: 'L8.1.3. Thời gian dự phòng khi mất điện (~phút)', type: 'number', sectionId: 'section_kp', subsectionId: 'L8' },
      { id: 'L8_2_dieu_hoa', label: 'L8.2. Hệ thống điều hòa nhiệt độ phòng máy chủ', type: 'radio', options: ['Có - 24/7', 'Có - giờ hành chính', 'Không'], sectionId: 'section_kp', subsectionId: 'L8' },
      { id: 'L8_3_binh_chua_chay', label: 'L8.3. Có bình chữa cháy chuyên dụng trong phòng', type: 'radio', options: ['Có', 'Không'], sectionId: 'section_kp', subsectionId: 'L8' },
      { id: 'L8_4_mo_ta_phong', label: 'L8.4. Đặc điểm phòng (diện tích, kiểm soát cửa)', type: 'textarea', sectionId: 'section_kp', subsectionId: 'L8' },

      // Mục P
      { id: 'p1_protocol', label: 'P1. Giao thức Web sử dụng (HTTPS/HTTP)', type: 'radio', options: ['HTTPS (chứng chỉ SSL/TLS)', 'HTTP (không mã hóa)', 'Cả hai'], required: true, sectionId: 'section_kp', subsectionId: 'P' },
      { id: 'P2_vpn', label: 'P2. Kết nối từ xa có sử dụng VPN bảo mật', type: 'radio', options: ['Có', 'Không'], sectionId: 'section_kp', subsectionId: 'P' },
      { 
        id: 'P3_ket_noi_cap_tren_type', 
        label: 'P3. Hình thức kết nối lên hệ thống cấp trên', 
        type: 'radio', 
        sectionId: 'section_kp',
        subsectionId: 'P',
        options: ['VPN chuyên dụng', 'Internet (HTTPS)', 'MPLS', 'Không kết nối'],
        checkboxMap: { 'VPN chuyên dụng': 'P3_vpn_chuyen_dung', 'Internet (HTTPS)': 'P3_internet_https', 'MPLS': 'P3_mpls', 'Không kết nối': 'P3_khong_ket_noi' }
      },
      { id: 'P3_1_ten_he_thong_va_phuong_thuc', label: 'P3.1. Tên hệ thống và chi tiết cách thức kết nối', type: 'textarea', sectionId: 'section_kp', subsectionId: 'P' },
      { id: 'P4_ma_hoa_luu_tru', label: 'P4. Dữ liệu lưu trữ trên Server/NAS có mã hóa', type: 'radio', options: ['Có', 'Không'], sectionId: 'section_kp', subsectionId: 'P' },
      { id: 'P4_phuong_phap', label: 'P4.1. Phần mềm hoặc thuật toán mã hóa dữ liệu', type: 'text', sectionId: 'section_kp', subsectionId: 'P' },
      { id: 'P5_email_bao_mat', label: 'P5. Hệ thống Email công vụ sử dụng giao thức bảo mật', type: 'radio', options: ['Có', 'Không', 'Không biết'], sectionId: 'section_kp', subsectionId: 'P' },
    ]
  },
  {
    id: 'section_qs',
    label: 'Q-S. Quản lý & Đào tạo',
    questions: [
      // Mục Q
      { id: 'cap_nhat_he_dieu_hanh', label: 'Q1. Tần suất cập nhật/vá lỗi Hệ điều hành (OS)', type: 'select', options: ['Hàng tháng', 'Hàng quý', 'Khi có cảnh báo', 'Không cập nhật'], sectionId: 'section_qs', subsectionId: 'Q' },
      { id: 'Q2_cap_nhat_ung_dung', label: 'Q2. Các phần mềm ứng dụng có được cập nhật thường xuyên', type: 'radio', options: ['Tự động', 'Thủ công', 'Không cập nhật'], sectionId: 'section_qs', subsectionId: 'Q' },
      { id: 'Q3_nguoi_chiu_trach_nhiem', label: 'Q3. Cán bộ/Đơn vị chịu trách nhiệm kiểm tra vá lỗi', type: 'text', sectionId: 'section_qs', subsectionId: 'Q' },
      { id: 'Q4_firmware_mang', label: 'Q4. Các thiết bị mạng có được cập nhật Firmware', type: 'text', sectionId: 'section_qs', subsectionId: 'Q' },
      { id: 'Q5_theo_doi_canh_bao', label: 'Q5. Theo dõi thông tin cảnh báo từ VNCERT / Sở TTTT', type: 'radio', options: ['Có', 'Không'], sectionId: 'section_qs', subsectionId: 'Q' },
      
      // Mục R
      { 
        id: 'dao_tao', 
        label: 'R1. Danh sách các hoạt động đào tạo, tập huấn ATTT', 
        type: 'fieldArray', 
        sectionId: 'section_qs',
        columns: [
          { id: 'hinh_thuc', label: 'Hình thức', type: 'text' },
          { id: 'don_vi_to_chuc', label: 'Đơn vị tổ chức', type: 'text' },
          { id: 'thoi_gian', label: 'Thời gian thực hiện', type: 'text' },
          { id: 'so_can_bo', label: 'Số Cán bộ tham gia', type: 'number' },
          { id: 'chung_chi_so_vb', label: 'Chứng chỉ / Số hồ sơ chứng minh', type: 'text' },
        ]
      },
      { id: 'R2_co_tuyen_truyen', label: 'R2. Có tổ chức phổ biến, tuyên truyền ATTT nội bộ', type: 'radio', options: ['Có', 'Không'], sectionId: 'section_qs' },
      { id: 'R2_hinh_thuc_tuyen_truyen', label: 'R2.1. Hình thức tuyên truyền (VB/Họp/Zalo...)', type: 'text', sectionId: 'section_qs' },

      // Mục S
      { 
        id: 'kiem_tra_attt', 
        label: 'S1. Lịch sử thực hiện kiểm tra, đánh giá ATTT định kỳ', 
        type: 'fieldArray', 
        sectionId: 'section_qs',
        columns: [
          { id: 'loai_kiem_tra', label: 'Nội dung kiểm tra', type: 'text' },
          { id: 'don_vi_thuc_hien', label: 'Đơn vị thực hiện', type: 'text' },
          { id: 'thoi_gian', label: 'Tầng suất/Thời gian', type: 'text' },
          { id: 'ket_qua_so_vb', label: 'Kết quả / Số văn bản báo cáo', type: 'text' },
        ]
      },
      { id: 'S2_ke_hoach_tiep_theo', label: 'S2. Kế hoạch hoặc thời gian dự kiến kiểm tra tiếp theo', type: 'text', sectionId: 'section_qs' },
    ]
  },
  {
    id: 'section_mt',
    label: 'M-T. Xác nhận & Sơ đồ',
    questions: [
      // Mục M
      { id: 'M1_status', label: 'M1. Ảnh nhãn thiết bị Router / Modem', type: 'checkbox', sectionId: 'section_mt', subsectionId: 'M' },
      { id: 'M2_status', label: 'M2. Ảnh nhãn thiết bị Switch', type: 'checkbox', sectionId: 'section_mt', subsectionId: 'M' },
      { id: 'M3_status', label: 'M3. Ảnh nhãn các thiết bị Camera', type: 'checkbox', sectionId: 'section_mt', subsectionId: 'M' },
      { id: 'M4_status', label: 'M4. Ảnh nhãn đầu ghi NVR / DVR', type: 'checkbox', sectionId: 'section_mt', subsectionId: 'M' },
      { id: 'M5_status', label: 'M5. Ảnh nhãn Máy chủ (Server)', type: 'checkbox', sectionId: 'section_mt', subsectionId: 'M' },
      { id: 'M6_status', label: 'M6. Ảnh hiện trạng toàn cảnh tủ mạng / giá Rack', type: 'checkbox', sectionId: 'section_mt', subsectionId: 'M' },
      { id: 'M7_status', label: 'M7. Ảnh chụp danh sách cấp DHCP/ARP trên Router', type: 'checkbox', sectionId: 'section_mt', subsectionId: 'M' },
      { id: 'M8_status', label: 'M8. Sơ đồ mặt bằng vị trí lắp đặt (nếu có)', type: 'checkbox', sectionId: 'section_mt', subsectionId: 'M' },
      { id: 'M9_status', label: 'M9. Bản Scan QĐ ban hành Quy chế ATTT', type: 'checkbox', sectionId: 'section_mt', subsectionId: 'M' },
      { id: 'M10_status', label: 'M10. Bản Scan Kế hoạch ATTT định kỳ', type: 'checkbox', sectionId: 'section_mt', subsectionId: 'M' },
      { id: 'M11_status', label: 'M11. Bản Scan QĐ phân công cán bộ chuyên trách', type: 'checkbox', sectionId: 'section_mt', subsectionId: 'M' },
      { id: 'M12_status', label: 'M12. Bản Scan các Biên bản kiểm tra ATTT', type: 'checkbox', sectionId: 'section_mt', subsectionId: 'M' },
      { id: 'M13_status', label: 'M13. Bản Scan các Chứng chỉ / Văn bằng đào tạo', type: 'checkbox', sectionId: 'section_mt', subsectionId: 'M' },
      { id: 'M14_status', label: 'M14. Bản Scan Hợp đồng đường truyền / Bảo trì', type: 'checkbox', sectionId: 'section_mt', subsectionId: 'M' },
      
      // Mục T
      { id: 'T1_1_co_dmz', label: 'T1.1. Có phân vùng mạng DMZ (vùng chứa máy chủ)', type: 'radio', options: ['Có', 'Không'], sectionId: 'section_mt', subsectionId: 'T' },
      { id: 'T1_1_may_chu_dmz', label: 'T1.1.1. Danh sách các máy chủ nằm trong vùng DMZ', type: 'text', sectionId: 'section_mt', subsectionId: 'T' },
      { id: 'T1_2_wifi_tach_rieng', label: 'T1.2. Mạng WiFi kết nối tách biệt hoàn toàn mạng LAN dây', type: 'radio', options: ['Có', 'Không', 'Tách VLAN'], sectionId: 'section_mt', subsectionId: 'T' },
      { id: 'T1_3_ssid', label: 'T1.3.1. Tên sóng WiFi đang phát (SSID)', type: 'text', sectionId: 'section_mt', subsectionId: 'T' },
      { id: 'T1_3_bao_mat_wifi', label: 'T1.3.2. Tiêu chuẩn bảo mật WiFi (WPA2/WPA3...)', type: 'text', sectionId: 'section_mt', subsectionId: 'T' },
      { id: 'T1_3_co_guest_wifi', label: 'T1.3.3. Có phát mạng WiFi dành cho khách (Guest WiFi)', type: 'radio', options: ['Có', 'Không'], sectionId: 'section_mt', subsectionId: 'T' },
      { id: 'T1_4_camera_vlan', label: 'T1.4. Hệ thống Camera nằm trên phân vùng mạng (VLAN) riêng', type: 'radio', options: ['Có', 'Không', 'Không biết'], sectionId: 'section_mt', subsectionId: 'T' },
      { 
        id: 'port_switch', 
        label: 'T2. Bảng ánh xạ cổng trên Switch (Port Mapping)', 
        type: 'fieldArray', 
        sectionId: 'section_mt',
        columns: [
          { id: 'ten_switch', label: 'Tên thiết bị Switch', type: 'text' },
          { id: 'so_cong', label: 'Tổng số cổng', type: 'number' },
          { id: 'cong_su_dung', label: 'Số Port -> Thiết bị đầu cuối tương ứng', type: 'textarea' },
        ]
      },
      { id: 'T3_1_co_rack', label: 'T3. Có sử dụng tủ mạng chuyên dụng (Tủ Rack)', type: 'radio', options: ['Có', 'Không'], sectionId: 'section_mt', subsectionId: 'T' },
      { id: 'T3_1_rack_u', label: 'T3.1. Kích thước tủ Rack (đơn vị U)', type: 'number', sectionId: 'section_mt', subsectionId: 'T' },
      { id: 'T3_2_thiet_bi_trong_tu', label: 'T3.2. Danh sách thiết bị trong tủ (sắp xếp từ trên xuống)', type: 'textarea', sectionId: 'section_mt', subsectionId: 'T' },
      { id: 'T4_1_loai_cap', label: 'T4. Các loại cáp kết nối chính trong tòa nhà', type: 'select', options: ['Cáp quang', 'Cáp đồng (CAT5e/6)', 'Cả hai'], sectionId: 'section_mt', subsectionId: 'T' },
      { id: 'T4_2_cap_isp', label: 'T4.1. Đường cáp từ ISP vào thiết bị modem đầu tiên', type: 'text', sectionId: 'section_mt', subsectionId: 'T' },
      { 
        id: 'T5_vi_tri', 
        label: 'T5. Thống kê vị trí đặt thiết bị đầu cuối theo Tầng/Phòng', 
        type: 'fieldArray', 
        sectionId: 'section_mt',
        columns: [
          { id: 'tang', label: 'Vị trí Tầng', type: 'text' },
          { id: 'phong', label: 'Vị trí Phòng', type: 'text' },
          { id: 'thiet_bi', label: 'Danh sách thiết bị (PC/Laptop/AP...)', type: 'text' },
        ]
      },

      // Mục N
      { id: 'N_nguoi_dien_ho_ten', label: 'N1. Họ tên Cán bộ thực hiện điền phiếu', type: 'text', required: true, sectionId: 'section_mt', subsectionId: 'N' },
      { id: 'N_nguoi_dien_chuc_vu', label: 'N1.1. Chức danh / Nhóm kỹ thuật', type: 'text', required: true, sectionId: 'section_mt', subsectionId: 'N' },
      { id: 'N_nguoi_dien_sdt', label: 'N1.2. Số điện thoại liên lạc', type: 'text', required: true, sectionId: 'section_mt', subsectionId: 'N' },
      { id: 'N_ngay_dien', label: 'N1.3. Ngày thực hiện điền phiếu khảo sát', type: 'date', required: true, sectionId: 'section_mt', subsectionId: 'N' },
      { id: 'N_nguoi_kiem_tra_ho_ten', label: 'N2. Họ tên Cán bộ trực tiếp kiểm tra hồ sơ', type: 'text', required: true, sectionId: 'section_mt', subsectionId: 'N' },
      { id: 'N_nguoi_kiem_tra_chuc_vu', label: 'N2.1. Chức vụ của người kiểm tra hồ sơ', type: 'text', required: true, sectionId: 'section_mt', subsectionId: 'N' },
      { id: 'N_ngay_kiem_tra', label: 'N2.2. Ngày thực hiện thẩm định/kiểm tra', type: 'date', required: true, sectionId: 'section_mt', subsectionId: 'N' },
      { id: 'N_thu_truong_ho_ten', label: 'N3. Họ tên Người đứng đầu đơn vị (Thủ trưởng ký)', type: 'text', required: true, sectionId: 'section_mt', subsectionId: 'N' },
      { id: 'N_thu_truong_chuc_vu', label: 'N3.1. Chức danh pháp lý của Thủ trưởng', type: 'text', required: true, sectionId: 'section_mt', subsectionId: 'N' },
      { id: 'N_ngay_ky', label: 'N3.2. Ngày thực hiện ký xác nhận hồ sơ', type: 'date', required: true, sectionId: 'section_mt', subsectionId: 'N' },

      // Bổ sung cho Báo cáo (BC)
      { id: 'BC_so_bao_cao', label: 'BC1. Số văn bản Báo cáo khảo sát', type: 'text', sectionId: 'section_mt', subsectionId: 'BC' },
      { id: 'BC_ngay_bao_cao', label: 'BC1.1. Ngày ban hành Báo cáo', type: 'date', sectionId: 'section_mt', subsectionId: 'BC' },
      { id: 'BC_nguoi_thuc_hien', label: 'BC2. Kỹ thuật viên phụ trách chính (tổ chức khảo sát)', type: 'text', sectionId: 'section_mt', subsectionId: 'BC' },
      { id: 'BC_don_vi_thuc_hien', label: 'BC2.1. Tên Đơn vị thực hiện khảo sát (chi nhánh)', type: 'text', sectionId: 'section_mt', subsectionId: 'BC' },
      { id: 'BC_qd_ubnd_tinh_so_attt', label: 'BC3. Số QĐ UBND tỉnh về Quy định bảo đảm ATTT mạng', type: 'text', sectionId: 'section_mt', subsectionId: 'BC' },
      { id: 'BC_qd_ubnd_tinh_phan_cong', label: 'BC3.1. Số QĐ UBND tỉnh về việc Phân công đơn vị chuyên trách', type: 'text', sectionId: 'section_mt', subsectionId: 'BC' },
      { id: 'BC_ten_tinh', label: 'BC4. Tên tỉnh thực hiện (VD: Ninh Bình, Hà Nam...)', type: 'text', sectionId: 'section_mt', subsectionId: 'BC' },
    ]
  }
];
