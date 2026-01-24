"use client";

import { useState, useEffect } from 'react';
import { ShieldAlert, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function EmergencyNotification() {
    const [notification, setNotification] = useState<any>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            const stored = JSON.parse(localStorage.getItem('staffNotifications') || '[]');
            if (stored.length > 0) {
                // Get the latest notification
                setNotification(stored[0]);
                // Clear it so it doesn't loop forever in this simple mock
                localStorage.setItem('staffNotifications', '[]');
            }
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleAction = (action: string) => {
        // In real app, send acton to API
        setNotification(null);
    };

    if (!notification) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white rounded-[2.5rem] max-w-lg w-full p-8 shadow-2xl border-4 border-rose-500 relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-2 bg-rose-500 animate-pulse"></div>

                    <div className="flex flex-col items-center text-center space-y-6">
                        <div className="p-4 bg-rose-100 text-rose-600 rounded-full animate-bounce">
                            <ShieldAlert size={48} />
                        </div>

                        <div>
                            <h2 className="text-2xl font-black text-rose-600 uppercase tracking-wide mb-2">{notification.title}</h2>
                            <p className="text-slate-600 font-bold text-lg leading-relaxed">
                                {notification.message}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 w-full">
                            <button
                                onClick={() => handleAction('decline')}
                                className="px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-500 font-black rounded-xl transition-colors flex items-center justify-center gap-2"
                            >
                                <X size={20} /> Decline
                            </button>
                            <button
                                onClick={() => handleAction('accept')}
                                className="px-6 py-4 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-xl shadow-lg shadow-rose-200 transition-colors flex items-center justify-center gap-2"
                            >
                                <Check size={20} /> ACCEPT
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
