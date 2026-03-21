const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const API_URL = 'http://localhost:5000/api';
const prisma = new PrismaClient();

async function runTest() {
    try {
        console.log("1. Setting up Admin User directly in DB...");
        const adminEmail = "admin_test_product@test.com";
        let admin = await prisma.user.findUnique({ where: { email: adminEmail }});
        if (!admin) {
            await axios.post(`${API_URL}/auth/register`, {
                username: "Admin_Test",
                email: adminEmail,
                password: "password123"
            }).catch(e => {
                if(e.response && e.response.status === 400) return null; 
                throw e;
            });
            await prisma.user.update({
                where: { email: adminEmail },
                data: { role: 'ADMIN' }
            });
        }

        console.log("2. Logging in as Admin...");
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: adminEmail,
            password: "password123"
        });
        const token = loginRes.data.token;

        console.log("3. Creating a new product (Phase 1 fields)...");
        const createRes = await axios.post(`${API_URL}/products`, {
            productName: "Test RTX 4090",
            stock: 10,
            price: 1599.99,
            category: "Graphics Cards",
            platform: "PC",
            brand: "NVIDIA",
            performanceTags: ["4K Gaming", "Ray Tracing"],
            gamerRating: 9.8,
            compatibility: "PCIe 4.0",
            stockUrgency: "High",
            image: "rtx4090.jpg",
            description: "The ultimate GPU."
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const productId = createRes.data.id;
        console.log("   -> Created Product ID:", productId);

        console.log("4. Fetching Products (filtering by category Graphics Cards)...");
        const getRes = await axios.get(`${API_URL}/products?category=Graphics Cards`);
        console.log(`   -> Found ${getRes.data.products.length} products in category.`);

        console.log("5. Updating the Product...");
        const updateRes = await axios.put(`${API_URL}/products/${productId}`, {
            price: 1499.99,
            stockUrgency: "Medium"
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("   -> Updated Product Price:", updateRes.data.price);
        
        console.log("\n✅ ALL TESTS PASSED SUCCESSFULLY! ✅");

    } catch (error) {
        console.error("❌ Test Failed:");
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

runTest();
