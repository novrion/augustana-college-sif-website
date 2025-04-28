import { redirect } from 'next/navigation';
import Link from 'next/link';
import { isAdmin } from '../../lib/auth';
import { BoxBase } from '../../components/Boxes';

export default async function AdminPage() {
	// Verify user is admin
	const isAdminUser = await isAdmin();

	if (!isAdminUser) {
		redirect('/unauthorized');
	}

	return (
		<div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-mono)]">
			<div className="max-w-6xl mx-auto">
				<h1 className="text-3xl font-bold mb-6">
					Admin Dashboard
				</h1>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
					<BoxBase>
						<h2 className="text-xl font-semibold mb-4">User Management</h2>
						<p className="mb-4">Manage user accounts and permissions</p>
						<Link
							className="text-blue-500 hover:underline font-medium"
							href="/admin/users"
						>
							Manage Users →
						</Link>
					</BoxBase>

					<BoxBase>
						<h2 className="text-xl font-semibold mb-4">Portfolio Management</h2>
						<p className="mb-4">Add, edit, or remove portfolio holdings</p>
						<Link
							className="text-blue-500 hover:underline font-medium"
							href="/admin/portfolio"
						>
							Manage Portfolio →
						</Link>
					</BoxBase>

					<BoxBase>
						<h2 className="text-xl font-semibold mb-4">Newsletter Management</h2>
						<p className="mb-4">Create and edit newsletter posts</p>
						<Link
							className="text-blue-500 hover:underline font-medium"
							href="/admin/newsletter"
						>
							Manage Newsletter →
						</Link>
					</BoxBase>

					<BoxBase>
						<h2 className="text-xl font-semibold mb-4">Gallery Management</h2>
						<p className="mb-4">Upload and manage gallery images</p>
						<Link
							className="text-blue-500 hover:underline font-medium"
							href="/admin/gallery"
						>
							Manage Gallery →
						</Link>
					</BoxBase>

					<BoxBase>
						<h2 className="text-xl font-semibold mb-4">Meeting Minutes Management</h2>
						<p className="mb-4">Create, edit, and manage meeting minutes</p>
						<Link
							className="text-blue-500 hover:underline font-medium"
							href="/admin/meeting-minutes"
						>
							Manage Meeting Minutes →
						</Link>
					</BoxBase>
				</div>
			</div>
		</div>
	);
}