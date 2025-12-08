import React, { useState, useRef } from 'react';
import { analyzeDocument } from '../services/geminiService';
import { Upload, FileText, Play, Loader2, Image as ImageIcon, CheckCircle, AlertCircle, ScanLine, FileType } from 'lucide-react';

const SUGGESTED_PROMPTS = [
  { label: "Analisis Laporan Keuangan", text: "Analisis Laporan Keuangan ini. Identifikasi metrik utama: Total Aset, Total Liabilitas, Ekuitas, Pendapatan, dan Laba Bersih. \n\nSajikan data angka tersebut dalam format **Tabel Markdown** yang rapi (Kolom: Metrik, Nilai). \n\nSetelah tabel, berikan penilaian singkat tentang kesehatan keuangan perusahaan berdasarkan angka-angka tersebut." },
  { label: "Ekstrak Data Faktur", text: "Ekstrak Nama Vendor, Tanggal Faktur, Nomor Faktur, Item Baris (Barang/Jasa), Subtotal, Pajak (PPN), dan Jumlah Total. Format keluaran sebagai objek JSON yang valid." },
  { label: "Cek Validasi Matematis", text: "Verifikasi keakuratan matematis dokumen ini. Periksa apakah item baris dijumlahkan dengan benar menjadi subtotal, dan apakah pajak dihitung dengan benar. Laporkan jika ada selisih perhitungan." },
  { label: "Ringkasan Dokumen", text: "Berikan ringkasan komprehensif dari dokumen ini, soroti kewajiban keuangan utama dan tanggal-tanggal penting yang disebutkan." }
];

const DocumentAnalyzer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/png');
  const [prompt, setPrompt] = useState<string>(SUGGESTED_PROMPTS[0].text);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setMimeType(file.type);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedFile(event.target.result as string);
          setResult(null); // Clear previous result
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!prompt) return;
    
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeDocument(prompt, selectedFile || undefined, mimeType);
      setResult(analysis);
    } catch (error) {
      setResult("Terjadi kesalahan saat analisis. Silakan coba lagi.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const isImage = mimeType.startsWith('image/');

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h2 className="text-3xl font-serif font-bold text-slate-900">Pemindai Dokumen Keuangan AI</h2>
        <p className="text-slate-500 mt-2">Unggah dokumen akuntansi (<span className="font-semibold text-slate-700">PDF, Word, Gambar</span>) untuk analisis dan ekstraksi data instan.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
        {/* Left Column: Upload & Input */}
        <div className="space-y-6">
          
          {/* File Upload Zone */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden group ${
              selectedFile 
                ? 'border-indigo-200 bg-indigo-50/30' 
                : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'
            }`}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*, .pdf, .doc, .docx" 
              onChange={handleFileSelect}
            />
            
            {selectedFile ? (
              <div className="w-full h-64 flex items-center justify-center">
                {isImage ? (
                  <div className="relative w-full h-full">
                    <img 
                      src={selectedFile} 
                      alt="Document Preview" 
                      className="w-full h-full object-contain rounded-lg shadow-sm"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-700 p-8 bg-white rounded-xl shadow-sm border border-slate-200">
                    <FileType size={64} className="text-rose-500 mb-4" />
                    <span className="font-bold text-lg text-center break-all">{fileName}</span>
                    <span className="text-xs text-slate-400 uppercase mt-2 tracking-wider">{mimeType || 'Dokumen'}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 bg-black/70 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm transition-opacity">
                    Klik untuk ganti file
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload size={28} />
                </div>
                <h3 className="font-medium text-slate-900">Klik untuk unggah dokumen</h3>
                <p className="text-sm text-slate-500 mt-1">Mendukung PDF, Word, JPG, PNG</p>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Tugas Analisis Cepat</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SUGGESTED_PROMPTS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => setPrompt(p.text)}
                  className="text-left text-xs p-3 rounded-lg border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 transition-colors text-slate-700 hover:text-indigo-700 font-medium"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Prompt Input */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
             <label className="block text-sm font-medium text-slate-700 mb-2">Instruksi untuk AI</label>
             <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full h-32 p-3 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              placeholder="Contoh: Ekstrak jumlah total dan identifikasi apakah ada diskon yang diterapkan..."
             />
             <div className="mt-4 flex justify-end">
               <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || (!selectedFile && !prompt)}
                className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-lg font-bold hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
               >
                 {isAnalyzing ? (
                   <>
                    <Loader2 className="animate-spin" size={18} />
                    Menganalisis...
                   </>
                 ) : (
                   <>
                    <ScanLine size={18} />
                    Jalankan Analisis
                   </>
                 )}
               </button>
             </div>
          </div>

        </div>

        {/* Right Column: Results */}
        <div className="flex flex-col h-full min-h-[500px]">
          <div className="flex-1 bg-slate-50 rounded-xl border border-slate-200 shadow-inner p-6 overflow-hidden flex flex-col">
            <h3 className="flex items-center gap-2 font-bold text-slate-800 mb-4 border-b border-slate-200 pb-3">
              <FileText size={20} className="text-indigo-600" />
              Hasil Analisis
            </h3>
            
            <div className="flex-1 overflow-y-auto scrollbar-thin pr-2">
              {result ? (
                <div className="prose prose-sm prose-slate max-w-none">
                  <div className="whitespace-pre-wrap font-mono text-slate-700 leading-relaxed bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                    {result}
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60">
                   <FileType size={48} className="mb-4" />
                   <p className="text-center">Unggah Laporan Keuangan, PDF, atau Word<br/>untuk melihat hasil ekstraksi di sini.</p>
                </div>
              )}
            </div>
            
            {result && (
              <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
                <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-emerald-500"/> Diproses oleh Gemini 2.5 Flash</span>
                <button 
                  onClick={() => navigator.clipboard.writeText(result)}
                  className="hover:text-indigo-600 font-medium"
                >
                  Salin Hasil
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentAnalyzer;