import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FEATURED_ITEMS } from '../data/mockData';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { getLocalizedText } from '../utils/i18nUtils';

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

    // Handle case where category might be undefined or not in map
    const categoryId = category || 'tickets';
    const filters = CATEGORY_FILTERS[categoryId];

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [categoryId]);

    if (!filters) {
        return (
            <div className="min-h-screen pt-32 text-center bg-charcoal text-white">
                <h2 className="text-2xl font-bold">Category not found</h2>
                <Link to="/" className="text-dancheong-red mt-4 inline-block">{t('common.back_home')}</Link>
            </div>
        )
    }

    // Filter items based on the category's allowed filters
    const items = FEATURED_ITEMS.filter(item =>
        filters.includes(item.category)
    );

    const isReady = filters.length > 0;

    return (
        <div className="min-h-screen bg-charcoal text-white pt-20">
            {/* Category Header */}
            <section className="py-20 bg-[#2a2a2a] relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/korean-pattern.png')]"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-charcoal/80 to-charcoal"></div>

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-serif font-bold mb-4"
                    >
                        {t(`category.${categoryId}.title`)}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-white/60 text-lg"
                    >
                        {t(`category.${categoryId}.description`)}
                    </motion.p>
                </div>
            </section>

            {/* Content Grid */}
            <section className="py-16 container mx-auto px-6">
                {!isReady ? (
                    <div className="text-center py-20 bg-white/5 rounded-lg border border-white/10">
                        <h3 className="text-2xl font-bold mb-2">Coming Soon</h3>
                        <p className="text-white/60">{t('common.no_content')}</p>
                    </div>
                ) : items.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-white/60">{t('common.no_content')}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {items.map((item, index) => (
                            <Link to={`/detail/${item.id}`} key={item.id} className="block group">
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-[#2a2a2a] rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/5"
                                >
                                    <div className="relative aspect-[4/3] overflow-hidden">
                                        <img
                                            src={item.imageUrl}
                                            alt={getLocalizedText(item.title, i18n.language)}
                                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-white uppercase tracking-wider">
                                            {item.category}
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <h4 className="text-xl font-bold text-white mb-2 group-hover:text-dancheong-red transition-colors">
                                            {getLocalizedText(item.title, i18n.language)}
                                        </h4>
                                        <p className="text-white/60 text-sm line-clamp-2 mb-4">
                                            {getLocalizedText(item.description, i18n.language)}
                                        </p>
                                        <div className="flex justify-between items-center text-sm border-t border-white/10 pt-4">
                                            <span className="text-white/80">{getLocalizedText(item.price || '', i18n.language)}</span>
                                            <span className="text-dancheong-red font-medium group-hover:underline">{t('common.view_details')}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};


export default CategoryPage;
