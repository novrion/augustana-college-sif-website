interface FormProps {
	children;
	onSubmit: (e) => void;
	title: string;
	error: string;
}

export default function Form({ children, onSubmit, title, error }: FormProps) {
	return (
		<div className="min-w-100 rounded-lg border border-solid border-white/[.145] p-6 w-full max-w-md">
			<h2 className="text-2xl font-bold mb-6 text-center font-[family-name:var(--font-geist-mono)]">
				{title}
			</h2>

			{error && (
				<div className="text-center mb-4 p-3 text-red-700 rounded-md">
					{error}
				</div>
			)}

			<form onSubmit={onSubmit}>
				{children}
			</form>
		</div>
	);
}