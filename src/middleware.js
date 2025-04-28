import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Common static file extensions
const STATIC_EXTENSIONS = [
	'.svg', '.png', '.jpg', '.jpeg', '.gif', '.ico',
	'.css', '.js', '.ttf', '.woff', '.woff2', '.eot'
];

// Paths that require authentication and specific roles
const protectedPaths = [
	{
		path: '/portfolio',
		requiredRoles: ['admin', 'portfolio-access']
	},
	{
		path: '/admin',
		requiredRoles: ['admin']
	}
];

// Paths that authentication is checked for
const authCheckedPaths = [
	'/portfolio',
	'/admin'
];

export async function middleware(request) {
	const { pathname } = request.nextUrl;

	// NEW: Check if the request is for a static file first
	const isStaticResource = STATIC_EXTENSIONS.some(ext =>
		pathname.endsWith(ext)
	);

	// If it's a static resource (like logo.svg), skip auth checks
	if (isStaticResource) {
		return NextResponse.next();
	}

	// Continue with your existing authentication logic
	// Check if the path requires authentication
	const isAuthChecked = authCheckedPaths.some(path =>
		pathname === path || pathname.startsWith(`${path}/`)
	);

	if (isAuthChecked) {
		const token = await getToken({
			req: request,
			secret: process.env.NEXTAUTH_SECRET
		});

		// If no token, redirect to login
		if (!token) {
			const url = new URL('/login', request.url);
			url.searchParams.set('callbackUrl', encodeURI(request.url));
			return NextResponse.redirect(url);
		}

		// Check for protected paths that require specific roles
		for (const { path, requiredRoles } of protectedPaths) {
			if (pathname === path || pathname.startsWith(`${path}/`)) {
				const userRole = token.role;

				if (!requiredRoles.includes(userRole)) {
					// User doesn't have the required role - redirect to unauthorized page
					return NextResponse.redirect(new URL('/unauthorized', request.url));
				}
			}
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		'/portfolio/:path*',
		'/admin/:path*'
	]
};