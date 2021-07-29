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
	REDIS_URL = 'redis://localhost:6379/',
	SESSION_NAME = 'sid',
	SESSION_LIFETIME = TWO_HOURS,
	SESSION_SECRET = 'd47e3ac2-1fc5-4d99-9c55-de055d38e302',
	SALT_ROUNDS = 10,
	CLIENT_ADDRESSES = 'http://localhost:3000'
} = process.env;
const IN_PROD = NODE_ENV === 'production';
const users = []; // TODO: Replace with DB

// Initializations
const app = express();
app.set("trust proxy", 1);
const RedisStore = connectRedis(session);
const redisClient = redis.createClient(REDIS_URL);

// Middleware
app.use(morgan('dev'));
app.use(cors({
	origin: CLIENT_ADDRESSES.split(','),
	credentials: true,
}));
app.use(express.json());
app.use(session({
	name: SESSION_NAME,
	resave: false,
	saveUninitialized: false,
	secret: SESSION_SECRET,
	cookie: {
		maxAge: SESSION_LIFETIME,
		sameSite: IN_PROD ? 'none' : 'lax',
		secure: IN_PROD
	},
	store: new RedisStore({ client: redisClient })
}));

// Routes
app.get('/', (req, res) => {
	res.json({ message: 'Welcome to the Homina server' });
});

app.post('/signup', async (req, res) => {
	const { name, email, username, password } = req.body;

	if (name && email && username && password) {
		// Ensure user doesn't already exist
		if (users.some(user => user.username === username)) {
			return res.status(409).json({ message: 'Username already exists.', field: 'username' });
		} else if (users.some(user => user.email === email)) {
			return res.status(409).json({ message: 'Email already exists.', field: 'email' });
		}

		const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
		const newUser = { id: users.length + 1, name, email, username, password: hashedPassword };
		users.push(newUser);
		req.session.userId = newUser.id;
		console.log(users);
		res.status(200).json({ name, email, username });
	} else {
		res.status(400).json({ message: 'Missing sign up fields.', field: '' });
	}
});

app.post('/login', async (req, res) => {
	const { username, password } = req.body;

	if (username && password) {
		const matchingUser = users.find(user => (user.username === username) || (user.email === username));
		if (!matchingUser) return res.status(404).json({ message: 'Username not found.', field: 'username' });

		const passwordsMatch = await bcrypt.compare(password, matchingUser.password);
		if (!passwordsMatch) return res.status(401).json({ message: 'Incorrect password.', field: 'password' });

		req.session.userId = matchingUser.id;
		res.status(200).json({ name: matchingUser.name, email: matchingUser.email, username: matchingUser.username });
	} else {
		res.status(400).json({ message: 'Missing login fields.', field: '' });
	}
});

app.post('/logout', async (req, res) => {
	req.session.destroy(err => {
		if (err) return res.status(500).json({ message: 'Error logging out.', field: '' });
		res.clearCookie(SESSION_NAME);
		res.sendStatus(200);
	});
});

// Start server
app.listen(PORT, () => console.log(`Homina server running on port ${PORT}...`));