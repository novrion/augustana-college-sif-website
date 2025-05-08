'use client'

import { useSession } from 'next-auth/react';
import { UserRole } from '@/lib/types/user';
import { PermissionKey, PERMISSIONS } from "@/lib/types/auth";

export function useAuth() {
	const { data: session, update: updateSession, status } = useSession();

	const isAuthenticated = status === 'authenticated';
	const isLoading = status === 'loading';
	const role = session?.user?.role as UserRole | undefined;

	function hasPermission(permissionKey: PermissionKey): boolean {
		if (!role) return false;
		return PERMISSIONS[permissionKey].includes(role);
	};

	// Convenience methods for common permission checks
	const hasHoldingsReadAccess = () => hasPermission('HOLDINGS_READ');
	const hasHoldingsWriteAccess = () => hasPermission('HOLDINGS_WRITE');
	const hasAdminDashboardAccess = () => hasPermission('ADMIN_DASHBOARD');
	const hasSecretaryAccess = () => hasPermission('SECRETARY');
	const hasAdminAccess = () => hasPermission('ADMIN');

	return {
		session,
		updateSession,
		status,
		isAuthenticated,
		isLoading,
		role,
		hasPermission,
		hasHoldingsReadAccess,
		hasHoldingsWriteAccess,
		hasAdminDashboardAccess,
		hasSecretaryAccess,
		hasAdminAccess,
	};
}