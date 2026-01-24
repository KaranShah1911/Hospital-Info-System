import React from 'react';
import { Appointment, AppointmentStatus } from '@/types';
import { Calendar, Clock, User, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AppointmentListProps {
    appointments: Appointment[];
}

export function AppointmentList({ appointments }: AppointmentListProps) {
    const getStatusColor = (status: AppointmentStatus) => {
        switch (status) {
            case AppointmentStatus.Scheduled: return 'bg-blue-100 text-blue-700 border-blue-200';
            case AppointmentStatus.CheckedIn: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case AppointmentStatus.Completed: return 'bg-slate-100 text-slate-700 border-slate-200';
            case AppointmentStatus.Cancelled: return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-slate-100 text-slate-500';
        }
    };

    return (
        <div className="grid gap-4">
            {appointments.map((apt) => (
                <div
                    key={apt.id}
                    className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:shadow-md transition-all"
                >
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg ${getStatusColor(apt.status)}`}>
                            {apt.tokenNumber}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h4 className="font-bold text-slate-900">{apt.patient?.firstName} {apt.patient?.lastName}</h4>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">{apt.patient?.uhid}</span>
                            </div>
                            <div className="flex items-center gap-4 mt-1 text-sm text-slate-500 font-medium">
                                <span className="flex items-center gap-1"><User size={14} /> {apt.doctor?.fullName}</span>
                                <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(apt.appointmentDate).toLocaleDateString()}</span>
                                <span className="flex items-center gap-1"><Clock size={14} /> {new Date(apt.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className={cn("px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide border", getStatusColor(apt.status))}>
                            {apt.status}
                        </div>
                        {apt.status === AppointmentStatus.Scheduled && (
                            <button className="p-2 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors" title="Check In">
                                <CheckCircle2 size={20} />
                            </button>
                        )}
                        {apt.status !== AppointmentStatus.Cancelled && apt.status !== AppointmentStatus.Completed && (
                            <button className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors" title="Cancel">
                                <XCircle size={20} />
                            </button>
                        )}
                    </div>
                </div>
            ))}

            {appointments.length === 0 && (
                <div className="text-center py-10 text-slate-400 font-medium bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                    No appointments found.
                </div>
            )}
        </div>
    );
}
