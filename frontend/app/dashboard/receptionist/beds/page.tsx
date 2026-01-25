"use client";

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { BedDouble, CheckCircle2, XCircle, Filter, RefreshCw } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function BedManagementPage() {
    const [layout, setLayout] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchLayout = async () => {
        setLoading(true);
        try {
            const res = await api.get('/facility/layout');
            // Backend returns Departments -> Wards -> Beds
            // We want to flatten this or show by Ward
            setLayout(res.data.data || []);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load bed layout");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLayout();
    }, []);

    // Helper to extract all beds from layout for stats
    const allBeds = layout.flatMap(d => d.wards.flatMap((w: any) => w.beds.map((b: any) => ({ ...b, wardName: w.name, deptName: d.name }))));
    const availableCount = allBeds.filter((b: any) => b.status === "Available").length;
    const occupiedCount = allBeds.filter((b: any) => b.status === "Occupied").length;

    return (
        <div className="max-w-[1400px] mx-auto space-y-8 pb-20">
            <div className="flex items-center justify-between">
                <PageHeader title="Bed Bureau" description="Real-time Occupancy Tracking" />
                <div className="flex gap-3">
                    <button onClick={fetchLayout} disabled={loading} className="p-3 rounded-xl bg-indigo-600 text-white font-bold flex items-center gap-2 shadow-lg shadow-indigo-500/20 hover:bg-indigo-700">
                        <RefreshCw size={18} className={loading ? "animate-spin" : ""} /> Sync Live
                    </button>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Beds', val: allBeds.length },
                    { label: 'Available', val: availableCount },
                    { label: 'Occupied', val: occupiedCount },
                    { label: 'Maintenance', val: allBeds.filter((b: any) => b.status !== 'Available' && b.status !== 'Occupied').length }
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                        <div className="text-3xl font-black text-slate-900 mb-1">{stat.val}</div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</div>
                    </div>
                ))}
            </div>

            {layout.length === 0 && !loading && (
                <div className="p-12 text-center text-slate-400 font-bold bg-white rounded-3xl border border-slate-100">
                    No hospital layout configured. Please ask Admin to set up Wards & Beds.
                </div>
            )}

            {/* Render by Department / Ward */}
            <div className="space-y-8">
                {layout.map((dept: any) => (
                    dept.wards.length > 0 && (
                        <div key={dept.id} className="space-y-4">
                            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                                <span className="w-2 h-8 bg-indigo-500 rounded-full"></span>
                                {dept.name}
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {dept.wards.map((ward: any) => (
                                    <div key={ward.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                                        <div className="flex justify-between items-center mb-6">
                                            <h4 className="font-bold text-slate-700 uppercase tracking-widest text-xs flex items-center gap-2">
                                                {ward.name}
                                                <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] text-slate-500">{ward.type}</span>
                                            </h4>
                                            <span className="text-xs font-bold text-slate-400">Floor {ward.floorNumber}</span>
                                        </div>

                                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                                            {ward.beds.length === 0 && <div className="text-xs text-slate-400 col-span-3">No beds in this ward.</div>}
                                            {ward.beds.map((bed: any) => (
                                                <div
                                                    key={bed.id}
                                                    className={`p-4 rounded-xl border flex flex-col justify-between h-24 transition-all ${bed.status === 'Available'
                                                            ? 'border-emerald-100 bg-emerald-50/30 hover:bg-emerald-50'
                                                            : bed.status === 'Occupied'
                                                                ? 'border-indigo-100 bg-indigo-50/30 hover:bg-indigo-50'
                                                                : 'border-slate-100 bg-slate-50'
                                                        }`}
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <span className="font-black text-slate-900 text-sm">{bed.bedNumber}</span>
                                                        {bed.status === 'Available' ?
                                                            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div> :
                                                            <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                                                        }
                                                    </div>
                                                    <div className={`text-[10px] font-black uppercase tracking-wider ${bed.status === 'Available' ? 'text-emerald-600' :
                                                            bed.status === 'Occupied' ? 'text-indigo-500' : 'text-slate-400'
                                                        }`}>
                                                        {bed.status}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                ))}
            </div>
        </div>
    );
}
