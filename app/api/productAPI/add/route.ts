import { BlobServiceClient } from '@azure/storage-blob';
import { v4 as uuidv4 } from 'uuid';
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
    const formData = await request.formData();
    const file: any = formData.get('file');
    const name = formData.get('name');
    const category = formData.get('category');
    const desc = formData.get('desc');
    const longDesc = formData.get('longDesc');
    const price = formData.get('price');
    const _id = formData.get('_id');

    if (!file) {
      return NextResponse.json({ msg: 'No file provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const blobName = uuidv4() + '-' + file.name;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    try {
      await blockBlobClient.uploadData(buffer);
      const url = blockBlobClient.url;
      const addProduct = `${process.env.ADD_PRODUCT_URL}`
      await axios.post(addProduct, {
        name,
        category,
        desc,
        longDesc,
        price,
        _id,
        url: url,
      }, {headers: {Authorization: `Bearer ${authToken}`}});

      return NextResponse.json({ url: url });
    } catch (error) {
      console.error('Error uploading to Azure Blob Storage:', error);
      return NextResponse.json({ msg: 'Error uploading file' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error handling request:', error);
    return NextResponse.json({ msg: 'Error processing request' }, { status: 500 });
  }
}