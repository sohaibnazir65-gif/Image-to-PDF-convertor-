import { Link } from "wouter";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-lg font-bold text-slate-900">ImageToPDF</span>
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <Link href="/" className="text-sm text-indigo-600 hover:underline">← Back to Converter</Link>
        <div className="bg-white border rounded-2xl p-8 mt-6 shadow-sm">
          <h1 className="text-2xl font-bold mb-4">Privacy Policy</h1>
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6">
            <p className="text-emerald-800 text-sm font-medium">
              <strong>100% Private:</strong> Hum aapki images ko upload ya store nahi karte. Saara conversion aapke browser mein hota hai.
            </p>
          </div>
          <div className="space-y-6 text-slate-600 text-sm">
            <p>1. Hum koi bhi personal data ya files apne server par save nahi karte.</p>
            <p>2. Conversion process poori tarah browser-based hai (jsPDF library ke zariye).</p>
            <p>3. Google AdSense ya third-party ads cookies ka istemal kar sakte hain.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

