"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface TabsContextValue {
    value: string
    onValueChange: (value: string) => void
}
const TabsContext = React.createContext<TabsContextValue | null>(null)

const Tabs = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { defaultValue?: string, value?: string, onValueChange?: (val: string) => void }>(
    ({ className, defaultValue, value, onValueChange, ...props }, ref) => {
        const [val, setVal] = React.useState(value || defaultValue || "")

        // Sync controlled value
        React.useEffect(() => {
            if (value !== undefined) setVal(value)
        }, [value])

        const handleChange = (v: string) => {
            setVal(v)
            if (onValueChange) onValueChange(v)
        }

        return (
            <TabsContext.Provider value={{ value: val, onValueChange: handleChange }}>
                <div ref={ref} className={cn("", className)} {...props} />
            </TabsContext.Provider>
        )
    }
)
Tabs.displayName = "Tabs"

const TabsList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
                className
            )}
            {...props}
        />
    )
)
TabsList.displayName = "TabsList"

const TabsTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }>(
    ({ className, value, ...props }, ref) => {
        const ctx = React.useContext(TabsContext)
        const isSelected = ctx?.value === value
        return (
            <button
                ref={ref}
                type="button"
                onClick={() => ctx?.onValueChange(value)}
                className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                    isSelected && "bg-background text-foreground shadow-sm",
                    className
                )}
                {...props}
            />
        )
    }
)
TabsTrigger.displayName = "TabsTrigger"

const TabsContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { value: string }>(
    ({ className, value, ...props }, ref) => {
        const ctx = React.useContext(TabsContext)
        if (ctx?.value !== value) return null

        return (
            <div
                ref={ref}
                className={cn(
                    "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    className
                )}
                {...props}
            />
        )
    }
)
TabsContent.displayName = "TabsContent"

export { Tabs, TabsList, TabsTrigger, TabsContent }
