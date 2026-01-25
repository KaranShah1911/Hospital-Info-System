"use client";

import React, { useEffect, useState } from "react";
// import { getLabWorklist, verifyResult, rejectResult, ServiceOrder } from "@/lib/mock-data";
import api from "@/lib/api";
import { Search, CheckCircle, XCircle, FileText, AlertTriangle, Activity, User, Stethoscope, FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import ResultEntryModal from "../result-entry-modal";
import { ServiceOrder } from "../page";

export default function ResultValidation() {
    const [orders, setOrders] = useState<ServiceOrder[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<ServiceOrder | null>(null);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null); // Keep if used for modal, else remove. Not used anymore.
    // Removed unused state vars

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await api.get('/lab/worklist?category=Lab');
            // Filter for orders status = SampleCollected (Ready for result)
            // Or 'ResultAvailable' if this is truly validation? 
            // User said "move in validation where they will upload result". So input state is SampleCollected.
            const validationQueue = res.data.data
                .filter((o: any) => o.status === 'SampleCollected')
                .map((o: any) => ({
                    id: o.id,
                    serviceId: o.serviceId,
                    patientName: o.patient ? `${o.patient.firstName} ${o.patient.lastName}` : 'Unknown',
                    uhid: o.patient?.uhid || 'N/A',
                    gender: o.patient?.gender || '-',
                    age: o.patient?.dob ? new Date().getFullYear() - new Date(o.patient.dob).getFullYear() : '-',
                    testName: o.service?.name || 'Unknown Test',
                    department: o.service?.category || 'Lab',
                    status: o.status,
                    priority: o.priority,
                    clinicalIndication: o.clinicalIndication,
                    orderDate: o.orderDate,
                    result: null
                }));

            setOrders(validationQueue);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // We reuse the ResultEntryModal from previous implementation?
    // Or inline form as per current UI design? 
    // The current UI design has "Result Card" with "Measured Value". That looks like a view mode.
    // If we need to "Upload Result", we need inputs.
    // I will import ResultEntryModal and adding a "Enter Result" button that opens it.
    // Or better, since `validation/page.tsx` seems designed for Doctor info, I will refactor it to input fields if user wants to upload result here.
    // Actually, simpler to just use the Modal.
    // Let's add `openResultModal`.
    const [isResultModalOpen, setIsResultModalOpen] = useState(false);

    const openResultModal = () => {
        setIsResultModalOpen(true);
    };

    return (
        <div className="h-[calc(100vh-2rem)] flex gap-6">
            {/* Queue List */}
            <div className="w-full max-w-sm flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-slate-800">Validation Queue</h2>
                    <span className="px-2.5 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full">
                        {orders.length} Pending
                    </span>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                    {loading ? (
                        <div className="text-center py-10 text-slate-400 text-sm">Loading queue...</div>
                    ) : orders.length === 0 ? (
                        <div className="text-center py-10 text-slate-400 text-sm">No results pending validation.</div>
                    ) : (
                        orders.map((order) => (
                            <div
                                key={order.id}
                                onClick={() => setSelectedOrder(order)}
                                className={cn(
                                    "p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md group",
                                    selectedOrder?.id === order.id
                                        ? "bg-indigo-50 border-indigo-200 ring-1 ring-indigo-500/20 shadow-sm"
                                        : "bg-white border-slate-100 hover:border-slate-300"
                                )}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-bold text-slate-700 text-sm">{order.id}</span>
                                    {order.priority === "Stat" && (
                                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide bg-red-50 text-red-600 border border-red-100 animate-pulse">
                                            STAT
                                        </span>
                                    )}
                                </div>
                                <div className="text-sm font-semibold text-slate-900">{order.testName}</div>
                                <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
                                    <span>{order.patientName}</span>
                                    <span className="flex items-center gap-1 group-hover:text-indigo-600 transition-colors">
                                        Review <CheckCircle size={10} />
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Validation Workspace */}
            <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex flex-col relative overflow-hidden">
                {!selectedOrder ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                            <Activity size={32} className="opacity-50" />
                        </div>
                        <p className="font-medium">Select a result to validate</p>
                    </div>
                ) : (
                    <div className="h-full flex flex-col max-w-3xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-300">
                        {/* Header */}
                        <div className="mb-8 flex justify-between items-start">
                            <div>
                                <h1 className="text-2xl font-black text-slate-900 mb-2">{selectedOrder.testName}</h1>
                                <div className="flex items-center gap-4 text-sm text-slate-500">
                                    <span className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded-lg text-slate-700 font-medium">
                                        <User size={14} />
                                        {selectedOrder.patientName}
                                    </span>
                                    <span>{selectedOrder.uhid}</span>
                                    <span>({selectedOrder.gender}/{selectedOrder.age})</span>
                                </div>
                                {selectedOrder.clinicalIndication && (
                                    <div className="mt-4 p-3 bg-indigo-50/50 border border-indigo-100 rounded-lg text-sm text-indigo-700 font-medium inline-flex items-center gap-2">
                                        <Stethoscope size={16} />
                                        Indication: {selectedOrder.clinicalIndication}
                                    </div>
                                )}
                            </div>
                            <div className="text-right">
                                <span className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Sample ID</span>
                                <span className="font-mono text-lg font-bold text-slate-700">{selectedOrder.id}</span>
                            </div>
                        </div>

                        {/* Result Card - Only show if Result exists */}
                        {selectedOrder.result ? (
                            <div className="flex-1">
                                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-8">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        <div className="space-y-1">
                                            <span className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Measured Value</span>
                                            <div className="text-3xl font-black text-slate-900 tracking-tight flex items-baseline gap-2">
                                                {selectedOrder.result.resultValue}
                                                <span className="text-lg font-medium text-slate-400">{selectedOrder.result.unit}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <span className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Reference Range</span>
                                            <div className="text-xl font-semibold text-slate-700 mt-2">{selectedOrder.result.referenceRange || "N/A"}</div>
                                        </div>

                                        <div className="space-y-1">
                                            <span className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Performed By</span>
                                            <div className="flex items-center gap-2 mt-2">
                                                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                                                    {selectedOrder.result.technicianId?.charAt(0) || "T"}
                                                </div>
                                                <div className="text-sm font-medium text-slate-700">
                                                    {selectedOrder.result.technicianId || "Unknown Tech"}
                                                </div>
                                            </div>
                                            <div className="text-xs text-slate-400 mt-1">
                                                {selectedOrder.result.resultDate && format(new Date(selectedOrder.result.resultDate), "MMM dd, hh:mm a")}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 rounded-2xl border border-slate-200 border-dashed p-8">
                                <FlaskConical size={48} className="text-indigo-200 mb-4" />
                                <h3 className="text-lg font-bold text-slate-700">Pending Result Entry</h3>
                                <p className="text-slate-500 text-sm mb-6 text-center max-w-xs">Sample has been collected. Please enter the analysis results to proceed.</p>
                                <button
                                    onClick={openResultModal}
                                    className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition flex items-center gap-2"
                                >
                                    <FlaskConical size={18} />
                                    Enter Result
                                </button>
                            </div>
                        )}

                        {/* Actions Footer */}
                        {selectedOrder.result && (
                            <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-4 mt-auto">
                                <span className="text-sm text-slate-500 italic">Result submitted. Waiting for verification.</span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Modal */}
            {selectedOrder && (
                <ResultEntryModal
                    isOpen={isResultModalOpen}
                    onClose={() => setIsResultModalOpen(false)}
                    order={selectedOrder}
                    onSuccess={() => {
                        setIsResultModalOpen(false);
                        setSelectedOrder(null);
                        fetchOrders();
                    }}
                />
            )}
        </div>
    );
}
