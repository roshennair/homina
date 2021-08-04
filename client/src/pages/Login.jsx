import { useState } from 'react';
import { useAuth } from '../contexts/authContext';
import Logo from '../components/Logo';
import ErrorMessage from '../components/ErrorMessage';
import { Link, useHistory } from 'react-router-dom';

const SignUp = () => {
	const [formValues, setFormValues] = useState({
		username: '',
		password: ''
	});
	const [error, setError] = useState('');
	const { login } = useAuth();
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
			await login(formValues);
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
				<h1>Login</h1>
			</div>
			{error && <ErrorMessage error={error} hideError={() => setError('')} />}
			<div className="form-body">
				<form className="form" method="post" onSubmit={handleSubmit}>
					<label htmlFor="username">Username or email address</label>
					<input type="text" name="username" id="username" required value={formValues.username} onChange={handleChange} />

					<label htmlFor="password">Password</label>
					<input type="password" name="password" id="password" required value={formValues.password} onChange={handleChange} />

					<input className="primary form-submit" type="submit" value="Login" />
				</form>
			</div >
			<div className="form-foot">
				<span>Don't have a Homina account? <Link to="/signup">Sign up</Link>.</span>
			</div>
		</div >
	);
}

export default SignUp;