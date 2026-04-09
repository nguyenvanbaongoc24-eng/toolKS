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
        'Có (phần cứng chuyên dụng)': 'E2_co_firewall',
        'Dùng Firewall tích hợp': 'E2_router_tich_hop',
        'Dùng phần mềm Firewall': 'E2_phan_mem'
    },
    'l1_phys_key': {
        'Có khóa cửa': 'L1_khoa_cua_thuong',
        'Có khóa + Camera': 'L1_khoa_camera',
        'Thẻ từ / Kiểm soát điện tử': 'L1_the_tu',
        'Không có kiểm soát': 'L1_khong_kiem_soat'
    },
    'L2_admin_su_dung': {
        'Mỗi cán bộ có tài khoản riêng': 'L2_admin_rieng',
        'Dùng chung một tài khoản admin': 'L2_admin_chung',
        'Cả hai hình thức': 'L2_admin_ca_hai'
    },
    'l4_bak_has': {
        'Hàng ngày / Tuần / Tháng': 'L4_co_tan_suat',
        'Thủ công khi nhớ': 'L4_thu_cong',
        'Không sao lưu': 'L4_khong'
    },
    'L5_ghi_log': {
        'Có': 'L5_co',
        'Không biết': 'L5_chua_kiem_tra',
        'Không': 'L5_khong'
    },
    'L6_su_co': {
        'Không có sự cố nào': 'L6_khong_su_co',
        'Có sự cố': 'L6_co_su_co',
        'Không ghi nhận': 'L6_khong_biet'
    },
    'l7_type': {
        'Router SPI': 'L7_1_router_spi',
        'Phần cứng chuyên dụng': 'L7_1_phan_cung',
        'Phần mềm': 'L7_1_phan_mem',
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
    'P3_ket_noi_cap_tren_type': {
        'VPN chuyên dụng': 'P3_vpn_chuyen_dung',
        'Internet (HTTPS)': 'P3_internet_https',
        'MPLS': 'P3_mpls',
        'Không kết nối': 'P3_khong_ket_noi'
    }
}
