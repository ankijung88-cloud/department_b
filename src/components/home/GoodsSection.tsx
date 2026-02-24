import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getGoods } from '../../api/goods';
import { Good } from '../../types';
import { CheckoutModal } from '../common/CheckoutModal';
import { ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import LoginModal from '../auth/LoginModal';
import { formatImageUrl } from '../../api/client';

export const GoodsSection: React.FC = () => {
    const [goods, setGoods] = useState<Good[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedGood, setSelectedGood] = useState<Good | null>(null);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const { user } = useAuth();

    const ITEMS_PER_PAGE = 10;
    const totalPages = Math.ceil(goods.length / ITEMS_PER_PAGE);
    const currentGoods = goods.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE);

    const handleNextPage = () => {
        setCurrentPage((prev) => (prev + 1) % totalPages);
    };

    const handlePrevPage = () => {
        setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
    };

    useEffect(() => {
        const fetchGoods = async () => {
            try {
                const data = await getGoods();
                setGoods(data);
            } catch (error) {
                console.error('Failed to load goods:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchGoods();
    }, []);

    const handleBuyClick = (good: Good) => {
        if (!user) {
            setShowLoginModal(true);
            return;
        }
        setSelectedGood(good);
        setIsCheckoutOpen(true);
    };

    if (loading) return null; // Or show a loading skeleton if preferred

    return (
        <section className="min-h-screen flex flex-col justify-center py-24 bg-charcoal w-full relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#2a2a2a] to-transparent pointer-events-none" />

            <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
            <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                good={selectedGood}
            />

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="mb-8 md:mb-0"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight font-serif">
                            Exclusive Goods
                        </h2>
                        <p className="text-white/60 text-lg max-w-xl font-light">
                            단청백화점만의 특별한 굿즈를 만나보세요. 소장 가치 있는 아이템들을 준비했습니다.
                        </p>
                    </motion.div>

                    <Link
                        to="/all-goods"
                        className="hidden md:block text-white/60 hover:text-white transition-colors border-b border-transparent hover:border-white pb-1"
                    >
                        전체보기
                    </Link>
                </div>

                {goods.length === 0 ? (
                    <div className="w-full flex justify-center items-center py-20 border border-white/5 rounded-2xl bg-white/5">
                        <p className="text-white/40 text-lg">현재 준비된 특별한 굿즈가 없습니다.</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
                            {currentGoods.map((good, index) => (
                                <motion.div
                                    key={good.id}
                                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: (index % 5) * 0.1 }}
                                    className="bg-[#2a2a2a] rounded-2xl overflow-hidden border border-white/5 hover:border-white/20 transition-all group flex flex-col h-full"
                                >
                                    <div className="relative aspect-square overflow-hidden bg-black/50">
                                        <img
                                            src={formatImageUrl(good.image_url)}
                                            alt={good.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        {good.stock <= 0 && (
                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                                                <span className="text-white font-bold px-4 py-2 border border-white rounded backdrop-blur-md">SOLD OUT</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-6 flex-1 flex flex-col">
                                        <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{good.name}</h3>
                                        <p className="text-white/60 text-sm mb-4 line-clamp-2 flex-1">{good.description}</p>

                                        <div className="flex items-center justify-between mt-auto">
                                            <span className="text-xl font-bold text-dancheong-red">
                                                {Number(good.price).toLocaleString()}원
                                            </span>
                                            <button
                                                onClick={() => handleBuyClick(good)}
                                                disabled={good.stock <= 0}
                                                className="bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:hover:bg-white/10 text-white p-3 rounded-full transition-colors flex items-center justify-center"
                                                aria-label="Buy"
                                            >
                                                <ShoppingBag size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-8 mt-16">
                                <button
                                    onClick={handlePrevPage}
                                    className="bg-white/5 hover:bg-dancheong-red text-white p-4 rounded-full transition-all duration-300 shadow-lg border border-white/10 group"
                                    aria-label="Previous Page"
                                >
                                    <ChevronLeft size={28} className="group-hover:scale-110 transition-transform" />
                                </button>

                                <div className="flex gap-2">
                                    {[...Array(totalPages)].map((_, i) => (
                                        <div
                                            key={i}
                                            className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentPage ? 'bg-dancheong-red w-6' : 'bg-white/20'}`}
                                        />
                                    ))}
                                </div>

                                <button
                                    onClick={handleNextPage}
                                    className="bg-white/5 hover:bg-dancheong-red text-white p-4 rounded-full transition-all duration-300 shadow-lg border border-white/10 group"
                                    aria-label="Next Page"
                                >
                                    <ChevronRight size={28} className="group-hover:scale-110 transition-transform" />
                                </button>
                            </div>
                        )}

                        <div className="mt-12 text-center md:hidden">
                            <Link
                                to="/all-goods"
                                className="inline-block text-white/60 hover:text-white border border-white/20 px-6 py-3 rounded-full text-sm"
                            >
                                전체보기
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
};
