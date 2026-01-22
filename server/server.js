// server/server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const dbconnect = require('./config/dbconnect');
const Request = require('./models/request');
const auth = require('./middleware/auth'); // NEW

const app = express();
const server = http.createServer(app);
const proxyRouter = require('./routers/proxy');
const workspacesRouter = require('./routes/workspaces');
const requestsRouter = require('./routes/requests');
const authRouter = require('./routes/auth'); // NEW

// Middleware
app.use(cors());
app.use(express.json());

// Socket.io Setup
const io = new Server(server, {
    cors: {
        origin: "*", // We will change this to our React URL later for security
        methods: ["GET", "POST"]
    }
});

// Global variable to store active timeouts
// structure: { requestId: timeoutID }
const writeBuffer = {}; 

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // JOIN ROOM
    socket.on('JOIN_ROOM', (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
    });

    // LEAVE ROOM
    socket.on('LEAVE_ROOM', (roomId) => {
        socket.leave(roomId);
        console.log(`User ${socket.id} left room ${roomId}`);
    });

    socket.on('UPDATE_REQUEST', async (data) => {
        const { roomId, field, value } = data; // roomId IS the requestId

        // 1. Broadcast to others (Real-time speed)
        // Broadcast to everyone in the room EXCEPT the sender
        if (roomId) {
             socket.to(roomId).emit('REQUEST_UPDATED', { field, value });
        }

        // 2. The "Auto-Save" Logic (Database safety)
        // If there is already a pending save for this request, CANCEL it.
        if (writeBuffer[roomId]) {
            clearTimeout(writeBuffer[roomId]);
        }

        // Set a new timer. We will only save if no one types for 2 seconds.
        writeBuffer[roomId] = setTimeout(async () => {
            try {
                console.log(`💾 Auto-Saving Request: ${roomId}`);
                
                // Dynamic update: { [field]: value } -> e.g., { bodyContent: '...' }
                // Important: Ensure we don't accidentally wipe other fields if data is partial
                // For nested fields (like headers), complex logic might be needed, 
                // but for simple fields this works.
                // NOTE: 'value' must match the schema structure.
                
                await Request.findByIdAndUpdate(roomId, { [field]: value });
                
                // Notify room that changes are saved
                io.to(roomId).emit('SAVE_STATUS', { status: 'saved' });
                
                delete writeBuffer[roomId]; // Cleanup
            } catch (err) {
                console.error('Auto-save failed:', err);
            }
        }, 2000); // 2 Second Delay
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Basic Route
app.get('/', (req, res) => {
    res.send('API Collab Server is running');
});
// Proxy Route
app.use('/api/proxy', auth, proxyRouter);
app.use('/api/workspaces', workspacesRouter);
app.use('/api/requests', requestsRouter);
app.use('/api/auth', authRouter);

dbconnect.connectDB().then(() => {
    // Start Server
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});