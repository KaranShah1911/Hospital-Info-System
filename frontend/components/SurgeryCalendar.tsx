"use client";

import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { SectionHeader } from './ui/section-header';
import { Calendar as CalendarIcon, Clock, User, Activity } from 'lucide-react';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

// import '../styles/calendar.css';

interface Surgery {
    id: string;
    procedureName: string;
    otRoomNumber: string;
    surgeryDate: string;
    status: string;
    admission: {
        patient: {
            firstName: string;
            lastName: string;
        }
    };
    surgeon: {
        fullName: string;
    };
}

export function SurgeryCalendar() {
    const [date, setDate] = useState<any>(new Date());
    const [surgeries, setSurgeries] = useState<Surgery[]>([]);
    const [selectedDateSurgeries, setSelectedDateSurgeries] = useState<Surgery[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSurgeries();
    }, []);

    useEffect(() => {
        if (surgeries.length > 0) {
            filterSurgeriesByDate(date);
        }
    }, [date, surgeries]);

    const fetchSurgeries = async () => {
        try {
            // Fetch all surgeries (or range based if optimized)
            const res = await api.get('/ot/surgeries');
            setSurgeries(res.data.data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch surgeries", error);
            setLoading(false);
        }
    };

    const filterSurgeriesByDate = (selectedDate: Date) => {
        const filtered = surgeries.filter(s => {
            const sDate = new Date(s.surgeryDate);
            return sDate.getDate() === selectedDate.getDate() &&
                sDate.getMonth() === selectedDate.getMonth() &&
                sDate.getFullYear() === selectedDate.getFullYear();
        });
        setSelectedDateSurgeries(filtered);
    };

    const tileContent = ({ date, view }: any) => {
        if (view === 'month') {
            const count = surgeries.filter(s => {
                const sDate = new Date(s.surgeryDate);
                return sDate.getDate() === date.getDate() &&
                    sDate.getMonth() === date.getMonth() &&
                    sDate.getFullYear() === date.getFullYear();
            }).length;

            if (count > 0) {
                return (
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                    </div>
                );
            }
        }
    };

    return (
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
                <SectionHeader icon={CalendarIcon} title="Surgery Schedule" />
                <div className="mt-6 calendar-wrapper">
                    <Calendar
                        onChange={setDate}
                        value={date}
                        tileContent={tileContent}
                        className="border-none w-full font-bold text-slate-700 bg-slate-50 rounded-2xl p-4"
                        tileClassName="rounded-xl hover:bg-indigo-50 transition-colors p-4 h-16 relative"
                    />
                </div>
            </div>

            <div className="flex-1 border-l border-slate-100 pl-0 lg:pl-8">
                <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                    <span className="text-indigo-600">{date.toDateString()}</span>
                </h3>

                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    <AnimatePresence mode="popLayout">
                        {selectedDateSurgeries.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-12 text-slate-400 font-medium bg-slate-50 rounded-2xl border border-dashed border-slate-200"
                            >
                                No surgeries scheduled for this day.
                            </motion.div>
                        ) : (
                            selectedDateSurgeries.map((surgery) => (
                                <motion.div
                                    key={surgery.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all group"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-2 text-indigo-600 font-black text-sm uppercase tracking-wide">
                                            <Clock size={14} />
                                            {new Date(surgery.surgeryDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${surgery.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                                                surgery.status === 'InProgress' ? 'bg-amber-100 text-amber-700' :
                                                    'bg-slate-100 text-slate-500'
                                            }`}>
                                            {surgery.status}
                                        </span>
                                    </div>

                                    <h4 className="font-extrabold text-slate-900 text-lg mb-1">{surgery.procedureName}</h4>

                                    <div className="flex flex-col gap-1.5 mt-3">
                                        <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                                            <User size={14} className="text-slate-400" />
                                            {surgery.admission.patient.firstName} {surgery.admission.patient.lastName}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                                            <Activity size={14} className="text-slate-400" />
                                            Dr. {surgery.surgeon.fullName}
                                        </div>
                                        <div className="text-xs font-bold text-slate-400 mt-2 bg-slate-50 px-3 py-1.5 rounded-lg w-fit">
                                            {surgery.otRoomNumber || "Room Not Assigned"}
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <style jsx global>{`
                .react-calendar {
                    width: 100%;
                    border: none;
                    background: transparent;
                }
                .react-calendar__navigation button {
                    color: #1e293b;
                    min-width: 44px;
                    background: none;
                    font-size: 16px;
                    font-weight: 800;
                    margin-top: 8px;
                }
                .react-calendar__navigation button:enabled:hover,
                .react-calendar__navigation button:enabled:focus {
                    background-color: #f1f5f9;
                    border-radius: 12px;
                }
                .react-calendar__month-view__weekdays {
                    text-align: center;
                    text-transform: uppercase;
                    font-weight: bold;
                    font-size: 0.75em;
                    color: #94a3b8;
                    margin-bottom: 10px;
                }
                .react-calendar__tile {
                    padding: 10px 6px;
                    background: none;
                    text-align: center;
                    line-height: 16px;
                    font-weight: 600;
                    font-size: 14px;
                    border-radius: 12px;
                    transition: all 0.2s;
                }
                .react-calendar__tile:enabled:hover,
                .react-calendar__tile:enabled:focus {
                    background-color: #f8fafc;
                    color: #4f46e5;
                }
                .react-calendar__tile--now {
                    background: #eff6ff;
                    color: #3b82f6;
                }
                .react-calendar__tile--active {
                    background: #4f46e5 !important;
                    color: white !important;
                    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
                }
                .react-calendar__tile--hasActive {
                    background: #4f46e5;
                }
            `}</style>
        </div>
    );
}
