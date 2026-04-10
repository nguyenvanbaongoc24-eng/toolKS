# Native Python mapping for survey checkboxes
# Derived from surveySchema.ts

CHECKBOX_MAPPINGS = {
    'C4_du_lieu_type': {
        'Cá nhân thông thường': 'C4_du_lieu_ca_nhan_thuong',
        'Cá nhân nhạy cảm': 'C4_du_lieu_ca_nhan_nhay_cam',
        'Dữ liệu công': 'C4_du_lieu_cong',
        'Không xác định': 'C4_khong_xac_dinh'
    },
    'E2_firewall_type': {
        'Có (phần cứng chuyên dụng)': 'E2_firewall_cung_co',
        'Dùng Firewall tích hợp': 'E2_firewall_router',
        'Dùng phần mềm Firewall': 'E2_firewall_phan_mem'
    },
    'l1_phys_key': {
        'Có khóa cửa': 'L1_khoa_cua_thuong',
        'Có khóa + Camera': 'L1_khoa_camera',
        'Thẻ từ / Kiểm soát điện tử': 'L1_the_tu',
        'Không có kiểm soát': 'L1_khong_kiem_soat'
    },
    'L1_bang_ky_ten': {
        'Có': 'L1_ky_ten_co',
        'Không': 'L1_ky_ten_khong'
    },
    'L2_pass_policy': {
        'Có': 'L2_pass_policy_co',
        'Không': 'L2_pass_policy_khong'
    },
    'L2_admin_su_dung': {
        'Mỗi cán bộ có tài khoản riêng': 'L2_admin_rieng',
        'Dùng chung một tài khoản admin': 'L2_admin_chung',
        'Cả hai hình thức': 'L2_admin_ca_hai'
    },
    'L2_xac_thuc_2fa': {
        'Có': 'L2_2fa_co',
        'Không': 'L2_2fa_khong'
    },
    'l3_av_has': {
        'Có': 'L3_antivirus_co',
        'Không': 'L3_antivirus_khong'
    },
    'l4_bak_has': {
        'Hàng ngày / Tuần / Tháng': 'L4_co_tan_suat',
        'Thủ công khi nhớ': 'L4_thu_cong',
        'Không sao lưu': 'L4_khong'
    },
    'L4_off_site': {
        'Có': 'L4_3_khac_vi_tri',
        'Không': 'L4_3_khong_khac_vi_tri'
    },
    'L5_ghi_log': {
        'Có': 'L5_1_log_router_co',
        'Không biết': 'L5_1_log_router_khong_biet',
        'Không': 'L5_1_log_router_khong'
    },
    'L5_log_bao_lau': {
        '< 3 tháng': 'L5_2_thoi_gian_duoi_3',
        '3-6 tháng': 'L5_2_thoi_gian_3_6',
        '> 6 tháng': 'L5_2_thoi_gian_tren_6',
        'Không lưu': 'L5_2_thoi_gian_khong'
    },
    'L5_siem': {
        'Có': 'L5_3_siem_co',
        'Không': 'L5_3_siem_khong'
    },
    'L6_su_co': {
        'Không có sự cố nào': 'L6_1_su_co_khong',
        'Có sự cố': 'L6_1_su_co_co',
        'Không ghi nhận': 'L6_1_su_co_khong_biet'
    },
    'l7_type': {
        'Phần cứng chuyên dụng': 'L7_1_firewall_phanh_cung',
        'Router SPI': 'L7_1_firewall_router',
        'Phần mềm': 'L7_1_firewall_phan_mem',
        'Không có': 'L7_1_khong'
    },
    'L7_2_chinh_sach': {
        'Chặn tất cả (Default Deny)': 'L7_2_default_deny',
        'Cho phép tất cả (Default Allow)': 'L7_2_default_allow',
        'Chưa cấu hình': 'L7_2_chua_cau_hinh'
    },
    'L7_3_remote_access': {
        'Có - qua VPN': 'L7_3_vpn',
        'Có - qua Teamview/Anydesk': 'L7_3_rdp',
        'Không': 'L7_3_khong'
    },
    'L8_1_co_ups': {
        'Có': 'L8_1_ups_co',
        'Không': 'L8_1_ups_khong'
    },
    'L8_2_dieu_hoa': {
        'Có - 24/7': 'L8_2_air_24_7',
        'Có - giờ hành chính': 'L8_2_air_hanh_chinh',
        'Không': 'L8_2_air_khong'
    },
    'L8_3_binh_chua_chay': {
        'Có': 'L8_3_chua_chay_co',
        'Không': 'L8_3_chua_chay_khong'
    },
    'P2_vpn': {
        'Có': 'P2_ssl_vpn',
        'Không': 'P2_khong'
    },
    'P3_ket_noi_cap_tren_type': {
        'VPN chuyên dụng': 'P3_vpn_chuyen_dung',
        'Internet (HTTPS)': 'P3_internet_https',
        'MPLS': 'P3_mpls',
        'Không kết nối': 'P3_khong_ket_noi'
    },
    'P4_ma_hoa_luu_tru': {
        'Có': 'P4_ma_hoa_co',
        'Không': 'P4_ma_hoa_khong'
    },
    'P5_email_bao_mat': {
        'Có': 'P5_email_sec_co',
        'Không': 'P5_email_sec_khong',
        'Không biết': 'P5_email_sec_khong_biet'
    },
    # Missing common section mappings
    'C7_ket_noi_cap_tren_has': {
        'Có': 'C7_co',
        'Không': 'C7_khong'
    },
    'C8_bi_mat_nha_nuoc_has': {
        'Có': 'C8_co',
        'Không': 'C8_khong'
    },
    'H4_co_vlan': {
        'Có': 'H4_vlan_co',
        'Không': 'H4_vlan_khong'
    },
    'Q1_cap_nhat_os': {
        'Hàng tháng': 'Q1_thang',
        'Hàng quý': 'Q1_quy',
        'Khi có cảnh báo': 'Q1_canh_bao',
        'Tùy lúc': 'Q1_tuy_luc',
        'Không cập nhật': 'Q1_khong_cap_nhat'
    },
    'Q2_cap_nhat_ung_dung': {
        'Tự động': 'Q2_tu_dong',
        'Thủ công': 'Q2_thu_cong',
        'Không cập nhật': 'Q2_khong'
    },
    'Q5_theo_doi_canh_bao': {
        'Có': 'Q5_canh_bao_co',
        'Không': 'Q5_canh_bao_khong',
        'Không biết': 'Q5_canh_bao_chua_biet'
    },
    'T1_1_co_dmz': {
        'Có': 'T1_1_dmz_co',
        'Không': 'T1_1_dmz_khong'
    },
    'T1_2_wifi_tach_rieng': {
        'Có': 'T1_2_wifi_chung',  # Frontend says "Có", but mapping it to wifi_chung? Check schema
        'Không': 'T1_2_wifi_khong',
        'Tách VLAN': 'T1_2_wifi_tach_rieng'
    },
    'T1_4_camera_vlan': {
        'Có': 'T1_4_camera_tach_rieng',
        'Không': 'T4_camera_chung',
        'Không biết': 'T1_4_camera_khong_biet'
    },
    'T3_1_co_rack': {
        'Có': 'T3_1_rack_co',
        'Không': 'T3_1_khong_rack'
    }
}
