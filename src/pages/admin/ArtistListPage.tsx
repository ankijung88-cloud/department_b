import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatImageUrl } from '../../api/client';
import { Artist } from '../../types';
import { useTranslation } from 'react-i18next';
import { Edit, Trash2, Plus, CheckCircle, XCircle, Clock } from 'lucide-react';
import { getArtists, deleteArtist, updateArtistStatus } from '../../api/artists';

const ArtistListPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [artists, setArtists] = useState<Artist[]>([]);
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation();

    const fetchArtists = async () => {
        setLoading(true);
        try {
            const data = await getArtists();
            setArtists(data);
        } catch (err: any) {
            console.error('Error fetching artists:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArtists();
    }, []);

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this artist?')) return;

        try {
            await deleteArtist(id);
            fetchArtists();
        } catch (error: any) {
            console.error('Error deleting artist:', error);
            alert(`Failed to delete artist: ${error.message || 'Unknown error'}`);
        }
    };

    const handleStatusUpdate = async (id: number, status: 'approved' | 'rejected') => {
        try {
            await updateArtistStatus(id, status);
            fetchArtists();
        } catch (error: any) {
            console.error('Error updating status:', error);
            alert(`Failed to update status: ${error.message || 'Unknown error'}`);
        }
    };

    const filteredArtists = artists.filter(artist =>
        artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artist.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="flex justify-center items-center h-64 text-white">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dancheong-red mr-3"></div>
            {t('common.loading')}
        </div>
    );

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-white font-serif">Artist Management</h1>
                <Link
                    to="/admin/artists/new"
                    className="bg-dancheong-red hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                >
                    <Plus size={20} className="mr-2" />
                    Add Artist
                </Link>
            </div>

            <div className="bg-[#2a2a2a] p-4 rounded-xl border border-white/5 mb-6">
                <input
                    type="text"
                    placeholder="Search artist by name or title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-dancheong-red"
                />
            </div>

            <div className="bg-[#2a2a2a] rounded-xl border border-white/5 overflow-hidden">
                <table className="w-full text-left text-white/80">
                    <thead className="bg-white/5 text-white uppercase text-xs font-bold">
                        <tr>
                            <th className="p-4">Portrait</th>
                            <th className="p-4">Name</th>
                            <th className="p-4">Title</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredArtists.map((artist) => (
                            <tr key={artist.id} className="hover:bg-white/5 transition-colors">
                                <td className="p-4">
                                    <img
                                        src={formatImageUrl(artist.image_url)}
                                        alt={artist.name}
                                        className="w-12 h-12 object-cover rounded-full border border-white/10"
                                    />
                                </td>
                                <td className="p-4 font-medium">{artist.name}</td>
                                <td className="p-4">
                                    <span className="bg-dancheong-red/10 text-dancheong-red px-2 py-1 rounded text-xs uppercase tracking-wider">
                                        {artist.title}
                                    </span>
                                </td>
                                <td className="p-4">
                                    {artist.status === 'approved' && (
                                        <span className="flex items-center text-green-400 text-xs font-bold uppercase">
                                            <CheckCircle size={14} className="mr-1" /> Approved
                                        </span>
                                    )}
                                    {artist.status === 'pending' && (
                                        <span className="flex items-center text-yellow-400 text-xs font-bold uppercase">
                                            <Clock size={14} className="mr-1" /> Pending
                                        </span>
                                    )}
                                    {artist.status === 'rejected' && (
                                        <span className="flex items-center text-red-500 text-xs font-bold uppercase">
                                            <XCircle size={14} className="mr-1" /> Rejected
                                        </span>
                                    )}
                                </td>
                                <td className="p-4 text-right space-x-2">
                                    {artist.status === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => handleStatusUpdate(artist.id, 'approved')}
                                                className="p-2 text-green-400 hover:bg-green-400/10 rounded transition-colors"
                                                title="Approve"
                                            >
                                                <CheckCircle size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate(artist.id, 'rejected')}
                                                className="p-2 text-orange-400 hover:bg-orange-400/10 rounded transition-colors"
                                                title="Reject"
                                            >
                                                <XCircle size={18} />
                                            </button>
                                        </>
                                    )}
                                    <Link
                                        to={`/admin/artists/${artist.id}`}
                                        className="inline-block p-2 text-blue-400 hover:bg-blue-400/10 rounded transition-colors"
                                    >
                                        <Edit size={18} />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(artist.id)}
                                        className="p-2 text-red-400 hover:bg-red-400/10 rounded transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredArtists.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-white/40">
                                    No artists found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ArtistListPage;
