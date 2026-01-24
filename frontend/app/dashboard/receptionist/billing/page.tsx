"use client";

import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { SectionHeader } from '@/components/ui/section-header';
import { CreditCard, Receipt, Wallet, DollarSign, Printer, Download, Search } from 'lucide-react';

export default function BillingPage() {
    const [activeTab, setActiveTab] = useState('New Invoice');

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
                    <div className="bg-slate-50 p-4 rounded-2xl mb-8 flex gap-4 border border-slate-100">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input type="text" placeholder="Search Patient by UHID or Name..." className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-sm outline-none focus:border-indigo-500" />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-2xl border border-slate-200">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Service Type</label>
                                <select className="w-full font-bold outline-none bg-white text-slate-800"><option>Consultation</option><option>Lab Test</option><option>Pharmacy</option></select>
                            </div>
                            <div className="p-4 rounded-2xl border border-slate-200">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Doctor / Dept</label>
                                <select className="w-full font-bold outline-none bg-white text-slate-800"><option>Dr. Sarah Smith</option><option>General Ward</option></select>
                            </div>
                        </div>

                        {/* Line Items Mock */}
                        <div className="border rounded-2xl overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="p-4 font-black text-slate-500">Item</th>
                                        <th className="p-4 font-black text-slate-500 text-right">Cost</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="p-4 font-bold text-slate-700">OPD Consultation Type A</td>
                                        <td className="p-4 font-bold text-slate-700 text-right">$50.00</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-bold text-slate-700">Registration Fee</td>
                                        <td className="p-4 font-bold text-slate-700 text-right">$10.00</td>
                                    </tr>
                                </tbody>
                                <tfoot className="bg-slate-50 border-t border-slate-200">
                                    <tr>
                                        <td className="p-4 font-black text-slate-900">Total Payable</td>
                                        <td className="p-4 font-black text-indigo-600 text-right text-lg">$60.00</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                    <div className="mt-8 flex gap-4">
                        <button className="flex-1 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                            <DollarSign size={20} /> Collect Payment
                        </button>
                        <button className="px-6 py-4 border-2 border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 flex items-center gap-2">
                            <Printer size={20} /> Print Intent
                        </button>
                    </div>
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

                    <div className="bg-slate-900 p-6 rounded-[2rem] shadow-xl text-white">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold">Recent Transactions</h3>
                            <button className="p-2 bg-white/10 rounded-lg hover:bg-white/20"><Download size={16} /></button>
                        </div>
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                                    <div>
                                        <div className="text-xs font-bold text-slate-400">#INV-2024-00{i}</div>
                                        <div className="text-sm font-bold">John Doe</div>
                                    </div>
                                    <div className="text-emerald-400 font-black">+$60.00</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
