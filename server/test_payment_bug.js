const axios = require('axios');

async function test() {
    try {
        const usr = "test_" + Date.now();
        await axios.post('http://localhost:5000/api/auth/register', { username: usr, email: `${usr}@test.com`, password: 'password123' });

        const log = await axios.post('http://localhost:5000/api/auth/login', { email: `${usr}@test.com`, password: 'password123' });
        const token = log.data.token;

        const prods = await axios.get('http://localhost:5000/api/products?limit=1');
        const validId = prods.data.products[0].id;

        console.log("Sending checkout payload with Token:", token.substring(0, 10) + "...");
        await axios.post('http://localhost:5000/api/payment/checkout', {
            items: [{ productId: validId, quantity: 1 }]
        }, { headers: { Authorization: `Bearer ${token}` } });

        console.log("SUCCESS");
    } catch (e) {
        console.log("FAILED WITH:");
        console.log(e.response ? e.response.data : e);
    }
}
test();
