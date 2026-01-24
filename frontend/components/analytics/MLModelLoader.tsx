"use client";

import React from 'react';
import { DNA } from 'react-loader-spinner';

export default function MLModelLoader() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
      <DNA
        visible={true}
        height="100"
        width="100"
        ariaLabel="dna-loading"
        wrapperStyle={{}}
        wrapperClass="dna-wrapper"
      />
      <p className="text-slate-500 font-medium animate-pulse">Generating Graphs...</p>
    </div>
  );
}
