'use client'

import { useAuth } from "@/hooks/useAuth";
import { PermissionKey } from "@/lib/types/auth";

export function ProtectedClientComponent({
	children,
	requiredRole = 'HOLDINGS_READ' as PermissionKey
}: {
	children: React.ReactNode,
	requiredRole?: PermissionKey
}) {
	const { status, hasPermission } = useAuth();

	if (status === 'authenticated' && hasPermission(requiredRole)) {
		return <>{children}</>;
	} else {
		return null;
	}
}