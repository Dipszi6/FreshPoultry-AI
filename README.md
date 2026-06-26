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
| Hosting | Google CLouds |

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

## 📝 Catatan

- Project ini sebelumnya sempat mengeksplorasi pendekatan on-device classification dengan TensorFlow.js (model MobileNetV2), namun untuk versi saat ini klasifikasi dilakukan sepenuhnya melalui Gemini API.
- Project ini dibuat untuk memenuhi keperluan akademik saya.

## 📄 Lisensi

-.
