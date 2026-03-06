const axios = require('axios');
const API_URL = 'http://localhost:3000/api';

async function runTest() {
    try {
        console.log("1. Registering Admin...");
        const registerToken = await axios.post(`${API_URL}/auth/register`, {
            username: "API_Tester_" + Date.now(),
            email: `tester_${Date.now()}@test.com`,
            password: "password123"
        }).catch(e => {
            if(e.response && e.response.status === 400) return null; 
            throw e;
        });

        console.log("2. Logging in...");
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: registerToken ? registerToken.data.user.email : 'tester@test.com',
            password: "password123"
        });
        const token = loginRes.data.token;

        console.log("3. Adding item to cart...");
        try {
            await axios.post(`${API_URL}/cart/items`, {
                productId: "1", 
                quantity: 1
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("   -> Item added to cart.");
        } catch (error) {
           console.log("   -> Cart addition failed. Product likely doesn't exist yet.");
           return;
        }

        console.log("4. Triggering Checkout...");
        const checkoutRes = await axios.post(`${API_URL}/payment/checkout`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log("   -> SUCCESS:", checkoutRes.data);
        
    } catch (error) {
        console.error("Test Failed:", error.response ? error.response.data : error.message);
    }
}

runTest();
