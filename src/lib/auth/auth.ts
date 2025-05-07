import { JWT } from "next-auth/jwt";
import { Session, AuthOptions } from "next-auth";
import { getServerSession } from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { UserWithCredentials, User, UserRole } from "@/lib/types"
import { getUserCredentialsByEmail, verifyPassword } from "@/lib/api/db";
import { PermissionKey, PERMISSIONS } from "@/lib/types/auth";

export const authOptions: AuthOptions = {
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
		async jwt({ token, user, trigger, session }: { token: JWT; user: User; trigger: "signIn" | "signUp" | "update"; session: Session; }) {
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
		async session({ session, token }: { session: Session; token: JWT; }) {
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
		strategy: "jwt" as const,
		maxAge: 24 * 60 * 60,
	},
	secret: process.env.NEXTAUTH_SECRET,
	pages: {
		signIn: "/login",
	},
};

export function getSession(): Promise<Session | null> {
	return getServerSession(authOptions);
}

export async function hasPermission(permissionKey: PermissionKey): Promise<boolean> {
	const session = await getSession();
	if (!session) return false;

	const roles = PERMISSIONS[permissionKey];
	return roles.includes(session.user.role);
}

export const isAuthenticated = async (): Promise<boolean> => {
	const session = await getSession();
	return !!session;
}