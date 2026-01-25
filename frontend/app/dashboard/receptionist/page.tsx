"use client";
import api from '@/lib/api';

import React from 'react';
import Link from 'next/link';
import {
    UserPlus, Calendar, Shield, Activity, CreditCard,
    ArrowRight, Users, Clock, AlertCircle
} from 'lucide-react';

export default function ReceptionistDashboard() {
    const modules = [
        {
            title: 'Patient Registration',
            desc: 'New OPD/IPD Registration',
            icon: UserPlus,
            href: '/dashboard/receptionist/registration',
            color: 'bg-blue-500'
        },
        {
            title: 'IPD Admission',
            desc: 'Bed Allocation & Intake',
            icon: Activity,
            href: '/dashboard/receptionist/ipd',
            color: 'bg-emerald-500' // Highlighted as it is implemented
        },
        {
            title: 'Appointments',
            desc: 'Schedule & Manage Visits',
            icon: Calendar,
            href: '/dashboard/receptionist/appointments',
            color: 'bg-indigo-500'
        },
        {
            title: 'Emergency',
            desc: 'Trauma & Urgent Care',
            icon: Shield,
            href: '/dashboard/receptionist/emergency',
            color: 'bg-rose-500'
        },
        {
            title: 'Billing',
            desc: 'Invoices & Payments',
            icon: CreditCard,
            href: '/dashboard/receptionist/billing',
            color: 'bg-amber-500'
        },
    ];

    const [searchQuery, setSearchQuery] = React.useState('');
    const [searchResults, setSearchResults] = React.useState<any[]>([]);
    const [searching, setSearching] = React.useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery) return;
        setSearching(true);
        try {
            // Search by UHID
            // Attempting to use the /patients/search endpoint which returns a single patient or we can use /suggestions for multiple?
            // User said "get those patients", implies list? But UHID usually unique.
            // Let's assume unique for now as per previous logic.
            const res = await api.get(`/patients/search?uhid=${searchQuery}`);
            if (res.data) {
                setSearchResults([res.data]);
            } else {
                setSearchResults([]);
            }
        } catch (error) {
            console.error(error);
            setSearchResults([]);
        } finally {
            setSearching(false);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Front Desk Overview</h1>
                <p className="text-slate-500 font-medium mt-1">Manage patient flow and hospital admissions.</p>
            </div>

            {/* MPI Lookup Section */}
            <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl opacity-50 pointer-events-none"></div>
                <h2 className="text-xs font-black text-indigo-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Users size={16} /> Master Patient Index (MPI)
                </h2>

                <form onSubmit={handleSearch} className="flex gap-4 mb-6 relative z-10">
                    <input
                        type="text"
                        placeholder="Search by UHID (e.g. P-2026-19)..."
                        className="flex-1 px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-lg font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit" disabled={searching} className="px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all disabled:opacity-70">
                        {searching ? 'Locating...' : 'Search Index'}
                    </button>
                </form>

                {searchResults.length > 0 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                        <h3 className="text-xs font-bold text-slate-400 uppercase">Search Results</h3>
                        {searchResults.map((patient: any) => (
                            <div key={patient.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between hover:bg-white hover:shadow-md transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-black text-lg">
                                        {patient.firstName[0]}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 text-lg">{patient.firstName} {patient.lastName}</p>
                                        <p className="text-xs text-slate-500 font-medium flex gap-2">
                                            <span>UHID: {patient.uhid}</span>
                                            <span>•</span>
                                            <span>{patient.phone}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Link href={`/dashboard/receptionist/registration?edit=${patient.id}`} className="px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">
                                        View Profile
                                    </Link>
                                    <Link href={`/dashboard/receptionist/ipd?patientId=${patient.id}`} className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700">
                                        Admit / Visit
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-white rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                        <Users size={24} />
                    </div>
                    <div>
                        <div className="text-2xl font-black text-slate-900">124</div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Today's Visits</div>
                    </div>
                </div>
                <div className="p-6 bg-white rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
                        <Clock size={24} />
                    </div>
                    <div>
                        <div className="text-2xl font-black text-slate-900">12m</div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg Wait Time</div>
                    </div>
                </div>
                <div className="p-6 bg-white rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="p-3 bg-rose-50 rounded-2xl text-rose-600">
                        <AlertCircle size={24} />
                    </div>
                    <div>
                        <div className="text-2xl font-black text-slate-900">3</div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Emergency Cases</div>
                    </div>
                </div>
            </div>

            {/* Module Grid */}
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mt-8">Quick Access Modules</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {modules.map((mod, i) => (
                    <Link
                        key={i}
                        href={mod.href}
                        className="group p-6 bg-white rounded-4xl border border-slate-200 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/10 transition-all relative overflow-hidden"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3.5 rounded-2xl text-white shadow-lg ${mod.color}`}>
                                <mod.icon size={24} />
                            </div>
                            <div className="p-2 bg-slate-50 rounded-full text-slate-300 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                <ArrowRight size={20} />
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-1">{mod.title}</h3>
                        <p className="text-slate-500 text-sm font-medium">{mod.desc}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
