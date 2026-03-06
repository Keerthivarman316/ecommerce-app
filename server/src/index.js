require('dotenv').config();
const express = require('express')
const cors = require('cors');
const app = express()
const port = 3000
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const orderRoutes = require('./routes/order.routes');
const cartRoutes = require('./routes/cart.routes');
const userRoutes = require('./routes/user.routes');
const paymentRoutes = require('./routes/payment.routes');
const errorHandler = require('./middleware/error.middleware');

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payment', paymentRoutes);
app.use(errorHandler);

app.get('/', (req, res) => {
    res.send('server is running')
})

app.listen(port, () => {
    console.log('server is running on port' + port)
})