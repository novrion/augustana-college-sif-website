import { getServerSession } from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { UserWithCredentials, UserRole } from "@/lib/types/user"
import { getUserCredentialsByEmail, verifyPassword } from "@/lib/api/db";

export const authOptions = {
	providers: [
		CredentialsProvider({
			name: "credentials",
			credentials: {
				email: { label: "Email", type: "text" },
				password: { label: "Password", type: "password" }
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) { throw new Error("Invalid credentials"); }

				const result = await getUserCredentialsByEmail(credentials.email);
				if (!result) { throw new Error("Invalid credentials"); }

				const user: UserWithCredentials = result;
				if (!user.is_active) { throw new Error("Account deactivated"); }

				const isCorrectPassword = await verifyPassword(credentials.password, user.password);
				if (!isCorrectPassword) { throw new Error("Invalid credentials"); }

				return {
					id: user.id,
					role: user.role,
					name: user.name,
					profile_picture: user.profile_picture,
				};
			}
		})
	],
	callbacks: {
		async jwt({ token, user, trigger, session }) {
			if (trigger === 'update' && session?.user) {
				token.name = session.user.name;
				token.profile_picture = session.user.profile_picture;
			}

			if (user) {
				token.id = user.id;
				token.role = user.role;
				token.name = user.name;
				token.profile_picture = user.profile_picture;
			}
			return token;
		},
		async session({ session, token }) {
			if (token) {
				session.user.id = token.id as string;
				session.user.role = token.role as UserRole;
				session.user.name = token.name as string;
				session.user.profile_picture = token.profile_picture as string;
			}
			return session;
		}
	},
	session: {
		strategy: "jwt",
		maxAge: 24 * 60 * 60,
	},
	secret: process.env.NEXTAUTH_SECRET,
	pages: {
		signIn: "/login",
	},
};


export const getSession = () => getServerSession(authOptions);

export const isAuthenticated = async (): Promise<boolean> => {
	const session = await getSession();
	return !!session;
}


const hasAccess = async (roles: UserRole[]): Promise<boolean> => {
	const session = await getSession();
	return !!session && roles.includes(session.user.role);
}

export const hasHoldingsReadAccess = async (): Promise<boolean> => {
	const roles: UserRole[] = ['admin', 'president', 'vice_president', 'secretary', 'holdings_write', 'holdings_read'];
	return hasAccess(roles);
}

export const hasHoldingsWriteAccess = async (): Promise<boolean> => {
	const roles: UserRole[] = ['admin', 'president', 'vice_president', 'holdings_write'];
	return hasAccess(roles);
}

export const hasSecretaryAccess = async (): Promise<boolean> => {
	const roles: UserRole[] = ['admin', 'president', 'vice_president', 'secretary'];
	return hasAccess(roles);
}

export const hasAdminAccess = async (): Promise<boolean> => {
	const roles: UserRole[] = ['admin', 'president', 'vice_president'];
	return hasAccess(roles);
};


export const isVicePresident = async (): Promise<boolean> => {
	const roles: UserRole[] = ['vice_president'];
	return hasAccess(roles);
};

export const isPresident = async (): Promise<boolean> => {
	const roles: UserRole[] = ['president'];
	return hasAccess(roles);
};

export const isSuperAdmin = async (): Promise<boolean> => {
	const roles: UserRole[] = ['admin'];
	return hasAccess(roles);
};