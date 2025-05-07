import { NextResponse } from 'next/server';
import { Session } from 'next-auth';
import { getSession } from '@/lib/auth/auth';
import { PermissionKey, PERMISSIONS } from '@/lib/types';

type RouteHandlerWithoutParams = (
	request: Request,
	session: Session
) => Promise<NextResponse>;

type RouteHandlerWithParams = (
	request: Request,
	session: Session,
	params: Promise<{ id: string }>
) => Promise<NextResponse>;

function checkAuth(session: Session | null, permissionKey?: PermissionKey): NextResponse | null {
	if (!session) {
		return NextResponse.json(
			{ error: 'Not authenticated' },
			{ status: 401 }
		);
	}

	if (permissionKey) {
		const hasPermission = PERMISSIONS[permissionKey].includes(session.user.role);
		if (!hasPermission) {
			return NextResponse.json(
				{ error: 'Insufficient permissions' },
				{ status: 403 }
			);
		}
	}

	return null;
}

export function withAuth(
	handler: RouteHandlerWithoutParams,
	permissionKey?: PermissionKey
): (request: Request) => Promise<NextResponse> {
	return async (request: Request) => {
		try {
			const session = await getSession();
			const authError = checkAuth(session, permissionKey);
			if (authError) return authError;

			return await handler(request, session!);
		} catch (error) {
			console.error(`Error in route handler:`, error);
			return NextResponse.json(
				{ error: error instanceof Error ? error.message : 'An unexpected error occurred' },
				{ status: 500 }
			);
		}
	};
}

export function withAuthParam(
	handler: RouteHandlerWithParams,
	permissionKey?: PermissionKey
): (request: Request, params: Promise<{ id: string }>) => Promise<NextResponse> {
	return async (request: Request, params: Promise<{ id: string }>) => {
		try {
			const session = await getSession();
			const authError = checkAuth(session, permissionKey);
			if (authError) return authError;

			return await handler(request, session!, params);
		} catch (error) {
			console.error(`Error in route handler:`, error);
			return NextResponse.json(
				{ error: error instanceof Error ? error.message : 'An unexpected error occurred' },
				{ status: 500 }
			);
		}
	};
}


type ErrorRouteHandler = (
	request: Request,
	params?: unknown
) => Promise<NextResponse>;

export function withError(handler: ErrorRouteHandler) {
	return async (request: Request, params?: unknown) => {
		try {
			return await handler(request, params);
		} catch (error) {
			console.error(`Error in route handler:`, error);
			return NextResponse.json(
				{ error: error instanceof Error ? error.message : 'An unexpected error occurred' },
				{ status: 500 }
			);
		}
	};
}