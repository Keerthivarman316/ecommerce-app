const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const images = {
    gpu: "https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=800&auto=format&fit=crop",
    cpu: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=800&auto=format&fit=crop",
    ram: "https://images.unsplash.com/photo-1562976540-1502f7454226?q=80&w=800&auto=format&fit=crop",
    motherboard: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop",
    monitor: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=800&auto=format&fit=crop",
    mouse: "https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=800&auto=format&fit=crop",
    keyboard: "https://images.unsplash.com/photo-1595044426077-d36d9236d54a?q=80&w=800&auto=format&fit=crop",
    headset: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=800&auto=format&fit=crop",
    case: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=800&auto=format&fit=crop",
    psu: "https://images.unsplash.com/photo-1580522154071-c6ca47a859ad?q=80&w=800&auto=format&fit=crop",
    chair: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?q=80&w=800&auto=format&fit=crop"
};

const productTemplates = [
    // GPUs
    { base: "NVIDIA GeForce RTX 4090", brand: "NVIDIA", category: "GPU", price: 165000, img: images.gpu },
    { base: "NVIDIA GeForce RTX 4080 Super", brand: "NVIDIA", category: "GPU", price: 95000, img: images.gpu },
    { base: "AMD Radeon RX 7900 XTX", brand: "AMD", category: "GPU", price: 90000, img: images.gpu },
    { base: "AMD Radeon RX 7800 XT", brand: "AMD", category: "GPU", price: 48000, img: images.gpu },
    // CPUs
    { base: "Intel Core i9-14900K", brand: "Intel", category: "CPU", price: 54000, img: images.cpu },
    { base: "Intel Core i7-14700K", brand: "Intel", category: "CPU", price: 38000, img: images.cpu },
    { base: "AMD Ryzen 9 7950X3D", brand: "AMD", category: "CPU", price: 62000, img: images.cpu },
    { base: "AMD Ryzen 7 7800X3D", brand: "AMD", category: "CPU", price: 36000, img: images.cpu },
    // RAM
    { base: "Corsair Dominator Titanium DDR5", brand: "Corsair", category: "RAM", price: 22000, img: images.ram },
    { base: "G.Skill Trident Z5 RGB DDR5", brand: "G.Skill", category: "RAM", price: 18000, img: images.ram },
    // Motherboards
    { base: "ASUS ROG Maximus Z790 Hero", brand: "ASUS", category: "Motherboard", price: 55000, img: images.motherboard },
    { base: "MSI MPG B650 Carbon WiFi", brand: "MSI", category: "Motherboard", price: 28000, img: images.motherboard },
    { base: "Gigabyte X670E AORUS Master", brand: "Gigabyte", category: "Motherboard", price: 45000, img: images.motherboard },
    // Storage
    { base: "Samsung 990 PRO NVMe M.2 SSD", brand: "Samsung", category: "Storage", price: 16000, img: images.ram },
    { base: "WD Black SN850X NVMe SSD", brand: "WD", category: "Storage", price: 14500, img: images.ram },
    // Cases
    { base: "Lian Li O11 Dynamic EVO", brand: "Lian Li", category: "Case", price: 16500, img: images.case },
    { base: "Fractal Design North", brand: "Fractal", category: "Case", price: 13500, img: images.case },
    { base: "NZXT H9 Flow", brand: "NZXT", category: "Case", price: 15000, img: images.case },
    // PSUs
    { base: "Corsair RM1000x Shift 80 PLUS Gold", brand: "Corsair", category: "PSU", price: 18500, img: images.psu },
    { base: "Seasonic Vertex GX-1200", brand: "Seasonic", category: "PSU", price: 24000, img: images.psu },
    // Monitors
    { base: "ASUS ROG Swift OLED PG27AQDM", brand: "ASUS", category: "Monitor", price: 85000, img: images.monitor },
    { base: "Alienware AW3423DWF QD-OLED", brand: "Alienware", category: "Monitor", price: 95000, img: images.monitor },
    { base: "LG UltraGear 27GR95QE-B", brand: "LG", category: "Monitor", price: 78000, img: images.monitor },
    // Mice
    { base: "Razer DeathAdder V3 Pro", brand: "Razer", category: "Mouse", price: 12500, img: images.mouse },
    { base: "Logitech G Pro X Superlight 2", brand: "Logitech", category: "Mouse", price: 14000, img: images.mouse },
    { base: "Finalmouse UltralightX", brand: "Finalmouse", category: "Mouse", price: 18000, img: images.mouse },
    // Keyboards
    { base: "Wooting 60HE+", brand: "Wooting", category: "Keyboard", price: 16000, img: images.keyboard },
    { base: "Keychron Q1 Pro Wireless", brand: "Keychron", category: "Keyboard", price: 18500, img: images.keyboard },
    { base: "SteelSeries Apex Pro TKL", brand: "SteelSeries", category: "Keyboard", price: 17000, img: images.keyboard },
    // Headsets & Audio
    { base: "SteelSeries Arctis Nova Pro Wireless", brand: "SteelSeries", category: "Audio", price: 32000, img: images.headset },
    { base: "Audeze Maxwell", brand: "Audeze", category: "Audio", price: 29000, img: images.headset },
    { base: "Shure SM7B Dynamic Microphone", brand: "Shure", category: "Audio", price: 35000, img: images.case },
    // Chairs
    { base: "Secretlab TITAN Evo", brand: "Secretlab", category: "Furniture", price: 45000, img: images.chair },
    { base: "Herman Miller Embody Gaming", brand: "Herman Miller", category: "Furniture", price: 145000, img: images.chair },
];

const variants = ["Standard Edition", "Elite Pro Setup", "Creators Focus", "Esports Ready"];
const tagsPool = ["RGB", "Wireless", "Next-Gen", "High Performance", "Ultra-Low Latency", "OLED", "Mechanical", "Ergonomic"];

const getRandomTags = () => {
    let result = [];
    let count = Math.floor(Math.random() * 3) + 2; // 2 to 4 tags
    while (result.length < count) {
        let tag = tagsPool[Math.floor(Math.random() * tagsPool.length)];
        if (!result.includes(tag)) result.push(tag);
    }
    return result;
};

async function seed() {
    try {
        console.log("Cleaning up existing products...");
        await prisma.product.deleteMany({});
        console.log("Database cleared. Seeding 100+ items...");

        const productsToCreate = [];

        // Generate exactly 102 items (34 base products * 3 variants array sizes)
        for (const template of productTemplates) {

            // Generate 3 variations for each template
            for (let i = 0; i < 3; i++) {

                let specificName = `${template.base}`;
                let priceMultiplier = 1;

                if (i === 1) {
                    specificName += " (Pro Edition)";
                    priceMultiplier = 1.15;
                } else if (i === 2) {
                    specificName += " (White/RGB Edition)";
                    priceMultiplier = 1.05;
                }

                productsToCreate.push({
                    productName: specificName,
                    price: Math.round(template.price * priceMultiplier),
                    stock: Math.floor(Math.random() * 50) + 5,
                    category: template.category,
                    platform: "PC",
                    brand: template.brand,
                    description: `Experience uncompromising quality with the ${specificName}. Designed by ${template.brand} for the absolute best performance in ${template.category}. It incorporates the latest advancements to give you the competitive edge in every lobby. Level up your setup today.`,
                    performanceTags: getRandomTags(),
                    gamerRating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)), // Float parsing required for Prisma schema
                    compatibility: template.category === "CPU" || template.category === "Motherboard" ? "Check Socket Compatibility" : "Universal",
                    stockUrgency: i === 1 ? "Only a few left!" : null,
                    image: template.img
                });
            }
        }

        // We have 34 templates * 3 = 102 products!
        const result = await prisma.product.createMany({
            data: productsToCreate
        });

        console.log(`Successfully inserted ${result.count} products into the database! 🚀`);

    } catch (e) {
        console.error("Seeding failed:", e);
    } finally {
        await prisma.$disconnect();
    }
}

seed();
