import React, { useState } from 'react';
import { AppointmentType, Gender } from '@/types';
import { Calendar, Search } from 'lucide-react';

export function AppointmentBookingForm() {
    const [searchTerm, setSearchTerm] = useState('');
    const [apptType, setApptType] = useState<AppointmentType>(AppointmentType.New);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Booking appointment...");
        // Logic to submit
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl space-y-6">
            <div className="flex items-center gap-2 text-indigo-600 mb-2">
                <Calendar size={24} />
                <h2 className="text-xl font-black text-slate-900">Book Appointment</h2>
            </div>

            {/* Patient Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search Patient (Name / UHID)..."
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-800"
                />
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Appointment Type</label>
                    <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                        {Object.values(AppointmentType).map(type => (
                            <button
                                key={type}
                                type="button"
                                onClick={() => setApptType(type)}
                                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${apptType === type
                                        ? 'bg-white text-indigo-600 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Department</label>
                    <select className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-sm text-slate-700 outline-none focus:border-indigo-500">
                        <option>General Medicine</option>
                        <option>Cardiology</option>
                        <option>Pediatrics</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Doctor</label>
                    <select className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-sm text-slate-700 outline-none focus:border-indigo-500">
                        <option>Dr. Sarah Smith</option>
                        <option>Dr. James Wilson</option>
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</label>
                        <input type="date" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-sm text-slate-700 outline-none focus:border-indigo-500" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Time Slot</label>
                        <select className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-sm text-slate-700 outline-none focus:border-indigo-500">
                            <option>09:00 AM</option>
                            <option>09:30 AM</option>
                        </select>
                    </div>
                </div>
            </div>

            <button type="submit" className="w-full py-4 bg-indigo-600 text-white font-black rounded-xl shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all">
                Confirm Booking
            </button>
        </form>
    );
}
