"use client";

import React from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { AppointmentList } from '@/components/appointments/appointment-list';
import { AppointmentBookingForm } from '@/components/appointments/booking-form';
import { MOCK_APPOINTMENTS } from '@/lib/constants';

export default function AppointmentsPage() {
    return (
        <div className="max-w-[1400px] mx-auto space-y-8 pb-20">
            <PageHeader title="Appointment Management" description="Schedule & Manage OPD Visits" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Booking Form */}
                <div>
                    <AppointmentBookingForm />
                </div>

                {/* Right: Appointment List */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-black text-slate-900">Today's Schedule</h3>
                        <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700">View All</button>
                    </div>
                    <AppointmentList appointments={MOCK_APPOINTMENTS} />
                </div>
            </div>
        </div>
    );
}
