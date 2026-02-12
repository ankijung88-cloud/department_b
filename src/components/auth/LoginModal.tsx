import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Lock, ArrowRight, Loader2, Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import * as authApi from '../../api/auth';
import { useTranslation } from 'react-i18next';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
    const { login } = useAuth();
    const { t } = useTranslation();
    const [isLoginView, setIsLoginView] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    // Prevent scrolling when modal is open
    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            // Reset state on close
            setError(null);
            setEmail('');
            setPassword('');
            setName('');
            setIsLoginView(true);
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            if (isLoginView) {
                const response = await authApi.login(email, password);
                login(response.token, response.user);
                onClose();
            } else {
                await authApi.register(email, password, name);
                // Auto login after register
                const response = await authApi.login(email, password);
                login(response.token, response.user);
                onClose();
            }
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || t('auth.error_generic'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        {/* Modal Container */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#1a1a1a] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-white/10 relative"
                        >
                            {/* Decorative Background Pattern */}
                            <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/korean-pattern.png')]"></div>

                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors z-10"
                            >
                                <X size={24} />
                            </button>

                            <div className="p-8 md:p-10 relative z-10">
                                {/* Header */}
                                <div className="text-center mb-10">
                                    <h2 className="text-3xl font-serif font-bold text-white mb-2">
                                        {isLoginView ? t('auth.login_title') : t('auth.register_title')}
                                    </h2>
                                    <p className="text-white/60 text-sm">
                                        {t('auth.welcome')}
                                    </p>
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
                                        {error}
                                    </div>
                                )}

                                {/* Form */}
                                <form className="space-y-6" onSubmit={handleSubmit}>
                                    {!isLoginView && (
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-dancheong-green uppercase tracking-wider block">{t('auth.name')}</label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                                                <input
                                                    type="text"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    placeholder={t('auth.name')}
                                                    required={!isLoginView}
                                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-dancheong-green focus:ring-1 focus:ring-dancheong-green transition-all"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-dancheong-green uppercase tracking-wider block">{t('auth.email')}</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="example@email.com"
                                                required
                                                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-dancheong-green focus:ring-1 focus:ring-dancheong-green transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-dancheong-green uppercase tracking-wider block">{t('auth.password')}</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                                            <input
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="••••••••"
                                                required
                                                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-dancheong-green focus:ring-1 focus:ring-dancheong-green transition-all"
                                            />
                                        </div>
                                    </div>

                                    {isLoginView && (
                                        <div className="flex items-center justify-between text-sm">
                                            <label className="flex items-center gap-2 cursor-pointer group">
                                                <input type="checkbox" className="rounded border-white/20 bg-white/5 text-dancheong-red focus:ring-offset-0 focus:ring-dancheong-red/50" />
                                                <span className="text-white/60 group-hover:text-white/80 transition-colors">로그인 유지</span>
                                            </label>
                                            <button type="button" className="text-white/60 hover:text-dancheong-red transition-colors">비밀번호 찾기</button>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-dancheong-red hover:bg-red-700 text-white font-bold py-4 rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? (
                                            <Loader2 size={20} className="animate-spin" />
                                        ) : (
                                            <>
                                                {isLoginView ? t('auth.login') : t('auth.signup')}
                                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </form>

                                {/* Toggle Login/Signup */}
                                <div className="mt-8 pt-8 border-t border-white/10 text-center">
                                    <p className="text-white/60 text-sm">
                                        {isLoginView ? t('auth.no_account') : t('auth.have_account')}
                                        <button
                                            onClick={() => {
                                                setIsLoginView(!isLoginView);
                                                setError(null);
                                            }}
                                            className="text-dancheong-red font-bold hover:underline ml-1"
                                        >
                                            {isLoginView ? t('auth.register') : t('auth.login')}
                                        </button>
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default LoginModal;
