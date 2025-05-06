import 'next-auth';
import { DefaultSession, DefaultUser } from 'next-auth';
import { UserRole } from './lib/types/user'; // Adjust the path if your UserRole enum/type is elsewhere

// Extend the built-in types
declare module 'next-auth' {
	/**
	 * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
	 */
	interface Session {
		user: {
			/** The user's database ID. */
			id: string; // Add the id property here
			role: UserRole; // Add the role property if you store it on the session
			name: string;
			profile_picture?: string;
			// Add any other custom properties you expect on session.user
		} & DefaultSession['user']; // Keep the default properties (name, email, image)
	}

	/**
	 * The shape of the user object returned by the providers
	 * and stored in the database if using a database adapter.
	 */
	interface User extends DefaultUser {
		id: string; // Add the id property here
		role: UserRole; // Add the role property if you store it on the User object in the database
		name: string;
		profile_picture?: string;
		// Add any other custom properties you store on the User in the database
	}
}

// You can also extend the AdapterUser if you are using a database adapter
// import { AdapterUser } from 'next-auth/adapters';
// declare module 'next-auth/adapters' {
//   interface AdapterUser extends DefaultUser {
//     id: string;
//     role?: UserRole;
//   }
// }