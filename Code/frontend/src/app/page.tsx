"use client";

import { useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import { FileText, Plus, TrendingUp, Users, Server, Wifi, Clock, ArrowRight, Edit3, Check, X } from "lucide-react";

export default function Home() {
  const [records, setRecords] = useState([
    { id: 1, ten_don_vi: "Sở Thông tin và Truyền thông", doer: "Bảo Ngọc", date: "03/04/2026", devices: "12 thiết bị", status: "Hoàn thành" },
    { id: 2, ten_don_vi: "UBND Quận 1", doer: "Minh Hùng", date: "02/04/2026", devices: "8 thiết bị", status: "Đang chờ" },
  ]);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<any>({});

  const startEdit = (rec: any) => {
    setEditingId(rec.id);
    setEditForm({ ...rec });
  };

  const saveEdit = () => {
    setRecords(records.map(r => r.id === editingId ? { ...editForm } : r));
    setEditingId(null);
  };

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

        <div className="glass-card mb-8 overflow-hidden hidden md:block">
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-800">
            <h2 className="font-semibold flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" /> Hồ sơ gần đây
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table w-full text-sm text-left">
              <thead>
                <tr>
                  <th className="px-6 py-4">Tên đơn vị</th>
                  <th className="px-6 py-4">Người thực hiện</th>
                  <th className="px-6 py-4">Ngày tạo</th>
                  <th className="px-6 py-4">Thiết bị</th>
                  <th className="px-6 py-4">Trạng thái</th>
                  <th className="px-6 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {records.map((rec) => (
                  <tr key={rec.id} className="border-b border-gray-800/50 hover:bg-white/5 transition-colors">
                    {editingId === rec.id ? (
                      <>
                        <td className="px-6 py-4 font-medium"><input className="bg-black/50 border border-white/20 rounded px-2 py-1 outline-none focus:border-indigo-500 w-full" value={editForm.ten_don_vi} onChange={e => setEditForm({...editForm, ten_don_vi: e.target.value})} /></td>
                        <td className="px-6 py-4"><input className="bg-black/50 border border-white/20 rounded px-2 py-1 outline-none focus:border-indigo-500 w-full max-w-[120px]" value={editForm.doer} onChange={e => setEditForm({...editForm, doer: e.target.value})} /></td>
                        <td className="px-6 py-4"><input className="bg-black/50 border border-white/20 rounded px-2 py-1 outline-none focus:border-indigo-500 w-full max-w-[120px]" value={editForm.date} onChange={e => setEditForm({...editForm, date: e.target.value})} /></td>
                        <td className="px-6 py-4">{rec.devices}</td>
                        <td className="px-6 py-4">
                           <select className="bg-black/50 border border-white/20 rounded px-2 py-1 outline-none focus:border-indigo-500" value={editForm.status} onChange={e => setEditForm({...editForm, status: e.target.value})}>
                             <option value="Hoàn thành">Hoàn thành</option>
                             <option value="Đang chờ">Đang chờ</option>
                           </select>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={saveEdit} className="text-emerald-400 hover:text-emerald-300 p-1"><Check className="w-5 h-5"/></button>
                          <button onClick={() => setEditingId(null)} className="text-rose-400 hover:text-rose-300 p-1"><X className="w-5 h-5"/></button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4 font-medium">{rec.ten_don_vi}</td>
                        <td className="px-6 py-4"><span className="text-xs px-2 py-1 bg-indigo-500/20 text-indigo-300 rounded-md border border-indigo-500/30">{rec.doer}</span></td>
                        <td className="px-6 py-4">{rec.date}</td>
                        <td className="px-6 py-4">{rec.devices}</td>
                        <td className="px-6 py-4">
                          <span className={`badge ${rec.status === 'Hoàn thành' ? 'badge-success' : 'badge-pending'}`}>
                            {rec.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => startEdit(rec)} className="text-gray-400 hover:text-indigo-400 transition-colors p-1"><Edit3 className="w-4 h-4"/></button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
