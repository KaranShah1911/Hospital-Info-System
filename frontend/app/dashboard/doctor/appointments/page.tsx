"use client";

import { PageHeader } from '@/components/ui/page-header';
import { Calendar, Filter, Search, Clock, MapPin, User } from 'lucide-react';

export default function DoctorAppointments() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <PageHeader title="Appointments" description="Manage your consultation schedule." />
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input type="text" placeholder="Search Patient..." className="pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-white font-medium text-sm focus:ring-2 focus:ring-indigo-100 outline-none w-64" />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
                <div className="grid grid-cols-1 divide-y divide-slate-100">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="p-6 hover:bg-slate-50 transition-colors group flex flex-col md:flex-row md:items-center gap-6">
                            <div className="flex items-center gap-4 min-w-[150px]">
                                <div className="p-3 bg-indigo-50 text-indigo-700 rounded-xl font-black text-center">
                                    <span className="text-xs opacity-60 block">TIME</span>
                                    10:0{i} AM
                                </div>
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="font-bold text-lg text-slate-800">Anjali Gupta</h3>
                                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-black uppercase rounded-full tracking-wider">Confirmed</span>
                                </div>
                                <div className="flex items-center gap-6 text-xs font-medium text-slate-500">
                                    <span className="flex items-center gap-1.5"><User size={14} /> 28y / Female</span>
                                    <span className="flex items-center gap-1.5"><MapPin size={14} /> OPD Room 4</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
                                    Start Consult
                                </button>
                                <button className="p-2.5 border border-slate-200 rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors">
                                    <Calendar size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
