"use client";

import React, { useState } from "react";
import { ServiceOrder, submitResult } from "@/lib/mock-data";
import { X, Check, Save, FileText, FlaskConical, Stethoscope, AlertTriangle, Scan } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResultEntryModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: ServiceOrder;
    onSuccess: () => void;
}

export default function ResultEntryModal({ isOpen, onClose, order, onSuccess }: ResultEntryModalProps) {
    const [reportContent, setReportContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [technicianId, setTechnicianId] = useState("RAD-TECH-001");

    if (!isOpen) return null;

    // View mode if status is already ResultAvailable or Completed
    const isViewMode = order.status === "ResultAvailable" || order.status === "Completed";

    // In a real app, we would fetch existing result here if in view mode
    // For mock, we'll just show the initialized empty state or a mock value if we had it in `order` object easily accessible
    // But `order` doesn't strictly have `result` in the mock list item, only in detail view usually.
    // However, `lib/mock-data.ts` `ServiceOrder` DOES have `result?: LabResult`. 
    // Let's try to pre-fill if available.
    if (isViewMode && !reportContent && order.result?.resultValue) {
        setReportContent(order.result.resultValue);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const resultData = {
            serviceOrderId: order.id,
            testName: order.testName,
            resultValue: reportContent, // In Radiology, this is the full report text
            referenceRange: "N/A", // Not applicable for radiology reports usually
            unit: "Text",
            technicianId: technicianId,
            documentUrl: "https://example.com/mock-rad-report.pdf", // Mock URL
        };

        const success = await submitResult(resultData);

        setIsSubmitting(false);

        if (success) {
            // alert("Report Saved Successfully!"); 
            onSuccess();
        } else {
            alert("Failed to save report. Please try again.");
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
            <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl ring-1 ring-slate-200 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="bg-slate-50 border-b border-slate-100 px-6 py-5 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                            <Scan size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 leading-tight">
                                {isViewMode ? "View Radiology Report" : "Write Radiology Report"}
                            </h2>
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
                <div className="overflow-y-auto p-6 space-y-6">
                    {/* Patient Context */}
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Patient</span>
                            <div className="font-semibold text-slate-900">{order.patientName}</div>
                            <div className="text-slate-500 text-xs">{order.uhid}</div>
                        </div>
                        <div>
                            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Indication</span>
                            <div className="font-medium text-slate-700">{order.clinicalIndication || "N/A"}</div>
                        </div>
                    </div>

                    <form id="report-form" onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                                Report Findings <span className="text-red-500">*</span>
                            </label>
                            {isViewMode && !order.result ? (
                                <div className="p-4 bg-slate-50 rounded-xl text-slate-400 italic text-sm">
                                    No content available to view.
                                </div>
                            ) : (
                                <textarea
                                    required
                                    value={reportContent}
                                    onChange={(e) => setReportContent(e.target.value)}
                                    readOnly={isViewMode}
                                    placeholder="Enter detailed findings, impressions, and conclusions..."
                                    className="w-full p-4 bg-white border border-slate-200 rounded-xl text-sm leading-relaxed text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition resize-y min-h-[300px] font-serif"
                                />
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Radiologist / Tech</label>
                                <input
                                    type="text"
                                    value={technicianId}
                                    readOnly
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 outline-none cursor-not-allowed"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Date</label>
                                <input
                                    type="text"
                                    value={new Date().toLocaleDateString()}
                                    readOnly
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 outline-none cursor-not-allowed"
                                />
                            </div>
                        </div>

                        {!isViewMode && (
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Attach Scanned Report / DICOM Summary</label>
                                <div className="flex items-center gap-3">
                                    <label className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition text-sm font-semibold text-slate-600">
                                        <input
                                            type="file"
                                            accept=".pdf,.png,.jpg"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    // Mock upload
                                                    console.log("Radiology file selected:", file.name);
                                                }
                                            }}
                                        />
                                        <FileText size={16} />
                                        <span>Upload File</span>
                                    </label>
                                    <span className="text-xs text-slate-400 italic">Supports PDF, PNG, JPG (Mock Upload)</span>
                                </div>
                            </div>
                        )}
                    </form>
                </div>

                {/* Footer Actions */}
                <div className="p-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-white shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition"
                    >
                        Close
                    </button>
                    {!isViewMode && (
                        <button
                            type="submit"
                            form="report-form"
                            disabled={isSubmitting}
                            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                            ) : (
                                <Save size={18} />
                            )}
                            Save Report
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
}
