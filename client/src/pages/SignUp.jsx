import { useState } from 'react';
import { useAuth } from '../contexts/authContext';
import Logo from '../components/Logo';
import ErrorMessage from '../components/ErrorMessage';
import { Link, useHistory } from 'react-router-dom';

const SignUp = () => {
	const [formValues, setFormValues] = useState({
		name: '',
		email: '',
		username: '',
		password: ''
	});
	const [error, setError] = useState('');
	const { signUp } = useAuth();
	const history = useHistory();

	// Update state when form values change
	const handleChange = e => {
		const field = e.target.name;
		const value = e.target.value;
		setFormValues({ ...formValues, [field]: value });
	};

	// Sign up user
	const handleSubmit = async (event) => {
		event.preventDefault();

		try {
			await signUp(formValues);
			history.push('/');
		}
		catch (error) {
			setError(error.message);
		}
	}

	return (
		<div className="form-container">
			<div className="form-head">
				<Logo />
				<h1>Sign Up</h1>
			</div>
			{error && <ErrorMessage error={error} hideError={() => setError('')} />}
			<div className="form-body">
				<form className="form" method="post" onSubmit={handleSubmit}>
					<label htmlFor="name">Name</label>
					<input type="text" name="name" id="name" required value={formValues.name} onChange={handleChange} />

					<label htmlFor="email">Email address</label>
					<input type="email" name="email" id="email" required value={formValues.email} onChange={handleChange} />

					<label htmlFor="username">Username</label>
					<input type="text" name="username" id="username" required value={formValues.username} onChange={handleChange} />

					<label htmlFor="password">Password</label>
					<input type="password" name="password" id="password" required value={formValues.password} onChange={handleChange} />

					<input className="primary form-submit" type="submit" value="Sign Up" />
				</form>
			</div >
			<div className="form-foot">
				<span>Already have a Homina account? <Link to="/login">Login</Link>.</span>
			</div>
		</div >
	);
}

export default SignUp;