"use client";

import { PageHeader } from '@/components/ui/page-header';
import { Save } from 'lucide-react';
import { Tabs } from '@/components/ui/tabs-custom';
import { useRouter } from 'next/navigation';
import { PatientProfileCard } from '@/components/appointments/PatientProfileCard';
import { AIHealthInsight } from '@/components/appointments/AIHealthInsight';
import { VisitHistory } from '@/components/appointments/VisitHistory';
import { ClinicalNoteForm } from '@/components/appointments/ClinicalNoteForm';
import { PrescriptionForm } from '@/components/appointments/PrescriptionForm';
import { LabOrderForm } from '@/components/appointments/LabOrderForm';

export default function ConsultationPage({ params }: { params: { id: string } }) {
    const router = useRouter();

    const handleFinish = () => {
        // Implementation for saving data would go here
        alert("Consultation Completed & Signed Successfully!");
        router.push('/dashboard/doctor/appointments');
    };

    return (
        <div className="space-y-8 pb-32">
            <div className="flex items-center justify-between">
                <PageHeader
                    title="Consultation Room"
                    description="Patient Visit • 24 Jan 2026"
                />
                <button
                    onClick={handleFinish}
                    className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-lg"
                >
                    <Save size={18} />
                    Finish & Sign
                </button>
            </div>

            {/* Patient Header & AI Summary */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <PatientProfileCard />
                <AIHealthInsight />
            </div>

            {/* Main Clinical Area */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Left: History & Timeline */}
                <div className="space-y-6">
                    <VisitHistory />
                </div>

                {/* Right: Clinical Note & Orders */}
                <div className="xl:col-span-2">
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden p-8">
                        <Tabs tabs={[
                            {
                                id: 'note',
                                label: 'Clinical Note',
                                content: <ClinicalNoteForm />
                            },
                            {
                                id: 'rx',
                                label: 'Prescription (Rx)',
                                content: <PrescriptionForm />
                            },
                            {
                                id: 'labs',
                                label: 'Lab & Radiology',
                                content: <LabOrderForm />
                            }
                        ]} />
                    </div>
                </div>
            </div>
        </div>
    );
}
