// app/api/admin/portfolio/add-holding/route.js
import { NextResponse } from 'next/server';
import { hasAdminAccess } from '../../../../../lib/auth';
import { createHolding } from '../../../../../lib/database';

export async function POST(request) {
	try {
		const hasAccess = await hasAdminAccess();

		if (!hasAccess) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 403 }
			);
		}

		// Parse the request body
		let holdingData;
		try {
			holdingData = await request.json();
		} catch (error) {
			console.error('Error parsing request body:', error);
			return NextResponse.json(
				{ error: 'Invalid request body format' },
				{ status: 400 }
			);
		}

		// Basic validation
		if (!holdingData) {
			return NextResponse.json(
				{ error: 'No data provided' },
				{ status: 400 }
			);
		}

		// Validate required fields
		const requiredFields = ['ticker', 'company_name', 'share_count', 'cost_basis', 'current_price', 'purchase_date'];
		for (const field of requiredFields) {
			if (!holdingData[field]) {
				return NextResponse.json(
					{ error: `Missing required field: ${field}` },
					{ status: 400 }
				);
			}
		}

		// Convert numeric fields to proper format
		holdingData.share_count = parseInt(holdingData.share_count, 10);
		holdingData.cost_basis = parseFloat(holdingData.cost_basis);
		holdingData.current_price = parseFloat(holdingData.current_price);

		// Create the holding
		const holding = await createHolding(holdingData);

		if (!holding) {
			return NextResponse.json(
				{ error: 'Failed to create holding' },
				{ status: 500 }
			);
		}

		return NextResponse.json(
			{ holding, message: 'Holding created successfully' },
			{ status: 201 }
		);
	} catch (error) {
		console.error('Error creating holding:', error);
		return NextResponse.json(
			{ error: 'An error occurred while creating the holding' },
			{ status: 500 }
		);
	}
}