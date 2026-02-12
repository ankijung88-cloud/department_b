import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { getLocalizedText } from '../utils/i18nUtils';
import { getProductsByCategory } from '../api/products';
import { FeaturedItem, FloorCategory } from '../types';
import { FLOOR_CATEGORIES } from '../data/mockData';

// Mapping URL paths to Internal Categories (for filtering)
const CATEGORY_FILTERS: Record<string, string[]> = {
    'trend': ['Trend'],
    'tickets': ['Exhibition', 'Performance'],
    'art': ['Art', 'Experience'],
    'style': ['Style'],
    'food': ['Food'],
    'travel': ['Travel'],
    'magazine': [],
    'community': []
};

const CategoryPage: React.FC = () => {
    const { category } = useParams<{ category: string }>();
    const { t, i18n } = useTranslation();
    const [items, setItems] = useState<FeaturedItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Handle case where category might be undefined or not in map
    const categoryId = category || 'tickets';
    const targetCategories = CATEGORY_FILTERS[categoryId] || [];

    // Find current floor metadata
    const floorData = FLOOR_CATEGORIES.find(f => f.id === categoryId);

    useEffect(() => {
        let mounted = true;
        const fetchItems = async () => {
            setLoading(true);
            try {
                if (targetCategories.length === 0) {
                    if (mounted) setItems([]);
                } else {
                    // Fetch for all target categories
                    const promises = targetCategories.map(cat => getProductsByCategory(cat));
                    const results = await Promise.all(promises);
                    // Flatten array
                    const allItems = results.flat();
                    if (mounted) setItems(allItems);
                }
            } catch (error: any) {
                console.error('Failed to fetch category items:', error.message || error);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        window.scrollTo(0, 0);
        fetchItems();
        return () => { mounted = false; };
    }, [categoryId]);

    return (
        <div className="pt-20 pb-12 min-h-screen bg-[#1a1a1a]">
            {/* Stylized Header */}
            <header className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden mb-12">
                {/* Background Image with Parallax-like effect */}
                <motion.div
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0 z-0"
                >
                    <img
                        src={floorData?.bgImage || 'https://images.unsplash.com/photo-1590635327202-b53050a49826?q=80&w=2560&auto=format&fit=crop'}
                        alt=""
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
                </motion.div>

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 tracking-tight">
                            {floorData ? getLocalizedText(floorData.title, i18n.language) : categoryId}
                        </h1>
                        {floorData && (
                            <p className="text-xl md:text-2xl text-white/80 font-light max-w-2xl mx-auto">
                                {getLocalizedText(floorData.description, i18n.language)}
                            </p>
                        )}
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: 80 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="h-1 bg-dancheong-red mx-auto mt-8"
                        />
                    </motion.div>
                </div>
            </header>

            <div className="container mx-auto px-6">
                {/* Loading State */}
                {loading && (
                    <div className="text-white text-center py-20">
                        {t('common.loading')}
                    </div>
                )}

                {/* Empty State */}
                {!loading && items.length === 0 && (
                    <div className="text-white/50 text-center py-20">
                        {t('common.no_results')}
                    </div>
                )}

                {/* Items Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {items.map((item, index) => (
                        <Link to={`/detail/${item.id}`} key={item.id} className="block group">
                            <motion.article
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-[#2a2a2a] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <div className="relative aspect-[4/3] overflow-hidden">
                                    <img
                                        src={item.imageUrl}
                                        alt={getLocalizedText(item.title, i18n.language)}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full uppercase tracking-wider border border-white/10">
                                            {item.category}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-dancheong-red transition-colors line-clamp-1">
                                        {getLocalizedText(item.title, i18n.language)}
                                    </h3>
                                    <div className="flex items-center text-white/40 text-sm mb-4 space-x-4">
                                        <span>{getLocalizedText(item.date, i18n.language)}</span>
                                        <span className="w-1 h-1 bg-white/40 rounded-full" />
                                        <span className="truncate max-w-[150px]">{getLocalizedText(item.location, i18n.language)}</span>
                                    </div>
                                    <p className="text-white/60 text-sm line-clamp-2 mb-4 leading-relaxed">
                                        {getLocalizedText(item.description, i18n.language)}
                                    </p>
                                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                        <span className="text-dancheong-green font-medium">
                                            {getLocalizedText(item.price, i18n.language)}
                                        </span>
                                        <span className="text-xs text-white/30 group-hover:text-white/60 transition-colors uppercase tracking-widest">
                                            VIEW DETAILS
                                        </span>
                                    </div>
                                </div>
                            </motion.article>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategoryPage;
