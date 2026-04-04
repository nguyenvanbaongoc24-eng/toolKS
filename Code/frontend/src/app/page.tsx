"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import Sidebar from "@/components/Sidebar";
import { FileText, Plus, TrendingUp, Users, Server, Wifi, Clock, ArrowRight, Edit3, Check, X, Share2, Download, ExternalLink } from "lucide-react";

export default function Home() {
  const [records, setRecords] = useState<any[]>([]);
  const [availableStaff, setAvailableStaff] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<any>({});

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [recRes, staffRes] = await Promise.all([
        axios.get(`${API_URL}/api/surveys`),
        axios.get(`${API_URL}/api/staff`)
      ]);
      setRecords(recRes.data);
      setAvailableStaff(staffRes.data);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (rec: any) => {
    setEditingId(rec.id);
    setEditForm({ ...rec });
  };

  const saveEdit = async () => {
    try {
      await axios.post(`${API_URL}/api/surveys`, {
        id: editingId,
        ten_don_vi: editForm.ten_don_vi,
        doer: editForm.doer,
        status: editForm.status,
        date: editForm.date,
        data: editForm.data || {}
      });
      setEditingId(null);
      fetchData(); // Refresh list
    } catch (err) {
      alert("Lỗi lưu hồ sơ!");
    }
  };

  const router = useRouter();

  const handleOpenSurvey = (rec: any) => {
    const mockData = {
      ten_don_vi: rec.ten_don_vi,
      nguoi_thuc_hien: rec.doer,
      he_thong_thong_tin: "Hệ thống Demo từ Dashboard"
    };
    localStorage.setItem("survey_profiler_draft", JSON.stringify(mockData));
    router.push("/survey/new");
  };

  const handleDownloadWord = async (rec: any) => {
     try {
       const mockData = { ten_don_vi: rec.ten_don_vi, nguoi_thuc_hien: rec.doer, he_thong_thong_tin: "Hệ thống Demo" };
       const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
       const response = await axios.post(`${apiUrl}/api/generate-report`, { data: mockData }, { responseType: 'blob' });
       const url = window.URL.createObjectURL(new Blob([response.data]));
       const link = document.createElement('a');
       link.href = url;
       link.setAttribute('download', `HoSoATTT_${rec.ten_don_vi.replace(/\s+/g, '')}.docx`);
       document.body.appendChild(link);
       link.click();
       document.body.removeChild(link);
     } catch (e) {
       alert("Lỗi tải báo cáo Word trên máy chủ từ xa!");
     }
  };

  const handleShare = async (rec: any) => {
      const shareData = {
        title: 'Hồ sơ Khảo sát ATTT',
        text: `Hồ sơ: ${rec.ten_don_vi}\nTrạng thái: ${rec.status}\nNgười phụ trách: ${rec.doer}\n\nChi tiết tại Cổng quản lý:`,
        url: window.location.origin
      };
      if (navigator.share) {
         try {
           await navigator.share(shareData);
         } catch (err) {}
      } else {
         alert("Trình duyệt không hỗ trợ Web Share API. Bạn sử dụng trên điện thoại để có hiệu quả tốt nhất.");
      }
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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
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
                        <td className="px-6 py-4">
                          <select className="bg-black/50 border border-white/20 rounded px-2 py-1 outline-none focus:border-indigo-500 w-full max-w-[120px]" value={editForm.doer} onChange={e => setEditForm({...editForm, doer: e.target.value})}>
                            <option value="">-- Chọn --</option>
                            {availableStaff.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
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
                        <td className="px-6 py-4 text-right flex justify-end gap-1">
                          <button onClick={() => handleShare(rec)} className="text-gray-400 hover:text-blue-400 transition-colors p-1" title="Chia sẻ nền tảng"><Share2 className="w-4 h-4"/></button>
                          <button onClick={() => handleDownloadWord(rec)} className="text-gray-400 hover:text-emerald-400 transition-colors p-1" title="Tải & Xem bản Word"><Download className="w-4 h-4"/></button>
                          <button onClick={() => handleOpenSurvey(rec)} className="text-gray-400 hover:text-indigo-400 transition-colors p-1" title="Vào trang sửa Full Data"><ExternalLink className="w-4 h-4"/></button>
                          <button onClick={() => startEdit(rec)} className="text-gray-400 hover:text-amber-400 transition-colors p-1 border-l border-gray-700 ml-1 pl-2" title="Sửa nhanh thông tin tĩnh"><Edit3 className="w-4 h-4"/></button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* MOBILE CARDS VIEW */}
        <div className="block md:hidden mb-24">
          <h2 className="font-semibold flex items-center gap-2 mb-4 text-white px-2">
            <Clock className="w-4 h-4 text-indigo-400" /> Hồ sơ gần đây
          </h2>
          <div className="space-y-4 px-2">
            {records.map((rec) => (
              <div key={rec.id} className="bg-gray-900/80 border border-gray-800 rounded-xl p-4 shadow-lg relative">
                {editingId === rec.id ? (
                  <div className="space-y-3">
                     <div><label className="text-xs text-gray-500 mb-1 block">Tên đơn vị</label><input className="bg-black/50 border border-white/20 rounded px-2 py-2 outline-none focus:border-indigo-500 w-full" value={editForm.ten_don_vi} onChange={e => setEditForm({...editForm, ten_don_vi: e.target.value})} /></div>
                     <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">Người thực hiện</label>
                          <select className="bg-black/50 border border-white/20 rounded px-2 py-2 outline-none focus:border-indigo-500 w-full" value={editForm.doer} onChange={e => setEditForm({...editForm, doer: e.target.value})}>
                            <option value="">-- Chọn --</option>
                            {availableStaff.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                        <div><label className="text-xs text-gray-500 mb-1 block">Trạng thái</label><select className="bg-black/50 border border-white/20 rounded px-2 py-2 outline-none focus:border-indigo-500 w-full" value={editForm.status} onChange={e => setEditForm({...editForm, status: e.target.value})}><option value="Hoàn thành">Hoàn thành</option><option value="Đang chờ">Đang chờ</option></select></div>
                     </div>
                     <div className="flex gap-2 pt-2">
                        <button onClick={saveEdit} className="flex-1 bg-emerald-500/20 text-emerald-400 py-2 rounded-lg flex items-center justify-center gap-1"><Check className="w-4 h-4"/> Lưu</button>
                        <button onClick={() => setEditingId(null)} className="flex-1 bg-rose-500/20 text-rose-400 py-2 rounded-lg flex items-center justify-center gap-1"><X className="w-4 h-4"/> Hủy</button>
                     </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-white pr-8">{rec.ten_don_vi}</h3>
                      <button onClick={() => startEdit(rec)} className="absolute top-4 right-4 text-gray-400 hover:text-indigo-400 p-2 bg-black/30 rounded-md"><Edit3 className="w-4 h-4"/></button>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3 mt-1">
                      <span className={`text-xs px-2 py-1 rounded-md border ${rec.status === 'Hoàn thành' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'}`}>
                        {rec.status}
                      </span>
                      <span className="text-xs px-2 py-1 bg-indigo-500/10 text-indigo-300 rounded-md border border-indigo-500/30 font-medium">@ {rec.doer}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-400 border-t border-gray-800/50 pt-3 mt-2">
                       <div className="flex gap-3">
                         <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {rec.date}</span>
                         <span className="flex items-center gap-1"><Server className="w-3 h-3"/> {rec.devices}</span>
                       </div>
                       <div className="flex gap-2">
                         <button onClick={() => handleShare(rec)} className="text-gray-400 active:text-blue-400 p-1 bg-black/30 rounded-md"><Share2 className="w-4 h-4"/></button>
                         <button onClick={() => handleDownloadWord(rec)} className="text-gray-400 active:text-emerald-400 p-1 bg-black/30 rounded-md"><Download className="w-4 h-4"/></button>
                         <button onClick={() => handleOpenSurvey(rec)} className="text-gray-400 active:text-indigo-400 p-1 bg-black/30 rounded-md"><ExternalLink className="w-4 h-4"/></button>
                       </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
