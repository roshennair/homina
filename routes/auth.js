const express = require('express');
const bcrypt = require('bcrypt');

const {
	SESSION_NAME = 'sid',
	SALT_ROUNDS = 10
} = process.env;
const authRouter = express.Router();
const users = []; // TODO: Replace with DB

authRouter.post('/signup', async (req, res) => {
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

authRouter.post('/login', async (req, res) => {
	const { username, password } = req.body;

	if (username && password) {
		const matchingUser = users.find(user => (user.username === username) || (user.email === username));
		if (!matchingUser) return res.status(404).json({ message: 'Username not found.', field: 'username' });

		const passwordsMatch = await bcrypt.compare(password, matchingUser.password);
		if (!passwordsMatch) return res.status(401).json({ message: 'Incorrect password.', field: 'password' });

		req.session.userId = matchingUser.id;
		console.log(users);
		res.status(200).json({ name: matchingUser.name, email: matchingUser.email, username: matchingUser.username });
	} else {
		res.status(400).json({ message: 'Missing login fields.', field: '' });
	}
});

authRouter.post('/logout', async (req, res) => {
	req.session.destroy(err => {
		if (err) return res.status(500).json({ message: 'Error logging out.', field: '' });
		res.clearCookie(SESSION_NAME);
		res.sendStatus(200);
	});
});

module.exports = authRouter;