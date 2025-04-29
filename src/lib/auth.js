import { getServerSession } from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { getUserByEmail, verifyPassword } from "./database";

export const authOptions = {
	providers: [
		CredentialsProvider({
			name: "credentials",
			credentials: {
				email: { label: "Email", type: "text" },
				password: { label: "Password", type: "password" }
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					throw new Error("Invalid credentials");
				}

				const user = await getUserByEmail(credentials.email);

				if (!user || !user.is_active) {
					throw new Error("Invalid credentials");
				}

				const isCorrectPassword = await verifyPassword(
					credentials.password,
					user.password
				);

				if (!isCorrectPassword) {
					throw new Error("Invalid credentials");
				}

				return {
					id: user.id,
					name: user.name,
					email: user.email,
					role: user.role,
					description: user.description,
					phone: user.phone,
					profile_picture: user.profile_picture
				};
			}
		})
	],
	callbacks: {
		async jwt({ token, user, trigger, session }) {
			// Handle profile updates made via update() function from useSession
			if (trigger === "update" && session?.user) {
				token.name = session.user.name;
				token.description = session.user.description;
				token.phone = session.user.phone;
				token.profile_picture = session.user.profile_picture;
				// Don't update role or email here unless intended & secured
			}

			// Initial sign-in: 'user' object is available
			if (user) {
				token.id = user.id;
				token.role = user.role;
				token.name = user.name;
				token.email = user.email;
				token.description = user.description;
				token.phone = user.phone;
				token.profile_picture = user.profile_picture;
			}
			return token; // Token now contains all the data
		},
		async session({ session, token }) {
			if (token) {
				session.user.id = token.id;
				session.user.role = token.role;
				session.user.name = token.name;
				session.user.email = token.email;
				session.user.description = token.description;
				session.user.phone = token.phone;
				session.user.profile_picture = token.profile_picture;
			}
			return session;
		}
	},
	session: {
		strategy: "jwt",
	},
	secret: process.env.NEXTAUTH_SECRET,
	pages: {
		signIn: "/login",
	},
};

export const getSession = () => getServerSession(authOptions);

// Helper function to check if user is authenticated
export const isAuthenticated = async () => {
	const session = await getSession();
	return !!session;
};

// Helper function to check if user has portfolio access
export const hasPortfolioAccess = async () => {
	const session = await getSession();
	if (!session) return false;

	const adminRoles = ['admin', 'president', 'vice_president'];
	return adminRoles.includes(session.user.role) || session.user.role === 'portfolio-access';
};

// Helper function to check if user has admin-level access
export const hasAdminAccess = async () => {
	const session = await getSession();
	if (!session) return false;

	const adminRoles = ['admin', 'president', 'vice_president'];
	return adminRoles.includes(session.user.role);
};

// Helper function to check if user is admin (highest role)
export const isAdmin = async () => {
	const session = await getSession();
	return !!session && session.user.role === 'admin';
};

// Helper function to check if user is president
export const isPresident = async () => {
	const session = await getSession();
	return !!session && session.user.role === 'president';
};

// Helper function to check if user is vice president
export const isVicePresident = async () => {
	const session = await getSession();
	return !!session && session.user.role === 'vice_president';
};