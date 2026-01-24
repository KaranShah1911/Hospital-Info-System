import React, { useState } from 'react';
import { AppointmentType, Gender } from '@/types';
import { Calendar, Search } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

export function AppointmentBookingForm() {
    const [searchTerm, setSearchTerm] = useState('');
    const [apptType, setApptType] = useState<AppointmentType>(AppointmentType.New);
    const [departments, setDepartments] = useState<any[]>([]);
    const [doctors, setDoctors] = useState<any[]>([]);

    const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
    const [formData, setFormData] = useState({
        departmentId: '',
        doctorId: '',
        appointmentDate: new Date().toISOString().split('T')[0],
        timeSlot: '09:00', // Basic time slot for now
        type: AppointmentType.New
    });

    const [loading, setLoading] = useState(false);

    // Fetch Departments and Doctors on Load
    React.useEffect(() => {
        const fetchMasterData = async () => {
            try {
                const [deptRes, docRes] = await Promise.all([
                    api.get('/master/departments'),
                    api.get('/master/users/doctors')
                ]);
                setDepartments(deptRes.data || []);
                setDoctors(docRes.data || []);
            } catch (error) {
                console.error("Failed to load master data", error);
                toast.error("Failed to load departments or doctors");
            }
        };
        fetchMasterData();
    }, []);

    const handleSearch = async (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && searchTerm) {
            e.preventDefault();
            setLoading(true);
            try {
                const res = await api.get(`/patients/search?uhid=${searchTerm}`);
                if (res.data) {
                    setSelectedPatient(res.data);
                    toast.success("Patient found: " + res.data.firstName);
                } else {
                    toast.error("Patient not found");
                    setSelectedPatient(null);
                }
            } catch (err) {
                toast.error("Error searching patient");
            } finally {
                setLoading(false);
            }
        }
    };

    // Auto-select department when doctor selected
    const handleDoctorChange = (doctorId: string) => {
        const doc = doctors.find(d => d.id === doctorId);
        if (doc && doc.staffProfile?.departmentId) {
            setFormData(prev => ({
                ...prev,
                doctorId,
                departmentId: doc.staffProfile.departmentId
            }));
        } else {
            setFormData(prev => ({ ...prev, doctorId }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPatient) {
            toast.error("Please search and select a patient first.");
            return;
        }
        if (!formData.doctorId || !formData.departmentId) {
            toast.error("Please select a doctor and department.");
            return;
        }

        setLoading(true);
        try {
            // Combine Date and Time
            const dateObj = new Date(`${formData.appointmentDate}T${formData.timeSlot}:00`);

            await api.post('/appointments', {
                uhid: selectedPatient.uhid,
                doctorId: formData.doctorId,
                departmentId: formData.departmentId,
                appointmentDate: dateObj.toISOString(),
                type: apptType
            });

            toast.success("Appointment Booked Successfully!");
            // Reset
            setSelectedPatient(null);
            setSearchTerm('');
            // Potentially allow parent to refresh list
            window.location.reload();
        } catch (err: any) {
            console.error(err);
            toast.error(err.response?.data?.message || "Booking failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl space-y-6">
            <div className="flex items-center gap-2 text-indigo-600 mb-2">
                <Calendar size={24} />
                <h2 className="text-xl font-black text-slate-900">Book Appointment</h2>
            </div>

            {/* Patient Search */}
            <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Find Patient (Enter UHID)</label>
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleSearch}
                        placeholder="Search Patient (Press Enter)..."
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-800"
                    />
                </div>
                {selectedPatient && (
                    <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        {selectedPatient.firstName} {selectedPatient.lastName} ({selectedPatient.uhid})
                    </div>
                )}
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Appointment Type</label>
                    <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                        {Object.values(AppointmentType).map(type => (
                            <button
                                key={type}
                                type="button"
                                onClick={() => setApptType(type)}
                                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${apptType === type
                                    ? 'bg-white text-indigo-600 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Doctor</label>
                    <select
                        value={formData.doctorId}
                        onChange={(e) => handleDoctorChange(e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-sm text-slate-700 outline-none focus:border-indigo-500"
                    >
                        <option value="">Select Doctor</option>
                        {doctors.map((d: any) => (
                            <option key={d.id} value={d.id}>
                                {d.staffProfile?.fullName} ({d.staffProfile?.qualification})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Department</label>
                    <select
                        value={formData.departmentId}
                        onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-sm text-slate-700 outline-none focus:border-indigo-500"
                    >
                        <option value="">Select Department</option>
                        {departments.map((d: any) => (
                            <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</label>
                        <input
                            type="date"
                            value={formData.appointmentDate}
                            onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-sm text-slate-700 outline-none focus:border-indigo-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Time Slot</label>
                        <select
                            value={formData.timeSlot}
                            onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-sm text-slate-700 outline-none focus:border-indigo-500"
                        >
                            {/* Improved simple time generator */}
                            {Array.from({ length: 18 }).map((_, i) => {
                                const hour = 9 + Math.floor(i / 2);
                                const min = (i % 2) * 30;
                                const time = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
                                return <option key={time} value={time}>{time}</option>;
                            })}
                        </select>
                    </div>
                </div>
            </div>

            <button disabled={loading} type="submit" className="w-full py-4 bg-indigo-600 text-white font-black rounded-xl shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all disabled:opacity-50">
                {loading ? 'Booking...' : 'Confirm Booking'}
            </button>
        </form>
    );
}
