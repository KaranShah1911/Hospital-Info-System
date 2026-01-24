"use client";
import React, { useState } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Search, FlaskConical, X } from 'lucide-react';
import { useParams } from 'next/navigation';

interface LabOrderFormProps {
    savedOrders?: any[];
    patientId?: string;
    visitId?: string;
    onSuccess?: () => void;
}

export function LabOrderForm({ savedOrders = [], patientId, visitId, onSuccess }: LabOrderFormProps) {
    const params = useParams();
    const id = params?.id as string;

    // Local state for immediate "preservation"
    const [localOrders, setLocalOrders] = useState<any[]>([]);

    const [serviceSearch, setServiceSearch] = useState('');
    const [serviceSuggestions, setServiceSuggestions] = useState<any[]>([]);
    const [selectedServices, setSelectedServices] = useState<any[]>([]);
    const [clinicalIndication, setClinicalIndication] = useState('');

    const searchServices = async (query: string) => {
        setServiceSearch(query);
        if (query.length > 2) {
            try {
                const res = await api.get(`/master/services?search=${query}`);
                setServiceSuggestions(res.data || []);
            } catch (e) { console.error(e); }
        } else {
            setServiceSuggestions([]);
        }
    };

    const submitOrders = async () => {
        if (selectedServices.length === 0) {
            toast.warning("No services selected");
            return;
        }

        try {
            let pid = patientId;

            // Fallback (safety)
            if (!pid) {
                const details = await api.get(`/appointments/${id}/details`);
                pid = details.data.data.patient.id;
            }

            await api.post("/orders/batch-create", {
                patientId: pid,
                visitId: visitId,              // ✅ DO NOT coerce to null
                serviceIds: selectedServices.map(s => s.id),
                clinicalIndication
            });

            toast.success("Orders Placed Successfully");

            // Optimistic UI
            const optimisticOrders = selectedServices.map(s => ({
                id: crypto.randomUUID(),
                service: { name: s.name },
                orderType: s.category,
                status: "Ordered"
            }));

            setLocalOrders(prev => [...optimisticOrders, ...prev]);

            setSelectedServices([]);
            setClinicalIndication("");

            onSuccess?.();

        } catch (e: any) {
            toast.error(
                e.response?.data?.error || "Failed to place orders"
            );
        }
    };


    // Merge display list
    const displayOrders = [...localOrders, ...savedOrders];

    return (
        <div className="space-y-8">
            <div className="space-y-6">
                <h3 className="text-lg font-black flex items-center gap-2">
                    <FlaskConical className="text-indigo-600" /> Place Orders
                </h3>

                <div className="bg-slate-50 p-4 rounded-xl space-y-4 border border-slate-200">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 text-slate-400" size={16} />
                        <input
                            placeholder="Search Tests (e.g. CBC, X-Ray)..."
                            value={serviceSearch}
                            onChange={e => searchServices(e.target.value)}
                            className="w-full pl-10 p-2.5 rounded-lg border border-slate-200 text-sm font-bold outline-none focus:border-indigo-500"
                        />
                        {serviceSuggestions.length > 0 && (
                            <div className="absolute z-10 w-full bg-white shadow-xl mt-1 rounded-lg max-h-48 overflow-auto border border-slate-100">
                                {serviceSuggestions.map(s => (
                                    <div
                                        key={s.id}
                                        onClick={() => {
                                            if (!selectedServices.find(ex => ex.id === s.id)) setSelectedServices([...selectedServices, s]);
                                            setServiceSearch(''); setServiceSuggestions([]);
                                        }}
                                        className="p-2 hover:bg-slate-50 cursor-pointer text-sm font-medium flex justify-between"
                                    >
                                        <span>{s.name}</span>
                                        <span className="text-xs bg-slate-200 px-2 rounded">{s.category}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <textarea
                        className="w-full p-3 rounded-lg border border-slate-200 text-sm font-medium outline-none h-24"
                        placeholder="Clinical Indication / Notes..."
                        value={clinicalIndication}
                        onChange={e => setClinicalIndication(e.target.value)}
                    ></textarea>
                </div>

                {selectedServices.length > 0 && (
                    <div className="space-y-2">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pending Submission</h4>
                        {selectedServices.map((item, i) => (
                            <div key={i} className="flex justify-between items-center p-3 bg-white border border-slate-100 rounded-lg shadow-sm">
                                <p className="font-bold text-slate-800">{item.name}</p>
                                <button onClick={() => setSelectedServices(selectedServices.filter(s => s.id !== item.id))} className="text-red-500 hover:text-red-700"><X size={16} /></button>
                            </div>
                        ))}
                        <button onClick={submitOrders} className="w-full py-3 mt-4 bg-emerald-500 text-white font-black rounded-xl shadow-lg shadow-emerald-500/20 hover:bg-emerald-600">
                            Place Orders
                        </button>
                    </div>
                )}
            </div>

            {/* SAVED ORDERS */}
            {displayOrders.length > 0 && (
                <div className="pt-6 border-t border-slate-100 space-y-4">
                    <h3 className="text-lg font-black text-slate-800">Active Orders</h3>
                    {displayOrders.map((order, i) => (
                        <div key={order.id || i} className="flex justify-between items-center p-4 bg-white border border-slate-200 rounded-xl">
                            <div>
                                <p className="font-bold text-slate-800">{order.service?.name}</p>
                                <p className="text-xs text-slate-500">{order.orderType} • {order.status}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'Ordered' ? 'bg-amber-100 text-amber-700' :
                                order.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                                    'bg-slate-100 text-slate-600'
                                }`}>
                                {order.status}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
