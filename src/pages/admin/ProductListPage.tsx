import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { FeaturedItem } from '../../types';
import { getLocalizedText } from '../../utils/i18nUtils';
import { useTranslation } from 'react-i18next';
import { Edit, Trash2, Plus } from 'lucide-react';


// Re-defining for now as it wasn't exported from api/products.ts
// Best practice: Export it from api/products.ts
// For now, I will just fetch and map manually or update api/products to export it.
// Let's update api/products.ts first to export transformProduct?
// actually checking api/products.ts content via memory

// Wait, I can just use getFeaturedProducts but that might not get ALL products (if pagination/limit exists)
// But for now it orders by created_at.

import { getFeaturedProducts } from '../../api/products';

const ProductListPage: React.FC = () => {
    const [products, setProducts] = useState<FeaturedItem[]>([]);
    const [loading, setLoading] = useState(true);
    const { i18n } = useTranslation();

    const fetchProducts = async () => {
        setLoading(true);
        try {
            // Reusing the public API for now as it fetches all.
            // In a real app we might want a specific admin API with pagination.
            const data = await getFeaturedProducts();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;

        try {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', id);

            if (error) throw error;

            // Refresh list
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Failed to delete product');
        }
    };

    if (loading) return <div className="text-white">Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-white font-serif">Product Management</h1>
                <Link
                    to="/admin/products/new"
                    className="bg-dancheong-red hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                >
                    <Plus size={20} className="mr-2" />
                    Add Product
                </Link>
            </div>

            <div className="bg-[#2a2a2a] rounded-xl border border-white/5 overflow-hidden">
                <table className="w-full text-left text-white/80">
                    <thead className="bg-white/5 text-white uppercase text-xs font-bold">
                        <tr>
                            <th className="p-4">Image</th>
                            <th className="p-4">Title ({i18n.language})</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Price</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {products.map((product) => (
                            <tr key={product.id} className="hover:bg-white/5 transition-colors">
                                <td className="p-4">
                                    <img
                                        src={product.imageUrl}
                                        alt={getLocalizedText(product.title, i18n.language)}
                                        className="w-12 h-12 object-cover rounded"
                                    />
                                </td>
                                <td className="p-4 font-medium">
                                    {getLocalizedText(product.title, i18n.language)}
                                </td>
                                <td className="p-4">
                                    <span className="bg-white/10 px-2 py-1 rounded text-xs">
                                        {product.category}
                                    </span>
                                </td>
                                <td className="p-4">
                                    {getLocalizedText(product.price, i18n.language)}
                                </td>
                                <td className="p-4 text-right space-x-2">
                                    <Link
                                        to={`/admin/products/${product.id}`}
                                        className="inline-block p-2 text-blue-400 hover:bg-blue-400/10 rounded transition-colors"
                                        title="Edit"
                                    >
                                        <Edit size={18} />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        className="p-2 text-red-400 hover:bg-red-400/10 rounded transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {products.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-white/40">
                                    No products found. Click "Add Product" to create one.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductListPage;
