"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Calendar, Activity, Scissors, User, LogOut, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

const NAV_ITEMS = [
    { label: 'Overview', href: '/dashboard/doctor/overview', icon: LayoutDashboard },
    { label: 'Appointments', href: '/dashboard/doctor/appointments', icon: Calendar },
    { label: 'In-Patient (IPD)', href: '/dashboard/doctor/ipd', icon: Activity },
    { label: 'Surgery (OT)', href: '/dashboard/doctor/surgery', icon: Scissors },
];

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="flex bg-[#f8faff] min-h-screen font-sans">
            {/* Sidebar */}
            <aside className="w-72 bg-white border-r border-indigo-50/50 hidden lg:flex flex-col fixed inset-y-0 z-50 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.02)]">
                <div className="p-8 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
                            <Activity size={24} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">MediFlow</h1>
                            <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Doctor Portal</span>
                        </div>
                    </div>
                </div>

                <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    <div className="px-4 mb-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Main Menu</span>
                    </div>
                    {NAV_ITEMS.map((item) => {
                        const isActive = pathname.startsWith(item.href);
                        return (
                            <Link key={item.href} href={item.href} className="block group">
                                <div className={`relative flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 ${isActive ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}>
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute left-0 w-1 h-6 bg-indigo-600 rounded-r-full"
                                        />
                                    )}
                                    <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-500'} />
                                    <span className="font-bold text-sm">{item.label}</span>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                <div className="p-4 border-t border-slate-50">
                    <div className="bg-indigo-900 rounded-2xl p-4 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl translate-x-8 -translate-y-8"></div>
                        <div className="relative z-10 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-700 border-2 border-indigo-500 overflow-hidden flex items-center justify-center">
                                <User size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-bold truncate">Dr. Smith</div>
                                <div className="text-[10px] text-indigo-200 uppercase font-medium">Cardiology</div>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 lg:ml-72 min-h-screen">
                <div className="p-8 max-w-[1600px] mx-auto min-h-screen">
                    {children}
                </div>
            </main>
        </div>
    );
}
