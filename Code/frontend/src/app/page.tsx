"use client";

import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import { FileText, Plus, TrendingUp, Users, Server, Wifi, Clock, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="main-content">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">Tổng quan Hệ thống</h1>
            <p className="text-sm text-gray-400 mt-1">Quản lý hồ sơ khảo sát an toàn thông tin nội bộ</p>
          </div>
          <Link href="/survey/new" className="btn-primary">
            <Plus className="w-4 h-4" /> Tạo Hồ sơ Mới
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <div className="stat-card indigo">
            <div className="stat-value">3</div>
            <div className="stat-label">Tổng hồ sơ</div>
          </div>
          <div className="stat-card cyan">
            <div className="stat-value">44</div>
            <div className="stat-label">Thiết bị quản lý</div>
          </div>
          <div className="stat-card emerald">
            <div className="stat-value">2</div>
            <div className="stat-label">Hoàn thành</div>
          </div>
          <div className="stat-card rose">
            <div className="stat-value">1</div>
            <div className="stat-label">Đang chờ</div>
          </div>
        </div>

        <div className="glass-card mb-8">
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-800">
            <h2 className="font-semibold flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" /> Hồ sơ gần đây
            </h2>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Tên đơn vị</th>
                <th>Ngày tạo</th>
                <th>Thiết bị</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-medium">Sở Thông tin và Truyền thông</td>
                <td>03/04/2026</td>
                <td>12 thiết bị</td>
                <td><span className="badge badge-success">Hoàn thành</span></td>
              </tr>
              <tr>
                <td className="font-medium">UBND Quận 1</td>
                <td>02/04/2026</td>
                <td>8 thiết bị</td>
                <td><span className="badge badge-pending">Đang chờ</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
