'use client';

import React from 'react';

interface AdminListItemProps {
	title: string;
	subtitle?: string | React.ReactNode;
	actions: React.ReactNode;
	onClick?: () => void;
	className?: string;
	leftComponent?: React.ReactNode;
}

export default function AdminListItem({
	title,
	subtitle,
	actions,
	onClick,
	className = '',
	leftComponent
}: AdminListItemProps) {
	return (
		<div
			className={`flex items-center justify-between p-4 border border-white/[.145] rounded-lg ${onClick ? 'cursor-pointer hover:bg-[#1a1a1a] transition-transform hover:scale-[1.02]' : ''} ${className}`}
			onClick={onClick}
		>
			<div className="flex items-center flex-1 min-w-0">
				{leftComponent && leftComponent}
				<div className="flex-1 min-w-0">
					<h3 className="font-semibold truncate">{title}</h3>
					{subtitle && <div className="text-gray-400 text-sm mt-1">{subtitle}</div>}
				</div>
			</div>
			<div className="flex gap-2 ml-4 flex-shrink-0">
				{actions}
			</div>
		</div>
	);
}