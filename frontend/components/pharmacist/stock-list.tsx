"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Medicine } from "@/lib/mock-data";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

// Extended Medicine interface to include status from backend
interface InventoryItem extends Medicine {
    status?: string;
}

export function StockList({ keyProp }: { keyProp?: number }) {
    const [stocks, setStocks] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStocks();
    }, [keyProp]); // Reload when keyProp changes

    const loadStocks = async () => {
        setLoading(true);
        try {
            const response = await api.get('/pharmacy/inventory');
            setStocks(response.data);
        } catch (error) {
            console.error("Failed to load stocks", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Loading stock data...</div>;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Current Stock Inventory</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Medicine Name</TableHead>
                            <TableHead>Generic Name</TableHead>
                            <TableHead>Batch No</TableHead>
                            <TableHead>Expiry</TableHead>
                            <TableHead className="text-right">Price</TableHead>
                            <TableHead className="text-right">Stock Qty</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {stocks.map((med) => {
                            let statusBadge;
                            // Prioritize backend status if available, else fallback
                            const status = med.status || (med.stockQuantity <= med.reorderLevel ? "Low Stock" : "In Stock");

                            if (status === "Out of Stock") {
                                statusBadge = <Badge variant="destructive">Out of Stock</Badge>;
                            } else if (status === "Low Stock") {
                                statusBadge = <Badge className="bg-orange-500 hover:bg-orange-600">Low Stock</Badge>;
                            } else {
                                statusBadge = <Badge variant="outline" className="text-green-600 border-green-600">In Stock</Badge>;
                            }

                            return (
                                <TableRow key={med.id}>
                                    <TableCell className="font-medium">{med.name}</TableCell>
                                    <TableCell>{med.genericName}</TableCell>
                                    <TableCell>{med.batchNumber}</TableCell>
                                    <TableCell>{format(new Date(med.expiryDate), "MMM dd, yyyy")}</TableCell>
                                    <TableCell className="text-right">${Number(med.unitPrice).toFixed(2)}</TableCell>
                                    <TableCell className="text-right">{med.stockQuantity}</TableCell>
                                    <TableCell>
                                        {statusBadge}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
