import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { getProductById } from '../../api/products';
import { LocalizedString } from '../../types';
import { ArrowLeft, Save, Upload, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const LANGUAGES = ['ko', 'en', 'ja', 'zh'];

const initialLocalized: LocalizedString = {
    ko: '',
    en: '',
    ja: '',
    zh: ''
};

// Helper for date formatting
const formatDate = (date: Date): string => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
};

const ProductFormPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEditMode = !!id;
    // const { t } = useTranslation();

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEditMode);

    // Form States
    const [title, setTitle] = useState<LocalizedString>({ ...initialLocalized });
    const [description, setDescription] = useState<LocalizedString>({ ...initialLocalized });
    const [category, setCategory] = useState('Trend');
    const [imageUrl, setImageUrl] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [date, setDate] = useState<LocalizedString>({ ...initialLocalized });
    const [location, setLocation] = useState<LocalizedString>({ ...initialLocalized });
    const [price, setPrice] = useState<LocalizedString>({ ...initialLocalized });
    const [closedDays, setClosedDays] = useState<string[]>([]);

    // Calendar State
    const [currentCalDate, setCurrentCalDate] = useState(new Date());

    useEffect(() => {
        if (isEditMode && id) {
            const loadProduct = async () => {
                const product = await getProductById(id);
                if (product) {
                    setTitle(product.title);
                    setDescription(product.description);
                    setCategory(product.category);
                    setImageUrl(product.imageUrl);
                    setVideoUrl(product.videoUrl || '');
                    setDate(product.date);
                    setLocation(product.location);
                    setPrice(product.price);
                    setClosedDays(product.closedDays || []);
                }
                setFetching(false);
            };
            loadProduct();
        }
    }, [id, isEditMode]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        setLoading(true);
        try {
            const { error: uploadError } = await supabase.storage
                .from('products')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('products').getPublicUrl(filePath);
            setImageUrl(data.publicUrl);
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image');
        } finally {
            setLoading(false);
        }
    };

    const toggleClosedDay = (dateStr: string) => {
        setClosedDays(prev => {
            if (prev.includes(dateStr)) {
                return prev.filter(d => d !== dateStr);
            } else {
                return [...prev, dateStr].sort();
            }
        });
    };

    // Calendar Helper Functions
    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const renderCalendar = () => {
        const year = currentCalDate.getFullYear();
        const month = currentCalDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);

        const days = [];
        // Empty slots
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-10 w-10" />);
        }

        const todayStr = formatDate(new Date());

        for (let day = 1; day <= daysInMonth; day++) {
            const dateObj = new Date(year, month, day);
            const dateStr = formatDate(dateObj);
            const isClosed = closedDays.includes(dateStr);
            const isPast = dateStr < todayStr;

            let bgClass = "bg-white/5 hover:bg-white/10 text-white";
            if (isClosed) bgClass = "bg-red-500 text-white font-bold shadow-lg";
            else if (isPast) bgClass = "bg-white/5 text-white/20"; // Just visual dimming, admins can still close past days if they want? Or maybe strictly future? Let's allow all for flexibility.

            days.push(
                <button
                    key={day}
                    type="button"
                    onClick={() => toggleClosedDay(dateStr)}
                    className={`h-10 w-10 rounded-full flex items-center justify-center text-sm transition-all ${bgClass}`}
                    title={isClosed ? "Closed Day" : "Open Day"}
                >
                    {day}
                </button>
            );
        }
        return days;
    };

    const nextMonth = () => setCurrentCalDate(new Date(currentCalDate.getFullYear(), currentCalDate.getMonth() + 1, 1));
    const prevMonth = () => setCurrentCalDate(new Date(currentCalDate.getFullYear(), currentCalDate.getMonth() - 1, 1));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const productData = {
            title,
            description,
            category,
            image_url: imageUrl,
            video_url: videoUrl,
            date,
            location,
            price,
            closed_days: closedDays
        };

        try {
            if (isEditMode && id) {
                const { error } = await supabase
                    .from('products')
                    .update(productData)
                    .eq('id', id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('products')
                    .insert([productData]);
                if (error) throw error;
            }
            navigate('/admin/products');
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Failed to save product');
        } finally {
            setLoading(false);
        }
    };

    const handleLocalizedChange = (
        setter: React.Dispatch<React.SetStateAction<LocalizedString>>,
        lang: string,
        value: string
    ) => {
        setter(prev => ({ ...prev, [lang]: value }));
    };

    if (fetching) return <div className="text-white p-8">Loading product...</div>;

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="flex items-center mb-8">
                <Link to="/admin/products" className="text-white/60 hover:text-white mr-4 transition-colors">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="text-3xl font-bold text-white font-serif">
                    {isEditMode ? 'Edit Product' : 'Add New Product'}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 bg-[#2a2a2a] p-8 rounded-xl border border-white/5">
                {/* Image Upload */}
                <div>
                    <label className="block text-white/80 text-sm font-bold mb-2">Product Image</label>
                    <div className="flex items-center space-x-4">
                        {imageUrl && (
                            <img src={imageUrl} alt="Preview" className="w-32 h-32 object-cover rounded-lg border border-white/10" />
                        )}
                        <label className="cursor-pointer bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg border border-white/10 transition-colors flex items-center">
                            <Upload size={20} className="mr-2" />
                            Upload Image
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                        </label>
                    </div>
                </div>

                {/* Video URL */}
                <div>
                    <label className="block text-white/80 text-sm font-bold mb-2">YouTube Video URL (Optional)</label>
                    <input
                        type="text"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-dancheong-red"
                    />
                    <p className="text-white/40 text-xs mt-1">
                        YouTube video link for the product detail page. If provided, it will be displayed instead of the image.
                    </p>
                </div>

                {/* Category */}
                <div>
                    <label className="block text-white/80 text-sm font-bold mb-2">Category</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-dancheong-red"
                    >
                        <option value="Trend">Trend</option>
                        <option value="Exhibition">Exhibition</option>
                        <option value="Performance">Performance</option>
                        <option value="Art">Art</option>
                        <option value="Experience">Experience</option>
                        <option value="Style">Style</option>
                        <option value="Food">Food</option>
                        <option value="Travel">Travel</option>
                    </select>
                </div>

                {/* Closed Days Management */}
                <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                        <CalendarIcon size={20} className="mr-2 text-dancheong-red" />
                        Manage Closed Days (休務日)
                    </h3>
                    <p className="text-sm text-white/60 mb-6">
                        Click on dates to toggle them as closed days. Red indicates closed.
                    </p>

                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Calendar UI */}
                        <div className="w-full max-w-sm">
                            <div className="flex justify-between items-center mb-4 bg-white/5 p-2 rounded-lg">
                                <button type="button" onClick={prevMonth} className="p-1 hover:bg-white/10 rounded-full"><ChevronLeft size={20} /></button>
                                <span className="font-bold flex-1 text-center">{currentCalDate.getFullYear()}. {String(currentCalDate.getMonth() + 1).padStart(2, '0')}</span>
                                <button type="button" onClick={nextMonth} className="p-1 hover:bg-white/10 rounded-full"><ChevronRight size={20} /></button>
                            </div>

                            <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs text-white/40 font-bold uppercase">
                                <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
                            </div>
                            <div className="grid grid-cols-7 gap-2 place-items-center">
                                {renderCalendar()}
                            </div>
                        </div>

                        {/* Selected Days List */}
                        <div className="flex-1">
                            <h4 className="font-bold text-sm mb-2 text-white/80">Selected Closed Days ({closedDays.length})</h4>
                            <div className="bg-black/20 rounded-lg p-4 h-64 overflow-y-auto border border-white/5">
                                {closedDays.length === 0 ? (
                                    <p className="text-white/40 text-sm">No closed days selected.</p>
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {closedDays.sort().map(day => (
                                            <span key={day} className="bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1 rounded-full text-xs flex items-center">
                                                {day}
                                                <button
                                                    type="button"
                                                    onClick={() => toggleClosedDay(day)}
                                                    className="ml-2 hover:text-white"
                                                >
                                                    &times;
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Localized Fields */}
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-white border-b border-white/10 pb-2">content Details</h3>

                    {['Title', 'Description', 'Date', 'Location', 'Price'].map((field) => {
                        const stateMap: Record<string, [LocalizedString, React.Dispatch<React.SetStateAction<LocalizedString>>]> = {
                            'Title': [title, setTitle],
                            'Description': [description, setDescription],
                            'Date': [date, setDate],
                            'Location': [location, setLocation],
                            'Price': [price, setPrice]
                        };
                        const [state, setState] = stateMap[field];

                        return (
                            <div key={field} className="bg-white/5 p-4 rounded-lg">
                                <label className="block text-white text-sm font-bold mb-3">{field}</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {LANGUAGES.map((lang) => (
                                        <div key={lang}>
                                            <span className="text-xs text-white/40 uppercase mb-1 block">{lang}</span>
                                            {field === 'Description' ? (
                                                <textarea
                                                    value={state[lang]}
                                                    onChange={(e) => handleLocalizedChange(setState, lang, e.target.value)}
                                                    className="w-full bg-black/20 border border-white/10 rounded p-2 text-white text-sm focus:border-dancheong-red outline-none h-24"
                                                />
                                            ) : (
                                                <input
                                                    type="text"
                                                    value={state[lang]}
                                                    onChange={(e) => handleLocalizedChange(setState, lang, e.target.value)}
                                                    className="w-full bg-black/20 border border-white/10 rounded p-2 text-white text-sm focus:border-dancheong-red outline-none"
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="flex justify-end pt-6 border-t border-white/5">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-dancheong-red hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-colors flex items-center shadow-lg"
                    >
                        <Save size={20} className="mr-2" />
                        {loading ? 'Saving...' : 'Save Product'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductFormPage;
