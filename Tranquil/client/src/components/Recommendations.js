// frontend/src/components/Recommendations.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Recommendations = ({ userId }) => {
    const [recommendedPosts, setRecommendedPosts] = useState([]);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const response = await axios.get(`/api/recommend/${userId}`);
                console.log(response.data);
                setRecommendedPosts(response.data);
            } catch (error) {
                console.error('Error fetching recommendations', error);
            }
        };

        fetchRecommendations();
    }, [userId]);

    return (
        <div>
            <h2>Recommended Posts</h2>
            {recommendedPosts.length === 0 ? (
            <p>No recommendations available.</p>
        ) : (
            <ul>
                {recommendedPosts.map(post => (
                    <li key={post._id}> 
                    <h3>{post.description}</h3>
                    </li>
                ))}
            </ul>)}
        </div>
    );
};

export default Recommendations;
