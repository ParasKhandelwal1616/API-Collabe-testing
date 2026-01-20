import { io } from 'socket.io-client';
import { setUrl, setMethod, setBodyContent, updateHeader, setSaveStatus } from '../features/request/requestSlice';

let socket;

export const socketMiddleware = (store) => (next) => (action) => {
    // 1. Initialize Socket on First Load
    if (!socket) {
        socket = io('http://localhost:5000');

        // Listen for incoming changes from OTHER users
        socket.on('REQUEST_UPDATED', (payload) => {
            // payload = { field: 'url', value: '...' }
            console.log('Received Update:', payload);

            // Dispatch action but mark it as "isRemote" to avoid infinite loop
            // We will handle the "isRemote" check in the next step
            if (payload.field === 'url') store.dispatch(setUrl({ value: payload.value, isRemote: true }));
            if (payload.field === 'method') store.dispatch(setMethod({ value: payload.value, isRemote: true }));
            if (payload.field === 'bodyContent') store.dispatch(setBodyContent({ value: payload.value, isRemote: true }));
        });

        // Listen for SAVE_STATUS
        socket.on('SAVE_STATUS', (data) => {
            store.dispatch(setSaveStatus(data.status));
        });
    }

    // NEW: Listen for Room Switching
    if (action.type === 'request/setActiveRequestId') {
        const newRequestId = action.payload;
        const oldRequestId = store.getState().request.activeRequestId;

        if (oldRequestId) {
            socket.emit('LEAVE_ROOM', oldRequestId);
        }
        
        socket.emit('JOIN_ROOM', newRequestId);
    }

    // 2. Filter: Only emit if the action is NOT from a remote user
    const isRemote = action.payload?.isRemote;
    const currentRequestId = store.getState().request.activeRequestId;

    // 3. Emit Events based on Action Type
    if (!isRemote && currentRequestId) {
        if (action.type === 'request/setUrl') {
            socket.emit('UPDATE_REQUEST', { roomId: currentRequestId, field: 'url', value: action.payload });
        }
        if (action.type === 'request/setMethod') {
            socket.emit('UPDATE_REQUEST', { roomId: currentRequestId, field: 'method', value: action.payload });
        }
        if (action.type === 'request/setBodyContent') {
            socket.emit('UPDATE_REQUEST', { roomId: currentRequestId, field: 'bodyContent', value: action.payload });
        }
        // Add headers logic here similarly...
    }

    // 4. Strip the 'isRemote' flag before passing to Redux Reducer 
    if (isRemote) {
        // If it came from remote, we wrapped it in { value: ..., isRemote: true }
        // We need to unwrap it so the reducer gets the raw value
        action.payload = action.payload.value;
    }

    return next(action);
};