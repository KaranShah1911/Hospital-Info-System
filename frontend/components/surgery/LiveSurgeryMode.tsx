"use client";

import React, { useState, useEffect } from 'react';
import { Mic, Square, Save, Clock, Activity, Flag } from 'lucide-react';
import { SectionHeader } from '@/components/ui/section-header';

export function LiveSurgeryMode({ onComplete }: { onComplete: () => void }) {
    const [seconds, setSeconds] = useState(0);
    const [isRecording, setIsRecording] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setSeconds(s => s + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (totalSeconds: number) => {
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="space-y-8 animate-in fade-in zoom-in duration-500">
            {/* Timer & Status Bar */}
            <div className="bg-slate-900 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center justify-between text-white shadow-2xl shadow-indigo-500/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-[100px] rounded-full"></div>

                <div className="flex items-center gap-6 relative z-10">
                    <div className="p-4 bg-rose-500/20 rounded-2xl animate-pulse">
                        <div className="w-4 h-4 bg-rose-500 rounded-full shadow-[0_0_15px_rgba(244,63,94,0.6)]"></div>
                    </div>
                    <div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Elapsed Time</div>
                        <div className="text-5xl font-black font-mono tracking-wider">{formatTime(seconds)}</div>
                    </div>
                </div>

                <div className="flex items-center gap-4 mt-6 md:mt-0 relative z-10">
                    <div className="flex items-center gap-2 px-4 py-2 bg-indigo-500/20 rounded-lg border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
                        <Mic size={14} className="animate-pulse" /> Audio Active
                    </div>
                    <button
                        onClick={() => setIsRecording(!isRecording)}
                        className={`p-4 rounded-xl transition-all ${isRecording ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-rose-500 text-white shadow-lg'}`}
                    >
                        {isRecording ? <Square size={24} /> : <Mic size={24} />}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Live Transcript / Notes */}
                <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl flex flex-col h-[500px]">
                    <SectionHeader icon={Activity} title="Live Surgical Notes" description="Dictations are auto-transcribed here." />

                    <div className="flex-1 mt-6 p-6 bg-slate-50 rounded-3xl border border-slate-100 overflow-y-auto space-y-4">
                        <div className="flex gap-4">
                            <span className="text-xs font-mono text-slate-400 mt-1">00:15</span>
                            <p className="text-slate-600 font-medium">Incision made at McBurney's point. No excessive bleeding noted.</p>
                        </div>
                        <div className="flex gap-4">
                            <span className="text-xs font-mono text-slate-400 mt-1">04:30</span>
                            <p className="text-slate-600 font-medium">Appendix visualized. Inflammation present. Base appears distinct.</p>
                        </div>
                        <div className="flex gap-4 opacity-50">
                            <span className="text-xs font-mono text-slate-400 mt-1">Typing...</span>
                            <div className="flex gap-1 mt-2">
                                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-200"></span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 flex gap-4">
                        <input type="text" placeholder="Type a manual note..." className="flex-1 px-6 py-4 bg-slate-50 rounded-2xl border border-slate-200 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-100 placeholder:font-medium" />
                        <button className="p-4 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-colors">
                            <Save size={20} />
                        </button>
                    </div>
                </div>

                {/* Important Events */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl">
                        <SectionHeader icon={Flag} title="Flag Event" iconClassName="text-amber-500" />
                        <div className="mt-4 grid grid-cols-1 gap-3">
                            {['Tourniquet On', 'Tourniquet Off', 'Specimen Out', 'Implant Placed', 'Count Correct'].map((evt) => (
                                <button key={evt} className="p-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 transition-all text-left">
                                    {evt}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={onComplete}
                        className="w-full py-6 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-[2rem] shadow-xl shadow-rose-200 transition-all hover:scale-[1.02] flex flex-col items-center justify-center gap-1"
                    >
                        <Square size={24} fill="currentColor" />
                        <span className="text-lg">End Surgery</span>
                        <span className="text-[10px] opacity-60 font-medium uppercase tracking-widest">Generate Summary</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
