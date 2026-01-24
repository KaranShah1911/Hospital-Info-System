"use client";

import { useState, useEffect, useRef } from "react";
import { Prescription } from "@/lib/mock-data";
import api from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Search, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils"; // Assuming utils exists, usually does in shadcn setup

interface PrescriptionSearchProps {
    onSelect: (prescription: Prescription) => void;
}

export function PrescriptionSearch({ onSelect }: PrescriptionSearchProps) {
    const [query, setQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isSearchingSuggestions, setIsSearchingSuggestions] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const [results, setResults] = useState<Prescription[]>([]);
    const [searched, setSearched] = useState(false);
    const [loading, setLoading] = useState(false);

    // Debounce Logic
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(query);
        }, 300);
        return () => clearTimeout(handler);
    }, [query]);

    // Fetch Suggestions Logic
    useEffect(() => {
        if (!debouncedQuery || debouncedQuery.length < 2) {
            setSuggestions([]);
            return;
        }

        const fetchSuggestions = async () => {
            setIsSearchingSuggestions(true);
            try {
                const res = await api.get(`/patients/suggestions?query=${debouncedQuery}`);
                setSuggestions(res.data || []);
                setShowSuggestions(true);
            } catch (err) {
                console.error("Failed to fetch suggestions", err);
            } finally {
                setIsSearchingSuggestions(false);
            }
        };

        fetchSuggestions();
    }, [debouncedQuery]);

    // Click outside to close
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);


    const handleSearch = async (uhidToSearch: string) => {
        if (!uhidToSearch) return;
        setLoading(true);
        setSearched(true);
        setResults([]);
        setShowSuggestions(false); // Close dropdown
        setQuery(uhidToSearch); // Update input to show what we searched

        try {
            const response = await api.get(`/pharmacy/prescriptions/${uhidToSearch}`);
            const data = response.data.data;

            if (data) {
                const mappedPrescription: Prescription = {
                    id: data.id,
                    patientId: data.patientId,
                    uhid: data.patient.uhid,
                    doctorName: data.doctor.fullName,
                    date: data.date,
                    items: data.items.map((item: any) => ({
                        id: item.id,
                        medicineId: item.medicineId,
                        medicineName: item.medicine.name,
                        dosage: item.dosage,
                        frequency: item.frequency,
                        duration: item.duration,
                        quantityPrescribed: 0
                    }))
                };
                setResults([mappedPrescription]);
            }
        } catch (error: any) {
            console.error("Search error:", error);
            if (error.response?.status !== 404) {
                toast.error(error.response?.data?.message || "Failed to search prescriptions");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSelectSuggestion = (patient: any) => {
        setQuery(patient.uhid);
        setShowSuggestions(false);
        handleSearch(patient.uhid);
    };

    return (
        <Card className="h-full overflow-visible">
            <CardHeader>
                <CardTitle>Search Prescriptions</CardTitle>
                <CardDescription>Search by Patient Name, UHID or Phone</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="relative" ref={wrapperRef}>
                    <div className="flex gap-2">
                        <Input
                            placeholder="Type UHID, Name or Phone..."
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                setShowSuggestions(true);
                            }}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch(query)}
                        />
                        <Button onClick={() => handleSearch(query)} disabled={loading}>
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                        </Button>
                    </div>

                    {/* Suggestions Dropdown */}
                    {showSuggestions && (suggestions.length > 0 || isSearchingSuggestions) && (
                        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                            {isSearchingSuggestions && (
                                <div className="p-2 text-sm text-gray-500 text-center">Loading...</div>
                            )}
                            {!isSearchingSuggestions && suggestions.length === 0 && query.length >= 2 && (
                                <div className="p-2 text-sm text-gray-500 text-center">No patients found</div>
                            )}
                            {suggestions.map((patient: any) => (
                                <div
                                    key={patient.id}
                                    className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                                    onClick={() => handleSelectSuggestion(patient)}
                                >
                                    <div className="font-medium">{patient.firstName} {patient.lastName}</div>
                                    <div className="text-gray-500 text-xs">
                                        {patient.uhid} • {patient.phone} • {format(new Date(patient.dob), 'dd/MM/yyyy')}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    {searched && results.length === 0 && !loading && (
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
