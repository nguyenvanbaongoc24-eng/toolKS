"use client";

import React, { useEffect, useRef } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'loose',
  flowchart: { useMaxWidth: true, htmlLabels: true, curve: 'basis' }
});

export default function NetworkDiagram({ data }: { data: any }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const renderDiagram = async () => {
      // Build ISP connections from form data
      const isps = data?.ket_noi_internet || [];
      const devices = data?.thiet_bi_mang || [];
      const servers = data?.may_chu || [];
      const cameras = data?.camera || [];
      const ips = data?.ip_tinh || [];

      let gd = `graph TD\n`;

      // ===== VÙNG MẠNG BIÊN =====
      gd += `  subgraph BORDER["🌐 Vùng mạng biên"]\n`;
      gd += `    INTERNET(("☁️ Internet"))\n`;
      if (isps.length > 0) {
        isps.forEach((isp: any, i: number) => {
          const name = isp.nha_cung_cap || `ISP ${i+1}`;
          const bw = isp.bang_thong ? ` ${isp.bang_thong}` : '';
          gd += `    MODEM${i}["🔌 ${name}${bw}"]\n`;
          gd += `    INTERNET --> MODEM${i}\n`;
        });
      } else {
        gd += `    MODEM0["🔌 Modem/Router"]\n`;
        gd += `    INTERNET --> MODEM0\n`;
      }
      gd += `  end\n\n`;

      // Load Balancer (nếu có nhiều ISP)
      if (isps.length > 1) {
        gd += `  LB{{"⚖️ Cân bằng tải"}}\n`;
        isps.forEach((_: any, i: number) => {
          gd += `  MODEM${i} --> LB\n`;
        });
        gd += `  LB --> FW\n`;
      } else {
        gd += `  MODEM0 --> FW\n`;
      }

      // ===== FIREWALL =====
      gd += `  FW["🔥 FW01\\nFirewall + VPN\\nIDS/IPS"]\n\n`;

      // ===== CORE SWITCH =====
      gd += `  FW --> CORE\n`;
      gd += `  CORE["🔀 Core Switch L3\\n(24 cổng)"]\n\n`;

      // ===== VÙNG LAN - Các tầng =====
      gd += `  subgraph LAN["🏢 Vùng mạng nội bộ (LAN)"]\n`;
      
      // Group devices by location
      const floors = new Map<string, any[]>();
      devices.forEach((d: any) => {
        const loc = d.vi_tri || 'Khác';
        if (!floors.has(loc)) floors.set(loc, []);
        floors.get(loc)!.push(d);
      });

      if (floors.size > 0) {
        let fi = 0;
        floors.forEach((devs, loc) => {
          gd += `    SW${fi}["🔗 Switch\\n${loc}"]\n`;
          gd += `    CORE --> SW${fi}\n`;
          devs.forEach((d: any, di: number) => {
            if (d.loai_thiet_bi && d.loai_thiet_bi !== 'Switch') {
              gd += `    DEV${fi}_${di}["${d.loai_thiet_bi}\\n${d.model || ''}"]\n`;
              gd += `    SW${fi} -.- DEV${fi}_${di}\n`;
            }
          });
          fi++;
        });
      } else {
        gd += `    SW_T1["🔗 Switch Tầng 1"]\n`;
        gd += `    SW_T2["🔗 Switch Tầng 2"]\n`;
        gd += `    SW_T3["🔗 Switch Tầng 3"]\n`;
        gd += `    CORE --> SW_T1\n    CORE --> SW_T2\n    CORE --> SW_T3\n`;
        gd += `    PC1["💻 PC/Laptop\\ncán bộ"]\n    SW_T1 -.- PC1\n`;
      }

      // WiFi
      gd += `    WIFI["📶 WiFi AP\\nWPA2/WPA3"]\n`;
      gd += `    CORE -.- WIFI\n`;
      gd += `  end\n\n`;

      // ===== MÁY CHỦ =====
      if (servers.length > 0) {
        gd += `  subgraph SRV["🖥️ Máy chủ"]\n`;
        servers.forEach((s: any, i: number) => {
          const name = s.vai_tro || s.model || `Server ${i+1}`;
          const os = s.he_dieu_hanh ? `\\n${s.he_dieu_hanh}` : '';
          gd += `    SRV${i}["🖥️ ${name}${os}"]\n`;
        });
        gd += `  end\n`;
        gd += `  CORE --> SRV\n\n`;
      }

      // ===== CAMERA =====
      if (cameras.length > 0) {
        gd += `  subgraph CAM["📹 Hệ thống Camera (${cameras.length} cam)"]\n`;
        gd += `    NVR["📼 Đầu ghi NVR"]\n`;
        cameras.forEach((c: any, i: number) => {
          const loc = c.vi_tri || `Cam ${i+1}`;
          gd += `    CAM${i}["📷 ${loc}"]\n`;
          gd += `    NVR -.- CAM${i}\n`;
        });
        gd += `  end\n`;
        gd += `  CORE --> NVR\n\n`;
      }

      // ===== DMZ (dự phòng) =====
      gd += `  subgraph DMZ["🛡️ DMZ Zone"]\n`;
      gd += `    DMZ_NOTE["Dự phòng mở rộng\\n(chưa đầu tư)"]\n`;
      gd += `  end\n`;
      gd += `  FW -.-> DMZ\n`;

      // Styling
      gd += `\n  classDef border fill:#1e3a5f,stroke:#4fc3f7,color:#fff\n`;
      gd += `  classDef fw fill:#d32f2f,stroke:#ef5350,color:#fff\n`;
      gd += `  classDef core fill:#1565c0,stroke:#42a5f5,color:#fff\n`;
      gd += `  classDef lan fill:#1b5e20,stroke:#66bb6a,color:#fff\n`;
      gd += `  classDef dmz fill:#4a148c,stroke:#ab47bc,color:#fff,stroke-dasharray: 5 5\n`;
      gd += `  class FW fw\n  class CORE core\n  class DMZ_NOTE dmz\n`;

      if (containerRef.current) {
        try {
          containerRef.current.innerHTML = '';
          const id = `mermaid-${Math.random().toString(36).substring(7)}`;
          const { svg } = await mermaid.render(id, gd);
          containerRef.current.innerHTML = svg;
        } catch (err) {
          console.error("Mermaid error:", err);
          containerRef.current.innerHTML = `<div class="text-gray-400 text-sm italic p-4 text-center">
            <p>💡 Sơ đồ mạng tự động sẽ hiển thị khi bạn điền thông tin tại:</p>
            <p class="text-indigo-400 mt-1">Tab II (Hạ tầng & Mạng) → Kết nối Internet, Thiết bị mạng, Camera</p>
          </div>`;
        }
      }
    };
    renderDiagram();
  }, [data]);

  return <div ref={containerRef} className="mermaid-container flex justify-center w-full overflow-x-auto" />;
}
