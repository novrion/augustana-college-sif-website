import { NextResponse } from 'next/server';
import { getLeadershipUsers } from '@/lib/database';

export async function GET() {
	try {
		// Fetch leadership users from database
		const { president, vicePresident } = await getLeadershipUsers();

		console.log("API: President data:", president);
		console.log("API: Vice President data:", vicePresident);

		// Prepare the response data
		const presidentData = president ? {
			id: president.id,
			name: president.name,
			email: president.email,
			profile_picture: president.profile_picture || null,
			phone: president.phone || null
		} : null;

		const vicePresidentData = vicePresident ? {
			id: vicePresident.id,
			name: vicePresident.name,
			email: vicePresident.email,
			profile_picture: vicePresident.profile_picture || null,
			phone: vicePresident.phone || null
		} : null;

		console.log("API: Returning president profile picture:", presidentData?.profile_picture);
		console.log("API: Returning VP profile picture:", vicePresidentData?.profile_picture);

		return NextResponse.json({
			president: presidentData,
			vicePresident: vicePresidentData
		});
	} catch (error) {
		console.error('Error fetching leadership data:', error);
		return NextResponse.json(
			{ error: 'An error occurred while fetching leadership data' },
			{ status: 500 }
		);
	}
}