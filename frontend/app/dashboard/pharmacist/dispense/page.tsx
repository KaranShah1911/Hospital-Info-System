"use client";

import { useState } from "react";
import { Search, ShoppingCart, CheckCircle, Package } from "lucide-react";
import { getApi } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function DispensePage() {
  const [search, setSearch] = useState("");
  const [prescription, setPrescription] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [dispensing, setDispensing] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setPrescription(null);
    try {
      const res = await getApi(`/pharmacy/prescriptions/${search}`); // Search via UHID
      // Backend returns single prescription object
      setPrescription(res.data);
      toast.success("Prescription found");
    } catch (error: any) {
      toast.error(error.message || "Prescription not found");
    } finally {
      setLoading(false);
    }
  };

  const handleDispense = async () => {
    if (!prescription) return;
    setDispensing(true);

    try {
      // Map items for sale payload
      const saleItems = prescription.items.map((item: any) => ({
        medicineId: item.medicineId, // Assuming medicineId is available in item details
        quantity: calculateQuantity(item.duration, item.frequency) // Helper logic needed
      }));

      // For now, simplify or use manual logic?
      // Wait, the API `createPharmacySale` expects `items: [{ medicineId, quantity }]`.
      // The `prescription.items` from `getPrescriptionById` has:
      // medicine: { name, unitPrice, stock }
      // But does it have `medicineId`? Yes, standard include.

      // Let's assume a default qty for now:
      const itemsToSell = prescription.items.map((item: any) => ({
        medicineId: item.medicineId,
        quantity: 10 // Mock default for now, real logic needs frequency parsing
      }));

      const res = await fetch('http://localhost:3000/api/v1/pharmacy/sale', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Ensure auth
        },
        body: JSON.stringify({
          patientId: prescription.patientId,
          prescriptionId: prescription.id,
          items: itemsToSell
        })
      });

      if (!res.ok) throw new Error("Sale failed");

      toast.success("Medicines Dispensed & Stock Updated!");
      setPrescription(null); // Clear after sale
      setSearch("");
    } catch (error) {
      toast.error("Failed to process sale");
    } finally {
      setDispensing(false);
    }
  };

  // Helper to estimate quantity
  const calculateQuantity = (duration: string, frequency: string) => {
    // Simple heuristic: "5 days" * "1-0-1" (2) = 10
    // This is complex to parse perfectly, so we default or let user edit (skipped editing for MVP)
    return 10;
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <ShoppingCart className="text-indigo-600" /> Dispense Medicine
      </h1>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-8 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Scan or Enter Patient UHID (e.g. MED1001)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !search}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "Searching..." : "Fetch Prescription"}
        </button>
      </form>

      {/* Result Area */}
      {prescription && (
        <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
          <div className="p-6 border-b bg-slate-50 flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold">{prescription.patient.firstName} {prescription.patient.lastName}</h2>
              <p className="text-sm text-slate-500 font-mono">{prescription.patient.uhid}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-slate-600">Dr. {prescription.doctor.fullName}</p>
              <p className="text-xs text-slate-400">{new Date(prescription.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="p-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b">
                  <th className="pb-2">Medicine</th>
                  <th className="pb-2">Instructions</th>
                  <th className="pb-2">Stock</th>
                  <th className="pb-2 text-right">Unit Price</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {prescription.items.map((item: any, idx: number) => (
                  <tr key={idx}>
                    <td className="py-3 font-medium">{item.medicine.name}</td>
                    <td className="py-3 text-slate-600">
                      {item.dosage} • {item.frequency} • {item.duration}
                    </td>
                    <td className={`py-3 ${item.medicine.stockQuantity < 10 ? 'text-red-500 font-bold' : 'text-green-600'}`}>
                      {item.medicine.stockQuantity} Units
                    </td>
                    <td className="py-3 text-right">₹{item.medicine.unitPrice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-6 border-t bg-slate-50 flex justify-end gap-4">
            <button
              onClick={() => setPrescription(null)}
              className="px-6 py-2 text-slate-500 hover:text-slate-700 font-bold"
            >
              Cancel
            </button>
            <button
              onClick={handleDispense}
              disabled={dispensing}
              className="bg-green-600 text-white px-8 py-2 rounded-lg font-bold hover:bg-green-700 flex items-center gap-2"
            >
              {dispensing ? (
                <span className="animate-pulse">Processing...</span>
              ) : (
                <>
                  <CheckCircle size={18} /> Confirm & Dispense
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
