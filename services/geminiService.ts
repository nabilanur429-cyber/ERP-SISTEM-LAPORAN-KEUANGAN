import { GoogleGenAI } from "@google/genai";

let genAI: GoogleGenAI | null = null;

const getGenAI = (): GoogleGenAI => {
  if (!genAI) {
    const apiKey = process.env.API_KEY || '';
    if (!apiKey) {
        console.error("API_KEY is missing from environment variables");
        throw new Error("API Key missing");
    }
    genAI = new GoogleGenAI({ apiKey });
  }
  return genAI;
};

export const analyzeDocument = async (promptText: string, fileBase64?: string, mimeType: string = 'image/png'): Promise<string> => {
  try {
    const ai = getGenAI();
    
    // Prepare content parts
    const parts: any[] = [];
    
    // Add file data if provided (Works for Images, PDF, and some other text formats supported by Gemini)
    if (fileBase64) {
      // Remove Data URL prefix (e.g. "data:image/png;base64," or "data:application/pdf;base64,")
      const cleanBase64 = fileBase64.split(',')[1]; 
      
      parts.push({
        inlineData: {
          mimeType: mimeType,
          data: cleanBase64
        }
      });
    }

    // Add text prompt
    parts.push({ text: promptText });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts },
      config: {
        systemInstruction: `Anda adalah Ahli Akuntansi AI dan Auditor untuk Perusahaan Dagang. 
        Kemampuan Anda meliputi:
        1. OCR & Ekstraksi Data: Membaca faktur, kuitansi, laporan keuangan (PDF/Word/Gambar) dengan presisi tinggi.
        2. Validasi: Memeriksa kebenaran matematis (total, pajak) dan kepatuhan.
        3. Klasifikasi: Mengkategorikan pengeluaran ke dalam akun GL (General Ledger) yang tepat.
        4. Analisis: Meringkas tren keuangan dari laporan.
        
        PENTING: Selalu berikan respons dalam Bahasa Indonesia yang profesional, jelas, dan terstruktur. Jika mengekstrak data, utamakan format JSON atau tabel yang rapi.`,
        temperature: 0.2, 
      }
    });

    return response.text || "Tidak ada analisis yang dihasilkan.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return `Gagal menghasilkan analisis: ${error instanceof Error ? error.message : "Kesalahan tidak diketahui"}`;
  }
};

export const generateArchitectureArtifact = async (promptText: string): Promise<string> => {
  try {
    const ai = getGenAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: promptText,
      config: {
        systemInstruction: "You are an expert Enterprise Architect. You specialize in Python, Django, React, and ERP domain modeling. Provide comprehensive, production-ready code and specifications.",
      }
    });

    return response.text || "No content generated";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return `Error generating artifact: ${error instanceof Error ? error.message : "Unknown error"}`;
  }
};