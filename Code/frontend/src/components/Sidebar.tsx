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
  Users,
  Menu,
  X as CloseIcon,
} from "lucide-react";
import { useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  
  const navItems = [
    { href: "/", label: "Tổng quan", icon: LayoutDashboard },
    { href: "/survey/new", label: "Tạo Hồ sơ", icon: FilePlus },
    { href: "/staff", label: "Quản lý Nhân sự", icon: Users },
    { href: "#", label: "Sơ đồ mạng", icon: Network },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2.5 bg-indigo-600 rounded-lg lg:hidden shadow-lg shadow-indigo-600/20"
      >
        <Menu className="w-5 h-5 text-white" />
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`sidebar ${isOpen ? "mobile-open" : ""}`}>
        <div className="flex items-center justify-between lg:block mb-8">
          <div className="sidebar-logo !mb-0 lg:!mb-8 !p-0">
            <div className="logo-icon">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="logo-text">ATTT Survey</div>
              <div className="logo-sub">An toàn Thông tin</div>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 text-gray-400 hover:text-white lg:hidden"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link ${pathname === item.href ? "active" : ""}`}
              onClick={() => setIsOpen(false)}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="mt-auto pt-4 border-t border-gray-800">
          <Link href="#" className="nav-link" onClick={() => setIsOpen(false)}>
            <Settings className="w-4 h-4" /> Cài đặt
          </Link>
          <Link href="#" className="nav-link" onClick={() => setIsOpen(false)}>
            <HelpCircle className="w-4 h-4" /> Trợ giúp
          </Link>
        </div>
      </aside>
    </>
  );
}
