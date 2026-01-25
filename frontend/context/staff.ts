import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Staff {
    role: string;
    staffId: string;
    fullName: string;
}

interface StaffState {
    staff: Staff | null;
    setStaff: (data: Staff) => void;
    logout: () => void;
}

export const useStaffStore = create<StaffState>()(
    persist(
        (set) => ({
            staff: null,

            setStaff: (data) => set({
                staff: data
            }),

            logout: () => {
                localStorage.removeItem('token'); // Clear legacy if exists
                localStorage.removeItem('staff'); // Clear legacy if exists
                set({ staff: null });
            }
        }),
        {
            name: 'staff-storage',
            partialize: (state) => ({ staff: state.staff }),
        }
    )
);
