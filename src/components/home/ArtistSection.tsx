import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Artist } from '../../types';
import { getArtists } from '../../api/artists';

export const ArtistSection: React.FC = () => {
    const { t } = useTranslation();
    const [artists, setArtists] = React.useState<Artist[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchArtists = async () => {
            try {
                const data = await getArtists('approved');
                setArtists(data);
            } catch (error) {
                console.error('Error fetching artists:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchArtists();
    }, []);

    if (loading) return null;
    if (artists.length === 0) return null;

    return (
        <section className="py-24 bg-black overflow-hidden">
            <div className="container mx-auto px-6 mb-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center"
                >
                    <h2 className="text-sm font-bold tracking-widest text-dancheong-red mb-3 uppercase">
                        {t('artist.title')}
                    </h2>
                    <h3 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6">
                        {t('artist.subtitle')}
                    </h3>
                    <Link
                        to="/artist-apply"
                        className="inline-block px-8 py-3 bg-dancheong-red text-white text-sm font-bold rounded-full hover:bg-red-700 transition-all shadow-lg"
                    >
                        APPLY AS ARTIST
                    </Link>
                </motion.div>
            </div>

            <div className="relative">
                <motion.div
                    className="flex space-x-8 px-6 cursor-grab active:cursor-grabbing"
                    drag="x"
                    dragConstraints={{ right: 0, left: -1200 }}
                >
                    {artists.map((artist, index) => (
                        <motion.div
                            key={artist.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="flex-shrink-0 w-72 md:w-80 group"
                        >
                            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden glass-morphism border border-white/10">
                                <img
                                    src={artist.image_url}
                                    alt={artist.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                                <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                    <h4 className="text-2xl font-bold text-white mb-1">{artist.name}</h4>
                                    <p className="text-dancheong-red text-sm font-medium tracking-wider uppercase">{artist.title}</p>

                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        whileHover={{ opacity: 1, height: 'auto' }}
                                        className="mt-4 overflow-hidden"
                                    >
                                        <button className="text-white text-xs border border-white/30 px-4 py-2 rounded-full hover:bg-white hover:text-black transition-colors">
                                            VIEW PROFILE
                                        </button>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            <div className="mt-12 flex justify-center space-x-2">
                <div className="w-12 h-1 bg-dancheong-red rounded-full" />
                <div className="w-2 h-1 bg-white/20 rounded-full" />
                <div className="w-2 h-1 bg-white/20 rounded-full" />
            </div>
        </section>
    );
};

