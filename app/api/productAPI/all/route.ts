import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export async function POST(Request: Request): Promise<Response> {

    try {
        const headers = Request.headers
        const authToken = headers.get('authorization');
        const body = await Request.json()
        const url = `${process.env.GET_PRODUCTS_URL}`
        const response = await axios.post(url, body, {headers: {Authorization: `Bearer ${authToken}`}});
        return Response.json({data: response.data});
    } catch (error) {
        console.error('Error making POST request:', error);

        return Response.json({ msg: 'Error' }, { status: 500 });
    }
}


