// client/src/utils/api.js
import axios from 'axios';

export const recordInteraction = async (userId, postId, token) => {
    try {
        const response = await axios.post(
            'http://localhost:3001/api/interactions',
            { userId, postId },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}` // Include the token if needed
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error recording interaction:', error);
        throw error;
    }
};
