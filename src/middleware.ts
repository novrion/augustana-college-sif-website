import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const ROUTE_PERMISSIONS = {
	"/admin": ["admin", "president", "vice_president", "secretary", "holdings_write"],
	"/admin/holdings": ["admin", "president", "vice_president", "holdings_write"],
	"/admin/notes": ["admin", "president", "vice_president", "secretary"],
	"/admin/gallery": ["admin", "president", "vice_president", "secretary"],

	"admin_default": ["admin", "president", "vice_president"],

	"holdings": ["admin", "president", "vice_president", "secretary", "holdings_write", "holdings_read"]
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

	if (pathname.startsWith("/holdings")) {
		if (!ROUTE_PERMISSIONS.holdings.includes(userRole)) {
			return NextResponse.redirect(new URL("/unauthorized", request.url));
		}
	} else if (pathname.startsWith("/admin")) {
		let hasAccess = false;

		for (const [route, roles] of Object.entries(ROUTE_PERMISSIONS)) {
			if (route.startsWith("/admin/") && pathname.startsWith(route)) {
				hasAccess = roles.includes(userRole);
				break;
			}
		}

		// Default admin permissions
		if (!hasAccess && !pathname.startsWith("/admin/holdings") &&
			!pathname.startsWith("/admin/notes") &&
			!pathname.startsWith("/admin/gallery")) {
			hasAccess = ROUTE_PERMISSIONS.admin_default.includes(userRole);
		}

		if (!hasAccess) {
			return NextResponse.redirect(new URL("/unauthorized", request.url));
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		"/holdings/:path*",
		"/admin/:path*"
	],
};