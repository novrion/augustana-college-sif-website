interface FormProps {
	children;
	onSubmit: (e) => void;
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

			{error && (
				<div className="text-center mb-4 p-3 text-red-700 rounded-md font-[family-name:var(--font-geist-mono)]">
					{error}
				</div>
			)}

			{success && (
				<div className="text-center mb-4 p-3 text-green-500 rounded-md font-[family-name:var(--font-geist-mono)]">
					{success}
				</div>
			)}

			<form
				onSubmit={onSubmit}
				className={className}
			>
				{children}
			</form>
		</div>
	);
}