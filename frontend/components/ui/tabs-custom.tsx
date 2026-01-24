"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';

interface Tab {
    id: string;
    label: string;
    content: React.ReactNode;
}

interface TabsProps {
    tabs: Tab[];
    defaultTab?: string;
}

export function Tabs({ tabs, defaultTab }: TabsProps) {
    const [activeTab, setActiveTab] = useState(defaultTab || tabs[0].id);

    return (
        <div className="space-y-6">
            <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl w-fit">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className="relative px-6 py-2.5 rounded-xl text-sm font-bold transition-colors"
                    >
                        {activeTab === tab.id && (
                            <motion.div
                                layoutId="activeTabPill"
                                className="absolute inset-0 bg-white rounded-xl shadow-sm border border-slate-200"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <span className={`relative z-10 ${activeTab === tab.id ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}>
                            {tab.label}
                        </span>
                    </button>
                ))}
            </div>

            <div className="min-h-[400px]">
                {tabs.find(t => t.id === activeTab)?.content}
            </div>
        </div>
    );
}
