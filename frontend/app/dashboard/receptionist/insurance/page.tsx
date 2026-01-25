"use client";

import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { ShieldCheck, Search, Activity, FileText, CheckCircle, AlertTriangle, Plus, CreditCard, Clock } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function InsuranceDashboard() {
    const [activeTab, setActiveTab] = useState<'overview' | 'new-claim'>('overview');
    const [claims, setClaims] = useState<any[]>([]);

    // Form States
    const [policyNumber, setPolicyNumber] = useState('');
    const [verifyResult, setVerifyResult] = useState<any>(null);
    const [verifyLoading, setVerifyLoading] = useState(false);

    const [claimForm, setClaimForm] = useState({
        patientId: '',
        admissionId: '', // Optional
        estimatedCost: '',
        tpaId: 'TPA-001 (Star Health)'
    });
    const [claimLoading, setClaimLoading] = useState(false);

    useEffect(() => {
        fetchClaims();
    }, []);

    const fetchClaims = async () => {
        try {
            const res = await api.get('/insurance/claims');
            setClaims(res.data.data || []);
        } catch (error) {
            console.error(error);
        }
    };

    const verifyPolicy = async () => {
        if (!policyNumber) return toast.warning("Enter Policy Number");
        setVerifyLoading(true);
        try {
            const res = await api.post('/insurance/verify', {
                policyNumber,
                insuranceProvider: 'Star Health' // Mock
            });
            setVerifyResult(res.data.data);
            toast.success("Policy Verified Successfully");
        } catch (error: any) {
            setVerifyResult(null);
            toast.error(error.response?.data?.message || "Invalid Policy");
        } finally {
            setVerifyLoading(false);
        }
    };

    const submitClaim = async () => {
        if (!verifyResult?.valid) return toast.error("Please verify policy first");
        setClaimLoading(true);
        try {
            await api.post('/insurance/claims', {
                ...claimForm,
                insuranceProvider: 'Star Health',
                policyNumber,
                estimatedCost: parseFloat(claimForm.estimatedCost)
            });
            toast.success("Pre-Authorization Request Sent");
            fetchClaims();
            setActiveTab('overview');
            // Reset form
            setClaimForm({ patientId: '', admissionId: '', estimatedCost: '', tpaId: '' });
            setVerifyResult(null);
            setPolicyNumber('');
        } catch (error: any) {
            toast.error("Failed to initiate claim");
        } finally {
            setClaimLoading(false);
        }
    };

    return (
        <div className="space-y-8 pb-32">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <PageHeader title="Insurance & TPA" description="Manage cashless insurance claims and pre-authorizations." />

                <div className="flex gap-3">
                    <button
                        onClick={() => setActiveTab('new-claim')}
                        className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${activeTab === 'new-claim'
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                            }`}
                    >
                        <Plus size={18} /> New Pre-Auth
                    </button>
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${activeTab === 'overview'
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                            }`}
                    >
                        <Activity size={18} /> Overview
                    </button>
                </div>
            </div>

            {activeTab === 'new-claim' && (
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* 1. Policy Verification */}
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl space-y-6">
                        <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                            <ShieldCheck className="text-indigo-600" /> 1. Verify Policy
                        </h3>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Policy Number (Try: VALID-123)</label>
                                <input
                                    value={policyNumber}
                                    onChange={(e) => setPolicyNumber(e.target.value)}
                                    placeholder="Enter Policy Number..."
                                    className="w-full mt-2 p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100"
                                />
                            </div>
                            <button
                                onClick={verifyPolicy}
                                disabled={verifyLoading}
                                className="mt-6 px-6 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition-all flex items-center gap-2 disabled:opacity-50"
                            >
                                {verifyLoading ? <Activity size={18} className="animate-spin" /> : <Search size={18} />} Verify
                            </button>
                        </div>

                        {verifyResult && (
                            <div className="p-6 bg-emerald-50 rounded-[1.5rem] border border-emerald-100 animate-in fade-in slide-in-from-top-2">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-3 bg-white rounded-xl text-emerald-600 shadow-sm"><CheckCircle size={28} /></div>
                                    <div className="flex-1">
                                        <div className="font-black text-emerald-900 text-xl">Active Policy</div>
                                        <div className="text-emerald-700 text-sm font-bold opacity-80">Verification Successful</div>
                                    </div>
                                    <div className="px-4 py-2 bg-white rounded-lg border border-emerald-100 text-emerald-800 font-bold text-sm">
                                        Valid Upto: {verifyResult.validUpto}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="bg-white/60 p-4 rounded-2xl border border-emerald-100/50">
                                        <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-1">Policy Holder</div>
                                        <div className="text-emerald-900 font-bold text-lg truncate">{verifyResult.policyHolder || 'N/A'}</div>
                                    </div>
                                    <div className="bg-white/60 p-4 rounded-2xl border border-emerald-100/50">
                                        <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-1">Sum Insured</div>
                                        <div className="text-emerald-900 font-bold text-lg">₹{verifyResult.sumInsured?.toLocaleString()}</div>
                                    </div>
                                    <div className="bg-white/60 p-4 rounded-2xl border border-emerald-100/50">
                                        <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-1">Available Balance</div>
                                        <div className="text-emerald-900 font-bold text-lg">₹{verifyResult.balance?.toLocaleString()}</div>
                                    </div>
                                    <div className="bg-white/60 p-4 rounded-2xl border border-emerald-100/50">
                                        <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-1">Co-Pay</div>
                                        <div className="text-emerald-900 font-bold text-lg">{verifyResult.copay}%</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 2. Claim Details */}
                    {verifyResult?.valid && (
                        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl space-y-6 animate-in fade-in slide-in-from-bottom-4">
                            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                                <FileText className="text-indigo-600" /> 2. Claim Details
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Patient ID / UHID</label>
                                    <input
                                        value={claimForm.patientId}
                                        onChange={(e) => setClaimForm({ ...claimForm, patientId: e.target.value })}
                                        placeholder="Enter Patient ID (UUID)..."
                                        className="w-full mt-2 p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100"
                                    />
                                    <p className="text-[10px] text-slate-400 mt-1 ml-1">For demo, copy ID from Patient List</p>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Estimated Cost (₹)</label>
                                    <input
                                        type="number"
                                        value={claimForm.estimatedCost}
                                        onChange={(e) => setClaimForm({ ...claimForm, estimatedCost: e.target.value })}
                                        placeholder="e.g. 50000"
                                        className="w-full mt-2 p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={submitClaim}
                                disabled={claimLoading}
                                className="w-full py-4 bg-indigo-600 text-white font-black text-lg rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-[0.98] flex justify-center items-center gap-2"
                            >
                                {claimLoading ? <Activity className="animate-spin" /> : 'Submit for Pre-Authorization'}
                            </button>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {claims.map((claim) => (
                        <div key={claim.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl hover:shadow-2xl transition-all group">
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 bg-slate-50 text-slate-600 rounded-2xl group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                    <ShieldCheck size={24} />
                                </div>
                                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${claim.status === 'PRE_AUTH_APPROVED' ? 'bg-emerald-100 text-emerald-600' :
                                    claim.status === 'PRE_AUTH_REJECTED' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
                                    }`}>
                                    {claim.status.replace(/_/g, ' ')}
                                </div>
                            </div>

                            <div className="mb-6">
                                <h4 className="text-lg font-black text-slate-800">{claim.insuranceProvider}</h4>
                                <p className="text-xs font-bold text-slate-400">{claim.policyNumber}</p>
                            </div>

                            <div className="space-y-3 pt-6 border-t border-slate-100">
                                <div className="flex justify-between text-sm font-medium">
                                    <span className="text-slate-500">Estimated</span>
                                    <span className="font-bold text-slate-800">₹{parseFloat(claim.estimatedCost).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm font-medium">
                                    <span className="text-slate-500">Sanctioned</span>
                                    <span className={`font-bold ${parseFloat(claim.sanctionedAmount) > 0 ? 'text-emerald-600' : 'text-slate-400'}`}>
                                        ₹{parseFloat(claim.sanctionedAmount).toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm font-medium">
                                    <span className="text-slate-500">Date</span>
                                    <span className="font-bold text-slate-800">{new Date(claim.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>

                            {claim.status === 'PRE_AUTH_APPROVED' && (
                                <button className="w-full mt-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors text-xs uppercase tracking-wider">
                                    Request Enhancement
                                </button>
                            )}
                        </div>
                    ))}
                    {claims.length === 0 && (
                        <div className="col-span-full p-12 text-center text-slate-400 font-bold bg-slate-50 rounded-[2.5rem] border border-slate-100 border-dashed">
                            No Insurance Claims Found
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
