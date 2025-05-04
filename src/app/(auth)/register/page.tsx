import { redirect } from 'next/navigation';
import { getSession } from "@/lib/auth/auth"
import RegisterForm from "@/components/auth/RegisterForm";

export default async function LogIn() {
	const session = await getSession();
	if (session) { redirect('/'); }

	return (
		<div className="min-h-screen p-8 sm:p-20 flex flex-col items-center justify-center">
			<RegisterForm />
		</div>
	);
}