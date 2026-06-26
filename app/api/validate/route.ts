import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 30; // 30 seconds

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('image') as File | null;

    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY is not set." }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });

    // Convert file to base64
    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    
    const prompt = `Kamu adalah sistem verifikasi gambar. 
Apakah gambar ini menunjukkan daging (khususnya daging mentah atau matang, atau daging lainnya)?
Jawab HANYA dalam format JSON valid tanpa markdown:
{
  "isMeat": true/false,
  "reason": "Alasan singkat (1 kalimat) kenapa gambar ini terdeteksi sebagai daging atau bukan daging."
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: [
        prompt,
        {
          inlineData: {
            data: base64,
            mimeType: file.type,
          }
        }
      ]
    });

    let rawText = response.text || "{}";
    rawText = rawText.trim().replace(/^```json/, '').replace(/^```/, '').replace(/```$/, '').trim();
    
    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch (e) {
      parsed = { isMeat: true, reason: "Gagal memparsing respons AI." };
    }

    return NextResponse.json(parsed);
  } catch (error: any) {
    if (error?.status === 429 || error?.status === 503) {
      console.warn(`Gemini Validation skipped (API limit): ${error?.status}`);
    } else {
      console.error("Gemini Validation Error:", error?.message || error);
    }
    return NextResponse.json(
      { isMeat: true, reason: "Error saat verifikasi, fallback allow." }, 
      { status: 200 }
    );
  }
}
