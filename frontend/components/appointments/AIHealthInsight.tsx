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
                        <div>
                            <h3 className="font-black text-lg">AI Health Insight</h3>
                            {summary && <div className="text-[10px] uppercase font-bold text-indigo-200 tracking-wider">Score: {summary.score}/100</div>}
                        </div>
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
                            <div className="flex justify-between items-center mb-2">
                                <div className="text-xs font-bold text-indigo-200 uppercase">Risk Level</div>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${summary.riskLevel === 'Critical' ? 'bg-rose-500 text-white' :
                                        summary.riskLevel === 'Moderate' ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white'
                                    }`}>
                                    {summary.riskLevel}
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {Object.entries(summary.breakdown || {}).map(([key, value]: any) => (
                                    value > 0 && (
                                        <span key={key} className="px-2 py-1 bg-rose-500/20 text-rose-200 text-xs font-bold rounded-lg border border-rose-500/20 capitalize">
                                            {key} Issue
                                        </span>
                                    )
                                ))}
                                {Object.values(summary.breakdown || {}).reduce((a: any, b: any) => a + b, 0) === 0 && (
                                    <span className="px-2 py-1 bg-emerald-500/20 text-emerald-200 text-xs font-bold rounded-lg border border-emerald-500/20">All Clear</span>
                                )}
                            </div>
                        </div>

                        <p className="text-sm font-medium text-indigo-100 leading-relaxed">
                            {summary.reasoning}
                            {summary.suggestions?.map((s: string, i: number) => (
                                <span key={i} className="font-bold text-white block mt-2 bg-indigo-900/30 p-3 rounded-xl border border-indigo-500/30">
                                    ✨ Suggestion: {s}
                                </span>
                            ))}
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
