"use client";

import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { BedDouble, CheckCircle2, XCircle, Filter, RefreshCw } from 'lucide-react';
import { MOCK_BEDS } from '@/lib/constants';

export default function BedManagementPage() {
    const [filter, setFilter] = useState('All');

    return (
        <div className="max-w-[1400px] mx-auto space-y-8 pb-20">
            <div className="flex items-center justify-between">
                <PageHeader title="Bed Bureau" description="Real-time Occupancy Tracking" />
                <div className="flex gap-3">
                    <button className="p-3 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 font-bold flex items-center gap-2">
                        <Filter size={18} /> Filter
                    </button>
                    <button className="p-3 rounded-xl bg-indigo-600 text-white font-bold flex items-center gap-2 shadow-lg shadow-indigo-500/20">
                        <RefreshCw size={18} /> Sync Live
                    </button>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Total Beds', 'Available', 'Occupied', 'Maintenance'].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                        <div className="text-3xl font-black text-slate-900 mb-1">{i === 0 ? MOCK_BEDS.length : Math.floor(Math.random() * 20)}</div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat}</div>
                    </div>
                ))}
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Ward Overview</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {MOCK_BEDS.map((bed, i) => (
                        <div
                            key={bed.id}
                            className={`p-5 rounded-2xl border-2 flex flex-col justify-between h-32 transition-all cursor-pointer ${bed.status === 'Available'
                                    ? 'border-emerald-100 bg-emerald-50/50 hover:border-emerald-300'
                                    : bed.status === 'Occupied'
                                        ? 'border-indigo-100 bg-indigo-50/50 hover:border-indigo-300'
                                        : 'border-slate-100 bg-slate-50 hover:border-slate-300'
                                }`}
                        >
                            <div className="flex justify-between items-start">
                                <span className="font-black text-slate-900 text-lg">{bed.id}</span>
                                {bed.status === 'Available' ? <CheckCircle2 size={20} className="text-emerald-500" /> : <XCircle size={20} className="text-indigo-400" />}
                            </div>
                            <div>
                                <div className="text-sm font-bold text-slate-700">{bed.type}</div>
                                <div className={`text-xs font-bold uppercase tracking-wider mt-1 ${bed.status === 'Available' ? 'text-emerald-600' : 'text-indigo-500'
                                    }`}>
                                    {bed.status}
                                </div>
                            </div>
                        </div>
                    ))}
                    {/* Generate more mock beds for visual density */}
                    {[...Array(8)].map((_, i) => (
                        <div key={`mock-${i}`} className="p-5 rounded-2xl border-2 border-slate-100 bg-slate-50 flex flex-col justify-between h-32 opacity-60">
                            <div className="flex justify-between items-start">
                                <span className="font-black text-slate-900 text-lg">---</span>
                                <BedDouble size={20} className="text-slate-300" />
                            </div>
                            <div className="text-xs font-bold text-slate-400 uppercase">Unconfigured</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
