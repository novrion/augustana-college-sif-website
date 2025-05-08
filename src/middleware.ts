import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { PERMISSIONS } from '@/lib/types/auth';

type PermissionKey = keyof typeof PERMISSIONS;

const PROTECTED_ROUTES: Record<string, PermissionKey> = {
	"/holdings": "HOLDINGS_READ",
	"/admin": "ADMIN_DASHBOARD",
	"/admin/holdings": "HOLDINGS_WRITE",
	"/admin/notes": "SECRETARY",
	"/admin/gallery": "SECRETARY",
};

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	const token = await getToken({
		req: request,
		secret: process.env.NEXTAUTH_SECRET,
	});

	if (!token) {
		const url = new URL("/login", request.url);
		url.searchParams.set("callbackUrl", encodeURI(request.url));
		return NextResponse.redirect(url);
	}

	const userRole = token.role as string;

	// Find the most specific route match
	let requiredPermission: PermissionKey | null = null;
	let longestMatch = 0;

	for (const [route, permission] of Object.entries(PROTECTED_ROUTES)) {
		if (pathname.startsWith(route) && route.length > longestMatch) {
			requiredPermission = permission;
			longestMatch = route.length;
		}
	}

	if (requiredPermission && !PERMISSIONS[requiredPermission].includes(userRole)) {
		return NextResponse.redirect(new URL("/unauthorized", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		"/holdings/:path*",
		"/admin/:path*"
	],
};