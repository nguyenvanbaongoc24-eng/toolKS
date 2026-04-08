# PROMPT: GENERATOR SƠ ĐỒ MẠNG ATTT CẤP ĐỘ 2
> Dùng cho antigravity/backend của tool-ks.vercel.app
> Mục đích: Sinh 2 file ảnh PNG sơ đồ mạng → nhúng vào file Word HSDX

---

## TỔNG QUAN

Khi xuất file **Hồ Sơ Đề Xuất Cấp Độ**, backend cần tự động sinh 2 sơ đồ:

| Tên file | Vị trí trong HSDX | Mô tả |
|----------|------------------|-------|
| `diagram_logic.png` | Phần I.4 – Mục 4.1 | Sơ đồ mô hình logic tổng thể (zones) |
| `diagram_detail.png` | Phần I.4 – Mục 4.2 | Sơ đồ kiến trúc logic chi tiết (tầng/phòng) |

Cả 2 sơ đồ **hoàn toàn data-driven** — nội dung (ISP, tầng, phòng...) lấy từ dữ liệu phiếu khảo sát, không hardcode bất kỳ tên đơn vị hay số liệu nào.

---

## CÀI ĐẶT

```bash
pip install matplotlib Pillow
```

---

## INPUT DATA SCHEMA

```python
data = {
    # ── Thông tin đơn vị ──────────────────────────────────────
    "don_vi_ten": str,          # VD: "UBND XÃ LÝ NHÂN, NINH BÌNH"
                                # → hiện ở tiêu đề góc trên phải Sơ đồ 1

    # ── Đường truyền Internet (từ D1_duong_truyen[]) ──────────
    "isp_list": [               # Tối đa 3 phần tử
        {
            "ten": str,         # VD: "VNPT #1" | "Viettel #2"
            "isp_provider": str,# "VNPT" | "Viettel" | "FPT" | other
                                # → VNPT=màu xanh, Viettel=màu xanh lá, khác=xám
            "vai_tro": str,     # "Chính" | "Dự phòng" | "Chính (duy nhất)"
        }
    ],

    # ── Thiết bị ──────────────────────────────────────────────
    "co_can_bang_tai": bool,    # Có thiết bị cân bằng tải không
                                # True  → vẽ khối AXP giữa ISP và FW
                                # False → ISP kết nối thẳng vào FW
    "co_dmz": bool,             # True  → DMZ Zone có thiết bị bên trong
                                # False → DMZ Zone hiện note "Dự phòng tương lai"
    "co_server_farm": bool,     # True  → Vùng máy chủ có thiết bị
                                # False → hiện note "Dự phòng tương lai"
    "l3_switch_cong": int,      # Số cổng switch lớp 3, VD: 24
                                # → hiện label "SW Lớp 3 - 24 cổng"

    # ── Cấu trúc tầng/phòng (từ T_port_mapping[] + T5_vi_tri[]) ─
    "khu_vuc_list": [           # Thứ tự = thứ tự port từ trái sang phải
        {
            "ten": str,         # VD: "Tầng 1" | "Khu hành\nchính công"
                                # Dùng \n để xuống dòng nhãn dài
            "port_so": int,     # Số port trên L3 SW, VD: 2
            "loai": str,        # "tang"  → Tầng N (có PC + WiFi AP ở tầng đầu)
                                # "khu"   → Khu vực (oval mạng nội bộ)
                                # "phong" → Phòng (oval mạng nội bộ)
        }
    ],
}
```

### Ví dụ mapping từ phiếu khảo sát → data:

```python
data = {
    "don_vi_ten":      A1_ten_don_vi + ", " + BC_ten_tinh,
    "isp_list":        [ {"ten": d["isp"], "isp_provider": d["isp"], "vai_tro": d["vai_tro"]}
                         for d in D1_duong_truyen ],
    "co_can_bang_tai": True,          # hoặc dựa trên E1 nếu có thiết bị cân bằng tải
    "co_dmz":          T1_1_co_dmz,
    "co_server_farm":  len(F2_may_chu) > 0,
    "l3_switch_cong":  24,            # hoặc từ E1 switch lớp 3
    "khu_vuc_list":    [              # Từ T5_vi_tri[] hoặc T2_port_mapping[]
        {"ten": row["ten"], "port_so": row["port"], "loai": _classify(row)}
        for row in T5_vi_tri
    ],
}
```

---

## CODE HOÀN CHỈNH

```python
"""
generate_diagrams.py
Sinh 2 sơ đồ mạng ATTT Cấp độ 2 dưới dạng PNG.
Gọi: draw_logic(data, path) và draw_detail(data, path)
"""
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch, Ellipse, Circle
import numpy as np

# ── Bảng màu chuẩn ──────────────────────────────────────────
C = {
    'zone_bien_bg': '#D6E4F7', 'zone_bien_bd': '#4472C4',  # Xanh dương – Vùng mạng biên
    'zone_dmz_bg':  '#FCE4D6', 'zone_dmz_bd':  '#C55A11',  # Cam nhạt – DMZ
    'zone_srv_bg':  '#E2EFDA', 'zone_srv_bd':  '#538135',  # Xanh lá – Server farm
    'zone_lan_bg':  '#EDE7F6', 'zone_lan_bd':  '#7030A0',  # Tím – LAN
    'zone_adm_bg':  '#FFF2CC', 'zone_adm_bd':  '#BF8F00',  # Vàng – Admin/FW
    'sw':   '#2E75B6', 'sw_bd': '#1A4E8A',                 # Switch icon
    'isp1': '#2E75B6',                                      # ISP chính (VNPT)
    'isp2': '#538135',                                      # ISP dự phòng (Viettel)
    'fw_wall': '#C00000', 'fw_net': '#2E75B6',              # Firewall icon
    'orange': '#E05A2B',                                    # Arrow qua Firewall
    'dark': '#1F2937', 'gray': '#6B7280',
    'red_it': '#C00000',                                    # Italic note màu đỏ
}
FONT = 'DejaVu Sans'


# ────────────────────── HELPER COMPONENTS ──────────────────────

def draw_zone(ax, x, y, w, h, label, bg, bd, ls='--', fs=11, alpha=0.5, z=1):
    """Vẽ zone box với viền bo tròn."""
    ax.add_patch(FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.2",
        lw=2, ls=ls, ec=bd, fc=bg, alpha=alpha, zorder=z))
    if label:
        ax.text(x+w/2, y+h-0.35, label, fontsize=fs, fontweight='bold',
            color=bd, ha='center', va='top', fontfamily=FONT, zorder=z+4)

def draw_cloud(ax, cx, cy, rx=1.1, ry=0.55):
    """Vẽ đám mây Internet."""
    bumps = [(0,0,rx,ry), (-rx*.5,ry*.4,rx*.5,ry*.48), (rx*.5,ry*.38,rx*.45,ry*.44),
             (-rx*.15,ry*.52,rx*.35,ry*.35), (rx*.28,ry*.54,rx*.32,ry*.33)]
    for dx, dy, rx2, ry2 in bumps:
        ax.add_patch(Ellipse((cx+dx, cy+dy), rx2*2, ry2*2,
            lw=1.2, ec='#888', fc='white', zorder=5))
    ax.text(cx, cy, 'Internet', fontsize=10, fontweight='bold',
        ha='center', va='center', color=C['dark'], fontfamily=FONT, zorder=7)

def draw_cylinder(ax, cx, cy, fill, label='', rx=.38, ry=.12, h=.62):
    """Hình trụ đại diện modem/router."""
    ax.add_patch(plt.Polygon(
        [[cx-rx,cy-h/2],[cx+rx,cy-h/2],[cx+rx,cy+h/2],[cx-rx,cy+h/2]],
        fc=fill, ec='#222', lw=1.2, zorder=5))
    ax.add_patch(Ellipse((cx,cy+h/2), rx*2, ry*2, ec='#222', fc=fill, lw=1.2, zorder=6))
    ax.add_patch(Ellipse((cx,cy-h/2), rx*2, ry*2, ec='#222', fc=fill, lw=1.2, alpha=.7, zorder=4))
    if label:
        ax.text(cx, cy-h/2-.22, label, fontsize=7.5, ha='center', va='top',
            color=C['dark'], fontfamily=FONT, fontweight='bold', zorder=6)

def draw_switch(ax, cx, cy, r=.32, fill=None, label='', sub=''):
    """Icon switch (snowflake circle)."""
    fill = fill or C['sw']
    ax.add_patch(Circle((cx,cy), r, lw=1.5, ec=C['sw_bd'], fc=fill, zorder=5))
    for a in [0, 45, 90, 135]:
        rad = np.radians(a); d = r*.65
        ax.plot([cx-d*np.cos(rad), cx+d*np.cos(rad)],
                [cy-d*np.sin(rad), cy+d*np.sin(rad)],
                color='white', lw=1.5, zorder=6)
    if label:
        ax.text(cx, cy-r-.18, label, fontsize=7.5, ha='center', va='top',
            fontweight='bold', color=C['dark'], fontfamily=FONT, zorder=6)
    if sub:
        ax.text(cx, cy-r-.42, sub, fontsize=6.5, ha='center', va='top',
            color=C['gray'], fontfamily=FONT, zorder=6)

def draw_firewall(ax, cx, cy, w=1.3, h=1.25):
    """Icon tường lửa 2 tầng (đỏ + xanh) trong viền vàng."""
    ax.add_patch(FancyBboxPatch((cx-w/2-.14, cy-h/2-.14), w+.28, h+.28,
        boxstyle="round,pad=0.12", lw=2.5, ec=C['zone_adm_bd'], fc=C['zone_adm_bg'], zorder=4))
    # Tầng trên: brick wall đỏ
    ax.add_patch(FancyBboxPatch((cx-.44, cy-.02), 0.88, .46,
        lw=1, ec='#8B0000', fc=C['fw_wall'], zorder=5))
    for bx in np.arange(cx-.38, cx+.42, .21):
        ax.add_patch(FancyBboxPatch((bx-.08,cy+.04), .16, .16,
            lw=.4, ec='#8B0000', fc='#ff4444', zorder=6))
    # Tầng dưới: network xanh
    ax.add_patch(FancyBboxPatch((cx-.44, cy-.52), 0.88, .46,
        lw=1, ec='#1A4E8A', fc=C['fw_net'], zorder=5))
    for px, py in [(-0.2,-.28),(0.2,-.28),(0,-.28)]:
        ax.plot([cx, cx+px*1.3], [cy+py, cy+py-.13],
            color='white', lw=1.2, solid_capstyle='round', zorder=6)
    ax.add_patch(Circle((cx,cy-.28), .1, fc='white', ec='white', zorder=7))

def draw_pc(ax, cx, cy, w=.52, h=.38):
    """Icon máy tính để bàn."""
    ax.add_patch(FancyBboxPatch((cx-w/2, cy), w, h,
        boxstyle="round,pad=.04", lw=1.2, ec='#555', fc='#94A3B8', zorder=5))
    ax.add_patch(FancyBboxPatch((cx-w/2+.06, cy+.06), w-.12, h-.14,
        lw=.8, ec='#334', fc='#60A5FA', zorder=6))
    ax.add_patch(plt.Polygon([[cx-w*.25,cy],[cx+w*.25,cy],
        [cx+w*.15,cy-.18],[cx-w*.15,cy-.18]], fc='#888', ec='#555', lw=.8, zorder=5))
    ax.add_patch(FancyBboxPatch((cx-w*.3,cy-.18), w*.6, .04,
        lw=.5, ec='#555', fc='#aaa', zorder=6))

def draw_wifi_ap(ax, cx, cy, r=.26):
    """Icon WiFi Access Point."""
    ax.add_patch(Circle((cx,cy), r, lw=1.5, ec='#005A9E', fc='#0070C0', zorder=5))
    import matplotlib
    for arc_r in [.34, .22]:
        arc = matplotlib.patches.Arc((cx,cy), arc_r*2, arc_r*2, angle=0,
            theta1=30, theta2=150, color='white', lw=1.3, zorder=6)
        ax.add_patch(arc)
    ax.plot([cx,cx],[cy-.1,cy+.08], color='white', lw=1.5, zorder=7)

def arrow(ax, x1, y1, x2, y2, color='#333', lw=1.5, ls='-', style='->'):
    ax.annotate('', xy=(x2,y2), xytext=(x1,y1),
        arrowprops=dict(arrowstyle=style, color=color, lw=lw,
            linestyle=ls, connectionstyle='arc3,rad=0'), zorder=4)

def line(ax, x1, y1, x2, y2, color='#555', lw=1.4, ls='-'):
    ax.plot([x1,x2],[y1,y2], color=color, lw=lw, ls=ls, zorder=3)


# ────────────────────── SƠ ĐỒ 1: MÔ HÌNH LOGIC TỔNG THỂ ──────────────────────

def draw_logic(data: dict, output_path: str):
    """
    Vẽ sơ đồ mô hình logic tổng thể gồm các vùng mạng:
    Vùng mạng biên → FW → DMZ | Server farm | LAN nội bộ

    Tham số data: xem DATA SCHEMA ở trên.
    """
    don_vi    = data.get('don_vi_ten', '[TÊN ĐƠN VỊ]')
    isp_list  = data.get('isp_list', [])
    co_dmz    = data.get('co_dmz', False)
    co_srv    = data.get('co_server_farm', False)

    fig, ax = plt.subplots(figsize=(15, 11))
    ax.set_xlim(0, 15); ax.set_ylim(0, 11); ax.axis('off')
    fig.patch.set_facecolor('white')

    # Tiêu đề góc trên phải
    ax.text(14.8, 10.78,
        f'HỒ SƠ ĐỀ XUẤT CẤP ĐỘ 2 – {don_vi.upper()}',
        fontsize=8.5, ha='right', va='top', style='italic',
        color='#888', fontfamily=FONT)
    ax.axhline(10.58, xmin=.01, xmax=.99, color='#CCC', lw=.8)

    # ── Zones ──
    draw_zone(ax, .4, 7.55, 14.2, 2.75, 'Vùng mạng biên',
        C['zone_bien_bg'], C['zone_bien_bd'], fs=12)
    draw_zone(ax, .4, 3.75, 4.1, 3.55, 'DMZ Zone',
        C['zone_dmz_bg'], C['zone_dmz_bd'], fs=11)
    draw_zone(ax, 10.5, 3.75, 4.1, 3.55, 'Vùng máy chủ nội bộ',
        C['zone_srv_bg'], C['zone_srv_bd'], fs=10)
    draw_zone(ax, 3.0, .25, 9.0, 4.3, 'Vùng mạng nội bộ (LAN)',
        C['zone_lan_bg'], C['zone_lan_bd'], ls='-', fs=11)

    # Note dự phòng
    if not co_dmz:
        ax.text(2.45, 5.4, '(Dự phòng mở rộng cho\ntương lai, chưa đầu tư)',
            fontsize=8, ha='center', va='center', style='italic',
            color=C['red_it'], fontfamily=FONT, zorder=6)
    if not co_srv:
        ax.text(12.55, 5.4, '(Dự phòng mở rộng cho\ntương lai, chưa đầu tư)',
            fontsize=8, ha='center', va='center', style='italic',
            color=C['red_it'], fontfamily=FONT, zorder=6)

    # ── Internet cloud ──
    draw_cloud(ax, 7.5, 9.3, rx=1.25, ry=.62)

    # ── ISPs ──
    n = min(len(isp_list), 3); sp = 3.2; sx = 7.5 - (n-1)*sp/2
    for i, isp in enumerate(isp_list[:n]):
        ix = sx + i*sp
        prov = isp.get('isp_provider','').upper()
        fc = C['isp2'] if 'VIETTEL' in prov else C['isp1']
        draw_cylinder(ax, ix, 8.2, fill=fc)
        ax.add_patch(FancyBboxPatch((ix-.82,7.75), 1.64, .58,
            boxstyle="round,pad=.06", lw=1, ec='#4472C4', fc='white', zorder=4, alpha=.95))
        ax.text(ix, 8.12, isp['ten'], fontsize=8, ha='center', va='center',
            fontweight='bold', color=C['dark'], fontfamily=FONT, zorder=5)
        ax.text(ix, 7.88, f"({isp['vai_tro']})", fontsize=7, ha='center', va='center',
            color=C['gray'], fontfamily=FONT, zorder=5)
        line(ax, ix, 8.68, 7.3+i*.4, 8.85, color='#4472C4', lw=1.3)

    # ── Admin zone + FW ──
    draw_zone(ax, 6.1, 5.25, 2.8, 2.1, '',
        C['zone_adm_bg'], C['zone_adm_bd'], ls='-', alpha=.75, z=2)
    fw_cx, fw_cy = 7.5, 6.15
    draw_firewall(ax, fw_cx, fw_cy)
    ax.text(fw_cx, fw_cy-.9,  'FW01', fontsize=9, ha='center', va='top',
        fontweight='bold', color=C['dark'], fontfamily=FONT, zorder=7)
    ax.text(fw_cx, fw_cy-1.1, 'Firewall + VPN', fontsize=7, ha='center', va='top',
        style='italic', color=C['gray'], fontfamily=FONT, zorder=7)
    ax.text(fw_cx, fw_cy-1.3, 'IDS/IPS + AV', fontsize=7, ha='center', va='top',
        style='italic', color=C['gray'], fontfamily=FONT, zorder=7)

    # ── Arrows ──
    arrow(ax, 7.5, 7.55, 7.5, 6.82, color=C['orange'], lw=2.5)    # Internet→FW
    arrow(ax, 6.35, 6.0, 4.5, 5.5,  color=C['orange'], lw=1.6)    # FW→DMZ
    arrow(ax, 8.65, 6.0, 10.5, 5.5, color=C['zone_srv_bd'], lw=1.6) # FW→Server

    # ── L3 Core Switch ──
    l3y = 4.65
    draw_switch(ax, 7.5, l3y, r=.38, label='L3 SW', sub='(Core Switch)')
    arrow(ax, 7.5, fw_cy-.78, 7.5, l3y+.4, color=C['dark'], lw=2)

    # ── L2 + WiFi trong LAN ──
    draw_switch(ax, 5.5, 2.6, r=.32, label='L2 SW', sub='(Access Switch)')
    draw_wifi_ap(ax, 9.2, 2.6, r=.3)
    ax.text(9.2, 2.12, 'WiFi AP', fontsize=7.5, ha='center', va='top',
        fontweight='bold', color=C['dark'], fontfamily=FONT, zorder=6)
    ax.text(9.2, 1.92, 'WPA2/WPA3', fontsize=6.5, ha='center', va='top',
        color=C['gray'], fontfamily=FONT, zorder=6)
    line(ax, 7.5, l3y-.4, 5.85, 2.82, color='#555', lw=1.5, ls='--')
    line(ax, 7.5, l3y-.4, 8.85, 2.82, color='#555', lw=1.5, ls='--')

    # ── PCs ──
    for px in [4.4, 5.15, 5.9]:
        draw_pc(ax, px, 1.2)
        line(ax, 5.5, 2.28, px, 1.58, color='#777', lw=1, ls='--')
    ax.text(5.15, .75, 'Máy trạm người dùng\n(PC/Laptop)', fontsize=7.5,
        ha='center', va='top', color=C['dark'], fontfamily=FONT, zorder=5)

    # ── Mobile ──
    ax.add_patch(FancyBboxPatch((9.0, 1.0), .4, .65,
        boxstyle="round,pad=.04", lw=1.2, ec='#555', fc='#94A3B8', zorder=5))
    ax.add_patch(FancyBboxPatch((9.04, 1.08), .32, .42,
        lw=.5, ec='#334', fc='#60A5FA', zorder=6))
    ax.add_patch(Circle((9.2, 1.04), .04, fc='#555', zorder=6))
    ax.text(9.2, .75, 'Thiết bị di động\n(WiFi)', fontsize=7.5,
        ha='center', va='top', color=C['dark'], fontfamily=FONT, zorder=5)
    line(ax, 9.2, 2.3, 9.2, 1.65, color='#777', lw=1, ls='--')

    # ── Legend ──
    lx, ly = .45, 3.5
    ax.add_patch(FancyBboxPatch((lx, ly-3.1), 3.35, 3.18,
        boxstyle="round,pad=.12", lw=1, ec='#AAA', fc='white', zorder=8, alpha=.97))
    ax.text(lx+1.67, ly+.02, 'CHÚ THÍCH', fontsize=9, ha='center', va='top',
        fontweight='bold', fontfamily=FONT, zorder=9)
    items = [
        (C['zone_bien_bg'], C['zone_bien_bd'], 'Vùng mạng biên'),
        (C['zone_dmz_bg'],  C['zone_dmz_bd'],  'DMZ Zone (WAF)'),
        (C['zone_srv_bg'],  C['zone_srv_bd'],   'Vùng máy chủ nội bộ'),
        (C['zone_lan_bg'],  C['zone_lan_bd'],   'Vùng mạng nội bộ (LAN)'),
        (C['zone_adm_bg'],  C['zone_adm_bd'],   'Vùng quản trị (Admin)'),
    ]
    for i, (bg, bd, lbl) in enumerate(items):
        iy = ly - .5 - i*.42
        ax.add_patch(FancyBboxPatch((lx+.18, iy-.15), .4, .3,
            boxstyle="round,pad=.02", lw=1, ec=bd, fc=bg, zorder=9))
        ax.text(lx+.72, iy, lbl, fontsize=7.5, va='center',
            color=C['dark'], fontfamily=FONT, zorder=9)
    ay = ly - .5 - len(items)*.42
    ax.annotate('', xy=(lx+.58, ay), xytext=(lx+.18, ay),
        arrowprops=dict(arrowstyle='->', color=C['orange'], lw=2), zorder=9)
    ax.text(lx+.72, ay, 'Kết nối qua Firewall',
        fontsize=7.5, va='center', color=C['dark'], fontfamily=FONT, zorder=9)
    ax.plot([lx+.18, lx+.58], [ay-.4, ay-.4],
        color='#666', lw=1.5, ls='--', zorder=9)
    ax.text(lx+.72, ay-.4, 'Kết nối nội bộ (dashed)',
        fontsize=7.5, va='center', color=C['dark'], fontfamily=FONT, zorder=9)

    plt.tight_layout(pad=.3)
    plt.savefig(output_path, dpi=180, bbox_inches='tight', facecolor='white')
    plt.close()


# ────────────────────── SƠ ĐỒ 2: KIẾN TRÚC LOGIC CHI TIẾT ──────────────────────

def draw_detail(data: dict, output_path: str):
    """
    Vẽ sơ đồ kiến trúc logic chi tiết theo tầng/phòng.
    Số cột tự động theo len(khu_vuc_list), tối đa ~7 cột đẹp.
    """
    isp_list  = data.get('isp_list', [])
    co_cbt    = data.get('co_can_bang_tai', True)
    l3_cong   = data.get('l3_switch_cong', 24)
    khu_list  = data.get('khu_vuc_list', [])

    n = len(khu_list)
    fw = max(15, n*2.9+3)
    fig, ax = plt.subplots(figsize=(fw, 13.5))
    ax.set_xlim(0, fw); ax.set_ylim(0, 13.5); ax.axis('off')
    fig.patch.set_facecolor('white'); cx = fw/2

    # ── Title ──
    ax.text(cx, 13.2,
        'SƠ ĐỒ KIẾN TRÚC LOGIC HỆ THỐNG THÔNG TIN CẤP ĐỘ 2',
        fontsize=12, fontweight='bold', ha='center', va='top',
        color=C['dark'], fontfamily=FONT)

    # ── Internet ──
    draw_cloud(ax, cx, 12.2, rx=1.35, ry=.65)

    # ── ISPs ──
    ni = min(len(isp_list), 3); sp = 3.0; sx = cx-(ni-1)*sp/2
    for i, isp in enumerate(isp_list[:ni]):
        ix = sx + i*sp
        prov = isp.get('isp_provider','').upper()
        fc = C['isp2'] if 'VIETTEL' in prov else C['isp1']
        draw_cylinder(ax, ix, 10.8, fill=fc, label=isp.get('ten', f'ISP #{i+1}'))
        line(ax, ix, 11.15, cx, 11.88, color='#555', lw=1.3)

    # ── Cân bằng tải (nếu có) ──
    cbt_y = 9.5
    if co_cbt:
        ax.add_patch(FancyBboxPatch((cx-.55, cbt_y-.38), 1.1, .76,
            boxstyle="round,pad=.1", lw=1.5, ec='#1A4E8A', fc='#2E75B6', zorder=5))
        ax.text(cx, cbt_y, 'AXP', fontsize=12, ha='center', va='center',
            color='white', fontweight='bold', fontfamily=FONT, zorder=6)
        ax.text(cx+.68, cbt_y, 'Thiết bị cân\nbằng tải', fontsize=7.5,
            ha='left', va='center', color=C['dark'], fontfamily=FONT, zorder=6)
        arrow(ax, cx, 11.88-.45, cx, cbt_y+.4, color='#333', lw=1.8)
        ax.text(cx-.58, (11.43+cbt_y+.4)/2, 'Cổng 1',
            fontsize=7.5, ha='right', va='center', color='#444', fontfamily=FONT)
        fw_in = cbt_y-.4
    else:
        fw_in = 10.45

    # ── Firewall ──
    fw_cy = 7.8
    draw_firewall(ax, cx, fw_cy)
    ax.text(cx, fw_cy-.9,  'FW01', fontsize=9.5, ha='center', va='top',
        fontweight='bold', color=C['dark'], fontfamily=FONT, zorder=7)
    ax.text(cx, fw_cy-1.1, 'Firewall + VPN', fontsize=7.5, ha='center', va='top',
        style='italic', color=C['gray'], fontfamily=FONT, zorder=7)
    ax.text(cx, fw_cy-1.3, 'IDS/IPS + AV', fontsize=7.5, ha='center', va='top',
        style='italic', color=C['gray'], fontfamily=FONT, zorder=7)
    arrow(ax, cx, fw_in, cx, fw_cy+.72, color='#333', lw=2)
    if co_cbt:
        ax.text(cx-.58, (fw_in+fw_cy+.72)/2, 'Cổng 2',
            fontsize=7.5, ha='right', va='center', color='#444', fontfamily=FONT)
    ax.text(cx-.5, fw_cy-.86, '#1', fontsize=7, ha='right',
        va='center', color='#555', fontfamily=FONT)

    # ── L3 Switch ──
    l3y = 6.1
    draw_switch(ax, cx, l3y, r=.42, label='L3 SW', sub=f'(Core Switch)\nSW Lớp 3 – {l3_cong} cổng')
    arrow(ax, cx, fw_cy-1.45, cx, l3y+.44, color='#333', lw=2)

    # ── Vùng LAN ──
    khu_sp = fw/(n+1)
    khu_xs = [khu_sp*(i+1) for i in range(n)]
    lx0 = min(khu_xs)-1.6; lx1 = max(khu_xs)+1.6
    draw_zone(ax, lx0, .2, lx1-lx0, 5.4, 'Vùng mạng nội bộ (LAN)',
        C['zone_lan_bg'], C['zone_lan_bd'], ls='--', fs=9, alpha=.35, z=1)

    # ── L2 Switches + khu vực ──
    l2y = 4.2
    for i, (kv, kx) in enumerate(zip(khu_list, khu_xs)):
        pno  = kv.get('port_so', i+2)
        ten  = kv.get('ten', f'Khu {i+1}')
        loai = kv.get('loai', 'tang')

        # Port label trên L3
        ax.text(kx, l3y-.32, f'#{pno}', fontsize=7, ha='center', va='top',
            color='#555', fontfamily=FONT, zorder=6)
        # Line L3 → L2
        line(ax, cx, l3y-.44, kx, l2y+.32, color='#333', lw=1.5)
        # L2 switch
        draw_switch(ax, kx, l2y, r=.3, label=ten.replace('\n',' '))
        ax.text(kx+.36, l2y+.25, '#1', fontsize=6.5, ha='left', va='bottom',
            color='#555', fontfamily=FONT)

        oval_cy = 2.3
        if loai == 'tang' and i == 0:
            # Tầng 1: dashed circle + PC + WiFi AP
            ax.add_patch(Ellipse((kx, oval_cy), 2.6, 3.0,
                lw=1.8, ls='--', ec=C['zone_lan_bd'], fc='none', zorder=2))
            draw_pc(ax, kx-.7, oval_cy+.05)
            ax.text(kx-.7, oval_cy-.28, 'Máy trạm\n(PC/Laptop)', fontsize=6.5,
                ha='center', va='top', color=C['dark'], fontfamily=FONT, zorder=5)
            draw_wifi_ap(ax, kx+.5, oval_cy+.15, r=.24)
            ax.text(kx+.5, oval_cy-.1, 'WiFi AP', fontsize=6.5, ha='center', va='top',
                fontweight='bold', color=C['dark'], fontfamily=FONT, zorder=6)
        else:
            ax.add_patch(Ellipse((kx, oval_cy), 1.9, 1.6,
                lw=1.2, ec='#888', fc='white', zorder=4))
            ax.text(kx, oval_cy, f'Mạng\nnội bộ\n{ten}', fontsize=6.5,
                ha='center', va='center', color=C['dark'], fontfamily=FONT, zorder=5)
        line(ax, kx, l2y-.32, kx, oval_cy+.78, color='#666', lw=1.2, ls='--')

    plt.tight_layout(pad=.3)
    plt.savefig(output_path, dpi=180, bbox_inches='tight', facecolor='white')
    plt.close()
```

---

## CÁCH NHÚNG ẢNH VÀO FILE WORD (docx)

```python
from docx import Document
from docx.shared import Inches, Pt, Cm
from docx.enum.text import WD_ALIGN_PARAGRAPH

def insert_diagram_into_docx(doc: Document, image_path: str,
                              caption: str, width_cm: float = 16.0):
    """
    Chèn ảnh sơ đồ vào document với caption bên dưới.
    Đặt sau đoạn văn bản mô tả sơ đồ.
    """
    # Đoạn ảnh
    para = doc.add_paragraph()
    para.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = para.add_run()
    run.add_picture(image_path, width=Cm(width_cm))

    # Caption
    cap = doc.add_paragraph(caption)
    cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
    cap_run = cap.runs[0]
    cap_run.font.size = Pt(9)
    cap_run.font.italic = True
    cap_run.font.bold = True
    cap_run.font.color.rgb = None  # inherit
```

### Vị trí chèn trong HSDX template:

```python
# Phần I.4 – Mục 4.1: Mô hình logic tổng thể
# Tìm placeholder "[HINH_SO_DO_LOGIC]" trong template, thay bằng ảnh
insert_diagram_into_docx(doc, 'diagram_logic.png',
    caption='Hình 1. Mô hình logic tổng thể hệ thống thông tin', width_cm=16)

# Phần I.4 – Mục 4.2: Sơ đồ kiến trúc chi tiết
# Tìm placeholder "[HINH_SO_DO_CHI_TIET]" trong template, thay bằng ảnh
insert_diagram_into_docx(doc, 'diagram_detail.png',
    caption='Hình 2. Sơ đồ kiến trúc logic chi tiết hệ thống thông tin', width_cm=16)
```

---

## LUỒNG XỬ LÝ ĐẦY ĐỦ

```python
import tempfile, os

def generate_and_embed_diagrams(doc, survey_data: dict):
    """
    Hàm tổng hợp: sinh ảnh → nhúng vào doc.
    Gọi trong quá trình xuất file HSDX.
    """
    # 1. Chuyển đổi dữ liệu khảo sát sang schema biểu đồ
    diagram_data = {
        "don_vi_ten":      survey_data['A1_ten_don_vi'],
        "isp_list": [
            {
                "ten":          f"{d['isp']} #{i+1}",
                "isp_provider": d['isp'],
                "vai_tro":      d['vai_tro'],
            }
            for i, d in enumerate(survey_data.get('D1_duong_truyen', []))
        ],
        "co_can_bang_tai": any('cân bằng tải' in str(e).lower()
                               for e in survey_data.get('E1_thiet_bi_mang', [])),
        "co_dmz":          survey_data.get('T1_1_co_dmz', False),
        "co_server_farm":  len(survey_data.get('F2_may_chu', [])) > 0,
        "l3_switch_cong":  _get_l3_ports(survey_data),
        "khu_vuc_list":    _build_khu_vuc(survey_data),
    }

    # 2. Sinh ảnh vào thư mục tạm
    with tempfile.TemporaryDirectory() as tmpdir:
        path_logic  = os.path.join(tmpdir, 'diagram_logic.png')
        path_detail = os.path.join(tmpdir, 'diagram_detail.png')

        draw_logic(diagram_data, path_logic)
        draw_detail(diagram_data, path_detail)

        # 3. Nhúng vào doc
        insert_diagram_into_docx(doc, path_logic,
            'Hình 1. Mô hình logic tổng thể hệ thống thông tin')
        insert_diagram_into_docx(doc, path_detail,
            'Hình 2. Sơ đồ kiến trúc logic chi tiết hệ thống thông tin')


def _get_l3_ports(survey_data) -> int:
    """Tìm số cổng switch lớp 3 từ bảng thiết bị mạng."""
    for e in survey_data.get('E1_thiet_bi_mang', []):
        if 'l3' in str(e.get('loai_thiet_bi','')).lower() or \
           'layer 3' in str(e.get('loai_thiet_bi','')).lower():
            return 24  # default nếu không ghi rõ
    return 24


def _build_khu_vuc(survey_data) -> list:
    """
    Xây dựng khu_vuc_list từ T5_vi_tri[] hoặc T2_port_mapping[].
    Ưu tiên T2 vì có thông tin port cụ thể.
    """
    khu = []
    # Từ T2 port mapping
    for row in survey_data.get('T2_port_mapping', []):
        khu.append({
            "ten":     row.get('ten_switch', 'Khu vực'),
            "port_so": row.get('port_uplink', len(khu)+2),
            "loai":    "tang" if 'tầng' in str(row.get('ten_switch','')).lower() else "khu",
        })
    # Nếu không có T2, tự sinh từ số tầng tòa nhà
    if not khu:
        so_tang = survey_data.get('so_tang_toa_nha', 3)
        for i in range(so_tang):
            khu.append({"ten": f"Tầng {i+1}", "port_so": i+2, "loai": "tang"})
    return khu
```

---

## QUY TẮC VẼ CỐ ĐỊNH (không thay đổi theo dữ liệu)

| Quy tắc | Mô tả |
|---------|-------|
| **Màu ISP** | VNPT = `#2E75B6` (xanh dương), Viettel = `#538135` (xanh lá), khác = xám |
| **Màu zone** | Biên=xanh dương nhạt, DMZ=cam nhạt, Server=xanh lá nhạt, LAN=tím nhạt, Admin=vàng nhạt |
| **Arrow FW** | Màu cam `#E05A2B`, lw=2.5 |
| **Arrow nội bộ** | Màu đen `#333`, dashed `--` |
| **Font** | DejaVu Sans (built-in matplotlib, không cần cài thêm) |
| **DPI** | 180 (chất lượng in đủ tốt cho Word A4) |
| **Tầng 1** | Luôn vẽ PC + WiFi AP trong dashed circle (khu vực đặc biệt) |
| **Tầng còn lại** | Oval đơn giản với label "Mạng nội bộ [tên]" |
| **AXP** | Chỉ vẽ nếu `co_can_bang_tai=True` |
| **DMZ/Server note** | Chỉ hiện note đỏ nếu `co_dmz=False` / `co_server_farm=False` |

---

## CHECKLIST KIỂM TRA

- [ ] ISP 1 màu xanh dương, ISP 2 màu xanh lá
- [ ] Tiêu đề góc trên phải sơ đồ 1 dùng `don_vi_ten` thực tế (không hardcode)
- [ ] Số tầng/khu vực trong sơ đồ 2 khớp với `khu_vuc_list`
- [ ] Số cổng `#2, #3...` trên L3 SW đúng theo `port_so` từng khu vực
- [ ] Ảnh PNG rõ nét khi in A4 (DPI ≥ 150)
- [ ] Không còn text "Lý Nhân", "Ninh Bình" trong code (phải lấy từ data)

---

*Tài liệu: PROMPT_DIAGRAM_GENERATOR.md | v1.0 | 04/2026*
