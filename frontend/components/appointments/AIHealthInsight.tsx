"use client";

import { Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '@/lib/api';

export function AIHealthInsight({ patientId, context }: { patientId?: string, context?: string }) {
    const [summary, setSummary] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const generateInsight = async () => {
        if (!patientId) return;
        setLoading(true);
        try {
            const res = await api.post('/ai/summary', { patientId, clinicalContext: context });
            setSummary(res.data.data);
        } catch (error) {
            console.error("AI Generation failed", error);
        } finally {
            setLoading(false);
        }
    };

    // Auto-generate on mount if patientId exists? Or wait for user?
    // Let's wait for user or auto-load if critical? Let's auto-load for "Wow" factor.
    useEffect(() => {
        if (patientId && !summary) {
            generateInsight();
        }
    }, [patientId]);

    return (
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-200 min-h-[300px] flex flex-col">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl translate-x-10 -translate-y-10"></div>

            <div className="relative z-10 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl">
                            <Sparkles size={20} className="text-yellow-300" />
                        </div>
                        <h3 className="font-black text-lg">AI Health Insight</h3>
                    </div>
                    {summary && (
                        <button onClick={generateInsight} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3">
                        <Loader2 size={32} className="animate-spin text-indigo-200" />
                        <p className="text-sm font-medium text-indigo-200 animate-pulse">Analyzing history & generating insights...</p>
                    </div>
                ) : summary ? (
                    <div className="flex-1 space-y-4">
                        <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                            <div className="text-xs font-bold text-indigo-200 uppercase mb-1">AI Risk Assessment</div>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {summary.riskFactors?.map((risk: string, i: number) => (
                                    <span key={i} className="px-2 py-1 bg-rose-500/20 text-rose-200 text-xs font-bold rounded-lg border border-rose-500/20">
                                        {risk}
                                    </span>
                                ))}
                                {!summary.riskFactors?.length && <span className="text-sm font-bold">Low Risk</span>}
                            </div>
                        </div>

                        <p className="text-sm font-medium text-indigo-100 leading-relaxed">
                            {summary.summary}
                            <span className="font-bold text-white block mt-2 bg-indigo-900/30 p-3 rounded-xl border border-indigo-500/30">
                                ✨ Suggestion: {summary.recommendation}
                            </span>
                        </p>
                    </div>
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-indigo-300 text-sm">No insights available.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
