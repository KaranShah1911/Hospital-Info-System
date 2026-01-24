"use client";

import { useState } from "react";
import { PrescriptionSearch } from "@/components/pharmacist/prescription-search";
import { PosCart } from "@/components/pharmacist/pos-cart";
import { Prescription } from "@/lib/mock-data";

export default function FulfillmentPage() {
    const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Prescription Fulfillment</h1>
                <p className="text-muted-foreground">
                    Search prescriptions and process patient checkout.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[600px]">
                <PrescriptionSearch onSelect={setSelectedPrescription} />
                <PosCart
                    prescription={selectedPrescription}
                    onSuccess={() => setSelectedPrescription(null)}
                />
            </div>
        </div>
    );
}
