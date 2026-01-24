"use client";

import { Activity, Utensils, ClipboardList } from 'lucide-react';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { SectionHeader } from '@/components/ui/section-header';

export function OverviewTab() {
    const VITALS_HISTORY = [
        { time: '00:00', sys: 118, dia: 78, px: 72, temp: 98.4, spo2: 98 },
        { time: '04:00', sys: 122, dia: 82, px: 75, temp: 98.6, spo2: 97 },
        { time: '08:00', sys: 120, dia: 80, px: 74, temp: 99.1, spo2: 98 },
        { time: '12:00', sys: 130, dia: 85, px: 82, temp: 99.4, spo2: 96 },
        { time: '16:00', sys: 125, dia: 82, px: 78, temp: 98.8, spo2: 98 },
        { time: '20:00', sys: 119, dia: 79, px: 73, temp: 98.5, spo2: 99 },
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                {/* 1. Blood Pressure - Line Chart */}
                <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl">
                    <SectionHeader icon={Activity} title="Blood Pressure Trends" iconClassName="text-indigo-500" />
                    <div className="h-64 w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={VITALS_HISTORY}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} domain={[60, 160]} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Line type="monotone" dataKey="sys" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1' }} name="Systolic" />
                                <Line type="monotone" dataKey="dia" stroke="#a855f7" strokeWidth={3} dot={{ r: 4, fill: '#a855f7' }} name="Diastolic" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 2. Temperature & Pulse Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl">
                        <SectionHeader icon={Activity} title="Temperature (°F)" iconClassName="text-orange-500" />
                        <div className="h-48 w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={VITALS_HISTORY}>
                                    <defs>
                                        <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f97316" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                                    <YAxis hide domain={[96, 102]} />
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                                    <Area type="monotone" dataKey="temp" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#tempGradient)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl">
                        <SectionHeader icon={Activity} title="Pulse Rate (bpm)" iconClassName="text-rose-500" />
                        <div className="h-48 w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={VITALS_HISTORY}>
                                    <defs>
                                        <linearGradient id="pulseGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#e11d48" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#e11d48" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                                    <YAxis hide domain={[50, 120]} />
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                                    <Area type="monotone" dataKey="px" stroke="#e11d48" strokeWidth={3} fillOpacity={1} fill="url(#pulseGradient)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* 3. SpO2 */}
                <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl">
                    <SectionHeader icon={Activity} title="SpO2 Saturation (%)" iconClassName="text-emerald-500" />
                    <div className="h-48 w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={VITALS_HISTORY}>
                                <defs>
                                    <linearGradient id="spo2Gradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} domain={[90, 100]} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                                <Area type="monotone" dataKey="spo2" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#spo2Gradient)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl">
                    <SectionHeader icon={Utensils} title="Current Diet" iconClassName="text-emerald-500" />
                    <div className="mt-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                        <div className="text-2xl font-black text-emerald-700">Liquid Diet</div>
                        <p className="text-xs text-emerald-600 font-medium mt-1">Started: Today, 08:00 AM</p>
                    </div>
                    <div className="mt-4 text-sm text-slate-500 font-medium">
                        Patient is NBM (Nil by Mouth) post 10 PM for scheduled ultrasound tomorrow.
                    </div>
                </div>

                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl">
                    <SectionHeader icon={ClipboardList} title="Active Nursing Tasks" />
                    <div className="mt-4 space-y-3">
                        {['Check BP every 2 hrs', 'Insulin 10U before lunch', 'SpO2 Monitoring'].map((task, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                                <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-rose-500 animate-pulse' : 'bg-slate-300'}`}></div>
                                <span className="text-sm font-bold text-slate-700">{task}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
