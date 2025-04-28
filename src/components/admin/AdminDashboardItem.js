'use client';

import Link from 'next/link';
import { BoxBase } from '../Boxes';

export default function AdminDashboardItem({ title, description, href }) {
	return (
		<Link href={href} className="block">
			<BoxBase className="h-full transition-transform hover:scale-[1.02] hover:shadow-md">
				<h2 className="text-xl font-semibold mb-4">{title}</h2>
				<p className="mb-4">{description}</p>
				<div className="text-blue-500 font-medium">
					Manage {title.replace(' Management', '')} →
				</div>
			</BoxBase>
		</Link>
	);
}