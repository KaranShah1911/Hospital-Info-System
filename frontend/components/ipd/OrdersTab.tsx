"use client";

import React from 'react';
import { Utensils, ClipboardList, AlertTriangle, History, CheckCircle, TestTube } from 'lucide-react';
import { SectionHeader } from '@/components/ui/section-header';

export function OrdersTab() {
    const [tasks, setTasks] = React.useState<{ id: string, name: string, freq: string, start: string, instructions: string, status: 'active' | 'completed', completedBy?: string, completedAt?: string }[]>([
        { id: '1', name: 'Check BP', freq: '2 Hourly', start: 'Now', instructions: 'Notify if > 140/90', status: 'active' },
        { id: '2', name: 'Insulin 10U', freq: 'Before Lunch', start: 'Today', instructions: '', status: 'active' },
        { id: '3', name: 'Morning Vitals', freq: 'Once', start: '08:00 AM', instructions: '', status: 'completed', completedBy: 'Nurse Sarah', completedAt: 'Today, 08:15 AM' },
        { id: '4', name: 'Sponge Bath', freq: 'Once', start: '07:00 AM', instructions: '', status: 'completed', completedBy: 'Nurse Sarah', completedAt: 'Today, 07:30 AM' }
    ]);

    const [newTask, setNewTask] = React.useState({ name: '', freq: 'Once', start: 'Now', instructions: '' });

    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTask.name) return;
        setTasks(prev => [...prev, { ...newTask, id: Math.random().toString(), status: 'active' }]);
        setNewTask({ name: '', freq: 'Once', start: 'Now', instructions: '' });
    };

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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 1. Dietary Orders */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl">
                    <SectionHeader icon={Utensils} title="Dietary Orders" iconClassName="text-emerald-500" />
                    <form className="mt-6 space-y-6">
                        <div className="space-y-4">
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Diet Type</label>
                            <div className="grid grid-cols-2 gap-3">
                                {['Normal', 'Soft', 'Liquid', 'Diabetic', 'Renal', 'NBM'].map(d => (
                                    <label key={d} className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
                                        <input type="radio" name="diet" className="w-4 h-4 text-emerald-600 accent-emerald-600" />
                                        <span className="text-sm font-bold text-slate-700">{d}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <button className="w-full py-3 bg-emerald-600 text-white font-black rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200">
                            Update Diet
                        </button>
                    </form>
                </div>

                {/* 2. Nursing Tasks (Interactive) */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl flex flex-col">
                    <SectionHeader icon={ClipboardList} title="Add Nursing Task" iconClassName="text-indigo-500" />

                    {/* Active Task Stack */}
                    <div className="mt-6 mb-6 space-y-2 max-h-[200px] overflow-y-auto custom-scrollbar pr-2">
                        <div className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1 mb-2">Active Tasks Queue</div>
                        {tasks.filter(t => t.status === 'active').length === 0 && (
                            <div className="text-sm text-slate-400 italic pl-1">No active tasks queued.</div>
                        )}
                        {tasks.filter(t => t.status === 'active').map((task) => (
                            <div key={task.id} className="p-3 bg-indigo-50 rounded-xl border border-indigo-100 flex justify-between items-center group">
                                <div>
                                    <div className="font-bold text-indigo-900 text-sm">{task.name}</div>
                                    <div className="text-xs font-bold text-indigo-400">{task.freq} • {task.start}</div>
                                </div>
                                <button onClick={() => setTasks(prev => prev.filter(p => p.id !== task.id))} className="text-indigo-300 hover:text-rose-500 transition-colors">
                                    <AlertTriangle size={14} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleAddTask} className="space-y-4 mt-auto pt-6 border-t border-slate-100">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">New Task Name</label>
                            <input
                                type="text"
                                value={newTask.name}
                                onChange={e => setNewTask({ ...newTask, name: e.target.value })}
                                placeholder="e.g. Check Blood Sugar"
                                className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Frequency</label>
                                <select
                                    value={newTask.freq}
                                    onChange={e => setNewTask({ ...newTask, freq: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100"
                                >
                                    <option>Once</option>
                                    <option>Hourly</option>
                                    <option>2 Hourly</option>
                                    <option>4 Hourly</option>
                                    <option>6 Hourly</option>
                                    <option>8 Hourly</option>
                                    <option>12 Hourly</option>
                                    <option>Daily</option>
                                    <option>SOS</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Start From</label>
                                <select
                                    value={newTask.start}
                                    onChange={e => setNewTask({ ...newTask, start: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100"
                                >
                                    <option>Now</option>
                                    <option>Next Round</option>
                                    <option>Tomorrow Morning</option>
                                </select>
                            </div>
                        </div>

                        <button type="submit" className="w-full py-3 bg-indigo-600 text-white font-black rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
                            Add to Queue
                        </button>
                    </form>
                </div>
            </div>

            {/* Task History Section */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl">
                <SectionHeader icon={History} title="Completed Nursing Tasks History" iconClassName="text-slate-500" />
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tasks.filter(t => t.status === 'completed').map((task) => (
                        <div key={task.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between opacity-70 hover:opacity-100 transition-opacity">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-full">
                                    <CheckCircle size={16} />
                                </div>
                                <div>
                                    <div className="font-bold text-slate-700 text-sm strike-through decoration-slate-400">{task.name}</div>
                                    <div className="text-xs font-bold text-slate-400">Completed by {task.completedBy} • {task.completedAt}</div>
                                </div>
                            </div>
                            <div className="text-[10px] font-black uppercase text-slate-300 bg-white px-2 py-1 rounded-lg border border-slate-100">{task.freq}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 3. Lab & Radiology (CPOE) */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl">
                <SectionHeader icon={TestTube} title="Laboratory & Radiology Orders" iconClassName="text-indigo-500" />

                <div className="mt-6 space-y-8">
                    {/* Labs */}
                    <div>
                        <h4 className="flex items-center gap-2 font-black text-slate-800 mb-4">
                            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                            Lab Investigations
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                            {LAB_TESTS.map(test => (
                                <div key={test} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-300 transition-all group">
                                    <label className="flex items-center gap-3 cursor-pointer flex-1">
                                        <input type="checkbox" className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300" />
                                        <span className="text-xs font-bold text-slate-700 group-hover:text-indigo-700 leading-tight">{test}</span>
                                    </label>
                                    <select className="ml-2 text-[10px] font-bold bg-white text-slate-500 border border-slate-200 rounded-lg focus:ring-0 cursor-pointer py-1 px-2">
                                        <option>Routine</option>
                                        <option className="text-amber-600">Urgent</option>
                                        <option className="text-red-600">Stat</option>
                                    </select>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Radiology */}
                    <div>
                        <h4 className="flex items-center gap-2 font-black text-slate-800 mb-4">
                            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                            Radiology & Imaging
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                            {RADIOLOGY_TESTS.map(test => (
                                <div key={test} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-rose-300 transition-all group">
                                    <label className="flex items-center gap-3 cursor-pointer flex-1">
                                        <input type="checkbox" className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-gray-300" />
                                        <span className="text-xs font-bold text-slate-700 group-hover:text-rose-700 leading-tight">{test}</span>
                                    </label>
                                    <select className="ml-2 text-[10px] font-bold bg-white text-slate-500 border border-slate-200 rounded-lg focus:ring-0 cursor-pointer py-1 px-2">
                                        <option>Routine</option>
                                        <option className="text-amber-600">Urgent</option>
                                        <option className="text-red-600">Stat</option>
                                    </select>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-slate-100">
                        <button className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-lg">
                            Sign & Place Orders
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
