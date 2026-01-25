"use client";

import { AlertTriangle, TrendingUp, Activity, Heart, Wind, Cigarette, Beer } from 'lucide-react';
import { SectionHeader } from '@/components/ui/section-header';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const DUMMY_HEALTH_DATA = [
    { date: '2025-08-15', score: 92, vitals: { bp: '120/80', hr: 72 }, insight: 'Optimal health maintained.', habits: [] },
    { date: '2025-09-10', score: 88, vitals: { bp: '124/82', hr: 75 }, insight: 'Slight stress increase.', habits: ['Work Stress'] },
    { date: '2025-10-05', score: 85, vitals: { bp: '128/84', hr: 78 }, insight: 'Sedentary impact.', habits: ['Sedentary'] },
    { date: '2025-11-20', score: 78, vitals: { bp: '135/88', hr: 82 }, insight: 'Dietary slip.', habits: ['Poor Diet', 'Sedentary'] },
    { date: '2025-12-15', score: 72, vitals: { bp: '142/90', hr: 88 }, insight: 'Smoking recurrence detected.', habits: ['Smoking', 'High Sodium'] },
    { date: '2026-01-25', score: 65, vitals: { bp: '145/94', hr: 92 }, insight: 'Critical decline.', habits: ['Heavy Smoking', 'Alcohol', 'Sedentary'] },
];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-slate-900/95 text-white p-4 rounded-xl shadow-2xl border border-slate-700 max-w-[280px] backdrop-blur-md">
                <div className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">{new Date(data.date).toLocaleDateString()}</div>

                <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold text-slate-300">Health Score</span>
                    <span className={`text-2xl font-black ${data.score < 70 ? 'text-red-400' : 'text-emerald-400'}`}>
                        {data.score}
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4 bg-slate-800/50 p-2 rounded-lg">
                    <div className="flex items-center gap-2">
                        <Heart size={12} className="text-rose-400" />
                        <span className="text-xs font-mono font-bold text-slate-200">{data.vitals.bp}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Activity size={12} className="text-blue-400" />
                        <span className="text-xs font-mono font-bold text-slate-200">{data.vitals.hr} bpm</span>
                    </div>
                </div>

                {data.habits && data.habits.length > 0 && (
                    <div className="mb-4">
                        <div className="text-[10px] font-bold text-amber-400 uppercase mb-1 flex items-center gap-1">
                            <AlertTriangle size={10} /> Risk Factors
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {data.habits.map((h: string, i: number) => (
                                <span key={i} className="text-[10px] px-1.5 py-0.5 bg-amber-500/10 text-amber-200 border border-amber-500/20 rounded">
                                    {h}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <div className="relative pl-3 border-l-2 border-indigo-500">
                    <div className="text-[10px] font-bold text-indigo-400 uppercase mb-0.5 flex items-center gap-1">
                        <TrendingUp size={10} /> AI Insight
                    </div>
                    <p className="text-xs leading-relaxed text-slate-300 font-medium">
                        {data.insight}
                    </p>
                </div>
            </div>
        );
    }
    return null;
};

export function VisitHistory({ history }: { history?: any[] }) {
    return (
        <div className="space-y-6">
            {/* Health Score Graph */}
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden relative group">
                <div className="flex items-center justify-between mb-2">
                    <SectionHeader icon={TrendingUp} title="Health Score Trend" iconClassName="text-indigo-600" />
                    <div className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-100 flex items-center gap-1">
                        Last 6 Months
                    </div>
                </div>

                <div className="h-[200px] w-full mt-4 -ml-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={DUMMY_HEALTH_DATA}>
                            <defs>
                                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#94a3b8' }}
                                tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, { month: 'short' })}
                                dy={10}
                            />
                            <YAxis hide domain={[50, 100]} />
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#6366f1', strokeWidth: 2, strokeDasharray: '4 4' }} />
                            <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="3 3" />
                            <Area
                                type="monotone"
                                dataKey="score"
                                stroke="#6366f1"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorScore)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-2 text-center text-xs text-slate-400 font-medium">hover over points for insights & risk factors</div>
            </div>

            {/* Existing Risks */}
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl">
                <SectionHeader icon={AlertTriangle} title="Risk Factors" iconClassName="text-amber-500" />
                <div className="mt-4 flex flex-wrap gap-2">
                    {['Smoker (Occasional)', 'Family History of Diabetes', 'High Stress Job'].map((risk, i) => (
                        <span key={i} className="px-3 py-1.5 bg-amber-50 text-amber-700 text-xs font-bold rounded-lg border border-amber-100 flex items-center gap-1">
                            {risk === 'Smoker (Occasional)' && <Wind size={12} />}
                            {risk}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
