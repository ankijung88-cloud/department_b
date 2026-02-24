import api from './client';
import { Good } from '../types';

export const getGoods = async (): Promise<Good[]> => {
    const response = await api.get('/api/goods');
    return response.data;
};

export const getGoodById = async (id: number): Promise<Good> => {
    const response = await api.get(`/api/goods/${id}`);
    return response.data;
};

export const createGood = async (goodData: Partial<Good>): Promise<{ id: number }> => {
    const response = await api.post('/api/goods', goodData);
    return response.data;
};

export const updateGood = async (id: number, goodData: Partial<Good>): Promise<void> => {
    await api.put(`/api/goods/${id}`, goodData);
};

export const deleteGood = async (id: number): Promise<void> => {
    await api.delete(`/api/goods/${id}`);
};
