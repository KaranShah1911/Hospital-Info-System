"use client";

import { PageHeader } from '@/components/ui/page-header';
import { Calendar, Filter, Search, Clock, MapPin, User, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function DoctorAppointments() {
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                // Fetch ALL appointments for today for "Doctor" 
                const res = await api.get('/appointments');
                setAppointments(res.data.data || []);
            } catch (error) {
                console.error(error);
                toast.error("Failed to load appointments");
            } finally {
                setLoading(false);
            }
        };
        fetchAppointments();
    }, []);

    const filtered = appointments.filter((a: any) =>
        a.status !== 'Completed' &&
        (a.patient?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.patient?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.patient?.uhid?.includes(searchTerm))
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <PageHeader title="Appointments" description="Manage your consultation schedule." />
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search Patient..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-white font-medium text-sm focus:ring-2 focus:ring-indigo-100 outline-none w-64"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
                <div className="grid grid-cols-1 divide-y divide-slate-100">
                    {loading && <div className="p-8 text-center text-slate-400">Loading appointments...</div>}
                    {!loading && filtered.length === 0 && <div className="p-8 text-center text-slate-400">No appointments found.</div>}

                    {filtered.map((apt: any) => (
                        <div key={apt.id} className="p-6 hover:bg-slate-50 transition-colors group flex flex-col md:flex-row md:items-center gap-6">
                            <div className="flex items-center gap-4 min-w-[150px]">
                                <div className={`p-3 rounded-xl font-black text-center ${apt.status === 'CheckedIn' ? 'bg-emerald-50 text-emerald-700' : 'bg-indigo-50 text-indigo-700'}`}>
                                    <span className="text-xs opacity-60 block">TOKEN</span>
                                    {apt.tokenNumber}
                                </div>
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="font-bold text-lg text-slate-800">{apt.patient?.firstName} {apt.patient?.lastName}</h3>
                                    <span className={`px-2 py-0.5 text-[10px] font-black uppercase rounded-full tracking-wider ${apt.status === 'CheckedIn' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                                        {apt.status}
                                    </span>
                                </div>
                                <div className="flex items-center gap-6 text-xs font-medium text-slate-500">
                                    <span className="flex items-center gap-1.5"><User size={14} /> {apt.patient?.uhid}</span>
                                    <span className="flex items-center gap-1.5"><Clock size={14} /> {new Date(apt.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Link href={`/dashboard/doctor/appointments/${apt.id}`}>
                                    <button className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
                                        Open Chart
                                    </button>
                                </Link>
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
