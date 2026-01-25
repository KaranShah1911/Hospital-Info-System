import React, { useState } from 'react';
import { Activity, Thermometer, Heart, Wind, Gauge, ThumbsUp, Save } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';

interface VitalsFormProps {
  patientId: string;
  visitId: string;
  onSuccess?: () => void;
}

export function VitalsUpdateForm({ patientId, visitId, onSuccess }: VitalsFormProps) {
  const [loading, setLoading] = useState(false);
  const [vitals, setVitals] = useState({
    temperature: '',
    pulse: '',
    systolicBP: '',
    diastolicBP: '',
    respRate: '',
    spO2: '',
    painScore: '',
    notes: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setVitals({ ...vitals, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/clinical/vitals', {
        patientId,
        visitId,
        ...vitals
      });
      toast.success("Vitals recorded successfully!");
      setVitals({ temperature: '', pulse: '', systolicBP: '', diastolicBP: '', respRate: '', spO2: '', painScore: '', notes: '' });
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Vitals Error:", error);
      toast.error("Failed to save vitals.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-xl font-bold text-slate-700 flex items-center gap-2">
        <Activity className="text-rose-500" />
        Record Vitals
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-600 flex items-center gap-2">
            <Thermometer size={16} /> Temperature (°F)
          </label>
          <input type="number" step="0.1" name="temperature" value={vitals.temperature} onChange={handleChange} className="w-full p-3 border rounded-xl" placeholder="98.6" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-600 flex items-center gap-2">
            <Heart size={16} /> Heart Rate (bpm)
          </label>
          <input type="number" name="pulse" value={vitals.pulse} onChange={handleChange} className="w-full p-3 border rounded-xl" placeholder="72" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-600 flex items-center gap-2">
            <Gauge size={16} /> BP (mmHg)
          </label>
          <div className="flex gap-2">
            <input type="number" name="systolicBP" value={vitals.systolicBP} onChange={handleChange} className="w-1/2 p-3 border rounded-xl" placeholder="Sys (120)" />
            <span className="text-2xl text-slate-300">/</span>
            <input type="number" name="diastolicBP" value={vitals.diastolicBP} onChange={handleChange} className="w-1/2 p-3 border rounded-xl" placeholder="Dia (80)" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-600 flex items-center gap-2">
            <Wind size={16} /> Resp. Rate (bpm)
          </label>
          <input type="number" name="respRate" value={vitals.respRate} onChange={handleChange} className="w-full p-3 border rounded-xl" placeholder="18" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-600 flex items-center gap-2">
            <Activity size={16} /> SpO2 (%)
          </label>
          <input type="number" name="spO2" value={vitals.spO2} onChange={handleChange} className="w-full p-3 border rounded-xl" placeholder="98" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-600 flex items-center gap-2">
            <ThumbsUp size={16} /> Pain Score (1-10)
          </label>
          <input type="number" max="10" name="painScore" value={vitals.painScore} onChange={handleChange} className="w-full p-3 border rounded-xl" placeholder="0" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-600">Notes / Observations</label>
        <textarea name="notes" value={vitals.notes} onChange={handleChange} className="w-full p-3 border rounded-xl h-24" placeholder="Any additional observations..." />
      </div>

      <div className="flex justify-end">
        <button type="submit" disabled={loading} className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2 font-bold">
          <Save size={18} />
          {loading ? 'Saving...' : 'Save Vitals'}
        </button>
      </div>
    </form>
  );
}
