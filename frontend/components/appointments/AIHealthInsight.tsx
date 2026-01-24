"use client";

import { Sparkles } from 'lucide-react';

export function AIHealthInsight() {
    return (
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-200">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl translate-x-10 -translate-y-10"></div>

            <div className="relative z-10 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl">
                        <Sparkles size={20} className="text-yellow-300" />
                    </div>
                    <h3 className="font-black text-lg">AI Health Insight</h3>
                </div>

                <div className="flex-1 space-y-4">
                    <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                        <div className="text-xs font-bold text-indigo-200 uppercase mb-1">Health Score</div>
                        <div className="text-3xl font-black">82/100</div>
                        <div className="w-full h-1 bg-black/20 rounded-full mt-2 overflow-hidden">
                            <div className="w-[82%] h-full bg-green-400 rounded-full"></div>
                        </div>
                    </div>

                    <p className="text-sm font-medium text-indigo-100 leading-relaxed">
                        Patient shows consistent improvement. BP has normalized compared to last 3 visits.
                        <span className="font-bold text-white block mt-2">✨ Suggestion: Review Iron supplements dosage.</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
