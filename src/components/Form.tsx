import StatusMessage from "@/components/common/StatusMessage";

interface FormProps {
	children: React.ReactNode;
	onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
	title: string;
	error: string;
	success?: string;
	className?: string;
}

export default function Form({ children, onSubmit, title, error, success = '', className = '' }: FormProps) {
	return (
		<div className={`min-w-100 rounded-lg border border-solid border-white/[.145] p-6 w-full ${className}`}>
			<h2 className="text-2xl font-bold mb-6 text-center font-[family-name:var(--font-geist-mono)]">
				{title}
			</h2>

			{error && <StatusMessage type="error" message={error} />}
			{success && <StatusMessage type="success" message={success} />}

			<form
				onSubmit={onSubmit}
				className={className}
			>
				{children}
			</form>
		</div>
	);
}