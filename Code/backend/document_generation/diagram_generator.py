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
            
    def generate_logical_diagram(self, data: dict, filename: str) -> str:
        """
        Generates a hierarchical logical topology diagram.
        Matches the 'condensed' requirement (rút gọn nếu thiếu thông tin).
        Layout: Internet -> (LB) -> (Firewall) -> Core Switch -> VLAN Zones
        """
        plt.figure(figsize=(12, 10))
        G = nx.DiGraph()
        
        # 1. Parsing and Layer mapping
        # Layers: 0: Internet, 1: WAN Edge (LB/FW), 2: Core, 3: Zones
        layers = {}
        
        # Layer 0: Internet
        G.add_node("Internet", layer=0, label="Internet", color="lightblue")
        
        # Layer 1: Edge (Conditional)
        last_nodes = ["Internet"]
        
        isps = data.get('ket_noi_internet', [])
        if len(isps) > 1:
            G.add_node("LB", layer=1, label="Cân bằng tải\n(Multi-WAN)", color="lightgreen")
            for n in last_nodes: G.add_edge(n, "LB")
            last_nodes = ["LB"]
            
        firewall_type = data.get('E2_firewall_type', '')
        if "phần cứng" in str(firewall_type).lower():
            G.add_node("Firewall", layer=1, label="Firewall\nPhần cứng", color="salmon")
            for n in last_nodes: G.add_edge(n, "Firewall")
            last_nodes = ["Firewall"]
        elif "phần mềm" in str(firewall_type).lower():
            G.add_node("Firewall", layer=1, label="Firewall\nPhần mềm", color="salmon")
            for n in last_nodes: G.add_edge(n, "Firewall")
            last_nodes = ["Firewall"]
            
        # Layer 2: Core
        G.add_node("Core", layer=2, label="Core Switch", color="orange")
        for n in last_nodes: G.add_edge(n, "Core")
        
        # Layer 3: Enterprise Zones (Logical)
        zones = []
        # Server Zone
        if data.get('may_chu') and len(data.get('may_chu')) > 0:
            G.add_node("ServerZone", layer=3, label=f"Vùng Máy chủ\n({len(data.get('may_chu'))} SV)", color="plum")
            G.add_edge("Core", "ServerZone")
            
        # Camera Zone
        if data.get('camera') and len(data.get('camera')) > 0:
            G.add_node("CamZone", layer=3, label=f"Vùng Camera\n({len(data.get('camera'))} Cam)", color="lightpink")
            G.add_edge("Core", "CamZone")
            
        # Internal Zone
        G.add_node("UserZone", layer=3, label=f"Vùng Người dùng\n({data.get('C5_noi_bo', 0)} User)", color="lightcyan")
        G.add_edge("Core", "UserZone")
        
        # Wifi Zone
        if "không có" not in str(data.get('T1_2_wifi_tach_rieng', '')).lower():
            G.add_node("WifiZone", layer=3, label="Vùng WiFi", color="wheat")
            G.add_edge("Core", "WifiZone")

        # 2. Rendering
        # Use multipartite layout for hierarchical structure
        pos = nx.multipartite_layout(G, subset_key="layer", align='horizontal')
        
        node_colors = [G.nodes[n]['color'] for n in G.nodes]
        labels = {n: G.nodes[n]['label'] for n in G.nodes}
        
        nx.draw(G, pos, with_labels=False, node_color=node_colors, 
                node_size=6000, arrows=True, width=2, edge_color='gray')
        nx.draw_networkx_labels(G, pos, labels, font_size=9, font_weight='bold')
        
        plt.title(f"SƠ ĐỒ TOPOLOGY LOGIC - {data.get('ten_don_vi', 'ĐƠN VỊ')}", pad=30, fontsize=14, fontweight='bold')
        
        out_path = os.path.join(self.output_dir, filename)
        plt.savefig(out_path, format="png", bbox_inches='tight', dpi=300)
        plt.close()
        return out_path

    def generate_physical_diagram(self, data: dict, filename: str) -> str:
        """
        Generates a physical diagram showing floor/rack distribution.
        Layout: ISP -> Gate -> Rack -> Floors
        """
        plt.figure(figsize=(12, 12))
        G = nx.DiGraph()
        
        # Layers: 0: WAN, 1: Gate/Rack, 2: Access, 3: Endnodes
        G.add_node("ISP", layer=0, label="ISP Gateway", color="lightblue")
        
        # Rack/Center
        G.add_node("Rack", layer=1, label=f"Tủ Rack Trung tâm\n({data.get('T3_1_rack_vi_tri', 'Phòng máy')})", color="lightgray")
        G.add_edge("ISP", "Rack")
        
        # Switches per Floor (Physical grouping)
        switches = data.get('thiet_bi_mang', [])
        floors = {} # floor -> [switches]
        for sw in switches:
            if str(sw.get('loai_thiet_bi')).lower() == 'switch':
                loc = sw.get('vi_tri', 'Tầng 1')
                if loc not in floors: floors[loc] = []
                floors[loc].append(sw.get('model', 'Switch'))
        
        if not floors:
            floors = {"Khu vực LAN": ["Switch chính"]}
            
        for i, (floor_name, sw_list) in enumerate(floors.items()):
            floor_id = f"Floor_{i}"
            G.add_node(floor_id, layer=2, label=f"{floor_name}\n({len(sw_list)} Switch)", color="gold")
            G.add_edge("Rack", floor_id)
            
            # End devices per floor (Representative)
            end_id = f"Devices_{i}"
            G.add_node(end_id, layer=3, label="Máy trạm & TB", color="#f0f0f0")
            G.add_edge(floor_id, end_id)

        pos = nx.multipartite_layout(G, subset_key="layer", align='horizontal')
        node_colors = [G.nodes[n]['color'] for n in G.nodes]
        labels = {n: G.nodes[n]['label'] for n in G.nodes}
        
        nx.draw(G, pos, with_labels=False, node_color=node_colors, 
                node_size=6000, arrows=True, width=1.5, edge_color='#666666')
        nx.draw_networkx_labels(G, pos, labels, font_size=8)
        
        plt.title(f"SƠ ĐỒ TOPOLOGY VẬT LÝ - {data.get('ten_don_vi', 'ĐƠN VỊ')}", pad=30, fontsize=14, fontweight='bold')
        
        out_path = os.path.join(self.output_dir, filename)
        plt.savefig(out_path, format="png", bbox_inches='tight', dpi=300)
        plt.close()
        return out_path
