import React from 'react';
import { Sidebar } from '@/components/Sidebar';
import { UserRole } from '@/types';
import { Bell, Search } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    // TODO: Replace with real user context
    const currentUser = {
        role: UserRole.Receptionist,
        name: "Alex Morgan"
    };

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
            <Sidebar role={currentUser.role} userName={currentUser.name} />

            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top Header */}
                <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10 sticky top-0">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="relative w-96 hidden md:block">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Global Search (Patients, Doctors, Reports)..."
                                className="w-full pl-12 pr-4 py-2.5 bg-slate-100 border-none rounded-xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500/20 outline-none text-slate-700"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="relative p-2.5 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                        </button>
                        <div className="h-8 w-px bg-slate-200 mx-2"></div>
                        <div className="text-right hidden sm:block">
                            <div className="text-xs font-bold text-slate-900">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hospital Ops: Normal</div>
                        </div>
                    </div>
                </header>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-auto p-8 relative">
                    {children}
                </div>
            </main>
        </div>
    );
}
