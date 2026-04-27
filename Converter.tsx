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

function AdSlot({ label, className = "", children }: { label: string; className?: string; children: React.ReactNode; }) {
  return (
    <div className={`bg-gray-100 border border-gray-200 rounded-lg overflow-hidden ${className}`}>
      <p className="text-center text-[10px] font-semibold tracking-widest text-gray-400 uppercase py-1 bg-gray-200/60 border-b border-gray-200">Advertisement</p>
      <div className="flex items-center justify-center text-xs text-gray-400 font-medium">{children}</div>
      <p className="text-center text-[9px] text-gray-300 pb-1">{label}</p>
    </div>
  );
}

export default function Converter() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  
  // PRO FEATURES STATES
  const [watermark, setWatermark] = useState(""); 
  const [pageSize, setPageSize] = useState<"a4" | "fit">("a4");
  const [hasMargin, setHasMargin] = useState(true);
  const [customFileName, setCustomFileName] = useState("my-converted-pdf");

  const [isDragging, setIsDragging] = useState(false);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragItem = useRef<number | null>(null);
  const pdfUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => { if (pdfUrlRef.current) URL.revokeObjectURL(pdfUrlRef.current); };
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
  }, []);

  const convertToPdf = async () => {
    if (images.length === 0) return;
    setStatus("converting");
    setProgress(0);

    try {
      const doc = new jsPDF({ orientation: "portrait", unit: "mm" });
      let isFirst = true;

      for (let i = 0; i < images.length; i++) {
        const imgFile = images[i];
        await new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => {
            let pageW = 210, pageH = 297; // Default A4
            const margin = hasMargin ? 10 : 0;

            if (pageSize === "fit") {
              // Image ke hisab se page ka size set karna
              pageW = (img.naturalWidth * 25.4) / 96; 
              pageH = (img.naturalHeight * 25.4) / 96;
            }

            if (!isFirst) doc.addPage([pageW, pageH], "p");
            else {
               if(pageSize === "fit") doc.deletePage(1);
               if(pageSize === "fit") doc.addPage([pageW, pageH], "p");
            }
            isFirst = false;

            const maxW = pageW - margin * 2;
            const maxH = pageH - margin * 2;
            let drawW = img.naturalWidth, drawH = img.naturalHeight;
            
            const ratio = Math.min(maxW / drawW, maxH / drawH);
            drawW *= ratio;
            drawH *= ratio;

            const x = (pageW - drawW) / 2;
            const y = (pageH - drawH) / 2;

            const canvas = document.createElement("canvas");
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext("2d")!;
            ctx.drawImage(img, 0, 0);
            doc.addImage(canvas.toDataURL("image/jpeg", 0.9), "JPEG", x, y, drawW, drawH);

            if (watermark.trim() !== "") {
              doc.setTextColor(200, 200, 200);
              doc.setFontSize(40);
              doc.text(watermark, pageW / 2, pageH / 2, { align: "center", angle: 45 });
            }
            resolve();
          };
          img.src = imgFile.preview;
        });
        setProgress(Math.round(((i + 1) / images.length) * 100));
      }

      const url = URL.createObjectURL(doc.output("blob"));
      pdfUrlRef.current = url;
      setPdfUrl(url);
      setStatus("done");
    } catch { setStatus("error"); }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b p-4 shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold">PDF</div>
          <h1 className="text-xl font-bold text-slate-800">Smart Quick PDF Pro</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 sm:p-8">
        {/* Upload Area */}
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-4 border-dashed border-slate-300 rounded-3xl p-12 text-center bg-white hover:border-indigo-500 hover:bg-indigo-50 transition-all cursor-pointer"
        >
          <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden" onChange={(e) => e.target.files && addImages(e.target.files)} />
          <p className="text-lg font-bold text-slate-600">Click or Drag Images to Start</p>
          <p className="text-sm text-slate-400 mt-2">JPG, PNG, WEBP supported</p>
        </div>

        {images.length > 0 && (
          <div className="mt-8 space-y-6">
            {/* Settings Box */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="font-bold text-lg mb-4 text-slate-800">PDF Pro Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-2">Watermark Text</label>
                  <input type="text" placeholder="e.g. Property of Sohaib" className="w-full p-2 border rounded-lg" value={watermark} onChange={(e)=>setWatermark(e.target.value)} />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-2">File Name</label>
                  <input type="text" className="w-full p-2 border rounded-lg" value={customFileName} onChange={(e)=>setCustomFileName(e.target.value)} />
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-semibold text-slate-600 mb-2">Page Size</label>
                    <select className="w-full p-2 border rounded-lg" value={pageSize} onChange={(e)=>setPageSize(e.target.value as any)}>
                      <option value="a4">Standard A4</option>
                      <option value="fit">Fit to Image Size</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2 mt-6">
                    <input type="checkbox" id="margin" checked={hasMargin} onChange={(e)=>setHasMargin(e.target.checked)} />
                    <label htmlFor="margin" className="text-sm font-semibold text-slate-600">Add Margins</label>
                  </div>
                </div>
              </div>
            </div>

            {/* Convert Button */}
            <div className="flex flex-col items-center gap-4">
              {status === "converting" && (
                <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full transition-all" style={{width: `${progress}%`}}></div>
                </div>
              )}
              
              <div className="flex gap-4">
                <button 
                  disabled={status === "converting"}
                  onClick={convertToPdf}
                  className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 disabled:bg-slate-400"
                >
                  {status === "converting" ? "Converting..." : "Generate PDF"}
                </button>

                {status === "done" && pdfUrl && (
                  <a href={pdfUrl} download={`${customFileName}.pdf`} className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700">
                    Download Now
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
                                           }
