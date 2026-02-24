import React from 'react';
import Header from './Header';
import { Footer } from './Footer';
import { Outlet, useLocation } from 'react-router-dom';

export const Layout: React.FC = () => {
    const location = useLocation();
    const isHome = location.pathname === '/';

    return (
        <div className={`flex flex-col bg-charcoal text-white font-sans selection:bg-dancheong-red selection:text-white ${isHome ? 'h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth' : 'min-h-screen'}`}>
            <Header />
            <main className="flex-grow">
                <Outlet />
            </main>
            {!isHome && <Footer />}
            {isHome && <div className="snap-start w-full"><Footer /></div>}
        </div>
    );
};
