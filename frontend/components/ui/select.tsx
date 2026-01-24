"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

/*
  Simplified Select for when @radix-ui/react-select is not available.
  Uses a native <select> under the hood or a custom dropdown implementation.
  For robustness in this environment, we'll wrapper native select but try to match the API.
  Actually, matching the full API (Trigger, Value, Content, Item) with native select is tricky visually.
  
  Let's try a pure React state implementation for the visual dropdown.
*/

interface SelectContextValue {
    value?: string
    onValueChange?: (value: string) => void
    open: boolean
    setOpen: (open: boolean) => void
}
const SelectContext = React.createContext<SelectContextValue | null>(null)

const Select = ({ children, onValueChange, value, defaultValue }: any) => {
    const [open, setOpen] = React.useState(false)
    const [val, setVal] = React.useState(value || defaultValue || "")

    React.useEffect(() => {
        if (value !== undefined) setVal(value)
    }, [value])

    const handleValueChange = (newValue: string) => {
        setVal(newValue)
        if (onValueChange) onValueChange(newValue)
        setOpen(false)
    }

    return (
        <SelectContext.Provider value={{ value: val, onValueChange: handleValueChange, open, setOpen }}>
            <div className="relative inline-block w-full">{children}</div>
        </SelectContext.Provider>
    )
}

const SelectTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(({ className, children, ...props }, ref) => {
    const ctx = React.useContext(SelectContext)
    return (
        <button
            ref={ref}
            type="button"
            onClick={() => ctx?.setOpen(!ctx.open)}
            className={cn(
                "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            {...props}
        >
            {children}
            <span className="opacity-50">▼</span>
        </button>
    )
})
SelectTrigger.displayName = "SelectTrigger"

const SelectValue = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(({ className, placeholder }, ref) => {
    const ctx = React.useContext(SelectContext)
    return (
        <span ref={ref} className={cn("block truncate", className)}>
            {ctx?.value || placeholder}
        </span>
    )
})
SelectValue.displayName = "SelectValue"

const SelectContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, children, ...props }, ref) => {
    const ctx = React.useContext(SelectContext)
    if (!ctx?.open) return null

    return (
        <div
            ref={ref}
            className={cn(
                "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 w-full mt-1",
                className
            )}
            {...props}
        >
            <div className="p-1">{children}</div>
        </div>
    )
})
SelectContent.displayName = "SelectContent"

const SelectItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { value: string }>(({ className, children, value, ...props }, ref) => {
    const ctx = React.useContext(SelectContext)
    return (
        <div
            ref={ref}
            onClick={() => ctx?.onValueChange?.(value)}
            className={cn(
                "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent hover:text-accent-foreground cursor-pointer",
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
})
SelectItem.displayName = "SelectItem"

export { Select, SelectGroup, SelectValue, SelectTrigger, SelectContent, SelectLabel, SelectItem, SelectSeparator }

// Stubs for unused components but valid exports
const SelectGroup = ({ children }: any) => <div>{children}</div>
const SelectLabel = ({ children }: any) => <div className="px-2 py-1.5 text-sm font-semibold">{children}</div>
const SelectSeparator = () => <div className="-mx-1 my-1 h-px bg-muted" />
