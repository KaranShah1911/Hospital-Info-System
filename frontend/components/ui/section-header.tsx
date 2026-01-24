import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
    icon: LucideIcon;
    title: string;
    className?: string;
    iconClassName?: string;
}

export function SectionHeader({ icon: Icon, title, className, iconClassName }: SectionHeaderProps) {
    return (
        <h3 className={cn("text-xs font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2 mb-6 mt-10 first:mt-0", className)}>
            <Icon size={16} className={cn(iconClassName)} />
            {title}
        </h3>
    );
}
