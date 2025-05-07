import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/auth';
import { getUserById } from '@/lib/api/db';
import ProfileForm from '@/components/auth/ProfileForm';
import { User } from '@/lib/types';

export default async function ProfilePage() {
	const session = await getSession();
	if (!session) { redirect('/login?callbackUrl=/profile'); }

	const userData = await getUserById(session?.user?.id);

	return (
		<div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-mono)]">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-3xl font-bold mb-8">
					Your Profile
				</h1>

				<ProfileForm
					initialUserData={userData as User}
					session={session}
				/>
			</div>
		</div>
	);
}