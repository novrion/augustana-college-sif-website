import { Session, AuthOptions } from "next-auth";
import { getServerSession } from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { UserWithCredentials, UserRole } from "@/lib/types"
import { getUserCredentialsByEmail, verifyPassword, getUserByEmail, createUser, updateUser } from "@/lib/api/db";
import { PermissionKey, PERMISSIONS } from "@/lib/types/auth";

export const authOptions: AuthOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),
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
					email: user.email,
					profile_picture: user.profile_picture,
				};
			}
		})
	],
	callbacks: {
		async signIn({ user, account, profile }) {
			if (account?.provider === "google") {
				const email = user.email;
				if (!email?.endsWith("@augustana.edu")) {
					return false;
				}

				const dbUser = await getUserByEmail(email).catch(() => null);

				if (dbUser) {
					if (!dbUser.google_id) {
						await updateUser(dbUser.id, {
							google_id: profile?.sub
						});
					}

					user.id = dbUser.id;
					user.role = dbUser.role;
					user.email = dbUser.email;
					user.name = dbUser.name;
					user.profile_picture = dbUser.profile_picture;
				} else {
					const newUser = await createUser({
						name: user.name,
						email: user.email,
						google_id: profile?.sub,
						profile_picture: user.image
					});

					if (newUser) {
						user.id = newUser.id;
						user.role = newUser.role;
					} else {
						console.error("Failed to create user for Google login");
						return false;
					}
				}
			}
			return true;
		},

		async jwt({ token, user, trigger, session }) {
			if (trigger === 'update' && session?.user) {
				token.name = session.user.name;
				token.profile_picture = session.user.profile_picture;
			}

			if (user) {
				token.id = user.id;
				token.role = user.role || "user";
				token.name = user.name;
				token.email = user.email;
				token.profile_picture = user.profile_picture;
			}
			return token;
		},

		async session({ session, token }) {
			if (token) {
				session.user.id = token.id as string;
				session.user.role = token.role as UserRole || "user";
				session.user.name = token.name as string;
				session.user.email = token.email as string;
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
		error: "/login",
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
};