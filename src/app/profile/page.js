import { redirect } from 'next/navigation';
import { getSession } from '../../lib/auth';
import ProfileForm from '../../components/auth/ProfileForm';

export default async function ProfilePage() {
	// Check if user is logged in
	const session = await getSession();

	if (!session) {
		redirect('/login?callbackUrl=/profile');
	}

	return (
		<div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-mono)]">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-3xl font-bold mb-8">
					Your Profile
				</h1>

				<ProfileForm initialUserData={session.user} />
			</div>
		</div>
	);
}