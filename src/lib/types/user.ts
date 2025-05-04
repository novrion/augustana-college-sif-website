export interface User {
	id: string;
	name: string;
	email: string;
	role: UserRole;
	is_active: boolean;
	profile_picture?: string;
	description?: string;
	phone?: string;
}

export interface UserWithCredentials extends User {
	password: string;
}

export type UserRole = 'admin' | 'president' | 'vice_president' | 'secretary' | 'holdings_write' | 'holdings_read' | 'user';