"use client";

import { Plus, Pill } from 'lucide-react';

export function PrescriptionForm() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                <div className="flex flex-col md:flex-row gap-4 flex-1">
                    <input type="text" placeholder="Medicine Name" className="flex-1 px-4 py-2 rounded-xl border border-indigo-200 text-sm font-bold placeholder:font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                    <select className="px-4 py-2 rounded-xl border border-indigo-200 text-sm font-bold text-slate-600 bg-white focus:outline-none">
                        <option>1-0-1</option>
                        <option>1-1-1</option>
                        <option>1-0-0</option>
                        <option>0-0-1</option>
                        <option>SOS</option>
                    </select>
                    <select className="px-4 py-2 rounded-xl border border-indigo-200 text-sm font-bold text-slate-600 bg-white focus:outline-none">
                        <option>5 Days</option>
                        <option>3 Days</option>
                        <option>7 Days</option>
                        <option>15 Days</option>
                    </select>
                </div>
                <button className="ml-4 p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
                    <Plus size={20} />
                </button>
            </div>

            <div className="space-y-3">
                {[1, 2].map(i => (
                    <div key={i} className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm group hover:border-indigo-100 transition-colors">
                        <div className="p-2 bg-slate-100 text-slate-500 rounded-lg">
                            <Pill size={20} />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-slate-800">Paracetamol 650mg</h4>
                            <div className="text-xs font-medium text-slate-400 mt-0.5">1-0-1 • After Food • 3 Days</div>
                        </div>
                        <button className="text-slate-300 hover:text-red-500 transition-colors font-bold text-xs uppercase">Remove</button>
                    </div>
                ))}
            </div>
        </div>
    );
}
