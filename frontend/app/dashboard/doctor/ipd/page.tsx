"use client";

import { PageHeader } from '@/components/ui/page-header';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { PatientCard } from '@/components/ipd/PatientCard';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { MOCK_IPD_ADMISSIONS } from '@/lib/ipd-mock-data';

export default function DoctorIPD() {
    const [admissions, setAdmissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchAdmissions = async () => {
            // MOCK DATA INTEGRATION
            // For now, we use local mock data to ensure the UI is visible.
            // In production, uncomment the API call below.

            /*
            try {
                const res = await api.get('/ipd/admissions');
                setAdmissions(res.data.data || []);
            } catch (error) {
                console.error(error);
                toast.error("Failed to load IPD patients");
            } finally {
                setLoading(false);
            }
            */

            // Simulating API delay
            setTimeout(() => {
                setAdmissions(MOCK_IPD_ADMISSIONS);
                setLoading(false);
            }, 500);
        };
        fetchAdmissions();
    }, []);

    // Filter Logic
    const filtered = admissions.filter((a: any) =>
    (a.patient?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.patient?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.currentBed?.ward?.name?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Map IPD data to PatientCard props format
    const mapToCard = (a: any) => {
        const admitDate = new Date(a.admissionDate);
        const days = Math.floor((new Date().getTime() - admitDate.getTime()) / (1000 * 3600 * 24));

        return {
            id: a.id,
            name: `${a.patient?.firstName} ${a.patient?.lastName}`,
            age: a.patient?.age || 'N/A',
            uhid: a.patient?.uhid,
            bed: a.currentBed ? `${a.currentBed.ward?.name} - ${a.currentBed.bedNumber}` : 'Unassigned',
            diagnosis: a.reasonForAdmission || 'Under Evaluation',
            status: a.status, // We might map this to color logic if needed
            admitDay: days,
            color: 'bg-indigo-500' // Default color for now 
        };
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <PageHeader title="In-Patient Department (IPD)" description="Monitor admitted patients and manage care plans." />
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search Patient / Bed..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-white font-medium text-sm focus:ring-2 focus:ring-indigo-100 outline-none w-64"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {loading && <div className="col-span-full text-center text-slate-400">Loading admissions...</div>}

                {!loading && filtered.length === 0 && <div className="col-span-full text-center text-slate-400">No admitted patients found.</div>}

                {filtered.map((adm) => (
                    <PatientCard key={adm.id} patient={mapToCard(adm)} />
                ))}
            </div>
        </div>
    );
}
