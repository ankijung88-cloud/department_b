export interface LocalizedString {
    ko: string;
    en: string;
    ja: string;
    zh: string;
    [key: string]: string;
}

export interface NavItem {
    id: string; // Translation key
    href: string;
    subitems?: {
        id: string;
        label: string;
        href: string;
    }[];
}

export interface FeaturedItem {
    id: string;
    title: LocalizedString;
    category: string;
    subcategory?: string;
    description: LocalizedString;
    imageUrl: string;
    date: LocalizedString;
    location: LocalizedString;
    price: LocalizedString;
    closedDays?: string[];
    videoUrl?: string;
    user_id?: string;
}

export interface FloorContent {
    type: 'text' | 'image' | 'video';
    value: string | LocalizedString;
    caption?: LocalizedString;
}

export interface FloorCategory {
    id: string;
    floor: string;
    title: LocalizedString;
    description: LocalizedString;
    bgImage: string;
    content?: FloorContent[];
}

export interface Artist {
    id: number;
    name: string;
    title: string;
    image_url: string;
    bio?: string | null;
    status?: 'pending' | 'approved' | 'rejected';
    created_at?: string;
}

export interface Good {
    id: number;
    name: string;
    description: string;
    price: number | string;
    stock: number;
    image_url: string;
    created_at?: string;
}

export interface OrderItem {
    id?: number;
    order_id?: number;
    goods_id: number;
    quantity: number;
    price: number | string;
    goods_name?: string;
    goods_image?: string;
}

export interface Order {
    id: number;
    user_id: number;
    user_name?: string;
    user_email?: string;
    total_amount: number | string;
    payment_method: 'card' | 'bank';
    shipping_status: 'pending' | 'shipping' | 'delivered' | 'cancelled';
    shipping_address: string;
    created_at?: string;
    items?: OrderItem[];
}
