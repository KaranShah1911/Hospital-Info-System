"use client";

import { useState } from "react";
import { getPrescriptionsByUhid, Prescription } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Search } from "lucide-react";
import { format } from "date-fns";

interface PrescriptionSearchProps {
    onSelect: (prescription: Prescription) => void;
}

export function PrescriptionSearch({ onSelect }: PrescriptionSearchProps) {
    const [uhid, setUhid] = useState("");
    const [results, setResults] = useState<Prescription[]>([]);
    const [searched, setSearched] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        if (!uhid) return;
        setLoading(true);
        setSearched(true);
        try {
            const data = await getPrescriptionsByUhid(uhid);
            setResults(data);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Search Prescriptions</CardTitle>
                <CardDescription>Enter Patient UHID to find prescriptions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex gap-2">
                    <Input
                        placeholder="UHID (e.g. UHID-1001)"
                        value={uhid}
                        onChange={(e) => setUhid(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <Button onClick={handleSearch} disabled={loading}>
                        <Search className="h-4 w-4 mr-2" />
                        {loading ? "Searching..." : "Search"}
                    </Button>
                </div>

                <div className="space-y-2">
                    {searched && results.length === 0 && (
                        <div className="text-center text-muted-foreground py-4">
                            No prescriptions found for this UHID.
                        </div>
                    )}

                    {results.map((p) => (
                        <div
                            key={p.id}
                            className="border rounded-lg p-3 cursor-pointer hover:bg-slate-50 transition-colors"
                            onClick={() => onSelect(p)}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <div className="font-semibold text-sm">
                                        {format(new Date(p.date), "MMM dd, yyyy HH:mm")}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        Dr. {p.doctorName}
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm">Select</Button>
                            </div>
                            <div className="text-sm">
                                {p.items.length} Medicines Prescribed
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
