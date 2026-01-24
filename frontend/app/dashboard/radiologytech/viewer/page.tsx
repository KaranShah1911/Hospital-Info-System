"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, ZoomIn, ZoomOut, Move, Sun, Contrast, Grid, Layout, Download, Share2, Info } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Mock Images for the viewer
const MOCK_IMAGES = [
    "https://prod-images-static.radiopaedia.org/images/29792622/c03164962c860d57662c1613998f58_jumbo.jpeg", // Chest X-ray
    "https://prod-images-static.radiopaedia.org/images/53381467/202c4815255476d086208933e45308_jumbo.jpeg", // Lateral
    "https://prod-images-static.radiopaedia.org/images/22379320/6e2df4567c945196f72782cc686b24_jumbo.jpeg"  // CT Slice
];

function ViewerContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId") || "UNKNOWN";
    const patientName = searchParams.get("patient") || "Unknown Patient";

    const [selectedImage, setSelectedImage] = React.useState(0);
    const [zoom, setZoom] = React.useState(100);

    return (
        <div className="h-screen flex flex-col bg-black text-white overflow-hidden">
            {/* Toolbar Header */}
            <header className="h-14 border-b border-gray-800 flex items-center justify-between px-4 bg-gray-900 shrink-0">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/radiologytech" className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <div className="font-bold text-sm tracking-wide">{patientName}</div>
                        <div className="text-xs text-gray-500 font-mono">{orderId} • MRN-88291</div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white" title="Layout">
                        <Layout size={18} />
                    </button>
                    <div className="w-px h-6 bg-gray-800 mx-2" />
                    <button className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white" title="Zoom Out" onClick={() => setZoom(z => Math.max(10, z - 10))}>
                        <ZoomOut size={18} />
                    </button>
                    <span className="text-xs w-12 text-center text-gray-500">{zoom}%</span>
                    <button className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white" title="Zoom In" onClick={() => setZoom(z => Math.min(300, z + 10))}>
                        <ZoomIn size={18} />
                    </button>
                    <div className="w-px h-6 bg-gray-800 mx-2" />
                    <button className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white" title="Pan">
                        <Move size={18} />
                    </button>
                    <button className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white" title="Window/Level">
                        <Contrast size={18} />
                    </button>
                    <button className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white" title="Invert">
                        <Sun size={18} />
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    <button className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-xs font-bold rounded flex items-center gap-2 transition">
                        Write Report
                    </button>
                    <button className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white" title="Info">
                        <Info size={18} />
                    </button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Thumbnails Sidebar */}
                <div className="w-32 bg-gray-900 border-r border-gray-800 flex flex-col p-2 gap-2 overflow-y-auto custom-scrollbar">
                    {MOCK_IMAGES.map((src, idx) => (
                        <div
                            key={idx}
                            onClick={() => setSelectedImage(idx)}
                            className={cn(
                                "aspect-square bg-black rounded-lg border-2 overflow-hidden cursor-pointer relative group",
                                selectedImage === idx ? "border-indigo-500" : "border-transparent hover:border-gray-700"
                            )}
                        >
                            <img src={src} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition" alt="Thumbnail" />
                            <span className="absolute bottom-1 right-1 text-[10px] font-bold text-gray-400 bg-black/50 px-1 rounded">
                                Img {idx + 1}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Main Canvas */}
                <div className="flex-1 bg-black relative flex items-center justify-center overflow-hidden">
                    <div
                        className="transition-transform duration-200 ease-out"
                        style={{ transform: `scale(${zoom / 100})` }}
                    >
                        {/* Placeholder for actual DICOM rendering */}
                        <img
                            src={MOCK_IMAGES[selectedImage]}
                            alt="Main View"
                            className="max-h-[85vh] max-w-full object-contain shadow-2xl"
                        />
                    </div>

                    {/* Overlays */}
                    <div className="absolute top-4 left-4 text-xs font-mono text-indigo-400 select-none pointer-events-none">
                        <div>KV: 120</div>
                        <div>mA: 200</div>
                        <div>TE: 85ms</div>
                    </div>
                    <div className="absolute top-4 right-4 text-xs font-mono text-yellow-500 select-none pointer-events-none">
                        <div>L: 40</div>
                        <div>W: 400</div>
                    </div>
                    <div className="absolute bottom-4 left-4 text-xs font-mono text-gray-400 select-none pointer-events-none">
                        <div>Series: 4</div>
                        <div>Image: {selectedImage + 1} / {MOCK_IMAGES.length}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function PACSViewer() {
    return (
        <Suspense fallback={<div className="h-screen bg-black flex items-center justify-center text-white">Loading Viewer...</div>}>
            <ViewerContent />
        </Suspense>
    );
}
