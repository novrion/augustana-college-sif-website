'use client';

import React from 'react';
import StatusMessage from '@/components/common/StatusMessage';

interface AdminListProps {
	children: React.ReactNode;
	title?: string;
	error?: string;
	loadingMessage?: string;
	isLoading?: boolean;
	emptyMessage?: string;
	isEmpty?: boolean;
}

export default function AdminList({
	children,
	title,
	error,
	loadingMessage = 'Loading...',
	isLoading = false,
	emptyMessage = 'No items found.',
	isEmpty = false
}: AdminListProps) {
	return (
		<div className="space-y-4">
			{title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}

			{error && <StatusMessage type="error" message={error} />}

			{isLoading && (
				<div className="text-center p-4 text-blue-500 rounded-md mb-2">
					{loadingMessage}
				</div>
			)}

			{isEmpty ? (
				<div className="text-center py-8 text-gray-400">
					{emptyMessage}
				</div>
			) : (
				<div className="space-y-2">
					{children}
				</div>
			)}
		</div>
	);
}