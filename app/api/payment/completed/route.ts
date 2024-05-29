
import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export async function GET(req: Request): Promise<Response> {
    try {
      const headers = req.headers;
      const authToken = headers.get('authorization');
      const findCompleted = `${process.env.FIND_COMPLETED_URL}`
      const response = await axios.get(findCompleted, {
        headers: { Authorization: `Bearer ${authToken}` }
      })
      return Response.json(response.data)
    } catch (error) {
        return Response.json({ error: error }, { status: 500 });
    }
}


export async function POST(req: Request): Promise<Response> {
    try {
      const body = await req.json()
      const headers = req.headers
      const authToken = headers.get('authorization');
      const completeOrders = `${process.env.COMPLETE_ORDERS_URL}`
      const response = await axios.post(completeOrders, body, {
        headers: { Authorization: `Bearer ${authToken}` }
      })
      return Response.json(response.data)
    } catch (error) {
        return Response.json({ error: error }, { status: 500 });
    }
}