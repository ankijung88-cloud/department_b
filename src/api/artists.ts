import api from './client';
import { Artist } from '../types';

export const getArtists = async (status?: string): Promise<Artist[]> => {
    const response = await api.get('/api/artists', { params: { status } });
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

export const updateArtistStatus = async (id: number, status: string): Promise<void> => {
    await api.patch(`/api/artists/${id}/status`, { status });
};
