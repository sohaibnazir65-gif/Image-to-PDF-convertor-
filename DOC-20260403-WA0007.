import { useState } from "react";
import { Link } from "wouter";

export default function ContactUs() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<typeof form>>({});

  const validate = () => {
    const e: Partial<typeof form> = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address.";
    if (!form.message.trim()) e.message = "Message is required.";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitted(true);
  };

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navbar */}
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

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        {/* Back link */}
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-800 font-medium mb-8 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Converter
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

          {/* Left — info */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Contact Us</h1>
              <p className="text-slate-500 text-sm leading-relaxed">
                Have a question, suggestion, or ran into a problem? We'd love to hear from you. Fill in the form and we'll get back to you as soon as possible.
              </p>
            </div>

            {/* Privacy reassurance */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
              <div className="flex items-start gap-2.5">
                <svg className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-emerald-800 mb-0.5">Your images are always safe</p>
                  <p className="text-xs text-emerald-700 leading-relaxed">
                    We never store your images on our servers. All PDF conversion happens locally in your browser — your files never leave your device.
                  </p>
                </div>
              </div>
            </div>

            {/* Info cards */}
            <div className="space-y-3">
              {[
                {
                  icon: (
                    <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  ),
                  title: "Email Support",
                  detail: "support@imagetopdf.app",
                },
                {
                  icon: (
                    <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  title: "Response Time",
                  detail: "Usually within 24–48 hours",
                },
                {
                  icon: (
                    <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  title: "Common Topics",
                  detail: "Bug reports, feature requests, general feedback",
                },
              ].map(({ icon, title, detail }) => (
                <div key={title} className="bg-white border border-slate-200 rounded-xl p-4 flex items-start gap-3 shadow-xs">
                  <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center shrink-0">
                    {icon}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-700">{title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <div className="lg:col-span-3">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
              {submitted ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mb-2">Message Sent!</h2>
                  <p className="text-slate-500 text-sm mb-6 max-w-xs mx-auto">
                    Thanks for reaching out, <span className="font-semibold text-slate-700">{form.name}</span>. We'll get back to you at <span className="font-semibold text-slate-700">{form.email}</span> within 24–48 hours.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={() => { setForm({ name: "", email: "", subject: "", message: "" }); setSubmitted(false); }}
                      className="text-sm font-semibold text-indigo-600 border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 px-5 py-2.5 rounded-xl transition-colors"
                    >
                      Send Another Message
                    </button>
                    <Link href="/" className="text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 rounded-xl transition-colors text-center">
                      Back to Converter
                    </Link>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-lg font-bold text-slate-900 mb-6">Send us a message</h2>
                  <form onSubmit={handleSubmit} noValidate className="space-y-5">
                    {/* Name + Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Your Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={form.name}
                          onChange={(e) => handleChange("name", e.target.value)}
                          placeholder="John Doe"
                          className={`w-full text-sm px-3.5 py-2.5 rounded-xl border ${errors.name ? "border-red-400 bg-red-50" : "border-slate-200 bg-slate-50"} focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition`}
                        />
                        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => handleChange("email", e.target.value)}
                          placeholder="john@example.com"
                          className={`w-full text-sm px-3.5 py-2.5 rounded-xl border ${errors.email ? "border-red-400 bg-red-50" : "border-slate-200 bg-slate-50"} focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition`}
                        />
                        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">Subject</label>
                      <select
                        value={form.subject}
                        onChange={(e) => handleChange("subject", e.target.value)}
                        className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition text-slate-700"
                      >
                        <option value="">Select a topic…</option>
                        <option value="Bug Report">Bug Report</option>
                        <option value="Feature Request">Feature Request</option>
                        <option value="General Question">General Question</option>
                        <option value="Privacy Concern">Privacy Concern</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={form.message}
                        onChange={(e) => handleChange("message", e.target.value)}
                        rows={5}
                        placeholder="Describe your question or feedback in detail…"
                        className={`w-full text-sm px-3.5 py-2.5 rounded-xl border ${errors.message ? "border-red-400 bg-red-50" : "border-slate-200 bg-slate-50"} focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition resize-none`}
                      />
                      {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <p className="text-xs text-slate-400">
                        <span className="text-red-500">*</span> Required fields
                      </p>
                      <button
                        type="submit"
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold px-6 py-2.5 rounded-xl shadow-sm transition-colors text-sm"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        Send Message
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <span>© {new Date().getFullYear()} ImageToPDF — Free Image to PDF Converter</span>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-indigo-600 transition-colors">Converter</Link>
            <Link href="/privacy" className="hover:text-indigo-600 transition-colors">Privacy Policy</Link>
            <Link href="/contact" className="hover:text-indigo-600 transition-colors font-medium text-indigo-500">Contact Us</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
