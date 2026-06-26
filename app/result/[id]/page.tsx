'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, AlertTriangle, RefreshCcw, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { getDetectionById, type DetectionResult } from '@/lib/firestore';

export default function ResultPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [data, setData] = useState<DetectionResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      if (!id) {
        if (isMounted) setLoading(false);
        return;
      }
      try {
        const result = await getDetectionById(id);
        if (isMounted) setData(result);
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    
    loadData();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="text-slate-500 font-medium animate-pulse">Memuat hasil...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex-1 flex flex-col container mx-auto max-w-xl px-4 py-24 items-center text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-6">
          <AlertTriangle className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold mb-3 tracking-tight">Data tidak ditemukan</h2>
        <p className="text-slate-500 mb-8 leading-relaxed">
          Kami tidak menemukan data hasil deteksi tersebut. Silakan periksa kembali tautan atau unggah gambar baru.
        </p>
        <Link 
          href="/upload" 
          className="bg-primary text-white px-8 py-3.5 rounded-md font-semibold hover:opacity-90 transition-opacity"
        >
          Mulai Deteksi Baru
        </Link>
      </div>
    );
  }

  const isFresh = data.label === 'fresh'; 
  const confidence = data.confidence;
  const insight = data.insight;
  const timestamp = data.createdAt.toLocaleString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZoneName: 'short'
  });

  return (
    <div className="flex-1 flex flex-col container mx-auto max-w-4xl px-4 py-12 md:py-16">
      <div className="mb-8">
        <Link href="/upload" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" /> Coba Gambar Lain
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
        {/* Gambar Area */}
        <div className="space-y-6">
          <div className="aspect-square relative rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)]">
             <Image 
                src={data.imageUrl || "https://picsum.photos/seed/chicken/600/600"} 
                alt="Gambar Analisis" 
                fill 
                className="object-cover" 
                referrerPolicy="no-referrer"
              />
          </div>
          
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 tracking-wider uppercase font-semibold mb-1">Status Analisis</p>
              <p className="text-sm font-medium">Selesai</p>
            </div>
          </div>
        </div>

        {/* Hasil Area */}
        <div className="space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-500 text-xs font-semibold tracking-wide uppercase mb-4">
              ID: {id}
            </div>
            
            <h1 className="text-4xl font-bold tracking-tighter mb-2">Hasil Deteksi</h1>
            <p className="text-slate-500 text-sm">Diproses pada {timestamp}</p>
          </div>

          {/* Cards Status */}
          <div className={`p-6 rounded-2xl border ${isFresh ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'} shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)]`}>
             <div className="flex items-start gap-4">
               <div className={`p-3 rounded-full ${isFresh ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'} shrink-0`}>
                 {isFresh ? <CheckCircle className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
               </div>
               <div>
                  <h3 className={`text-2xl font-bold mb-1 ${isFresh ? 'text-fresh' : 'text-rotten'}`}>
                    {isFresh ? 'Daging Segar' : 'Daging Tidak Segar'}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-4">
                    Berdasarkan analisis visual, tingkat probabilitas (confidence) daging ini {isFresh ? 'segar' : 'tidak segar'} adalah <strong>{(confidence * 100).toFixed(1)}%</strong>. 
                  </p>
                  <div className="space-y-1.5 mt-2">
                    <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${isFresh ? 'bg-emerald-500' : 'bg-red-500'}`} 
                        style={{ width: `${(confidence * 100).toFixed(1)}%` }}
                      ></div>
                    </div>
                    <div className={`font-medium text-sm ${isFresh ? 'text-fresh' : 'text-rotten'}`}>
                      Tingkat Kepercayaan: {(confidence * 100).toFixed(1)}%
                    </div>
                  </div>
               </div>
             </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)]">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="text-xl">✨</span> AI Insight
            </h3>
            <div className="space-y-4 text-sm text-slate-500 leading-relaxed">
               <div>
                  <h4 className="font-semibold text-slate-700 mb-1">Alasan:</h4>
                  <p>{insight.alasan}</p>
               </div>
               <div>
                  <h4 className="font-semibold text-slate-700 mb-1">Saran:</h4>
                  <p>{insight.saran}</p>
               </div>
            </div>
          </div>
          
          <div className="pt-4">
            <Link 
              href="/upload" 
              className="w-full flex items-center justify-center gap-2 bg-slate-800 text-white px-6 py-4 rounded-md font-semibold hover:bg-slate-700 transition-colors"
            >
              <RefreshCcw className="w-4 h-4" />
              Deteksi Sampel Baru
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
