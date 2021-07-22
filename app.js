// Imports
const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const cors = require('cors');
const redis = require('redis');
const connectRedis = require('connect-redis');
const bcrypt = require('bcrypt');
require('express-async-errors');

// Constants
const TWO_HOURS = 1000 * 60 * 60 * 2;
const {
	PORT = 5000,
	NODE_ENV = 'development',
	SESSION_NAME = 'sid',
	SESSION_LIFETIME = TWO_HOURS,
	SESSION_SECRET = 'd47e3ac2-1fc5-4d99-9c55-de055d38e302',
	SALT_ROUNDS = 10
} = process.env;
const IN_PROD = NODE_ENV === 'production';
const users = []; // TODO: Replace with DB

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
app.post('/signup', async (req, res) => {
	const { name, email, username, password } = req.body;


	if (name && email && username && password) {
		// Ensure user doesn't already exist
		if (users.some(user => user.email === email)) {
			return res.status(409).json({ error: 'User already exists' });
		}

		const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
		const newUser = { id: users.length + 1, name, email, username, hashedPassword };
		users.push(newUser);
		req.session.userId = newUser.id;
		res.status(200).json({ name, email, username });
	} else {
		res.status(400).json({ error: 'Missing sign up fields' });
	}
});

app.post('/login', async (req, res) => {
	const { username, password } = req.body;

	if (username && password) {
		const matchingUser = users.find(user => (user.username === username) || (user.email === username));
		if (!matchingUser) return res.status(404).json({ error: 'User not found' });

		const passwordsMatch = await bcrypt.compare(password, matchingUser.password);
		if (!passwordsMatch) return res.status(401).json({ error: 'Incorrect password' });

		req.session.userId = matchingUser.id;
		res.status(200).json({ name: matchingUser.name, email: matchingUser.email, username: matchingUser.username });
	} else {
		res.status(400).json({ error: 'Missing login fields' });
	}
});

// Start server
app.listen(PORT, () => console.log(`Homina server running on port ${PORT}...`));