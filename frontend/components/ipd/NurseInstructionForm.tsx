"use client";

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, ListChecks, CheckCircle2, Clock, Utensils, Activity } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

interface NurseInstructionFormProps {
  admissionId: string;
}

export function NurseInstructionForm({ admissionId }: NurseInstructionFormProps) {
  const { register, handleSubmit, reset } = useForm();
  const [instructions, setInstructions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchInstructions = async () => {
    try {
      const res = await api.get(`/ipd/admissions/${admissionId}/care-plan`);
      setInstructions(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (admissionId) fetchInstructions();
  }, [admissionId]);

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      await api.post('/ipd/care-plan', {
        admissionId,
        ...data
      });
      toast.success("Nurse Instructions Added");
      reset();
      fetchInstructions();
    } catch (error) {
      toast.error("Failed to add instructions");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Form Side */}
      <Card className="border-slate-100 shadow-lg h-fit">
        <CardHeader className="bg-slate-50/50 pb-4 border-b border-slate-100">
          <CardTitle className="flex items-center gap-2 text-lg font-bold text-slate-800">
            <Plus className="text-indigo-600" /> Add Nurse Instructions
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Vitals Frequency</Label>
                <select {...register('vitalsFrequency', { required: true })} className="w-full p-2 rounded-lg border border-slate-200">
                  <option value="Q4H">Every 4 Hours (Q4H)</option>
                  <option value="Q6H">Every 6 Hours (Q6H)</option>
                  <option value="BID">Twice Daily (BID)</option>
                  <option value="OD">Once Daily (OD)</option>
                  <option value="Q1H">Hourly (Q1H - Critical)</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Diet Order</Label>
                <select {...register('dietType')} className="w-full p-2 rounded-lg border border-slate-200">
                  <option value="Normal">Normal Diet</option>
                  <option value="Soft">Soft Diet</option>
                  <option value="Liquid">Liquid Diet</option>
                  <option value="Diabetic">Diabetic Diet</option>
                  <option value="Renal">Renal Diet</option>
                  <option value="NBM">Nil By Mouth (NBM)</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Activity Level</Label>
              <select {...register('activityLevel')} className="w-full p-2 rounded-lg border border-slate-200">
                <option value="Bed Rest">Strict Bed Rest</option>
                <option value="Bathroom Privileges">Bathroom Privileges</option>
                <option value="Ambulatory">Ambulatory (Walking)</option>
                <option value="Physiotherapy">Physiotherapy Required</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Specific Instructions / Notes</Label>
              <Textarea
                {...register('vitalInstructions')}
                placeholder="E.g., Wake patient if BP < 90/60, Watch for fever spikes..."
                className="min-h-[100px]"
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-slate-900 hover:bg-slate-800">
              {loading ? 'Saving...' : 'Save Instructions'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* History Side */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-lg font-bold text-slate-800 mb-2">
          <ListChecks className="text-emerald-600" /> Active Care Plan History
        </div>

        {instructions.length === 0 ? (
          <div className="text-center p-8 border-2 border-dashed border-slate-200 rounded-xl text-slate-400">
            No instructions given yet.
          </div>
        ) : (
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {instructions.map((inst: any) => (
              <div key={inst.id} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm relative group overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>

                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                      DR
                    </div>
                    <div>
                      <div className="font-bold text-sm text-slate-800">{inst.doctor?.fullName || 'Doctor'}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">
                        {new Date(inst.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-green-50 text-green-700 text-[10px] font-bold uppercase rounded border border-green-100">
                    Active
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="bg-slate-50 p-2 rounded border border-slate-100">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase mb-1">
                      <Clock size={10} /> Vitals
                    </div>
                    <div className="text-sm font-bold text-slate-700">{inst.vitalsFrequency}</div>
                  </div>
                  <div className="bg-slate-50 p-2 rounded border border-slate-100">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase mb-1">
                      <Utensils size={10} /> Diet
                    </div>
                    <div className="text-sm font-bold text-slate-700">{inst.dietType}</div>
                  </div>
                  <div className="bg-slate-50 p-2 rounded border border-slate-100">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase mb-1">
                      <Activity size={10} /> Activity
                    </div>
                    <div className="text-sm font-bold text-slate-700">{inst.activityLevel || 'N/A'}</div>
                  </div>
                </div>

                {inst.vitalInstructions && (
                  <div className="text-sm text-slate-600 bg-yellow-50/50 p-3 rounded-lg border border-yellow-100 italic">
                    "{inst.vitalInstructions}"
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
