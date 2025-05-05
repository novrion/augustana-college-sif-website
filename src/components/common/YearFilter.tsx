'use client';

interface YearFilterProps {
	years: number[];
	currentYear: string | null;
	onChange: (year: string | null) => void;
}

export default function YearFilter({ years, currentYear, onChange }: YearFilterProps) {
	return (
		<div className="flex flex-wrap gap-2">
			<button
				onClick={() => onChange(null)}
				className={`px-3 py-1 rounded-md text-sm ${!currentYear
					? 'bg-foreground text-background'
					: 'border border-white/[.145] hover:bg-[#1a1a1a]'
					}`}
			>
				All
			</button>

			{years.map((year) => (
				<button
					key={year}
					onClick={() => onChange(year.toString())}
					className={`px-3 py-1 rounded-md text-sm ${currentYear === year.toString()
						? 'bg-foreground text-background'
						: 'border border-white/[.145] hover:bg-[#1a1a1a]'
						}`}
				>
					{year}
				</button>
			))}
		</div>
	);
}