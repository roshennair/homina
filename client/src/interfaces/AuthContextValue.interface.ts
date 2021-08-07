import LoginCredentials from "./LoginCredentials.interface";
import SignUpCredentials from "./SignUpCredentials.interface";
import User from "./User.interface";

export default interface AuthContextValue {
	currentUser: User | null;
	signup: (signupCreds: SignUpCredentials) => Promise<void>;
	login: (loginCreds: LoginCredentials) => Promise<void>;
	logout: () => Promise<void>;
}