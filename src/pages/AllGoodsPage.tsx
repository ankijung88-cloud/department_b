import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getGoods } from '../api/goods';
import { Good } from '../types';
import { CheckoutModal } from '../components/common/CheckoutModal';
import { ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LoginModal from '../components/auth/LoginModal';
import { formatImageUrl } from '../api/client';

const AllGoodsPage: React.FC = () => {
    const [goods, setGoods] = useState<Good[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedGood, setSelectedGood] = useState<Good | null>(null);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        const fetchGoods = async () => {
            setLoading(true);
            try {
                const data = await getGoods();
                setGoods(data);
            } catch (error) {
                console.error('Failed to fetch goods:', error);
            } finally {
                setLoading(false);
            }
        };

        window.scrollTo(0, 0);
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

    return (
        <div className="pt-20 pb-24 min-h-screen bg-charcoal">
            {/* Header Section */}
            <header className="relative h-[30vh] min-h-[250px] flex items-center justify-center overflow-hidden mb-12">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1534452286337-a9a4ad73c757?q=80&w=2070&auto=format&fit=crop"
                        alt="Goods Background"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" />
                </div>

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4 tracking-tight">
                            Exclusive Goods
                        </h1>
                        <p className="text-lg text-white/60 font-light max-w-2xl mx-auto">
                            KOGO만의 특별한 감성이 담긴 프리미엄 굿즈 컬렉션입니다.
                        </p>
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: 60 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="h-1 bg-dancheong-red mx-auto mt-6"
                        />
                    </motion.div>
                </div>
            </header>

            <div className="container mx-auto px-6">
                <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
                <CheckoutModal
                    isOpen={isCheckoutOpen}
                    onClose={() => setIsCheckoutOpen(false)}
                    good={selectedGood}
                />

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-dancheong-red"></div>
                        <div className="text-white/60">불러오는 중...</div>
                    </div>
                ) : goods.length === 0 ? (
                    <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/5">
                        <p className="text-white/40 text-lg">등록된 굿즈가 없습니다.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {goods.map((good, index) => (
                            <motion.div
                                key={good.id}
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.5) }}
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
                )}
            </div>
        </div>
    );
};

export default AllGoodsPage;
