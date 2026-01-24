"use client";

import React, { useEffect, useState } from "react";
import { getRadiologyWorklist, verifyResult, rejectResult, ServiceOrder } from "@/lib/mock-data";
import { Search, CheckCircle, XCircle, FileText, Activity, User, Stethoscope, Scan } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function RadiologyResultValidation() {
    const [orders, setOrders] = useState<ServiceOrder[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<ServiceOrder | null>(null);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [rejectRemark, setRejectRemark] = useState("");
    const [isRejecting, setIsRejecting] = useState(false);

    const fetchOrders = async () => {
        setLoading(true);
        const data = await getRadiologyWorklist();
        // Filter for orders needing validation
        const validationQueue = data.filter(o => o.status === "ResultAvailable");
        setOrders(validationQueue);

        // Deselect if the selected order is no longer in the list
        if (selectedOrder && !validationQueue.find(o => o.id === selectedOrder.id)) {
            setSelectedOrder(null);
            setIsRejecting(false);
            setRejectRemark("");
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleVerify = async (orderId: string) => {
        if (!confirm("Are you sure you want to verify and finalize this report?")) return;

        setProcessingId(orderId);
        const success = await verifyResult(orderId, "RAD-DOC-CURRENT-USER");
        if (success) {
            // alert("Report Finalized Successfully!"); 
            await fetchOrders();
        }
        setProcessingId(null);
    };

    const handleReject = async (orderId: string) => {
        if (!rejectRemark.trim()) {
            alert("Please provide a reason for rejection.");
            return;
        }

        setProcessingId(orderId);
        const success = await rejectResult(orderId, rejectRemark);
        if (success) {
            // alert("Report Rejected. Sent back for revision.");
            await fetchOrders();
        }
        setProcessingId(null);
    };

    return (
        <div className="h-[calc(100vh-2rem)] flex gap-6">
            {/* Queue List */}
            <div className="w-full max-w-sm flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-slate-800">Review Queue</h2>
                    <span className="px-2.5 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full">
                        {orders.length} Pending
                    </span>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                    {loading ? (
                        <div className="text-center py-10 text-slate-400 text-sm">Loading queue...</div>
                    ) : orders.length === 0 ? (
                        <div className="text-center py-10 text-slate-400 text-sm">No reports pending review.</div>
                    ) : (
                        orders.map((order) => (
                            <div
                                key={order.id}
                                onClick={() => { setSelectedOrder(order); setIsRejecting(false); setRejectRemark(""); }}
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
                            <Scan size={32} className="opacity-50" />
                        </div>
                        <p className="font-medium">Select a report to review</p>
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
                                <span className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Order ID</span>
                                <span className="font-mono text-lg font-bold text-slate-700">{selectedOrder.id}</span>
                            </div>
                        </div>

                        {/* Report Preview */}
                        <div className="flex-1 min-h-0 flex flex-col">
                            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-8 flex-1 overflow-y-auto custom-scrollbar">
                                <span className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-4 pb-2 border-b border-slate-200">
                                    Report Findings
                                </span>
                                <div className="prose prose-slate max-w-none">
                                    <div className="whitespace-pre-wrap font-serif text-lg leading-relaxed text-slate-800">
                                        {selectedOrder.result?.resultValue || "No report content found."}
                                    </div>
                                </div>

                                <div className="mt-8 pt-4 border-t border-slate-200 grid grid-cols-2 gap-4">
                                    <div>
                                        <span className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Reported By</span>
                                        <div className="text-sm font-semibold text-slate-700">{selectedOrder.result?.technicianId || "Unknown"}</div>
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Date</span>
                                        <div className="text-sm font-semibold text-slate-700">
                                            {selectedOrder.result?.resultDate && format(new Date(selectedOrder.result.resultDate), "PPP")}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Rejection Area */}
                            {isRejecting && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl shrink-0"
                                >
                                    <label className="block text-xs font-bold text-red-700 uppercase tracking-wide mb-2">
                                        Reason for Rejection <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={rejectRemark}
                                        onChange={(e) => setRejectRemark(e.target.value)}
                                        placeholder="Enter specific feedback for the radiologist..."
                                        className="w-full p-3 bg-white border border-red-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 resize-none h-24"
                                    />
                                    <div className="flex justify-end gap-3 mt-3">
                                        <button
                                            onClick={() => setIsRejecting(false)}
                                            className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => handleReject(selectedOrder.id)}
                                            disabled={!rejectRemark || processingId === selectedOrder.id}
                                            className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-lg shadow-lg shadow-red-600/20 hover:bg-red-700 transition disabled:opacity-50"
                                        >
                                            {processingId === selectedOrder.id ? "Processing..." : "Confirm Rejection"}
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Actions Footer */}
                        {!isRejecting && (
                            <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-4 mt-6 shrink-0">
                                <button
                                    onClick={() => setIsRejecting(true)}
                                    className="px-6 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-bold hover:border-red-200 hover:text-red-600 hover:bg-red-50 transition flex items-center gap-2"
                                >
                                    <XCircle size={20} />
                                    Reject Report
                                </button>

                                <button
                                    onClick={() => handleVerify(selectedOrder.id)}
                                    disabled={processingId === selectedOrder.id}
                                    className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition flex items-center gap-2 disabled:opacity-50"
                                >
                                    {processingId === selectedOrder.id ? (
                                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    ) : (
                                        <CheckCircle size={20} />
                                    )}
                                    Sign Off & Finalize
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
