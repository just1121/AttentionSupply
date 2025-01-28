const axios = require('axios');
require('dotenv').config(); // Ensure you can access your .env variables

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY; // Your Alchemy API key

async function getLatestBlock() {
    try {
        const response = await axios.post(`https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`, {
            id: 1,
            jsonrpc: "2.0",
            method: "eth_getBlockByNumber",
            params: [
                "finalized",
                false
            ]
        }, {
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json'
            }
        });

        console.log(response.data); // Log the response data
    } catch (error) {
        console.error("Error fetching block:", error);
    }
}

getLatestBlock();