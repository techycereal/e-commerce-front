import { BlobServiceClient } from '@azure/storage-blob';
import { NextResponse } from 'next/server';
import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const blobServiceClient = BlobServiceClient.fromConnectionString(`${process.env.BLOB_CONNECTION}`);
const containerClient = blobServiceClient.getContainerClient('images');

export async function POST(request: Request): Promise<Response> {
  try {
    const headers = request.headers
    const authToken = headers.get('authorization');
    const body = await request.json();
    const urlParts = body.pic.split('/');
    const blobName = decodeURIComponent(urlParts[urlParts.length - 1]); // Extract the blob name from the URL
    try{
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
      await blockBlobClient.delete();
    } catch(err){
        throw Error
    }
    

    const url = `${process.env.REMOVE_PRODUCTS_URL}`
    const response = await axios.post(url, body, {headers: {Authorization: `Bearer ${authToken}`}});
    return NextResponse.json({ data: response.data });
  } catch (error) {
    return NextResponse.json({ msg: 'Error' }, { status: 500 });
  }
}
