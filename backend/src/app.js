require('dotenv').config();

// Validate required environment variables
const requiredEnv = ['DB_HOST', 'DB_USER', 'DB_NAME', 'JWT_SECRET'];
const missingEnv = requiredEnv.filter(env => !process.env[env]);
if (missingEnv.length > 0) {
    console.error(`Error: Missing required environment variables: ${missingEnv.join(', ')}`);
    process.exit(1);
}

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const { success } = require('./utils/response');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    message: { success: false, message: 'Too many requests, please try again later.' }
});
app.use(limiter);

app.get('/', (req, res) => {
    success(res, {
        service: 'Perpustakaan Digital Backend',
        status: 'Active'
    });
});

app.use('/api', routes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});