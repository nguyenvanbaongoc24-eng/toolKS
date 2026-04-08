"""
GENERATOR v2: Sơ đồ mạng ATTT Cấp độ 2 — fixed icons + layout
"""
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch, Ellipse, Circle, Polygon, FancyArrow
import numpy as np

C = {
    'zone_bien_bg':'#D6E4F7','zone_bien_bd':'#4472C4',
    'zone_dmz_bg':'#FCE4D6','zone_dmz_bd':'#C55A11',
    'zone_server_bg':'#E2EFDA','zone_server_bd':'#538135',
    'zone_lan_bg':'#EDE7F6','zone_lan_bd':'#7030A0',
    'zone_admin_bg':'#FFF2CC','zone_admin_bd':'#BF8F00',
    'sw_fill':'#2E75B6','sw_border':'#1A4E8A',
    'fw_wall':'#C00000','fw_net':'#2E75B6',
    'isp1':'#2E75B6','isp2':'#538135',
    'orange':'#E05A2B','green':'#538135',
    'dark':'#1F2937','gray':'#6B7280','red_italic':'#C00000',
}
FONT='DejaVu Sans'

def zone(ax,x,y,w,h,label,bg,bd,ls='--',fs=11,alpha=0.5,zorder=1):
    ax.add_patch(FancyBboxPatch((x,y),w,h,boxstyle="round,pad=0.2",
        lw=2,ls=ls,ec=bd,fc=bg,alpha=alpha,zorder=zorder))
    if label:
        ax.text(x+w/2,y+h-0.35,label,fontsize=fs,fontweight='bold',
            color=bd,ha='center',va='top',fontfamily=FONT,zorder=zorder+4)

def cloud(ax,cx,cy,rx=1.1,ry=0.55):
    bumps=[(0,0,rx,ry),(-rx*.5,ry*.4,rx*.5,ry*.48),(rx*.5,ry*.38,rx*.45,ry*.44),
           (-rx*.15,ry*.52,rx*.35,ry*.35),(rx*.28,ry*.54,rx*.32,ry*.33)]
    for dx,dy,rx2,ry2 in bumps:
        ax.add_patch(Ellipse((cx+dx,cy+dy),rx2*2,ry2*2,
            lw=1.2,ec='#888',fc='white',zorder=5))
    ax.text(cx,cy,'Internet',fontsize=10,fontweight='bold',
        ha='center',va='center',color=C['dark'],fontfamily=FONT,zorder=7)

def cylinder(ax,cx,cy,fill,label='',rx=.38,ry=.12,h=.62):
    ax.add_patch(plt.Polygon([[cx-rx,cy-h/2],[cx+rx,cy-h/2],
        [cx+rx,cy+h/2],[cx-rx,cy+h/2]],fc=fill,ec='#222',lw=1.2,zorder=5))
    ax.add_patch(Ellipse((cx,cy+h/2),rx*2,ry*2,ec='#222',fc=fill,lw=1.2,zorder=6))
    ax.add_patch(Ellipse((cx,cy-h/2),rx*2,ry*2,ec='#222',fc=fill,lw=1.2,alpha=.7,zorder=4))
    if label:
        ax.text(cx,cy-h/2-.22,label,fontsize=7.5,ha='center',va='top',
            color=C['dark'],fontfamily=FONT,fontweight='bold',zorder=6)

def sw_icon(ax,cx,cy,r=.32,fill=None,label='',sub='',portlabel=''):
    fill=fill or C['sw_fill']
    ax.add_patch(Circle((cx,cy),r,lw=1.5,ec=C['sw_border'],fc=fill,zorder=5))
    for a in [0,45,90,135]:
        rad=np.radians(a); d=r*.65
        ax.plot([cx-d*np.cos(rad),cx+d*np.cos(rad)],
                [cy-d*np.sin(rad),cy+d*np.sin(rad)],
                color='white',lw=1.5,zorder=6)
    if portlabel:
        ax.text(cx-r-.06,cy+r*.4,portlabel,fontsize=6.5,ha='right',
            va='center',color='#555',fontfamily=FONT,zorder=6)
    if label:
        ax.text(cx,cy-r-.18,label,fontsize=7.5,ha='center',va='top',
            fontweight='bold',color=C['dark'],fontfamily=FONT,zorder=6)
    if sub:
        ax.text(cx,cy-r-.42,sub,fontsize=6.5,ha='center',va='top',
            color=C['gray'],fontfamily=FONT,zorder=6)

def fw_icon(ax,cx,cy,w=1.3,h=1.25):
    ax.add_patch(FancyBboxPatch((cx-w/2-.14,cy-h/2-.14),w+.28,h+.28,
        boxstyle="round,pad=0.12",lw=2.5,ec=C['zone_admin_bd'],
        fc=C['zone_admin_bg'],zorder=4))
    ax.add_patch(FancyBboxPatch((cx-.44,cy-.02),0.88,.46,
        lw=1,ec='#8B0000',fc=C['fw_wall'],zorder=5))
    for bx in np.arange(cx-.38,cx+.42,.21):
        ax.add_patch(FancyBboxPatch((bx-.08,cy+.04),.16,.16,
            lw=.4,ec='#8B0000',fc='#ff4444',zorder=6))
    ax.add_patch(FancyBboxPatch((cx-.44,cy-.52),0.88,.46,
        lw=1,ec='#1A4E8A',fc=C['fw_net'],zorder=5))
    for px,py in [(-0.2,-.28),(0.2,-.28),(0,-.28)]:
        ax.plot([cx,cx+px*1.3],[cy+py,cy+py-.13],
            color='white',lw=1.2,solid_capstyle='round',zorder=6)
    ax.add_patch(Circle((cx,cy-.28),.1,fc='white',ec='white',zorder=7))

def pc_icon(ax,cx,cy,w=.52,h=.38):
    """PC/Monitor icon dùng shapes"""
    ax.add_patch(FancyBboxPatch((cx-w/2,cy),w,h,
        boxstyle="round,pad=.04",lw=1.2,ec='#555',fc='#94A3B8',zorder=5))
    ax.add_patch(FancyBboxPatch((cx-w/2+.06,cy+.06),w-.12,h-.14,
        lw=.8,ec='#334',fc='#60A5FA',zorder=6))
    ax.add_patch(plt.Polygon([[cx-w*.25,cy],[cx+w*.25,cy],
        [cx+w*.15,cy-.18],[cx-w*.15,cy-.18]],fc='#888',ec='#555',lw=.8,zorder=5))
    ax.add_patch(FancyBboxPatch((cx-w*.3,cy-.18),w*.6,.04,
        lw=.5,ec='#555',fc='#aaa',zorder=6))

def mobile_icon(ax,cx,cy,w=.28,h=.48):
    ax.add_patch(FancyBboxPatch((cx-w/2,cy-h/2),w,h,
        boxstyle="round,pad=.05",lw=1.2,ec='#555',fc='#94A3B8',zorder=5))
    ax.add_patch(FancyBboxPatch((cx-w/2+.04,cy-h/2+.08),w-.08,h-.18,
        lw=.5,ec='#334',fc='#60A5FA',zorder=6))
    ax.add_patch(Circle((cx,cy-h/2+.04),.04,fc='#555',ec='#333',zorder=6))

def wifi_ap(ax,cx,cy,r=.22):
    ax.add_patch(Circle((cx,cy),r,lw=1.5,ec='#005A9E',fc='#0070C0',zorder=5))
    for a,rad_scale in [(90,.7),(60,.5),(120,.5)]:
        rad=np.radians(a)
        for rr in [.28,.18]:
            arc=matplotlib.patches.Arc((cx,cy),rr*2,rr*2,angle=0,
                theta1=a-35,theta2=a+35,color='white',lw=1.2,zorder=6)
            ax.add_patch(arc)
    ax.plot([cx,cx],[cy-.12,cy+.08],color='white',lw=1.5,zorder=7)

def arr(ax,x1,y1,x2,y2,color='#333',lw=1.5,ls='-',style='->',zorder=3):
    ax.annotate('',xy=(x2,y2),xytext=(x1,y1),
        arrowprops=dict(arrowstyle=style,color=color,lw=lw,
            linestyle=ls,connectionstyle='arc3,rad=0'),zorder=zorder)

def line(ax,x1,y1,x2,y2,color='#555',lw=1.4,ls='-',zorder=3):
    ax.plot([x1,x2],[y1,y2],color=color,lw=lw,ls=ls,zorder=zorder)

# ─────────────────────── DIAGRAM 1 ───────────────────────
def draw_logic(data,out):
    don_vi=data.get('don_vi_ten','[TÊN ĐƠN VỊ]')
    isp_list=data.get('isp_list',[{'ten':'ISP #1','isp_provider':'VNPT','vai_tro':'Chính'},
                                   {'ten':'ISP #2','isp_provider':'Viettel','vai_tro':'Dự phòng'}])
    co_dmz=data.get('co_dmz',False)
    co_srv=data.get('co_server_farm',False)

    fig,ax=plt.subplots(figsize=(15,11)); ax.set_xlim(0,15); ax.set_ylim(0,11); ax.axis('off')
    fig.patch.set_facecolor('white')

    # Header
    ax.text(14.8,10.78,f'HỒ SƠ ĐỀ XUẤT CẤP ĐỘ 2 – {don_vi.upper()}',
        fontsize=8.5,ha='right',va='top',style='italic',color='#888',fontfamily=FONT)
    ax.axhline(10.58,xmin=.01,xmax=.99,color='#CCC',lw=.8)

    # Zones
    zone(ax,.4,7.55,14.2,2.75,'Vùng mạng biên',C['zone_bien_bg'],C['zone_bien_bd'],fs=12)
    zone(ax,.4,3.75,4.1,3.55,'DMZ Zone',C['zone_dmz_bg'],C['zone_dmz_bd'],fs=11)
    zone(ax,10.5,3.75,4.1,3.55,'Vùng máy chủ nội bộ',C['zone_server_bg'],C['zone_server_bd'],fs=10)
    zone(ax,3.0,.25,9.0,4.3,'Vùng mạng nội bộ (LAN)',C['zone_lan_bg'],C['zone_lan_bd'],ls='-',fs=11)

    # Zone notes (italic red)
    if not co_dmz:
        ax.text(2.45,5.25,'(Dự phòng mở rộng cho\ntương lai, chưa đầu tư)',
            fontsize=8,ha='center',va='center',style='italic',color=C['red_italic'],fontfamily=FONT,zorder=6)
    if not co_srv:
        ax.text(12.55,5.25,'(Dự phòng mở rộng cho\ntương lai, chưa đầu tư)',
            fontsize=8,ha='center',va='center',style='italic',color=C['red_italic'],fontfamily=FONT,zorder=6)

    # Internet cloud
    cloud(ax,7.5,9.3,rx=1.25,ry=.62)

    # ISPs
    n=min(len(isp_list),3); sp=3.2; sx=7.5-(n-1)*sp/2
    isp_xs=[]
    for i,isp in enumerate(isp_list[:n]):
        ix=sx+i*sp; isp_xs.append(ix)
        prov=isp.get('isp_provider','').upper()
        fc=C['isp2'] if 'VIETTEL' in prov or 'VNPT2' in prov else C['isp1']
        cylinder(ax,ix,8.1,fill=fc,label='')
        ax.add_patch(FancyBboxPatch((ix-.82,7.75),1.64,.58,
            boxstyle="round,pad=.06",lw=1,ec='#4472C4',fc='white',zorder=4,alpha=.95))
        ax.text(ix,8.12,isp['ten'],fontsize=8,ha='center',va='center',
            fontweight='bold',color=C['dark'],fontfamily=FONT,zorder=5)
        ax.text(ix,7.88,f"({isp['vai_tro']})",fontsize=7,ha='center',va='center',
            color=C['gray'],fontfamily=FONT,zorder=5)
        line(ax,ix,8.68,7.3+i*.4,8.85,color='#4472C4',lw=1.3)

    # Admin zone (FW wrapper)
    zone(ax,6.1,5.25,2.8,2.1,'',C['zone_admin_bg'],C['zone_admin_bd'],ls='-',alpha=.75,zorder=2)

    # Firewall
    fw_cx,fw_cy=7.5,6.15
    fw_icon(ax,fw_cx,fw_cy)
    ax.text(fw_cx,fw_cy-.88,'FW01',fontsize=9,ha='center',va='top',
        fontweight='bold',color=C['dark'],fontfamily=FONT,zorder=7)
    ax.text(fw_cx,fw_cy-1.1,'Firewall + VPN',fontsize=7,ha='center',va='top',
        style='italic',color=C['gray'],fontfamily=FONT,zorder=7)
    ax.text(fw_cx,fw_cy-1.3,'IDS/IPS + AV',fontsize=7,ha='center',va='top',
        style='italic',color=C['gray'],fontfamily=FONT,zorder=7)

    # Arrows: Internet → FW
    arr(ax,7.5,7.55,7.5,6.82,color=C['orange'],lw=2.5)
    # FW → DMZ
    arr(ax,6.35,6.0,4.5,5.6,color=C['orange'],lw=1.6)
    # FW → Server
    arr(ax,8.65,6.0,10.5,5.6,color=C['green'],lw=1.6)

    # L3 Switch
    l3y=4.65
    sw_icon(ax,7.5,l3y,r=.38,label='L3 SW',sub='(Core Switch)')
    arr(ax,7.5,fw_cy-.78,7.5,l3y+.4,color=C['dark'],lw=2)

    # L2 Switch
    l2x,l2y=5.5,2.6
    sw_icon(ax,l2x,l2y,r=.32,label='L2 SW',sub='(Access Switch)')
    line(ax,7.5,l3y-.4,l2x+.35,l2y+.25,color='#555',lw=1.5,ls='--')

    # WiFi AP
    apx,apy=9.2,2.6
    wifi_ap(ax,apx,apy,r=.3)
    ax.text(apx,apy-.48,'WiFi AP',fontsize=7.5,ha='center',va='top',
        fontweight='bold',color=C['dark'],fontfamily=FONT,zorder=6)
    ax.text(apx,apy-.7,'WPA2/WPA3',fontsize=6.5,ha='center',va='top',
        color=C['gray'],fontfamily=FONT,zorder=6)
    line(ax,7.5,l3y-.4,apx-.35,apy+.25,color='#555',lw=1.5,ls='--')

    # PCs
    for px in [4.4,5.15,5.9]:
        pc_icon(ax,px,1.2)
        line(ax,l2x,l2y-.34,px,1.58,color='#777',lw=1,ls='--')
    ax.text(5.15,.75,'Máy trạm người dùng\n(PC/Laptop)',fontsize=7.5,
        ha='center',va='top',color=C['dark'],fontfamily=FONT,zorder=5)

    # Mobile
    mobile_icon(ax,9.2,1.35)
    ax.text(9.2,.75,'Thiết bị di động\n(WiFi)',fontsize=7.5,
        ha='center',va='top',color=C['dark'],fontfamily=FONT,zorder=5)
    line(ax,apx,apy-.34,9.2,1.6,color='#777',lw=1,ls='--')

    # Legend
    lx,ly=.45,3.5
    ax.add_patch(FancyBboxPatch((lx,ly-3.1),3.3,3.15,
        boxstyle="round,pad=.12",lw=1,ec='#AAA',fc='white',zorder=8,alpha=.97))
    ax.text(lx+1.65,ly+.02,'CHÚ THÍCH',fontsize=9,ha='center',va='top',
        fontweight='bold',fontfamily=FONT,zorder=9)
    items=[(C['zone_bien_bg'],C['zone_bien_bd'],'Vùng mạng biên'),
           (C['zone_dmz_bg'],C['zone_dmz_bd'],'DMZ Zone (WAF)'),
           (C['zone_server_bg'],C['zone_server_bd'],'Vùng máy chủ nội bộ'),
           (C['zone_lan_bg'],C['zone_lan_bd'],'Vùng mạng nội bộ (LAN)'),
           (C['zone_admin_bg'],C['zone_admin_bd'],'Vùng quản trị (Admin)')]
    for i,(bg,bd,lbl) in enumerate(items):
        iy=ly-.48-i*.42
        ax.add_patch(FancyBboxPatch((lx+.18,iy-.15),.4,.3,
            boxstyle="round,pad=.02",lw=1,ec=bd,fc=bg,zorder=9))
        ax.text(lx+.72,iy,lbl,fontsize=7.5,va='center',color=C['dark'],fontfamily=FONT,zorder=9)
    ay=ly-.48-len(items)*.42
    ax.annotate('',xy=(lx+.58,ay),xytext=(lx+.18,ay),
        arrowprops=dict(arrowstyle='->',color=C['orange'],lw=2),zorder=9)
    ax.text(lx+.72,ay,'Kết nối qua Firewall',fontsize=7.5,
        va='center',color=C['dark'],fontfamily=FONT,zorder=9)
    ax.plot([lx+.18,lx+.58],[ay-.4,ay-.4],color='#666',lw=1.5,ls='--',zorder=9)
    ax.text(lx+.72,ay-.4,'Kết nối nội bộ (dashed)',fontsize=7.5,
        va='center',color=C['dark'],fontfamily=FONT,zorder=9)

    plt.tight_layout(pad=.3)
    plt.savefig(out,dpi=180,bbox_inches='tight',facecolor='white')
    plt.close()
    print(f'✓ Logic → {out}')

# ─────────────────────── DIAGRAM 2 ───────────────────────
def draw_detail(data,out):
    isp_list=data.get('isp_list',[
        {'ten':'Modem VNPT #1','isp_provider':'VNPT','vai_tro':'Chính'},
        {'ten':'Modem Viettel #2','isp_provider':'Viettel','vai_tro':'Dự phòng'}])
    co_cbt=data.get('co_can_bang_tai',True)
    l3_cong=data.get('l3_switch_cong',24)
    khu_list=data.get('khu_vuc_list',[
        {'ten':'Tầng 1','port_so':2,'loai':'tang'},
        {'ten':'Tầng 2','port_so':3,'loai':'tang'},
        {'ten':'Tầng 3','port_so':4,'loai':'tang'},
        {'ten':'Khu hành\nchính công','port_so':5,'loai':'khu'},
        {'ten':'Phòng\nhội trường','port_so':6,'loai':'phong'},])

    n=len(khu_list); fw=max(15,n*2.9+3)
    fig,ax=plt.subplots(figsize=(fw,13.5)); ax.set_xlim(0,fw); ax.set_ylim(0,13.5); ax.axis('off')
    fig.patch.set_facecolor('white'); cx=fw/2

    # Title
    ax.text(cx,13.2,'SƠ ĐỒ KIẾN TRÚC LOGIC HỆ THỐNG THÔNG TIN CẤP ĐỘ 2',
        fontsize=12,fontweight='bold',ha='center',va='top',color=C['dark'],fontfamily=FONT)

    # Internet cloud
    cloud(ax,cx,12.2,rx=1.35,ry=.65)

    # ISPs
    ni=min(len(isp_list),3); sp=3.0; sx=cx-(ni-1)*sp/2
    isp_xs=[]
    for i,isp in enumerate(isp_list[:ni]):
        ix=sx+i*sp; isp_xs.append(ix)
        prov=isp.get('isp_provider','').upper()
        fc=C['isp2'] if 'VIETTEL' in prov else C['isp1']
        cylinder(ax,ix,10.8,fill=fc,label=isp.get('ten',f'ISP #{i+1}'))
        # Arrow ISP → Internet
        line(ax,ix,11.15,cx-.15+i*.3,11.88,color='#555',lw=1.3)
        arr(ax,cx-.15+i*.3,11.88,cx,11.88,color='#4472C4',lw=1.2,ls='-')

    # Cân bằng tải
    cbt_y=9.5
    if co_cbt:
        ax.add_patch(FancyBboxPatch((cx-.55,cbt_y-.38),1.1,.76,
            boxstyle="round,pad=.1",lw=1.5,ec='#1A4E8A',fc='#2E75B6',zorder=5))
        ax.text(cx,cbt_y,'AXP',fontsize=12,ha='center',va='center',
            color='white',fontweight='bold',fontfamily=FONT,zorder=6)
        ax.text(cx+.68,cbt_y,'Thiết bị cân\nbằng tải',fontsize=7.5,
            ha='left',va='center',color=C['dark'],fontfamily=FONT,zorder=6)
        # Arrow ISPs → CBT
        for ix in isp_xs:
            line(ax,ix,10.48,cx,cbt_y+.4,color='#555',lw=1.3)
        ax.text(cx-.55,(10.48+cbt_y+.4)/2,'Cổng 1',fontsize=7.5,
            ha='right',va='center',color='#444',fontfamily=FONT)
        fw_in_y=cbt_y-.4
    else:
        for ix in isp_xs:
            line(ax,ix,10.48,cx,9.0,color='#555',lw=1.3)
        fw_in_y=9.0

    # Firewall
    fw_cy=7.8
    fw_icon(ax,cx,fw_cy,w=1.3,h=1.25)
    ax.text(cx,fw_cy-.88,'FW01',fontsize=9.5,ha='center',va='top',
        fontweight='bold',color=C['dark'],fontfamily=FONT,zorder=7)
    ax.text(cx,fw_cy-1.1,'Firewall + VPN',fontsize=7.5,ha='center',va='top',
        style='italic',color=C['gray'],fontfamily=FONT,zorder=7)
    ax.text(cx,fw_cy-1.3,'IDS/IPS + AV',fontsize=7.5,ha='center',va='top',
        style='italic',color=C['gray'],fontfamily=FONT,zorder=7)
    arr(ax,cx,fw_in_y,cx,fw_cy+.72,color='#333',lw=2)
    if co_cbt:
        ax.text(cx-.55,(fw_in_y+fw_cy+.72)/2,'Cổng 2',fontsize=7.5,
            ha='right',va='center',color='#444',fontfamily=FONT)
    # Port #1 label
    ax.text(cx-.55,fw_cy-.88,'#1',fontsize=7,ha='right',va='center',color='#555',fontfamily=FONT)

    # L3 Switch
    l3y=6.1
    sw_icon(ax,cx,l3y,r=.42,label='L3 SW',sub=f'(Core Switch)\nSW Lớp 3 - {l3_cong} cổng')
    arr(ax,cx,fw_cy-1.45,cx,l3y+.44,color='#333',lw=2)

    # Vùng LAN wrapper
    khu_spacing=fw/(n+1)
    khu_xs=[khu_spacing*(i+1) for i in range(n)]
    lx0=min(khu_xs)-1.5; lx1=max(khu_xs)+1.5
    zone(ax,lx0,.2,lx1-lx0,5.4,'Vùng mạng nội bộ (LAN)',
        C['zone_lan_bg'],C['zone_lan_bd'],ls='--',fs=9,alpha=.35,zorder=1)

    # L2 switches per khu
    l2y=4.2
    for i,(kv,kx) in enumerate(zip(khu_list,khu_xs)):
        pno=kv.get('port_so',i+2); ten=kv.get('ten',f'Khu {i+1}'); loai=kv.get('loai','tang')
        # Port label on L3
        ax.text(kx,l3y-.32,f'#{pno}',fontsize=7,ha='center',va='top',color='#555',fontfamily=FONT,zorder=6)
        # Line L3→L2
        line(ax,cx,l3y-.44,kx,l2y+.32,color='#333',lw=1.5)
        # L2 switch
        sw_icon(ax,kx,l2y,r=.3,label=ten.replace('\n',' '))
        ax.text(kx+.35,l2y+.25,'#1',fontsize=6.5,ha='left',va='bottom',color='#555',fontfamily=FONT)

        oval_cy=2.3
        if loai=='tang' and i==0:
            # Tầng 1: PCs + WiFi AP + dashed circle
            ax.add_patch(Ellipse((kx,oval_cy),2.6,3.0,
                lw=1.8,ls='--',ec=C['zone_lan_bd'],fc='none',zorder=2))
            pc_icon(ax,kx-.7,oval_cy+.1)
            ax.text(kx-.7,oval_cy-.25,'Máy trạm\n(PC/Laptop)',fontsize=6.5,
                ha='center',va='top',color=C['dark'],fontfamily=FONT,zorder=5)
            wifi_ap(ax,kx+.5,oval_cy+.1,r=.25)
            ax.text(kx+.5,oval_cy-.14,'WiFi AP',fontsize=6.5,ha='center',va='top',
                fontweight='bold',color=C['dark'],fontfamily=FONT,zorder=6)
            line(ax,kx,l2y-.32,kx,oval_cy+1.4,color='#666',lw=1.2,ls='--')
        else:
            ax.add_patch(Ellipse((kx,oval_cy),1.9,1.6,
                lw=1.2,ec='#888',fc='white',zorder=4))
            ax.text(kx,oval_cy,f'Mạng\nnội bộ\n{ten}',
                fontsize=6.5,ha='center',va='center',color=C['dark'],fontfamily=FONT,zorder=5)
            line(ax,kx,l2y-.32,kx,oval_cy+.78,color='#666',lw=1.2,ls='--')

    plt.tight_layout(pad=.3)
    plt.savefig(out,dpi=180,bbox_inches='tight',facecolor='white')
    plt.close()
    print(f'✓ Detail → {out}')

# ─────────────────────── TEST ───────────────────────
if __name__=='__main__':
    d={
        'don_vi_ten':'UBND XÃ ABC, TỈNH XYZ',
        'isp_list':[{'ten':'VNPT #1','isp_provider':'VNPT','vai_tro':'Chính'},
                    {'ten':'Viettel #2','isp_provider':'Viettel','vai_tro':'Dự phòng'}],
        'co_can_bang_tai':True,'co_dmz':False,'co_server_farm':False,
        'l3_switch_cong':24,
        'khu_vuc_list':[
            {'ten':'Tầng 1','port_so':2,'loai':'tang'},
            {'ten':'Tầng 2','port_so':3,'loai':'tang'},
            {'ten':'Tầng 3','port_so':4,'loai':'tang'},
            {'ten':'Khu hành\nchính công','port_so':5,'loai':'khu'},
            {'ten':'Phòng\nhội trường','port_so':6,'loai':'phong'},
        ]}
    draw_logic(d,'/home/claude/diagram_logic_v2.png')
    draw_detail(d,'/home/claude/diagram_detail_v2.png')
