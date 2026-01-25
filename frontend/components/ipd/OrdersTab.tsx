"use client";

import React, { useEffect, useState } from 'react';
import { Utensils, ClipboardList, AlertTriangle, History, CheckCircle, TestTube, ShoppingCart } from 'lucide-react';
import { SectionHeader } from '@/components/ui/section-header';
import api from '@/lib/api';
import { toast } from 'sonner';

interface OrdersTabProps {
    admissionId?: string;
    patientId?: string;
}

export function OrdersTab({ admissionId, patientId }: OrdersTabProps) {
    // Services State
    const [labServices, setLabServices] = useState<any[]>([]);
    const [radServices, setRadServices] = useState<any[]>([]);
    const [loadingServices, setLoadingServices] = useState(true);

    // Selection State
    const [selectedServiceIds, setSelectedServiceIds] = useState<Set<string>>(new Set());
    const [placingOrder, setPlacingOrder] = useState(false);

    // History State
    const [orderHistory, setOrderHistory] = useState<any[]>([]);

    // ------------------------------------------
    // DATA FETCHING
    // ------------------------------------------
    useEffect(() => {
        const fetchServices = async () => {
            try {
                // Fetch Labs
                const labs = await api.get('/master/services?category=Lab');
                setLabServices(labs.data || []);

                // Fetch Radiology
                const rads = await api.get('/master/services?category=Radiology');
                setRadServices(rads.data || []);
            } catch (error) {
                console.error("Failed to fetch services", error);
            } finally {
                setLoadingServices(false);
            }
        };

        fetchServices();
        fetchOrderHistory();
    }, [admissionId]);

    const fetchOrderHistory = async () => {
        if (!admissionId) return;
        try {
            const res = await api.get(`/orders/admission/${admissionId}`);
            setOrderHistory(res.data.data || []);
        } catch (error) {
            console.error("Failed to fetch order history", error);
        }
    };

    // ------------------------------------------
    // HANDLERS
    // ------------------------------------------
    const toggleService = (id: string) => {
        const next = new Set(selectedServiceIds);
        if (next.has(id)) {
            next.delete(id);
        } else {
            next.add(id);
        }
        setSelectedServiceIds(next);
    };

    const handlePlaceOrder = async () => {
        if (!admissionId || !patientId) {
            toast.error("Missing patient context");
            return;
        }
        if (selectedServiceIds.size === 0) {
            toast.error("Please select at least one test");
            return;
        }

        setPlacingOrder(true);
        try {
            await api.post('/orders/batch-create', {
                patientId,
                admissionId,
                serviceIds: Array.from(selectedServiceIds),
                clinicalIndication: "Routine Admission Order"
            });
            toast.success("Orders placed successfully");
            setSelectedServiceIds(new Set()); // Clear selection
            fetchOrderHistory(); // Refresh history
        } catch (error) {
            console.error("Order failed", error);
            toast.error("Failed to place order");
        } finally {
            setPlacingOrder(false);
        }
    };


    // ------------------------------------------
    // NURSING TASKS (Local State for Demo)
    // ------------------------------------------
    const [tasks, setTasks] = React.useState<{ id: string, name: string, freq: string, start: string, instructions: string, status: 'active' | 'completed', completedBy?: string, completedAt?: string }[]>([
        { id: '1', name: 'Check BP', freq: '2 Hourly', start: 'Now', instructions: 'Notify if > 140/90', status: 'active' },
        { id: '2', name: 'Insulin 10U', freq: 'Before Lunch', start: 'Today', instructions: '', status: 'active' }
    ]);
    const [newTask, setNewTask] = React.useState({ name: '', freq: 'Once', start: 'Now', instructions: '' });

    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTask.name) return;
        setTasks(prev => [...prev, { ...newTask, id: Math.random().toString(), status: 'active' }]);
        setNewTask({ name: '', freq: 'Once', start: 'Now', instructions: '' });
    };

    return (
        <div className="space-y-8">
            {/* 1. CPOE - Lab & Radiology */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl">
                <div className="flex justify-between items-center mb-6">
                    <SectionHeader icon={TestTube} title="Laboratory & Radiology Orders" iconClassName="text-indigo-500" />
                    {selectedServiceIds.size > 0 && (
                        <span className="px-4 py-2 bg-indigo-100 text-indigo-700 font-bold rounded-full text-sm">
                            {selectedServiceIds.size} Selected
                        </span>
                    )}
                </div>

                <div className="space-y-8">
                    {/* Labs */}
                    <div>
                        <h4 className="flex items-center gap-2 font-black text-slate-800 mb-4">
                            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                            Lab Investigations
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                            {loadingServices && <div className="text-sm text-slate-400">Loading services...</div>}
                            {!loadingServices && labServices.length === 0 && <div className="text-sm text-slate-400">No lab services found.</div>}

                            {labServices.map(service => (
                                <div key={service.id} onClick={() => toggleService(service.id)} className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer group ${selectedServiceIds.has(service.id) ? 'bg-indigo-50 border-indigo-500' : 'bg-slate-50 border-slate-100 hover:border-indigo-300'}`}>
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${selectedServiceIds.has(service.id) ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'}`}>
                                            {selectedServiceIds.has(service.id) && <CheckCircle size={10} className="text-white" />}
                                        </div>
                                        <span className={`text-xs font-bold leading-tight ${selectedServiceIds.has(service.id) ? 'text-indigo-900' : 'text-slate-700'}`}>{service.name}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Radiology */}
                    <div>
                        <h4 className="flex items-center gap-2 font-black text-slate-800 mb-4">
                            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                            Radiology & Imaging
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                            {loadingServices && <div className="text-sm text-slate-400">Loading services...</div>}
                            {!loadingServices && radServices.length === 0 && <div className="text-sm text-slate-400">No radiology services found.</div>}

                            {radServices.map(service => (
                                <div key={service.id} onClick={() => toggleService(service.id)} className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer group ${selectedServiceIds.has(service.id) ? 'bg-rose-50 border-rose-500' : 'bg-slate-50 border-slate-100 hover:border-rose-300'}`}>
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${selectedServiceIds.has(service.id) ? 'bg-rose-600 border-rose-600' : 'border-gray-300'}`}>
                                            {selectedServiceIds.has(service.id) && <CheckCircle size={10} className="text-white" />}
                                        </div>
                                        <span className={`text-xs font-bold leading-tight ${selectedServiceIds.has(service.id) ? 'text-rose-900' : 'text-slate-700'}`}>{service.name}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-slate-100">
                        <button onClick={handlePlaceOrder} disabled={placingOrder} className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-lg disabled:opacity-50">
                            {placingOrder ? 'Processing...' : 'Sign & Place Orders'}
                        </button>
                    </div>
                </div>
            </div>

            {/* 2. Order History */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl">
                <SectionHeader icon={History} title="Active Clinical Orders History" iconClassName="text-slate-500" />
                <div className="mt-6">
                    {orderHistory.length === 0 ? (
                        <p className="text-slate-400 text-sm">No orders placed yet.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {orderHistory.map((order) => (
                                <div key={order.id} className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-full ${order.service?.category === 'Lab' ? 'bg-indigo-100 text-indigo-600' : 'bg-rose-100 text-rose-600'}`}>
                                            <div className="w-2 h-2 rounded-full bg-current"></div>
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-800 text-sm">{order.service?.name || "Unknown Service"}</div>
                                            <div className="text-xs font-bold text-slate-400">
                                                Ordered by {order.doctor?.fullName || 'Doctor'} • {new Date(order.orderDate).toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-full uppercase tracking-wider">{order.status}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* 3. Nursing Tasks (Interactive) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 1. Dietary Orders */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl">
                    <SectionHeader icon={Utensils} title="Dietary Orders" iconClassName="text-emerald-500" />
                    <form className="mt-6 space-y-6">
                        <div className="space-y-4">
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Diet Type</label>
                            <div className="grid grid-cols-2 gap-3">
                                {['Normal', 'Soft', 'Liquid', 'Diabetic', 'Renal', 'NBM'].map(d => (
                                    <label key={d} className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
                                        <input type="radio" name="diet" className="w-4 h-4 text-emerald-600 accent-emerald-600" />
                                        <span className="text-sm font-bold text-slate-700">{d}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <button className="w-full py-3 bg-emerald-600 text-white font-black rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200">
                            Update Diet
                        </button>
                    </form>
                </div>

                {/* 2. Nursing Tasks (Interactive) */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl flex flex-col">
                    <SectionHeader icon={ClipboardList} title="Add Nursing Task" iconClassName="text-indigo-500" />

                    {/* Active Task Stack */}
                    <div className="mt-6 mb-6 space-y-2 max-h-[200px] overflow-y-auto custom-scrollbar pr-2">
                        <div className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1 mb-2">Active Tasks Queue</div>
                        {tasks.filter(t => t.status === 'active').length === 0 && (
                            <div className="text-sm text-slate-400 italic pl-1">No active tasks queued.</div>
                        )}
                        {tasks.filter(t => t.status === 'active').map((task) => (
                            <div key={task.id} className="p-3 bg-indigo-50 rounded-xl border border-indigo-100 flex justify-between items-center group">
                                <div>
                                    <div className="font-bold text-indigo-900 text-sm">{task.name}</div>
                                    <div className="text-xs font-bold text-indigo-400">{task.freq} • {task.start}</div>
                                </div>
                                <button onClick={() => setTasks(prev => prev.filter(p => p.id !== task.id))} className="text-indigo-300 hover:text-rose-500 transition-colors">
                                    <AlertTriangle size={14} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleAddTask} className="space-y-4 mt-auto pt-6 border-t border-slate-100">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">New Task Name</label>
                            <input
                                type="text"
                                value={newTask.name}
                                onChange={e => setNewTask({ ...newTask, name: e.target.value })}
                                placeholder="e.g. Check Blood Sugar"
                                className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Frequency</label>
                                <select
                                    value={newTask.freq}
                                    onChange={e => setNewTask({ ...newTask, freq: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100"
                                >
                                    <option>Once</option>
                                    <option>Hourly</option>
                                    <option>2 Hourly</option>
                                    <option>4 Hourly</option>
                                    <option>6 Hourly</option>
                                    <option>8 Hourly</option>
                                    <option>12 Hourly</option>
                                    <option>Daily</option>
                                    <option>SOS</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Start From</label>
                                <select
                                    value={newTask.start}
                                    onChange={e => setNewTask({ ...newTask, start: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100"
                                >
                                    <option>Now</option>
                                    <option>Next Round</option>
                                    <option>Tomorrow Morning</option>
                                </select>
                            </div>
                        </div>

                        <button type="submit" className="w-full py-3 bg-indigo-600 text-white font-black rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
                            Add to Queue
                        </button>
                    </form>
                </div>
            </div>

        </div>
    )
}
