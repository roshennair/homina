// Imports
const express = require('express');
const path = require('path');
const session = require('express-session');
const morgan = require('morgan');
const redis = require('redis');
const connectRedis = require('connect-redis');
require('express-async-errors');
const authRouter = require('./routes/auth');

// Constants
const TWO_HOURS = 1000 * 60 * 60 * 2;
const {
	PORT = 5000,
	NODE_ENV = 'development',
	REDIS_URL = 'redis://localhost:6379/',
	SESSION_NAME = 'sid',
	SESSION_LIFETIME = TWO_HOURS,
	SESSION_SECRET = 'd47e3ac2-1fc5-4d99-9c55-de055d38e302',
} = process.env;
const IN_PROD = NODE_ENV === 'production';

// Initializations
const app = express();
app.set("trust proxy", 1);
const RedisStore = connectRedis(session);
const redisClient = redis.createClient(REDIS_URL);

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(session({
	name: SESSION_NAME,
	resave: false,
	saveUninitialized: false,
	secret: SESSION_SECRET,
	cookie: {
		maxAge: SESSION_LIFETIME,
		sameSite: true,
		secure: IN_PROD
	},
	store: new RedisStore({ client: redisClient })
}));
app.use(express.static(path.join(__dirname, '/client/build')));

// Mount authentication routes
app.use('/auth', authRouter);

// Serve client
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, '/client/build/index.html'));
});

// Start server
app.listen(PORT, () => console.log(`Homina server running on port ${PORT}...`));