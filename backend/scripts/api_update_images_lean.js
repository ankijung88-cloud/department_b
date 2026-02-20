
const axios = require('axios');

const API_URL = 'http://13.125.154.255:3000';

const UPDATES = [
    {
        id: 1,
        data: {
            name: '경복궁 야간 개장 투어',
            description: '달빛 아래 고궁을 거니는 특별한 경험. 전문 해설사와 함께하는 프라이빗 야간 투어입니다.',
            price: 30000,
            category: 'Travel',
            image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Gyeongbokgung_at_night.jpg/1280px-Gyeongbokgung_at_night.jpg',
            details: { date: '2023.10.01 - 2023.10.31', location: '서울 종로구 사직로 161', subcategory: 'travel' }
        }
    },
    {
        id: 4,
        data: {
            name: '현대적으로 재해석한 판소리: 춘향',
            description: '전통 판소리에 미디어아트를 결합한 퓨전 국악 공연. 춘향전을 새로운 시각으로 풀어냅니다.',
            price: 50000,
            category: 'Performance',
            image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Pansori-02.jpg/1280px-Pansori-02.jpg',
            details: { date: '2023.10.15 - 2023.10.20', location: '국립극장 해오름', subcategory: 'performance' }
        }
    }
];

async function updateViaAPI() {
    console.log('Starting API updates...');
    for (const update of UPDATES) {
        try {
            const resp = await axios.put(`${API_URL}/api/products/${update.id}`, update.data, {
                timeout: 10000
            });
            console.log(`Successfully updated ID ${update.id}: ${resp.data.message || 'No message'}`);
        } catch (error) {
            console.error(`Failed to update ID ${update.id}:`, error.message);
        }
    }
    console.log('API updates complete.');
}

updateViaAPI();
