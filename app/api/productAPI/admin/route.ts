import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export async function GET(Request: Request): Promise<Response> {

    try {
        const headers = Request.headers
        const authToken = headers.get('authorization');
        const addProduct = `${process.env.ADMIN_PRODUCTS_URL}`
        const response = await axios.get(addProduct, {headers: {Authorization: `Bearer ${authToken}`}});
        return Response.json({data: response.data});
    } catch (error) {
        console.error('Error making GET request:', error);

        return Response.json({ msg: 'Error' }, { status: 500 });
    }
}


