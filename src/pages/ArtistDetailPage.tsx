import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Artist, FeaturedItem } from '../types';
import { getArtistById } from '../api/artists';
import { getProductsByUser } from '../api/products';
import { formatImageUrl } from '../api/client';
import { ArrowLeft, User, Package, MessageSquare } from 'lucide-react';

const ArtistDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [artist, setArtist] = useState<Artist | null>(null);
    const [products, setProducts] = useState<FeaturedItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadArtistData = async () => {
            if (!id) return;
            try {
                const artistData = await getArtistById(parseInt(id));
                if (artistData) {
                    setArtist(artistData);
                    if (artistData.user_id) {
                        const productData = await getProductsByUser(artistData.user_id);
                        setProducts(productData);
                    }
                }
            } catch (error) {
                console.error('Failed to load artist details:', error);
            } finally {
                setLoading(false);
            }
        };

        loadArtistData();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen pt-32 bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-dancheong-red border-t-transparent" />
            </div>
        );
    }

    if (!artist) {
        return (
            <div className="min-h-screen pt-32 bg-black text-center">
                <h2 className="text-2xl text-white">Artist not found</h2>
                <Link to="/" className="text-dancheong-red mt-4 inline-block underline">Keep Exploring</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white selection:bg-dancheong-red/30">
            {/* Hero Profile Section */}
            <div className="relative pt-32 pb-20 px-6">
                <div className="container mx-auto max-w-6xl">
                    <Link to="/" className="inline-flex items-center text-white/60 hover:text-white mb-12 transition-colors">
                        <ArrowLeft size={20} className="mr-2" />
                        BACK TO GALLERY
                    </Link>

                    <div className="flex flex-col md:flex-row gap-12 items-start">
                        {/* Avatar */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative w-64 h-64 md:w-80 md:h-80 flex-shrink-0"
                        >
                            <div className="absolute inset-0 rounded-2xl border border-white/10 glass-morphism overflow-hidden">
                                <img
                                    src={formatImageUrl(artist.image_url)}
                                    alt={artist.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute -inset-4 bg-dancheong-red/20 blur-3xl rounded-full -z-10 opacity-30" />
                        </motion.div>

                        {/* Info */}
                        <div className="flex-1">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                <h1 className="text-5xl md:text-7xl font-serif font-bold mb-4">{artist.name}</h1>
                                <p className="text-dancheong-red text-lg font-bold tracking-[0.2em] mb-8 uppercase">
                                    {artist.title}
                                </p>

                                <div className="space-y-6 max-w-2xl">
                                    <div className="flex items-start gap-4">
                                        <User className="text-dancheong-red mt-1 flex-shrink-0" size={20} />
                                        <p className="text-white/80 leading-relaxed text-lg whitespace-pre-wrap">
                                            {artist.bio || "No biography provided yet."}
                                        </p>
                                    </div>

                                    <div className="pt-8 border-t border-white/10 flex gap-12">
                                        <div>
                                            <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-1">Products</p>
                                            <p className="text-2xl font-serif">{products.length}</p>
                                        </div>
                                        <div>
                                            <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-1">Status</p>
                                            <p className="text-dancheong-red text-sm font-bold uppercase">{artist.status}</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Featured Products Grid */}
            <div className="bg-[#111] py-24 px-6">
                <div className="container mx-auto max-w-6xl">
                    <div className="flex items-center justify-between mb-16">
                        <div className="flex items-center gap-4">
                            <Package className="text-dancheong-red" size={28} />
                            <h2 className="text-3xl font-serif font-bold">Featured Creations</h2>
                        </div>
                    </div>

                    {products.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {products.map((product, idx) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="group"
                                >
                                    <Link to={`/detail/${product.id}`} className="block">
                                        <div className="relative aspect-[4/5] rounded-xl overflow-hidden glass-morphism border border-white/10 mb-6">
                                            <img
                                                src={formatImageUrl(product.imageUrl)}
                                                alt={product.title.ko}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <h4 className="text-lg font-bold mb-1">{product.title.ko}</h4>
                                        <p className="text-dancheong-red text-xs font-bold uppercase tracking-widest">{product.category}</p>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-32 glass-morphism rounded-2xl border border-white/5 border-dashed">
                            <Package className="mx-auto text-white/20 mb-4" size={48} />
                            <p className="text-white/40 italic">This artist hasn't listed any products yet.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Contact / Footer CTA */}
            <div className="py-24 px-6 border-t border-white/5">
                <div className="container mx-auto max-w-4xl text-center">
                    <div className="inline-block p-4 rounded-full bg-dancheong-red/10 text-dancheong-red mb-8">
                        <MessageSquare size={32} />
                    </div>
                    <h3 className="text-3xl font-serif font-bold mb-6">Collaborate with {artist.name}</h3>
                    <p className="text-white/60 mb-10 max-w-lg mx-auto"> Interested in commission or specific inquiries about their work? Reach out through our community platform. </p>
                    <Link to="/community" className="px-10 py-4 bg-dancheong-red text-white font-bold rounded-full transition-all hover:bg-white hover:text-black hover:scale-105 active:scale-95 shadow-xl">
                        SEND MESSAGE
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ArtistDetailPage;
