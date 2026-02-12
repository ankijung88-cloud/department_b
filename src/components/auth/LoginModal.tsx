import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Lock, ArrowRight, Loader2, Mail } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useTranslation } from 'react-i18next';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    type ViewType = 'LOGIN' | 'SIGNUP' | 'FIND_ID' | 'FORGOT_PASSWORD';
    const [view, setView] = useState<ViewType>('LOGIN');

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
            setSuccessMessage(null);
            setEmail('');
            setPassword('');
            setName('');
            setView('LOGIN');
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleFindId = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);
        setIsLoading(true);

        try {
            const { data, error: fetchError } = await supabase
                .from('profiles')
                .select('email')
                .eq('full_name', name)
                .maybeSingle();

            if (fetchError) throw fetchError;

            if (data && data.email) {
                setSuccessMessage(t('auth.find_email_success', { email: data.email }));
            } else {
                setError(t('auth.find_email_not_found'));
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || t('auth.error_generic'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);
        setIsLoading(true);

        try {
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/admin/login`, // Redirect back to login or a reset page
            });
            if (resetError) throw resetError;
            setSuccessMessage(t('auth.reset_password_sent'));
        } catch (err: any) {
            console.error(err);
            setError(err.message || t('auth.error_generic'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialLogin = async (provider: 'google') => {
        setError(null);
        setIsLoading(provider === 'google');
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: window.location.origin,
                }
            });
            if (error) throw error;
        } catch (err: any) {
            console.error(err);
            setError(err.message || t('auth.error_generic'));
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);
        setIsLoading(true);

        try {
            if (view === 'LOGIN') {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                onClose();
            } else if (view === 'SIGNUP') {
                const { error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: name,
                        }
                    }
                });
                if (signUpError) throw signUpError;
                onClose();
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || t('auth.error_generic'));
        } finally {
            setIsLoading(false);
        }
    };

    const renderHeader = () => {
        let title = '';
        let subtitle = t('auth.welcome');

        switch (view) {
            case 'LOGIN': title = t('auth.login_title'); break;
            case 'SIGNUP': title = t('auth.register_title'); break;
            case 'FIND_ID': title = t('auth.find_id'); subtitle = "가입 시 입력한 이름을 입력해 주세요."; break;
            case 'FORGOT_PASSWORD': title = t('auth.forgot_password'); subtitle = "비밀번호 재설정을 위해 이메일을 입력해 주세요."; break;
        }

        return (
            <div className="text-center mb-10">
                <h2 className="text-3xl font-serif font-bold text-white mb-2">{title}</h2>
                <p className="text-white/60 text-sm">{subtitle}</p>
            </div>
        );
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
                            {/* Texture Overlay */}
                            <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/korean-pattern.png')]"></div>

                            {/* Close Button (X) */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onClose();
                                }}
                                className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors z-[60]"
                                aria-label="Close"
                            >
                                <X size={24} />
                            </button>

                            <div className="p-8 md:p-10 relative z-10">
                                {renderHeader()}

                                {error && (
                                    <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
                                        {error}
                                    </div>
                                )}

                                {successMessage ? (
                                    <div className="mb-6 space-y-4 text-center">
                                        <div className="p-4 bg-dancheong-green/10 border border-dancheong-green/20 rounded-lg text-dancheong-green text-sm">
                                            {successMessage}
                                        </div>
                                        <button
                                            onClick={onClose}
                                            className="w-full bg-dancheong-red hover:bg-red-700 text-white font-bold py-4 rounded-lg transition-all"
                                        >
                                            닫기
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        {/* Form Views */}
                                        {view === 'FIND_ID' ? (
                                            <form className="space-y-6" onSubmit={handleFindId}>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-dancheong-green uppercase tracking-wider block">{t('auth.name')}</label>
                                                    <div className="relative">
                                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                                                        <input
                                                            type="text"
                                                            value={name}
                                                            onChange={(e) => setName(e.target.value)}
                                                            placeholder={t('auth.name')}
                                                            required
                                                            className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-dancheong-green focus:ring-1 focus:ring-dancheong-green transition-all"
                                                        />
                                                    </div>
                                                </div>
                                                <button type="submit" disabled={isLoading} className="w-full bg-dancheong-red hover:bg-red-700 text-white font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-2">
                                                    {isLoading ? <Loader2 size={20} className="animate-spin" /> : t('auth.submit')}
                                                </button>
                                                <div className="text-center">
                                                    <button type="button" onClick={() => setView('LOGIN')} className="text-white/40 hover:text-white text-sm">로그인으로 돌아가기</button>
                                                </div>
                                            </form>
                                        ) : view === 'FORGOT_PASSWORD' ? (
                                            <form className="space-y-6" onSubmit={handleForgotPassword}>
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
                                                <button type="submit" disabled={isLoading} className="w-full bg-dancheong-red hover:bg-red-700 text-white font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-2">
                                                    {isLoading ? <Loader2 size={20} className="animate-spin" /> : t('auth.submit')}
                                                </button>
                                                <div className="text-center">
                                                    <button type="button" onClick={() => setView('LOGIN')} className="text-white/40 hover:text-white text-sm">로그인으로 돌아가기</button>
                                                </div>
                                            </form>
                                        ) : (
                                            <form className="space-y-6" onSubmit={handleSubmit}>
                                                {view === 'SIGNUP' && (
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold text-dancheong-green uppercase tracking-wider block">{t('auth.name')}</label>
                                                        <div className="relative">
                                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                                                            <input
                                                                type="text"
                                                                value={name}
                                                                onChange={(e) => setName(e.target.value)}
                                                                placeholder={t('auth.name')}
                                                                required
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
                                                            autoComplete="email"
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
                                                            autoComplete={view === 'LOGIN' ? "current-password" : "new-password"}
                                                            required
                                                            className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-dancheong-green focus:ring-1 focus:ring-dancheong-green transition-all"
                                                        />
                                                    </div>
                                                </div>

                                                {view === 'LOGIN' && (
                                                    <div className="flex items-center justify-center text-sm">
                                                        <div className="flex items-center gap-4">
                                                            <button type="button" onClick={() => setView('FIND_ID')} className="text-white/60 hover:text-white transition-colors">{t('auth.find_id')}</button>
                                                            <span className="text-white/20">|</span>
                                                            <button type="button" onClick={() => setView('FORGOT_PASSWORD')} className="text-white/60 hover:text-white transition-colors">{t('auth.forgot_password')}</button>
                                                        </div>
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
                                                            {view === 'LOGIN' ? t('auth.login') : t('auth.signup')}
                                                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                                        </>
                                                    )}
                                                </button>

                                                {(view === 'LOGIN' || view === 'SIGNUP') && (
                                                    <div className="space-y-6 mt-6">
                                                        <div className="relative">
                                                            <div className="absolute inset-0 flex items-center">
                                                                <div className="w-full border-t border-white/10"></div>
                                                            </div>
                                                            <div className="relative flex justify-center text-xs uppercase">
                                                                <span className="bg-[#1a1a1a] px-2 text-white/40">{t('auth.social_login')}</span>
                                                            </div>
                                                        </div>

                                                        <button
                                                            type="button"
                                                            onClick={() => handleSocialLogin('google')}
                                                            disabled={isLoading}
                                                            className="w-full bg-white text-black font-bold py-4 rounded-lg hover:bg-white/90 transition-all flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                                                <path
                                                                    fill="#4285F4"
                                                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                                                />
                                                                <path
                                                                    fill="#34A853"
                                                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                                                />
                                                                <path
                                                                    fill="#FBBC05"
                                                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                                                />
                                                                <path
                                                                    fill="#EA4335"
                                                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
                                                                />
                                                            </svg>
                                                            {t('auth.google_login')}
                                                        </button>
                                                    </div>
                                                )}
                                            </form>
                                        )}
                                    </>
                                )}

                                <div className="mt-8 pt-8 border-t border-white/10 text-center">
                                    <p className="text-white/60 text-sm">
                                        {view === 'LOGIN' ? t('auth.no_account') : t('auth.have_account')}
                                        <button
                                            onClick={() => {
                                                setView(view === 'LOGIN' ? 'SIGNUP' : 'LOGIN');
                                                setError(null);
                                                setSuccessMessage(null);
                                            }}
                                            className="text-dancheong-red font-bold hover:underline ml-1"
                                        >
                                            {view === 'LOGIN' ? t('auth.register') : t('auth.login')}
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

