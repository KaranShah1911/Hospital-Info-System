"use client";

import { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { WHOChecklist } from '@/components/surgery/WHOChecklist';
import { PreOpVitals } from '@/components/surgery/PreOpVitals';
import { LiveSurgeryMode } from '@/components/surgery/LiveSurgeryMode';
import { PostOpSummary } from '@/components/surgery/PostOpSummary';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';

// Mock Patient Data
const PATIENT = {
    name: 'Rajesh Kumar',
    uhid: 'UHID-2024-X91',
    procedure: 'Laparoscopic Appendectomy',
    ot: 'OT-1'
};

const STEPS = [
    { id: 1, label: 'Safety Checklist' },
    { id: 2, label: 'Pre-Op Vitals' },
    { id: 3, label: 'Live Surgery' },
    { id: 4, label: 'Post-Op Summary' }
];

export default function SurgeryRoom({ params }: { params: { id: string } }) {
    const [currentStep, setCurrentStep] = useState(1);

    const handleNext = () => {
        if (currentStep < 4) {
            setCurrentStep(c => c + 1);
        }
    };

    return (
        <div className="space-y-8 pb-32">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/doctor/surgery" className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500">
                    <ArrowLeft size={20} />
                </Link>
                <div className="flex-1">
                    <PageHeader
                        title="Intra-Operative Console"
                        description={`${PATIENT.procedure} • ${PATIENT.name} (${PATIENT.uhid})`}
                    />
                </div>
                <div className="hidden md:flex items-center gap-2">
                    <span className="px-4 py-2 bg-indigo-50 text-indigo-700 font-bold rounded-xl text-sm border border-indigo-100">
                        {PATIENT.ot}
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

            {/* Content Area */}
            <div className="min-h-[500px]">
                {currentStep === 1 && <WHOChecklist onComplete={handleNext} />}
                {currentStep === 2 && <PreOpVitals onComplete={handleNext} />}
                {currentStep === 3 && <LiveSurgeryMode onComplete={handleNext} />}
                {currentStep === 4 && <PostOpSummary />}
            </div>
        </div>
    );
}
