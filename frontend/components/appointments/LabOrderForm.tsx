"use client";

import { TestTube, Activity, AlertTriangle } from 'lucide-react';
import { SectionHeader } from '@/components/ui/section-header';

export function LabOrderForm() {
    const LAB_TESTS = [
        'Complete Blood Count (CBC)', 'Lipid Profile', 'Liver Function Test (LFT)', 'Renal Function Test (RFT)',
        'Thyroid Profile (T3, T4, TSH)', 'HbA1c', 'Blood Sugar Fasting', 'Blood Sugar PP',
        'Urine Routine & Microscopy', 'Stool Routine', 'Serum Electrolytes', 'Serum Calcium',
        'Vitamin D Total', 'Vitamin B12', 'Iron Studies', 'C-Reactive Protein (CRP)',
        'Erythrocyte Sedimentation Rate', 'Prothrombin Time (PT/INR)', 'APTT', 'D-Dimer',
        'Typhoid Widal Test', 'Dengue NS1 Antigen', 'Malaria Antigen', 'HIV 1 & 2 Antibody', 'HBsAg'
    ];

    const RADIOLOGY_TESTS = [
        'X-Ray Chest PA View', 'X-Ray Knee AP/Lat', 'X-Ray LS Spine', 'X-Ray Abdomen Erect',
        'USG Abdomen & Pelvis', 'USG KUB', 'USG Obstetric', 'USG Thyroid / Neck',
        'USG Doppler Carotid', 'USG Doppler Lower Limb', 'CT Brain Plain', 'CT Chest HRCT',
        'CT Abdomen Contrast', 'CT KUB', 'MRI Brain', 'MRI Cervical Spine',
        'MRI Lumbar Spine', 'MRI Knee Joint', 'Mammography', 'DEXA Scan (Bone Density)',
        '2D ECHO Cardiography', 'ECG (12 Lead)', 'TMT (Treadmill Test)', 'Holter Monitoring', 'PET-CT Whole Body'
    ];

    return (
        <div className="space-y-8">
            <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                <SectionHeader icon={TestTube} title="Laboratory Investigations" iconClassName="text-indigo-500" />
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                    {LAB_TESTS.map(test => (
                        <div key={test} className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all group">
                            <label className="flex items-center gap-3 cursor-pointer flex-1">
                                <input type="checkbox" className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300" />
                                <span className="text-xs font-bold text-slate-700 group-hover:text-indigo-700 leading-tight">{test}</span>
                            </label>
                            <select className="ml-2 text-[10px] font-bold bg-slate-50 text-slate-500 border-none rounded-lg focus:ring-0 cursor-pointer">
                                <option>Routine</option>
                                <option className="text-amber-600">Urgent</option>
                                <option className="text-red-600">Stat</option>
                            </select>
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                <SectionHeader icon={Activity} title="Radiology & Imaging" iconClassName="text-rose-500" />
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                    {RADIOLOGY_TESTS.map(test => (
                        <div key={test} className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 hover:border-rose-300 hover:shadow-md transition-all group">
                            <label className="flex items-center gap-3 cursor-pointer flex-1">
                                <input type="checkbox" className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-gray-300" />
                                <span className="text-xs font-bold text-slate-700 group-hover:text-rose-700 leading-tight">{test}</span>
                            </label>
                            <select className="ml-2 text-[10px] font-bold bg-slate-50 text-slate-500 border-none rounded-lg focus:ring-0 cursor-pointer">
                                <option>Routine</option>
                                <option className="text-amber-600">Urgent</option>
                                <option className="text-red-600">Stat</option>
                            </select>
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4">
                <div className="p-2 bg-amber-100 text-amber-600 rounded-lg h-fit">
                    <AlertTriangle size={20} />
                </div>
                <div className="flex-1">
                    <h4 className="font-bold text-amber-800 text-sm">Clinical Indication / Notes</h4>
                    <textarea
                        className="w-full mt-2 bg-white rounded-xl border-amber-200 p-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-200"
                        placeholder="Reason for test, specific instructions, or priority (Stat)..."
                        rows={3}
                    ></textarea>
                </div>
            </div>
        </div>
    );
}
