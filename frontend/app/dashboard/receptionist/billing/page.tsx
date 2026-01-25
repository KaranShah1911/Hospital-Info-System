"use client";

import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { SectionHeader } from '@/components/ui/section-header';
import { CreditCard, Receipt, Wallet, DollarSign, Printer, Download, Search } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export default function BillingPage() {
    const [activeTab, setActiveTab] = useState('New Invoice');
    const [searchTerm, setSearchTerm] = useState('');
    const [patient, setPatient] = useState<any | null>(null);
    const [billData, setBillData] = useState<any | null>(null);
    const [visitId, setVisitId] = useState<string | null>(null);
    const [admissionId, setAdmissionId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && searchTerm) {
            e.preventDefault();
            setLoading(true);
            setBillData(null);
            setPatient(null);
            setVisitId(null);
            setAdmissionId(null); // Reset

            try {
                // SINGLE API CALL: Fetches Bill + Patient + Context
                const res = await api.get(`/billing/visits/active?uhid=${searchTerm}`);
                const data = res.data.data;

                // Handle "Bill is Paid" Response
                if (data.status === "Paid") {
                    setBillData(null); // Clear active bill
                    setPatient(data.patient); // Set patient to show who it is
                    setVisitId(null);
                    setAdmissionId(null);

                    toast.success("Active Bill is already PAID");
                    // Show a specific UI state for Paid
                    // We can use a temporary state or just alert
                    // Let's set a "isPaid" flag in state to render "Paid" UI
                    return;
                }

                if (data) {
                    setBillData(data);

                    // Set Patient from response
                    if (data.patient) {
                        setPatient(data.patient);
                    }

                    // Set Context ID for Finalization
                    if (data.meta?.visitId) {
                        setVisitId(data.meta.visitId);
                    }
                    if (data.meta?.admissionId) {
                        setAdmissionId(data.meta.admissionId);
                    }

                    toast.success("Bill loaded");
                }
            } catch (err: any) {
                if (err.response && err.response.status === 404) {
                    toast.error("No active bill found for this UHID");
                } else {
                    toast.error("Error fetching bill details");
                    console.error(err);
                }
            } finally {
                setLoading(false);
            }
        }
    };

    // Auto-search on button click needs to pass simulated event or just call logic
    const manualSearch = () => {
        handleSearch({ key: 'Enter', preventDefault: () => { } } as any);
    };

    const handleFinalize = async () => {
        if (!visitId && !admissionId) return;
        setLoading(true);
        try {
            // Send both, backend handles whichever is present
            await api.post('/billing/finalize', { visitId, admissionId });

            toast.success("Payment Collected & Items Marked Paid");
            setBillData(null);
            setVisitId(null);
            setAdmissionId(null);
            setPatient(null);
        } catch (e) {
            toast.error("Payment failed");
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-[1400px] mx-auto space-y-8 pb-20">
            <PageHeader title="Financial & Billing" description="Invoicing, Payments & Insurance Claims" />

            {/* Tabs */}
            <div className="flex gap-4 border-b border-slate-200 pb-1">
                {['New Invoice', 'Transaction History', 'Pending Claims'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-3 font-bold text-sm rounded-t-xl transition-all ${activeTab === tab
                            ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50'
                            : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Invoice Form */}
                <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
                    <SectionHeader icon={Receipt} title="Generate Invoice" iconClassName="text-indigo-600" />

                    {/* Search Patient */}
                    <div className="bg-slate-50 p-4 rounded-2xl mb-8 border border-slate-100 space-y-4">
                        <div className="flex gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={handleSearch}
                                    placeholder="Enter Patient UHID to Fetch Bill..."
                                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-sm outline-none focus:border-indigo-500"
                                />
                            </div>
                            <button
                                onClick={manualSearch}
                                className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all"
                            >
                                Fetch Bill
                            </button>
                        </div>
                    </div>

                    {billData ? (
                        <div className="space-y-6">
                            {/* Printable Area */}
                            <div id="print-area" className="bg-white p-8 md:p-12 rounded-none md:rounded-[2.5rem] border-0 md:border md:border-slate-100 shadow-none md:shadow-xl relative overflow-hidden print:w-full print:absolute print:top-0 print:left-0 print:rounded-none print:shadow-none print:z-[9999] print:m-0">
                                {/* Print Header */}
                                <div className="hidden print:flex flex-col items-center mb-8 border-b pb-8">
                                    <h1 className="text-3xl font-black text-slate-900">MediFlow Hospital</h1>
                                    <p className="text-sm text-slate-500 font-medium mt-1">123 Health Avenue, Medical City, NY 10001</p>
                                    <p className="text-sm text-slate-500 font-medium">Ph: +1 (555) 123-4567 • Email: billing@mediflow.com</p>
                                </div>

                                <div className="flex items-start justify-between mb-8 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 text-indigo-900 print:bg-white print:border-none print:p-0">
                                    <div>
                                        <div className="text-xs font-bold uppercase tracking-wider opacity-70">Patient Details</div>
                                        <div className="font-black text-xl mt-1">{patient?.firstName} {patient?.lastName}</div>
                                        <div className="text-sm font-bold opacity-80 mt-1">UHID: {patient?.uhid}</div>
                                        <div className="text-sm font-medium opacity-60">Admission: {billData.ipd?.points.length > 0 ? "IPD" : "OPD"}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs font-bold uppercase tracking-wider opacity-70">Invoice Date</div>
                                        <div className="font-bold text-lg">{new Date().toLocaleDateString()}</div>
                                        <div className="text-sm font-bold opacity-70 mt-1">Time: {new Date().toLocaleTimeString()}</div>
                                    </div>
                                </div>

                                <div className="border rounded-2xl overflow-hidden print:border-slate-300">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-slate-50 border-b border-slate-200 print:bg-slate-100">
                                            <tr>
                                                <th className="p-4 font-black text-slate-500 uppercase tracking-wider">Item Description</th>
                                                <th className="p-4 font-black text-slate-500 text-right uppercase tracking-wider">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {(() => {
                                                // Combine all points
                                                const allPoints = [...(billData.opd?.points || []), ...(billData.ipd?.points || [])];
                                                // Group by Department
                                                const groups: Record<string, any[]> = {};
                                                allPoints.forEach(p => {
                                                    const dept = p.department || 'General';
                                                    if (!groups[dept]) groups[dept] = [];
                                                    groups[dept].push(p);
                                                });

                                                return Object.entries(groups).map(([dept, items]) => (
                                                    <React.Fragment key={dept}>
                                                        <tr className="bg-slate-50/80 print:bg-slate-50">
                                                            <td colSpan={2} className="p-3 pl-4 font-black text-indigo-900 uppercase tracking-widest text-xs">{dept}</td>
                                                        </tr>
                                                        {items.map((item: any, idx: number) => (
                                                            <tr key={`${item.id}-${idx}`} className="hover:bg-slate-50/50">
                                                                <td className="p-4">
                                                                    <div className="font-bold text-slate-700">{item.name}</div>
                                                                    <div className="text-[10px] font-bold text-slate-400 uppercase">{item.type}</div>
                                                                </td>
                                                                <td className="p-4 font-bold text-slate-700 text-right font-mono">${item.amount.toLocaleString()}</td>
                                                            </tr>
                                                        ))}
                                                        {/* Subtotal for Group? Optional but nice */}
                                                    </React.Fragment>
                                                ));
                                            })()}

                                            {(!billData.opd?.points.length && !billData.ipd?.points.length) && (
                                                <tr><td colSpan={2} className="p-6 text-center text-slate-400 font-bold">No billable items found.</td></tr>
                                            )}
                                        </tbody>
                                        <tfoot className="bg-slate-50 border-t border-slate-200 print:bg-slate-100">
                                            <tr>
                                                <td className="p-4 font-black text-slate-900 text-right uppercase tracking-wider">Grand Total</td>
                                                <td className="p-4 font-black text-indigo-600 text-right text-2xl font-mono border-t-2 border-indigo-100 bg-indigo-50/30">
                                                    ${billData.grandTotal.toLocaleString()}
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>

                                {/* Print Footer */}
                                <div className="hidden print:flex mt-12 pt-8 border-t justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    <div>Auth. Signatory</div>
                                    <div>Thank you for choosing MediFlow</div>
                                </div>
                            </div>

                            <div className="mt-8 flex gap-4 print:hidden">
                                <button
                                    onClick={handleFinalize}
                                    disabled={loading || billData.grandTotal === 0}
                                    className="flex-1 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                                >
                                    <DollarSign size={20} /> {loading ? 'Processing...' : 'Collect Payment'}
                                </button>
                                <button
                                    onClick={() => window.print()}
                                    className="px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-2xl hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 transition-all flex items-center gap-2 shadow-sm"
                                >
                                    <Printer size={20} /> Print Invoice
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {patient && !billData ? (
                                <div className="flex flex-col items-center justify-center py-16 bg-emerald-50 rounded-[2.5rem] border border-emerald-100 text-emerald-900">
                                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                                        <Receipt size={32} className="text-emerald-600" />
                                    </div>
                                    <h2 className="text-2xl font-black mb-2">Active Bill is Paid</h2>
                                    <p className="font-medium opacity-70 max-w-md text-center">
                                        There are no pending dues for patient <span className="font-bold">{patient.firstName} {patient.lastName} ({patient.uhid})</span>.
                                    </p>
                                </div>
                            ) : (
                                <div className="text-center py-12 text-slate-400 font-bold border-2 border-dashed border-slate-100 rounded-3xl">
                                    Search for a patient and load their visit to generate an invoice.
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Payment Methods & History */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-[2rem] shadow-lg border border-slate-100">
                        <SectionHeader icon={Wallet} title="Payment Mode" iconClassName="text-emerald-600" />
                        <div className="grid grid-cols-2 gap-3">
                            {['Cash', 'Credit Card', 'Insurance', 'UPI / Digi'].map(mode => (
                                <button key={mode} className="p-4 rounded-xl border-2 border-slate-100 font-bold text-sm text-slate-600 hover:border-indigo-500 hover:text-indigo-600 transition-all text-center">
                                    {mode}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
