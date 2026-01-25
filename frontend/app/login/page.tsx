"use client";

import React, { useState } from 'react';
import { UserRole } from '@/types';
import { ROLE_CONFIG } from '@/lib/constants';
import api from '@/lib/api';
import { toast } from 'react-toastify';
import { ShieldCheck, LogIn, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useStaffStore } from '@/context/staff';

export default function LoginPage() {
    const router = useRouter();
    const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.Admin);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { setStaff } = useStaffStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await api.post('/auth/login', {
                email,
                password
            });
            console.log(res.data);

            // Store in Zustand (Persisted)
            setStaff(res.data);

            toast.success("Login Successful! Redirecting...");
            setTimeout(() => {
                router.push(`/dashboard/${selectedRole.split(" ")[0].toLowerCase()}`);
            }, 1000);

        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || "Login failed. Please check your credentials.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-6 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white rounded-4xl shadow-2xl overflow-hidden relative z-10"
            >
                {/* Left Branding Side */}
                <div className="hidden lg:flex flex-col justify-between p-12 bg-linear-to-br from-indigo-700 to-blue-900 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-md border border-white/20">
                                <ShieldCheck size={32} />
                            </div>
                            <h1 className="text-2xl font-black tracking-tight">MedCore <span className="text-blue-300">HIS</span></h1>
                        </div>
                        <h2 className="text-4xl font-extrabold leading-tight mb-4">
                            Advanced Clinical <br /> Intelligence Suite
                        </h2>
                        <p className="text-blue-100 text-lg opacity-80 max-w-sm">
                            Empowering healthcare professionals with real-time data and seamless clinical workflows.
                        </p>
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-[0.2em] text-blue-200/60 mb-6">
                            <span className="w-12 h-px bg-blue-200/20"></span>
                            NABH & HIPAA CERTIFIED
                        </div>
                        <div className="flex -space-x-3 overflow-hidden">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="inline-block h-10 w-10 rounded-full ring-4 ring-indigo-700 bg-slate-200 border border-indigo-500"></div>
                            ))}
                            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-500 text-[10px] font-black ring-4 ring-indigo-700">+4.2k Users</div>
                        </div>
                    </div>

                    {/* Abstract graphic */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                        className="absolute bottom-[-100px] right-[-100px] w-80 h-80 border-40 border-white/5 rounded-full"
                    ></motion.div>
                </div>

                {/* Right Form Side */}
                <div className="p-8 lg:p-12 bg-white">
                    <div className="mb-10 text-center lg:text-left">
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">Welcome Back</h3>
                        <p className="text-slate-500 font-medium">Please select your operational role to continue.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-4">
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">System Access Role</label>
                            <div className="grid grid-cols-2 gap-3">
                                {Object.values(UserRole).map((role) => (
                                    <motion.button
                                        key={role}
                                        type="button"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setSelectedRole(role)}
                                        className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left ${selectedRole === role
                                            ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 shadow-sm ring-4 ring-indigo-600/10'
                                            : 'border-slate-100 text-slate-500 hover:border-slate-200 hover:bg-slate-50'
                                            }`}
                                    >
                                        <div className={`p-2 rounded-lg ${selectedRole === role ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                            {ROLE_CONFIG[role].icon}
                                        </div>
                                        <span className="text-sm font-bold truncate">{role.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}</span>
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4 pt-4">
                            <div className="relative">
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@hospital.com"
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 outline-none transition-all font-medium text-slate-800 placeholder-slate-400"
                                />
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 outline-none transition-all font-medium text-slate-800 placeholder-slate-400"
                            />
                        </div>

                        <motion.button
                            type="submit"
                            disabled={isSubmitting}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 rounded-2xl shadow-xl hover:shadow-2xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-3 relative overflow-hidden group cursor-pointer"
                        >
                            <AnimatePresence mode="wait">
                                {isSubmitting ? (
                                    <motion.div
                                        key="loader"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex items-center gap-2"
                                    >
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Authenticating...
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="btn-content"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex items-center gap-2"
                                    >
                                        <LogIn size={20} />
                                        Enter Dashboard
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                        </motion.button>
                    </form>

                    <div className="mt-12 flex items-center justify-center gap-8 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
                        <span className="flex items-center gap-1"><Sparkles size={12} /> SECURE v3.4.1</span>
                        <span>DATA ENCRYPTED</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
