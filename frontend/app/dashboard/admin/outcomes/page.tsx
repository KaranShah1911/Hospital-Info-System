"use client";

import { Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

import { useState, useEffect } from 'react';
import MLModelLoader from "@/components/analytics/MLModelLoader";

export default function PatientOutcomesPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Outcome Distribution (Pie Chart)
  const outcomeData = {
    labels: ['Recovered', 'Deceased', 'Referral Out', 'Ongoing Treatment'],
    datasets: [
      {
        label: 'Patients',
        data: [850, 45, 120, 200],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)', // Green
          'rgba(255, 99, 132, 0.6)', // Red
          'rgba(255, 206, 86, 0.6)', // Yellow
          'rgba(54, 162, 235, 0.6)', // Blue
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(54, 162, 235, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Critical Care Survival (Doughnut)
  const icuData = {
    labels: ['Survived', 'Deceased'],
    datasets: [
      {
        label: 'ICU Cases',
        data: [320, 35],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
        borderWidth: 1,
      },
    ],
  };

  if (loading) return <MLModelLoader />;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Patient Outcomes & Mortality Analysis</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Overall Outcomes */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center">
          <h3 className="text-lg font-bold mb-4">Overall Patient Outcomes (Annual)</h3>
          <div className="w-full max-w-md">
            <Pie data={outcomeData} options={{ animation: { animateRotate: true, animateScale: true, duration: 2000 } }} />
          </div>
          <p className="mt-4 text-sm text-slate-500">Recovery Rate: ~70%</p>
        </div>

        {/* ICU Stats */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center">
          <h3 className="text-lg font-bold mb-4">ICU Survival Rate</h3>
          <div className="w-full max-w-md">
            <Doughnut data={icuData} options={{ animation: { animateRotate: true, animateScale: true, duration: 2500 } }} />
          </div>
          <p className="mt-4 text-sm text-slate-500">Survival Rate: ~90%</p>
        </div>
      </div>
    </div>
  );
}
