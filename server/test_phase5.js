const axios = require('axios');

async function testPhase5() {
    try {
        console.log("1. Logging in as Admin...");
        let res = await axios.post('http://localhost:3000/api/auth/login', {
            email: 'admin2@example.com',
            password: 'adminpass123'
        });
        const token = res.data.token;
        console.log("Admin Token Received:", token.substring(0, 15) + "...");

        console.log("\n2. Testing GET /api/users (Admin only)...");
        res = await axios.get('http://localhost:3000/api/users', {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Users Found:", res.data.length);
        console.log(res.data.map(u => ({ id: u.id, email: u.email, role: u.role })));

        console.log("\n3. Testing GET /api/orders/all (Admin only)...");
        res = await axios.get('http://localhost:3000/api/orders/all', {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Orders Found:", res.data.length);

        console.log("\n4. Testing GET /api/users/profile...");
        res = await axios.get('http://localhost:3000/api/users/profile', {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Profile Data:", res.data.username, "-", res.data.email);

    } catch (err) {
        if (err.response) {
            console.error("\nTEST FAILED with status", err.response.status);
            console.error(err.response.data);
        } else {
            console.error("\nTEST FAILED with error:", err.message);
        }
    }
}

testPhase5();
