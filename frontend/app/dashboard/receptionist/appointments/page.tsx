"use client";

import React from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { AppointmentList } from '@/components/appointments/appointment-list';
import { AppointmentBookingForm } from '@/components/appointments/booking-form';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function AppointmentsPage() {
    const [appointments, setAppointments] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            // Fetch today's appointments by default
            const d = new Date();
            const dateString = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            const res = await api.get(`/appointments?date=${dateString}`);
            console.log(res)
            setAppointments(res.data.data || []);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load appointments");
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchAppointments();
    }, []);

    const handleCheckIn = async (id: string) => {
        try {
            await api.post('/appointments/check-in', { appointmentId: id });
            toast.success("Patient Checked In");
            fetchAppointments(); // Refresh list
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Check-in failed");
        }
    };

    const handleCancel = async (id: string) => {
        // Implement cancellation API if available. 
        // Based on provided controllers, there isn't a dedicated cancel endpoint yet, 
        // but typically it would be a PATCH to update status.
        // Assuming /appointments/:id status update
        // For now, I'll allow the UI but show a toast that backend support is pending or mocked if not found.
        toast.info("Cancellation not fully implemented in backend yet.");
    };

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
                        <button onClick={fetchAppointments} className="text-sm font-bold text-indigo-600 hover:text-indigo-700">Refresh</button>
                    </div>
                    {loading ? (
                        <div className="text-center py-10">Loading...</div>
                    ) : (
                        <AppointmentList
                            appointments={appointments}
                            onCheckIn={handleCheckIn}
                            onCancel={handleCancel}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
