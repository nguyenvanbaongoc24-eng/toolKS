import os
import networkx as nx
import matplotlib
matplotlib.use('Agg') # Headless backend
import matplotlib.pyplot as plt
import logging

logger = logging.getLogger(__name__)

class DiagramGenerator:
    def __init__(self, output_dir="generated_docs/diagrams"):
        self.output_dir = output_dir
        if not os.path.exists(self.output_dir):
            os.makedirs(self.output_dir, exist_ok=True)
            
    def generate_network_topology(self, data: dict, filename: str) -> str:
        """
        Generates a logical network topology diagram based on the survey data.
        Returns the absolute path to the generated PNG diagram.
        """
        plt.figure(figsize=(10, 8))
        G = nx.DiGraph()
        
        # Parse data
        isps = data.get('ket_noi_internet', [])
        firewall_type = data.get('E2_firewall_type', '')
        devices = data.get('thiet_bi_mang', [])
        servers = data.get('may_chu', [])
        cameras = data.get('camera', [])
        
        has_firewall = "phần cứng chuyên dụng" in str(firewall_type).lower() or "phần mềm" in str(firewall_type).lower()
        
        # Nodes and colors
        node_colors = []
        labels = {}
        
        # 1. Internet
        G.add_node("Internet")
        node_colors.append("lightblue")
        labels["Internet"] = "Internet"
        
        # 2. Modems / ISP
        modems = []
        if isps:
            for i, isp in enumerate(isps):
                node_id = f"ISP_{i}"
                G.add_node(node_id)
                modems.append(node_id)
                labels[node_id] = f"{isp.get('nha_cung_cap', 'ISP')}\n({isp.get('bang_thong', '')})"
                node_colors.append("lightgreen")
                G.add_edge("Internet", node_id)
        else:
            G.add_node("Modem")
            modems.append("Modem")
            labels["Modem"] = "Router/Modem\nNhà mạng"
            node_colors.append("lightgreen")
            G.add_edge("Internet", "Modem")
            
        # 3. Firewall
        if has_firewall:
            G.add_node("Firewall")
            labels["Firewall"] = "Firewall\nBảo mật"
            node_colors.append("salmon")
            for m in modems:
                G.add_edge(m, "Firewall")
            core_parent = "Firewall"
        else:
            core_parent = modems[0] if modems else "Internet"
            
        # 4. Core Switch
        G.add_node("CoreSwitch")
        labels["CoreSwitch"] = "Core Switch"
        node_colors.append("orange")
        G.add_edge(core_parent, "CoreSwitch")
        
        # 5. Access Switches and Devices
        # Group by location or type
        access_switches = {}
        for dev in devices:
            if dev.get('loai_thiet_bi', '') == 'Switch':
                loc = dev.get('vi_tri', 'LAN')
                if loc not in access_switches:
                    sw_id = f"SW_{len(access_switches)}"
                    access_switches[loc] = sw_id
                    G.add_node(sw_id)
                    labels[sw_id] = f"Switch\n{loc}"
                    node_colors.append("gold")
                    G.add_edge("CoreSwitch", sw_id)
                    
        # If no explicit switches were found in data but we have other LAN zones
        if not access_switches:
            G.add_node("SW_LAN")
            access_switches["LAN"] = "SW_LAN"
            labels["SW_LAN"] = "Switch Nội bộ"
            node_colors.append("gold")
            G.add_edge("CoreSwitch", "SW_LAN")
            
        # 6. Wifi APs
        G.add_node("Wifi")
        labels["Wifi"] = "WiFi APs"
        node_colors.append("lightgray")
        G.add_edge("CoreSwitch", "Wifi")
            
        # 7. Servers
        if servers:
            G.add_node("Servers")
            labels["Servers"] = f"Máy chủ\n({len(servers)} node)"
            node_colors.append("plum")
            G.add_edge("CoreSwitch", "Servers")
            
        # 8. Cameras
        if cameras:
            G.add_node("NVR")
            labels["NVR"] = "Đầu ghi NVR"
            node_colors.append("lightpink")
            G.add_edge("CoreSwitch", "NVR")
            
            G.add_node("Cameras")
            labels["Cameras"] = f"Camera\n({len(cameras)} node)"
            node_colors.append("lightpink")
            G.add_edge("NVR", "Cameras")
            
        # 9. Workstations (implicit)
        # People using internal app
        users = data.get('C5_noi_bo', '0')
        G.add_node("Users")
        labels["Users"] = f"Người dùng\n({users} User)"
        node_colors.append("lightcyan")
        # Attach to first access switch
        first_sw = list(access_switches.values())[0] if access_switches else "CoreSwitch"
        G.add_edge(first_sw, "Users")
        
        # Layout
        pos = nx.spring_layout(G, k=1.5, seed=42)
        
        # Draw
        nx.draw(G, pos,
                with_labels=False,
                node_color=node_colors,
                node_size=3500,
                font_size=9,
                font_weight='bold',
                arrows=True,
                arrowsize=20,
                arrowstyle='->',
                width=2,
                edge_color='gray')
                
        # Custom label drawing to prevent overlap
        nx.draw_networkx_labels(G, pos, labels, font_size=9, font_family="sans-serif")
        
        plt.title(f"Sơ đồ Mạng - Hệ thống {data.get('he_thong_thong_tin', 'Unknown')}", pad=20, fontsize=12)
        plt.margins(0.15)
        
        out_path = os.path.join(self.output_dir, filename)
        plt.savefig(out_path, format="png", bbox_inches='tight', dpi=150)
        plt.close()
        
        logger.info(f"Generated network topology diagram: {out_path}")
        return out_path
