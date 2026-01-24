"use client";

import { useState, useEffect } from 'react';
import { ShieldAlert, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { socket, joinRoom } from '@/lib/socket';

export function EmergencyNotification() {
    const [notification, setNotification] = useState<any>(null);
    useEffect(() => {
        // 1. Join User Room based on logged-in staff
        const staffStr = localStorage.getItem('staff');
        if (staffStr) {
            const staff = JSON.parse(staffStr);
            // In a real app, staff.id would be used. For this demo, we might need a mapping or assume staff.id exists.
            // If the user hasn't logged in with a specific ID, we might miss this.
            // For the demo walkthough, let's join all staff rooms or specific ones for testing?
            // Let's assume the user logged in as one of the staff members in the POOL or has an ID.
            // The login response returns { staffId, role, fullName }
            // So we must check for staffId first, or fallback to id
            const userId = staff.staffId || staff.id;

            if (userId) {
                console.log("Joining specific user room:", `user:${userId}`);
                joinRoom(`user:${userId}`);
            }
        }

        // 2. Listen for alerts
        const handleAlert = (data: any) => {
            console.log("SURGERY_ALERT received:", data);

            // Client-side filtering
            const staffStr = localStorage.getItem('staff');
            if (staffStr) {
                const staff = JSON.parse(staffStr);
                const myId = staff.staffId || staff.id;

                // Check if I am in the team
                const iAmAssigned = data.teamMembers?.some((m: any) => m.id === myId);

                if (iAmAssigned) {
                    console.log("I am assigned! Showing popup.");
                    setNotification({
                        ...data,
                        message: `You have been assigned to ${data.otRoom} as ${data.teamMembers.find((m: any) => m.id === myId)?.role}`
                    });
                    // Play sound
                } else {
                    console.log("Ignoring alert - not for me.");
                }
            }
        };

        socket.on("SURGERY_ALERT", handleAlert);
        // Also listen for GLOBAL_EMERGENCY_ALERT if we want everyone to know?
        // socket.on("GLOBAL_EMERGENCY_ALERT", handleAlert);

        return () => {
            socket.off("SURGERY_ALERT", handleAlert);
        };
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
