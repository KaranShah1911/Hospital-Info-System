"use client";

import { useEffect, useState } from "react";
import { Medicine, Prescription, CartItem } from "@/lib/mock-data";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

interface PosCartProps {
    prescription?: Prescription | null;
    onSuccess: () => void;
}

interface CartEntry {
    medicineId: string; // The specific batch ID
    genericName: string; // for grouping/display
    name: string;
    price: number;
    quantity: number;
    maxStock: number;
}

export function PosCart({ prescription, onSuccess }: PosCartProps) {
    const [cart, setCart] = useState<CartEntry[]>([]);
    const [availableStocks, setAvailableStocks] = useState<Medicine[]>([]);
    const [loading, setLoading] = useState(false);

    // Load latest stocks to validate against when prescription changes or component mounts
    useEffect(() => {
        loadStocks();
    }, [prescription]);

    const loadStocks = async () => {
        try {
            const response = await api.get('/pharmacy/inventory');
            setAvailableStocks(response.data);
        } catch (error) {
            console.error("Failed to load inventory:", error);
        }
    };

    // When prescription is selected, auto-populate cart best effort
    useEffect(() => {
        if (prescription && availableStocks.length > 0) {
            const newCart: CartEntry[] = [];

            prescription.items.forEach(item => {
                // Find best batch (e.g. earliest expiry that has stock) -- simluated by just picking first match
                // In real app, we'd look for name match. 
                // Mock data names: "Dolo 650", "Augmentin 625", etc.
                const match = availableStocks.find(s =>
                    s.name.toLowerCase().includes(item.medicineName.toLowerCase()) ||
                    s.genericName.toLowerCase().includes(item.medicineName.toLowerCase())
                );

                if (match && match.stockQuantity > 0) {
                    newCart.push({
                        medicineId: match.id,
                        name: match.name,
                        genericName: match.genericName,
                        price: Number(match.unitPrice),
                        quantity: item.quantityPrescribed || 1, // Default to 1 if not calculated
                        maxStock: match.stockQuantity
                    });
                }
            });
            setCart(newCart);
        }
    }, [prescription, availableStocks]);

    const updateQuantity = (index: number, qty: number) => {
        const newCart = [...cart];
        if (qty > newCart[index].maxStock) {
            toast.warning(`Max stock available is ${newCart[index].maxStock}`);
            newCart[index].quantity = newCart[index].maxStock;
        } else {
            newCart[index].quantity = qty;
        }
        setCart(newCart);
    };

    const removeItem = (index: number) => {
        const newCart = [...cart];
        newCart.splice(index, 1);
        setCart(newCart);
    };

    const handleCheckout = async () => {
        if (!prescription && cart.length === 0) {
            toast.error("Cart empty");
            return;
        }

        setLoading(true);
        try {
            const saleItems = cart.map(c => ({
                medicineId: c.medicineId,
                quantity: c.quantity
            }));

            // Backend Controller expects: { patientId, prescriptionId, items: [{ medicineId, quantity }] }
            const payload = {
                patientId: prescription?.patientId, // might be undefined if direct sale, but schema requires patientId usually
                prescriptionId: prescription?.id,
                items: saleItems
            };

            // If no prescription (direct sale), we need a patientId? 
            // The logic in Fulfillment implies it's Prescription Fulfillment.
            if (!payload.patientId) {
                // If the UI supports Walk-in, we need patient search. 
                // But for now context is Fulfillment page which has Prescription Search.
                throw new Error("Patient ID missing (Select a prescription first)");
            }

            await api.post('/pharmacy/sale', payload);

            toast.success("Sale completed successfully! Stock updated.");
            setCart([]);
            onSuccess(); // Trigger parent refresh
            loadStocks(); // Upgrade local stock state
        } catch (error: any) {
            toast.error(error.response?.data?.error || error.message || "Checkout failed");
        } finally {
            setLoading(false);
        }
    };

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <CardTitle>Cart / Billing</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto">
                {cart.length === 0 ? (
                    <div className="text-center text-muted-foreground mt-10">
                        Cart is empty. Select a prescription or add items.
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Medicine</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead className="w-[100px]">Qty</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {cart.map((item, idx) => (
                                <TableRow key={item.medicineId + idx}>
                                    <TableCell>
                                        <div className="font-medium">{item.name}</div>
                                        <div className="text-xs text-muted-foreground">{item.genericName}</div>
                                    </TableCell>
                                    <TableCell>${item.price.toFixed(2)}</TableCell>
                                    <TableCell>
                                        <Input
                                            type="number"
                                            min="1"
                                            value={item.quantity}
                                            onChange={(e) => updateQuantity(idx, parseInt(e.target.value) || 0)}
                                            className="h-8"
                                        />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="icon" onClick={() => removeItem(idx)}>
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
            <CardFooter className="border-t pt-4 block">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-bold">Total Amount:</span>
                    <span className="text-2xl font-bold text-primary">${total.toFixed(2)}</span>
                </div>
                <Button
                    className="w-full"
                    size="lg"
                    disabled={cart.length === 0 || loading}
                    onClick={handleCheckout}
                >
                    {loading ? "Processing..." : "Complete Sale"}
                </Button>
            </CardFooter>
        </Card>
    );
}
