import { FC, useState, ChangeEventHandler, FormEventHandler } from 'react';
import { Link, useHistory } from 'react-router-dom';
import SignUpForm from '../interfaces/SignUpForm.interface';
import { useAuth } from '../contexts/authContext';
import Logo from '../components/Logo';
import ErrorMessage from '../components/ErrorMessage';

const SignUp: FC = () => {
	const [formValues, setFormValues] = useState<SignUpForm>({
		name: '',
		email: '',
		username: '',
		password: ''
	});
	const [error, setError] = useState('');
	const { signup } = useAuth();
	const history = useHistory();

	// Update state when form values change
	const handleChange: ChangeEventHandler<HTMLInputElement> = e => {
		const field = e.target.name;
		const value = e.target.value;
		setFormValues({ ...formValues, [field]: value });
	};

	// Sign up user
	const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
		event.preventDefault();

		try {
			await signup(formValues);
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
				<form method="post" onSubmit={handleSubmit}>
					<label htmlFor="name">Name</label>
					<input type="text" name="name" id="name" required value={formValues.name} onChange={handleChange} />

					<label htmlFor="email">Email address</label>
					<input type="email" name="email" id="email" required value={formValues.email} onChange={handleChange} />

					<label htmlFor="username">Username</label>
					<input type="text" name="username" id="username" required value={formValues.username} onChange={handleChange} />

					<label htmlFor="password">Password</label>
					<input type="password" name="password" id="password" required value={formValues.password} onChange={handleChange} />

					<input className="primary" type="submit" value="Sign Up" />
				</form>
			</div >
			<div className="form-foot">
				<span>Already have a Homina account? <Link to="/login">Login</Link>.</span>
			</div>
		</div >
	);
}

export default SignUp;