"use client";

import { PageHeader } from '@/components/ui/page-header';
import { SectionHeader } from '@/components/ui/section-header';
import { Activity, Users, Clock, Calendar, ArrowRight, Stethoscope } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function DoctorOverview() {
    const [stats, setStats] = useState({
        pendingConsults: 0,
        admittedPatients: 0,
        surgeriesToday: 0
    });
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Appointments (Today)
                // Assuming we can get appointments without doctorID (returns all) or user context injects it
                // For demo, we are "The Doctor"
                const today = new Date().toISOString();
                const aptRes = await api.get(`/appointments?date=${today}`);
                const apts = aptRes.data.data || [];
                // console.log(apts);

                // Fetch Admitted Patients count
                const ipdRes = await api.get('/ipd/admissions');
                // console.log(ipdRes);
                const admissions = ipdRes.data.data || [];

                setAppointments(apts.slice(0, 5)); // Show top 5
                setStats({
                    pendingConsults: apts.filter((a: any) => a.status === 'Scheduled' || a.status === 'CheckedIn').length,
                    admittedPatients: admissions.length,
                    surgeriesToday: 0 // Mock for now as we didn't add getSurgeries endpoint yet
                });
            } catch (error) {
                console.error("Dashboard load failed", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="space-y-8">
            <PageHeader title="Doctor Dashboard" description="Overview of your clinical activities today." />

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Pending Consults', value: stats.pendingConsults, icon: Users, color: 'bg-indigo-600' },
                    { label: 'Admitted Patients', value: stats.admittedPatients, icon: Activity, color: 'bg-rose-500' },
                    { label: 'Surgeries Today', value: stats.surgeriesToday, icon: Stethoscope, color: 'bg-emerald-500' },
                    { label: 'Avg. Discharge Time', value: '45m', icon: Clock, color: 'bg-amber-500' },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col justify-between h-32"
                    >
                        <div className="flex items-start justify-between">
                            <div className={`p-2.5 rounded-xl ${stat.color} text-white shadow-lg shadow-white/50`}>
                                <stat.icon size={20} />
                            </div>
                            <span className="text-3xl font-black text-slate-800">{stat.value}</span>
                        </div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</span>
                    </motion.div>
                ))}
            </div>

            {/* Recent Activity / Schedule Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl">
                    <SectionHeader icon={Calendar} title="Today's Schedule" />
                    <div className="space-y-4">
                        {loading && <div className="text-center py-4 text-slate-400">Loading schedule...</div>}
                        {!loading && appointments.length === 0 && <div className="text-center py-4 text-slate-400">No appointments today.</div>}

                        {appointments.map((apt: any) => (
                            <div key={apt.id} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors group">
                                <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100 font-bold text-center w-16">
                                    <div className="text-xs text-slate-400">
                                        {new Date(apt.appointmentDate).getHours() >= 12 ? 'PM' : 'AM'}
                                    </div>
                                    <div className="text-lg text-slate-800">
                                        {new Date(apt.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-slate-800">{apt.type || 'Consultation'} - {apt.status}</h4>
                                    <p className="text-xs text-slate-500 font-medium">{apt.patient?.firstName} {apt.patient?.lastName} • {apt.patient?.uhid}</p>
                                </div>
                                <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-colors">
                                    <ArrowRight size={20} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <SectionHeader icon={Activity} title="Critical Alerts" iconClassName="text-rose-400" />
                        <div className="space-y-4">
                            <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                                <div className="flex gap-3">
                                    <div className="w-2 h-2 mt-2 rounded-full bg-rose-500 animate-pulse"></div>
                                    <div>
                                        <h4 className="font-bold text-sm">Bed 102 - O2 Desaturation</h4>
                                        <p className="text-xs text-white/60 mt-1">SpO2 dropped to 88% - 2m ago</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/5">
                                <div className="flex gap-3">
                                    <div className="w-2 h-2 mt-2 rounded-full bg-amber-500"></div>
                                    <div>
                                        <h4 className="font-bold text-sm">Lab Result Available</h4>
                                        <p className="text-xs text-white/60 mt-1">CBC for Patient #8291</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
