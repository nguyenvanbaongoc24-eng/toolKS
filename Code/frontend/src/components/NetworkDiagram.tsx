import React, { useEffect, useRef } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'loose',
});

export default function NetworkDiagram({ data }: { data: any }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const renderDiagram = async () => {
      let graphDef = "graph TD\n  Internet((Internet))\n";
      
      const isp = data?.ket_noi_internet?.nha_cung_cap || "ISP";
      graphDef += `  ISP[${isp}]\n  Internet --> ISP\n`;
      
      const routerNode = "CoreRouter";
      graphDef += `  CoreRouter{Router/Firewall}\n  ISP --> CoreRouter\n`;
      
      const may_chu = data?.may_chu || [];
      if (may_chu.length > 0) {
        graphDef += "  subgraph Máy_Chủ[Hệ thống Máy chủ]\n";
        may_chu.forEach((srv: any, idx: number) => {
          if (srv.ten) graphDef += `    S${idx}[${srv.ten}]\n`;
        });
        graphDef += "  end\n  CoreRouter --> Máy_Chủ\n";
      }

      const thiet_bi = data?.thiet_bi_mang || [];
      if (thiet_bi.length > 0) {
        graphDef += "  subgraph Thiết_Bị_Mạng[Các thiết bị khác]\n";
        thiet_bi.forEach((tb: any, idx: number) => {
          if (tb.loai_thiet_bi) graphDef += `    N${idx}[${tb.loai_thiet_bi}]\n`;
        });
        graphDef += "  end\n  CoreRouter -.-> Thiết_Bị_Mạng\n";
      }
      
      if (containerRef.current) {
        try {
          containerRef.current.innerHTML = '';
          const { svg } = await mermaid.render(`mermaid-${Math.random().toString(36).substring(7)}`, graphDef);
          containerRef.current.innerHTML = svg;
        } catch (err) {
          console.error("Mermaid error:", err);
          containerRef.current.innerHTML = '<span class="text-red-400 text-sm italic">Sơ đồ sẽ xuất hiện khi có đủ dữ liệu máy chủ hoặc thiết bị mạng.</span>';
        }
      }
    };
    renderDiagram();
  }, [data]);

  return <div ref={containerRef} className="mermaid-container flex justify-center w-full" />;
}
