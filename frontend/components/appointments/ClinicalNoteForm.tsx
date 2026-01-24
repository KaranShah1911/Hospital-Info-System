"use client";

import { Activity, Stethoscope, Save, Archive, FileText } from 'lucide-react';
import React, { useState } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';

interface ClinicalNoteFormProps {
    patientId?: string;
    visitId?: string;
    savedNotes?: any[];
    onSuccess?: () => void;
}

export function ClinicalNoteForm({ patientId, visitId, savedNotes = [], onSuccess }: ClinicalNoteFormProps) {
    const [vitals, setVitals] = useState({ bp: '', pulse: '', spo2: '', temp: '' });
    const [complaints, setComplaints] = useState('');
    const [diagnosis, setDiagnosis] = useState('');
    const [examNotes, setExamNotes] = useState('');

    // Local state for persistence
    const [localNotes, setLocalNotes] = useState<any[]>([]);

    const saveNote = async () => {
        if (!complaints && !diagnosis) return toast.warning("Please enter at least complaints or diagnosis");

        const content = {
            vitals,
            complaints,
            diagnosis,
            examination: examNotes
        };

        try {
            await api.post('/clinical/notes', {
                patientId,
                visitId,
                noteType: 'SOAP',
                content
            });

            toast.success("Clinical Note Saved");

            // Optimistic Update
            const newNote = {
                id: Date.now(),
                createdAt: new Date(),
                content,
                noteType: 'SOAP'
            };
            setLocalNotes([newNote, ...localNotes]);

            // Clear form to allow new entry
            setComplaints('');
            setDiagnosis('');
            setExamNotes('');
            setVitals({ bp: '', pulse: '', spo2: '', temp: '' });

            if (onSuccess) onSuccess();
        } catch (e: any) {
            toast.error("Failed to save note");
            console.error(e);
        }
    };

    const allNotes = [...localNotes, ...savedNotes];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Input Section */}
            <div className="space-y-6">
                {/* Vitals */}
                <div className="p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100 transition-all hover:border-indigo-200 hover:shadow-sm">
                    <div className="flex items-center gap-2 mb-4 text-indigo-800 font-bold text-xs uppercase tracking-wider">
                        <Activity size={14} /> Record Vitals
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 ml-1">BP (mmHg)</label>
                            <input value={vitals.bp} onChange={e => setVitals({ ...vitals, bp: e.target.value })} placeholder="120/80" className="w-full px-4 py-2 bg-white rounded-xl border border-indigo-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 ml-1">Pulse (bpm)</label>
                            <input value={vitals.pulse} onChange={e => setVitals({ ...vitals, pulse: e.target.value })} type="number" placeholder="72" className="w-full px-4 py-2 bg-white rounded-xl border border-indigo-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 ml-1">SpO2 (%)</label>
                            <input value={vitals.spo2} onChange={e => setVitals({ ...vitals, spo2: e.target.value })} type="number" placeholder="98" className="w-full px-4 py-2 bg-white rounded-xl border border-indigo-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 ml-1">Temp (°F)</label>
                            <input value={vitals.temp} onChange={e => setVitals({ ...vitals, temp: e.target.value })} type="text" placeholder="98.6" className="w-full px-4 py-2 bg-white rounded-xl border border-indigo-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                        </div>
                    </div>
                </div>

                {/* Complaints */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 transition-all hover:border-slate-200 hover:shadow-sm">
                    <div className="flex items-center gap-2 mb-2 text-slate-500 font-bold text-xs uppercase tracking-wider">
                        <Stethoscope size={14} /> Chief Complaints
                    </div>
                    <textarea
                        value={complaints}
                        onChange={e => setComplaints(e.target.value)}
                        className="w-full bg-white rounded-xl border-none p-4 text-sm font-medium focus:ring-2 focus:ring-indigo-100 min-h-[80px]"
                        placeholder="e.g. Headache since 2 days, Fever..."
                    />
                </div>

                {/* Diagnosis & Exam */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 transition-all hover:border-slate-200 hover:shadow-sm">
                        <div className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-2">Diagnosis</div>
                        <textarea
                            value={diagnosis}
                            onChange={e => setDiagnosis(e.target.value)}
                            className="w-full bg-white rounded-xl border-none p-4 text-sm font-medium focus:ring-2 focus:ring-indigo-100 min-h-[120px]"
                            placeholder="Provisional Diagnosis..."
                        />
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 transition-all hover:border-slate-200 hover:shadow-sm">
                        <div className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-2">Examination Notes (O/E)</div>
                        <textarea
                            value={examNotes}
                            onChange={e => setExamNotes(e.target.value)}
                            className="w-full bg-white rounded-xl border-none p-4 text-sm font-medium focus:ring-2 focus:ring-indigo-100 min-h-[120px]"
                            placeholder="Chest clear, Abd soft..."
                        />
                    </div>
                </div>

                <button onClick={saveNote} className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl shadow-lg hover:bg-slate-800 flex justify-center items-center gap-2 active:scale-[0.98] transition-transform">
                    <Save size={18} /> Save Clinical Note
                </button>
            </div>

            {/* Saved Notes History */}
            {allNotes.length > 0 && (
                <div className="pt-8 border-t border-slate-100 space-y-4">
                    <h3 className="text-lg font-black text-slate-800 flex items-center gap-2"><Archive size={18} className="text-indigo-600" /> Clinical History</h3>
                    <div className="space-y-3">
                        {allNotes.map((note, i) => (
                            <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3 hover:border-indigo-200 transition-colors">
                                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        <FileText size={12} /> SOAP Note
                                    </div>
                                    <span className="text-xs font-bold text-slate-400">{new Date(note.createdAt).toLocaleString()}</span>
                                </div>
                                <div className="space-y-2">
                                    {note.content?.complaints && (
                                        <div className="text-sm text-slate-700">
                                            <span className="font-bold text-slate-900">CC:</span> {note.content.complaints}
                                        </div>
                                    )}
                                    {note.content?.diagnosis && (
                                        <div className="text-sm text-slate-700">
                                            <span className="font-bold text-emerald-600">Diagnosis:</span> <span className="font-medium">{note.content.diagnosis}</span>
                                        </div>
                                    )}
                                    {note.content?.vitals?.bp && (
                                        <div className="flex gap-4 mt-2">
                                            <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs font-bold">BP: {note.content.vitals.bp}</span>
                                            <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs font-bold">P: {note.content.vitals.pulse}</span>
                                            {note.content.vitals.temp && <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs font-bold">T: {note.content.vitals.temp}°F</span>}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
