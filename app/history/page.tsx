'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Clock, Search, ChevronRight, Loader2, Database } from 'lucide-react';
import { getHistory, type DetectionResult } from '@/lib/firestore';

export default function HistoryPage() {
  const [history, setHistory] = useState<DetectionResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getHistory();
        setHistory(data);
      } catch (err) {
        console.error("Error loading history:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="flex-1 flex flex-col container mx-auto max-w-4xl px-4 py-12">
      
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
        <div>
           <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-primary transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" /> Beranda
          </Link>
          <h1 className="text-3xl font-bold tracking-tighter">Riwayat Deteksi</h1>
          <p className="text-slate-500 mt-2">Daftar analisis kesegaran daging yang pernah anda lakukan sebelumnya.</p>
        </div>
        
        <div className="relative w-full sm:w-64 shrink-0">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Cari riwayat..." 
            className="w-full pl-9 pr-4 py-2.5 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)]"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] overflow-hidden">
        
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center">
             <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
             <p className="text-slate-500 font-medium animate-pulse">Memuat riwayat...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center text-center px-4">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-6">
              <Database className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold mb-3 tracking-tight">Belum ada riwayat</h2>
            <p className="text-slate-500 mb-8 max-w-sm leading-relaxed">
              Anda belum melakukan deteksi kualitas daging. Hasil deteksi Anda akan otomatis tersimpan di sini.
            </p>
            <Link 
              href="/upload" 
              className="bg-primary text-white px-8 py-3.5 rounded-md font-semibold hover:opacity-90 transition-opacity"
            >
              Mulai Deteksi Sekarang
            </Link>
          </div>
        ) : (
          <>
            <div className="divide-y divide-slate-200">
              {history.map((item) => (
                <Link key={item.id} href={`/result/${item.id}`} className="flex flex-col sm:flex-row items-center gap-6 p-6 hover:bg-slate-50 transition-colors group">
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-slate-50 shrink-0 border border-slate-200">
                     <Image 
                        src={item.imageUrl || "https://picsum.photos/seed/chicken/200/200"} 
                        alt="Thumbnail" 
                        fill 
                        className="object-cover" 
                        referrerPolicy="no-referrer"
                      />
                  </div>
                  
                  <div className="flex-1 min-w-0 flex flex-col items-center sm:items-start text-center sm:text-left">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${item.label === 'fresh' ? 'bg-fresh' : 'bg-rotten'}`}></span>
                      <span className={`font-semibold text-lg tracking-tighter ${item.label === 'fresh' ? 'text-fresh' : 'text-rotten'}`}>
                        {item.label === 'fresh' ? 'Segar' : 'Tidak Segar'}
                      </span>
                      <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-medium">
                        {(item.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                     <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Clock className="w-3.5 h-3.5 shrink-0" />
                        <span>{item.createdAt.toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZoneName: 'short' })}</span>
                     </div>
                  </div>
                  
                  <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-slate-50 border border-slate-200 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/10 transition-colors">
                     <ChevronRight className="w-5 h-5" />
                  </div>
                </Link>
              ))}
            </div>
            
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-center text-sm font-medium text-slate-500">
              Menampilkan {history.length} deteksi
            </div>
          </>
        )}
      </div>
      
    </div>
  );
}
