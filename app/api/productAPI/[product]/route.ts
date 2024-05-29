import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export async function GET(Request: Request, { params }: { params: { product: string } }): Promise<Response> {

    try {
        const headers = Request.headers
        const authToken = headers.get('authorization');

        const url = `${process.env.SPECIFIC_PRODUCT_URL}/${params.product}`
        const response = await axios.get(url, {headers: {Authorization: `Bearer ${authToken}`}});
        return Response.json({data: response.data});
    } catch (error) {
        console.error('Error making POST request:', error);

        return Response.json({ msg: 'Error' }, { status: 500 });
    }
}

