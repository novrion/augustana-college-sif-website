import React from 'react';
import Link from 'next/link';

interface AdminDashboardItemProps {
	title: string;
	description: string;
	href: string;
}

const AdminDashboardItem: React.FC<AdminDashboardItemProps> = ({
	title,
	description,
	href
}) => {
	return (
		<Link
			href={href}
			className="rounded-lg border border-solid border-white/[.145] p-6 transition-colors hover:bg-[#1a1a1a] hover:border-transparent hover:scale-[1.02]"
		>
			<h2 className="text-xl font-semibold mb-2">{title}</h2>
			<p className="text-gray-400">{description}</p>
		</Link>
	);
};

export default AdminDashboardItem;