import api from './client';
import { Artist } from '../types';

export const getArtists = async (): Promise<Artist[]> => {
    const response = await api.get('/api/artists');
    return response.data || [];
};

export const getArtistById = async (id: number): Promise<Artist | null> => {
    const response = await api.get(`/api/artists/${id}`);
    return response.data || null;
};

export const createArtist = async (artistData: Omit<Artist, 'id'>): Promise<{ id: number }> => {
    const response = await api.post('/api/artists', artistData);
    return response.data;
};

export const updateArtist = async (id: number, artistData: Partial<Artist>): Promise<void> => {
    await api.put(`/api/artists/${id}`, artistData);
};

export const deleteArtist = async (id: number): Promise<void> => {
    await api.delete(`/api/artists/${id}`);
};
