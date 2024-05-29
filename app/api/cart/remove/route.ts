import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export async function POST(Request: Request): Promise<Response> {

    try {
        const body = await Request.json()
        const headers = Request.headers
        const authToken = headers.get('authorization');
        const removeFromCart = `${process.env.REMOVE_CART_URL}`
        await axios.post(removeFromCart, body, {headers: {Authorization: `Bearer ${authToken}`}})
        return Response.json({data: 'added'});
    } catch (error) {
        console.error('Error making POST request:', error);

        return Response.json({ msg: 'Error' }, { status: 500 });
    }
}

