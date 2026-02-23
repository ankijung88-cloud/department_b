import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api, { formatImageUrl } from '../../api/client';
import { getArtistById, createArtist, updateArtist } from '../../api/artists';
import { ArrowLeft, Save, Upload, X } from 'lucide-react';

const ArtistFormPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const isEditMode = !!id;
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEditMode);
    const [imageUploading, setImageUploading] = useState(false);

    // Form States
    const [name, setName] = useState('');
    const [title, setTitle] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [bio, setBio] = useState('');
    const [userId, setUserId] = useState('');
    const [users, setUsers] = useState<any[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get('/api/users');
                setUsers(response.data || []);
            } catch (error) {
                console.error('Failed to fetch users:', error);
            }
        };
        fetchUsers();

        if (isEditMode && id) {
            const loadArtist = async () => {
                try {
                    const artist = await getArtistById(Number(id));
                    if (artist) {
                        setName(artist.name);
                        setTitle(artist.title);
                        setImageUrl(artist.image_url);
                        setBio(artist.bio || '');
                        setUserId(artist.user_id || '');
                    } else {
                        navigate('/admin/artists');
                    }
                } catch (error: any) {
                    console.error('Failed to load artist:', error);
                    alert('Failed to load artist details.');
                    navigate('/admin/artists');
                } finally {
                    setFetching(false);
                }
            };
            loadArtist();
        } else {
            setFetching(false);
        }
    }, [id, isEditMode, navigate]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        setImageUploading(true);
        try {
            const response = await api.post('/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setImageUrl(response.data.url);
        } catch (error: any) {
            console.error('Error uploading image:', error);
            alert('Image upload failed.');
        } finally {
            setImageUploading(false);
            e.target.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const artistData = {
            name,
            title,
            image_url: imageUrl,
            user_id: userId || null,
            bio: bio
        };

        try {
            if (isEditMode && id) {
                await updateArtist(Number(id), artistData);
            } else {
                await createArtist(artistData);
            }
            navigate('/admin/artists');
        } catch (error: any) {
            console.error('Error saving artist:', error);
            alert(`Failed to save artist: ${error.message || 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="text-white p-8">Loading artist details...</div>;

    return (
        <div className="min-h-screen pt-24 pb-20 bg-charcoal text-white">
            <div className="max-w-4xl mx-auto px-4">
                <div className="flex items-center mb-8">
                    <Link
                        to="/admin/artists"
                        className="text-white/60 hover:text-white mr-4 transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </Link>
                    <h1 className="text-3xl font-bold text-white font-serif">
                        {isEditMode ? 'Edit Artist' : 'Add New Artist'}
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8 bg-[#2a2a2a] p-8 rounded-xl border border-white/5">
                    {/* Image Upload */}
                    <div>
                        <label className="block text-white/80 text-sm font-bold mb-2">Artist Portrait</label>
                        <div className="flex items-center space-x-4">
                            {imageUrl && (
                                <div className="relative group">
                                    <img src={formatImageUrl(imageUrl)} alt="Preview" className="w-48 h-48 object-cover rounded-lg border border-white/10" />
                                    <button
                                        type="button"
                                        onClick={() => setImageUrl('')}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            )}
                            <input
                                type="file"
                                id="imageInput"
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={imageUploading}
                            />
                            <label
                                htmlFor="imageInput"
                                className={`cursor-pointer bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-lg border border-white/10 transition-colors flex items-center ${imageUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {imageUploading ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
                                ) : (
                                    <Upload size={20} className="mr-2" />
                                )}
                                {imageUploading ? 'Uploading...' : (imageUrl ? 'Replace Image' : 'Upload Portrait')}
                            </label>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-white/80 text-sm font-bold mb-2">Artist Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g., Kim Se-young"
                                required
                                className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-dancheong-red"
                            />
                        </div>
                        <div>
                            <label className="block text-white/80 text-sm font-bold mb-2">Artist Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g., MODERN PAINTER"
                                required
                                className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-dancheong-red"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-white/80 text-sm font-bold mb-2">Linked User (System Account)</label>
                        <select
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-dancheong-red"
                        >
                            <option value="">-- No linked account --</option>
                            {users.map(u => (
                                <option key={u.id} value={u.id} className="bg-charcoal text-white">
                                    {u.full_name || u.email} ({u.role})
                                </option>
                            ))}
                        </select>
                        <p className="text-white/40 text-xs mt-1 italic">Selecting a user links this profile to their uploaded products.</p>
                    </div>

                    <div>
                        <label className="block text-white/80 text-sm font-bold mb-2">Artist Biography</label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Tell the story of this artist..."
                            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-dancheong-red h-40 resize-none"
                        />
                    </div>

                    <div className="flex justify-end pt-6 border-t border-white/5">
                        <button
                            type="submit"
                            disabled={loading || imageUploading}
                            className="bg-dancheong-red hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-colors flex items-center shadow-lg shadow-dancheong-red/20 disabled:opacity-50"
                        >
                            <Save size={20} className="mr-2" />
                            {loading ? 'Saving...' : 'Save Artist'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ArtistFormPage;
