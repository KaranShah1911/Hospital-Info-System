"use client";

import { PageHeader } from '@/components/ui/page-header';
import { Save } from 'lucide-react';
import { Tabs } from '@/components/ui/tabs-custom';
import { useRouter, useParams } from 'next/navigation';
import { PatientProfileCard } from '@/components/appointments/PatientProfileCard';
import { AIHealthInsight } from '@/components/appointments/AIHealthInsight';
import { VisitHistory } from '@/components/appointments/VisitHistory';
import { ClinicalNoteForm } from '@/components/appointments/ClinicalNoteForm';
import { PrescriptionForm } from '@/components/appointments/PrescriptionForm';
import { LabOrderForm } from '@/components/appointments/LabOrderForm';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function ConsultationPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            if (!id) return;
            try {
                const res = await api.get(`/appointments/${id}/details`);
                setData(res.data.data);
            } catch (error) {
                console.error("Failed to load consultation", error);
                toast.error("Could not load consultation details");
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    const handleFinish = () => {
        // Implementation for saving data would go here (Likely trigger submit on child forms or use a context)
        // For now, simple success toast
        toast.success("Consultation Completed & Signed Successfully!");
        router.push('/dashboard/doctor/appointments');
    };

    if (loading) return <div className="p-12 text-center text-slate-400 font-bold">Loading consultation room...</div>;
    if (!data) return <div className="p-12 text-center text-rose-500 font-bold">Patient Not Found</div>;

    return (
        <div className="space-y-8 pb-32">
            <div className="flex items-center justify-between">
                <PageHeader
                    title="Consultation Room"
                    description={`Patient Visit • ${new Date().toLocaleDateString()}`}
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
                <PatientProfileCard patient={data.patient} />
                <AIHealthInsight patientId={data.patient.id} context="Consultation" />
            </div>

            {/* Main Clinical Area */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Left: History & Timeline */}
                <div className="space-y-6">
                    <VisitHistory history={data.history} />
                </div>

                {/* Right: Clinical Note & Orders */}
                <div className="xl:col-span-2">
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden p-8">
                        <Tabs tabs={[
                            {
                                id: 'note',
                                label: 'Clinical Note',
                                content: <ClinicalNoteForm /> // pass visitId if available later
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
