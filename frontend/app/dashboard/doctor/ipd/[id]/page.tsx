"use client";

import { PageHeader } from '@/components/ui/page-header';
import { Activity, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Tabs } from '@/components/ui/tabs-custom';
import { OverviewTab } from '@/components/ipd/OverviewTab';
import { OrdersTab } from '@/components/ipd/OrdersTab';
import { NotesTab } from '@/components/ipd/NotesTab';
import { DischargeTab } from '@/components/ipd/DischargeTab';

// Mock Data for Visuals
const PATIENT_DATA = {
    name: 'Rajesh Kumar',
    age: 45,
    gender: 'Male',
    uhid: 'UHID-2024-X91',
    bed: 'ICU-04',
    diagnosis: 'Dengue Hemorrhagic Fever',
    admissionDate: '2024-01-20',
    allergies: ['Penicillin'],
    diet: 'Liquid Diet'
};

export default function PatientCockpit({ params }: { params: { id: string } }) {
    return (
        <div className="space-y-8 pb-20">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/doctor/ipd" className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500">
                    <ArrowLeft size={20} />
                </Link>
                <PageHeader title="Patient Cockpit" description={`Managing care for ${PATIENT_DATA.name}`} />
            </div>

            {/* Patient Header Card */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Activity size={120} />
                </div>

                <div className="relative z-10 flex flex-col lg:flex-row gap-8 lg:items-center">
                    <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                            <h1 className="text-3xl font-black text-slate-900">{PATIENT_DATA.name}</h1>
                            <span className="px-3 py-1 bg-rose-100 text-rose-600 rounded-full text-xs font-black uppercase tracking-wider">Critical</span>
                        </div>
                        <div className="flex flex-wrap gap-6 text-sm font-medium text-slate-500">
                            <span>{PATIENT_DATA.age}y / {PATIENT_DATA.gender}</span>
                            <span>•</span>
                            <span>{PATIENT_DATA.uhid}</span>
                            <span>•</span>
                            <span className="text-slate-900 font-bold">Bed: {PATIENT_DATA.bed}</span>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Diagnosis</div>
                            <div className="font-bold text-slate-800">{PATIENT_DATA.diagnosis}</div>
                        </div>
                        <div className="px-6 py-3 bg-orange-50 rounded-2xl border border-orange-100 text-orange-700">
                            <div className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-60">Allergies</div>
                            <div className="font-bold">{PATIENT_DATA.allergies.join(", ")}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Tabs */}
            <Tabs tabs={[
                {
                    id: 'overview',
                    label: 'Overview & Vitals',
                    content: <OverviewTab />
                },
                {
                    id: 'orders',
                    label: 'Orders (CPOE)',
                    content: <OrdersTab />
                },
                {
                    id: 'notes',
                    label: 'Progress Notes',
                    content: <NotesTab />
                },
                {
                    id: 'discharge',
                    label: 'Discharge Summary',
                    content: <DischargeTab />
                }
            ]} />
        </div>
    );
}
