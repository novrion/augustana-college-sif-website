import { redirect } from 'next/navigation';
import { hasAdminAccess } from '../../lib/auth';
import AdminDashboardItem from '../../components/admin/AdminDashboardItem';

export default async function AdminPage() {
	const hasAccess = await hasAdminAccess();
	if (!hasAccess) {
		redirect('/unauthorized');
	}

	// Dashboard items configuration
	const dashboardItems = [
		{
			title: "User Management",
			description: "Manage user accounts and permissions",
			href: "/admin/users"
		},
		{
			title: "Portfolio Management",
			description: "Add, edit, or remove portfolio holdings",
			href: "/admin/portfolio"
		},
		{
			title: "Newsletter Management",
			description: "Create and edit newsletter posts",
			href: "/admin/newsletter"
		},
		{
			title: "Guest Speakers",
			description: "Manage guest speaker events for the fund",
			href: "/admin/speakers"
		},
		{
			title: "Gallery Management",
			description: "Upload and manage gallery images",
			href: "/admin/gallery"
		},
		{
			title: "Meeting Minutes Management",
			description: "Create, edit, and manage meeting minutes",
			href: "/admin/meeting-minutes"
		},
		{
			title: "About Us Management",
			description: "Create, edit, and manage sections in the About Us page",
			href: "/admin/about"
		},
	];

	return (
		<div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-mono)]">
			<div className="max-w-6xl mx-auto">
				<h1 className="text-3xl font-bold mb-6">
					Admin Dashboard
				</h1>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
					{dashboardItems.map((item, index) => (
						<AdminDashboardItem
							key={index}
							title={item.title}
							description={item.description}
							href={item.href}
						/>
					))}
				</div>
			</div>
		</div>
	);
}