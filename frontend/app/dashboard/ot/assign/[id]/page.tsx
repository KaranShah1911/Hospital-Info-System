"use client";

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { User, Activity, CheckCircle, ArrowLeft, AlertTriangle, Hospital, Plus, Trash2, Stethoscope, Syringe } from 'lucide-react';
import { SectionHeader } from '@/components/ui/section-header';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Mock Data for OT Rooms
const OT_ROOMS = [
    { id: 'OT-1', name: 'General Surgery 1', status: 'Available', type: 'General', equipment: ['C-Arm', 'Ventilator'] },
    { id: 'OT-2', name: 'Ortho Suite', status: 'Occupied', type: 'Ortho', equipment: ['C-Arm', 'Fracture Table'] },
    { id: 'OT-3', name: 'Neuro OT', status: 'Cleaning', type: 'Neuro', equipment: ['Microscope', 'Neuronav'] },
    { id: 'OT-4', name: 'Emergency OT', status: 'Available', type: 'Trauma', equipment: ['Rapid Infuser', 'Lap Tower'] },
];

// Mock Data for Staff
const STAFF_POOL = [
    { id: 'S1', name: 'Dr. Amit Patel', role: 'Surgeon', dept: 'Ortho' },
    { id: 'S2', name: 'Dr. Sarah Smith', role: 'Surgeon', dept: 'General' },
    { id: 'S3', name: 'Dr. Vikram Singh', role: 'Surgeon', dept: 'Neuro' },
    { id: 'A1', name: 'Dr. Meera', role: 'Anaesthetist', dept: 'Anaesthesia' },
    { id: 'A2', name: 'Dr. John', role: 'Anaesthetist', dept: 'Anaesthesia' },
    { id: 'N1', name: 'Sister Mary', role: 'Nurse', dept: 'Nursing' },
    { id: 'N2', name: 'Nurse Joy', role: 'Nurse', dept: 'Nursing' },
    { id: 'T1', name: 'Tech Ramesh', role: 'Technician', dept: 'OT Tech' },
];

const ROLES = ['Lead Surgeon', 'Assistant Surgeon', 'Anaesthetist', 'Scrub Nurse', 'Circulating Nurse', 'OT Technician'];

export default function OTAssignment({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [assigned, setAssigned] = useState(false);
    const [requestDetails, setRequestDetails] = useState<any>(null);

    // Form State
    const [selectedRoom, setSelectedRoom] = useState<string>('');
    const [team, setTeam] = useState<{ id: number, staffId: string, role: string }[]>([
        { id: 1, staffId: '', role: 'Lead Surgeon' },
        { id: 2, staffId: '', role: 'Anaesthetist' }
    ]);

    useEffect(() => {
        const requests = JSON.parse(localStorage.getItem('emergencyRequests') || '[]');
        const current = requests.find((r: any) => r.id === params.id);
        if (current) setRequestDetails(current);
    }, [params.id]);

    const addTeamMember = () => {
        setTeam([...team, { id: Date.now(), staffId: '', role: 'Scrub Nurse' }]);
    };

    const removeTeamMember = (id: number) => {
        setTeam(team.filter(t => t.id !== id));
    };

    const updateMember = (id: number, field: 'staffId' | 'role', value: string) => {
        setTeam(team.map(t => t.id === id ? { ...t, [field]: value } : t));
    };

    const handleAssign = () => {
        setAssigned(true);

        const roomName = OT_ROOMS.find(r => r.id === selectedRoom)?.name;
        const assignedStaffNames = team.map(t => STAFF_POOL.find(s => s.id === t.staffId)?.name).filter(Boolean);

        const notification = {
            id: 'NOTIF-' + Date.now(),
            title: `EMERGENCY ASSIGNMENT: ${requestDetails?.severity || 'CODE RED'}`,
            message: `Report to ${roomName}. Team: ${assignedStaffNames.join(', ')}. Patient: ${requestDetails?.patientName}.`,
            type: 'critical',
            for: assignedStaffNames
        };

        const existing = JSON.parse(localStorage.getItem('staffNotifications') || '[]');
        localStorage.setItem('staffNotifications', JSON.stringify([notification, ...existing]));

        setTimeout(() => {
            router.push('/dashboard/ot/requests');
        }, 2000);
    };

    if (assigned) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-in zoom-in duration-500">
                <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-200">
                    <CheckCircle size={48} />
                </div>
                <div>
                    <h2 className="text-3xl font-black text-slate-800">Team Assigned & Notified</h2>
                    <p className="text-slate-500 font-medium mt-2 text-lg">
                        OT Room and Surgical Team have been secured.<br />
                        Staff notified via critical alert system.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-6xl mx-auto pb-32">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/ot/requests" className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500">
                    <ArrowLeft size={20} />
                </Link>
                <div className="flex-1">
                    <PageHeader title="Assign Surgical Resources" description={`Emergency Case: ${params.id}`} />
                </div>
            </div>

            {requestDetails && (
                <div className="bg-rose-50 rounded-[2rem] p-6 border border-rose-100 flex items-start gap-4 animate-in slide-in-from-top-4">
                    <div className="p-3 bg-white rounded-xl text-rose-600 shadow-sm">
                        <AlertTriangle size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-rose-700">{requestDetails.patientName}</h3>
                        <p className="text-rose-600/80 font-medium text-sm mt-1">
                            {requestDetails.severity} • {requestDetails.location}
                        </p>
                        {requestDetails.notes && (
                            <p className="text-rose-600 font-bold text-sm mt-2 p-3 bg-white/50 rounded-xl border border-rose-100">
                                "{requestDetails.notes}"
                            </p>
                        )}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* 1. OT Room Selection */}
                <div className="space-y-6">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl">
                        <SectionHeader icon={Hospital} title="Select Operation Theater" />

                        <div className="mt-6 grid grid-cols-1 gap-4">
                            {OT_ROOMS.map((room) => {
                                const isAvailable = room.status === 'Available';
                                return (
                                    <button
                                        key={room.id}
                                        onClick={() => isAvailable && setSelectedRoom(room.id)}
                                        disabled={!isAvailable}
                                        className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between group ${selectedRoom === room.id
                                                ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600'
                                                : isAvailable
                                                    ? 'border-slate-100 bg-white hover:border-indigo-200 hover:bg-slate-50'
                                                    : 'border-slate-100 bg-slate-50 opacity-60 cursor-not-allowed'
                                            }`}
                                    >
                                        <div className="text-left">
                                            <div className="flex items-center gap-3">
                                                <span className="font-black text-slate-800">{room.name}</span>
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${room.status === 'Available' ? 'bg-emerald-100 text-emerald-700' :
                                                        room.status === 'Occupied' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                                                    }`}>
                                                    {room.status}
                                                </span>
                                            </div>
                                            <div className="text-xs font-medium text-slate-400 mt-1 flex gap-2">
                                                {room.equipment.map(e => <span key={e} className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">{e}</span>)}
                                            </div>
                                        </div>
                                        {selectedRoom === room.id && <CheckCircle className="text-indigo-600" size={24} />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* 2. Team Builder */}
                <div className="space-y-6">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl h-full flex flex-col">
                        <SectionHeader icon={User} title="Surgical Team" iconClassName="text-indigo-500" />

                        <div className="mt-6 flex-1 space-y-3">
                            {team.map((member, index) => (
                                <div key={member.id} className="flex gap-3 items-start animate-in fade-in slide-in-from-left-4">
                                    <div className="grid grid-cols-2 gap-3 flex-1">
                                        {/* Staff Dropdown */}
                                        <div className="relative">
                                            <select
                                                value={member.staffId}
                                                onChange={(e) => updateMember(member.id, 'staffId', e.target.value)}
                                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100 appearance-none"
                                            >
                                                <option value="">Select Staff...</option>
                                                {STAFF_POOL.map(s => (
                                                    <option key={s.id} value={s.id}>{s.name} ({s.dept})</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Role Dropdown */}
                                        <div className="relative">
                                            <select
                                                value={member.role}
                                                onChange={(e) => updateMember(member.id, 'role', e.target.value)}
                                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 outline-none focus:ring-2 focus:ring-indigo-100 appearance-none"
                                            >
                                                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => removeTeamMember(member.id)}
                                        className="p-3 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-100 transition-colors"
                                        disabled={team.length <= 1}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={addTeamMember}
                            className="mt-6 w-full py-3 border-2 border-dashed border-slate-200 text-slate-400 font-bold rounded-xl hover:border-indigo-200 hover:text-indigo-500 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
                        >
                            <Plus size={18} /> Add Team Member
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button
                    onClick={handleAssign}
                    disabled={!selectedRoom || team.some(t => !t.staffId)}
                    className="px-12 py-6 bg-indigo-600 disabled:bg-slate-300 disabled:cursor-not-allowed hover:bg-indigo-700 text-white font-black text-xl rounded-[2rem] shadow-xl shadow-indigo-200 transition-all hover:scale-[1.02] flex items-center gap-3"
                >
                    <Activity className={!selectedRoom || team.some(t => !t.staffId) ? '' : 'animate-pulse'} />
                    Confirm Assignment & Notify
                </button>
            </div>
        </div>
    );
}
