import axios from 'axios';

import { NextResponse } from 'next/server';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export async function POST(req: Request): Promise<Response> {
    try {
        const body = await req.json();
        const headers = req.headers
        const authToken = headers.get('authorization');
        const completePayment = `${process.env.COMPLETE_PAYMENT_URL}`
        const response = await axios.post(completePayment, body, {
            headers: { Authorization: `Bearer ${authToken}` }
          });
        return NextResponse.json(response.data, { status: response.status });
    } catch (error: any) {
        console.error('Error processing request:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
