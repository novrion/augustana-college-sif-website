import { FilledLinkButton } from "@/components/Buttons"

interface UnexpectedProps {
	error: string;
}

export default function Unexpected({ error }: UnexpectedProps) {
	return (
		<div className="min-h-screen p-8 sm:p-20 flex flex-col items-center justify-center font-[family-name:var(--font-geist-mono)]">
			<div className="text-center max-w-md rounded-lg p-6">
				<h1 className="text-3xl font-bold mb-4">An unexpected error has occurred</h1>
				<p className="mb-6">
					{error}
				</p>

				<FilledLinkButton
					text={"Return to Home"}
					href={"/"}
				/>
			</div>
		</div>
	);
}
