import { redirect } from 'next/navigation';
import { getSession } from '../../lib/auth';
import SignupForm from '../../components/auth/SignupForm';

export default async function SignupPage() {
	// Check if user is already logged in
	const session = await getSession();

	if (session) {
		redirect('/');
	}

	return (
		<div className="min-h-screen p-8 sm:p-20 flex flex-col items-center justify-center font-[family-name:var(--font-geist-mono)]">
			<div className="w-full max-w-md">
				<SignupForm />
			</div>
		</div>
	);
}