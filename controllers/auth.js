const bcrypt = require('bcryptjs');
const db = require('../db');

const {
	SESSION_NAME = 'sid',
	SALT_ROUNDS = 10
} = process.env;

const signup = async (req, res) => {
	const { name, email, username, password } = req.body;

	if (name && email && username && password) {
		// Ensure user doesn't already exist
		const existingUser = await db.getUser(username, email);
		if (existingUser) {
			return res.status(409).json({ message: 'User already exists' });
		}

		// Hash password and add new user
		const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
		const newUser = await db.addUser(username, email, name, hashedPassword);

		// Set session cookie and return new user 
		req.session.userId = newUser.id;
		res.status(200).json({
			name: newUser.name,
			username: newUser.username,
			email: newUser.email
		});
	} else {
		res.status(400).json({ message: 'Missing sign up fields' });
	}
}

const login = async (req, res) => {
	const { username, password } = req.body;

	if (username && password) {
		const matchingUser = await db.getUser(username);
		if (!matchingUser) return res.status(404).json({ message: 'User not found.' });

		const passwordsMatch = await bcrypt.compare(password, matchingUser.password);
		if (!passwordsMatch) return res.status(401).json({ message: 'Incorrect password.' });

		req.session.userId = matchingUser.id;
		res.status(200).json({
			name: matchingUser.name,
			username: matchingUser.username,
			email: matchingUser.email
		});
	} else {
		res.status(400).json({ message: 'Missing login fields.' });
	}
}

const logout = async (req, res) => {
	req.session.destroy(err => {
		if (err) return res.status(500).json({ message: 'Error logging out.' });
		res.clearCookie(SESSION_NAME);
		res.sendStatus(200);
	});
}

module.exports = { signup, login, logout };