const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/', async(req, res) => {

    const { url, method, body, headers } = req.body;

    // valdation on the url
    if (!url || typeof url !== 'string') {
        return res.status(400).json({ error: 'Invalid URL' });
    }
    //conversion headers to object
    const headerObj = {};
    if (headers && Array.isArray(headers)) {
        headers.forEach(header => {
            if (header.key && header.value) {
                headerObj[header.key] = header.value;
            }
        });
    }
    try {
        const startTime = Date.now();
        //make a request to the url with method, data, headers
        const response = await axios({
            url,
            method: method || 'GET',
            data: body ? JSON.parse(body) : undefined,
            headers: headerObj,
            validateStatus: () => true // Accept all status codes

        });
        const endTime = Date.now();
        const responseTime = endTime - startTime;

        res.json({
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
            data: response.data,
            responseTime,
            size: response.headers['content-length'] || null
        })
    } catch (error) {
        res.status(500).json({ error: 'Error making request', details: error.message });
        console.error('Proxy request failed:', error);
    }

});
module.exports = router;