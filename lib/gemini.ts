// lib/gemini.ts
export async function getInsight(label: string, confidence: number): Promise<{ alasan: string, saran: string }> {
  const fallbackResult = {
    alasan: "Analisis AI sedang tidak tersedia.",
    saran: "Hasil klasifikasi tetap valid. Coba deteksi ulang."
  };

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetch('/api/insight', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ label, confidence }),
      });

      if (!response.ok) {
        if (response.status === 400 || response.status === 401) {
          return fallbackResult;
        }

        if (response.status === 503 || response.status === 429) {
          throw new Error('RETRYABLE');
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
           throw new Error('RETRYABLE');
        }

        let errorMsg = '';
        try {
          const errorData = await response.json();
          errorMsg = JSON.stringify(errorData);
        } catch (e) {
          errorMsg = response.statusText;
        }

        if (errorMsg.includes('UNAVAILABLE') || errorMsg.includes('high demand')) {
          throw new Error('RETRYABLE');
        } else {
          return fallbackResult;
        }
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
         throw new Error('RETRYABLE');
      }

      const rawText = await response.text();
      let data;
      try {
        data = JSON.parse(rawText);
      } catch (e) {
        throw new Error('RETRYABLE');
      }
      
      return data.insight || { alasan: "Insight tidak tersedia", saran: "Coba deteksi ulang" };
    } catch (error: any) {
      if (error.message === 'RETRYABLE' && attempt < 3) {
        const delay = attempt === 1 ? 2000 : 4000;
        console.warn(`Get insight failed, retrying (attempt ${attempt} of 3) in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      console.error(`Error in getInsight (attempt ${attempt}):`, error);
      return fallbackResult;
    }
  }

  return fallbackResult;
}

export async function validateImage(file: File): Promise<{ isMeat: boolean; reason: string }> {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('/api/validate', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      console.error("Validation API error:", response.statusText);
      return { isMeat: true, reason: "Gagal memverifikasi gambar, melanjutkan analisis." };
    }

    const data = await response.json();
    return {
      isMeat: typeof data.isMeat === 'boolean' ? data.isMeat : true,
      reason: data.reason || "Terverifikasi",
    };
  } catch (error) {
    console.error("Error calling validate API:", error);
    return { isMeat: true, reason: "Error jaringan, melanjutkan analisis." };
  }
}

