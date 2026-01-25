import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Sparkles, CheckCircle, Printer, Loader2 } from 'lucide-react';
import { SectionHeader } from '@/components/ui/section-header';
import Link from 'next/link';
import api from '@/lib/api';
import { toast } from 'sonner';

export function PostOpSummary({ surgery }: { surgery: any }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleComplete = async () => {
        setLoading(true);
        try {
            await api.patch(`/ot/surgeries/${surgery.id}/status`, {
                status: 'Completed'
            });
            toast.success("Surgery Marked as Completed");
            router.push('/dashboard/doctor/surgery');
        } catch (error) {
            console.error("Failed to complete surgery", error);
            toast.error("Failed to update status");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Success Banner */}
            <div className="bg-emerald-500 rounded-[2.5rem] p-8 text-center text-white relative overflow-hidden shadow-xl shadow-emerald-200">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                <div className="relative z-10 flex flex-col items-center gap-4">
                    <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
                        <CheckCircle size={40} />
                    </div>
                    <h2 className="text-3xl font-black">Surgery Completed Successfully</h2>
                    <p className="font-medium text-emerald-100">Total Duration: 01:24:12</p>
                </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                <div className="flex items-center justify-between mb-8 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl">
                            <Sparkles size={20} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-900">AI Operative Summary</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Auto-generated from audio logs</p>
                        </div>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 font-bold rounded-xl hover:bg-slate-100 transition-colors">
                        <Printer size={16} /> Print
                    </button>
                </div>

                <div className="relative z-10">
                    <textarea
                        className="w-full h-96 p-6 bg-slate-50 rounded-3xl border border-slate-200 font-medium text-slate-700 leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-100 resize-none"
                        defaultValue={`PREOPERATIVE DIAGNOSIS: ${surgery?.procedureName || 'Acute Appendicitis'}.
POSTOPERATIVE DIAGNOSIS: ${surgery?.procedureName || 'Acute Suppurative Appendicitis'}.
PROCEDURE PERFORMED: ${surgery?.procedureName}.
ANAESTHESIA: General Endotracheal.

FINDINGS:
1.  Inflamed, turgid appendix with fibrinopurulent exudate.
2.  Minimal free fluid in the pelvis.
3.  Base of appendix healthy.
4.  Small bowel and other viscera normal.

PROCEDURE DETAILS:
Pneumoperitoneum created. Ports inserted (10mm umbilical, 5mm suprapubic, 5mm LIF). Diagnostic laparoscopy confirmed findings. Mesoappendix cauterized and divided using bipolar. Appendix base ligated with endoloops (x2). Appendix transected and retrieved in bag. Hemostasis confirmed. Counts correct. Skin closed with Monocryl 4-0.

PLAN:
- IV Antibiotics x 24h.
- Analgesics SOS.
- Soft diet once bowel sounds audible.
- Discharge planned for tomorrow.`}
                    />
                </div>

                <div className="mt-8 flex justify-end gap-4 relative z-10">
                    <Link href="/dashboard/doctor/surgery">
                        <button className="px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-2xl transition-colors">
                            Close
                        </button>
                    </Link>
                    <button
                        onClick={handleComplete}
                        disabled={loading}
                        className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-xl shadow-indigo-200 transition-all hover:scale-105 flex items-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <><CheckCircle size={20} /> Verify & Sign Record</>}
                    </button>
                </div>
            </div>
        </div>
    );
}
