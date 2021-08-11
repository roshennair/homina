import { createContext, useContext, useState, useEffect, FC } from 'react'
import LoginForm from '../interfaces/LoginForm.interface';
import SignUpForm from '../interfaces/SignUpForm.interface';
import PasswordResetForm from 'src/interfaces/PasswordResetForm.interface';

interface User {
	name: string;
	username: string;
	email: string;
}

interface AuthContextValue {
	currentUser: User | null;
	signup: (signupFields: SignUpForm) => Promise<void>;
	login: (loginFields: LoginForm) => Promise<void>;
	logout: () => Promise<void>;
	sendPasswordResetEmail: (email: string) => Promise<void>;
	resetPassword: (passwordResetFields: PasswordResetForm) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Custom hook to access auth context
export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within AuthProvider.');
	}

	return context;
};

export const AuthProvider: FC<{}> = ({ children }) => {
	const [currentUser, setCurrentUser] = useState<User | null>(JSON.parse(localStorage.getItem('currentUser') || 'null'));
	useEffect(() => {
		localStorage.setItem('currentUser', JSON.stringify(currentUser));
	}, [currentUser]);

	const signup = async (signupFields: SignUpForm) => {
		const response = await fetch('auth/signup', {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(signupFields)
		});

		if (response.ok) {
			const user = await response.json();
			setCurrentUser(user);
		} else {
			const error = await response.json();
			throw error;
		}
	}

	const login = async (loginFields: LoginForm) => {
		const response = await fetch('auth/login', {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(loginFields)
		});

		if (response.ok) {
			const user = await response.json();
			setCurrentUser(user);
		} else {
			const error = await response.json();
			throw error;
		}
	}

	const logout = async () => {
		const response = await fetch('auth/logout', {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (response.ok) {
			setCurrentUser(null);
			localStorage.removeItem('currentUser');
		} else {
			const error = await response.json();
			throw error;
		}
	}

	const sendPasswordResetEmail = async (email: string) => {
		const response = await fetch('auth/forgot-password', {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ email })
		});

		if (!response.ok) {
			const error = await response.json();
			throw error;
		}
	}

	const resetPassword = async (passwordResetFields: PasswordResetForm) => {
		const response = await fetch('auth/reset-password', {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(passwordResetFields)
		});

		if (!response.ok) {
			const error = await response.json();
			throw error;
		}
	}

	const providerValue: AuthContextValue = {
		currentUser,
		signup,
		login,
		logout,
		sendPasswordResetEmail,
		resetPassword
	};

	return (
		<AuthContext.Provider value={providerValue}>
			{children}
		</AuthContext.Provider>
	)
}