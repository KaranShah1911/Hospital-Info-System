"use client";

import { PageHeader } from '@/components/ui/page-header';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { PatientCard } from '@/components/ipd/PatientCard';

const MOCK_PATIENTS = [
    { id: '1', name: 'Rajesh Kumar', age: 45, uhid: 'UHID-2024-X91', bed: 'ICU-04', diagnosis: 'Dengue Hemorrhagic Fever', status: 'Critical', admitDay: 3, color: 'bg-rose-500' },
    { id: '2', name: 'Priya Sharma', age: 32, uhid: 'UHID-2024-Y22', bed: 'Ward-A-12', diagnosis: 'Acute Appendicitis (Post-Op)', status: 'Stable', admitDay: 2, color: 'bg-emerald-500' },
    { id: '3', name: 'Amit Verma', age: 58, uhid: 'UHID-2024-Z55', bed: 'Ward-B-03', diagnosis: 'Uncontrolled Diabetes', status: 'Observation', admitDay: 5, color: 'bg-amber-500' },
    { id: '4', name: 'Sita Devi', age: 65, uhid: 'UHID-2024-A11', bed: 'ICU-02', diagnosis: 'Pneumonia', status: 'Serious', admitDay: 4, color: 'bg-orange-500' },
];

export default function DoctorIPD() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <PageHeader title="In-Patient Department (IPD)" description="Monitor admitted patients and manage care plans." />
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input type="text" placeholder="Search Patient / Bed..." className="pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-white font-medium text-sm focus:ring-2 focus:ring-indigo-100 outline-none w-64" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {MOCK_PATIENTS.map((p) => (
                    <PatientCard key={p.id} patient={p} />
                ))}
            </div>
        </div>
    );
}
