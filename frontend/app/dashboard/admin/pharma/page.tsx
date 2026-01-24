"use client";

import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { useState, useEffect } from 'react';
import MLModelLoader from "@/components/analytics/MLModelLoader";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function PharmaAnalyticsPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Sales Trend (Line Chart)
  const salesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Monthly Sales Volume (Units)',
        data: [1200, 1350, 1250, 1400, 1600, 1500, 1700, 1800, 1750, 1900, 2100, 2300],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.3,
      },
    ],
  };

  // Revenue Breakdown (Bar Chart)
  const revenueData = {
    labels: ['Antibiotics', 'Analgesics', 'Cardiovascular', 'Vitamins', 'Dermatology', 'Others'],
    datasets: [
      {
        label: 'Revenue (₹ Lakhs)',
        data: [25, 15, 30, 10, 8, 12],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
      },
    ],
  };

  if (loading) return <MLModelLoader />;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Pharmacy Analytics</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales Trend */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold mb-4">Monthly Sales Trend</h3>
          <Line options={{ responsive: true, animation: { duration: 2000 } }} data={salesData} />
        </div>

        {/* Revenue by Category */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold mb-4">Revenue by Category</h3>
          <Bar options={{ responsive: true, animation: { duration: 2000, delay: 500 } }} data={revenueData} />
        </div>
      </div>
    </div>
  );
}
