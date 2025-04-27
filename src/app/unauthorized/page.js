import Link from 'next/link';

export default function UnauthorizedPage() {
	return (
		<div className="min-h-screen p-8 sm:p-20 flex flex-col items-center justify-center font-[family-name:var(--font-geist-mono)]">
			<div className="text-center max-w-md rounded-lg p-6">
				<h1 className="text-3xl font-bold mb-4">Access Denied</h1>
				<p className="mb-6">
					You don&apos;t have permission to access this page. If you believe this is an error, please contact an administrator.
				</p>
				<Link
					href="/"
					className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm h-10 px-4"
				>
					Return to Home
				</Link>
			</div>
		</div>
	);
}