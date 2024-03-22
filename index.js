const express = require('express');
const axios = require('axios');
const cors = require('cors')

const app = express();

app.use(express.json());
app.use(cors());

app.get('/api/onchain-data', async (req,res) => {
    const { address, chain } = req.query;
    console.log(chain)
    try {
        let responseData;
        if (chain === 'mode') {
            responseData = await fetchModeData(address);
        } else if (chain === 'berachain') {
            responseData = await fetchBerachainData(address);
        } else if (chain === 'taiko') {
            responseData = await fetchTaikoData(address);
        } else {
            // Invalid chain parameter
            return res.status(400).json({ error: 'Invalid chain parameter' });
        }
        res.json(responseData);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const fetchModeData = async (address) => {
    try {
        const response = await axios.get(`https://explorer.mode.network/api/v2/addresses/${address}/counters`);  
        return response.data;     //0xc1ff3e6E2f1c5c0666Dd171d72bDA9d26b1D1f30
    } catch (error) {
        console.log(error);
    }
}


const fetchBerachainData = async (address) => {
    try {
        
        const response = await axios.get(`https://api.routescan.io/v2/network/mainnet/evm/43114/addresses/${address}?limit=25`);
        
        return response.data;
    } catch (error) {
        console.log(error);
        throw new Error('Error fetching berachain data');
    }
}

const fetchTaikoData = async (address) => {
try {
    const response = await axios.get(`https://api.routescan.io/v2/network/testnet/evm/all/addresses/${address}?limit=25`)
    return response.data;  //0xb95eCE29428F33D05469Bd34E74cA9EDB1B512ee
    
} catch (error) {
    console.log(error);
}
}


app.listen(5000, ()=>{
    console.log('server is listening on port 5000!');
})

module.exports = app;