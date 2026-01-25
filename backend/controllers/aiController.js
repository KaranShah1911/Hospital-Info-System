import prisma from "../config/db.js";

export async function calculateHolisticScore(req, res) {
  try {
    const { patientId } = req.body;

    if (!patientId) {
      return res.status(400).json({ success: false, message: "Patient ID is required" });
    }

    // 1. FETCH EVERYTHING (The 360 Query)
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
      include: {
        medicalHistory: true,
        admissions: {
          where: { status: 'Admitted' },
          include: {
            surgeries: true,
            patientVitals: {
              orderBy: { recordedAt: 'desc' },
              take: 1
            },
            serviceOrders: {
              where: { orderType: 'Lab', status: 'ResultAvailable' },
              include: { labResults: true },
              orderBy: { orderDate: 'desc' },
              take: 5
            }
          }
        },
        opdVisits: {
          where: {
            visitType: 'Emergency',
            visitDate: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
          }
        }
      }
    });

    if (!patient) return res.status(404).json({ success: false, message: "Patient not found" });

    // --- SCORE CALCULATION ---
    let breakdown = { vitals: 0, surgery: 0, labs: 0, history: 0, visits: 0 };

    // 1. VITALS DEDUCTIONS
    const latestVitals = patient.admissions[0]?.patientVitals[0];
    if (latestVitals) {
      if (latestVitals.spO2 < 92) breakdown.vitals += 15;
      if (latestVitals.respRate > 25 || latestVitals.respRate < 8) breakdown.vitals += 15;
      if (latestVitals.systolicBP < 90) breakdown.vitals += 10;
      if (latestVitals.pulse > 130) breakdown.vitals += 10;
    }

    // 2. SURGERY DEDUCTIONS
    const currentAdmission = patient.admissions[0];
    if (currentAdmission?.surgeries.length > 0) {
      const recentSurgery = currentAdmission.surgeries[0];
      const hoursSince = (Date.now() - new Date(recentSurgery.surgeryDate).getTime()) / 36e5;
      if (hoursSince < 24) breakdown.surgery += 15;
      else if (hoursSince < 72) breakdown.surgery += 10;
    }

    // 3. LABS DEDUCTIONS
    currentAdmission?.serviceOrders.forEach(order => {
      order.labResults.forEach(res => {
        if (res.testName.includes("Hemoglobin") && parseFloat(res.resultValue) < 8) breakdown.labs += 10;
        if (res.testName.includes("WBC") && parseFloat(res.resultValue) > 15000) breakdown.labs += 10;
      });
    });

    // 4. HISTORY DEDUCTIONS
    const age = new Date().getFullYear() - new Date(patient.dob).getFullYear();
    if (age > 80) breakdown.history += 10;
    else if (age > 65) breakdown.history += 5;

    const highRisk = ['Heart Failure', 'COPD', 'Kidney Failure'];
    patient.medicalHistory.forEach(h => {
      if (highRisk.some(r => h.name.includes(r))) breakdown.history += 6;
      else breakdown.history += 3;
    });

    // 5. VISITS DEDUCTIONS
    if (patient.opdVisits.length > 3) breakdown.visits += 10;

    // --- FINAL TALLY ---
    const totalDeduction = Object.values(breakdown).reduce((a, b) => a + b, 0);
    const finalScore = Math.max(0, 100 - totalDeduction);

    let riskLevel = "Stable";
    if (finalScore < 50) riskLevel = "Critical";
    else if (finalScore < 75) riskLevel = "Moderate";

    // --- GENERATE SUGGESTIONS (Deterministic Logic) ---
    // We generate clinical advice based on *where* the points were lost.
    const generatedSuggestions = [];
    let reasoning = "Patient is clinically stable.";

    if (breakdown.vitals > 0) {
      generatedSuggestions.push("Monitor vitals q1h: Focus on SpO2 and BP stability.");
      reasoning = "Score reduced primarily due to unstable vital signs.";
    }
    if (breakdown.surgery > 0) {
      generatedSuggestions.push("Maintain strict Post-Op recovery protocols and pain management.");
      if (reasoning === "Patient is clinically stable.") reasoning = "Score reflects expected post-surgical stress.";
    }
    if (breakdown.labs > 0) {
      generatedSuggestions.push("Review critical lab results (Hgb/WBC) and consider repeat testing.");
    }
    if (breakdown.history > 5) {
      generatedSuggestions.push("Consult specialist for management of chronic comorbidities.");
    }
    if (breakdown.visits > 0) {
      generatedSuggestions.push("Evaluate social support systems to prevent readmission.");
    }
    
    // Fill with defaults if stable
    if (generatedSuggestions.length === 0) {
      generatedSuggestions.push("Continue routine monitoring.");
      generatedSuggestions.push("Encourage mobilization as tolerated.");
      generatedSuggestions.push("Plan for discharge if stability continues.");
    }

    // Limit to top 3 suggestions
    const top3Suggestions = generatedSuggestions.slice(0, 3);

    // --- SAVE TO DATABASE ---
    // const savedRecord = await prisma.patientHealthScore.create({
    //   data: {
    //     patientId: patient.id,
    //     score: finalScore,
    //     riskLevel: riskLevel,
    //     reasoning: reasoning,
    //     suggestions: top3Suggestions,
    //     breakdown: breakdown // Saving the JSON breakdown
    //   }
    // });

    // --- RETURN RESPONSE ---
    res.status(200).json({ 
      success: true, 
      data: {
        score: finalScore,
        riskLevel: riskLevel,
        reasoning: reasoning,
        suggestions: top3Suggestions,
        breakdown: breakdown // Saving the JSON breakdown
      }
    });

  } catch (error) {
    console.error("Health Score Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}