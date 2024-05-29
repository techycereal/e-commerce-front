import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export async function GET(request: Request): Promise<Response> {
  try {
    const headers = request.headers;
    const authToken: any = headers.get('authorization');
    const countCart = `${process.env.COUNT_CART_URL}`
    if (authToken?.split(' ').length > 1) {
        const result = await axios.get(countCart, {
            headers: { Authorization: `Bearer ${authToken}` }
          });
    return Response.json(result.data);
    }    
    return Response.json('No go');
  } catch (error) {
    console.error('Error making GET request:', error);
    return Response.json({ msg: 'Error' }, { status: 500 });
  }
}
