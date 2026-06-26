'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UploadCloud, Image as ImageIcon, ArrowLeft, Loader2 } from 'lucide-react';
import { mockClassify } from '@/lib/mockInference';
import { getInsight, validateImage } from '@/lib/gemini';
import { saveDetection } from '@/lib/firestore';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const [errorModal, setErrorModal] = useState<{ title: string; message: string } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setIsLoading(true);
    setLoadingText('Memverifikasi gambar...');
    
    try {
      const validation = await validateImage(file);
      if (!validation.isMeat) {
        setErrorModal({ title: "Gambar Ditolak", message: validation.reason });
        setIsLoading(false);
        setFile(null);
        return;
      }

      setLoadingText('Menganalisis gambar...');
      const { label, confidence } = await mockClassify(file);
      
      setLoadingText('Menghasilkan insight AI...');
      const insight = await getInsight(label, confidence);

      setLoadingText('Menyimpan hasil...');
      const docId = await saveDetection({
        label,
        confidence,
        insight,
        imageFile: file,
      });

      router.push(`/result/${docId}`);
    } catch (error) {
      console.error(error);
      setErrorModal({ title: "Terjadi Kesalahan", message: "Terjadi kesalahan saat memproses gambar." });
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col container mx-auto max-w-3xl px-4 py-12 md:py-24">
      
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-primary transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" /> Kembali
        </Link>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Unggah Gambar Daging</h1>
        <p className="text-slate-500">
          Pilih atau foto langsung daging yang ingin Anda periksa. AI kami akan menganalisis kesegarannya dalam hitungan detik.
        </p>
      </div>

      <div 
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="border border-dashed border-slate-300 rounded-2xl bg-white p-12 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)]"
      >
        {!file && !isLoading ? (
          <>
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
              <UploadCloud className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Seret dan lepas gambar di sini</h3>
            <p className="text-sm text-slate-500 mb-6 max-w-sm">
              Format yang didukung: JPG, PNG. Ukuran maksimal 5MB.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <input 
                type="file" 
                accept="image/jpeg, image/png" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="bg-primary text-white px-6 py-3 rounded-md font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <ImageIcon className="w-4 h-4" />
                Pilih dari Galeri
              </button>
            </div>
          </>
        ) : isLoading ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
             <Loader2 className="w-12 h-12 animate-spin text-primary" />
             <p className="text-lg font-medium animate-pulse">{loadingText}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-6">
             <div className="flex items-center justify-center w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full shadow-sm mb-2">
                 <ImageIcon className="w-10 h-10" />
             </div>
             <div>
                <h3 className="text-xl font-semibold mb-1">Gambar Siap Dianalisis</h3>
                <p className="text-slate-500">{file?.name}</p>
             </div>
             
             <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mt-4">
                 <button 
                   onClick={() => setFile(null)}
                   className="px-6 py-3 rounded-md font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                 >
                   Ganti Gambar
                 </button>
                 <button 
                   onClick={handleAnalyze}
                   className="bg-primary text-white px-8 py-3 rounded-md font-semibold hover:opacity-90 transition-opacity whitespace-nowrap shadow-md shadow-primary/20"
                 >
                   Deteksi Sekarang
                 </button>
             </div>
          </div>
        )}
      </div>

      {/* Placeholder info */}
      <div className="mt-8 bg-primary/5 text-slate-700 p-4 rounded-xl text-sm border border-primary/10 flex gap-3">
        <span className="text-xl shrink-0">💡</span>
        <p className="leading-relaxed">
          <strong>Tip Pengambilan Gambar:</strong> Pastikan pencahayaan cukup dan daging memenuhi mayoritas frame (fokus pada tekstur dan warna daging). Hindari permukaan yang terlalu mengkilap karena pantulan cahaya.
        </p>
      </div>
      
      {errorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 text-center animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">{errorModal.title}</h3>
            <p className="text-slate-500 mb-6">{errorModal.message}</p>
            <button 
              onClick={() => setErrorModal(null)}
              className="w-full bg-slate-900 text-white rounded-md py-3 font-medium hover:bg-slate-800 transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
