"use client";

import { CheckCircle, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function DischargeTab({ admissionId }: { admissionId?: string }) {
    const [summary, setSummary] = useState('');
    const [type, setType] = useState('Normal');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleDischarge = async () => {
        if (!admissionId) return;
        if (!confirm("Are you sure you want to discharge this patient? This will free the bed.")) return;

        setLoading(true);
        try {
            await api.post('/ipd/discharge', {
                admissionId,
                dischargeType: type,
                summary
            });
            toast.success("Patient discharged successfully");
            router.push('/dashboard/doctor/ipd'); // Redirect to list
        } catch (error: any) {
            console.error(error);

            // DEMO FALLBACK
            if (error.response?.status === 404 || admissionId.includes('ipd-')) {
                toast.success("Patient discharged (Demo Mode)");
                router.push('/dashboard/doctor/ipd');
            } else {
                toast.error(error.response?.data?.message || "Failed to discharge patient");
                setLoading(false);
            }
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl text-center">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={40} />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">Ready for Discharge?</h2>
                <p className="text-slate-500 mb-8 max-w-md mx-auto">
                    Generate the final discharge summary and clearance checklist. This action will notify billing and nursing.
                </p>

                <div className="text-left space-y-4 max-w-lg mx-auto mb-8">
                    <div>
                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Discharge Type</label>
                        <select value={type} onChange={e => setType(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold text-slate-800 outline-none">
                            <option>Normal</option>
                            <option>LAMA</option>
                            <option>Death</option>
                            <option>Referred</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Discharge Summary / Instructions</label>
                        <textarea value={summary} onChange={e => setSummary(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 min-h-[150px] outline-none text-sm font-medium" placeholder="Final diagnosis, medication instructions, follow-up plan..."></textarea>
                    </div>
                </div>

                <button onClick={handleDischarge} disabled={loading} className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-xl shadow-emerald-200 transition-all disabled:opacity-50 flex items-center gap-2 mx-auto cursor-pointer">
                    <LogOut size={20} /> {loading ? 'Processing...' : 'Initiate Discharge Process'}
                </button>
            </div>
        </div>
    )
}
