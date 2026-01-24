
export const MOCK_IPD_ADMISSIONS = [
    {
        id: "ADM-001",
        admissionDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        reasonForAdmission: "Viral Pneumonia",
        status: "Admitted",
        patient: {
            firstName: "Rahul",
            lastName: "Sharma",
            age: 45,
            uhid: "UHID-1001"
        },
        currentBed: {
            bedNumber: "101-A",
            ward: {
                name: "General Ward"
            }
        }
    },
    {
        id: "ADM-002",
        admissionDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        reasonForAdmission: "Dengue Fever",
        status: "Admitted",
        patient: {
            firstName: "Priya",
            lastName: "Verma",
            age: 28,
            uhid: "UHID-1002"
        },
        currentBed: {
            bedNumber: "202-B",
            ward: {
                name: "Private Ward"
            }
        }
    },
    {
        id: "ADM-003",
        admissionDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        reasonForAdmission: "Appendicitis (Post-Op)",
        status: "Admitted",
        patient: {
            firstName: "Amit",
            lastName: "Patel",
            age: 35,
            uhid: "UHID-1003"
        },
        currentBed: {
            bedNumber: "ICU-01",
            ward: {
                name: "ICU"
            }
        }
    },
    {
        id: "ADM-004",
        admissionDate: new Date(Date.now() - 0.5 * 24 * 60 * 60 * 1000).toISOString(), // 12 hours ago
        reasonForAdmission: "Acute Gastritis",
        status: "Admitted",
        patient: {
            firstName: "Sita",
            lastName: "Devi",
            age: 62,
            uhid: "UHID-1004"
        },
        currentBed: {
            bedNumber: "104-C",
            ward: {
                name: "General Ward"
            }
        }
    },
    {
        id: "ADM-005",
        admissionDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
        reasonForAdmission: "Fracture Femur",
        status: "Admitted",
        patient: {
            firstName: "Vikram",
            lastName: "Singh",
            age: 50,
            uhid: "UHID-1005"
        },
        currentBed: {
            bedNumber: "ORTHO-02",
            ward: {
                name: "Orthopedic Ward"
            }
        }
    }
];
