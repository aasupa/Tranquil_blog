// frontend/src/components/Recommendations.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import PostWidget from 'scenes/widgets/PostWidget';



const Recommendations = ({ userId }) => {
    const [recommendedPosts, setRecommendedPosts] = useState([]);
    const token = useSelector((state) => state.token);
    
    
    const axiosInstance = axios.create({
        baseURL: 'http://localhost:3001',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    
    
    useEffect(() => {
        const fetchRecommendations = async () => {
            try {console.log(`Fetching recommendations for user: ${userId}`);
                const response = await axiosInstance.get(`/api/recommend/${userId}`);
                console.log("recommendations received from backend",response.data);
                setRecommendedPosts(response.data);
            } catch (error) {
                console.error('Error fetching recommendations', error);
            }
        };

        fetchRecommendations();
    }, [userId, axiosInstance]);

    return (
        <div>
            <h2>Recommended Posts</h2>
            {recommendedPosts.length === 0 ? (
            <p>No recommendations available.</p>
        ) : (
            <ul>
                {recommendedPosts.map(
        ({
          _id,
          userId,
          firstName,
          lastName,
          description,
          location,
          picturePath,
          userPicturePath,
          likes,
          comments,
        }) => (
          <PostWidget
            key={_id}
            postId={_id}
            postUserId={userId}
            name={`${firstName} ${lastName}`}
            description={description}
            location={location}
            picturePath={picturePath}
            userPicturePath={userPicturePath}
            likes={likes}
            comments={comments}
            // onView={() => handlePostView(_id)} // Record interaction when the post is viewed
          />
                    
                    
                    // <li key={post._id}> 
                    // <h3>{post.description}</h3>
                    // </li>
                ))}
            </ul>)}
        </div>
    );
};

export default Recommendations;
