require('dotenv').config();
const express = require('express')
const app = express()
const port = 3000
const authRoutes = require('./routes/auth.routes');

app.use(express.json());
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('server is running')
})

app.listen(port, () => {
    console.log('server is running on port' + port)
})