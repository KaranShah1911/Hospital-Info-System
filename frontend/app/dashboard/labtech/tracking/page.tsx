"use client";

import React, { useEffect, useState } from "react";
// import { getLabWorklist, ServiceOrder } from "@/lib/mock-data"; 
import api from "@/lib/api";
import { Search, Clock, CheckCircle, Truck, FileText, AlertCircle, Syringe, FlaskConical, Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { ServiceOrder } from "../page";

export default function SampleTracking() {
    const [orders, setOrders] = useState<ServiceOrder[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedOrder, setSelectedOrder] = useState<ServiceOrder | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await api.get('/lab/worklist?category=Lab');
            // Map API response to ServiceOrder type
            const mappedOrders = res.data.data.map((o: any) => ({
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
                result: o.labResults?.[0] ? { resultValue: o.labResults[0].resultValue } : null,
                trackingEvents: o.trackingEvents || [] // If backend supports tracking events, else likely empty or need to mock for UI 
            }));
            setOrders(mappedOrders);
        } catch (error) {
            console.error("Failed to fetch orders", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleCollectSample = async (orderId: string) => {
        try {
            await api.patch(`/lab/update-status/${orderId}`, { status: 'SampleCollected' });
            toast.success("Sample Marked Collected");
            // Update local state: Move to SampleCollected or remove if we only want 'Ordered' here?
            // User said: "you will click sample collected and that thing will move in validation"
            // This implies it disappears from here or status changes. Current page shows list.
            // Let's update status locally.
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'SampleCollected' } : o));

            // If we only show 'Ordered', we should filter it out?
            // The UI below `filteredOrders` logic maps everything.
            // But usually 'Tracking' shows history too. Let's keep it but maybe visually indicate.
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const filteredOrders = orders.filter(
        (order) =>
            (order.status === 'Ordered') && // User implied this page is for collecting samples
            (order.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order.uhid.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "Ordered": return <FileText size={16} />;
            case "SampleCollected": return <Syringe size={16} />;
            case "ResultAvailable": return <FlaskConical size={16} />;
            case "Completed": return <CheckCircle size={16} />;
            default: return <Clock size={16} />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Ordered": return "bg-gray-100 text-gray-600 border-gray-200";
            case "SampleCollected": return "bg-blue-100 text-blue-600 border-blue-200";
            case "ResultAvailable": return "bg-yellow-100 text-yellow-600 border-yellow-200";
            case "Completed": return "bg-green-100 text-green-600 border-green-200";
            default: return "bg-gray-100 text-gray-500 border-gray-200";
        }
    };

    return (
        <div className="h-[calc(100vh-2rem)] flex gap-6">
            {/* Left Panel: Search & List */}
            <div className="w-full max-w-md flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                    <h2 className="text-lg font-bold text-slate-800 mb-4">Sample Tracking</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search Order ID, Patient, or UHID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition shadow-sm"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                    {loading ? (
                        <div className="text-center py-10 text-slate-400 text-sm">Loading orders...</div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="text-center py-10 text-slate-400 text-sm">No orders found.</div>
                    ) : (
                        filteredOrders.map((order) => (
                            <div
                                key={order.id}
                                onClick={() => setSelectedOrder(order)}
                                className={cn(
                                    "p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md",
                                    selectedOrder?.id === order.id
                                        ? "bg-indigo-50 border-indigo-200 ring-1 ring-indigo-500/20 shadow-sm"
                                        : "bg-white border-slate-100 hover:border-slate-300"
                                )}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-bold text-slate-700 text-sm">{order.id}</span>
                                    <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide border", getStatusColor(order.status))}>
                                        {order.status}
                                    </span>
                                </div>
                                <div className="text-sm font-semibold text-slate-900">{order.patientName}</div>
                                <div className="text-xs text-slate-500 mt-0.5">{order.testName}</div>
                                <div className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
                                    <Clock size={10} />
                                    {format(new Date(order.orderDate), "MMM dd, HH:mm")}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Right Panel: Timeline Details */}
            <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-8 overflow-y-auto custom-scrollbar relative">
                {!selectedOrder ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                            <Truck size={32} className="opacity-50" />
                        </div>
                        <p className="font-medium">Select an order to view tracking details</p>
                    </div>
                ) : (
                    <div className="max-w-2xl mx-auto">
                        <div className="mb-8 pb-6 border-b border-slate-100">
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">{selectedOrder.testName}</h2>
                            <div className="flex items-center gap-4 text-sm text-slate-500">
                                <span className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded-lg text-slate-700 font-medium">
                                    <div className="w-2 h-2 rounded-full bg-slate-400" />
                                    {selectedOrder.id}
                                </span>
                                <span>•</span>
                                <span className="font-medium text-slate-700">{selectedOrder.patientName}</span>
                                <span>({selectedOrder.gender.charAt(0)}/{selectedOrder.age})</span>
                            </div>
                            {selectedOrder.clinicalIndication && (
                                <div className="mt-4 p-3 bg-indigo-50/50 border border-indigo-100 rounded-lg text-sm text-indigo-700 font-medium flex gap-2">
                                    <Stethoscope size={18} className="shrink-0" />
                                    <span>Indication: {selectedOrder.clinicalIndication}</span>
                                </div>
                            )}
                        </div>

                        <div className="relative pl-8 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-200">
                            {/* Action Area */}
                            {selectedOrder.status === 'Ordered' && (
                                <div className="mb-8 p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-between">
                                    <div>
                                        <h3 className="font-bold text-blue-900">Sample Collection Pending</h3>
                                        <p className="text-sm text-blue-700">Confirm sample collection to proceed to validation.</p>
                                    </div>
                                    <button
                                        onClick={() => handleCollectSample(selectedOrder.id)}
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg shadow-md transition flex items-center gap-2"
                                    >
                                        <Syringe size={16} />
                                        Collect Sample
                                    </button>
                                </div>
                            )}

                            {/* Timeline */}
                            {(selectedOrder.trackingEvents && selectedOrder.trackingEvents.length > 0) ? (
                                selectedOrder.trackingEvents.map((event: any, index: number) => (
                                    <div key={index} className="relative">
                                        <div className={cn(
                                            "absolute -left-[29px] w-6 h-6 rounded-full border-2 flex items-center justify-center bg-white z-10",
                                            // Simple heuristic for current step visualization
                                            (index === 0 && selectedOrder.status === 'Ordered') || (event.status === selectedOrder.status)
                                                ? "border-indigo-600 text-indigo-600 shadow-lg shadow-indigo-600/20 ring-4 ring-indigo-50"
                                                : "border-slate-300 text-slate-400"
                                        )}>
                                            {getStatusIcon(event.status || 'Ordered')}
                                        </div>

                                        <div className={cn(
                                            "p-5 rounded-xl border transition-all",
                                            event.status === selectedOrder.status
                                                ? "bg-white border-indigo-200 shadow-lg shadow-indigo-100 ring-1 ring-indigo-500/10"
                                                : "bg-slate-50 border-slate-200"
                                        )}>
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                                <h4 className={cn(
                                                    "font-bold text-base",
                                                    event.status === selectedOrder.status ? "text-indigo-700" : "text-slate-700"
                                                )}>
                                                    {event.status ? event.status.replace(/([A-Z])/g, ' $1').trim() : 'Status Unknown'}
                                                </h4>
                                                <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 bg-white px-2 py-1 rounded-md border border-slate-100">
                                                    <Clock size={12} />
                                                    {event.timestamp && format(new Date(event.timestamp), "MMM dd, yyyy • hh:mm a")}
                                                </span>
                                            </div>

                                            <div className="text-sm text-slate-600 flex items-center gap-2 mb-1">
                                                <span className="text-slate-400">Performed by:</span>
                                                <span className="font-semibold bg-slate-200/50 px-2 py-0.5 rounded text-xs">{event.performedBy || 'System'}</span>
                                            </div>

                                            {event.remarks && (
                                                <div className="mt-3 text-sm bg-red-50 text-red-700 p-3 rounded-lg border border-red-100 flex gap-2 items-start">
                                                    <AlertCircle size={16} className="mt-0.5 shrink-0" />
                                                    <div>
                                                        <span className="font-bold block text-xs uppercase tracking-wide mb-0.5">Remarks</span>
                                                        {event.remarks}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-slate-400 text-sm italic">No tracking history available.</div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
