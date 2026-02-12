import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar as CalendarIcon, MapPin, Share2, X, CheckCircle2, CreditCard, Wallet, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { getLocalizedText } from '../utils/i18nUtils';
import { getProductById } from '../api/products';
import { createBooking } from '../api/bookings';
import { FeaturedItem } from '../types';
import { useAuth } from '../context/AuthContext';
import LoginModal from '../components/auth/LoginModal';

// Helper for date formatting
const formatDate = (date: Date): string => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
};

export const DetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { t, i18n } = useTranslation();
    const { user } = useAuth();
    const [item, setItem] = useState<FeaturedItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [isBooking, setIsBooking] = useState(false);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'bank_transfer' | 'on_site' | null>(null);
    const [bookingStep, setBookingStep] = useState<'select' | 'confirm'>('select');

    // Calendar State
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    useEffect(() => {
        const fetchItem = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const data = await getProductById(id);
                setItem(data);
            } catch (error) {
                console.error('Failed to fetch product detail:', error);
            } finally {
                setLoading(false);
            }
        };

        window.scrollTo(0, 0);
        fetchItem();
    }, [id]);

    const handleShare = () => {
        if (!user) {
            setShowLoginModal(true);
            return;
        }
        setShowShareModal(true);
    };

    const handleShareSNS = (platform: 'facebook' | 'twitter' | 'more') => {
        if (!item) return;
        const url = window.location.href;
        const title = getLocalizedText(item.title, i18n.language);

        switch (platform) {
            case 'facebook':
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
                break;
            case 'twitter':
                window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
                break;
            case 'more':
                if (navigator.share) {
                    navigator.share({ title, url }).catch(console.error);
                } else {
                    handleCopyLink();
                }
                break;
        }
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
            console.error('Copy failed:', err);
        }
    };

    const handleBooking = () => {
        if (!user) {
            setShowLoginModal(true);
            return;
        }
        if (!selectedDate) {
            alert(t('common.select_date', 'Please select a date first.'));
            return;
        }
        setBookingStep('select');
        setPaymentMethod(null);
        setShowBookingModal(true);
    };

    const confirmBooking = async () => {
        if (!paymentMethod || !item || !id || !selectedDate) return;

        setIsBooking(true);
        try {
            await createBooking({
                product_id: id,
                product_name: getLocalizedText(item.title, i18n.language),
                user_email: user?.email,
                payment_method: paymentMethod,
                total_price: item.price as any, // In a real app, parse this
                // booking_date: selectedDate // If backend supports it
            });
            setBookingStep('confirm');
        } catch (error) {
            alert('예매 처리 중 오류가 발생했습니다. 다시 시도해 주세요.');
        } finally {
            setIsBooking(false);
        }
    };

    // Calendar Helper Functions
    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const renderCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);

        const days = [];
        // Empty slots for previous month
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-8 md:h-10 w-8 md:w-10" />);
        }

        const todayStr = formatDate(new Date());

        for (let day = 1; day <= daysInMonth; day++) {
            const dateObj = new Date(year, month, day);
            const dateStr = formatDate(dateObj);
            const isSelected = selectedDate === dateStr;
            const isClosed = item?.closedDays?.includes(dateStr);
            const isPast = dateStr < todayStr;
            const isDisabled = isClosed || isPast;

            let bgClass = "bg-white/5 hover:bg-white/10 text-white";
            if (isSelected) bgClass = "bg-dancheong-red text-white font-bold shadow-lg scale-105";
            else if (isDisabled) bgClass = "bg-white/5 text-white/20 cursor-not-allowed";

            days.push(
                <button
                    key={day}
                    onClick={() => !isDisabled && setSelectedDate(dateStr)}
                    disabled={isDisabled}
                    className={`h-8 md:h-10 w-8 md:w-10 rounded-full flex items-center justify-center text-sm transition-all ${bgClass}`}
                >
                    {day}
                </button>
            );
        }
        return days;
    };

    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

    if (loading) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center text-white bg-charcoal">
                <div className="text-center">
                    <p>{t('common.loading')}</p>
                </div>
            </div>
        );
    }

    if (!item) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center text-white bg-charcoal">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">{t('common.item_not_found')}</h2>
                    <Link to="/" className="text-dancheong-red hover:underline">{t('common.back_home')}</Link>
                </div>
            </div>
        );
    }

    return (
        <article className="pt-20 min-h-screen bg-charcoal text-white">
            <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />

            {/* Header / Hero */}
            <div className="relative h-[60vh] w-full">
                {item.videoUrl ? (
                    <div className="absolute inset-0 bg-black">
                        <iframe
                            className="w-full h-full object-cover opacity-60"
                            src={`https://www.youtube.com/embed/${item.videoUrl.split('v=')[1]?.split('&')[0]}?autoplay=1&mute=1&loop=1&playlist=${item.videoUrl.split('v=')[1]?.split('&')[0]}&controls=0&showinfo=0&rel=0`}
                            title="YouTube video player"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                        <div className="absolute inset-0 bg-black/40" />
                    </div>
                ) : (
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${item.imageUrl})` }}
                    >
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
                    </div>
                )}

                <div className="relative z-10 container mx-auto px-6 h-full flex flex-col justify-end pb-12">
                    <Link to="/" className="inline-flex items-center text-white/60 hover:text-white mb-6 transition-colors">
                        <ArrowLeft size={20} className="mr-2" />
                        {t('common.back')}
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="inline-block border-b-2 border-dancheong-red mb-4 pb-1">
                            <span className="text-xl font-serif font-bold tracking-wider">
                                {item.category}
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">{getLocalizedText(item.title, i18n.language)}</h1>
                        <div className="flex flex-wrap gap-6 text-white/80 text-sm">
                            <div className="flex items-center">
                                <CalendarIcon size={16} className="mr-2 text-dancheong-green" />
                                {getLocalizedText(item.date, i18n.language)}
                            </div>
                            <div className="flex items-center">
                                <MapPin size={16} className="mr-2 text-dancheong-green" />
                                {getLocalizedText(item.location, i18n.language)}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Content Body */}
            <div className="container mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
                <div className="lg:col-span-2 space-y-8">
                    <section>
                        <h3 className="text-2xl font-bold font-serif mb-6 border-l-4 border-dancheong-green pl-4">{t('common.detail_intro')}</h3>
                        <p className="text-lg leading-relaxed text-white/80 whitespace-pre-line min-h-[500px]">
                            {getLocalizedText(item.description, i18n.language)}
                        </p>
                    </section>
                </div>

                {/* Sidebar / CTA - Sticky */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 space-y-6">
                        {/* Price Card */}
                        <div className="bg-[#2a2a2a] p-6 rounded-xl border border-white/5 shadow-2xl">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-white/60">{t('common.price')}</span>
                                <span className="text-xl font-bold text-dancheong-red">{getLocalizedText(item.price, i18n.language)}</span>
                            </div>
                        </div>

                        {/* Calendar */}
                        <div className="bg-[#2a2a2a] p-6 rounded-xl border border-white/5 shadow-2xl">
                            <h4 className="text-lg font-bold mb-4 flex items-center">
                                <CalendarIcon size={18} className="mr-2 text-dancheong-green" />
                                {t('common.select_date', 'Select Date')}
                            </h4>

                            <div className="flex justify-between items-center mb-4">
                                <button onClick={prevMonth} className="p-1 hover:bg-white/10 rounded-full"><ChevronLeft size={20} /></button>
                                <span className="font-bold">{currentDate.getFullYear()}. {currentDate.getMonth() + 1}</span>
                                <button onClick={nextMonth} className="p-1 hover:bg-white/10 rounded-full"><ChevronRight size={20} /></button>
                            </div>

                            <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs text-white/40 font-bold uppercase">
                                <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
                            </div>
                            <div className="grid grid-cols-7 gap-2 place-items-center">
                                {renderCalendar()}
                            </div>

                            {selectedDate && (
                                <div className="mt-4 p-3 bg-dancheong-red/10 border border-dancheong-red/20 rounded-lg text-center">
                                    <span className="text-sm text-dancheong-red font-bold">
                                        Selected: {selectedDate}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="bg-[#2a2a2a] p-6 rounded-xl border border-white/5 shadow-2xl">
                            <button
                                onClick={handleBooking}
                                disabled={!selectedDate}
                                className={`w-full py-4 rounded-lg font-bold text-lg mb-4 transition-all shadow-lg flex items-center justify-center ${selectedDate
                                    ? 'bg-dancheong-red hover:bg-red-700 text-white'
                                    : 'bg-white/10 text-white/40 cursor-not-allowed'
                                    }`}
                            >
                                {t('common.booking')}
                            </button>

                            <button
                                onClick={handleShare}
                                className="w-full bg-transparent border border-white/20 hover:bg-white/5 text-white py-3 rounded-lg font-medium transition-colors flex justify-center items-center"
                            >
                                <Share2 size={18} className="mr-2" />
                                {t('common.share')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Share Modal */}
            <AnimatePresence>
                {showShareModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                            onClick={() => setShowShareModal(false)}
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative bg-[#1a1a1a] border border-white/10 w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden"
                        >
                            {/* Modal Header */}
                            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Share2 size={20} className="text-white/60" />
                                    <h2 className="text-lg font-bold">{t('common.share_modal.title')}</h2>
                                </div>
                                <button
                                    onClick={() => setShowShareModal(false)}
                                    className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="p-6 space-y-8">
                                {/* Preview Card */}
                                <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-4 border border-white/5 group">
                                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-white/10">
                                        <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-sm truncate mb-1 text-white">
                                            {getLocalizedText(item.title, i18n.language)}
                                        </h3>
                                        <p className="text-white/40 text-[10px] truncate">
                                            {window.location.href}
                                        </p>
                                    </div>
                                    {/* QR Code - Inline Flow */}
                                    <div className="w-12 h-12 bg-white p-1 rounded-lg flex-shrink-0 shadow-lg">
                                        <img
                                            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(window.location.href)}`}
                                            alt="QR Code"
                                            className="w-full h-full"
                                        />
                                    </div>
                                </div>

                                {/* Link Copy Section */}
                                <div className="space-y-2">
                                    <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold px-1">Share using link</p>
                                    <div className="flex bg-black/40 border border-white/10 rounded-xl overflow-hidden group">
                                        <div className="flex-1 p-4 overflow-hidden text-xs text-white/60 whitespace-nowrap mask-fade-right">
                                            {window.location.href}
                                        </div>
                                        <button
                                            onClick={handleCopyLink}
                                            className={`px-5 py-4 font-bold text-[10px] transition-all transform active:scale-95 whitespace-nowrap min-w-[80px] ${copySuccess
                                                ? 'bg-dancheong-green text-white'
                                                : 'bg-white/20 hover:bg-white/30 text-white border-l border-white/10'
                                                }`}
                                        >
                                            {copySuccess ? t('common.share_modal.copied') : t('common.share_modal.copy_link')}
                                        </button>
                                    </div>
                                </div>

                                {/* SNS Selection */}
                                <div className="space-y-3">
                                    <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold px-1">Share using apps</p>
                                    <div className="grid grid-cols-4 gap-4">
                                        {[
                                            { id: 'facebook', icon: 'f', bg: '#1877F2', label: t('common.share_modal.sns.facebook') },
                                            { id: 'twitter', icon: '𝕏', bg: '#000000', label: t('common.share_modal.sns.twitter'), font: 'serif' },
                                            { id: 'linkedin', icon: 'in', bg: '#0A66C2', label: 'LinkedIn' },
                                            { id: 'more', icon: '...', bg: 'rgba(255,255,255,0.1)', label: t('common.share_modal.sns.more') }
                                        ].map((sns) => (
                                            <div key={sns.id} className="flex flex-col items-center gap-2 group cursor-pointer" onClick={() => handleShareSNS(sns.id as any)}>
                                                <div
                                                    style={{ backgroundColor: sns.bg }}
                                                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_8px_20px_rgba(0,0,0,0.4)]"
                                                >
                                                    <span className={`font-bold text-xl ${sns.font === 'serif' ? 'font-serif' : ''}`}>{sns.icon}</span>
                                                </div>
                                                <span className="text-[10px] text-white/40 group-hover:text-white transition-colors">
                                                    {sns.label}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer / Tactile Bottom */}
                            <div className="h-6 bg-gradient-to-t from-white/5 to-transparent mt-4" />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Booking Modal */}
            <AnimatePresence>
                {showBookingModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                            onClick={() => setShowBookingModal(false)}
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative bg-[#222] border border-white/10 w-full max-w-md p-8 rounded-2xl shadow-2xl"
                        >
                            <button
                                onClick={() => setShowBookingModal(false)}
                                className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>

                            {bookingStep === 'select' ? (
                                <>
                                    <h2 className="text-2xl font-bold mb-8 text-center">{t('common.payment.method')}</h2>

                                    {/* Order Summary in Modal */}
                                    <div className="bg-white/5 rounded-xl p-4 mb-6 text-sm">
                                        <div className="flex justify-between mb-2">
                                            <span className="text-white/60">{t('common.product')}</span>
                                            <span className="font-bold">{getLocalizedText(item.title, i18n.language)}</span>
                                        </div>
                                        <div className="flex justify-between text-dancheong-red font-bold">
                                            <span>{t('common.date')}</span>
                                            <span>{selectedDate}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-4 mb-8">
                                        <button
                                            onClick={() => setPaymentMethod('bank_transfer')}
                                            className={`w-full p-4 rounded-xl border transition-all flex items-center ${paymentMethod === 'bank_transfer'
                                                ? 'bg-dancheong-red/20 border-dancheong-red text-dancheong-red'
                                                : 'bg-white/5 border-white/10 hover:border-white/20 text-white/80'
                                                }`}
                                        >
                                            <Wallet className="mr-4" size={24} />
                                            <span className="font-medium">{t('common.payment.bank_transfer')}</span>
                                        </button>

                                        <button
                                            onClick={() => setPaymentMethod('on_site')}
                                            className={`w-full p-4 rounded-xl border transition-all flex items-center ${paymentMethod === 'on_site'
                                                ? 'bg-dancheong-green/20 border-dancheong-green text-dancheong-green'
                                                : 'bg-white/5 border-white/10 hover:border-white/20 text-white/80'
                                                }`}
                                        >
                                            <CreditCard className="mr-4" size={24} />
                                            <span className="font-medium">{t('common.payment.on_site')}</span>
                                        </button>
                                    </div>

                                    <button
                                        disabled={!paymentMethod || isBooking}
                                        onClick={confirmBooking}
                                        className="w-full bg-dancheong-red disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-700 text-white py-4 rounded-lg font-bold text-lg transition-colors flex items-center justify-center shadow-lg"
                                    >
                                        {isBooking ? <Loader2 className="animate-spin mr-2" size={20} /> : null}
                                        {t('common.payment.confirm')}
                                    </button>
                                </>
                            ) : (
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-dancheong-green/20 text-dancheong-green rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle2 size={40} />
                                    </div>
                                    <h2 className="text-2xl font-bold mb-2">{t('common.payment.success')}</h2>
                                    <p className="text-white/60 mb-8">{t('common.payment.info')}</p>

                                    <div className="bg-white/5 rounded-xl p-6 text-left space-y-4 mb-8">
                                        <div>
                                            <p className="text-xs text-white/40 mb-1">{t('common.view_details')}</p>
                                            <p className="font-bold">{getLocalizedText(item.title, i18n.language)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-white/40 mb-1">{t('common.date')}</p>
                                            <p className="font-bold text-dancheong-red">{selectedDate}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-white/40 mb-1">{t('common.payment.method')}</p>
                                            <p className="font-medium">
                                                {paymentMethod === 'bank_transfer' ? t('common.payment.bank_transfer') : t('common.payment.on_site')}
                                            </p>
                                        </div>
                                        {paymentMethod === 'bank_transfer' && (
                                            <div className="pt-4 border-t border-white/10">
                                                <p className="text-sm text-dancheong-red leading-relaxed">
                                                    {t('common.payment.bank_info')}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => setShowBookingModal(false)}
                                        className="w-full bg-white/10 hover:bg-white/20 text-white py-4 rounded-lg font-bold text-lg transition-colors"
                                    >
                                        {t('common.payment.close')}
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </article>
    );
};

export default DetailPage;
