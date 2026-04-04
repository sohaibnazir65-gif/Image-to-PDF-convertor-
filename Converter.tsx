import { useState, useRef, useCallback, useEffect } from "react";
import { Link } from "wouter";
import { jsPDF } from "jspdf";

interface ImageFile {
  id: string;
  file: File;
  preview: string;
  name: string;
}

type Status = "idle" | "converting" | "done" | "error";

function generateId() {
  return Math.random().toString(36).slice(2);
}

function AdSlot({
  label,
  className = "",
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`bg-gray-100 border border-gray-200 rounded-lg overflow-hidden ${className}`}>
      <p className="text-center text-[10px] font-semibold tracking-widest text-gray-400 uppercase py-1 bg-gray-200/60 border-b border-gray-200">
        Advertisement
      </p>
      <div className="flex items-center justify-center text-xs text-gray-400 font-medium">
        {children}
      </div>
      <p className="text-center text-[9px] text-gray-300 pb-1">{label}</p>
    </div>
  );
}

export default function Converter() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragItem = useRef<number | null>(null);
  const pdfUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (pdfUrlRef.current) URL.revokeObjectURL(pdfUrlRef.current);
    };
  }, []);

  const addImages = useCallback((files: FileList | File[]) => {
    const validFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
    const newImages: ImageFile[] = validFiles.map((file) => ({
      id: generateId(),
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
    }));
    setImages((prev) => [...prev, ...newImages]);
    setPdfUrl(null);
    setStatus("idle");
    setProgress(0);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) addImages(e.dataTransfer.files);
  }, [addImages]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const removeImage = (id: string) => {
    setImages((prev) => {
      const img = prev.find((i) => i.id === id);
      if (img) URL.revokeObjectURL(img.preview);
      return prev.filter((i) => i.id !== id);
    });
    setPdfUrl(null);
    setStatus("idle");
    setProgress(0);
  };

  const clearAll = () => {
    images.forEach((i) => URL.revokeObjectURL(i.preview));
    setImages([]);
    setPdfUrl(null);
    setStatus("idle");
    setProgress(0);
  };

  const handleCardDragStart = (index: number) => { dragItem.current = index; };
  const handleCardDragEnter = (index: number) => { setDragOverIndex(index); };
  const handleCardDragEnd = () => {
    if (dragItem.current !== null && dragOverIndex !== null && dragItem.current !== dragOverIndex) {
      setImages((prev) => {
        const updated = [...prev];
        const [moved] = updated.splice(dragItem.current!, 1);
        updated.splice(dragOverIndex, 0, moved);
        return updated;
      });
    }
    dragItem.current = null;
    setDragOverIndex(null);
  };

  const convertToPdf = async () => {
    if (images.length === 0) return;
    setStatus("converting");
    setProgress(0);
    setPdfUrl(null);

    try {
      const doc = new jsPDF({ orientation: "portrait", unit: "mm" });
      let isFirst = true;

      for (let i = 0; i < images.length; i++) {
        const imgFile = images[i];
        await new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => {
            const pageW = 210, pageH = 297, margin = 10;
            const maxW = pageW - margin * 2;
            const maxH = pageH - margin * 2;
            let drawW = img.naturalWidth, drawH = img.naturalHeight;
            if (drawW > maxW) { drawH = (drawH * maxW) / drawW; drawW = maxW; }
            if (drawH > maxH) { drawW = (drawW * maxH) / drawH; drawH = maxH; }
            const x = margin + (maxW - drawW) / 2;
            const y = margin + (maxH - drawH) / 2;
            if (!isFirst) doc.addPage();
            isFirst = false;
            const canvas = document.createElement("canvas");
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext("2d")!;
            ctx.drawImage(img, 0, 0);
            const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
            doc.addImage(dataUrl, "JPEG", x, y, drawW, drawH);
            resolve();
          };
          img.src = imgFile.preview;
        });
        setProgress(Math.round(((i + 1) / images.length) * 100));
      }

      const blob = doc.output("blob");
      if (pdfUrlRef.current) URL.revokeObjectURL(pdfUrlRef.current);
      const url = URL.createObjectURL(blob);
      pdfUrlRef.current = url;
      setPdfUrl(url);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  const downloadPdf = () => {
    if (!pdfUrl) return;
    const a = document.createElement("a");
    a.href = pdfUrl;
    a.download = "converted.pdf";
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-600 shadow-sm shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-lg font-bold text-slate-900">ImageToPDF</span>
          </Link>
        </div>
      </header>

      <div className="w-full bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2">
          <AdSlot label="728×90 Leaderboard" className="w-full">
            <div className="w-full h-[90px] flex items-center justify-center text-gray-300 text-sm tracking-wide">
              Google AdSense — Leaderboard 728×90
            </div>
          </AdSlot>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col lg:flex-row gap-8 items-start">
        <main className="flex-1 min-w-0">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
              Free Image to PDF Converter
            </h1>
            <p className="text-slate-500 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
              Upload JPG, PNG, WEBP or GIF images and merge them into a single PDF instantly — no signup, no server upload, 100% secure.
            </p>
          </div>

          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-2xl p-10 sm:p-14 text-center cursor-pointer transition-all duration-200 ${isDragging ? "border-indigo-500 bg-indigo-50 scale-[1.01]" : "border-slate-300 bg-white hover:border-indigo-400 hover:bg-indigo-50/40"}`}
          >
            <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => e.target.files && addImages(e.target.files)} />
            <div className="flex flex-col items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${isDragging ? "bg-indigo-100" : "bg-slate-100"}`}>
                <svg className={`w-8 h-8 transition-colors ${isDragging ? "text-indigo-600" : "text-slate-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-700 mb-1">{isDragging ? "Drop images here" : "Drag & drop images here"}</p>
                <p className="text-sm text-slate-400">or click to browse — JPG, PNG, WEBP, GIF accepted</p>
              </div>
              <button type="button" className="bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold px-7 py-2.5 rounded-xl shadow-sm transition-colors text-sm" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>Choose Images</button>
            </div>
          </div>

          {images.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-bold text-slate-800">{images.length} image{images.length !== 1 ? "s" : ""} selected</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Drag cards to reorder pages in your PDF</p>
                </div>
                <button onClick={clearAll} className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center gap-1 transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear all
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {images.map((img, index) => (
                  <div key={img.id} draggable onDragStart={() => handleCardDragStart(index)} onDragEnter={() => handleCardDragEnter(index)} onDragEnd={handleCardDragEnd} onDragOver={(e) => e.preventDefault()} className={`relative group bg-white rounded-xl border-2 overflow-hidden cursor-grab active:cursor-grabbing transition-all duration-150 shadow-xs ${dragOverIndex === index ? "border-indigo-500 scale-105 shadow-md" : "border-slate-200 hover:border-indigo-300 hover:shadow-sm"}`}>
                    <div className="aspect-[3/4] overflow-hidden bg-slate-100">
                      <img src={img.preview} alt={img.name} className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105" />
                    </div>
                    <div className="absolute top-2 left-2 w-6 h-6 bg-indigo-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-sm">{index + 1}</div>
                    <button onClick={() => removeImage(img.id)} className="absolute top-2 right-2 w-6 h-6 bg-white/90 hover:bg-red-500 text-slate-600 hover:text-white rounded-full flex items-center justify-center shadow-sm transition-colors opacity-0 group-hover:opacity-100">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <div className="px-2 py-1.5 bg-white"><p className="text-[11px] text-slate-500 truncate">{img.name}</p></div>
                  </div>
                ))}
                <button onClick={() => fileInputRef.current?.click()} className="aspect-[3/4] rounded-xl border-2 border-dashed border-slate-300 hover:border-indigo-400 hover:bg-indigo-50/50 flex flex-col items-center justify-center gap-2 transition-all duration-150 cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">Add more</span>
                </button>
              </div>

              <div className="mt-6 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                {(status === "converting" || status === "done") && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-semibold text-slate-700">{status === "converting" ? `Processing image ${Math.ceil((progress / 100) * images.length)} of ${images.length}…` : "Conversion complete!"}</span>
                      <span className={`font-bold ${status === "done" ? "text-emerald-600" : "text-indigo-600"}`}>{progress}%</span>
                    </div>
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-300 ease-out ${status === "done" ? "bg-emerald-500" : "bg-indigo-600"}`} style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                )}

                {status === "error" && (
                  <div className="mb-4 flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-xl text-sm border border-red-100">
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Something went wrong. Please try again with different images.
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <p className="flex-1 text-sm text-slate-500">{images.length} page{images.length !== 1 ? "s" : ""} · A4 format · PDF/1.3</p>
                  <div className="flex flex-col sm:flex-row gap-2.5">
                    {status === "done" && pdfUrl && (
                      <button onClick={downloadPdf} className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold px-6 py-3 rounded-xl shadow-sm transition-colors text-sm">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download PDF
                      </button>
                    )}
                    <button onClick={convertToPdf} disabled={status === "converting" || images.length === 0} className={`flex items-center justify-center gap-2 font-bold px-6 py-3 rounded-xl shadow-sm transition-all text-sm ${status === "converting" ? "bg-indigo-400 text-white cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white cursor-pointer"}`}>
                      {status === "converting" ? (
                        <>
                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Converting…
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                          {status === "done" ? "Convert Again" : "Convert to PDF"}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        <aside className="hidden lg:flex flex-col gap-6 w-[300px] shrink-0 pt-2">
          <div className="sticky top-[85px]">
            <AdSlot label="300×250 Square Ad" className="w-full">
              <div className="w-[300px] h-[250px] flex items-center justify-center text-gray-300 text-sm tracking-wide">Google AdSense — Square 300×250</div>
            </AdSlot>
          </div>
        </aside>
      </div>

      <footer className="border-t border-slate-200 bg-white mt-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <span>© {new Date().getFullYear()} ImageToPDF — Free Image to PDF Converter</span>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-indigo-600 transition-colors">Converter</Link>
            <Link href="/privacy" className="hover:text-indigo-600 transition-colors">Privacy Policy</Link>
            <Link href="/contact" className="hover:text-indigo-600 transition-colors">Contact Us</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
