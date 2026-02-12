import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { LogOut, Package, Plus } from 'lucide-react';

const AdminLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/admin/login');
    };

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="flex h-screen bg-charcoal text-white">
            {/* Sidebar */}
            <aside className="w-64 bg-[#2a2a2a] border-r border-white/5 flex flex-col">
                <div className="p-6 border-b border-white/5">
                    <h1 className="text-xl font-serif font-bold text-white">Store Admin</h1>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link
                        to="/admin/products"
                        className={`flex items-center p-3 rounded-lg transition-colors ${isActive('/admin/products') ? 'bg-dancheong-red text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        <Package size={20} className="mr-3" />
                        Products
                    </Link>
                    <Link
                        to="/admin/products/new"
                        className={`flex items-center p-3 rounded-lg transition-colors ${isActive('/admin/products/new') ? 'bg-dancheong-red text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        <Plus size={20} className="mr-3" />
                        Add Product
                    </Link>
                </nav>

                <div className="p-4 border-t border-white/5">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full p-3 text-white/60 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                        <LogOut size={20} className="mr-3" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-charcoal p-8">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
