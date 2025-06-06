import { redirect } from 'next/navigation';
import { getSession } from "@/lib/auth/auth"
import LoginForm from "@/components/auth/LoginForm";

export default async function LogInPage({ searchParams }: { searchParams: Promise<{ registered?: string }> }) {
	const session = await getSession();
	if (session) { redirect('/'); }

	const isRegistered = (await searchParams)?.registered === 'true';

	return (
		<div className="min-h-screen p-8 sm:p-20 flex flex-col items-center justify-center">
			{isRegistered && (
				<div className="mb-4 p-3 text-green-500 rounded-md font-[family-name:var(--font-geist-mono)]">
					Registration successful
				</div>
			)}

			<LoginForm />
		</div>
	);
}