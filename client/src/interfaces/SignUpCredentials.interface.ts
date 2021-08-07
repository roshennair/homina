import User from "./User.interface";

export default interface SignUpCredentials extends User {
	password: string;
}