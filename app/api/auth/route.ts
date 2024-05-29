import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export async function POST(Request: Request) {
    if (Request.method !== 'POST') {
        return Response.json({ message: 'Method not allowed' });
    }

    try {
        const body = await Request.json();
        const authURL: string = `${process.env.AUTH_SERVICE_URL}`
        const response = await axios.post(authURL, body);

        return Response.json({ msg: 'test', data: response.data });
    } catch (error) {
        console.error('Error making POST request:', error);

        return Response.json({ msg: 'Error' }, { status: 500 });
    }
}

