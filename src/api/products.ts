import { supabase } from '../lib/supabaseClient';
import { FeaturedItem, LocalizedString } from '../types';
import { Database } from '../types/database.types';

type ProductRow = Database['public']['Tables']['products']['Row'];

// Helper to transform DB row to Frontend Type
// We need to cast the JSONB fields to LocalizedString because Supabase types them as Json
// Helper to transform DB row to Frontend Type
// We need to cast the JSONB fields to LocalizedString because Supabase types them as Json
export const transformProduct = (row: ProductRow): FeaturedItem => {
    return {
        id: row.id,
        title: row.title as unknown as LocalizedString,
        description: row.description as unknown as LocalizedString,
        category: row.category,
        imageUrl: row.image_url,
        date: row.date as unknown as LocalizedString,
        location: row.location as unknown as LocalizedString,
        price: row.price as unknown as LocalizedString,
    };
};

export const getFeaturedProducts = async (): Promise<FeaturedItem[]> => {
    console.log('API: getFeaturedProducts called');
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

    console.log('API: getFeaturedProducts response received', { hasData: !!data, hasError: !!error });

    if (error) {
        console.error('Error fetching products:', error.message || error);
        throw error;
    }

    return (data || []).map(transformProduct);
};

export const getProductsByCategory = async (category: string): Promise<FeaturedItem[]> => {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching products by category:', error.message || error);
        throw error;
    }

    return (data || []).map(transformProduct);
};

export const getProductById = async (id: string): Promise<FeaturedItem | null> => {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching product by id:', error.message || error);
        return null;
    }

    return data ? transformProduct(data) : null;
};

export const searchProducts = async (query: string): Promise<FeaturedItem[]> => {
    // Supabase text search on JSONB columns is tricky.
    // For simplicity, we will fetch all recent products and filter in memory if the dataset is small,
    // OR we can use the `textSearch` filter if we had a full text search column.
    // Given the current setup with JSONB titles, filtering in memory after fetching a reasonable amount is safest for now,
    // OR we can use `ilike` on a casted text column if we create a generated column.

    // Better approach for now: Fetch all high-level items (limit 100) and filter.
    // Ideally, we should have a `title_en`, `title_ko` column for search.
    // But since we are using JSONB...

    // Let's try to query where the JSONB logic might be complex.
    // A simple `ilike` won't work easily on JSONB values without casting.

    // Workaround: Select * and filter in client for this MVP.
    // Production wise: Create a generated column for full text search.
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

    if (error) {
        console.error('Error searching products:', error);
        throw error;
    }

    const allItems = (data || []).map(transformProduct);
    const lowerQuery = query.toLowerCase();

    // Client-side filtering on the fetched data
    return allItems.filter((item: FeaturedItem) => {
        // Check all languages
        const titleMatch = Object.values(item.title).some((val: unknown) => String(val).toLowerCase().includes(lowerQuery));
        const descMatch = Object.values(item.description).some((val: unknown) => String(val).toLowerCase().includes(lowerQuery));
        return titleMatch || descMatch;
    });
};
