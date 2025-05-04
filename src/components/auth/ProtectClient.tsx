'use client'

import { useAuth, hasAccess, RequiredRole } from "@/hooks/auth/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function ProtectedClientPage({
	children,
	requiredRole = 'holdings_read' as RequiredRole
}: {
	children: React.ReactNode,
	requiredRole?: RequiredRole
}) {
	const { status, role } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (status === 'unauthenticated') {
			router.push('/login');
		} else if (status === 'authenticated' && !hasAccess(role, requiredRole)) {
			router.push('/unauthorized');
		}
	}, [status, role, router, requiredRole]);

	if (status === 'loading') {
		return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
	}

	if (status === 'authenticated' && hasAccess(role, requiredRole)) {
		return <>{children}</>;
	}

	return null;
}

export function ProtectedClientComponent({
	children,
	requiredRole = 'holdings_read' as RequiredRole
}: {
	children: React.ReactNode,
	requiredRole?: RequiredRole
}) {
	const { status, role } = useAuth();

	if (status === 'authenticated' && hasAccess(role, requiredRole)) {
		return <>{children}</>;
	} else {
		return null;
	}
}