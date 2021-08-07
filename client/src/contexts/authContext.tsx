import { createContext, useContext, useState, useEffect, FC } from 'react'
import AuthContextValue from '../interfaces/AuthContextValue.interface';
import LoginCredentials from '../interfaces/LoginCredentials.interface';
import SignUpCredentials from '../interfaces/SignUpCredentials.interface';
import User from '../interfaces/User.interface';

const AuthContext = createContext<AuthContextValue | null>(null);
const authRoute = '/auth';

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: FC<{}> = ({ children }) => {
	const [currentUser, setCurrentUser] = useState<User | null>(JSON.parse(localStorage.getItem('currentUser')));
	useEffect(() => {
		localStorage.setItem('currentUser', JSON.stringify(currentUser));
	}, [currentUser]);

	const signup = async (signupCreds: SignUpCredentials): Promise<void> => {
		const response = await fetch(`${authRoute}/signup`, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(signupCreds)
		});

		if (response.ok) {
			const user = await response.json();
			setCurrentUser(user);
		} else {
			const error = await response.json();
			throw error;
		}
	}

	const login = async (loginCreds: LoginCredentials): Promise<void> => {
		const response = await fetch(`${authRoute}/login`, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(loginCreds)
		});

		if (response.ok) {
			const user = await response.json();
			setCurrentUser(user);
		} else {
			const error = await response.json();
			throw error;
		}
	}

	const logout = async (): Promise<void> => {
		const response = await fetch(`${authRoute}/logout`, {
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

	const providerValue: AuthContextValue = { currentUser, signup, login, logout };

	return (
		<AuthContext.Provider value={providerValue}>
			{children}
		</AuthContext.Provider>
	)
}