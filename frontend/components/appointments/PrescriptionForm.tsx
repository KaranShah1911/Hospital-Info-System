"use client";
import React, { useState } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Search, Pill, X } from 'lucide-react';
import { useParams } from 'next/navigation';

interface PrescriptionFormProps {
    savedPrescriptions?: any[];
    patientId?: string;
    visitId?: string;
    onSuccess?: () => void;
}

export function PrescriptionForm({ savedPrescriptions = [], patientId, visitId, onSuccess }: PrescriptionFormProps) {
    const params = useParams();
    const id = params?.id as string;

    // Maintain a local list to prevent "vanishing" if parent refresh is slow
    const [localHistory, setLocalHistory] = useState<any[]>([]);

    const [medSearch, setMedSearch] = useState('');
    const [medSuggestions, setMedSuggestions] = useState<any[]>([]);
    const [selectedMed, setSelectedMed] = useState<any>(null);
    const [prescriptionItems, setPrescriptionItems] = useState<any[]>([]);
    const [medForm, setMedForm] = useState({ dosage: '', frequency: '', duration: '', instruction: '' });

    const searchMedicines = async (query: string) => {
        setMedSearch(query);
        if (query.length > 2) {
            try {
                const res = await api.get(`/pharmacy/medicines?search=${query}`);
                setMedSuggestions(res.data.data || []);
            } catch (e) { console.error(e); }
        } else {
            setMedSuggestions([]);
        }
    };

    const addMedicine = () => {
        if (!selectedMed || !medForm.dosage) return toast.warning("Select medicine and enter dosage");
        setPrescriptionItems([...prescriptionItems, {
            medicineId: selectedMed.id,
            name: selectedMed.name,
            ...medForm
        }]);
        setMedForm({ dosage: '', frequency: '', duration: '', instruction: '' });
        setSelectedMed(null);
        setMedSearch('');
    };

    const submitPrescription = async () => {
        if (prescriptionItems.length === 0) return toast.warning("No medicines added");
        try {
            let pid = patientId;
            if (!pid) {
                const details = await api.get(`/appointments/${id}/details`);
                pid = details.data.data.patient.id;
            }

            await api.post('/pharmacy/prescriptions', {
                patientId: pid,
                visitId: visitId || null,
                items: prescriptionItems
            });

            toast.success("Prescription Saved");

            const newEntry = {
                id: Date.now(),
                date: new Date(),
                doctor: { fullName: 'Me (Pending Sync)' },
                items: prescriptionItems.map(i => ({ medicine: { name: i.name }, ...i }))
            };
            setLocalHistory([newEntry, ...localHistory]);

            setPrescriptionItems([]);
            if (onSuccess) onSuccess();
        } catch (e: any) {
            toast.error(e.response?.data?.message || "Failed to save prescription");
        }
    };

    const displayList = [...localHistory, ...savedPrescriptions];

    return (
        <div className="space-y-8">
            <div className="space-y-6">
                <h3 className="text-lg font-black flex items-center gap-2">
                    <Pill className="text-indigo-600" /> Prescribe Medicine
                </h3>

                <div className="bg-slate-50 p-4 rounded-xl space-y-4 border border-slate-200">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 text-slate-400" size={16} />
                        <input
                            placeholder="Search Medicine..."
                            value={medSearch}
                            onChange={e => searchMedicines(e.target.value)}
                            className="w-full pl-10 p-2.5 rounded-lg border border-slate-200 text-sm font-bold outline-none focus:border-indigo-500"
                        />
                        {medSuggestions.length > 0 && (
                            <div className="absolute z-10 w-full bg-white shadow-xl mt-1 rounded-lg max-h-64 overflow-auto border border-slate-100 scrollbar-thin scrollbar-thumb-slate-200">
                                {medSuggestions.map(m => (
                                    <div
                                        key={m.id}
                                        onClick={() => { setSelectedMed(m); setMedSearch(m.name); setMedSuggestions([]); }}
                                        className="p-3 hover:bg-indigo-50 cursor-pointer border-b border-slate-50 last:border-0 transition-colors"
                                    >
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-bold text-slate-800 text-sm">{m.name}</span>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm ${m.stockQuantity > 50 ? 'bg-emerald-100 text-emerald-700' :
                                                    m.stockQuantity > 10 ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                                                }`}>
                                                {m.stockQuantity} Left
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider bg-slate-100 px-1.5 rounded">{m.type || 'MED'}</span>
                                            <span className="text-[10px] text-slate-400 truncate max-w-[150px]">{m.manufacturer || 'Generic'}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <input placeholder="Dosage (e.g. 500mg)" value={medForm.dosage} onChange={e => setMedForm({ ...medForm, dosage: e.target.value })} className="p-2 rounded-lg border border-slate-200 text-sm font-medium outline-none" />
                        <input placeholder="Freq (e.g. 1-0-1)" value={medForm.frequency} onChange={e => setMedForm({ ...medForm, frequency: e.target.value })} className="p-2 rounded-lg border border-slate-200 text-sm font-medium outline-none" />
                        <input placeholder="Duration (e.g. 5 days)" value={medForm.duration} onChange={e => setMedForm({ ...medForm, duration: e.target.value })} className="p-2 rounded-lg border border-slate-200 text-sm font-medium outline-none" />
                    </div>
                    <input placeholder="Instructions (e.g. After food)" value={medForm.instruction} onChange={e => setMedForm({ ...medForm, instruction: e.target.value })} className="w-full p-2 rounded-lg border border-slate-200 text-sm font-medium outline-none" />

                    <button onClick={addMedicine} className="w-full py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700">Add to List</button>
                </div>

                {prescriptionItems.length > 0 && (
                    <div className="space-y-2">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pending Submission</h4>
                        {prescriptionItems.map((item, i) => (
                            <div key={i} className="flex justify-between items-center p-3 bg-white border border-slate-100 rounded-lg shadow-sm">
                                <div>
                                    <p className="font-bold text-slate-800">{item.name}</p>
                                    <p className="text-xs text-slate-500">{item.dosage} | {item.frequency} | {item.duration}</p>
                                </div>
                                <button onClick={() => setPrescriptionItems(prescriptionItems.filter((_, idx) => idx !== i))} className="text-red-500 hover:text-red-700"><X size={16} /></button>
                            </div>
                        ))}
                        <button onClick={submitPrescription} className="w-full py-3 mt-4 bg-emerald-500 text-white font-black rounded-xl shadow-lg shadow-emerald-500/20 hover:bg-emerald-600">
                            Sign & Save Prescription
                        </button>
                    </div>
                )}
            </div>

            {displayList.length > 0 && (
                <div className="pt-6 border-t border-slate-100 space-y-4">
                    <h3 className="text-lg font-black text-slate-800">History / Saved Prescriptions</h3>
                    {displayList.map((rx, i) => (
                        <div key={rx.id || i} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                            <div className="flex justify-between items-center text-xs text-slate-500 font-bold border-b border-slate-200 pb-2">
                                <span>Dr. {rx.doctor?.fullName || 'Self'}</span>
                                <span>{new Date(rx.date || new Date()).toLocaleDateString()}</span>
                            </div>
                            <div className="space-y-2">
                                {rx.items?.map((item: any, idx: number) => (
                                    <div key={idx} className="text-sm font-medium text-slate-700 flex justify-between">
                                        <span>• {item.medicine?.name || item.name} ({item.dosage})</span>
                                        <span className="text-slate-400 text-xs">{item.frequency} x {item.duration}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
