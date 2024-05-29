'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import Joi from 'joi';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const ImageUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [name, setName] = useState<string>('');
  const [desc, setDesc] = useState<string>('');
  const [longDesc, setLongDesc] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [error, setError] = useState<string>('');
  const accessToken = useSelector((state: RootState) => state.auth.auth);

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    setFile(selectedFile);
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a file to upload');
      return;
    }
    const schema = Joi.object({
      name: Joi.string().min(1).required(),
      category: Joi.string().min(1).required(),
      desc: Joi.string().min(1).required(),
      longDesc: Joi.string().min(1).required(),
      price: Joi.number().required(),
    });

    const body = {
      name,
      category,
      desc,
      longDesc,
      price
    };
    const { error: validation } = schema.validate(body);
    if (validation) {
      setError('Please Fill Out All Fields');
    } else {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', name);
      formData.append('category', category);
      formData.append('desc', desc);
      formData.append('longDesc', longDesc);
      formData.append('price', price);

      try {
        const response = await axios.post('/api/productAPI/add', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${accessToken}`
          },
        });
        setUploadedUrl(response.data.url);
        alert('File uploaded successfully');
      } catch (error) {
        console.error('Error uploading file:', error);
        alert('Error uploading file');
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-10">
      <h2 className="text-2xl font-bold mb-6">Image Upload</h2>
      <form onSubmit={onSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md">
        <div className="mb-4">
          <input type="file" onChange={onFileChange} className="w-full text-sm text-gray-500 border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:border-indigo-500" />
        </div>
        {previewUrl && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Image Preview</h3>
            <img src={previewUrl} alt="Preview" className="w-full h-auto border border-gray-300 rounded-md" />
          </div>
        )}
        <div className="grid gap-4 mb-4">
          <input type="text" className="border border-gray-300 rounded-md p-2" placeholder="Name..." value={name} onChange={(e) => setName(e.target.value)} />
          <input type="text" className="border border-gray-300 rounded-md p-2" placeholder="Category..." value={category} onChange={(e) => setCategory(e.target.value)} />
          <input type="text" className="border border-gray-300 rounded-md p-2" placeholder="Short Description..." value={desc} onChange={(e) => setDesc(e.target.value)} />
          <input type="text" className="border border-gray-300 rounded-md p-2" placeholder="Long Description..." value={longDesc} onChange={(e) => setLongDesc(e.target.value)} />
          <input type="number" className="border border-gray-300 rounded-md p-2" placeholder="Price..." value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>
        <button type="submit" className="bg-indigo-500 text-white font-bold py-2 px-4 rounded hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600 w-full">
          Upload
        </button>
        {error && <div className="text-red-500 mt-2">{error}</div>}
      </form>
      {uploadedUrl && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Uploaded Image</h3>
          <img src={uploadedUrl} alt="Uploaded" className="w-full h-auto border border-gray-300 rounded-md" />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
