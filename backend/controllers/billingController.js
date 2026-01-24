import prisma from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

// Get Active Bill Details
// Logic: Fetches all UNPAID ServiceOrders and Prescriptions for a specific Visit.
// Calculates the total estimated bill.

export const getActiveBill = async (req, res) => {
  try {
    const { visitId, admissionId } = req.query;

    if (!visitId && !admissionId) {
      throw new ApiError(400, "Either visitId or admissionId is required");
    }

    let visit = null;
    let admission = null;

    // ============================
    // 1️⃣ Resolve Visit / Admission
    // ============================

    if (visitId) {
      visit = await prisma.opdVisit.findUnique({
        where: { id: visitId },
        include: {
          admission: true
        }
      });

      if (!visit) {
        throw new ApiError(404, "OPD Visit not found");
      }

      if (visit.admission) {
        admission = await prisma.admission.findUnique({
          where: { id: visit.admission.id },
          include: admissionInclude
        });
      }
    }

    if (admissionId && !admission) {
      admission = await prisma.admission.findUnique({
        where: { id: admissionId },
        include: admissionInclude
      });

      if (!admission) {
        throw new ApiError(404, "Admission not found");
      }

      if (admission.visitId) {
        visit = await prisma.opdVisit.findUnique({
          where: { id: admission.visitId }
        });
      }
    }

    // ============================
    // 2️⃣ Billing Object
    // ============================

    const billingData = {
      opd: { points: [], total: 0 },
      ipd: { points: [], bedCharges: [], total: 0 },
      grandTotal: 0
    };

    // ============================
    // 3️⃣ OPD BILLING
    // ============================

    if (visit) {
      const REGISTRATION_FEE = 500;

      billingData.opd.points.push({
        id: "registration",
        type: "Mandatory",
        name: "Registration Fee",
        amount: REGISTRATION_FEE
      });

      billingData.opd.total += REGISTRATION_FEE;

      // OPD Services
      const opdServices = await prisma.serviceOrder.findMany({
        where: {
          visitId: visit.id,
          admissionId: null,
          isPaid: false,
          status: { not: "Cancelled" }
        },
        include: { service: true }
      });

      opdServices.forEach(order => {
        const amt = Number(order.service.basePrice);
        billingData.opd.points.push({
          id: order.id,
          type: "Service",
          name: order.service.name,
          amount: amt
        });
        billingData.opd.total += amt;
      });

      // OPD Prescriptions
      const opdPrescriptions = await prisma.prescription.findMany({
        where: {
          visitId: visit.id,
          admissionId: null,
          isPaid: false
        },
        include: {
          items: { include: { medicine: true } }
        }
      });

      opdPrescriptions.forEach(rx => {
        rx.items.forEach(item => {
          const amt = Number(item.medicine.unitPrice);
          billingData.opd.points.push({
            id: item.id,
            type: "Medicine",
            name: item.medicine.name,
            amount: amt
          });
          billingData.opd.total += amt;
        });
      });
    }

    // ============================
    // 4️⃣ IPD BILLING
    // ============================

    if (admission) {
      const ADMISSION_FEE = 1000;
      const NURSING_CHARGE_PER_DAY = 200;

      billingData.ipd.points.push({
        id: "admission_fee",
        type: "Mandatory",
        name: "Admission Fee",
        amount: ADMISSION_FEE
      });

      billingData.ipd.total += ADMISSION_FEE;

      // ---- BED CHARGES ----
      let bedTotal = 0;
      let totalDays = 0;

      for (const transfer of admission.bedTransfers) {
        if (!transfer.endDate) continue;

        const days = Math.max(
          1,
          Math.ceil(
            (new Date(transfer.endDate) - new Date(transfer.startDate)) /
              86400000
          )
        );

        const cost = days * Number(transfer.bed.ward.basePricePerDay);

        billingData.ipd.bedCharges.push({
          ward: transfer.bed.ward.name,
          bed: transfer.bed.bedNumber,
          days,
          cost
        });

        bedTotal += cost;
        totalDays += days;
      }

      // Active bed
      const activeTransfer = admission.bedTransfers.find(
        t => !t.endDate
      );

      if (activeTransfer && admission.currentBed) {
        const days = Math.max(
          1,
          Math.ceil(
            (new Date() - new Date(activeTransfer.startDate)) / 86400000
          )
        );

        const cost =
          days *
          Number(admission.currentBed.ward.basePricePerDay);

        billingData.ipd.bedCharges.push({
          ward: admission.currentBed.ward.name,
          bed: admission.currentBed.bedNumber,
          days,
          cost,
          status: "Active"
        });

        bedTotal += cost;
        totalDays += days;
      }

      billingData.ipd.total += bedTotal;

      // ---- NURSING ----
      const nursingCost = totalDays * NURSING_CHARGE_PER_DAY;

      billingData.ipd.points.push({
        id: "nursing",
        type: "Mandatory",
        name: `Nursing Charges (${totalDays} days)`,
        amount: nursingCost
      });

      billingData.ipd.total += nursingCost;

      // ---- SURGERIES ----
      admission.surgeries.forEach(surgery => {
        billingData.ipd.points.push({
          id: surgery.id,
          type: "Surgery",
          name: surgery.procedureName,
          amount: Number(surgery.totalAmount)
        });
        billingData.ipd.total += Number(surgery.totalAmount);
      });

      // ---- IPD SERVICES ----
      const ipdServices = await prisma.serviceOrder.findMany({
        where: {
          admissionId: admission.id,
          isPaid: false,
          status: { not: "Cancelled" }
        },
        include: { service: true }
      });

      ipdServices.forEach(order => {
        const amt = Number(order.service.basePrice);
        billingData.ipd.points.push({
          id: order.id,
          type: "Service",
          name: order.service.name,
          amount: amt
        });
        billingData.ipd.total += amt;
      });

      // ---- IPD MEDICINES ----
      const ipdPrescriptions = await prisma.prescription.findMany({
        where: {
          admissionId: admission.id,
          isPaid: false
        },
        include: {
          items: { include: { medicine: true } }
        }
      });

      ipdPrescriptions.forEach(rx => {
        rx.items.forEach(item => {
          const amt = Number(item.medicine.unitPrice);
          billingData.ipd.points.push({
            id: item.id,
            type: "Medicine",
            name: item.medicine.name,
            amount: amt
          });
          billingData.ipd.total += amt;
        });
      });
    }

    billingData.grandTotal =
      billingData.opd.total + billingData.ipd.total;

    return res
      .status(200)
      .json(new ApiResponse(200, billingData, "Active bill fetched"));

  } catch (error) {
    console.error(error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error"
    });
  }
};

// ============================
// 🔹 Reusable Admission Include
// ============================

const admissionInclude = {
  bedTransfers: {
    include: {
      bed: {
        include: { ward: true }
      }
    },
    orderBy: { startDate: "asc" }
  },
  currentBed: {
    include: { ward: true }
  },
  surgeries: {
    where: { isPaid: false }
  }
};


// Finalize Bill
// Logic: Completes the visit and finalizes any draft invoice.
export const finalizeBill = async (req, res) => {
    try {
        const { visitId } = req.body;

        const result = await prisma.$transaction(async (tx) => {
            // Check for pending unpaid items? 
            // Optional: Block finalization if unpaid items exist?
            // For now, we follow user instruction: "mark existing Invoice as Finalized" and "Visit as Completed".

            // 1. Finalize Draft Invoice if exists
            const invoice = await tx.invoice.findFirst({
                where: { visitId, status: 'Draft' }
            });

            if (invoice) {
                await tx.invoice.update({
                    where: { id: invoice.id },
                    data: { status: 'Finalized' }
                });
            }

            // 2. Mark Visit as Completed
            const visit = await tx.opdVisit.update({
                where: { id: visitId },
                data: { status: 'Completed' }
            });

            return visit;
        });

        res.status(200).json(new ApiResponse(200, result, "Bill finalized and Visit completed"));
    } catch (error) {
        res.status(error.statusCode || 500).json(new ApiError(error.statusCode || 500, error.message));
    }
};

// Generate Invoice for Service Order
// Logic: Creates a PAID invoice for a single service order and updates isPaid=true.
export const generateInvoiceForServiceOrder = async (req, res) => {
    try {
        const { serviceOrderId } = req.body;

        const serviceOrder = await prisma.serviceOrder.findUnique({
            where: { id: serviceOrderId },
            include: { service: true }
        });

        if (!serviceOrder) throw new ApiError(404, "Service Order not found");
        if (serviceOrder.isPaid) throw new ApiError(400, "Service Order is already paid");

        const amount = Number(serviceOrder.service.basePrice);

        const result = await prisma.$transaction(async (tx) => {
            // 1. Create Invoice
            const invoice = await tx.invoice.create({
                data: {
                    patientId: serviceOrder.patientId,
                    visitId: serviceOrder.visitId,
                    admissionId: serviceOrder.admissionId,
                    totalAmount: amount,
                    taxAmount: 0,
                    discountAmount: 0,
                    netAmount: amount,
                    status: "Paid",
                    items: {
                        create: [{
                            itemName: serviceOrder.service.name,
                            quantity: 1,
                            unitPrice: amount,
                            total: amount,
                            serviceId: serviceOrder.serviceId,
                            serviceOrderId: serviceOrder.id
                        }]
                    }
                }
            });

            // 2. Mark Service Order as Paid
            await tx.serviceOrder.update({
                where: { id: serviceOrderId },
                data: { isPaid: true }
            });

            return invoice;
        });

        res.status(201).json(new ApiResponse(201, result, "Invoice created for Service Order"));
    } catch (error) {
        res.status(error.statusCode || 500).json(new ApiError(error.statusCode || 500, error.message));
    }
};

// Generate Invoice for Prescription
// Logic: Creates a PAID invoice for a prescription and updates isPaid=true.
export const generateInvoiceForPrescription = async (req, res) => {
    try {
        const { prescriptionId } = req.body;

        const prescription = await prisma.prescription.findUnique({
            where: { id: prescriptionId },
            include: {
                items: {
                    include: { medicine: true }
                }
            }
        });

        if (!prescription) throw new ApiError(404, "Prescription not found");
        if (prescription.isPaid) throw new ApiError(400, "Prescription is already paid");

        // Calculate Totals and Prepare Items
        let totalAmount = 0;
        const invoiceItemsData = [];
        
        // Find a placeholder Service ID for the InvoiceItem relation (Schema constraint)
        const dummyService = await prisma.service.findFirst();
        if(!dummyService) throw new ApiError(500, "System Error: No Service found to link Invoice Items.");

        for (const item of prescription.items) {
            const quantity = 1; // Defaulting to 1 as qty is not explicit in PrescriptionItem
            const price = Number(item.medicine.unitPrice);
            const lineTotal = quantity * price;
            totalAmount += lineTotal;

            invoiceItemsData.push({
                itemName: item.medicine.name,
                quantity: quantity,
                unitPrice: price,
                total: lineTotal,
                serviceId: dummyService.id // Satisfy relation
            });
        }

        const result = await prisma.$transaction(async (tx) => {
            // 1. Create Invoice
            const invoice = await tx.invoice.create({
                data: {
                    patientId: prescription.patientId,
                    visitId: prescription.visitId,
                    admissionId: prescription.admissionId,
                    totalAmount,
                    taxAmount: 0,
                    discountAmount: 0,
                    netAmount: totalAmount,
                    status: "Paid",
                    items: {
                        create: invoiceItemsData
                    }
                }
            });

            // 2. Mark Prescription as Paid
            await tx.prescription.update({
                where: { id: prescriptionId },
                data: { isPaid: true }
            });

            return invoice;
        });

        res.status(201).json(new ApiResponse(201, result, "Invoice created for Prescription"));
    } catch (error) {
        res.status(error.statusCode || 500).json(new ApiError(error.statusCode || 500, error.message));
    }
};
