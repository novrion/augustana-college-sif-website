import { redirect } from 'next/navigation';
import { getSession } from '../../lib/auth';
import LoginForm from '../../components/auth/LoginForm';

export default async function LoginPage({ searchParams }) {
  const session = await getSession();
  if (session) { redirect('/'); }

  const isRegistered = (await searchParams)?.registered === 'true';

  return (
    <div className="min-h-screen p-8 sm:p-20 flex flex-col items-center justify-center font-[family-name:var(--font-geist-mono)]">
      <div className="w-full max-w-md">
        {isRegistered && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
            Registration successful! Please log in with your new account.
          </div>
        )}

        <LoginForm />
      </div>
    </div>
  );
}