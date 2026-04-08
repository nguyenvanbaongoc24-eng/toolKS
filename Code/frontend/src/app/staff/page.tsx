"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { Users, Plus, Trash2, Edit3, Check, X, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";
import axios from "axios";

export default function StaffPage() {
  const [staff, setStaff] = useState<string[]>([]);
  const [newStaff, setNewStaff] = useState("");
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [loading, setLoading] = useState(true);

  const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/$/, '');
  // Force redeploy to sync env vars

  // Load from API on mount
  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/staff`);
      setStaff(res.data);
    } catch (err) {
      console.error("Error fetching staff:", err);
    } finally {
      setLoading(false);
    }
  };

  const saveToBackend = async (newList: string[]) => {
    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/api/staff`, newList);
      if (res.data.status === "error") {
        throw new Error(res.data.message);
      }
      setStaff(newList);
      localStorage.setItem("survey_doers", JSON.stringify(newList));
    } catch (err: any) {
      console.error("Full error:", err);
      const status = err.response?.status;
      const msg = err.response?.data?.detail || err.message || "Unknown Error";
      alert(`Lỗi đồng bộ với Database!\n\nChi tiết: [${status || 'Network Error'}] ${msg}\n\n- Kiểm tra xem Backend đã khởi động chưa.\n- Kiểm tra xem đã chạy SQL tạo bảng chưa.`);
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async () => {
    try {
      const res = await axios.get(`${API_URL}/`);
      alert(`Kết nối Backend: OK!\nĐồng bộ DB: ${res.data.sync ? "SẴN SÀNG" : "CHƯA CẤU HÌNH"}`);
    } catch (err: any) {
      alert(`Lỗi kết nối Backend tại: ${API_URL}\nChi tiết: ${err.message}`);
    }
  };

  const addStaff = () => {
    if (!newStaff.trim()) return;
    if (staff.includes(newStaff.trim())) {
      alert("Tên này đã tồn tại!");
      return;
    }
    const newList = [...staff, newStaff.trim()];
    saveToBackend(newList);
    setNewStaff("");
  };

  const deleteStaff = (idx: number) => {
    if (confirm(`Bạn có chắc muốn xóa nhân sự "${staff[idx]}"?`)) {
      const newList = staff.filter((_, i) => i !== idx);
      saveToBackend(newList);
    }
  };

  const startEdit = (idx: number) => {
    setEditingIdx(idx);
    setEditValue(staff[idx]);
  };

  const saveEdit = () => {
    if (!editValue.trim()) return;
    const newList = [...staff];
    newList[editingIdx!] = editValue.trim();
    saveToBackend(newList);
    setEditingIdx(null);
  };

  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="main-content max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Users className="w-6 h-6 text-indigo-400" /> Quản lý Nhân sự
              </h1>
              <p className="text-sm text-gray-400 mt-1">Đồng bộ dữ liệu Máy tính & Điện thoại</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={testConnection} 
              className="text-xs px-3 py-1.5 border border-indigo-500/30 text-indigo-400 rounded-lg hover:bg-indigo-500/10 transition-all font-medium"
            >
              Kiểm tra Kết nối
            </button>
            <button onClick={fetchStaff} className="p-2 hover:bg-white/5 rounded-lg text-gray-400" title="Làm mới">
              <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form thêm mới */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-400" /> Thêm nhân sự mới
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block uppercase tracking-wider font-semibold">Họ và tên</label>
                  <input 
                    type="text" 
                    value={newStaff} 
                    onChange={(e) => setNewStaff(e.target.value)}
                    placeholder="Nhập họ tên..."
                    className="form-input"
                    onKeyDown={(e) => e.key === 'Enter' && addStaff()}
                  />
                </div>
                <button 
                  onClick={addStaff}
                  disabled={loading}
                  className="btn-primary w-full justify-center py-3 disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" /> Thêm vào danh sách
                </button>
              </div>
            </div>
          </div>

          {/* Danh sách */}
          <div className="lg:col-span-2">
            <div className="glass-card overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-800 bg-white/5 font-semibold text-sm flex justify-between">
                <span>Danh sách cán bộ ({staff.length})</span>
                {loading && <span className="text-indigo-400 animate-pulse">Đang tải...</span>}
              </div>
              <div className="divide-y divide-gray-800">
                {staff.map((name, idx) => (
                  <div key={idx} className="flex items-center justify-between px-6 py-4 hover:bg-white/5 transition-colors group">
                    {editingIdx === idx ? (
                      <div className="flex items-center gap-2 flex-1 mr-4">
                         <input 
                          type="text" 
                          value={editValue} 
                          onChange={(e) => setEditValue(e.target.value)}
                          className="bg-black/50 border border-indigo-500/50 rounded px-3 py-1.5 outline-none w-full text-sm"
                          autoFocus
                          onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                        />
                        <button onClick={saveEdit} className="p-1.5 text-emerald-400 hover:bg-emerald-500/10 rounded-md transition-colors"><Check className="w-4 h-4" /></button>
                        <button onClick={() => setEditingIdx(null)} className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-md transition-colors"><X className="w-4 h-4" /></button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs uppercase">
                            {name.split(" ").pop()?.charAt(0)}
                          </div>
                          <span className="font-medium text-gray-200">{name}</span>
                        </div>
                        <div className="flex items-center gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => startEdit(idx)}
                            className="p-2 text-gray-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all"
                            title="Sửa tên"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => deleteStaff(idx)}
                            className="p-2 text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
                            title="Xóa nhân sự"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
                {!loading && staff.length === 0 && (
                  <div className="px-6 py-12 text-center text-gray-500 italic text-sm">
                    Chưa có nhân sự nào trong danh sách.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
