import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getFeaturedProducts } from '../../api/products';
import { FeaturedItem } from '../../types';
import { useTranslation } from 'react-i18next';
import { getLocalizedText } from '../../utils/i18nUtils';

export const FeaturedSection: React.FC = () => {
    const [products, setProducts] = useState<FeaturedItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { t, i18n } = useTranslation();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getFeaturedProducts();
                setProducts(data);
            } catch (err) {
                console.error('Failed to fetch products:', err);
                setError(t('common.error'));
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [t]);

    if (loading) {
        return (
            <section className="py-24 bg-[#2a2a2a] text-center">
                <div className="text-white">{t('common.loading')}</div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="py-24 bg-[#2a2a2a] text-center">
                <div className="text-red-500">{error}</div>
            </section>
        );
    }

    return (
        <section className="py-24 bg-[#2a2a2a]">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-sm font-bold tracking-widest text-dancheong-red mb-3 uppercase">Curation</h2>
                        <h3 className="text-3xl md:text-4xl font-serif font-bold text-white">{t('featured.title')}</h3>
                    </motion.div>

                    <motion.button
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="hidden md:block text-white/60 hover:text-white transition-colors border-b border-transparent hover:border-white pb-1"
                    >
                        {t('common.view_all')}
                    </motion.button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map((item, index) => (
                        <Link to={`/detail/${item.id}`} key={item.id} className="block group">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-charcoal rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
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
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-white/40">{t('common.view_details')}</span>
                                        <span className="w-8 h-[1px] bg-white/20 group-hover:bg-dancheong-red group-hover:w-12 transition-all duration-300"></span>
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>

                <div className="mt-12 text-center md:hidden">
                    <button className="text-white/60 hover:text-white border border-white/20 px-6 py-3 rounded-full text-sm">
                        {t('common.view_all')}
                    </button>
                </div>
            </div>
        </section>
    );
};
