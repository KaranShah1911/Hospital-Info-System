import { Server } from "socket.io";

export const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:5000"], // Adjust based on frontend port
            methods: ["GET", "POST"]
        }
    });

    console.log("Socket.io initialized");

    io.on("connection", (socket) => {
        console.log(`User Connected: ${socket.id}`);

        // Join Room based on Role or User ID
        socket.on("join_room", (room) => {
            socket.join(room);
            console.log(`User ${socket.id} joined room: ${room}`);
        });

        // 1. EMERGENCY INITIATED (From Receptionist)
        // Payload: { patientId, traumaType, severity, ... }
        socket.on("EMERGENCY_INITIATED", (data) => {
            console.log("EMERGENCY_INITIATED received:", data);

            // Broadcast to all OT Managers
            // Frontend OT Managers should join room 'role:OTManager'
            io.to("role:OTManager").emit("EMERGENCY_INITIATED", data);

            // Also broadcast to global emergency channel if needed
            socket.broadcast.emit("GLOBAL_EMERGENCY_ALERT", data);
        });

        // 2. OT ASSIGNED (From OT Manager)
        // Payload: { surgeryId, otRoom, teamMembers: [{ id, role, name }] }
        socket.on("OT_ASSIGNED", (data) => {
            console.log("OT_ASSIGNED received:", JSON.stringify(data, null, 2));

            // Broadcast to ALL users - client side will filter based on ID
            // This ensures that if the socket room join failed, they still get it if connected
            io.emit("SURGERY_ALERT", {
                title: "EMERGENCY: OT ASSIGNED",
                message: `Urgent: You have been assigned to ${data.otRoom} for ${data.patientName}.`,
                ...data
            });

            // Also update OT Managers that assignment is done
            io.to("role:OTManager").emit("OT_ASSIGNMENT_COMPLETE", data);
        });

        socket.on("disconnect", () => {
            console.log("User Disconnected", socket.id);
        });
    });

    return io;
};
