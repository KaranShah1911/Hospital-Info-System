"use client";

import { useState, useEffect, use } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { WHOChecklist } from '@/components/surgery/WHOChecklist';
import { PreOpVitals } from '@/components/surgery/PreOpVitals';
import { LiveSurgeryMode } from '@/components/surgery/LiveSurgeryMode';
import { PostOpSummary } from '@/components/surgery/PostOpSummary';
import { ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { toast } from 'sonner';

const STEPS = [
    { id: 1, label: 'Safety Checklist' },
    { id: 2, label: 'Pre-Op Vitals' },
    { id: 3, label: 'Live Surgery' },
    { id: 4, label: 'Post-Op Summary' }
];

export default function SurgeryRoom({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [currentStep, setCurrentStep] = useState(1);
    const [surgery, setSurgery] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSurgeryDetails();
    }, [id]);

    const fetchSurgeryDetails = async () => {
        try {
            const res = await api.get(`/ot/surgeries/${id}`);
            setSurgery(res.data.data);

            // Auto-advance logic based on status? 
            // For now, start at 1 or saved state.
            // If completed, maybe go to 4?
            if (res.data.data.status === 'Completed') setCurrentStep(4);
            else if (res.data.data.status === 'InProgress') setCurrentStep(3);

        } catch (error) {
            console.error("Failed to load surgery details", error);
            toast.error("Failed to load surgery details");
        } finally {
            setLoading(false);
        }
    };

    const handleNext = () => {
        if (currentStep < 4) {
            setCurrentStep(c => c + 1);
            // Optionally update status on backend here depending on step
        }
    };

    if (loading) return <div className="p-12 text-center text-slate-400 font-bold">Loading Surgery Context...</div>;
    if (!surgery) return <div className="p-12 text-center text-rose-500 font-bold">Surgery Not Found</div>;

    return (
        <div className="space-y-8 pb-32">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/doctor/surgery" className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500">
                    <ArrowLeft size={20} />
                </Link>
                <div className="flex-1">
                    <PageHeader
                        title="Intra-Operative Console"
                        description={`${surgery.procedureName} • ${surgery.admission?.patient?.firstName} ${surgery.admission?.patient?.lastName} (${surgery.admission?.patient?.uhid})`}
                    />
                </div>
                <div className="hidden md:flex items-center gap-2">
                    <span className="px-4 py-2 bg-indigo-50 text-indigo-700 font-bold rounded-xl text-sm border border-indigo-100">
                        {surgery.otRoomNumber || 'Unassigned OT'}
                    </span>
                    <span className={`px-4 py-2 rounded-xl text-sm font-bold border ${surgery.admission?.admissionType === 'Emergency' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                        {surgery.admission?.admissionType}
                    </span>
                </div>
            </div>

            {/* Stepper */}
            <div className="flex items-center justify-between relative px-10 mb-12">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 -z-10 rounded-full"></div>
                {STEPS.map((step) => {
                    const isActive = step.id === currentStep;
                    const isCompleted = step.id < currentStep;

                    return (
                        <div key={step.id} className="flex flex-col items-center gap-2 bg-white px-2">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all shadow-xl ${isActive ? 'bg-indigo-600 text-white scale-110 shadow-indigo-300' :
                                    isCompleted ? 'bg-emerald-500 text-white' :
                                        'bg-slate-100 text-slate-400'
                                    }`}
                            >
                                {isCompleted ? <CheckCircle size={20} /> : step.id}
                            </div>
                            <span className={`text-xs font-bold uppercase tracking-wider ${isActive ? 'text-indigo-600' : isCompleted ? 'text-emerald-500' : 'text-slate-300'}`}>
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Content Area - Passing real surgery data to children */}
            <div className="min-h-[500px]">
                {currentStep === 1 && <WHOChecklist surgeryId={surgery.id} onComplete={handleNext} />}
                {currentStep === 2 && <PreOpVitals surgeryId={surgery.id} patientId={surgery.admission?.patientId} onComplete={handleNext} />}
                {currentStep === 3 && <LiveSurgeryMode surgery={surgery} onComplete={handleNext} />}
                {currentStep === 4 && <PostOpSummary surgery={surgery} />}
            </div>
        </div>
    );
}
