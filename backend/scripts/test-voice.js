
const BASE_URL = 'http://localhost:8000';

async function simulateCall() {
    console.log("--- 1. Simulating INCOMING CALL ---");
    const incomingRes = await fetch(`${BASE_URL}/voice/incoming`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            'CallSid': 'CA123456789Mock'
        })
    });
    const incomingText = await incomingRes.text();
    console.log("RESPONSE (TwiML):\n", incomingText);

    console.log("\n--- 2. Simulating USER SPEECH: 'My name is Rahul' ---");
    const nameRes = await fetch(`${BASE_URL}/voice/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            'CallSid': 'CA123456789Mock',
            'SpeechResult': 'My name is Rahul'
        })
    });
    const nameText = await nameRes.text();
    console.log("RESPONSE (TwiML):\n", nameText);

    console.log("\n--- 3. Simulating USER SPEECH: 'I need a Heart Doctor' (Cardiology) ---");
    const deptRes = await fetch(`${BASE_URL}/voice/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            'CallSid': 'CA123456789Mock',
            'SpeechResult': 'I need a Heart Doctor'
        })
    });
    const deptText = await deptRes.text();
    console.log("RESPONSE (TwiML):\n", deptText);
    
    // Check for success message in TwiML
    if (deptText.includes("booking an appointment")) {
        console.log("\n✅ SUCCESS: Appointment logic triggered!");
    } else {
        console.log("\n❌ FAIL: Did not trigger booking.");
    }
}

simulateCall().catch(console.error);
