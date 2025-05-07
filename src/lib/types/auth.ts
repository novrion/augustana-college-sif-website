export const PERMISSIONS = {
	HOLDINGS_READ: ['admin', 'president', 'vice_president', 'secretary', 'holdings_write', 'holdings_read'],
	ADMIN_DASHBOARD: ['admin', 'president', 'vice_president', 'secretary', 'holdings_write'],
	HOLDINGS_WRITE: ['admin', 'president', 'vice_president', 'holdings_write'],
	SECRETARY: ['admin', 'president', 'vice_president', 'secretary'],
	ADMIN: ['admin', 'president', 'vice_president'],
	LEADERSHIP: ['president', 'vice_president'],
	PRESIDENT: ['president'],
	VICE_PRESIDENT: ['vice_president'],
	SUPER_ADMIN: ['admin'],
};

export type PermissionKey = keyof typeof PERMISSIONS;