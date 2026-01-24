"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserRole } from '@/types';
import { SIDEBAR_LINKS, ROLE_CONFIG } from '@/lib/constants';
import { ShieldCheck, LogOut, LayoutGrid } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface SidebarProps {
    userName?: string;
}

export function Sidebar({ userName = "Staff Member" }: SidebarProps) {
    const pathname = usePathname();
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        const storedRole = localStorage.getItem('role');
        if (storedRole) {
            setRole(storedRole);
        }
    }, []);

    if (!role) return null;

    const links = SIDEBAR_LINKS[role as keyof typeof SIDEBAR_LINKS] || [];
    const roleInfo = ROLE_CONFIG[role as keyof typeof ROLE_CONFIG];

    return (
        <div className="h-screen w-72 bg-[#0f172a] text-slate-300 flex flex-col border-r border-slate-800">
            {/* Header */}
            <div className="p-6 border-b border-slate-800/50">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-600/20">
                        <ShieldCheck size={20} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-lg font-black tracking-tight text-white leading-none">MedCore</h1>
                        <span className="text-[10px] font-bold text-indigo-400 tracking-wider">HIS V3.0</span>
                    </div>
                </div>
            </div>

            {/* User Info */}
            <div className="px-6 py-6">
                <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold ring-2 ring-indigo-500/50">
                        {userName.charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                        <div className="text-sm font-bold text-white truncate">{userName}</div>
                        <div className="text-[10px] uppercase font-bold text-indigo-400 truncate">{roleInfo?.label || role}</div>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
                <div className="px-2 py-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Module Access
                </div>

                {/* Dashboard Home - Hidden for Pharmacist as they default to Fulfillment */}
                {role !== UserRole.Pharmacist && (
                    <Link
                        href={`/dashboard/${role.toLocaleLowerCase()}`}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all group font-medium text-sm",
                            pathname === `/dashboard/${role.toLocaleLowerCase()}`
                                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 font-bold"
                                : "hover:bg-slate-800 hover:text-white"
                        )}
                    >
                        <LayoutGrid size={18} className={pathname === '/dashboard' ? "text-white" : "text-slate-500 group-hover:text-white"} />
                        Overview
                    </Link>
                )}

                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname.startsWith(link.href);

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all group font-medium text-sm",
                                isActive
                                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 font-bold"
                                    : "hover:bg-slate-800 hover:text-white"
                            )}
                        >
                            <Icon size={18} className={isActive ? "text-white" : "text-slate-500 group-hover:text-white"} />
                            {link.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-slate-800/50">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 hover:text-red-400 text-slate-400 transition-colors text-sm font-bold group">
                    <LogOut size={18} className="group-hover:text-red-400 transition-colors" />
                    Sign Out System
                </button>
            </div>
        </div>
    );
}
