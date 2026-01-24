"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OTManagerDashboard() {
    const router = useRouter();

    useEffect(() => {
        router.push('/dashboard/ot/requests');
    }, [router]);

    return null;
}
