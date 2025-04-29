import { redirect } from 'next/navigation';
import Link from 'next/link';
import { hasAdminAccess } from '../../../lib/auth';
import { getAllUsers } from '../../../lib/database';
import UserTable from '../../../components/admin/UserTable';

export default async function UsersPage() {
	const hasAccess = await hasAdminAccess();
	if (!hasAccess) {
		redirect('/unauthorized');
	}

	// Fetch all users
	const users = await getAllUsers();

	return (
		<div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-mono)]">
			<div className="max-w-6xl mx-auto">
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-3xl font-bold">
						User Management
					</h1>

					<Link
						href="/admin"
						className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm h-10 px-4"
					>
						Back to Admin
					</Link>
				</div>

				<UserTable users={users} />
			</div>
		</div>
	);
}