"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FilePlus,
  Shield,
  Network,
  Settings,
  HelpCircle,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  
  const navItems = [
    { href: "/", label: "Tổng quan", icon: LayoutDashboard },
    { href: "/survey/new", label: "Tạo Hồ sơ", icon: FilePlus },
    { href: "#", label: "Sơ đồ mạng", icon: Network },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="logo-text">ATTT Survey</div>
          <div className="logo-sub">An toàn Thông tin</div>
        </div>
      </div>
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-link ${pathname === item.href ? "active" : ""}`}
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="mt-auto pt-4 border-t border-gray-800">
        <Link href="#" className="nav-link">
          <Settings className="w-4 h-4" /> Cài đặt
        </Link>
        <Link href="#" className="nav-link">
          <HelpCircle className="w-4 h-4" /> Trợ giúp
        </Link>
      </div>
    </aside>
  );
}
