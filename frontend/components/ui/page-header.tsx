import React from 'react';

interface PageHeaderProps {
    title: string;
    description: string;
    children?: React.ReactNode;
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
            <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">{title}</h2>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">{description}</p>
            </div>
            {children && <div className="flex items-center gap-3">{children}</div>}
        </div>
    );
}
