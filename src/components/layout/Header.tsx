import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingBag, User, Menu, X, Globe, LogOut } from 'lucide-react';
import { NAV_ITEMS } from '../../data/mockData';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import LoginModal from '../auth/LoginModal';
import SearchModal from '../common/SearchModal';
import { useAuth } from '../../context/AuthContext';

export const Header: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { i18n, t } = useTranslation();
    const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    const { user, isAuthenticated, logout } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const changeLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
        setIsLangMenuOpen(false);
    };

    const handleLogout = () => {
        logout();
        setIsUserMenuOpen(false);
    };

    const languages = [
        { code: 'ko', label: '한국어' },
        { code: 'en', label: 'English' },
        { code: 'ja', label: '日本語' },
        { code: 'zh', label: '中文' },
    ];

    return (
        <>
            <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
            <SearchModal isOpen={isSearchModalOpen} onClose={() => setIsSearchModalOpen(false)} />
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-charcoal/90 backdrop-blur-md py-4 shadow-lg' : 'bg-transparent py-6'
                    }`}
            >
                <div className="container mx-auto px-6 flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="text-2xl font-serif font-bold tracking-widest text-white hover:text-dancheong-red transition-colors">
                        문화백화점
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        {NAV_ITEMS.map((item) => (
                            <Link
                                key={item.id}
                                to={item.href}
                                className="text-white/80 hover:text-white hover:border-b-2 hover:border-dancheong-red pb-1 transition-all text-sm font-medium tracking-wide"
                            >
                                {t(`nav.${item.id}`)}
                            </Link>
                        ))}
                    </nav>

                    {/* Utility Menu */}
                    <div className="hidden md:flex items-center space-x-6 text-white">
                        {/* Language Switcher */}
                        <div className="relative">
                            <button
                                className="hover:text-dancheong-red transition-colors flex items-center gap-1"
                                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                            >
                                <Globe size={20} />
                                <span className="text-xs uppercase font-bold">{i18n.language.split('-')[0]}</span>
                            </button>

                            <AnimatePresence>
                                {isLangMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute right-0 top-full mt-2 bg-charcoal border border-white/10 rounded-md shadow-xl overflow-hidden min-w-[120px]"
                                    >
                                        {languages.map((lang) => (
                                            <button
                                                key={lang.code}
                                                onClick={() => changeLanguage(lang.code)}
                                                className={`block w-full text-left px-4 py-2 text-sm hover:bg-white/10 transition-colors ${i18n.language.startsWith(lang.code) ? 'text-dancheong-red font-bold' : 'text-white/80'}`}
                                            >
                                                {lang.label}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <button
                            className="hover:text-dancheong-red transition-colors"
                            onClick={() => setIsSearchModalOpen(true)}
                        >
                            <Search size={20} />
                        </button>

                        {/* User Menu */}
                        <div className="relative">
                            <button
                                className={`transition-colors ${isAuthenticated ? 'text-dancheong-red' : 'hover:text-dancheong-red'}`}
                                onClick={() => isAuthenticated ? setIsUserMenuOpen(!isUserMenuOpen) : setIsLoginModalOpen(true)}
                            >
                                <User size={20} />
                            </button>
                            <AnimatePresence>
                                {isUserMenuOpen && isAuthenticated && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute right-0 top-full mt-2 bg-charcoal border border-white/10 rounded-md shadow-xl overflow-hidden min-w-[150px]"
                                    >
                                        <div className="px-4 py-3 border-b border-white/10">
                                            <p className="text-xs text-white/60">{t('auth.welcome')}</p>
                                            <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-dancheong-red transition-colors flex items-center gap-2"
                                        >
                                            <LogOut size={14} />
                                            {t('auth.logout')}
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <button className="hover:text-dancheong-red transition-colors">
                            <ShoppingBag size={20} />
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-white"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="md:hidden absolute top-full left-0 right-0 bg-charcoal border-t border-white/10 p-6 shadow-xl"
                        >
                            <nav className="flex flex-col space-y-4">
                                {NAV_ITEMS.map((item) => (
                                    <Link
                                        key={item.id}
                                        to={item.href}
                                        className="text-white/80 hover:text-dancheong-red text-lg font-medium"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {t(`nav.${item.id}`)}
                                    </Link>
                                ))}

                                {/* Mobile Language Switcher */}
                                <div className="flex gap-4 pt-4 border-t border-white/10">
                                    {languages.map((lang) => (
                                        <button
                                            key={lang.code}
                                            onClick={() => changeLanguage(lang.code)}
                                            className={`text-sm ${i18n.language.startsWith(lang.code) ? 'text-dancheong-red font-bold' : 'text-white/60'}`}
                                        >
                                            {lang.label}
                                        </button>
                                    ))}
                                </div>

                                <div className="pt-4 flex items-center justify-start space-x-6 border-t border-white/10">
                                    <button
                                        className="text-white hover:text-dancheong-red"
                                        onClick={() => {
                                            setIsMobileMenuOpen(false);
                                            setIsSearchModalOpen(true);
                                        }}
                                    >
                                        <Search size={20} />
                                    </button>
                                    <button
                                        className={`transition-colors ${isAuthenticated ? 'text-dancheong-red' : 'text-white hover:text-dancheong-red'}`}
                                        onClick={() => {
                                            if (isAuthenticated) {
                                                logout();
                                                setIsMobileMenuOpen(false);
                                            } else {
                                                setIsMobileMenuOpen(false);
                                                setIsLoginModalOpen(true);
                                            }
                                        }}
                                    >
                                        <User size={20} />
                                        {isAuthenticated && <span className="text-xs ml-1">{user?.name}</span>}
                                    </button>
                                    <button className="text-white hover:text-dancheong-red"><ShoppingBag size={20} /></button>
                                </div>
                            </nav>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>
        </>
    );
};
