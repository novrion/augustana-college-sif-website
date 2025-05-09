import Link from "next/link";


interface EmptyButtonProps {
	onClick: () => void;
	text: string;
	isLoading: boolean;
	loadingText?: string;
	type?: "button" | "submit" | "reset" | undefined;
	className?: string;
}

export function EmptyButton({ onClick, text, isLoading = false, loadingText = 'Loading...', type = 'button', className = '' }: EmptyButtonProps) {
	return (
		<button
			type={type}
			onClick={onClick}
			disabled={isLoading}
			className={`${className} rounded-full border border-solid border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm h-10 px-4 disabled:opacity-50`}
		>
			{isLoading ? loadingText : text}
		</button>
	);
}


interface FilledButtonProps {
	onClick?: () => void;
	text: string;
	isLoading: boolean;
	loadingText?: string;
	type?: "button" | "submit" | "reset" | undefined;
	className?: string;
}

export function FilledButton({ onClick, text, isLoading = false, loadingText = 'Loading...', type = 'button', className = '' }: FilledButtonProps) {
	return (
		<button
			type={type}
			onClick={onClick}
			disabled={isLoading}
			className={`${className} rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#ccc] font-medium text-sm h-10 px-4 disabled:opacity-50`}
		>
			{isLoading ? loadingText : text}
		</button>
	);
}


interface EmptyLinkButtonProps {
	text: string;
	href: string;
	className?: string;
}

export function EmptyLinkButton({ text, href, className = '' }: EmptyLinkButtonProps) {
	return (
		<Link
			href={href}
			className={`${className} rounded-full border border-solid border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm h-10 px-4`}
		>
			{text}
		</Link>
	);
}


interface FilledLinkButtonProps {
	text: string;
	href: string;
	className?: string;
}

export function FilledLinkButton({ text, href, className = '' }: FilledLinkButtonProps) {
	return (
		<Link
			href={href}
			className={`${className} rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#ccc] font-medium text-sm h-10 px-4`}
		>
			{text}
		</Link>
	);
}


interface HoldingsLinkButtonProps {
	text: string;
	href: string;
	currentPathName: string | null;
	hasAccess: boolean;
}

export function HoldingsLinkButton({ text, href, currentPathName, hasAccess }: HoldingsLinkButtonProps) {
	return (
		<>
			{hasAccess ? (
				<Link
					href={href}
					className={`relative px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-950/40 to-teal-950/40 border border-emerald-800 group transition-all duration-300 ${currentPathName?.startsWith(href) ? 'shadow-md' : 'hover:shadow-md'} `}
				>
					<span className="font-medium text-emerald-300 group-hover:text-emerald-200 transition-colors">
						{text}
					</span>
					{currentPathName?.startsWith(href) && (
						<span className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-emerald-500 dark:bg-emerald-400 rounded-full" />
					)}
				</Link>
			) : (
				<span className="opacity-50 px-4 py-1.5 text-gray-500">{text}</span>
			)}
		</>
	);
}


export function LogInLinkButton() {
	return (
		<Link
			href="/login"
			className="flex items-center gap-2 hover:underline font-bold text-blue-600"
		>
			Log in
		</Link>
	);
}


interface SignOutButtonProps {
	onClick: () => void;
}

export function SignOutButton({ onClick }: SignOutButtonProps) {
	return (
		<button
			onClick={onClick}
			className="block w-full text-left px-4 py-2 hover:bg-gray-700 text-red-500"
		>
			Sign out
		</button>);
}


interface EditLinkButtonProps {
	href: string;
	onClick?: (e: React.MouseEvent) => void;
	className?: string;
}

export function EditLinkButton({ href, onClick, className = '' }: EditLinkButtonProps) {
	return (
		<Link
			href={href}
			className={`px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md ${className}`}
			onClick={onClick}
		>
			Edit
		</Link>
	);
}


interface DeleteButtonProps {
	onClick: (e: React.MouseEvent) => void;
	className?: string;
}

export function DeleteButton({ onClick, className = '' }: DeleteButtonProps) {
	return (
		<button
			onClick={onClick}
			className={`px-3 py-1 text-sm bg-red-600 hover:bg-red-800 text-white rounded-md ${className}`}
		>
			Delete
		</button>
	);
}