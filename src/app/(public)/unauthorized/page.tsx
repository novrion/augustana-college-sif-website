import Link from "next/link";
import { FilledLinkButton } from "@/components/Buttons"

export default function UnauthorizedPage() {
	return (
		<div className="min-h-screen p-8 sm:p-20 flex flex-col items-center justify-center font-[family-name:var(--font-geist-mono)]">
			<div className="text-center max-w-md rounded-lg p-6">
				<h1 className="text-3xl font-bold mb-4">Access Denied</h1>
				<p className="mb-6">
					You don&apos;t have permission to access this page. If you believe this is an error, please contact an administrator.
				</p>

				<FilledLinkButton
					text={"Return to Home"}
					href={"/"}
				/>
			</div>
		</div>
	);
}