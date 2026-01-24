"use client";

import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

export function DischargeTab() {
    return (
        <div className="max-w-3xl mx-auto bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl text-center">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">Ready for Discharge?</h2>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">
                Generate the final discharge summary and clearance checklist. This action will notify billing and nursing.
            </p>

            <Link href="/dashboard/doctor/ipd">
                <button className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-xl shadow-emerald-200 transition-all">
                    Initiate Discharge Process
                </button>
            </Link>
        </div>
    )
}
