'use client';

import React from 'react';
import AdminListItem from './AdminListItem';

interface AdminListItemWithOrderingProps {
	title: string;
	subtitle?: string | React.ReactNode;
	actions: React.ReactNode;
	onClick?: () => void;
	className?: string;
	onMoveUp: () => void;
	onMoveDown: () => void;
	canMoveUp: boolean;
	canMoveDown: boolean;
	isReordering?: boolean;
	leftComponent?: React.ReactNode;
}

export default function AdminListItemWithOrdering({
	title,
	subtitle,
	actions,
	onClick,
	className = '',
	onMoveUp,
	onMoveDown,
	canMoveUp,
	canMoveDown,
	isReordering = false,
	leftComponent
}: AdminListItemWithOrderingProps) {
	return (
		<AdminListItem
			title={title}
			subtitle={subtitle}
			className={className}
			onClick={onClick}
			leftComponent={leftComponent}
			actions={
				<>
					<div className="flex mr-4">
						<button
							onClick={(e) => {
								e.stopPropagation();
								onMoveUp();
							}}
							disabled={!canMoveUp || isReordering}
							className="p-1 text-gray-400 hover:text-white disabled:opacity-30"
							title="Move up"
						>
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
								<polyline points="18 15 12 9 6 15"></polyline>
							</svg>
						</button>

						<button
							onClick={(e) => {
								e.stopPropagation();
								onMoveDown();
							}}
							disabled={!canMoveDown || isReordering}
							className="p-1 text-gray-400 hover:text-white disabled:opacity-30"
							title="Move down"
						>
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
								<polyline points="6 9 12 15 18 9"></polyline>
							</svg>
						</button>
					</div>
					{actions}
				</>
			}
		/>
	);
}