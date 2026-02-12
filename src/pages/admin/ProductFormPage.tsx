import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { getProductById } from '../../api/products';
import { FeaturedItem, LocalizedString } from '../../types';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';

const LANGUAGES = ['ko', 'en', 'ja', 'zh'];

const initialLocalized: LocalizedString = {
    ko: '',
    en: '',
    ja: '',
    zh: ''
};

const ProductFormPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEditMode = !!id;
    const { t } = useTranslation();

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEditMode);

    // Form States
    const [title, setTitle] = useState<LocalizedString>({ ...initialLocalized });
    const [description, setDescription] = useState<LocalizedString>({ ...initialLocalized });
    const [category, setCategory] = useState('Trend');
    const [imageUrl, setImageUrl] = useState('');
    const [date, setDate] = useState<LocalizedString>({ ...initialLocalized });
    const [location, setLocation] = useState<LocalizedString>({ ...initialLocalized });
    const [price, setPrice] = useState<LocalizedString>({ ...initialLocalized });

    useEffect(() => {
        if (isEditMode && id) {
            const loadProduct = async () => {
                const product = await getProductById(id);
                if (product) {
                    setTitle(product.title);
                    setDescription(product.description);
                    setCategory(product.category);
                    setImageUrl(product.imageUrl);
                    setDate(product.date);
                    setLocation(product.location);
                    setPrice(product.price);
                }
                setFetching(false);
            };
            loadProduct();
        }
    }, [id, isEditMode]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        setLoading(true);
        try {
            const { error: uploadError } = await supabase.storage
                .from('products')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('products').getPublicUrl(filePath);
            setImageUrl(data.publicUrl);
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const productData = {
            title,
            description,
            category,
            image_url: imageUrl,
            date,
            location,
            price
        };

        try {
            if (isEditMode && id) {
                const { error } = await supabase
                    .from('products')
                    .update(productData)
                    .eq('id', id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('products')
                    .insert([productData]);
                if (error) throw error;
            }
            navigate('/admin/products');
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Failed to save product');
        } finally {
            setLoading(false);
        }
    };

    const handleLocalizedChange = (
        setter: React.Dispatch<React.SetStateAction<LocalizedString>>,
        lang: string,
        value: string
    ) => {
        setter(prev => ({ ...prev, [lang]: value }));
    };

    if (fetching) return <div className="text-white p-8">Loading product...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-8">
                <Link to="/admin/products" className="text-white/60 hover:text-white mr-4 transition-colors">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="text-3xl font-bold text-white font-serif">
                    {isEditMode ? 'Edit Product' : 'Add New Product'}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 bg-[#2a2a2a] p-8 rounded-xl border border-white/5">
                {/* Image Upload */}
                <div>
                    <label className="block text-white/80 text-sm font-bold mb-2">Product Image</label>
                    <div className="flex items-center space-x-4">
                        {imageUrl && (
                            <img src={imageUrl} alt="Preview" className="w-32 h-32 object-cover rounded-lg border border-white/10" />
                        )}
                        <label className="cursor-pointer bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg border border-white/10 transition-colors flex items-center">
                            <Upload size={20} className="mr-2" />
                            Upload Image
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                        </label>
                    </div>
                </div>

                {/* Category */}
                <div>
                    <label className="block text-white/80 text-sm font-bold mb-2">Category</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-dancheong-red"
                    >
                        <option value="Trend">Trend</option>
                        <option value="Exhibition">Exhibition</option>
                        <option value="Performance">Performance</option>
                        <option value="Art">Art</option>
                        <option value="Experience">Experience</option>
                        <option value="Style">Style</option>
                        <option value="Food">Food</option>
                        <option value="Travel">Travel</option>
                    </select>
                </div>

                {/* Localized Fields */}
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-white border-b border-white/10 pb-2">content Details</h3>

                    {['Title', 'Description', 'Date', 'Location', 'Price'].map((field) => {
                        const stateMap: Record<string, [LocalizedString, React.Dispatch<React.SetStateAction<LocalizedString>>]> = {
                            'Title': [title, setTitle],
                            'Description': [description, setDescription],
                            'Date': [date, setDate],
                            'Location': [location, setLocation],
                            'Price': [price, setPrice]
                        };
                        const [state, setState] = stateMap[field];

                        return (
                            <div key={field} className="bg-white/5 p-4 rounded-lg">
                                <label className="block text-white text-sm font-bold mb-3">{field}</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {LANGUAGES.map((lang) => (
                                        <div key={lang}>
                                            <span className="text-xs text-white/40 uppercase mb-1 block">{lang}</span>
                                            {field === 'Description' ? (
                                                <textarea
                                                    value={state[lang]}
                                                    onChange={(e) => handleLocalizedChange(setState, lang, e.target.value)}
                                                    className="w-full bg-black/20 border border-white/10 rounded p-2 text-white text-sm focus:border-dancheong-red outline-none h-24"
                                                />
                                            ) : (
                                                <input
                                                    type="text"
                                                    value={state[lang]}
                                                    onChange={(e) => handleLocalizedChange(setState, lang, e.target.value)}
                                                    className="w-full bg-black/20 border border-white/10 rounded p-2 text-white text-sm focus:border-dancheong-red outline-none"
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="flex justify-end pt-6 border-t border-white/5">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-dancheong-red hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-colors flex items-center shadow-lg"
                    >
                        <Save size={20} className="mr-2" />
                        {loading ? 'Saving...' : 'Save Product'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductFormPage;
