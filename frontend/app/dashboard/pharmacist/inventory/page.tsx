"use client";

import { useState } from "react";
import { StockList } from "@/components/pharmacist/stock-list";
import { StockForm } from "@/components/pharmacist/stock-form";

export default function InventoryPage() {
    const [refreshKey, setRefreshKey] = useState(0);

    const handleStockUpdate = () => {
        setRefreshKey((prev) => prev + 1);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
                <p className="text-muted-foreground">
                    Add new batches and monitor medicine stock levels.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <StockForm onSuccess={handleStockUpdate} />
                </div>
                <div className="lg:col-span-2">
                    <StockList keyProp={refreshKey} />
                </div>
            </div>
        </div>
    );
}
