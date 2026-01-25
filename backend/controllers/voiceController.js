import twilio from 'twilio';
import { ApiResponse } from '../utils/ApiResponse.js';
import prisma from '../config/db.js';

const VoiceResponse = twilio.twiml.VoiceResponse;

// State helper (In a real app, use Redis or DB. Here, we use a simple in-memory map for demo)
// Map<CallSid, { step: 'name' | 'dept' | 'time', name?: string, dept?: string }>
const callSessions = new Map();

// Helper to normalize department names from speech
const detectDepartment = (speech) => {
    const s = speech.toLowerCase();
    if (s.includes('heart') || s.includes('cardio')) return 'Cardiology';
    if (s.includes('skin') || s.includes('Derma')) return 'Dermatology';
    if (s.includes('bone') || s.includes('ortho')) return 'Orthopedics';
    if (s.includes('child') || s.includes('pedi')) return 'Pediatrics';
    if (s.includes('general') || s.includes('fever')) return 'General Medicine';
    return null;
};

export const handleIncomingCall = async (req, res) => {
    const twiml = new VoiceResponse();
    const callSid = req.body.CallSid;

    // Reset session
    callSessions.set(callSid, { step: 'name' });

    const gather = twiml.gather({
        input: 'speech',
        timeout: 3,
        action: '/voice/process',
        language: 'en-IN'
    });

    gather.say({ voice: 'alice' }, 
        "Welcome to MediFlow Hospital. I am your AI assistant. To book an appointment, please tell me your full name."
    );

    // If no input
    twiml.say("We didn't hear anything. Goodbye.");

    res.type('text/xml');
    res.send(twiml.toString());
};

export const processSpeech = async (req, res) => {
    const twiml = new VoiceResponse();
    const callSid = req.body.CallSid;
    const speechResult = req.body.SpeechResult;
    
    // Retrieve session
    const session = callSessions.get(callSid) || { step: 'name' };

    if (!speechResult) {
        twiml.say("I didn't catch that.");
        twiml.redirect('/voice/incoming'); // Restart or handle retry loop
        res.type('text/xml');
        return res.send(twiml.toString());
    }

    // STATE MACHINE
    switch (session.step) {
        case 'name':
            session.name = speechResult;
            session.step = 'dept';
            callSessions.set(callSid, session);

            const gatherDept = twiml.gather({
                input: 'speech',
                timeout: 3,
                action: '/voice/process',
                language: 'en-IN'
            });
            gatherDept.say({ voice: 'alice' }, 
                `Hello ${session.name}. Which department do you need? For example: Cardiology, Orthopedics, or General Medicine.`
            );
            break;

        case 'dept':
            const dept = detectDepartment(speechResult);
            if (!dept) {
                const retry = twiml.gather({ input: 'speech', timeout: 3, action: '/voice/process' });
                retry.say("Sorry, I didn't recognize that department. Please say Cardiology, Orthopedics, or General Medicine.");
                break;
            }

            session.dept = dept;
            session.step = 'confirm'; // Skipping 'time' for simplicity in this demo, defaulting to "Today" or just booking
            callSessions.set(callSid, session);

            // AUTO-BOOKING LOGIC (Mock)
            // In real app: Find doctor -> Create Appointment -> Return details
            // Here: Just Mock Success
            
            const doctorName = "Dr. " + (dept === 'Cardiology' ? 'Sharma' : 'Gupta');
            
            twiml.say({ voice: 'alice' }, 
                `Thank you. I am booking an appointment for ${session.name} in ${session.dept} with ${doctorName}.`
            );
            
            twiml.pause({ length: 1 });
            
            twiml.say({ voice: 'alice' }, 
                "Your appointment is confirmed for today at 4 PM. You will receive a WhatsApp confirmation shortly. Goodbye!"
            );
            
            // Cleanup
            callSessions.delete(callSid);
            twiml.hangup();
            break;

        default:
            twiml.say("Sorry, something went wrong. Goodbye.");
            twiml.hangup();
    }

    res.type('text/xml');
    res.send(twiml.toString());
};
