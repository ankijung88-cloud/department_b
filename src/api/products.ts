import client from './client';
import { FeaturedItem } from '../types';

interface Product {
    id: number;
    name: string;
    description: string;
    price: string; // Decimal comes as string from DB usually, or number. Let's assume string for safety or number.
    category_id: number;
    stock: number;
    image_url: string;
    details: any;
    category_name?: string;
}

export const getFeaturedProducts = async (): Promise<FeaturedItem[]> => {
    const response = await client.get<Product[]>('/products');

    return response.data.map(product => ({
        id: product.id.toString(),
        title: product.name,
        category: product.category_name || 'General',
        description: product.description,
        imageUrl: product.image_url || 'https://via.placeholder.com/400x300', // Fallback image
        price: Number(product.price).toLocaleString() + '원', // Format price
        location: product.details?.location,
        date: product.details?.date,
    }));
};
