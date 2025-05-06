import { redirect } from 'next/navigation';
import { hasAdminAccess } from '@/lib/auth/auth';
import { getAllUsers } from '@/lib/api/db';
import AdminUsersList from '@/components/admin/users/AdminUsersList';
import { User } from '@/lib/types/user';
import { EmptyLinkButton } from "@/components/Buttons";
import TransferRoleButton from '@/components/admin/users/TransferRoleButton';

export default async function AdminUsersPage() {
	const hasAccess = await hasAdminAccess();
	if (!hasAccess) { redirect('/unauthorized'); }

	const users: User[] = await getAllUsers();

	return (
		<div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-mono)]">
			<div className="max-w-6xl mx-auto">
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-3xl font-bold">User Management</h1>

					<div className="flex gap-3">
						<TransferRoleButton />
						<EmptyLinkButton
							href={"/admin"}
							text={"Back to Admin"}
						/>
					</div>
				</div>

				<div className="rounded-lg border border-solid border-white/[.145] p-6">
					<h2 className="text-xl font-semibold mb-4">Users</h2>
					<AdminUsersList users={users} />
				</div>
			</div>
		</div>
	);
}