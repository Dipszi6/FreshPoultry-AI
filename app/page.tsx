import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle2, ScanFace, Database, ShieldCheck, UploadCloud } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col flex-1 w-full relative">
      
      {/* Hero Section */}
      <section className="pt-24 pb-32 px-4 md:px-6 relative overflow-hidden">
        {/* Background Decorative Blob */}
        <div className="absolute top-0 right-0 -mr-32 -mt-32 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="container mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">
          <div className="flex-1 flex flex-col items-start gap-8 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase">
              <SparklesIcon className="w-3.5 h-3.5" />
              Didukung oleh Computer Vision
            </div>
            <h1 className="text-5xl md:text-6xl font-bold leading-[1.1] tracking-tighter">
              Deteksi Kesegaran <span className="text-primary">Daging</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-500 leading-relaxed font-normal">
              Pastikan kualitas daging konsumsi anda dengan asisten cerdas yang didukung Computer Vision & AI. Cepat, akurat, dan tanpa repot.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto">
              <Link 
                href="/upload" 
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary text-white px-7 py-3.5 rounded-md font-semibold text-base hover:opacity-90 transition-opacity"
              >
                Mulai Deteksi Sekarang
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
              <Link 
                href="#tentang" 
                className="w-full sm:w-auto flex items-center justify-center px-7 py-3.5 rounded-md font-semibold text-base text-slate-800 border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
              >
                Pelajari Lebih Lanjut
              </Link>
            </div>
          </div>
          
          <div className="flex-1 w-full max-w-xl lg:max-w-none relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 relative shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] flex items-center justify-center text-slate-400">
              <Image 
                src="/images/fresh_poultry_hero.jpg" 
                alt="AI Detection Preview" 
                fill 
                className="object-cover" 
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Tentang Section */}
      <section id="tentang" className="py-24 px-4 md:px-6 bg-white border-y border-slate-200">
        <div className="container mx-auto max-w-4xl text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Tentang FreshPoultry</h2>
          <p className="text-lg text-slate-500 leading-relaxed mx-auto">
            FreshPoultry adalah platform yang memanfaatkan teknologi <strong>AI Vision</strong> 
            dan <strong>Gemini API</strong> untuk menganalisis dan mendeteksi level kesegaran 
            daging. Aplikasi ini dirancang agar konsumen dan pedagang dapat mengetahui kualitas daging 
            secara langsung, cukup dengan mengambil atau mengunggah foto.
          </p>
        </div>
      </section>

      {/* Fitur Section */}
      <section id="fitur" className="py-24 px-4 md:px-6">
        <div className="container mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Fitur Unggulan</h2>
            <p className="text-slate-500">
              Platform ini dikembangkan dengan arsitektur modern yang ringan dan efisien.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                <ScanFace className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Analisis AI Pintar</h3>
              <p className="text-slate-500 leading-relaxed">
                Pemeriksaan kualitas gambar yang akurat menggunakan teknologi Computer Vision dan Gemini API.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Tingkat Akurasi Tinggi</h3>
              <p className="text-slate-500 leading-relaxed">
                Dilatih dengan dataset gambar daging segar dan tidak segar yang bervariasi.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                <UploadCloud className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Insight Tambahan</h3>
              <p className="text-slate-500 leading-relaxed">
                Dapatkan rekomendasi penanganan dan cara memasak via Gemini AI berdasarkan hasil deteksi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 text-center text-sm text-slate-500 border-t border-slate-200">
        <p>&copy; {new Date().getFullYear()} FreshPoultry AI. Hak Cipta Dilindungi.</p>
      </footer>
    </div>
  );
}

function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4"/>
      <path d="M19 17v4"/>
      <path d="M3 5h4"/>
      <path d="M17 19h4"/>
    </svg>
  );
}
