// Download the helper library from https://www.twilio.com/docs/node/install
import twilio from "twilio"; // Or, for ESM: import twilio from "twilio";
import dotenv from "dotenv";
import { ApiResponse } from "../utils/ApiResponse.js";
dotenv.config();

// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
export const createMessage = async (message) => {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = twilio(accountSid, authToken);
    client.messages
        .create({
            body: message,
            from: '+18153966672',
            to: '+919594457157'
        })
        .then(message => {
            console.log(message.sid);
            return message.sid;
        })
        .catch(err => console.error("Twilio Error:", err));
}

export const createWhatsappMessage = async (message) => {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = twilio(accountSid, authToken);
    return client.messages
        .create({
            from: 'whatsapp:+14155238886',
            contentSid: 'HXb5b62575e6e4ff6129ad7c8efe1f983e',
            contentVariables: JSON.stringify({ "1": message , "2" : "Notion hospital"} ),
            to: 'whatsapp:+919594457157'
        })
        .then(message => {
            console.log(message.sid);
            return message.sid;
        })
        .catch(err => console.error("Twilio WhatsApp Error:", err));
}

