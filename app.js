const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

// Constants
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.get('/', (_req, res) => {
	res.send('<p>Connected!</p>');
});

// Start server
app.listen(PORT, () => console.log(`Homina server running on port ${PORT}...`));