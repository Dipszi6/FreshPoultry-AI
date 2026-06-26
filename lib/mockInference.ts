// lib/mockInference.ts

export async function mockClassify(file: File): Promise<{ label: "fresh" | "rotten", confidence: number }> {
  // TODO: ganti dengan model Computer Vision spesifik (jika diperlukan) di sini
  return new Promise((resolve) => {
    setTimeout(() => {
      const isFresh = Math.random() > 0.5;
      const confidence = 0.7 + Math.random() * 0.28; // 0.7 to 0.98
      resolve({
        label: isFresh ? "fresh" : "rotten",
        confidence,
      });
    }, 1000 + Math.random() * 1000); // 1-2 detik delay
  });
}
