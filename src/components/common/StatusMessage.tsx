import React from 'react';

export type StatusType = 'error' | 'success' | 'info' | 'warning';

interface StatusMessageProps {
	type: StatusType;
	message: string;
	className?: string;
}

const STATUS_STYLES = {
	error: 'text-red-700',
	success: 'text-green-500',
	info: 'text-blue-500',
	warning: 'text-yellow-500'
};

export default function StatusMessage({ type, message, className = '' }: StatusMessageProps) {
	if (!message) return null;

	return (
		<div className={`text-center p-3 rounded-md ${STATUS_STYLES[type]} font-[family-name:var(--font-geist-mono)] mb-4 ${className}`}>
			{message}
		</div>
	);
}