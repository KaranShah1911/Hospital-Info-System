"use client";

import React, { useState } from "react";
// import { ServiceOrder, submitResult } from "@/lib/mock-data"; 
import api from "@/lib/api";
import { X, Check, Save, FileText, FlaskConical, Stethoscope, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ServiceOrder } from "./page"; // Use shared type from page

interface ResultEntryModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: ServiceOrder;
    onSuccess: () => void;
}

export default function ResultEntryModal({ isOpen, onClose, order, onSuccess }: ResultEntryModalProps) {
    const [resultValue, setResultValue] = useState("");
    const [referenceRange, setReferenceRange] = useState("Normal");
    const [unit, setUnit] = useState("");
    const [remarks, setRemarks] = useState(""); // For client-side context (e.g. appended to result or separate log)
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await api.post('/lab/submit-result', {
                serviceOrderId: order.id,
                serviceId: order.serviceId, // Ensure this exists on order object passed
                testName: order.testName,
                resultValue: resultValue,
                referenceRange: referenceRange,
                unit: unit,
                remarks: remarks,
            });

            toast.success("Result Saved Successfully!");
            onSuccess();
        } catch (error) {
            console.error("Submit Error:", error);
            toast.error("Failed to save result.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl ring-1 ring-slate-200 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="bg-slate-50 border-b border-slate-100 px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                            <FlaskConical size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 leading-tight">Enter Lab Result</h2>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{order.id} • {order.testName}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">

                    {/* Context Card */}
                    <div className="space-y-3">
                        <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 flex items-start gap-3 text-sm">
                            <div className="p-1.5 bg-blue-100 rounded-lg text-blue-600 shrink-0">
                                <FileText size={16} />
                            </div>
                            <div>
                                <div className="font-bold text-slate-700">{order.patientName}</div>
                                <div className="text-slate-500 text-xs">{order.uhid} • {order.gender}/{order.age}</div>
                            </div>
                        </div>

                        {order.clinicalIndication && (
                            <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 flex items-start gap-3 text-sm">
                                <div className="p-1.5 bg-indigo-100 rounded-lg text-indigo-600 shrink-0">
                                    <Stethoscope size={16} />
                                </div>
                                <div>
                                    <div className="font-bold text-indigo-900 text-xs uppercase tracking-wide mb-0.5">Clinical Indication</div>
                                    <div className="text-indigo-700 font-medium">{order.clinicalIndication}</div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 col-span-2 md:col-span-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Result Value <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                required
                                value={resultValue}
                                onChange={(e) => setResultValue(e.target.value)}
                                placeholder="e.g. 120"
                                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition"
                            />
                        </div>

                        <div className="space-y-2 col-span-2 md:col-span-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Unit</label>
                            <input
                                type="text"
                                value={unit}
                                onChange={(e) => setUnit(e.target.value)}
                                placeholder="e.g. mg/dL"
                                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition"
                            />
                        </div>

                        <div className="space-y-2 col-span-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Reference Range</label>
                            <input
                                type="text"
                                value={referenceRange}
                                onChange={(e) => setReferenceRange(e.target.value)}
                                placeholder="e.g. 70-110 mg/dL"
                                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition"
                            />
                        </div>

                        <div className="space-y-2 col-span-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Technician Remarks (Optional)</label>
                            <textarea
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                                placeholder="Any notes on sample condition or methodology..."
                                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition resize-none h-20"
                            />
                        </div>

                        <div className="space-y-2 col-span-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Attach Report (PDF)</label>
                            <div className="flex items-center gap-3">
                                <label className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition text-sm font-semibold text-slate-600">
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                // Mock upload locally
                                                console.log("File selected:", file.name);
                                            }
                                        }}
                                    />
                                    <FileText size={16} />
                                    <span>Choose File</span>
                                </label>
                                <span className="text-xs text-slate-400 italic">No file selected (Mock Upload)</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-6 flex items-center justify-end gap-3 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                            ) : (
                                <Check size={18} />
                            )}
                            Submit Result
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
}
