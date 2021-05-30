const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

// Constants
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

// Routes
app.get('/', (req, res) => {
	res.send('<p>Connected!</p>');
});

app.post('/sign-up', (req, res) => {
	console.log(req.body);
});

// Start server
app.listen(PORT, () => console.log(`Homina server running on port ${PORT}...`));