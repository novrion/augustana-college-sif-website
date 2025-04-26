import Box from './Box';

export default function BoxGrid({ boxes }) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
			{boxes.map((box, index) => (
				<Box
					key={index}
					title={box.title}
					description={box.description}
					link={box.link}
					linkText={box.linkText}
				/>
			))}
		</div>
	);
}