"use client";

import React from "react";
import { Users, DollarSign, Activity, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    { label: "Total Revenue", value: "₹4.2 Cr", icon: DollarSign, color: "text-green-600", bg: "bg-green-100" },
    { label: "Active Patients", value: "1,240", icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Doctors On Duty", value: "48", icon: Activity, color: "text-purple-600", bg: "bg-purple-100" },
    { label: "Growth Rate", value: "+12.5%", icon: TrendingUp, color: "text-orange-600", bg: "bg-orange-100" },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Hospital Administration</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={stat.color} size={24} />
              </div>
              <span className={`text-sm font-bold ${stat.color}`}>{stat.label}</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
            <p className="text-xs text-slate-500 mt-1">Updated just now</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-center py-20">
        <h2 className="text-xl font-bold text-slate-400 mb-4">Quick Actions</h2>
        <p className="text-slate-500">Select a module from the sidebar to manage specific areas.</p>
      </div>
    </div>
  );
}
