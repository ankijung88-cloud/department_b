export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            products: {
                Row: {
                    id: string
                    created_at: string
                    title: Json
                    description: Json
                    category: string
                    image_url: string
                    date: Json
                    location: Json
                    price: Json
                }
                Insert: {
                    id?: string
                    created_at?: string
                    title: Json
                    description: Json
                    category: string
                    image_url: string
                    date: Json
                    location: Json
                    price: Json
                }
                Update: {
                    id?: string
                    created_at?: string
                    title?: Json
                    description?: Json
                    category?: string
                    image_url?: string
                    date?: Json
                    location?: Json
                    price?: Json
                }
            },
            bookings: {
                Row: {
                    id: string
                    created_at: string
                    product_id: string
                    user_email: string | null
                    payment_method: string
                    status: string
                    total_price: Json
                }
                Insert: {
                    id?: string
                    created_at?: string
                    product_id: string
                    user_email?: string | null
                    payment_method: string
                    status?: string
                    total_price: Json
                }
                Update: {
                    id?: string
                    created_at?: string
                    product_id?: string
                    user_email?: string | null
                    payment_method?: string
                    status?: string
                    total_price?: Json
                }
            }
        }
    }
}
