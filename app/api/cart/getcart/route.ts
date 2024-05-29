import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export async function GET(Request: Request): Promise<Response> {
    try {
        const headers = Request.headers
        const authToken = headers.get('authorization');
        const myCart = `${process.env.MY_CART_URL}`
        const result = await axios.get(myCart, {headers: {Authorization: `Bearer ${authToken}`}})
        return Response.json(result.data);
    } catch (error) {
        console.error('Error making POST request:', error);

        return Response.json({ msg: 'Error' }, { status: 500 });
    }
}

