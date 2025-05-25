require('dotenv').config();

const express      = require('express');
const cors         = require('cors');
const path         = require('path');
const fs           = require('fs');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi    = require('swagger-ui-express');

const authRoutes   = require('./routes/auth');
const userRoutes   = require('./routes/user');
const adminRoutes  = require('./routes/admin');

const app = express();

// 1. CORS
app.use(cors());

// 2. Body Parser
app.use(express.json());

// 3. Fayllar uchun katalog borligini tekshir
const filesDir = path.join(__dirname, 'files');
if (!fs.existsSync(filesDir)) fs.mkdirSync(filesDir);


// 6. Routerlar
app.use('/files', express.static(filesDir));
app.use('/api/auth',  authRoutes);
app.use('/api/user',  userRoutes);
app.use('/api/admin', adminRoutes);
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ msg: 'Server Error', error: err.message });
});

// 8. Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
