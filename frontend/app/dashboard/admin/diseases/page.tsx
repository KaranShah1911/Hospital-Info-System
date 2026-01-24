"use client";

import { useState, useEffect } from "react";
import { Bar } from 'react-chartjs-2';
import MLModelLoader from "@/components/analytics/MLModelLoader";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function DiseaseTrendsPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 5000); // 5s buffering
    return () => clearTimeout(timer);
  }, []);

  const data = {
    labels: ['Hypertension', 'Diabetes Type 2', 'Viral Fever', 'Gastroenteritis', 'Respiratory Infection', 'Dengue', 'Malaria'],
    datasets: [
      {
        label: 'Number of Cases (2025)',
        data: [1500, 1200, 2000, 800, 1100, 450, 300],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: 'y' as const, // Horizontal Bar Chart
    animation: {
      duration: 2500,
      delay: (context: any) => context.dataIndex * 200, // Staggered animation
      easing: 'easeOutElastic' as const,
    },
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      title: {
        display: true,
        text: 'Most Common Diagnoses',
      },
    },
  };

  if (loading) return <MLModelLoader />;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Disease & Epidemiology Trends</h1>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold mb-6">Top Diseases by Patient Volume</h3>
        <Bar options={options} data={data} />
      </div>
    </div>
  );
}
