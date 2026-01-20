// server/routes/proxy.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/', async(req, res) => {
    const { url, method, headers, body, params } = req.body;
    console.log(`Proxy Request: ${method} ${url}`);

    if (!url) return res.status(400).json({ error: 'URL is required' });

    // 1. Prepare Headers (Convert from Array [{key, value}] to Object {key: value})
    const headerObject = {};
    if (headers && Array.isArray(headers)) {
        headers.forEach(h => {
            if (h.key && h.isChecked) headerObject[h.key] = h.value;
        });
    }
    
    // 2. Prepare Query Params
    const paramsObject = {};
    if (params && typeof params === 'object') {
        Object.assign(paramsObject, params);
    }

    // Handle body parsing safely
    let requestData = undefined;
    if (body) {
        if (typeof body === 'string') {
            try {
                requestData = JSON.parse(body);
            } catch (e) {
                // If parsing fails, use the string as-is
                requestData = body;
            }
        } else {
            // If it's already an object or other type, use it directly
            requestData = body;
        }
    }

    try {
        const startTime = Date.now();

        // 2. Execute Request using Axios
        const response = await axios({
            method: method || 'GET',
            url,
            headers: headerObject,
            params: paramsObject,
            data: requestData,
            validateStatus: () => true, // IMPORTANT: Don't throw error on 404/500
            timeout: 10000 // 10s timeout
        });

        const endTime = Date.now();
        console.log(`Proxy Success: ${response.status} (${endTime - startTime}ms)`);

        // 3. Send Response back to Frontend
        res.json({
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
            data: response.data,
            time: endTime - startTime, // Calculate duration
            size: JSON.stringify(response.data).length // Rough size estimate
        });

    } catch (error) {
        console.error('Proxy Error:', error.message);
        // Handle Network Errors (DNS issues, timeout, etc.)
        res.json({
            status: 0,
            statusText: 'Network Error',
            data: { message: error.message },
            time: 0,
            size: 0
        });
    }
});

module.exports = router;