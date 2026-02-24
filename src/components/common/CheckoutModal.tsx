import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Landmark } from 'lucide-react';
import { Good, Order } from '../../types';
import { createOrder } from '../../api/orders';
import { useAuth } from '../../context/AuthContext';

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    good: Good | null;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, good }) => {
    const { user } = useAuth();
    const [quantity, setQuantity] = useState(1);
    const [address, setAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank'>('card');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    if (!isOpen || !good) return null;

    const totalAmount = Number(good.price) * quantity;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            alert('로그인이 필요합니다.');
            return;
        }
        if (!address.trim()) {
            alert('배송지를 입력해주세요.');
            return;
        }

        setIsSubmitting(true);
        try {
            const orderData: Partial<Order> = {
                user_id: user.id,
                total_amount: totalAmount,
                payment_method: paymentMethod,
                shipping_address: address,
                items: [{
                    goods_id: good.id,
                    quantity: quantity,
                    price: Number(good.price)
                }]
            };

            await createOrder(orderData);
            setSuccess(true);
        } catch (error) {
            console.error('Order creation failed:', error);
            alert('주문 처리 중 오류가 발생했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setSuccess(false);
        setQuantity(1);
        setAddress('');
        setPaymentMethod('card');
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleClose}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-[#2a2a2a] w-full max-w-lg rounded-2xl border border-white/10 shadow-2xl overflow-hidden relative"
                    >
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors z-10"
                        >
                            <X size={24} />
                        </button>

                        {success ? (
                            <div className="p-12 text-center">
                                <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2 font-serif">결제가 완료되었습니다!</h2>
                                <p className="text-white/60 mb-8">마이페이지에서 구매 내역 및 배송 현황을 확인하실 수 있습니다.</p>
                                <button
                                    onClick={handleClose}
                                    className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-xl transition-colors font-medium border border-white/10"
                                >
                                    닫기
                                </button>
                            </div>
                        ) : (
                            <div className="p-8">
                                <h2 className="text-2xl font-bold text-white mb-6 font-serif border-b border-white/10 pb-4">
                                    상품 결제
                                </h2>

                                <div className="flex gap-4 mb-6 bg-black/20 p-4 rounded-xl border border-white/5">
                                    <img src={good.image_url} alt={good.name} className="w-20 h-20 object-cover rounded-lg bg-black/50" />
                                    <div>
                                        <h3 className="font-bold text-white">{good.name}</h3>
                                        <p className="text-dancheong-red font-medium mt-1">{Number(good.price).toLocaleString()}원</p>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-white/80 mb-2">수량</label>
                                        <div className="flex items-center space-x-4">
                                            <button
                                                type="button"
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="w-10 h-10 rounded-lg bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition-colors"
                                            >-</button>
                                            <span className="text-white font-medium w-8 text-center">{quantity}</span>
                                            <button
                                                type="button"
                                                onClick={() => setQuantity(Math.min(good.stock, quantity + 1))}
                                                className="w-10 h-10 rounded-lg bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition-colors"
                                            >+</button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-white/80 mb-2">총 결제 금액</label>
                                        <div className="text-2xl font-bold text-dancheong-red">
                                            {totalAmount.toLocaleString()}원
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-white/80 mb-2">배송지 주소</label>
                                        <input
                                            type="text"
                                            required
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            placeholder="상세 주소를 입력해주세요"
                                            className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-dancheong-red transition-colors"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-white/80 mb-3">결제 수단</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setPaymentMethod('card')}
                                                className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${paymentMethod === 'card'
                                                    ? 'border-dancheong-red bg-dancheong-red/10 text-white'
                                                    : 'border-white/10 bg-black/20 text-white/60 hover:border-white/30'
                                                    }`}
                                            >
                                                <CreditCard size={24} className="mb-2" />
                                                <span className="text-sm font-medium">신용카드</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setPaymentMethod('bank')}
                                                className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${paymentMethod === 'bank'
                                                    ? 'border-dancheong-red bg-dancheong-red/10 text-white'
                                                    : 'border-white/10 bg-black/20 text-white/60 hover:border-white/30'
                                                    }`}
                                            >
                                                <Landmark size={24} className="mb-2" />
                                                <span className="text-sm font-medium">계좌이체</span>
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting || !user}
                                        className="w-full bg-dancheong-red hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-colors mt-4 text-lg"
                                    >
                                        {isSubmitting ? '처리 중...' : !user ? '로그인 후 결제 가능' : `${totalAmount.toLocaleString()}원 결제하기`}
                                    </button>
                                </form>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CheckoutModal;
