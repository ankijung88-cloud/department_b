import { supabase } from '../lib/supabaseClient';
import { Json } from '../types/database.types';

export interface BookingData {
    product_id: string;
    product_name: string;
    user_email?: string;
    payment_method: 'bank_transfer' | 'on_site';
    total_price: Json;
}

export const createBooking = async (booking: BookingData) => {
    const { data, error } = await (supabase as any)
        .from('bookings')
        .insert([
            {
                product_id: booking.product_id,
                product_name: booking.product_name,
                user_email: booking.user_email || null,
                payment_method: booking.payment_method,
                total_price: booking.total_price,
                status: 'pending'
            }
        ])
        .select()
        .single();

    if (error) {
        console.error('Error creating booking:', error.message);
        throw error;
    }

    return data;
};
