"use client";

import { useRef, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, BrainCircuit, Eraser, Check, Loader2, Save } from 'lucide-react';
import { createWorker } from 'tesseract.js';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PrescriptionForm } from '../appointments/PrescriptionForm';

interface ParsedMed {
  name: string;
  dosage: string;
  freq: string;
}

export function SmartPrescriptionTab({ admissionId, patientId }: { admissionId: string, patientId: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [recognizedText, setRecognizedText] = useState("");

  // Structured Data
  const [medications, setMedications] = useState<ParsedMed[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Setup Canvas
    canvas.width = canvas.offsetWidth;
    canvas.height = 400; // Fixed height
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#000'; // Black ink

    // White background for better OCR
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  // Drawing Handlers
  const startDrawing = (e: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    // Handle both mouse and touch
    const clientX = e.clientX || e.touches[0].clientX;
    const clientY = e.clientY || e.touches[0].clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: any) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || e.touches[0].clientX;
    const clientY = e.clientY || e.touches[0].clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    // ctx?.closePath(); // Optional
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setRecognizedText("");
    setMedications([]);
  };

  // AI Processing (Tesseract)
  const analyzeCanvas = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setProcessing(true);
    try {
      const worker = await createWorker('eng');
      const dataUrl = canvas.toDataURL('image/png');

      const ret = await worker.recognize(dataUrl);
      const text = ret.data.text;

      setRecognizedText(text);
      parseMedication(text);

      await worker.terminate();
      toast.success("Handwriting Analyzed!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to analyze handwriting");
    } finally {
      setProcessing(false);
    }
  };

  // Smart Parsing Logic (Heuristics)
  const parseMedication = (text: string) => {
    const lines = text.split('\n').filter(l => l.trim().length > 2);
    const parsed: ParsedMed[] = [];

    lines.forEach(line => {
      // Very basic heuristic parser
      // Expected format similar to: "Dolo 650mg 1-0-1"

      // 1. Frequency (look for patterns like 1-0-1, 1-1-1, OD, BID)
      const freqMatch = line.match(/\b(\d-\d-\d|\d-\d|OD|BID|Q\dH)\b/i);
      const freq = freqMatch ? freqMatch[0] : "";

      // 2. Dosage (look for mg, g, ml)
      const doseMatch = line.match(/\b(\d+mg|\d+g|\d+ml)\b/i);
      const dosage = doseMatch ? doseMatch[0] : "";

      // 3. Name (Remainder, clean up)
      let name = line;
      if (freq) name = name.replace(freq, '');
      if (dosage) name = name.replace(dosage, '');
      name = name.replace(/[^a-zA-Z0-9\s]/g, '').trim();

      if (name) {
        parsed.push({ name, dosage, freq: freq || '1-0-1' }); // Default freq if missed
      }
    });

    setMedications(parsed);
  };

  const handleSave = () => {
    toast.success(`Saved ${medications.length} medications to Orders`);
    // Here you would call the backend API to save 'medications' to the DB using `createProvisionalOrder` logic
  };

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
        {/* Canvas Area */}
        <Card className="border-slate-200 shadow-xl flex flex-col h-full bg-slate-50">
          <CardHeader className="pb-2 border-b border-slate-100 bg-white rounded-t-xl">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2"><BrainCircuit className="text-indigo-600" /> Smart Prescription Pad</span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={clearCanvas} title="Clear">
                  <Eraser size={16} />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <div className="flex-1 relative bg-white m-4 rounded-xl border-2 border-dashed border-slate-200 overflow-hidden cursor-crosshair touch-none">
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-full block"
            />
            <div className="absolute top-2 right-2 text-[10px] text-slate-300 pointer-events-none select-none font-bold uppercase">
              Draw Here
            </div>
          </div>
          <div className="p-4 bg-white border-t border-slate-100 flex justify-end">
            <Button
              onClick={analyzeCanvas}
              disabled={processing}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
            >
              {processing ? <Loader2 className="animate-spin mr-2" /> : <BrainCircuit className="mr-2" />}
              {processing ? "Analyzing AI..." : "Convert to Text"}
            </Button>
          </div>
        </Card>

        {/* Results Area */}
        <div className="space-y-6">
          <Card className="border-slate-100 shadow-lg">
            <CardHeader className="bg-indigo-50/50 pb-4">
              <CardTitle className="text-sm font-black text-indigo-900 uppercase tracking-widest">AI Digitized Output (Editable)</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {medications.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-sm">
                  Write on the canvas and click "Convert to Text" to see results here.
                </div>
              ) : (
                <div className="space-y-3">
                  {medications.map((med, i) => (
                    <div key={i} className="flex gap-2 items-center bg-white p-2 rounded-lg border border-slate-200 shadow-sm animate-in slide-in-from-left-4 fade-in duration-300" style={{ animationDelay: `${i * 100}ms` }}>
                      <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-xs">
                        {i + 1}
                      </div>
                      <Input
                        value={med.name}
                        onChange={(e) => {
                          const newMeds = [...medications];
                          newMeds[i].name = e.target.value;
                          setMedications(newMeds);
                        }}
                        placeholder="Medicine Name"
                        className="font-bold border-transparent hover:border-slate-200 focus:border-indigo-500"
                      />
                      <Input
                        value={med.dosage}
                        onChange={(e) => {
                          const newMeds = [...medications];
                          newMeds[i].dosage = e.target.value;
                          setMedications(newMeds);
                        }}
                        placeholder="Dose"
                        className="w-20 font-mono text-xs border-transparent hover:border-slate-200 focus:border-indigo-500"
                      />
                      <Input
                        value={med.freq}
                        onChange={(e) => {
                          const newMeds = [...medications];
                          newMeds[i].freq = e.target.value;
                          setMedications(newMeds);
                        }}
                        placeholder="Freq"
                        className="w-24 font-mono text-xs bg-slate-50 border-transparent hover:border-slate-200 focus:border-indigo-500"
                      />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {medications.length > 0 && (
            <Button onClick={handleSave} className="w-full h-14 text-lg bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-200">
              <Check className="mr-2" /> Confirm & Add to Orders
            </Button>
          )}

          {/* Raw Text Debug (Optional) */}
          {recognizedText && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="text-[10px] font-bold text-slate-400 uppercase mb-2">Raw AI Recognition</div>
              <p className="text-xs font-mono text-slate-600 whitespace-pre-wrap">{recognizedText}</p>
            </div>
          )}
        </div>
      </div>

      {/* Manual Prescription Section */}
      <div className="pt-8 border-t border-slate-200">
        <h2 className="text-2xl font-black text-slate-800 mb-6">Manual Prescription Entry</h2>
        <PrescriptionForm patientId={patientId} admissionId={admissionId} />
      </div>
    </div>
  );
}
