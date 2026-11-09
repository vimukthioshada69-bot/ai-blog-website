"use client";

import { useEffect, useRef, useState } from "react";
import { Download, ImagePlus, LoaderCircle, ShieldCheck, X } from "lucide-react";

const MAX_SIZE = 12 * 1024 * 1024;
export default function BackgroundRemover() {
  const [original, setOriginal] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("image");
  const input = useRef<HTMLInputElement>(null);
  const urls = useRef<string[]>([]);
  useEffect(() => () => { urls.current.forEach(URL.revokeObjectURL); }, []);
  function clear() { urls.current.forEach(URL.revokeObjectURL); urls.current = []; setOriginal(null); setResult(null); setError(""); if (input.current) input.current.value = ""; }
  async function process(file?: File) {
    if (!file) return;
    clear();
    if (!(["image/jpeg", "image/png", "image/webp"].includes(file.type))) { setError("Please select a JPG, PNG, or WebP image."); return; }
    if (file.size > MAX_SIZE) { setError("Please choose an image smaller than 12 MB."); return; }
    setFileName(file.name.replace(/\.[^.]+$/, ""));
    const preview = URL.createObjectURL(file); urls.current.push(preview); setOriginal(preview);
    setBusy(true);
    try {
      // The model downloads on first use; processing stays in the browser.
      const { removeBackground } = await import("@imgly/background-removal");
      const blob = await removeBackground(file, { output: { format: "image/png" } });
      const url = URL.createObjectURL(blob); urls.current.push(url); setResult(url);
    } catch (e) {
      console.error("Background removal failed", e);
      setError("Could not remove the background. Try a smaller image or a desktop browser with more available memory.");
    } finally { setBusy(false); }
  }
  return <main className="mx-auto min-h-[75vh] max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
    <div className="mb-8"><p className="text-sm font-bold uppercase tracking-widest text-indigo-600">Free AI Image Tool</p><h1 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-5xl">AI Background Remover</h1><p className="mt-3 max-w-2xl text-slate-600">Remove image backgrounds and download a transparent PNG. No account or image upload to our server required.</p></div>
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-8">
      <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" aria-label="Choose image" onChange={e => void process(e.target.files?.[0])}/>
      {!original ? <button type="button" onClick={() => input.current?.click()} onDragOver={e => e.preventDefault()} onDrop={e => {e.preventDefault(); void process(e.dataTransfer.files?.[0]);}} className="flex min-h-64 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/50 px-5 text-center hover:bg-indigo-50 focus-visible:outline-2 focus-visible:outline-indigo-600"><ImagePlus className="mb-4 text-indigo-600" size={42}/><span className="text-lg font-bold text-slate-900">Choose an image or drop it here</span><span className="mt-2 text-sm text-slate-600">JPG, PNG or WebP · up to 12 MB</span></button> : <><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-slate-600">{busy ? "Removing background — first run may download AI model files…" : result ? "Your transparent image is ready" : "Image selected"}</p><button type="button" disabled={busy} onClick={clear} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50"><X size={16}/> Clear</button></div><div className="grid gap-4 md:grid-cols-2"><div><h2 className="mb-2 font-semibold text-slate-800">Original</h2><div className="flex min-h-56 items-center justify-center overflow-hidden rounded-xl bg-slate-100 p-3"><img src={original} alt="Original uploaded image" className="max-h-96 max-w-full object-contain"/></div></div><div><h2 className="mb-2 font-semibold text-slate-800">Background removed</h2><div className="flex min-h-56 items-center justify-center overflow-hidden rounded-xl p-3" style={{backgroundColor:"#fff",backgroundImage:"linear-gradient(45deg,#e2e8f0 25%,transparent 25%),linear-gradient(-45deg,#e2e8f0 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#e2e8f0 75%),linear-gradient(-45deg,transparent 75%,#e2e8f0 75%)",backgroundSize:"20px 20px",backgroundPosition:"0 0,0 10px,10px -10px,-10px 0"}}>{result ? <img src={result} alt="Image with transparent background" className="max-h-96 max-w-full object-contain"/> : busy ? <div role="status" className="flex flex-col items-center gap-3 text-slate-600"><LoaderCircle className="animate-spin text-indigo-600" size={35}/>Processing locally…</div> : <span className="text-slate-500">Preview appears here</span>}</div></div></div>{result && <a href={result} download={`${fileName}-no-background.png`} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white hover:bg-indigo-700 sm:w-auto"><Download size={19}/> Download transparent PNG</a>}</>}
      {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    </div><p className="mt-5 flex items-start gap-2 text-sm text-slate-500"><ShieldCheck size={18} className="shrink-0"/> Images are processed on your device. The AI model is downloaded when needed; performance varies by device and browser.</p>
  </main>;
}
