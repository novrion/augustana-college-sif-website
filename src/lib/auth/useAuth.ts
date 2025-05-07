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

	return {
		session,
		updateSession,
		status,
		isAuthenticated,
		isLoading,
		role,
		hasPermission,
	};
}