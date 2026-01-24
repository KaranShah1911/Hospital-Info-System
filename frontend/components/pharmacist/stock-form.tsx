"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    genericName: z.string().min(2, "Generic name must be at least 2 characters."),
    batchNumber: z.string().min(2, "Batch number is required"),
    expiryDate: z.string().refine((val) => new Date(val) > new Date(), {
        message: "Expiry date must be in the future",
    }),
    stockQuantity: z.coerce.number().min(1, "Quantity must be at least 1"),
    reorderLevel: z.coerce.number().min(0, "Reorder level must be at least 0"),
    unitPrice: z.coerce.number().min(0.01, "Price must be greater than 0"),
});

interface StockFormProps {
    onSuccess: () => void;
}

export function StockForm({ onSuccess }: StockFormProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            genericName: "",
            batchNumber: "",
            expiryDate: "",
            stockQuantity: 0,
            reorderLevel: 10,
            unitPrice: 0,
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            await api.post('/pharmacy/inventory', {
                ...values,
                expiryDate: new Date(values.expiryDate).toISOString(),
            });
            toast.success("Stock added successfully");
            form.reset();
            onSuccess();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to add stock");
            console.error(error);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add New Stock</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Medicine Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Paracetamol" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="genericName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Generic Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Acetaminophen" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <FormField
                                control={form.control}
                                name="batchNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Batch Number</FormLabel>
                                        <FormControl>
                                            <Input placeholder="BATCH-001" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="expiryDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Expiry Date</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="unitPrice"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Unit Price ($)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                placeholder="0.00"
                                                {...field}
                                                onChange={e => field.onChange(parseFloat(e.target.value))}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="stockQuantity"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Initial Quantity</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                {...field}
                                                onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="reorderLevel"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Reorder Level</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                {...field}
                                                onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Button type="submit">Add to Inventory</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
