
import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export async function GET(req: Request): Promise<Response> {
    try {
      const headers = req.headers;
      const authToken = headers.get('authorization');
      const getOrders = `${process.env.GET_ORDERS}`
      const response = await axios.get(getOrders, {
        headers: { Authorization: `Bearer ${authToken}` }
      })
      return Response.json(response.data)
    } catch (error) {
        return Response.json({ error: error }, { status: 500 });
    }
}