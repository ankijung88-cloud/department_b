import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import { ArrowLeft, Send, Upload, CheckCircle } from 'lucide-react';

const ArtistRequestPage: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        title: '',
        image_url: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Public submission - default status 'pending' is handled by backend or default
            await api.post('/api/artists', { ...formData, status: 'pending' });
            setSubmitted(true);
        } catch (error) {
            console.error('Error submitting request:', error);
            alert('Failed to submit request. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-charcoal flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full bg-[#2a2a2a] p-10 rounded-3xl border border-white/10 text-center shadow-2xl"
                >
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={40} className="text-green-500" />
                    </div>
                    <h1 className="text-3xl font-serif font-bold text-white mb-4">Request Submitted</h1>
                    <p className="text-white/60 mb-8">
                        Thank you for your interest. Our team will review your application and feature you in the KOGO Artist Section upon approval.
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="w-full bg-dancheong-red hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg"
                    >
                        Back to Home
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-charcoal text-white font-sans py-20 px-6">
            <div className="max-w-2xl mx-auto">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center text-white/60 hover:text-white transition-colors mb-8 group"
                >
                    <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </button>

                <div className="bg-[#2a2a2a] p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Artist Application</h1>
                    <p className="text-white/60 mb-10">
                        Join the KOGO creative community. Submit your portfolio to be featured in our exclusive Artist Section.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-white/40 uppercase tracking-widest mb-2">Full Name</label>
                            <input
                                required
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g. Kim Se-young"
                                className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-dancheong-red transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-white/40 uppercase tracking-widest mb-2">Artistic Title</label>
                            <input
                                required
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g. Modern Painter"
                                className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-dancheong-red transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-white/40 uppercase tracking-widest mb-2">Portrait Image URL</label>
                            <input
                                required
                                type="url"
                                name="image_url"
                                value={formData.image_url}
                                onChange={handleChange}
                                placeholder="https://example.com/your-photo.jpg"
                                className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-dancheong-red transition-all"
                            />
                            <p className="mt-2 text-xs text-white/40 flex items-center">
                                <Upload size={12} className="mr-1" />
                                Please provide a direct link to a high-quality portrait image.
                            </p>
                        </div>

                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-dancheong-red hover:bg-red-700 disabled:opacity-50 text-white font-bold py-4 rounded-xl flex items-center justify-center transition-all shadow-xl group"
                            >
                                {loading ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                ) : (
                                    <>
                                        Submit Request <Send size={20} className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ArtistRequestPage;
