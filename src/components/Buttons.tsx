import Link from "next/link";


interface EmptyButtonProps {
	onClick: () => void;
	text: string;
	isLoading: boolean;
	loadingText?: string;
	type?: "button" | "submit" | "reset" | undefined;
	min_w?: "0" | "full";
}

export function EmptyButton({ onClick, text, isLoading = false, loadingText = 'Loading...', type = 'button', min_w = '0' }: EmptyButtonProps) {
	return (
		<button
			type={type}
			onClick={onClick}
			disabled={isLoading}
			className={`min-w-${min_w} rounded-full border border-solid border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm h-10 px-4 disabled:opacity-50`}
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
	min_w?: "0" | "full";
}

export function FilledButton({ onClick, text, isLoading = false, loadingText = 'Loading...', type = 'button', min_w = '0' }: FilledButtonProps) {
	return (
		<button
			type={type}
			onClick={onClick}
			disabled={isLoading}
			className={`min-w-${min_w} rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#ccc] font-medium text-sm h-10 px-4 disabled:opacity-50`}
		>
			{isLoading ? loadingText : text}
		</button>
	);
}


interface EmptyLinkButtonProps {
	text: string;
	href: string;
	min_w?: "0" | "full";
}

export function EmptyLinkButton({ text, href, min_w = "0" }: EmptyLinkButtonProps) {
	return (
		<Link
			href={href}
			className={`min-w-${min_w} rounded-full border border-solid border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm h-10 px-4`}
		>
			{text}
		</Link>
	);
}


interface FilledLinkButtonProps {
	text: string;
	href: string;
	min_w?: "0" | "full";
}

export function FilledLinkButton({ text, href, min_w = "0" }: FilledLinkButtonProps) {
	return (
		<Link
			href={href}
			className={`min-w-${min_w} rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#ccc] font-medium text-sm h-10 px-4`}
		>
			{text}
		</Link>
	);
}


interface HoldingsLinkButtonProps {
	text: string;
	href: string;
	currentPathName: string;
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


interface LogInButtonProps {
	children;
	onClick: () => void;
}

export function LogInButton({ children, onClick }: LogInButtonProps) {
	return (
		<button
			onClick={onClick}
			className="flex items-center gap-2 hover:underline"
		>
			{children}
		</button>
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