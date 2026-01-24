"use client";

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

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Front Desk Overview</h1>
                <p className="text-slate-500 font-medium mt-1">Manage patient flow and hospital admissions.</p>
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
                        className="group p-6 bg-white rounded-[2rem] border border-slate-200 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/10 transition-all relative overflow-hidden"
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
