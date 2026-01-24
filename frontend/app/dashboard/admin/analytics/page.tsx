"use client";

import { useState, useEffect } from "react";
import { DepartmentRevenueLineChart } from "@/components/analytics/DepartmentRevenueChart";
import MLModelLoader from "@/components/analytics/MLModelLoader";

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 5000); // 5s buffering
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <MLModelLoader />;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-2">Departmental Analytics</h1>
      <p className="text-slate-500 mb-8">Financial Overview: Investment vs Revenue Generation (2025)</p>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

        {/* 1. Cardiology (Healthy Profit) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <DepartmentRevenueLineChart
            department="Cardiology"
            invested={[40, 42, 45, 43, 46, 50, 52, 55, 53, 58, 60, 62]}
            generated={[50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 110]}
          />
        </div>

        {/* 2. Neurology (Moderate Growth) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <DepartmentRevenueLineChart
            department="Neurology"
            invested={[30, 32, 33, 35, 36, 38, 40, 42, 43, 45, 46, 48]}
            generated={[35, 38, 42, 45, 48, 52, 55, 60, 62, 65, 68, 72]}
          />
        </div>

        {/* 3. Orthopedics (LOSS/WARNING - High Invest, Low Return) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-red-200 ring-1 ring-red-100">
          <div className="mb-2 flex justify-between items-center">
            <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold uppercase">Attention Needed</span>
          </div>
          <DepartmentRevenueLineChart
            department="Orthopedics"
            invested={[60, 65, 70, 75, 80, 85, 90, 95, 98, 102, 105, 110]} // High cost
            generated={[40, 42, 45, 44, 46, 48, 50, 52, 51, 53, 55, 58]} // Low return
            isLoss={true}
          />
          <p className="mt-4 text-sm text-red-600 font-medium">Critical: Revenue significantly lagging behind operational costs.</p>
        </div>

        {/* 4. Pediatrics (Steady) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <DepartmentRevenueLineChart
            department="Pediatrics"
            invested={[20, 22, 23, 25, 24, 26, 28, 29, 30, 32, 33, 35]}
            generated={[25, 28, 30, 35, 38, 40, 42, 45, 48, 50, 55, 60]}
          />
        </div>

      </div>
    </div>
  );
}
