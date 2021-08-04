import React, { useContext, useState, useEffect } from 'react'

const AuthContext = React.createContext();
const authRoute = '/auth'

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
	const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('currentUser')) || null);

	useEffect(() => {
		localStorage.setItem('currentUser', JSON.stringify(currentUser));
	}, [currentUser]);

	const signUp = async (signUpData) => {
		const response = await fetch(`${authRoute}/signup`, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(signUpData)
		});

		if (response.ok) {
			const user = await response.json();
			setCurrentUser(user);
		} else {
			const error = await response.json();
			throw error;
		}
	}

	const login = async (loginCreds) => {
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

	const logout = async () => {
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

	const providerValue = { currentUser, signUp, login, logout };

	return (
		<AuthContext.Provider value={providerValue}>
			{children}
		</AuthContext.Provider>
	)
}