# FreshPoultry AI 🥩

Website klasifikasi kesegaran daging (segar / tidak segar) berbasis AI. Pengguna mengunggah foto daging, sistem menganalisis kesegarannya menggunakan **Gemini API (vision)**, lalu menampilkan hasil klasifikasi beserta insight tambahan.

## ✨ Fitur

- Upload foto daging langsung dari kamera atau galeri
- Klasifikasi otomatis 2 kelas: **Segar** / **Tidak Segar**
- Insight tambahan dari Gemini (alasan klasifikasi, saran penanganan/penyimpanan)
- Riwayat deteksi tersimpan dan bisa dilihat kembali
- UI responsif dengan Tailwind CSS

## 🛠️ Tech Stack

| Layer | Teknologi |
|---|---|
| Framework | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS |
| AI / Klasifikasi | Gemini API (multimodal vision) |
| Database | Firebase Firestore |
| Storage gambar | Firebase Storage |
| Hosting | Firebase Hosting |

## 📋 Prasyarat

- Node.js 18+ dan npm
- Akun Firebase (project sudah dibuat, Firestore & Storage diaktifkan)
- API key Gemini dari [Google AI Studio](https://aistudio.google.com/)
- Firebase CLI (`npm install -g firebase-tools`) untuk deploy

## 🚀 Instalasi

1. Clone repo ini dan masuk ke folder project:
   ```bash
   git clone <url-repo-anda>
   cd meatvision
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Buat file `.env.local` di root project dan isi dengan kredensial berikut:
   ```env
   # Firebase
   NEXT_PUBLIC_FIREBASE_API_KEY=
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
   NEXT_PUBLIC_FIREBASE_APP_ID=

   # Gemini API
   GEMINI_API_KEY=
   ```
   > ⚠️ `GEMINI_API_KEY` sengaja tidak diberi prefix `NEXT_PUBLIC_` karena dipanggil lewat API Route di server, bukan langsung dari browser — supaya key tidak terekspos ke client.

4. Jalankan development server:
   ```bash
   npm run dev
   ```
   Buka [http://localhost:3000](http://localhost:3000).

## 🔄 Cara Kerja

1. Pengguna mengunggah foto daging melalui halaman upload.
2. Gambar dikirim ke API Route Next.js, yang meneruskannya ke **Gemini API** untuk dianalisis.
3. Gemini mengembalikan label klasifikasi (**Segar** / **Tidak Segar**) beserta insight penjelasan.
4. Gambar disimpan ke **Firebase Storage**, hasil klasifikasi + insight disimpan ke **Firestore**.
5. Hasil ditampilkan ke pengguna di halaman result.

## 📁 Struktur Project (ringkas)

```
├── app/
│   ├── upload/         # Halaman upload & trigger analisis
│   ├── result/[id]/    # Halaman hasil klasifikasi
│   └── api/            # API Route untuk memanggil Gemini API
├── lib/
│   ├── gemini.ts        # Fungsi pemanggilan Gemini API
│   ├── firestore.ts      # Fungsi simpan/ambil data riwayat deteksi
│   └── firebase.ts       # Inisialisasi Firebase SDK
└── public/
```

## ☁️ Deploy ke Firebase Hosting

```bash
npm run build
firebase login
firebase init hosting   # jika belum pernah init
firebase deploy
```

Pastikan environment variable (terutama `GEMINI_API_KEY`) juga diset di environment hosting/server-side, bukan hanya di `.env.local`.

## 📝 Catatan

- Project ini sebelumnya sempat mengeksplorasi pendekatan on-device classification dengan TensorFlow.js (model MobileNetV2), namun untuk versi saat ini klasifikasi dilakukan sepenuhnya melalui Gemini API.
- Pastikan kuota/rate limit Gemini API dicek sebelum production, terutama jika trafik tinggi.

## 📄 Lisensi

Tambahkan informasi lisensi sesuai kebutuhan project Anda.
