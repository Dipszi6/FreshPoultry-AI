import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { label, confidence } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY is not set." }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `Kamu adalah sistem analisis kesegaran daging berbasis AI. 
Berikan analisis ilmiah singkat berdasarkan data berikut:
- Status: ${label === 'fresh' ? 'segar' : 'tidak segar'}
- Tingkat kepercayaan model: ${(confidence * 100).toFixed(1)}%

Jawab HANYA dalam format JSON valid tanpa markdown:
{
  "alasan": "2-3 kalimat ilmiah menjelaskan indikator visual umum yang menyebabkan daging terklasifikasi sebagai ${label === 'fresh' ? 'segar' : 'tidak segar'}, sertakan nilai confidence ${(confidence * 100).toFixed(1)}% dalam kalimat",
  "saran": "1-2 kalimat saran tindakan spesifik berdasarkan status ${label === 'fresh' ? 'segar' : 'tidak segar'} dan tingkat kepercayaan ${(confidence * 100).toFixed(1)}%"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
    });

    let rawText = response.text || "{}";
    // Strip markdown code fences if present
    rawText = rawText.trim().replace(/^```json/, '').replace(/^```/, '').replace(/```$/, '').trim();
    
    let insightParsed;
    try {
      insightParsed = JSON.parse(rawText);
    } catch (e) {
      insightParsed = { alasan: "Insight tidak tersedia", saran: "Coba deteksi ulang" };
    }

    return NextResponse.json({ insight: insightParsed });
  } catch (error: any) {
    const isUnavailable = error?.message?.includes("UNAVAILABLE") || error?.message?.includes("high demand") || error?.status === 503;
    const isRateLimited = error?.status === 429;
    
    if (isRateLimited || isUnavailable) {
      console.warn(`Gemini Insight API skipped (API limit or unavailable)`);
    } else {
      console.error("Gemini API Error:", error?.message || error);
    }
    
    return NextResponse.json(
      { error: error?.message || "Failed to generate insight." }, 
      { status: isUnavailable ? 503 : (isRateLimited ? 429 : 500) }
    );
  }
}
