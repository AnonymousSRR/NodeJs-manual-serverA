const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;
const { init, logMessage, logError, logException, requestHandler } = require('zipy-node-sdk');

// Initialize Zipy SDK
init('4cf11ce5');

// Add Zipy request handler middleware
app.use(requestHandler);
app.use(express.json()); // to handle JSON payloads

app.get('/test', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/data', {
            params: { fail: req.query.fail }
        });
        res.send(response.data);
    } catch (error) {
        res.status(500).send({ error: 'Error received from Server B', details: error.message });
    }
});

// Route to trigger errors on Server B
app.post('/trigger-error', async (req, res) => {
    try {
        const { errorType, unhandled } = req.body;
        const response = await axios.post('http://localhost:5000/error', {
            errorType,
            unhandled
        });
        res.send(response.data);
    } catch (error) {
        res.status(500).send({ error: 'Error received from Server B', details: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server A listening on http://localhost:${port}`);
});
