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
      const formData = await request.formData();
      
      const name = formData.get('name');
      const category = formData.get('category');
      const desc = formData.get('desc');
      const longDesc = formData.get('longDesc');
      const price = formData.get('price');
      const _id = formData.get('_id');
      const pic: any = formData.get('pic');
      const urlPart = pic.split('/');
      const file: any = formData.get('file');
      let url = pic;
      if (file) {
        const blobNames = decodeURIComponent(urlPart[urlPart.length - 1]); // Extract the blob name from the URL
        const blockBlobClients = containerClient.getBlockBlobClient(blobNames);
        await blockBlobClients.delete();
  
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const blobName = uuidv4() + '-' + file.name;
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);
      await blockBlobClient.uploadData(buffer);
      url = blockBlobClient.url;
      }
      
      
      try {
        const headers = request.headers
        const authToken = headers.get('authorization');
        const editURL = `${process.env.EDIT_PRODUCTS_URL}`
        await axios.post(editURL, {
          url,
          name,
          category,
          desc,
          longDesc,
          price,
          _id
        }, {headers: {Authorization: `Bearer ${authToken}`}});
        return NextResponse.json({ url: url });
      } catch (error) {
        return NextResponse.json({ msg: 'Error uploading file' }, { status: 500 });
      }
    } catch (error) {
      return NextResponse.json({ msg: 'Error processing request' }, { status: 500 });
    }
  }