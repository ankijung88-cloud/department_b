import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

import { FEATURED_ITEMS } from '../data/mockData'; // Fixed import name
import { ArrowLeft, Calendar, MapPin, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { getLocalizedText } from '../utils/i18nUtils';

export const DetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const item = FEATURED_ITEMS.find(i => i.id === id);
    const { t, i18n } = useTranslation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (!item) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center text-white">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">{t('common.no_content')}</h2>
                    <Link to="/" className="text-dancheong-red hover:underline">{t('common.back_home')}</Link>
                </div>
            </div>
        );
    }

    return (
        <article className="pt-20 min-h-screen bg-charcoal text-white">
            {/* Header / Hero */}
            <div className="relative h-[60vh] w-full">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${item.imageUrl})` }}
                >
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
                </div>

                <div className="relative z-10 container mx-auto px-6 h-full flex flex-col justify-end pb-12">
                    <Link to="/" className="inline-flex items-center text-white/60 hover:text-white mb-6 transition-colors">
                        <ArrowLeft size={20} className="mr-2" />
                        {t('common.back')}
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <span className="bg-dancheong-red px-3 py-1 text-xs font-bold rounded-full mb-4 inline-block">
                            {item.category}
                        </span>
                        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">{getLocalizedText(item.title, i18n.language)}</h1>
                        <div className="flex flex-wrap gap-6 text-white/80 text-sm">
                            {item.date && (
                                <div className="flex items-center">
                                    <Calendar size={16} className="mr-2 text-dancheong-green" />
                                    {getLocalizedText(item.date, i18n.language)}
                                </div>
                            )}
                            {item.location && (
                                <div className="flex items-center">
                                    <MapPin size={16} className="mr-2 text-dancheong-green" />
                                    {getLocalizedText(item.location, i18n.language)}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Content Body */}
            <div className="container mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-8">
                    <section>
                        <h3 className="text-2xl font-bold font-serif mb-6 border-l-4 border-dancheong-green pl-4">{t('common.detail_intro')}</h3>
                        <p className="text-lg leading-relaxed text-white/80 whitespace-pre-line">
                            {getLocalizedText(item.description, i18n.language)}
                        </p>
                        {/* Added mock content for richer detail view */}
                        <p className="mt-4 text-white/70 leading-relaxed">
                            {/* This part can be localized later, for now we will just use a generic description or keep it hardcoded if needed, but optimally should be in item description */}
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold mb-4">Gallery</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <img src={item.imageUrl} alt="Gallery 1" className="rounded-lg w-full h-48 object-cover hover:opacity-90 transition-opacity" />
                            <img src="https://images.unsplash.com/photo-1546872935-8e62d377b5a1?q=80&w=2574&auto=format&fit=crop" alt="Gallery 2" className="rounded-lg w-full h-48 object-cover hover:opacity-90 transition-opacity" />
                        </div>
                    </section>
                </div>

                {/* Sidebar / CTA */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 bg-[#2a2a2a] p-6 rounded-xl border border-white/5 shadow-2xl">
                        <h3 className="text-xl font-bold mb-6">{t('common.booking')}</h3>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between items-center border-b border-white/10 pb-4">
                                <span className="text-white/60">{t('common.price')}</span>
                                <span className="text-xl font-bold text-dancheong-red">{getLocalizedText(item.price || '', i18n.language)}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-white/10 pb-4">
                                <span className="text-white/60">{t('common.duration')}</span>
                                <span>{t('common.duration_value')}</span>
                            </div>
                        </div>

                        <button className="w-full bg-dancheong-red hover:bg-red-700 text-white py-4 rounded-lg font-bold text-lg mb-4 transition-colors shadow-lg">
                            {t('common.booking')}
                        </button>

                        <button className="w-full bg-transparent border border-white/20 hover:bg-white/5 text-white py-3 rounded-lg font-medium transition-colors flex justify-center items-center">
                            <Share2 size={18} className="mr-2" />
                            {t('common.share')}
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default DetailPage;
