import { addDays, subHours, subMinutes } from "date-fns";

export type OrderStatus = "Ordered" | "SampleCollected" | "ResultAvailable" | "Completed";
export type OrderPriority = "Routine" | "Stat";

export interface TrackingEvent {
  status: OrderStatus;
  timestamp: string;
  performedBy: string;
  remarks?: string;
}

export interface LabResult {
  id: string;
  serviceOrderId: string;
  testName: string;
  resultValue: string;
  referenceRange?: string; // Nullable in schema
  unit?: string;         // Nullable in schema
  technicianId?: string; // Relation
  verifiedByDoctorId?: string; // Relation
  documentUrl?: string; // For uploaded PDF/Image
  resultDate: string;
}

export type OrderCategory = "Lab" | "Radiology";

export interface ServiceOrder {
  id: string; // Sample ID
  serviceId: string; // From schema
  patientId: string;
  doctorId: string; // From schema
  uhid: string;
  patientName: string; // Convenience field (joined in real DB)
  department: string;
  testName: string;
  category: OrderCategory; // Added to distinguish
  priority: OrderPriority;
  status: OrderStatus;
  clinicalIndication?: string; // From schema
  orderDate: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  trackingEvents: TrackingEvent[]; // For UI timeline
  result?: LabResult; // For easier UI access
}

// Initial Mock Data
let MOCK_ORDERS: ServiceOrder[] = [
  {
    id: "SO-2024-001",
    serviceId: "SERV-001",
    patientId: "P-1001",
    doctorId: "DOC-001",
    uhid: "UHID-1001",
    patientName: "John Doe",
    department: "Cardiology",
    testName: "Lipid Profile",
    category: "Lab",
    priority: "Routine",
    status: "Ordered",
    clinicalIndication: "Routine Checkup",
    orderDate: subHours(new Date(), 2).toISOString(),
    age: 45,
    gender: "Male",
    trackingEvents: [
      { status: "Ordered", timestamp: subHours(new Date(), 2).toISOString(), performedBy: "Dr. Smith" }
    ]
  },
  {
    id: "SO-2024-002",
    serviceId: "SERV-002",
    patientId: "P-1002",
    doctorId: "DOC-002",
    uhid: "UHID-1002",
    patientName: "Jane Smith",
    department: "Emergency",
    testName: "CBC (Complete Blood Count)",
    category: "Lab",
    priority: "Stat",
    status: "Ordered",
    clinicalIndication: "High Fever",
    orderDate: subHours(new Date(), 1).toISOString(),
    age: 32,
    gender: "Female",
    trackingEvents: [
      { status: "Ordered", timestamp: subHours(new Date(), 1).toISOString(), performedBy: "Dr. Jones" }
    ]
  },
  {
    id: "SO-2024-003",
    serviceId: "SERV-003",
    patientId: "P-1003",
    doctorId: "DOC-001",
    uhid: "UHID-1003",
    patientName: "Robert Brown",
    department: "Internal Medicine",
    testName: "Blood Sugar Fasting",
    category: "Lab",
    priority: "Routine",
    status: "SampleCollected",
    clinicalIndication: "Diabetes Management",
    orderDate: addDays(new Date(), -1).toISOString(),
    age: 58,
    gender: "Male",
    trackingEvents: [
      { status: "Ordered", timestamp: addDays(new Date(), -1).toISOString(), performedBy: "Dr. Smith" },
      { status: "SampleCollected", timestamp: subHours(addDays(new Date(), -1), -2).toISOString(), performedBy: "Nurse Joy" }
    ]
  },
  {
    id: "SO-2024-004",
    serviceId: "SERV-004",
    patientId: "P-1004",
    doctorId: "DOC-003",
    uhid: "UHID-1004",
    patientName: "Emily Davis",
    department: "Pediatrics",
    testName: "Dengue NS1 Antigen",
    category: "Lab",
    priority: "Stat",
    status: "ResultAvailable",
    clinicalIndication: "Suspected Dengue",
    orderDate: subHours(new Date(), 4).toISOString(),
    age: 8,
    gender: "Female",
    trackingEvents: [
      { status: "Ordered", timestamp: subHours(new Date(), 4).toISOString(), performedBy: "Dr. House" },
      { status: "SampleCollected", timestamp: subHours(new Date(), 3).toISOString(), performedBy: "Nurse Joy" },
      { status: "ResultAvailable", timestamp: subHours(new Date(), 1).toISOString(), performedBy: "Tech Mike" }
    ],
    result: {
      id: "RES-001",
      serviceOrderId: "SO-2024-004",
      testName: "Dengue NS1 Antigen",
      resultValue: "Positive",
      referenceRange: "Negative",
      unit: "",
      technicianId: "Tech Mike",
      resultDate: subHours(new Date(), 1).toISOString()
    }
  },
  {
    id: "SO-2024-005",
    serviceId: "SERV-005",
    patientId: "P-1005",
    doctorId: "DOC-002",
    uhid: "UHID-1005",
    patientName: "Michael Wilson",
    department: "Neurology",
    testName: "Electrolytes (Na/K/Cl)",
    category: "Lab",
    priority: "Routine",
    status: "Completed",
    clinicalIndication: "Weakness",
    orderDate: addDays(new Date(), -2).toISOString(),
    age: 62,
    gender: "Male",
    trackingEvents: [
      { status: "Ordered", timestamp: addDays(new Date(), -2).toISOString(), performedBy: "Dr. Jones" },
      { status: "SampleCollected", timestamp: subHours(addDays(new Date(), -2), -4).toISOString(), performedBy: "Nurse Joy" },
      { status: "ResultAvailable", timestamp: subHours(addDays(new Date(), -2), -8).toISOString(), performedBy: "Tech Mike" },
      { status: "Completed", timestamp: subHours(addDays(new Date(), -2), -10).toISOString(), performedBy: "Dr. Strange" }
    ],
    result: {
      id: "RES-002",
      serviceOrderId: "SO-2024-005",
      testName: "Electrolytes (Na/K/Cl)",
      resultValue: "Na: 135, K: 4.2",
      referenceRange: "Na: 135-145, K: 3.5-5.0",
      unit: "mmol/L",
      technicianId: "Tech Mike",
      verifiedByDoctorId: "Dr. Strange",
      resultDate: subHours(addDays(new Date(), -2), -8).toISOString()
    }
  },
  // Radiology Orders
  {
    id: "RAD-2024-001",
    serviceId: "SERV-RAD-001",
    patientId: "P-1006",
    doctorId: "DOC-004",
    uhid: "UHID-1006",
    patientName: "Sarah Connor",
    department: "Orthopedics",
    testName: "X-Ray Chest PA View",
    category: "Radiology",
    priority: "Routine",
    status: "Ordered",
    clinicalIndication: "Chronic Cough",
    orderDate: subHours(new Date(), 3).toISOString(),
    age: 35,
    gender: "Female",
    trackingEvents: [
      { status: "Ordered", timestamp: subHours(new Date(), 3).toISOString(), performedBy: "Dr. Silberman" }
    ]
  },
  {
    id: "RAD-2024-002",
    serviceId: "SERV-RAD-002",
    patientId: "P-1007",
    doctorId: "DOC-005",
    uhid: "UHID-1007",
    patientName: "Bruce Wayne",
    department: "Neurology",
    testName: "MRI Brain",
    category: "Radiology",
    priority: "Stat",
    status: "SampleCollected", // Exam Completed
    clinicalIndication: "Severe Headache, Trauma",
    orderDate: subHours(new Date(), 5).toISOString(),
    age: 40,
    gender: "Male",
    trackingEvents: [
      { status: "Ordered", timestamp: subHours(new Date(), 5).toISOString(), performedBy: "Dr. Gordon" },
    ],
  },
  {
    id: "RAD-2024-003",
    serviceId: "SERV-RAD-003",
    patientId: "P-1008",
    doctorId: "DOC-003",
    uhid: "UHID-1008",
    patientName: "Alice Wonderland",
    department: "Oncology",
    testName: "CT Scan Chest",
    category: "Radiology",
    priority: "Routine",
    status: "ResultAvailable", // Report Drafted
    clinicalIndication: "Follow up Nodule",
    orderDate: subHours(new Date(), 24).toISOString(),
    age: 55,
    gender: "Female",
    trackingEvents: [
      { status: "Ordered", timestamp: subHours(new Date(), 24).toISOString(), performedBy: "Dr. Gregory" },
      { status: "SampleCollected", timestamp: subHours(new Date(), 20).toISOString(), performedBy: "Rad Tech" },
      { status: "ResultAvailable", timestamp: subHours(new Date(), 2).toISOString(), performedBy: "Dr. Radiologist" }
    ],
    result: {
      id: "REP-001",
      serviceOrderId: "RAD-2024-003",
      testName: "CT Scan Chest",
      resultValue: "FINDINGS:\n\nNo acute pulmonary abnormality. The lungs are clear without consolidation, effusion, or pneumothorax.\n\nIMPRESSION:\nNormal chest CT.",
      referenceRange: "",
      unit: "",
      technicianId: "Dr. Radiologist",
      resultDate: subHours(new Date(), 2).toISOString()
    }
  },
  {
    id: "RAD-2024-004",
    serviceId: "SERV-RAD-004",
    patientId: "P-1001",
    doctorId: "DOC-001",
    uhid: "UHID-1001",
    patientName: "John Doe",
    department: "Gastroenterology",
    testName: "USG Abdomen",
    category: "Radiology",
    priority: "Routine",
    status: "Completed",
    clinicalIndication: "Abdominal Pain",
    orderDate: subHours(new Date(), 48).toISOString(),
    age: 45,
    gender: "Male",
    trackingEvents: [
      { status: "Ordered", timestamp: subHours(new Date(), 48).toISOString(), performedBy: "Dr. Smith" },
      { status: "SampleCollected", timestamp: subHours(new Date(), 40).toISOString(), performedBy: "Sonographer" },
      { status: "ResultAvailable", timestamp: subHours(new Date(), 38).toISOString(), performedBy: "Dr. Sonologist" },
      { status: "Completed", timestamp: subHours(new Date(), 30).toISOString(), performedBy: "Dr. Smith" }
    ],
    result: {
      id: "REP-002",
      serviceOrderId: "RAD-2024-004",
      testName: "USG Abdomen",
      resultValue: "Liver is normal in size and echotexture. Gallbladder is well-distended, no stones. Kidneys are normal.\n\nIMPRESSION:\nNormal abdominal ultrasound.",
      referenceRange: "",
      unit: "",
      technicianId: "Dr. Sonologist",
      verifiedByDoctorId: "Dr. Smith",
      resultDate: subHours(new Date(), 30).toISOString()
    }
  }
];

// Mock API Functions
export const getLabWorklist = async (): Promise<ServiceOrder[]> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return MOCK_ORDERS.filter(o => o.category === "Lab");
};

export const getRadiologyWorklist = async (): Promise<ServiceOrder[]> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return MOCK_ORDERS.filter(o => o.category === "Radiology");
};

export const collectSample = async (orderId: string): Promise<ServiceOrder | null> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const orderIndex = MOCK_ORDERS.findIndex((o) => o.id === orderId);
  if (orderIndex > -1) {
    const order = MOCK_ORDERS[orderIndex];
    const updatedOrder = {
      ...order,
      status: "SampleCollected" as OrderStatus,
      trackingEvents: [
        ...order.trackingEvents,
        {
          status: "SampleCollected" as OrderStatus,
          timestamp: new Date().toISOString(),
          performedBy: "Current User" // Mock
        }
      ]
    };
    MOCK_ORDERS[orderIndex] = updatedOrder;
    return updatedOrder;
  }
  return null;
};

export const submitResult = async (result: Omit<LabResult, "id" | "resultDate">): Promise<boolean> => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  const orderIndex = MOCK_ORDERS.findIndex((o) => o.id === result.serviceOrderId);
  if (orderIndex > -1) {
    const order = MOCK_ORDERS[orderIndex];
    const newResult: LabResult = {
      ...result,
      id: `RES-${Date.now()}`,
      resultDate: new Date().toISOString()
    };

    const updatedOrder = {
      ...order,
      status: "ResultAvailable" as OrderStatus,
      result: newResult,
      trackingEvents: [
        ...order.trackingEvents,
        {
          status: "ResultAvailable" as OrderStatus,
          timestamp: new Date().toISOString(),
          performedBy: result.technicianId || "Unknown"
        }
      ]
    };
    MOCK_ORDERS[orderIndex] = updatedOrder;
    console.log("Result Submitted:", newResult);
    if (newResult.documentUrl) console.log("Document Attached:", newResult.documentUrl);
    return true;
  }
  return false;
};

export const verifyResult = async (orderId: string, doctorId: string): Promise<boolean> => {
  await new Promise((resolve) => setTimeout(resolve, 600));
  const orderIndex = MOCK_ORDERS.findIndex((o) => o.id === orderId);
  if (orderIndex > -1) {
    const order = MOCK_ORDERS[orderIndex];
    if (order.status !== "ResultAvailable" || !order.result) return false;

    const updatedOrder = {
      ...order,
      status: "Completed" as OrderStatus,
      result: {
        ...order.result,
        verifiedByDoctorId: doctorId
      },
      trackingEvents: [
        ...order.trackingEvents,
        {
          status: "Completed" as OrderStatus,
          timestamp: new Date().toISOString(),
          performedBy: doctorId
        }
      ]
    };
    MOCK_ORDERS[orderIndex] = updatedOrder;
    return true;
  }
  return false;
};

export const rejectResult = async (orderId: string, remarks: string): Promise<boolean> => {
  await new Promise((resolve) => setTimeout(resolve, 600));
  const orderIndex = MOCK_ORDERS.findIndex((o) => o.id === orderId);
  if (orderIndex > -1) {
    const order = MOCK_ORDERS[orderIndex];
    // Send back to SampleCollected (Retest) or Ordered depending on policy. 
    // Let's assume re-test needed implies new sample or re-run same sample.
    // For simplicity, move back to SampleCollected so they can re-enter result.

    const updatedOrder = {
      ...order,
      status: "SampleCollected" as OrderStatus,
      result: undefined, // Clear invalid result
      trackingEvents: [
        ...order.trackingEvents,
        {
          status: "SampleCollected" as OrderStatus, // Reverted status
          timestamp: new Date().toISOString(),
          performedBy: "System/Doctor",
          remarks: `Rejected: ${remarks}`
        }
      ]
    };
    MOCK_ORDERS[orderIndex] = updatedOrder;
    return true;
  }
  return false;
}

// ==========================================
// PHARMACY MOCK DATA
// ==========================================

export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  batchNumber: string;
  expiryDate: string; // ISO Date
  stockQuantity: number;
  reorderLevel: number;
  unitPrice: number;
}

export interface PrescriptionItem {
  id: string;
  medicineId: string; // Ideally links to Medicine, but here just a reference
  medicineName: string; // Simplified for UI
  dosage: string;
  frequency: string;
  duration: string;
  quantityPrescribed: number; // Computed or explicitly set
}

export interface Prescription {
  id: string;
  patientId: string;
  uhid: string;
  doctorName: string;
  date: string;
  items: PrescriptionItem[];
}

// Initial Pharmacy Data
let MOCK_MEDICINES: Medicine[] = [
  {
    id: "MED-001",
    name: "Dolo 650",
    genericName: "Paracetamol",
    batchNumber: "BATCH-A1",
    expiryDate: addDays(new Date(), 365).toISOString(),
    stockQuantity: 150,
    reorderLevel: 50,
    unitPrice: 5.0
  },
  {
    id: "MED-002",
    name: "Augmentin 625",
    genericName: "Amoxicillin + Clavulanic Acid",
    batchNumber: "BATCH-B2",
    expiryDate: addDays(new Date(), 180).toISOString(),
    stockQuantity: 30,
    reorderLevel: 20,
    unitPrice: 45.0
  },
  {
    id: "MED-003",
    name: "Metrogyl 400",
    genericName: "Metronidazole",
    batchNumber: "BATCH-C3",
    expiryDate: addDays(new Date(), 90).toISOString(),
    stockQuantity: 10, // Low stock
    reorderLevel: 20,
    unitPrice: 8.0
  },
  {
    id: "MED-TEST-001",
    name: "Benadryl Cough Syrup",
    genericName: "Diphenhydramine",
    batchNumber: "BATCH-TEST-001",
    expiryDate: addDays(new Date(), 200).toISOString(),
    stockQuantity: 50,
    reorderLevel: 10,
    unitPrice: 120.0
  }
];

const MOCK_PRESCRIPTIONS: Prescription[] = [
  {
    id: "PRESC-1001",
    patientId: "P-1001",
    uhid: "UHID-1001",
    doctorName: "Dr. Smith",
    date: subHours(new Date(), 2).toISOString(),
    items: [
      {
        id: "PI-001",
        medicineId: "MED-001",
        medicineName: "Dolo 650",
        dosage: "650mg",
        frequency: "1-0-1",
        duration: "5 days",
        quantityPrescribed: 10
      },
      {
        id: "PI-002",
        medicineId: "MED-002",
        medicineName: "Augmentin 625",
        dosage: "625mg",
        frequency: "1-0-1",
        duration: "5 days",
        quantityPrescribed: 10
      }
    ]
  },
  {
    id: "PRESC-1002",
    patientId: "P-1002",
    uhid: "UHID-1002",
    doctorName: "Dr. Jones",
    date: subHours(new Date(), 24).toISOString(),
    items: [
      {
        id: "PI-003",
        medicineId: "MED-003",
        medicineName: "Metrogyl 400",
        dosage: "400mg",
        frequency: "1-1-1",
        duration: "3 days",
        quantityPrescribed: 9
      }
    ]
  },
  {
    id: "PRESC-TEST-001",
    patientId: "P-TEST-001",
    uhid: "UHID-TEST",
    doctorName: "Dr. House",
    date: new Date().toISOString(),
    items: [
      {
        id: "PI-TEST-001",
        medicineId: "MED-TEST-001",
        medicineName: "Benadryl Cough Syrup",
        dosage: "10ml",
        frequency: "0-0-1",
        duration: "5 days",
        quantityPrescribed: 1
      },
      {
        id: "PI-TEST-002",
        medicineId: "MED-001",
        medicineName: "Dolo 650",
        dosage: "650mg",
        frequency: "SOS",
        duration: "3 days",
        quantityPrescribed: 5
      }
    ]
  }
];

// Pharmacy API Functions
export const getMedicines = async (): Promise<Medicine[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return [...MOCK_MEDICINES];
};

export const addStock = async (medicine: Omit<Medicine, "id">): Promise<Medicine> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  // Check if batch exists to update qty? Schema says separate row often, 
  // but let's assume we add a new row for every batch for simplicity unless ID matches
  const newMed = {
    ...medicine,
    id: `MED-${Date.now()}`
  };
  MOCK_MEDICINES.push(newMed);
  return newMed;
};

export const getPrescriptionsByUhid = async (uhid: string): Promise<Prescription[]> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  return MOCK_PRESCRIPTIONS.filter(p => p.uhid === uhid);
};

export interface CartItem {
  medicineId: string;
  quantity: number;
}

export const processSale = async (items: CartItem[]): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 800));

  // Validate stock
  for (const item of items) {
    const medIndex = MOCK_MEDICINES.findIndex(m => m.id === item.medicineId);
    if (medIndex === -1) throw new Error("Medicine not found");
    if (MOCK_MEDICINES[medIndex].stockQuantity < item.quantity) {
      throw new Error(`Insufficient stock for ${MOCK_MEDICINES[medIndex].name}`);
    }
  }

  // Deduct stock
  items.forEach(item => {
    const medIndex = MOCK_MEDICINES.findIndex(m => m.id === item.medicineId);
    if (medIndex > -1) {
      MOCK_MEDICINES[medIndex].stockQuantity -= item.quantity;
    }
  });

  return true;
};

