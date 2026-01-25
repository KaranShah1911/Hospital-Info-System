"use client";

import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { ShieldAlert, Clock, ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { socket, joinRoom } from '@/lib/socket';
import { SurgeryCalendar } from '@/components/SurgeryCalendar';

interface EmergencyRequest {
    id: string;
    patientName: string;
    severity: string;
    location: string;
    notes?: string;
    notes?: string;
    timestamp: string;
    isMLC?: boolean;
}

export default function EmergencyRequests() {
    const [requests, setRequests] = useState<EmergencyRequest[]>([]);

    useEffect(() => {
        // Real-time Socket Listener
        joinRoom('role:OTManager');

        const handleNewRequest = (data: EmergencyRequest) => {
            setRequests((prev) => {
                const updated = [data, ...prev];
                localStorage.setItem('emergencyRequests', JSON.stringify(updated));
                return updated;
            });
        };

        const handleAssignment = (data: any) => {
            // Remove assigned request from list
            setRequests((prev) => {
                const updated = prev.filter(r => r.id !== data.id);
                localStorage.setItem('emergencyRequests', JSON.stringify(updated));
                return updated;
            });
        };

        socket.on("EMERGENCY_INITIATED", handleNewRequest);
        socket.on("OT_ASSIGNMENT_COMPLETE", handleAssignment);

        // Initial Load (still fallback to local storage for persistence demo or API)
        const stored = JSON.parse(localStorage.getItem('emergencyRequests') || '[]');
        setRequests(stored);

        return () => {
            socket.off("EMERGENCY_INITIATED", handleNewRequest);
            socket.off("OT_ASSIGNMENT_COMPLETE", handleAssignment);
        };
    }, []);

    return (
        <div className="space-y-8">
            <PageHeader
                title="Emergency Requests"
                description="Incoming critical cases requiring immediate OT assignment."
            />

            {requests.length === 0 ? (
                <div className="p-12 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl text-center">
                    <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={40} />
                    </div>
                    <h2 className="text-xl font-black text-slate-800">All Clear</h2>
                    <p className="text-slate-500 font-medium">No active emergency requests at the moment.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {requests.map((req) =>
                        <div key={req.id} className="group relative bg-white p-6 rounded-[2rem] border border-rose-100 shadow-xl shadow-rose-100 hover:shadow-rose-200 transition-all flex items-center justify-between overflow-hidden">
                            <div className="absolute left-0 top-0 h-full w-2 bg-rose-500"></div>

                            <div className="flex items-center gap-6">
                                <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl animate-pulse">
                                    <ShieldAlert size={32} />
                                </div>
                                <div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className={`px-3 py-1 text-white text-[10px] font-black uppercase tracking-wider rounded-full ${req.severity?.includes('Red') ? 'bg-rose-500' :
                                                req.severity?.includes('Blue') ? 'bg-indigo-500' : 'bg-amber-500'
                                                }`}>
                                                {req.severity || 'Code Red'}
                                            </span>
                                            <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                                                <Clock size={12} /> {new Date(req.timestamp).toLocaleTimeString()}
                                            </span>
                                            {req.isMLC && (
                                                <span className="px-2 py-0.5 bg-orange-100 text-orange-700 border border-orange-200 rounded text-[10px] font-black uppercase tracking-wider ml-2">
                                                    MLC
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-xl font-black text-slate-900">{req.patientName || "Unknown Patient"}</h3>
                                        <div className="flex flex-col gap-1 mt-1">
                                            <p className="text-slate-500 font-medium text-sm">Location: <span className="text-slate-800 font-bold">{req.location}</span></p>
                                            <p className="text-slate-400 text-xs italic line-clamp-1">{req.notes}</p>
                                        </div>
                                    </div>
                                </div>

                                <Link href={`/dashboard/ot/assign/${req.id}`}>
                                    <button className="px-8 py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-lg group-hover:scale-105">
                                        Assign Team <ArrowRight size={18} />
                                    </button>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className="pt-8 border-t border-slate-200">
                <SurgeryCalendar />
            </div>
        </div>
    );

}
