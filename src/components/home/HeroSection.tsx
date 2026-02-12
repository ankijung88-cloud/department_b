import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const HeroSection: React.FC = () => {
    const { t } = useTranslation();

    return (
        <section className="relative h-screen w-full overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center z-0"
                style={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1546872935-8e62d377b5a1?q=80&w=2574&auto=format&fit=crop")',
                }}
            >
                <div className="absolute inset-0 bg-black/40" /> {/* Create overlay for text readability */}
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-6 h-full flex flex-col justify-center items-start">
                <motion.h1
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight"
                >
                    {t('hero.title')}
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl font-light"
                >
                    {t('hero.subtitle')}
                </motion.p>

                <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="bg-dancheong-red hover:bg-red-700 text-white px-8 py-4 rounded-full text-lg font-medium flex items-center space-x-2 transition-colors shadow-lg"
                >
                    <span>{t('hero.cta')}</span>
                    <ArrowRight size={20} />
                </motion.button>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white/70"
            >
                <span className="text-sm tracking-widest uppercase">Scroll Down</span>
            </motion.div>
        </section >
    );
};
