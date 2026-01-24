'use client';

import { useState } from 'react';
import { Search, FileText, Calendar, Activity, ChevronRight, X, Stethoscope, Pill, ClipboardList, BedDouble, CreditCard } from 'lucide-react';
import { useRouter } from 'next/navigation';

// API Helpers (Ideally in lib/api.ts, but standardizing here for speed)
const API_URL = 'http://localhost:3000';

export default function DoctorEMRPage() {
    const [uhid, setUhid] = useState('');
    const [loading, setLoading] = useState(false);
    const [patient, setPatient] = useState<any>(null);
    const [visits, setVisits] = useState<any[]>([]);
    const [selectedVisitId, setSelectedVisitId] = useState<string | null>(null);
    const [kundali, setKundali] = useState<any>(null);
    const [kundaliLoading, setKundaliLoading] = useState(false);

    const getAuthHeader = (): HeadersInit => {
        const staff = localStorage.getItem('staff');
        if (!staff) return {};
        const { accessToken } = JSON.parse(staff);
        return { 'Authorization': `Bearer ${accessToken}` };
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!uhid.trim()) return;

        setLoading(true);
        setPatient(null);
        setVisits([]);
        setKundali(null);
        setSelectedVisitId(null);

        try {
            // 1. Search Patient by UHID
            const searchRes = await fetch(`${API_URL}/patients/search-for-emr?uhid=${uhid}`, {
                headers: getAuthHeader()
            });

            if (!searchRes.ok) throw new Error('Patient not found');
            const patientData = await searchRes.json();

            // 2. Fetch History (Assuming patientData has ID)
            const historyRes = await fetch(`${API_URL}/clinical/history/${patientData.id}`, {
                headers: getAuthHeader()
            });

            if (historyRes.ok) {
                const historyData = await historyRes.json();
                setPatient(historyData);
                setVisits(historyData.opdVisits || []);
            } else {
                // Fallback if history endpoint fails, use patientData
                setPatient(patientData);
                setVisits(patientData.opdVisits || []);
            }

        } catch (error) {
            console.error(error);
            alert('Patient not found with this UHID');
        } finally {
            setLoading(false);
        }
    };

    const handleViewKundali = async (visitId: string) => {
        setSelectedVisitId(visitId);
        setKundaliLoading(true);
        setKundali(null);

        try {
            const res = await fetch(`${API_URL}/general/case-study`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader()
                },
                body: JSON.stringify({ visitId })
            });

            if (!res.ok) throw new Error('Failed to fetch case study');
            const data = await res.json();
            setKundali(data.data); // ApiResponse wrapper
        } catch (error) {
            console.error(error);
            alert('Failed to load Case Study');
        } finally {
            setKundaliLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-12">
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Patient EMR Search</h1>
                <p className="text-slate-500 font-medium">Access complete medical history and timeline.</p>
            </div>

            {/* Search Bar */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <form onSubmit={handleSearch} className="flex gap-4 items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Enter Patient UHID (e.g. P-2024-1234)"
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-mono text-lg uppercase font-bold text-slate-700"
                            value={uhid}
                            onChange={(e) => setUhid(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading || !uhid}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/20"
                    >
                        {loading ? 'Searching...' : 'Search Record'}
                    </button>
                </form>
            </div>

            {/* Patient Profile */}
            {patient && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-slate-50 border-b border-slate-200 p-6 flex flex-col md:flex-row justify-between md:items-center gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-black text-2xl">
                                {patient.firstName?.[0]}{patient.lastName?.[0]}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">{patient.firstName} {patient.lastName}</h2>
                                <div className="flex gap-4 text-sm font-medium text-slate-500 mt-1">
                                    <span>{new Date().getFullYear() - new Date(patient.dob).getFullYear()} Years</span>
                                    <span>•</span>
                                    <span>{patient.gender}</span>
                                    <span>•</span>
                                    <span className="font-mono text-slate-400">{patient.uhid}</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-slate-500">Blood Group</div>
                            <div className="text-xl font-bold text-red-500">{patient.bloodGroup || "N/A"}</div>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="p-6 bg-slate-50/50">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Visit Timeline</h3>
                        <div className="space-y-4">
                            {visits.length === 0 ? (
                                <p className="text-slate-500 italic">No visit history found.</p>
                            ) : (
                                visits.map((visit: any) => (
                                    <div
                                        key={visit.id}
                                        onClick={() => handleViewKundali(visit.id)}
                                        className={`bg-white p-5 rounded-xl border transition-all cursor-pointer hover:shadow-md flex items-center gap-6 group
                                            ${selectedVisitId === visit.id ? 'border-indigo-500 ring-2 ring-indigo-500/10' : 'border-slate-200 hover:border-indigo-300'}
                                        `}
                                    >
                                        <div className="flex flex-col items-center min-w-[80px]">
                                            <div className="text-xs font-bold text-slate-400 uppercase">{new Date(visit.visitDate).toLocaleDateString('en-US', { month: 'short' })}</div>
                                            <div className="text-2xl font-black text-slate-700">{new Date(visit.visitDate).getDate()}</div>
                                            <div className="text-xs font-medium text-slate-300">{new Date(visit.visitDate).getFullYear()}</div>
                                        </div>

                                        <div className="h-10 w-px bg-slate-100"></div>

                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide 
                                                    ${visit.visitType === 'Emergency' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}
                                                `}>
                                                    {visit.visitType}
                                                </span>
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide 
                                                    ${visit.status === 'Completed' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}
                                                `}>
                                                    {visit.status}
                                                </span>
                                            </div>
                                            <div className="font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">
                                                Visit #{visit.id.slice(0, 8)}
                                            </div>
                                        </div>

                                        <ChevronRight className={`text-slate-300 group-hover:text-indigo-500 transition-colors ${selectedVisitId === visit.id ? 'translate-x-1 text-indigo-500' : ''}`} />
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* THE KUNDALI (Case Study Reveal) */}
            {selectedVisitId && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex justify-end transition-opacity">
                    <div className="w-full max-w-4xl bg-white h-full shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-500 flex flex-col">

                        {/* Header Fixed */}
                        <div className="sticky top-0 bg-white z-10 border-b border-slate-200 px-8 py-6 flex justify-between items-start">
                            <div>
                                <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                                    <ClipboardList className="text-indigo-600" size={32} />
                                    Clinical Case Study
                                </h2>
                                <p className="text-slate-500 font-medium mt-1 ml-11">
                                    Comprehensive Medical Record • Visit #{selectedVisitId.slice(0, 8).toUpperCase()}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedVisitId(null)}
                                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-red-500 transition-colors"
                            >
                                <X size={28} />
                            </button>
                        </div>

                        {/* Content Scrollable */}
                        <div className="flex-1 p-8 bg-slate-50/50 space-y-8">
                            {kundaliLoading ? (
                                <div className="h-full flex items-center justify-center flex-col gap-6 text-slate-400 min-h-[400px]">
                                    <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                                    <p className="font-bold text-lg animate-pulse">Analyzing Clinical Data...</p>
                                </div>
                            ) : kundali && (
                                <>
                                    {/* 1. Patient Snapshot */}
                                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-indigo-600 text-white rounded-lg flex items-center justify-center font-bold text-xl">
                                                    {kundali.patientProfile.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-slate-900">{kundali.patientProfile.name}</h3>
                                                    <div className="flex gap-3 text-sm font-medium text-slate-500">
                                                        <span>{kundali.patientProfile.age} Yrs</span> •
                                                        <span>{kundali.patientProfile.gender}</span> •
                                                        <span className="font-mono text-indigo-600">{kundali.patientProfile.uhid}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">Visit Date</div>
                                                <div className="font-bold text-slate-800">
                                                    {new Date(kundali.visitJourney.stage1_arrival.date).toLocaleDateString('en-US', {
                                                        weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                                    })}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-100 pt-6">
                                            <div className="bg-indigo-50/50 p-4 rounded-lg border border-indigo-100/50">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Stethoscope size={16} className="text-indigo-600" />
                                                    <span className="text-xs font-bold text-indigo-400 uppercase">Primary Doctor</span>
                                                </div>
                                                <div className="font-bold text-slate-800">{kundali.visitJourney.stage1_arrival.initialDoctor}</div>
                                            </div>
                                            <div className={`p-4 rounded-lg border ${kundali.visitJourney.stage2_triage.triageColor === 'Red' ? 'bg-red-50 border-red-100' : 'bg-slate-100 border-slate-200'}`}>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Activity size={16} className={kundali.visitJourney.stage2_triage.triageColor === 'Red' ? 'text-red-500' : 'text-slate-500'} />
                                                    <span className={`text-xs font-bold uppercase ${kundali.visitJourney.stage2_triage.triageColor === 'Red' ? 'text-red-400' : 'text-slate-400'}`}>Triage Priority</span>
                                                </div>
                                                <div className={`font-bold ${kundali.visitJourney.stage2_triage.triageColor === 'Red' ? 'text-red-700' : 'text-slate-700'}`}>
                                                    {kundali.visitJourney.stage2_triage.triageColor || "Standard"} Category
                                                </div>
                                            </div>
                                            <div className="bg-green-50/50 p-4 rounded-lg border border-green-100/50">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <CreditCard size={16} className="text-green-600" />
                                                    <span className="text-xs font-bold text-green-400 uppercase">Financial Status</span>
                                                </div>
                                                <div className="font-bold text-slate-800">
                                                    {kundali.financials.status} • <span className="font-mono text-green-600">${kundali.financials.totalBilled}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 2. Clinical Assessment */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <h3 className="flex items-center gap-2 font-bold text-slate-900 text-lg">
                                                <FileText className="text-indigo-500" /> Clinical Notes
                                            </h3>
                                            {kundali.visitJourney.stage3_consultation.notes.length === 0 ? (
                                                <div className="p-8 text-center bg-white rounded-xl border border-dashed border-slate-300 text-slate-400 italic">No doctor notes recorded</div>
                                            ) : (
                                                kundali.visitJourney.stage3_consultation.notes.map((note: any, i: number) => (
                                                    <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-indigo-300 transition-colors">
                                                        <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                                                        <div className="text-xs font-bold text-slate-400 uppercase mb-3 flex justify-between">
                                                            <span>SOAP Note</span>
                                                            <span>{new Date(note.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                        </div>

                                                        {typeof note.soap === 'string' ? (
                                                            <p className="text-slate-700 whitespace-pre-wrap leading-relaxed text-sm">{note.soap}</p>
                                                        ) : (
                                                            <div className="space-y-3">
                                                                {['Subjective', 'Objective', 'Assessment', 'Plan'].map(section => {
                                                                    const key = Object.keys(note.soap).find(k => k.toLowerCase().startsWith(section[0].toLowerCase()));
                                                                    if (!key) return null;
                                                                    const colors: any = { Subjective: 'text-slate-600', Objective: 'text-blue-700', Assessment: 'text-purple-700', Plan: 'text-green-700' };
                                                                    return (
                                                                        <div key={section} className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                                                            <span className={`text-[10px] font-black uppercase tracking-wider block mb-1 ${colors[section]}`}>{section}</span>
                                                                            <p className="text-slate-800 text-sm font-medium">{note.soap[key]}</p>
                                                                        </div>
                                                                    );
                                                                })}
                                                                {!Object.keys(note.soap).some(k => ['s', 'o', 'a', 'p', 'subjective', 'objective', 'assessment', 'plan'].includes(k.toLowerCase())) && (
                                                                    <pre className="text-xs text-slate-500 whitespace-pre-wrap">{JSON.stringify(note.soap, null, 2).replace(/[{"}]/g, '').trim()}</pre>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))
                                            )}
                                        </div>

                                        <div className="space-y-6">
                                            {/* Diagnostics */}
                                            <div>
                                                <h3 className="flex items-center gap-2 font-bold text-slate-900 text-lg mb-4">
                                                    <Activity className="text-blue-500" /> Diagnostics
                                                </h3>
                                                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                                                    {[
                                                        ...(kundali.visitJourney.stage4_diagnostics_and_medicines_OPD?.orders || []),
                                                        ...(kundali.visitJourney.stage5_hospitalization?.ipdDiagnostics || [])
                                                    ].length === 0 ? (
                                                        <div className="p-4 text-center text-slate-400 italic text-sm">No investigations details.</div>
                                                    ) : (
                                                        [
                                                            ...(kundali.visitJourney.stage4_diagnostics_and_medicines_OPD?.orders || []),
                                                            ...(kundali.visitJourney.stage5_hospitalization?.ipdDiagnostics || [])
                                                        ].map((order: any, i: number) => (
                                                            <div key={i} className="p-4 border-b border-slate-100 last:border-0 flex justify-between items-center hover:bg-slate-50 transition-colors">
                                                                <span className="font-medium text-slate-700">{order.service}</span>
                                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'ResultAvailable' || order.status === 'Completed'
                                                                    ? 'bg-green-100 text-green-700'
                                                                    : 'bg-yellow-100 text-yellow-700'
                                                                    }`}>
                                                                    {order.result === 'Pending' ? order.status : 'Result Ready'}
                                                                </span>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            </div>

                                            {/* Medications */}
                                            <div>
                                                <h3 className="flex items-center gap-2 font-bold text-slate-900 text-lg mb-4">
                                                    <Pill className="text-emerald-500" /> Medications
                                                </h3>
                                                <div className="bg-white p-5 rounded-xl border border-slate-200">
                                                    <div className="flex flex-wrap gap-2">
                                                        {kundali.visitJourney.stage4_diagnostics_and_medicines_OPD?.prescriptions.flatMap((p: any) => p.medicines).length === 0
                                                            ? <span className="text-slate-400 italic text-sm">No medications prescribed.</span>
                                                            : kundali.visitJourney.stage4_diagnostics_and_medicines_OPD.prescriptions.flatMap((p: any) => p.medicines).map((med: string, i: number) => (
                                                                <span key={i} className="px-3 py-1.5 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-lg text-sm font-semibold flex items-center gap-2">
                                                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                                                                    {med}
                                                                </span>
                                                            ))
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 3. Hospitalization Journey (If Admitted) */}
                                    {kundali.visitJourney.stage5_hospitalization.status === 'Admitted' && (
                                        <div className="bg-slate-900 text-slate-300 rounded-2xl p-8 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-32 bg-indigo-500/10 rounded-full blur-3xl"></div>

                                            <div className="relative z-10">
                                                <h3 className="flex items-center gap-2 font-bold text-white text-xl mb-6">
                                                    <BedDouble className="text-indigo-400" /> In-Patient Journey
                                                </h3>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    <div>
                                                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Admission Details</div>
                                                        <div className="text-white font-medium text-lg mb-4">
                                                            Admitted to <span className="text-indigo-400 font-bold">{kundali.visitJourney.stage5_hospitalization.department}</span>
                                                        </div>

                                                        <div className="space-y-4">
                                                            {kundali.visitJourney.stage5_hospitalization.bedMovement.map((move: any, i: number) => (
                                                                <div key={i} className="flex gap-4">
                                                                    <div className="flex flex-col items-center">
                                                                        <div className={`w-3 h-3 rounded-full ${move.status === 'Current' ? 'bg-green-500 animate-pulse' : 'bg-slate-600'}`}></div>
                                                                        {i !== kundali.visitJourney.stage5_hospitalization.bedMovement.length - 1 && <div className="w-0.5 h-full bg-slate-700/50 my-1"></div>}
                                                                    </div>
                                                                    <div>
                                                                        <div className="font-bold text-slate-200">{move.ward} - Bed {move.bed}</div>
                                                                        <div className="text-xs text-slate-500">
                                                                            {move.status === 'Current' ? 'Currently Occupied' : `Transferred on ${new Date(move.from).toLocaleDateString()}`}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Surgical Procedures</div>
                                                        {kundali.visitJourney.stage5_hospitalization.surgeries.length === 0 ? (
                                                            <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700 italic text-sm">No surgeries performed.</div>
                                                        ) : (
                                                            kundali.visitJourney.stage5_hospitalization.surgeries.map((s: any, i: number) => (
                                                                <div key={i} className="p-4 rounded-lg bg-indigo-900/20 border border-indigo-500/30 mb-2">
                                                                    <div className="font-bold text-white">{s.procedure}</div>
                                                                    <div className="text-sm text-indigo-300">Surgeon: {s.surgeon}</div>
                                                                    <div className="text-xs text-slate-500 mt-2">{new Date(s.date).toLocaleDateString()} • {s.status}</div>
                                                                </div>
                                                            ))
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
