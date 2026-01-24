"use client";

import React, { useEffect, useState } from "react";
import { getRadiologyWorklist, ServiceOrder, collectSample } from "@/lib/mock-data";
import { Search, Filter, FlaskConical, TestTube, Syringe, FileText, CheckCircle, Clock, AlertCircle, Eye, Activity, Truck, Radiation, Scan } from "lucide-react";
import { cn } from "@/lib/utils";
import ResultEntryModal from "./result-entry-modal";
import Link from 'next/link';

export default function RadiologyDashboard() {
    const [orders, setOrders] = useState<ServiceOrder[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<ServiceOrder | null>(null);
    const [isResultModalOpen, setIsResultModalOpen] = useState(false);

    const fetchOrders = async () => {
        setLoading(true);
        const data = await getRadiologyWorklist();
        setOrders(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStartExam = async (orderId: string) => {
        // Re-using collectSample as "Start/Complete Exam" for now as it sets status to SampleCollected
        // In real app, might have separate status like "ExamStarted", "ExamCompleted"
        const updated = await collectSample(orderId);
        if (updated) {
            // alert("Exam Completed Successfully!"); 
            fetchOrders();
        }
    };

    const openResultModal = (order: ServiceOrder) => {
        setSelectedOrder(order);
        setIsResultModalOpen(true);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Ordered": return "bg-gray-100 text-gray-600 border-gray-200";
            case "SampleCollected": return "bg-blue-50 text-blue-600 border-blue-200"; // Intepreted as Exam Completed
            case "ResultAvailable": return "bg-yellow-50 text-yellow-600 border-yellow-200";
            case "Completed": return "bg-green-50 text-green-600 border-green-200";
            default: return "bg-gray-50 text-gray-500 border-gray-100";
        }
    };

    return (
        <div className="space-y-6">
            {/* Page Header with Quick Links */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Radiology Worklist</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage imaging requests and reports.</p>
                </div>
                <div className="flex gap-3">
                    <Link
                        href="/dashboard/radiologytech/tracking"
                        className="px-4 py-2 bg-white text-slate-700 border border-slate-200 rounded-xl text-sm font-semibold hover:bg-slate-50 transition shadow-sm flex items-center gap-2"
                    >
                        <Truck size={16} className="text-slate-500" />
                        Exam Tracking
                    </Link>
                    <Link
                        href="/dashboard/radiologytech/validation"
                        className="px-4 py-2 bg-white text-slate-700 border border-slate-200 rounded-xl text-sm font-semibold hover:bg-slate-50 transition shadow-sm flex items-center gap-2"
                    >
                        <Activity size={16} className="text-slate-500" />
                        Report Validation
                    </Link>
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/20 flex items-center gap-2">
                        <Filter size={16} />
                        Filter
                    </button>
                </div>
            </div>

            {/* Worklist Table */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search by Patient or Exam..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4">Order ID</th>
                                <th className="px-6 py-4">Patient Details</th>
                                <th className="px-6 py-4">Exam Info</th>
                                <th className="px-6 py-4">Priority</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400">Loading worklist...</td>
                                </tr>
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400">No pending orders found.</td>
                                </tr>
                            ) : (
                                orders
                                    .filter(order =>
                                        order.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                        order.testName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                        order.result?.resultValue?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                        order.id.toLowerCase().includes(searchQuery.toLowerCase())
                                    )
                                    .map((order) => (
                                        <tr key={order.id} className="hover:bg-slate-50/50 transition bg-white group">
                                            <td className="px-6 py-4 font-medium text-slate-700">
                                                <div className="flex items-center gap-2">
                                                    <Scan size={16} className="text-slate-400" />
                                                    {order.id}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-slate-900">{order.patientName}</div>
                                                <div className="text-xs text-slate-500">{order.uhid} • {order.gender}/{order.age}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-slate-700">{order.testName}</div>
                                                <div className="text-xs text-slate-500">{order.department}</div>
                                                {order.clinicalIndication && (
                                                    <div className="text-[10px] text-indigo-600 mt-0.5 font-medium flex items-center gap-1">
                                                        <FileText size={10} /> {order.clinicalIndication}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {order.priority === "Stat" ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-600 border border-red-100 animate-pulse">
                                                        <AlertCircle size={12} /> STAT
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                                                        Routine
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={cn(
                                                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border",
                                                    getStatusColor(order.status)
                                                )}>
                                                    <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60"></span>
                                                    {order.status === "SampleCollected" ? "Exam Completed" : order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                    {order.status === "Ordered" && (
                                                        <button
                                                            onClick={() => handleStartExam(order.id)}
                                                            className="px-3 py-1.5 text-xs font-semibold bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 border border-blue-200 transition flex items-center gap-1.5"
                                                        >
                                                            <Radiation size={14} /> Complete Exam
                                                        </button>
                                                    )}

                                                    {(order.status === "SampleCollected") && (
                                                        <button
                                                            onClick={() => openResultModal(order)}
                                                            className="px-3 py-1.5 text-xs font-semibold bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 border border-indigo-200 transition flex items-center gap-1.5"
                                                        >
                                                            <FileText size={14} /> Write Report
                                                        </button>
                                                    )}
                                                    {(order.status === "ResultAvailable" || order.status === "Completed") && (
                                                        <div className="flex gap-1.5">
                                                            {order.result?.documentUrl && (
                                                                <a
                                                                    href={order.result.documentUrl}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="px-3 py-1.5 text-xs font-semibold bg-red-50 text-red-600 rounded-lg hover:bg-red-100 border border-red-200 transition flex items-center gap-1.5"
                                                                    title="View PDF Report"
                                                                >
                                                                    <FileText size={14} /> PDF
                                                                </a>
                                                            )}
                                                            <button
                                                                onClick={() => openResultModal(order)}
                                                                className="px-3 py-1.5 text-xs font-semibold bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100 border border-slate-200 transition flex items-center gap-1.5"
                                                            >
                                                                <Eye size={14} /> View
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Result Entry Modal - Reusing/Adapting */}
            {selectedOrder && (
                <ResultEntryModal
                    isOpen={isResultModalOpen}
                    onClose={() => setIsResultModalOpen(false)}
                    order={selectedOrder}
                    onSuccess={() => {
                        setIsResultModalOpen(false);
                        fetchOrders();
                    }}
                />
            )}
        </div>
    );
}
