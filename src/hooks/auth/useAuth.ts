'use client'

import { useSession } from 'next-auth/react';
import { UserRole } from '@/lib/types/user';

export const ROLE_PERMISSIONS = {
	'holdings_read': ['admin', 'president', 'vice_president', 'secretary', 'holdings_write', 'holdings_read'],
	'admin_dashboard': ['admin', 'president', 'vice_president', 'secretary', 'holdings_write'],
	'holdings_write': ['admin', 'president', 'vice_president', 'holdings_write'],
	'secretary': ['admin', 'president', 'vice_president', 'secretary'],
	'president': ['president'],
	'vice_president': ['vice_president'],
	'admin': ['admin', 'president', 'vice_president'],
	'super_admin': ['admin'],
};

export type RequiredRole = keyof typeof ROLE_PERMISSIONS;

export function hasAccess(userRole: UserRole | undefined, requiredRole: RequiredRole): boolean {
	if (!userRole) return false;
	return ROLE_PERMISSIONS[requiredRole].includes(userRole);
}

export function useAuth() {
	const { data: session, status } = useSession();

	const isAuthenticated = status === 'authenticated';
	const isLoading = status === 'loading';
	const role = session?.user?.role as UserRole | undefined;

	const checkAccess = (requiredRole: RequiredRole) => {
		return hasAccess(role, requiredRole);
	};

	const hasHoldingsReadAccess = () => checkAccess('holdings_read');
	const hasAdminDashboardAccess = () => checkAccess('admin_dashboard');
	const hasHoldingsWriteAccess = () => checkAccess('holdings_write');
	const hasSecretaryAccess = () => checkAccess('secretary');
	const hasAdminAccess = () => checkAccess('admin');
	const hasSuperAdminAccess = () => checkAccess('super_admin');

	return {
		session,
		status,
		isAuthenticated,
		isLoading,
		role,
		checkAccess,
		hasHoldingsReadAccess,
		hasAdminDashboardAccess,
		hasHoldingsWriteAccess,
		hasSecretaryAccess,
		hasAdminAccess,
		hasSuperAdminAccess,
	};
}