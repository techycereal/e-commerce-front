import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export async function POST(req: Request): Promise<Response> {
    try {
      const body = await req.json()
      const paymentIntent = `${process.env.PAYMENT_INTENT}`
      const response = await axios.post(paymentIntent, body)
      return Response.json(response.data)
    } catch (error) {
        return Response.json({ error: error });
    }
}