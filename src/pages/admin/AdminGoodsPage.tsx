import React, { useEffect, useState } from 'react';
import { getGoods, createGood, updateGood, deleteGood } from '../../api/goods';
import { Good } from '../../types';
import { Plus, Edit, Trash2, X } from 'lucide-react';

const AdminGoodsPage: React.FC = () => {
    const [goods, setGoods] = useState<Good[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentGood, setCurrentGood] = useState<Partial<Good> | null>(null);

    const fetchGoods = async () => {
        setLoading(true);
        try {
            const data = await getGoods();
            setGoods(data);
        } catch (error) {
            console.error('Failed to fetch goods', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGoods();
    }, []);

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this good?')) return;
        try {
            await deleteGood(id);
            fetchGoods();
        } catch (error) {
            console.error('Failed to delete', error);
            alert('Failed to delete good');
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentGood) return;

        try {
            if (currentGood.id) {
                await updateGood(currentGood.id, currentGood);
            } else {
                await createGood(currentGood);
            }
            setIsModalOpen(false);
            fetchGoods();
        } catch (error) {
            console.error('Failed to save', error);
            alert('Failed to save good');
        }
    };

    const openModal = (good?: Good) => {
        setCurrentGood(good || { name: '', description: '', price: 0, stock: 0, image_url: '' });
        setIsModalOpen(true);
    };

    if (loading) return <div className="p-8 text-white">Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-white font-serif">Goods Management</h1>
                <button
                    onClick={() => openModal()}
                    className="bg-dancheong-red hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                >
                    <Plus size={20} className="mr-2" />
                    Add Good
                </button>
            </div>

            <div className="bg-[#2a2a2a] rounded-xl border border-white/5 overflow-hidden">
                <table className="w-full text-left text-white/80">
                    <thead className="bg-white/5 text-white uppercase text-xs font-bold">
                        <tr>
                            <th className="p-4">Image</th>
                            <th className="p-4">Name</th>
                            <th className="p-4">Price</th>
                            <th className="p-4">Stock</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {goods.map((good) => (
                            <tr key={good.id} className="hover:bg-white/5 transition-colors">
                                <td className="p-4">
                                    <img src={good.image_url} alt={good.name} className="w-12 h-12 object-cover rounded bg-black/50" />
                                </td>
                                <td className="p-4 font-medium">{good.name}</td>
                                <td className="p-4">{Number(good.price).toLocaleString()}원</td>
                                <td className="p-4">{good.stock}</td>
                                <td className="p-4 text-right space-x-2">
                                    <button
                                        onClick={() => openModal(good)}
                                        className="inline-block p-2 text-blue-400 hover:bg-blue-400/10 rounded transition-colors"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(good.id)}
                                        className="p-2 text-red-400 hover:bg-red-400/10 rounded transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal for Add/Edit */}
            {isModalOpen && currentGood && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#2a2a2a] w-full max-w-md p-6 rounded-2xl border border-white/10 shadow-2xl relative">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-white/60 hover:text-white"
                        >
                            <X size={24} />
                        </button>
                        <h2 className="text-2xl font-bold font-serif mb-6 text-white">
                            {currentGood.id ? 'Edit Good' : 'Add Good'}
                        </h2>

                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-1">Name</label>
                                <input
                                    required
                                    type="text"
                                    value={currentGood.name || ''}
                                    onChange={(e) => setCurrentGood({ ...currentGood, name: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-dancheong-red"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-1">Description</label>
                                <textarea
                                    required
                                    rows={3}
                                    value={currentGood.description || ''}
                                    onChange={(e) => setCurrentGood({ ...currentGood, description: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-dancheong-red"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-white/80 mb-1">Price</label>
                                    <input
                                        required
                                        type="number"
                                        min="0"
                                        value={currentGood.price || ''}
                                        onChange={(e) => setCurrentGood({ ...currentGood, price: Number(e.target.value) })}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-dancheong-red"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white/80 mb-1">Stock</label>
                                    <input
                                        required
                                        type="number"
                                        min="0"
                                        value={currentGood.stock || ''}
                                        onChange={(e) => setCurrentGood({ ...currentGood, stock: Number(e.target.value) })}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-dancheong-red"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-1">Image URL</label>
                                <input
                                    required
                                    type="text"
                                    value={currentGood.image_url || ''}
                                    onChange={(e) => setCurrentGood({ ...currentGood, image_url: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-dancheong-red"
                                    placeholder="/images/goods/item1.jpg"
                                />
                            </div>

                            <div className="pt-4 flex justify-end">
                                <button
                                    type="submit"
                                    className="bg-dancheong-red hover:bg-red-700 text-white px-6 py-2 rounded-lg font-bold transition-colors"
                                >
                                    Save Good
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminGoodsPage;
