"use client";

import { PageHeader } from '@/components/ui/page-header';
import { Activity, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Tabs } from '@/components/ui/tabs-custom';
import { OverviewTab } from '@/components/ipd/OverviewTab';
import { OrdersTab } from '@/components/ipd/OrdersTab';
import { NotesTab } from '@/components/ipd/NotesTab';
import { DischargeTab } from '@/components/ipd/DischargeTab';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

import { MOCK_IPD_ADMISSIONS } from '@/lib/ipd-mock-data';

import { useParams } from 'next/navigation';

const DEFAULT_MOCK = {
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

export default function PatientCockpit() {
    const params = useParams();
    const id = params?.id as string;

    const [patientData, setPatientData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                const res = await api.get(`/ipd/admissions/${id}`);
                const data = res.data.data;
                if (data) {
                    setPatientData({
                        name: `${data.patient?.firstName} ${data.patient?.lastName}`,
                        patientId: data.patientId, // Store real patient ID
                        age: data.patient?.age,
                        gender: data.patient?.gender,
                        uhid: data.patient?.uhid,
                        bed: data.currentBed ? `${data.currentBed?.ward?.name} - ${data.currentBed?.bedNumber}` : 'Unassigned',
                        diagnosis: data.reasonForAdmission,
                        admissionDate: data.admissionDate,
                        allergies: ['None Record'], // Real data doesn't have this yet, keep fallback/dummy
                        diet: 'Normal' // Real data doesn't have this yet
                    });
                }
            } catch (error) {
                console.warn("Failed to fetch real patient, attempting mock lookup for ID:", id);

                // MOCK LOOKUP FALLBACK
                const mockMatch = MOCK_IPD_ADMISSIONS.find(m => m.id === id);
                if (mockMatch) {
                    setPatientData({
                        name: `${mockMatch.patient.firstName} ${mockMatch.patient.lastName}`,
                        patientId: 'mock-patient-id', // Mock ID
                        age: mockMatch.patient.age,
                        gender: 'Male', // Mock data needs gender
                        uhid: mockMatch.patient.uhid,
                        bed: mockMatch.currentBed ? `${mockMatch.currentBed.ward.name} - ${mockMatch.currentBed.bedNumber}` : 'Unassigned',
                        diagnosis: mockMatch.reasonForAdmission,
                        admissionDate: mockMatch.admissionDate,
                        allergies: ['None Known'],
                        diet: 'Normal'
                    });
                } else {
                    setPatientData({ ...DEFAULT_MOCK, patientId: 'mock-def' });
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    // Use Mock data if loading finished but no data (should represent fallback)
    const displayData = patientData || DEFAULT_MOCK;

    return (
        <div className="space-y-8 pb-20">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/doctor/ipd" className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500">
                    <ArrowLeft size={20} />
                </Link>
                <PageHeader title="Patient Cockpit" description={`Managing care for ${displayData.name}`} />
            </div>

            {/* Patient Header Card */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Activity size={120} />
                </div>

                <div className="relative z-10 flex flex-col lg:flex-row gap-8 lg:items-center">
                    <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                            <h1 className="text-3xl font-black text-slate-900">{displayData.name}</h1>
                            <span className="px-3 py-1 bg-rose-100 text-rose-600 rounded-full text-xs font-black uppercase tracking-wider">Active</span>
                        </div>
                        <div className="flex flex-wrap gap-6 text-sm font-medium text-slate-500">
                            <span>{displayData.age}y / {displayData.gender}</span>
                            <span>•</span>
                            <span>{displayData.uhid}</span>
                            <span>•</span>
                            <span className="text-slate-900 font-bold">Bed: {displayData.bed}</span>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Diagnosis</div>
                            <div className="font-bold text-slate-800">{displayData.diagnosis}</div>
                        </div>
                        <div className="px-6 py-3 bg-orange-50 rounded-2xl border border-orange-100 text-orange-700">
                            <div className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-60">Allergies</div>
                            <div className="font-bold">{displayData.allergies.join(", ")}</div>
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
                    content: <OrdersTab admissionId={id} patientId={displayData.patientId} />
                },
                {
                    id: 'notes',
                    label: 'Progress Notes',
                    content: <NotesTab admissionId={id} />
                },
                {
                    id: 'discharge',
                    label: 'Discharge Summary',
                    content: <DischargeTab admissionId={id} />
                }
            ]} />
        </div>
    );
}
