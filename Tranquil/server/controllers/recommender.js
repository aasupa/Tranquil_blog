import Post from "../models/Post.js";
import { getHybridRecommendations, updateUserInteractions } from "../Recommender_Module.js";
import User from "../models/User.js";

export const getRecommendations = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await updateUserInteractions(userId, null, 'view');

    const posts = await Post.find();
    const recentPostContent = posts.map(post => post.description).join(' '); // Combine content of recent posts

    const recommendations = getHybridRecommendations(userId);// recentPostContent thyo paila
    console.log("Recommendations received:", recommendations);
    const recommendedPosts = await Post.find({
      _id: { $in: recommendations },
    });
    //console.log("recommended postssss:", recommendedPosts);
    res.status(200).json(recommendedPosts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
