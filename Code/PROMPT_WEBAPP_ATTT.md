# PROMPT HỆ THỐNG - WEB APP QUẢN LÝ HỒ SƠ ATTT CẤP ĐỘ 2
> Phiên bản: 2.0 | Dùng cho: tool-ks.vercel.app
> Tài liệu tham chiếu: TT 12/2022/TT-BTTTT, NĐ 85/2016/NĐ-CP, NĐ 13/2023/NĐ-CP

---

## ⚠️ NGUYÊN TẮC QUAN TRỌNG NHẤT

> **Hệ thống phục vụ NHIỀU đơn vị khác nhau (xã, phường, cơ quan...).**  
> Không được hardcode bất kỳ tên đơn vị, tên người, địa chỉ, số văn bản, hay số liệu cụ thể nào.  
> 3 file Word mẫu (template) chứa dữ liệu của **xã Lý Nhân chỉ là ví dụ minh họa** — khi xuất cho đơn vị mới, toàn bộ dữ liệu phải được thay thế 100% từ form nhập liệu.

---

## I. MÔ TẢ HỆ THỐNG

Web app hỗ trợ kỹ thuật viên thực hiện quy trình:

```
[Khảo sát thực địa tại đơn vị]
          ↓
[Điền Phiếu Khảo Sát ATTT vào web app]
          ↓
[Hệ thống tự động sinh ra 3 file Word]
          ↓
  ┌────────────────────────────────────────────────────────┐
  │  [NÚT 1]           [NÚT 2]              [NÚT 3]        │
  │  Xuất Phiếu        Xuất Hồ Sơ Đề       Xuất Báo Cáo   │
  │  Khảo Sát          Xuất Cấp Độ          Khảo Sát       │
  │  ATTT              ATTT (40 trang)       Hiện Trạng     │
  └────────────────────────────────────────────────────────┘
```

**Tên file xuất ra:**
- `PhieuKhaoSat_ATTT_[TenDonViRutGon]_[YYYYMMDD].docx`
- `HoSo_DeXuat_CapDo_[TenDonViRutGon]_[YYYYMMDD].docx`
- `BaoCao_KhaoSat_ATTT_[TenDonViRutGon]_[YYYYMMDD].docx`

---

## II. TOÀN BỘ TRƯỜNG DỮ LIỆU CẦN THU THẬP

### MỤC A — THÔNG TIN CƠ QUAN / CHỦ QUẢN HỆ THỐNG

| Biến | Nhãn hiển thị | Bắt buộc | Loại input |
|------|--------------|----------|------------|
| `A1_ten_don_vi` | Tên đơn vị chủ quản hệ thống (đầy đủ, không viết tắt) | ✅ | text |
| `A2_ten_he_thong` | Tên hệ thống thông tin cần phân loại | ✅ | text |
| `A3_dia_chi` | Địa chỉ trụ sở chính | ✅ | text |
| `A4_so_dien_thoai` | Số điện thoại cơ quan | ❌ | text |
| `A5_email` | Email cơ quan | ❌ | text |
| `A6_ho_ten_thu_truong` | Họ tên người đứng đầu đơn vị | ✅ | text |
| `A6_chuc_vu_thu_truong` | Chức vụ (VD: Chủ tịch UBND xã / Giám đốc) | ✅ | text |
| `A7_so_quyet_dinh` | Số Quyết định giao nhiệm vụ quản lý hệ thống (nếu có) | ❌ | text |

### MỤC B — CÁN BỘ PHỤ TRÁCH CNTT / ATTT

| Biến | Nhãn | Bắt buộc | Loại input |
|------|------|----------|------------|
| `B_can_bo[]` | Danh sách cán bộ (mảng, tối thiểu 1, tối đa 5) | ✅ | bảng động |
| `B_can_bo[i].ho_ten` | Họ và tên | ✅ | text |
| `B_can_bo[i].chuc_vu` | Chức vụ | ✅ | text |
| `B_can_bo[i].so_dt` | Số điện thoại | ✅ | text |
| `B_can_bo[i].email` | Email | ❌ | text |
| `B_can_bo[i].trinh_do` | Trình độ/Chuyên ngành đào tạo | ✅ | text |
| `B_can_bo[i].chung_chi_attt` | Chứng chỉ ATTT (nếu có) | ❌ | text |
| `B2_don_vi_ho_tro` | Đơn vị hỗ trợ kỹ thuật bên ngoài (tên + SĐT) | ❌ | text |

### MỤC C — MÔ TẢ HỆ THỐNG THÔNG TIN

| Biến | Nhãn | Bắt buộc | Loại input |
|------|------|----------|------------|
| `C1_mo_ta_chuc_nang` | Mô tả chức năng chính của hệ thống | ✅ | textarea |
| `C2_doi_tuong_nguoi_dung` | Đối tượng người dùng hệ thống | ✅ | textarea |
| `C3_loai_du_lieu` | Loại dữ liệu được xử lý/lưu trữ | ✅ | textarea |
| `C4_du_lieu_ca_nhan_thuong` | ☐ Dữ liệu cá nhân thông thường | — | checkbox |
| `C4_du_lieu_ca_nhan_nhay_cam` | ☐ Dữ liệu cá nhân nhạy cảm | — | checkbox |
| `C4_du_lieu_cong` | ☐ Dữ liệu công (không bao gồm cá nhân) | — | checkbox |
| `C4_khong_xac_dinh` | ☐ Không xác định / Cần tư vấn | — | checkbox |
| `C5_noi_bo` | Số người dùng nội bộ (người) | ✅ | number |
| `C5_ben_ngoai` | Số người dùng bên ngoài (lượt/tháng) | ✅ | text |
| `C6_nam_hoat_dong` | Hệ thống hoạt động từ năm | ❌ | number |
| `C7_ket_noi_cap_tren` | Kết nối với hệ thống cơ quan cấp trên | ✅ | radio Có/Không |
| `C7_ten_he_thong_cap_tren` | Tên hệ thống cấp trên (nếu Có) | — | text |
| `C8_bi_mat_nha_nuoc` | Xử lý thông tin bí mật nhà nước | ✅ | radio Có/Không |
| `C8_do_mat` | Độ mật (nếu Có) | — | text |

### MỤC D — THÔNG TIN KẾT NỐI INTERNET

| Biến | Nhãn | Bắt buộc | Loại input |
|------|------|----------|------------|
| `D1_duong_truyen[]` | Danh sách đường truyền (tối đa 3) | ✅ | bảng động |
| `D1[i].isp` | Nhà cung cấp (ISP) | ✅ | text |
| `D1[i].loai_ket_noi` | Loại kết nối (Cáp quang / 4G / ADSL...) | ✅ | text |
| `D1[i].bang_thong` | Băng thông (VD: 100 Mbps) | ✅ | text |
| `D1[i].vai_tro` | Vai trò | ✅ | select: Chính / Dự phòng / Chính (duy nhất) |
| `D1[i].ip_wan` | Loại IP WAN | ✅ | select: Tĩnh / Động |
| `D1[i].ghi_chu` | Ghi chú | ❌ | text |
| `D2_router_modem` | Thiết bị Router/Modem Gateway (Hãng, model, S/N, IP) | ✅ | text |
| `D3_ip_lan_gateway` | Địa chỉ IP LAN của Router/Gateway chính | ✅ | text |

### MỤC E — DANH MỤC THIẾT BỊ MẠNG

| Biến | Nhãn | Bắt buộc | Loại input |
|------|------|----------|------------|
| `E1_thiet_bi_mang[]` | Danh sách thiết bị mạng (không giới hạn hàng) | ✅ | bảng động |
| `E1[i].loai_thiet_bi` | Loại thiết bị (Router/Switch/AP/Firewall...) | ✅ | text |
| `E1[i].hang_san_xuat` | Hãng sản xuất | ✅ | text |
| `E1[i].model` | Model | ✅ | text |
| `E1[i].so_serial` | Số serial (S/N) | ✅ | text |
| `E1[i].vi_tri` | Vị trí lắp đặt (Tầng – Phòng) | ✅ | text |
| `E1[i].nam_mua` | Năm mua / Năm lắp | ❌ | number |
| `E1[i].ghi_chu` | Ghi chú | ❌ | text |
| `E2_firewall` | Trang bị Firewall phần cứng chuyên dụng? | ✅ | radio 3 lựa chọn |
| → `E2_co_firewall` | ☐ Có (đã liệt kê ở bảng trên) | — | |
| → `E2_router_tich_hop` | ☐ Không – Dùng Firewall tích hợp Router/Switch | — | |
| → `E2_phan_mem` | ☐ Không – Dùng phần mềm Firewall trên máy chủ | — | |

### MỤC F — THIẾT BỊ ĐẦU CUỐI (MÁY TÍNH, MÁY IN, MÁY CHỦ)

| Biến | Nhãn | Bắt buộc | Loại input |
|------|------|----------|------------|
| `F1_pc_sl` | Số lượng Máy tính để bàn (PC) | ✅ | number |
| `F1_pc_os` | Hệ điều hành chính (PC) | ❌ | text |
| `F1_laptop_sl` | Số lượng Laptop | ✅ | number |
| `F1_laptop_os` | Hệ điều hành chính (Laptop) | ❌ | text |
| `F1_tablet_sl` | Số lượng Tablet | ✅ | number |
| `F1_mayin_sl` | Số lượng Máy in / Scan / Fax | ✅ | number |
| `F1_dienthoai_sl` | Số lượng Điện thoại công vụ | ❌ | number |
| `F2_khong_co_may_chu` | Không có máy chủ vật lý | — | checkbox |
| `F2_luu_tru_o_dau` | Dữ liệu lưu ở đâu (nếu không có máy chủ) | — | text |
| `F2_may_chu[]` | Danh sách máy chủ chi tiết | ✅ | bảng động |
| `F2[i].vai_tro` | Vai trò (File server / Web / CSDL...) | ✅ | text |
| `F2[i].hang_model` | Hãng / Model | ✅ | text |
| `F2[i].so_serial` | Số serial (S/N) | ✅ | text |
| `F2[i].ram_gb` | RAM (GB) | ✅ | number |
| `F2[i].o_cung_tb` | Ổ cứng (TB) | ✅ | number |
| `F2[i].he_dieu_hanh` | Hệ điều hành | ✅ | text |
| `F2[i].vi_tri` | Vị trí (Tầng – Phòng) | ✅ | text |
| `F3_cloud` | Sử dụng dịch vụ điện toán đám mây | ✅ | radio Có/Không |
| `F3_ten_cloud` | Tên dịch vụ / nhà cung cấp (nếu Có) | — | text |

### MỤC G — HỆ THỐNG CAMERA GIÁM SÁT (CCTV)

| Biến | Nhãn | Bắt buộc | Loại input |
|------|------|----------|------------|
| `G1_camera[]` | Danh sách camera (không giới hạn hàng) | ✅ | bảng động |
| `G1[i].hang_san_xuat` | Hãng sản xuất | ✅ | text |
| `G1[i].model` | Model | ✅ | text |
| `G1[i].so_serial` | Số serial (S/N) | ✅ | text |
| `G1[i].do_phan_giai` | Độ phân giải (VD: 2MP, 4K) | ❌ | text |
| `G1[i].vi_tri` | Vị trí lắp đặt (Tầng – Khu vực) | ✅ | text |
| `G1[i].ghi_chu` | Ghi chú (góc quay, ngoài/trong trời) | ❌ | text |
| `G2_dau_ghi_nvr` | Đầu ghi NVR/DVR: Hãng, model, S/N, vị trí đặt | ✅ | text |
| `G3_luu_tru_ngay` | Dữ liệu camera lưu bao nhiêu ngày | ✅ | text |

### MỤC H — QUY HOẠCH ĐỊA CHỈ IP NỘI BỘ (LAN)

| Biến | Nhãn | Bắt buộc | Loại input |
|------|------|----------|------------|
| `H1_dai_ip_lan` | Dải địa chỉ IP LAN (VD: 192.168.1.0/24) | ✅ | text |
| `H2_ip_gateway` | Địa chỉ IP Gateway/Router | ✅ | text |
| `H3_dns` | Máy chủ DNS | ❌ | text |
| `H4_co_vlan` | Có phân chia VLAN không | ✅ | radio Có/Không |
| `H4_so_vlan` | Số lượng VLAN (nếu Có) | — | number |
| `H4_mo_ta_vlan` | Mô tả VLAN | — | textarea |
| `H5_ip_tinh[]` | Danh sách thiết bị có IP tĩnh (tối đa 5) | ❌ | bảng động |
| `H5[i].ten_thiet_bi` | Tên thiết bị / Vai trò | ✅ | text |
| `H5[i].dia_chi_ip` | Địa chỉ IP tĩnh | ✅ | text |
| `H5[i].ghi_chu` | Ghi chú | ❌ | text |

### MỤC I — ỨNG DỤNG VÀ DỊCH VỤ CNTT

| Biến | Nhãn | Bắt buộc | Loại input |
|------|------|----------|------------|
| `I1_ung_dung[]` | Danh sách ứng dụng/dịch vụ | ✅ | bảng động |
| `I1[i].ten` | Tên ứng dụng / Dịch vụ | ✅ | text |
| `I1[i].chuc_nang` | Chức năng chính | ✅ | text |
| `I1[i].don_vi_cung_cap` | Đơn vị cung cấp / Phát triển | ❌ | text |
| `I1[i].phien_ban` | Phiên bản | ❌ | text |
| `I1[i].ket_noi_internet` | Kết nối Internet | ✅ | select: Có / Không |
| `I1[i].ghi_chu` | Ghi chú (số người dùng, URL...) | ❌ | text |

### MỤC K — VĂN BẢN PHÁP LÝ, KẾ HOẠCH ATTT

> Nếu chưa ban hành → nhập "Chưa ban hành" vào ô số văn bản

| Biến | Loại văn bản | Bắt buộc |
|------|-------------|----------|
| `K1_quy_che_attt` | Số VB: QĐ ban hành quy chế ATTT của đơn vị | ✅ |
| `K2_ke_hoach_nam_ht` | Số VB: Kế hoạch ATTT năm hiện tại | ✅ |
| `K3_ke_hoach_nam_truoc` | Số VB: Kế hoạch ATTT năm trước | ✅ |
| `K4_qd_phan_cong_cb` | Số VB: QĐ phân công cán bộ phụ trách ATTT | ✅ |
| `K5_qd_phe_duyet_httt` | Số VB: QĐ phê duyệt hệ thống thông tin | ❌ |
| `K6_ung_pho_su_co` | Số VB: Quy trình ứng phó sự cố ATTT | ❌ |
| `K7_bien_ban_kiem_tra` | Số VB: Biên bản kiểm tra ATTT gần nhất | ❌ |

### MỤC L — HIỆN TRẠNG BẢO MẬT VÀ KIỂM SOÁT TRUY CẬP

**L1 – Kiểm soát truy cập vật lý**

| Biến | Nhãn | Bắt buộc | Loại input |
|------|------|----------|------------|
| `L1_kiem_soat_phong_may_chu` | Khu vực đặt máy chủ/thiết bị mạng có kiểm soát vào ra | ✅ | radio 4 lựa chọn |
| → `L1_khoa_cua_thuong` | ☐ Có khóa cửa (chìa khóa thường) | — | |
| → `L1_khoa_camera` | ☐ Có khóa cửa + camera giám sát | — | |
| → `L1_the_tu` | ☐ Có thẻ từ / kiểm soát điện tử | — | |
| → `L1_khong_kiem_soat` | ☐ Không có kiểm soát riêng | — | |
| `L1_bang_ky_ten` | Có bảng kiểm tra/ký tên vào ra phòng máy chủ | ✅ | radio Có/Không |

**L2 – Kiểm soát truy cập logic**

| Biến | Nhãn | Bắt buộc | Loại input |
|------|------|----------|------------|
| `L2_chinh_sach_mat_khau` | Có chính sách đặt mật khẩu không | ✅ | radio Có/Không |
| `L2_do_dai_min` | Độ dài tối thiểu (ký tự) | — | number |
| `L2_doi_dinh_ky_thang` | Đổi định kỳ (tháng) | — | number |
| `L2_admin_su_dung` | Tài khoản admin dùng như thế nào | ✅ | radio 3 lựa chọn |
| → `L2_admin_rieng` | ☐ Mỗi cán bộ có tài khoản riêng | — | |
| → `L2_admin_chung` | ☐ Dùng chung một tài khoản admin | — | |
| → `L2_admin_ca_hai` | ☐ Cả hai hình thức | — | |
| `L2_xac_thuc_2fa` | Sử dụng xác thực hai yếu tố (2FA) | ✅ | radio Có/Không |
| `L2_2fa_ap_dung_cho` | Áp dụng 2FA cho (nếu Có) | — | text |

**L3 – Phần mềm diệt virus (Antivirus)**

| Biến | Nhãn | Bắt buộc | Loại input |
|------|------|----------|------------|
| `L3_co_antivirus` | Có cài phần mềm diệt virus | ✅ | radio Có/Không |
| `L3_ten_phanmem` | Tên phần mềm antivirus | — | text |
| `L3_ban_quyen` | Bản quyền | — | select: Có / Không / Miễn phí |
| `L3_cap_nhat` | Cập nhật định nghĩa virus | ✅ | select: Tự động / Thủ công / Không |

**L4 – Sao lưu dữ liệu (Backup)**

| Biến | Nhãn | Bắt buộc | Loại input |
|------|------|----------|------------|
| `L4_quy_trinh` | Có quy trình sao lưu dữ liệu định kỳ | ✅ | radio 3 lựa chọn |
| → `L4_co_tan_suat` | ☐ Có – Tần suất | — | select: Hàng ngày / Tuần / Tháng |
| → `L4_thu_cong` | ☐ Thực hiện thủ công khi nhớ | — | |
| → `L4_khong` | ☐ Không sao lưu | — | |
| `L4_luu_o_dau` | Dữ liệu sao lưu lưu ở đâu | ✅ | text |
| `L4_off_site` | Backup có lưu tại vị trí khác (off-site) | ✅ | radio Có/Không |
| `L4_off_site_dia_diem` | Địa điểm lưu off-site | — | text |

**L5 – Giám sát và ghi nhật ký hệ thống (Log)**

| Biến | Nhãn | Bắt buộc | Loại input |
|------|------|----------|------------|
| `L5_ghi_log` | Router/Switch có bật ghi log | ✅ | radio 3 lựa chọn |
| → `L5_co` | ☐ Có | — | |
| → `L5_chua_kiem_tra` | ☐ Không biết / Chưa kiểm tra | — | |
| → `L5_khong` | ☐ Không | — | |
| `L5_log_bao_lau` | Log được lưu bao lâu | ❌ | radio: <3T / 3-6T / >6T / Không lưu |
| `L5_siem` | Có hệ thống giám sát tập trung (SIEM/syslog) | ✅ | radio Có/Không |
| `L5_siem_ten` | Tên/loại SIEM (nếu Có) | — | text |

**L6 – Lịch sử sự cố ATTT**

| Biến | Nhãn | Bắt buộc | Loại input |
|------|------|----------|------------|
| `L6_su_co` | Trong 2 năm qua có gặp sự cố ATTT | ✅ | radio 3 lựa chọn |
| → `L6_khong_su_co` | ☐ Không có sự cố nào | — | |
| → `L6_co_su_co` | ☐ Có – Mô tả ngắn | — | text |
| → `L6_khong_biet` | ☐ Không biết / Không ghi nhận | — | |
| `L6_xu_ly_nhu_the_nao` | Nếu có sự cố, xử lý bằng cách nào | ❌ | textarea |

**L7 – Tường lửa (Firewall)**

| Biến | Nhãn | Bắt buộc | Loại input |
|------|------|----------|------------|
| `L7_1_loai` | Loại tường lửa đang sử dụng | ✅ | radio 3 lựa chọn |
| → `L7_1_router_spi` | ☐ Tường lửa tích hợp Router (SPI) | — | |
| → `L7_1_phan_cung` | ☐ Tường lửa phần cứng chuyên dụng | — | |
| → `L7_1_phan_mem` | ☐ Tường lửa phần mềm trên máy chủ | — | |
| `L7_2_chinh_sach` | Chính sách mặc định của tường lửa | ✅ | radio 3 lựa chọn |
| → `L7_2_default_deny` | ☐ Chặn tất cả, chỉ cho phép khai báo (Default Deny) | — | |
| → `L7_2_default_allow` | ☐ Cho phép tất cả, chỉ chặn bị cấm (Default Allow) | — | |
| → `L7_2_chua_cau_hinh` | ☐ Không biết / Chưa cấu hình | — | |
| `L7_3_remote_access` | Cho phép truy cập từ xa vào hệ thống | ✅ | radio 3 lựa chọn |
| → `L7_3_vpn` | ☐ Có – qua VPN (SSL VPN / IPSec) | — | |
| → `L7_3_rdp` | ☐ Có – qua Remote Desktop / TeamViewer / AnyDesk | — | |
| → `L7_3_khong` | ☐ Không | — | |
| `L7_4_cong_mo` | Liệt kê cổng/dịch vụ đang mở ra Internet | ❌ | textarea |

**L8 – An toàn vật lý phòng thiết bị CNTT**

| Biến | Nhãn | Bắt buộc | Loại input |
|------|------|----------|------------|
| `L8_1_co_ups` | Phòng máy chủ có trang bị UPS | ✅ | radio Có/Không |
| `L8_1_ups_hang_model` | Hãng/Model UPS | — | text |
| `L8_1_ups_cong_suat_va` | Công suất (VA) | — | number |
| `L8_1_ups_thoi_gian_phut` | Thời gian dự phòng (~phút) | — | number |
| `L8_2_dieu_hoa` | Có hệ thống điều hòa riêng | ✅ | radio 3 lựa chọn |
| → `L8_2_247` | ☐ Có – 24/7 | — | |
| → `L8_2_hanh_chinh` | ☐ Có – Giờ hành chính | — | |
| → `L8_2_khong` | ☐ Không | — | |
| `L8_3_binh_chua_chay` | Có trang bị bình chữa cháy | ✅ | radio Có/Không |
| `L8_3_loai_co2` | ☐ CO₂ | — | checkbox |
| `L8_3_loai_bot_kho` | ☐ Bột khô | — | checkbox |
| `L8_3_loai_khac` | ☐ Khác | — | checkbox + text |
| `L8_4_mo_ta_phong` | Mô tả phòng đặt máy chủ/tủ mạng (diện tích, số người có chìa) | ❌ | textarea |

### MỤC P — MÃ HÓA VÀ BẢO VỆ DỮ LIỆU

| Biến | Nhãn | Bắt buộc | Loại input |
|------|------|----------|------------|
| `P1_giao_thuc_web` | Ứng dụng web sử dụng giao thức nào | ✅ | radio: HTTPS / HTTP / Cả hai |
| `P2_vpn` | Kết nối từ xa có sử dụng VPN | ✅ | radio Có/Không |
| `P2_loai_vpn` | Loại VPN | — | checkbox: SSL VPN / IPSec / Khác |
| `P3_ket_noi_cap_tren` | Kết nối lên cơ quan cấp trên qua | ✅ | radio 4 lựa chọn |
| → `P3_vpn_chuyen_dung` | ☐ VPN chuyên dụng (do Sở TTTT cấp) | — | |
| → `P3_internet_https` | ☐ Internet thường (HTTPS) | — | |
| → `P3_mpls` | ☐ Đường truyền số liệu chuyên dụng (MPLS) | — | |
| → `P3_khong_ket_noi` | ☐ Không kết nối trực tiếp | — | |
| `P3_1_ten_he_thong_va_phuong_thuc` | Tên hệ thống cấp trên và phương thức kết nối | ✅ | textarea |
| `P4_ma_hoa_luu_tru` | Dữ liệu lưu trữ trên máy chủ/NAS có mã hóa | ✅ | radio Có/Không |
| `P4_phuong_phap` | Phần mềm/phương pháp mã hóa (nếu Có) | — | text |
| `P5_email_bao_mat` | Email công vụ sử dụng giao thức bảo mật | ❌ | radio 3 lựa chọn |

### MỤC Q — QUẢN LÝ LỖ HỔNG BẢO MẬT VÀ VÁ LỖI

| Biến | Nhãn | Bắt buộc | Loại input |
|------|------|----------|------------|
| `Q1_cap_nhat_os` | Quy trình cập nhật/vá lỗi hệ điều hành | ✅ | radio 5 lựa chọn |
| `Q2_cap_nhat_ung_dung` | Phần mềm ứng dụng có được cập nhật | ✅ | radio 3 lựa chọn |
| `Q3_nguoi_chiu_trach_nhiem` | Ai chịu trách nhiệm cập nhật/vá lỗi | ✅ | text |
| `Q4_firmware_mang` | Thiết bị mạng có được cập nhật firmware | ✅ | text |
| `Q5_theo_doi_canh_bao` | Theo dõi cảnh báo từ VNCERT/CC hoặc Sở TTTT | ❌ | radio 3 lựa chọn |

### MỤC R — ĐÀO TẠO VÀ NÂNG CAO NHẬN THỨC ATTT

| Biến | Nhãn | Bắt buộc | Loại input |
|------|------|----------|------------|
| `R1_dao_tao[]` | Danh sách hoạt động đào tạo | ✅ | bảng động |
| `R1[i].hinh_thuc` | Hình thức đào tạo (Khóa học/Tập huấn/Hội thảo) | ✅ | text |
| `R1[i].don_vi_to_chuc` | Đơn vị tổ chức | ✅ | text |
| `R1[i].thoi_gian` | Thời gian (Tháng/Năm) | ✅ | text |
| `R1[i].so_can_bo` | Số cán bộ tham gia | ✅ | number |
| `R1[i].chung_chi_so_vb` | Chứng chỉ / Số giấy xác nhận | ❌ | text |
| `R2_co_tuyen_truyen` | Có tổ chức tuyên truyền ATTT nội bộ | ❌ | radio Có/Không |
| `R2_hinh_thuc_tuyen_truyen` | Hình thức tuyên truyền | — | text |

### MỤC S — KIỂM TRA, ĐÁNH GIÁ ATTT ĐỊNH KỲ

| Biến | Nhãn | Bắt buộc | Loại input |
|------|------|----------|------------|
| `S1_kiem_tra[]` | Lịch sử kiểm tra ATTT | ✅ | bảng động |
| `S1[i].loai_kiem_tra` | Loại kiểm tra (Pentest/Audit/Rà soát nội bộ) | ✅ | text |
| `S1[i].don_vi_thuc_hien` | Đơn vị thực hiện | ✅ | text |
| `S1[i].thoi_gian` | Thời gian | ✅ | text |
| `S1[i].ket_qua_so_vb` | Kết quả / Số văn bản kết luận | ✅ | text |
| `S2_ke_hoach_tiep_theo` | Kế hoạch kiểm tra ATTT tiếp theo (dự kiến) | ❌ | text |

### MỤC T — KẾT NỐI MẠNG – CHI TIẾT SƠ ĐỒ

| Biến | Nhãn | Bắt buộc | Loại input |
|------|------|----------|------------|
| `T1_1_co_dmz` | Hệ thống có phân chia vùng DMZ | ✅ | radio Có/Không |
| `T1_1_may_chu_dmz` | Máy chủ trong DMZ | — | text |
| `T1_2_wifi_tach_rieng` | Mạng WiFi tách riêng khỏi LAN có dây | ✅ | radio 3 lựa chọn |
| `T1_3_ssid` | SSID WiFi | ❌ | text |
| `T1_3_bao_mat_wifi` | Chuẩn bảo mật WiFi (WPA2/WPA3/...) | ❌ | text |
| `T1_3_co_guest_wifi` | Có mạng khách (Guest WiFi) | ❌ | radio Có/Không |
| `T1_4_camera_vlan` | Camera có nằm trên mạng riêng | ✅ | radio 3 lựa chọn |
| `T2_port_mapping[]` | Kết nối vật lý Switch – Port Mapping | ❌ | bảng động |
| `T2[i].ten_switch` | Tên Switch | ✅ | text |
| `T2[i].so_cong` | Số cổng | ✅ | number |
| `T2[i].cong_su_dung` | Port số → Thiết bị kết nối | ✅ | textarea |
| `T2[i].ghi_chu` | Ghi chú (uplink, trunk, PoE) | ❌ | text |
| `T3_1_co_rack` | Có sử dụng tủ mạng/rack | ✅ | radio Có/Không |
| `T3_1_rack_u` | Kích thước rack (U) | — | number |
| `T3_1_rack_vi_tri` | Vị trí tủ rack | — | text |
| `T3_2_thiet_bi_trong_tu` | Liệt kê thiết bị trong tủ (từ trên xuống) | — | textarea |
| `T4_1_loai_cap` | Loại cáp kết nối chính trong tòa nhà | ✅ | radio 3 lựa chọn |
| `T4_2_cap_isp` | Đường cáp từ ISP vào thiết bị đầu tiên | ✅ | text |
| `T5_vi_tri[]` | Bảng vị trí thiết bị theo tầng/phòng (7 hàng) | ✅ | bảng cố định 7 hàng |

### MỤC M — TÀI LIỆU VÀ ẢNH CHỤP ĐÍNH KÈM

| Biến | Tài liệu | Bắt buộc | Trạng thái |
|------|---------|----------|-----------|
| `M1_anh_router` | Ảnh nhãn Router/Modem | ✅ | ☐ Đã có / ☐ Chưa có |
| `M2_anh_switch` | Ảnh nhãn Switch | ✅ | ☐ Đã có / ☐ Chưa có |
| `M3_anh_camera` | Ảnh nhãn Camera | ✅ | ☐ Đã có / ☐ Chưa có |
| `M4_anh_nvr` | Ảnh nhãn NVR/DVR | ✅ | ☐ Đã có / ☐ Chưa có |
| `M5_anh_server` | Ảnh nhãn Máy chủ (nếu có) | — | ☐ Đã có / ☐ Chưa có |
| `M6_anh_tu_mang` | Ảnh toàn cảnh tủ mạng (nếu có) | — | ☐ Đã có / ☐ Chưa có |
| `M7_anh_dhcp` | Ảnh cấu hình DHCP trên Router | — | ☐ Đã có / ☐ Chưa có |
| `M8_so_do_mat_bang` | Sơ đồ mặt bằng tòa nhà | — | ☐ Đã có / ☐ Chưa có |
| `M9_scan_qd_attt` | Bản scan QĐ ban hành quy chế ATTT | ✅ | ☐ Đã có / ☐ Chưa có |
| `M10_scan_ke_hoach` | Bản scan Kế hoạch ATTT năm HT + năm trước | ✅ | ☐ Đã có / ☐ Chưa có |
| `M11_scan_qd_canbo` | Bản scan QĐ phân công cán bộ CNTT/ATTT | ✅ | ☐ Đã có / ☐ Chưa có |
| `M12_scan_bien_ban` | Bản scan Biên bản kiểm tra ATTT gần nhất | — | ☐ Đã có / ☐ Chưa có |
| `M13_chung_chi_dao_tao` | Giấy xác nhận/chứng chỉ đào tạo ATTT | — | ☐ Đã có / ☐ Chưa có |
| `M14_hop_dong_internet` | Hợp đồng Internet/VPN với nhà mạng | — | ☐ Đã có / ☐ Chưa có |

### MỤC N — XÁC NHẬN CỦA ĐƠN VỊ

| Biến | Nhãn | Bắt buộc |
|------|------|----------|
| `N_nguoi_dien_ho_ten` | Họ tên người điền phiếu | ✅ |
| `N_nguoi_dien_chuc_vu` | Chức vụ người điền phiếu | ✅ |
| `N_nguoi_dien_sdt` | SĐT người điền phiếu | ✅ |
| `N_ngay_dien` | Ngày điền | ✅ |
| `N_nguoi_kiem_tra_ho_ten` | Họ tên người kiểm tra (cán bộ lập hồ sơ) | ✅ |
| `N_nguoi_kiem_tra_chuc_vu` | Chức vụ người kiểm tra | ✅ |
| `N_ngay_kiem_tra` | Ngày kiểm tra | ✅ |
| `N_thu_truong_ho_ten` | Họ tên thủ trưởng ký | ✅ |
| `N_thu_truong_chuc_vu` | Chức vụ thủ trưởng | ✅ |
| `N_ngay_ky` | Ngày ký | ✅ |

### THÔNG TIN BỔ SUNG CHO BÁO CÁO

| Biến | Nhãn | Ghi chú |
|------|------|---------|
| `BC_so_bao_cao` | Số báo cáo (VD: 45/MBF.NBH-KDT) | Theo mẫu nội bộ công ty |
| `BC_ngay_bao_cao` | Ngày tháng năm của báo cáo | date |
| `BC_nguoi_thuc_hien` | Tên kỹ thuật viên thực hiện khảo sát | text |
| `BC_don_vi_thuc_hien` | Đơn vị thực hiện khảo sát (tên chi nhánh) | text |
| `BC_qd_ubnd_tinh_so_attt` | Số QĐ của UBND tỉnh về bảo đảm ATTT mạng | text – **khác nhau theo tỉnh** |
| `BC_qd_ubnd_tinh_phan_cong` | Số QĐ của UBND tỉnh về phân công đơn vị chuyên trách ATTT | text – **khác nhau theo tỉnh** |
| `BC_ten_tinh` | Tên tỉnh (VD: Ninh Bình, Hà Nam...) | text |

---

## III. MAPPING DỮ LIỆU → 3 FILE WORD

### FILE 1: Phiếu Khảo Sát

**Yêu cầu cốt lõi:**
- Thay thế 100% dữ liệu từ biến vào đúng vị trí placeholder
- Checkbox: thay `☐` → `☒` cho lựa chọn đã chọn, giữ `☐` cho lựa chọn không chọn
- Bảng động: sinh đúng số hàng theo dữ liệu thực tế
- **Xóa hoàn toàn** các dòng Ví dụ (*in nghiêng dạng → Ví dụ:...*)
- Trường không điền: để trống, không tự điền "N/A" hay "–"

| Vị trí trong mẫu | Biến dữ liệu |
|-----------------|-------------|
| Mục A1 → A7 | `A1_*` đến `A7_*` |
| Bảng cán bộ CNTT (Mục B) | `B_can_bo[]` – mỗi người 1 hàng |
| B2 Đơn vị hỗ trợ | `B2_don_vi_ho_tro` |
| C1 → C8 + checkbox C4 | `C1_*` đến `C8_*` |
| Bảng D1 đường truyền | `D1_duong_truyen[]` |
| D2 Router, D3 IP LAN | `D2_*`, `D3_*` |
| Bảng E1 thiết bị mạng | `E1_thiet_bi_mang[]` |
| E2 Firewall radio | `E2_*` |
| Bảng F1 đầu cuối + Bảng F2 máy chủ | `F1_*`, `F2_*` |
| F3 Cloud | `F3_*` |
| Bảng G1 camera + G2 NVR + G3 | `G1_*`, `G2_*`, `G3_*` |
| H1 → H5 IP LAN | `H1_*` đến `H5_*` |
| Bảng I1 ứng dụng | `I1_ung_dung[]` |
| Bảng K văn bản pháp lý | `K1_*` đến `K7_*` |
| L1 → L8 (tất cả checkbox/radio/text) | `L1_*` đến `L8_*` |
| P1 → P5 (mã hóa) | `P1_*` đến `P5_*` |
| Q1 → Q5 (vá lỗi) | `Q1_*` đến `Q5_*` |
| Bảng R1 đào tạo + R2 | `R1_*`, `R2_*` |
| Bảng S1 kiểm tra + S2 | `S1_*`, `S2_*` |
| T1 → T5 (sơ đồ mạng) | `T1_*` đến `T5_*` |
| Bảng M tài liệu đính kèm | `M1_*` đến `M14_*` |
| Mục N xác nhận | `N_*` |

---

### FILE 2: Hồ Sơ Đề Xuất Cấp Độ

**Yêu cầu cốt lõi:**
- Tên đơn vị xuất hiện nhiều lần → tất cả phải lấy từ `A1_ten_don_vi`
- Phụ lục I & II: tự động sinh trạng thái đáp ứng + mô tả hiện trạng từ dữ liệu
- Không thay đổi nội dung các điều khoản pháp lý cố định

| Vị trí trong HSDX | Dữ liệu nguồn |
|-------------------|--------------|
| **Trang bìa** | `A1_ten_don_vi`, `A2_ten_he_thong`, năm hiện tại |
| **Thuật ngữ viết tắt** | Giữ nguyên bảng mẫu |
| **Phần I.1 – Bảng Chủ quản** | |
| Chủ quản | `A1_ten_don_vi` |
| Người đại diện | `A6_ho_ten_thu_truong` + `A6_chuc_vu_thu_truong` |
| Địa chỉ | `A3_dia_chi` |
| Số điện thoại | `A4_so_dien_thoai` |
| Email | `B_can_bo[0].email` |
| **Phần I.2 – Bảng Đơn vị vận hành** | |
| Tên tổ chức | `A1_ten_don_vi` |
| Người đại diện | `A6_ho_ten_thu_truong` |
| Địa chỉ | `A3_dia_chi` |
| Cán bộ phụ trách CNTT/ATTT | `B_can_bo[0].ho_ten`, chức vụ, SĐT, email, trình độ |
| Đơn vị hỗ trợ bên ngoài | `B2_don_vi_ho_tro` |
| **Phần I.3 – Phạm vi, quy mô** | |
| Số cán bộ nội bộ | `C5_noi_bo` |
| Lượt giao dịch bên ngoài | `C5_ben_ngoai` |
| Loại dữ liệu xử lý | `C3_loai_du_lieu` |
| Bảng hệ thống thành phần | `I1_ung_dung[]` (map toàn bộ) |
| **Phần I.4 – Cấu trúc hệ thống** | |
| Sơ đồ logic (hình ảnh) | Placeholder hình – upload nếu có |
| Mô tả dải mạng LAN | `H1_dai_ip_lan` |
| Mô tả đường truyền | `D1_duong_truyen[0].isp` + băng thông |
| Sơ đồ vật lý (hình ảnh) | Placeholder hình – upload nếu có |
| **Bảng 4.2.1 – Thiết bị mạng** | `E1_thiet_bi_mang[]` |
| **Bảng 4.2.3 – Ứng dụng/dịch vụ** | `I1_ung_dung[]` |
| **Bảng 4.2.4 – Quy hoạch IP** | `H1_dai_ip_lan`, `H2_ip_gateway`, `H4_co_vlan` |
| **Phần II – Cấp độ đề xuất** | Cấp độ 2 (cố định), căn cứ từ `C3` + `C8` |
| **Phần III – Thuyết minh phương án** | |
| I.1 Chính sách ATTT | Trạng thái từ `K1_quy_che_attt` |
| I.2 Tổ chức ATTT | `B_can_bo[0].ho_ten` + chức vụ |
| I.3 Nguồn nhân lực | Tóm tắt từ `R1_dao_tao[]` |
| II.1 An toàn mạng | Sinh từ `H4_co_vlan` + `E2_firewall` + `L7_*` |
| II.2 An toàn máy chủ/đầu cuối | Từ `F2_may_chu[]` hoặc mô tả không có máy chủ |
| II.3 An toàn ứng dụng | Từ `I1_ung_dung[]` + `P1_giao_thuc_web` |
| II.4 An toàn dữ liệu | Từ `L4_*` + `P4_ma_hoa_luu_tru` |
| **Phụ lục I & II** | Xem bảng logic tự động bên dưới |

**Bảng logic sinh trạng thái đáp ứng (Phụ lục I & II):**

| Tiêu chí | Biến kiểm tra | Đáp ứng khi |
|----------|--------------|------------|
| Chính sách ATTT | `K1_quy_che_attt` | ≠ "Chưa ban hành" |
| Phân vùng mạng | `H4_co_vlan` + `T1_2_wifi_tach_rieng` | Cả hai = Có |
| Tường lửa | `L7_1_loai` | Bất kỳ lựa chọn nào |
| Antivirus bản quyền | `L3_co_antivirus` + `L3_ban_quyen` | Có + Có bản quyền |
| Chính sách mật khẩu | `L2_chinh_sach_mat_khau` | = Có |
| Sao lưu định kỳ + off-site | `L4_co_tan_suat` + `L4_off_site` | Cả hai = Có |
| Ghi log hệ thống | `L5_ghi_log` | = Có |
| Đào tạo ATTT | `R1_dao_tao[]` | length ≥ 1 |
| Kiểm tra ATTT định kỳ | `S1_kiem_tra[]` | length ≥ 1 |
| Mã hóa truyền tải | `P1_giao_thuc_web` | = HTTPS |
| Mã hóa lưu trữ | `P4_ma_hoa_luu_tru` | = Có |

---

### FILE 3: Báo Cáo Khảo Sát

| Vị trí trong Báo cáo | Dữ liệu nguồn |
|--------------------|--------------|
| **Header** – Đơn vị thực hiện | `BC_don_vi_thuc_hien` |
| **Header** – Số báo cáo | `BC_so_bao_cao` |
| **Header** – Ngày tháng năm | `BC_ngay_bao_cao` |
| **Kính gửi** | `A1_ten_don_vi` |
| **Phần I – Căn cứ pháp lý** | |
| Các luật/nghị định trung ương | Cố định – không thay đổi |
| QĐ UBND tỉnh về ATTT mạng | `BC_qd_ubnd_tinh_so_attt` + `BC_ten_tinh` |
| QĐ UBND tỉnh phân công chuyên trách | `BC_qd_ubnd_tinh_phan_cong` + `BC_ten_tinh` |
| **Phần II – Mục đích, yêu cầu** | Cố định – không thay đổi |
| **Phần III – Phạm vi khảo sát** | |
| Tên đơn vị, tỉnh, địa chỉ | `A1_ten_don_vi` + `A3_dia_chi` |
| Mô tả hệ thống | `C1_mo_ta_chuc_nang` |
| **Phần IV – Kết quả khảo sát** | |
| Bảng danh sách thiết bị CNTT | `E1_thiet_bi_mang[]` (map đầy đủ cột) |
| Bảng máy chủ | `F2_may_chu[]` hoặc "Không có" |
| Checkbox Firewall | `E2_firewall` → ☒ đúng lựa chọn |
| Bảng danh sách camera | `G1_camera[]` (map đầy đủ cột) |
| **Phần V – Đánh giá chung** | |
| Tự động sinh các vấn đề tồn tại | Xem bảng logic bên dưới |
| Kết luận | Tự động: "chưa đáp ứng" nếu ≥ 1 tiêu chí chưa đáp ứng |
| **Phần VI – Đề xuất** | |
| Bảng cam kết (Đề xuất 1) | Sinh từ các vấn đề tồn tại ở Phần V |
| Bảng thiết bị cần trang bị (Đề xuất 2) | Sinh từ combo thiếu sót: Firewall, Switch VLAN, Antivirus, UPS, Rack, v.v. |
| **Footer** | |
| Người thực hiện báo cáo | `BC_nguoi_thuc_hien` |

**Bảng logic sinh "Phần V – Vấn đề tồn tại" tự động:**

| Vấn đề tồn tại | Hiển thị khi |
|---------------|-------------|
| Hệ thống mạng chưa được phân vùng mạng | `H4_co_vlan` = Không |
| WiFi chưa tách riêng khỏi LAN nội bộ | `T1_2_wifi_tach_rieng` = Không |
| Chưa có sơ đồ mạng tổng thể | Luôn đề xuất (hạng mục mặc định) |
| Chưa có thiết bị tường lửa kiểm soát | `E2_firewall` = router_tich_hop hoặc phan_mem |
| Chưa cài phần mềm diệt virus | `L3_co_antivirus` = Không |
| Chưa ban hành quy chế ATTT | `K1_quy_che_attt` = "Chưa ban hành" |
| Chưa phân công cán bộ phụ trách ATTT | `K4_qd_phan_cong_cb` = "Chưa ban hành" |
| Chưa có quy trình sao lưu và ứng cứu sự cố | `L4_quy_trinh` = khong HOẶC `K6_ung_pho_su_co` = "Chưa ban hành" |
| Chưa tổ chức tập huấn/phổ biến ATTT | `R1_dao_tao[]` = rỗng |
| Chưa có UPS cho phòng mạng | `L8_1_co_ups` = Không |

---

## IV. ĐẶC TẢ KỸ THUẬT 3 NÚT XUẤT FILE

### Nút 1: "Xuất Phiếu Khảo Sát"
```
Template: Phieu_Khao_Sat_ATTT_Mau_1.docx
Output:   PhieuKhaoSat_ATTT_[TenDonViRutGon]_[YYYYMMDD].docx

Quy tắc bắt buộc:
✓ Giữ 100% layout, font chữ, màu sắc của mẫu gốc
✓ Thay ☐ → ☒ cho checkbox/radio đã chọn
✓ Bảng dynamic: thêm đúng số hàng theo số bản ghi
✓ XÓA các dòng Ví dụ (→ Ví dụ: ...) khi xuất
✓ Trường không điền: để trống nguyên
✓ Giữ nguyên hộp "Hướng dẫn sử dụng" màu xám
```

### Nút 2: "Xuất Hồ Sơ Đề Xuất Cấp Độ"
```
Template: HSDXCDAT_template.docx  (file mẫu sạch, không có dữ liệu cứng)
Output:   HoSo_DeXuat_CapDo_[TenDonViRutGon]_[YYYYMMDD].docx

Quy tắc bắt buộc:
✓ Điền đầy đủ toàn bộ 40 trang
✓ Placeholder hình ảnh sơ đồ: giữ khung trống nếu chưa upload
✓ Tất cả xuất hiện của tên đơn vị đều từ A1_ten_don_vi
✓ Phụ lục I & II: sinh tự động trạng thái theo bảng logic
✓ Thuyết minh phương án: điền tên cán bộ, số liệu thực tế
✓ KHÔNG sửa nội dung điều khoản pháp lý trong mẫu
✓ Ngày tháng: từ BC_ngay_bao_cao hoặc ngày hiện tại
```

### Nút 3: "Xuất Báo Cáo Khảo Sát"
```
Template: BAO_CAO_HSDX_template.docx  (file mẫu sạch)
Output:   BaoCao_KhaoSat_[TenDonViRutGon]_[YYYYMMDD].docx

Quy tắc bắt buộc:
✓ Header: số BC, ngày tháng, tên đơn vị thực hiện
✓ Phần I căn cứ pháp lý: điền số QĐ UBND tỉnh (khác nhau theo tỉnh)
✓ Bảng thiết bị & bảng camera: map từ E1, G1
✓ Phần V đánh giá: sinh từ bảng logic vấn đề tồn tại
✓ Phần VI đề xuất: sinh tự động dựa trên các vấn đề tồn tại
✓ Tên người thực hiện: BC_nguoi_thuc_hien
```

---

## V. VALIDATION TRƯỚC KHI XUẤT FILE

```javascript
// BLOCK xuất – bắt buộc phải có
const required = [
  'A1_ten_don_vi',
  'A2_ten_he_thong',
  'A3_dia_chi',
  'A6_ho_ten_thu_truong',
  'B_can_bo.length >= 1',
  'B_can_bo[0].ho_ten',
  'B_can_bo[0].chuc_vu',
  'B_can_bo[0].so_dt',
  'C1_mo_ta_chuc_nang',
  'C5_noi_bo',
  'D1_duong_truyen.length >= 1',
  'E1_thiet_bi_mang.length >= 1',
  'H1_dai_ip_lan',
  'H2_ip_gateway',
];

// WARN – cảnh báo nhưng vẫn cho xuất
const warnings = [
  'G1_camera.length == 0',          // Không có camera
  'K1_quy_che_attt == rỗng',        // Chưa nhập văn bản pháp lý
  'M1_anh_router == Chưa có',       // Thiếu ảnh đính kèm bắt buộc
  'M9_scan_qd_attt == Chưa có',
  'BC_so_bao_cao == rỗng',           // Chỉ warning với nút Báo cáo
];
```

---

## VI. LƯU Ý KỸ THUẬT TRIỂN KHAI

### Stack khuyến nghị:
- **Template engine:** `docxtemplater` + plugin `docxtemplater-loop-module`
- **Checkbox:** thay ký tự Unicode `☐` (U+2610) → `☒` (U+2612) trong XML
- **Bảng dynamic:** dùng `{#array}{/array}` syntax của docxtemplater
- **Backend:** POST `/api/export/survey` | `/api/export/hsdx` | `/api/export/baocao`
- **Response:** `Content-Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document`

### Xử lý checkbox:
```javascript
// Với mỗi nhóm radio/checkbox, chỉ 1 ô được ☒, còn lại ☐
function setCheckbox(template, varName, selectedValue) {
  const options = ['option_A', 'option_B', 'option_C'];
  options.forEach(opt => {
    const isSelected = opt === selectedValue;
    template.replace(`{${varName}_${opt}}`, isSelected ? '☒' : '☐');
  });
}
```

### File template phải là bản sạch:
> ⚠️ Tạo template riêng (không chứa dữ liệu xã Lý Nhân).  
> Tất cả giá trị cố định trong file mẫu phải được thay bằng placeholder `{bien_du_lieu}`.

---

## VII. CHECKLIST KIỂM TRA TRƯỚC RELEASE

- [ ] Xuất thử file với đơn vị giả định hoàn toàn mới (không phải Lý Nhân)
- [ ] Kiểm tra tên đơn vị xuất hiện đúng ở tất cả vị trí trong HSDX
- [ ] Kiểm tra checkbox đúng, không có lựa chọn nào bị tick nhầm
- [ ] Bảng thiết bị có đúng số hàng theo dữ liệu nhập
- [ ] Phần V Báo cáo sinh đúng vấn đề tồn tại theo dữ liệu thực tế
- [ ] Phụ lục I & II HSDX sinh đúng trạng thái đáp ứng
- [ ] Số QĐ UBND tỉnh trong Báo cáo lấy từ BC_qd_ubnd_tinh_so_attt (không hardcode)
- [ ] Không còn bất kỳ giá trị cứng nào của Lý Nhân trong file xuất
- [ ] File Word mở được bình thường, không lỗi font, không vỡ layout
- [ ] Tên file xuất có TenDonViRutGon + ngày đúng định dạng

---

*Phiên bản: 2.0 | Cập nhật: 04/2026*
