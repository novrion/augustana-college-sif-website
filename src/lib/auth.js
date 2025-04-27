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
				};
			}
		})
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
				token.role = user.role;
			}
			return token;
		},
		async session({ session, token }) {
			if (token) {
				session.user.id = token.id;
				session.user.role = token.role;
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
	return !!session && (session.user.role === 'admin' || session.user.role === 'portfolio-access');
};

// Helper function to check if user is admin
export const isAdmin = async () => {
	const session = await getSession();
	return !!session && session.user.role === 'admin';
};