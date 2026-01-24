export default function Loading() {
    return (
        <div className="space-y-8 animate-pulse">
            <div className="h-12 bg-slate-200 rounded-xl w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-40 bg-slate-100 rounded-3xl"></div>
                ))}
            </div>
            <div className="h-96 bg-slate-100 rounded-[2.5rem]"></div>
        </div>
    )
}
