"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Activity,
  Users,
  Database,
  ArrowRight,
  CheckCircle2,
  Lock
} from 'lucide-react';

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 overflow-x-hidden selection:bg-indigo-500/30">

      {/* Navigation */}
      <nav className="fixed w-full z-50 top-0 left-0 border-b border-white/5 bg-[#0f172a]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-600/20">
              <ShieldCheck size={24} className="text-white" />
            </div>
            <span className="text-xl font-black tracking-tight text-white">
              MedCore <span className="text-indigo-400">HIS</span>
            </span>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="/login"
              className="hidden md:flex items-center gap-2 text-sm font-bold text-slate-300 hover:text-white transition-colors"
            >
              <Lock size={16} />
              Staff Portal
            </Link>
            <Link
              href="/login"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 flex items-center gap-2 group"
            >
              Login now
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
              v3.4.1 System Operational
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-5xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
              The Future of <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-blue-400">
                Clinical Intelligence
              </span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-lg text-slate-400 max-w-xl leading-relaxed">
              Streamline hospital operations, enhance patient care, and drive data-backed decisions with MedCore's enterprise-grade Hospital Information System.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/login"
                className="px-8 py-4 bg-white text-indigo-950 font-bold rounded-2xl hover:bg-slate-100 transition-colors shadow-xl shadow-white/5 flex items-center justify-center gap-2"
              >
                Access Dashboard
                <ArrowRight size={18} />
              </Link>
              <button className="px-8 py-4 bg-slate-800 text-white font-bold rounded-2xl border border-slate-700 hover:bg-slate-750 hover:border-slate-600 transition-all flex items-center justify-center gap-2">
                View Documentation
              </button>
            </motion.div>

            <motion.div variants={itemVariants} className="pt-8 border-t border-slate-800/50 grid grid-cols-3 gap-8 text-center sm:text-left">
              {[
                { label: 'Active Users', value: '4.2k+' },
                { label: 'Hospitals', value: '150+' },
                { label: 'Uptime', value: '99.9%' },
              ].map((stat, i) => (
                <div key={i}>
                  <div className="text-2xl font-black text-white">{stat.value}</div>
                  <div className="text-sm font-medium text-slate-500 uppercase tracking-wider mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Visual / Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-3xl bg-[#1e293b] border border-slate-700/50 shadow-2xl overflow-hidden aspect-4/3 group">
              <div className="absolute inset-x-0 top-0 h-10 bg-[#0f172a] border-b border-slate-700/50 flex items-center px-4 gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-slate-600"></div>
                  <div className="w-3 h-3 rounded-full bg-slate-600"></div>
                  <div className="w-3 h-3 rounded-full bg-slate-600"></div>
                </div>
                <div className="ml-4 h-5 px-3 rounded-full bg-slate-800 text-[10px] text-slate-400 flex items-center gap-2 font-mono w-64">
                  <Lock size={8} /> medcore-his.internal/dashboard
                </div>
              </div>

              {/* Abstract UI Representation */}
              <div className="p-6 grid grid-cols-12 gap-4 h-full opacity-60 group-hover:opacity-100 transition-opacity duration-500">
                <div className="col-span-3 h-full bg-slate-800/50 rounded-xl border border-slate-700/30"></div>
                <div className="col-span-9 space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1 h-32 bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
                      <Activity className="text-indigo-400 mb-2" size={20} />
                      <div className="h-2 w-12 bg-indigo-500/30 rounded mb-2"></div>
                      <div className="h-6 w-20 bg-indigo-500/40 rounded"></div>
                    </div>
                    <div className="flex-1 h-32 bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                      <Users className="text-blue-400 mb-2" size={20} />
                      <div className="h-2 w-12 bg-blue-500/30 rounded mb-2"></div>
                      <div className="h-6 w-20 bg-blue-500/40 rounded"></div>
                    </div>
                    <div className="flex-1 h-32 bg-slate-700/30 border border-slate-700/50 rounded-xl p-4">
                      <Database className="text-slate-400 mb-2" size={20} />
                    </div>
                  </div>
                  <div className="h-full bg-slate-800/30 rounded-xl border border-slate-700/30 p-4 space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-12 w-full bg-slate-700/20 rounded-lg"></div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-8 left-8 bg-slate-800/90 backdrop-blur border border-slate-700 p-4 rounded-2xl shadow-xl flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-bold uppercase">System Status</div>
                  <div className="text-sm font-bold text-white">All Systems Normal</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
