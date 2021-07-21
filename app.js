// Imports
const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const cors = require('cors');
const redis = require('redis');
const connectRedis = require('connect-redis');

// Constants
const TWO_HOURS = 1000 * 60 * 60 * 2;
const {
	PORT = 5000,
	NODE_ENV = 'development',
	SESSION_NAME = 'sid',
	SESSION_LIFETIME = TWO_HOURS,
	SESSION_SECRET = 'd47e3ac2-1fc5-4d99-9c55-de055d38e302'
} = process.env;
const IN_PROD = NODE_ENV === 'production';

// Initializations
const app = express();
const RedisStore = connectRedis(session);
const redisClient = redis.createClient();

// Middleware
app.use(morgan('dev'));
app.use(cors());
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

// Routes
app.post('/sign-up', (req, res) => {
	console.log(req.body);
});

app.post('/login', (req, res) => { });

// Start server
app.listen(PORT, () => console.log(`Homina server running on port ${PORT}...`));