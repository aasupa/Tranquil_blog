import natural from 'natural';
import stopword from 'stopword';
import nlp from 'compromise';
import cosineSimilarity from 'cosine-similarity';

const { PorterStemmer } = natural;
const TfIdf = natural.TfIdf;
const tfidf = new TfIdf();

const userInteractions = {}; // Store user interactions

const preprocess =  (content) => {
if (!content) {
console.error("Content empty or undefined");
return [];
}
let tokens = content.split(/\W+/);
tokens = tokens.map(token => token.toLowerCase());
tokens = stopword.removeStopwords(tokens);

//Example: Apply stemming to normalize tokens
tokens = tokens.map(token => PorterStemmer.stem(token));
return tokens.filter(token => token !== '');
};

export function addDocuments(posts) {
posts.forEach(post => {
const content = post.description || "";
console.log("Adding document with ID:", post._id, "and content:", content);
if (!content) {
console.error("Content is undefined or empty for post Id:", post._id);
}
const processedContent = preprocess(content); // Preprocess the content
console.log("Processed content:", processedContent);

tfidf.addDocument(processedContent, post._id);
});
console.log("All documents added to TF-IDF model:", tfidf.documents);
}

export function getContentRecommendations(processedContent, topN = 5, precision = 4) { // esma content nai thyo
  console.log("Getting content recommendations for content:", processedContent);
 // const processedContent = preprocess(content);
  console.log("Processed content for recommendation:", processedContent); // content esma ni
const results = [];

tfidf.tfidfs(processedContent, (i, measure) => {
  const formattedMeasure = parseFloat(measure.toFixed(precision));
  console.log(`Document: ${tfidf.documents[i].__key}, Score: ${formattedMeasure}`);
results.push({ docId: tfidf.documents[i].__key, score: formattedMeasure });
});
console.log("results:+", results)
const sortedResults = results.sort((a, b) => b.score - a.score).slice(0, topN);
    console.log("Sorted recommendations:", sortedResults);
    return sortedResults;
}

export function updateUserInteractions(userId, postId) {

if (!userId || !postId) {
    console.error(`Invalid userId (${userId}) or postId (${postId})`);
    return;
}
if (!userInteractions[userId]) {
userInteractions[userId] = {};
}
console.log(`Updating interaction: User: ${userId}, Post: ${postId}`);
userInteractions[userId][postId] = true;
console.log("Current user interactions:", userInteractions);
}

export function getCollaborativeRecommendations(userId, topN = 5) {
if (!userInteractions[userId]) return [];

const similarities = {};

Object.keys(userInteractions).forEach(otherUserId => {
if (otherUserId !== userId) {
const similarity = calculateCosineSimilarity(userId, otherUserId);
similarities[otherUserId] = similarity;
}
});

const sortedSimilarities = Object.entries(similarities).sort((a, b) => b[1] - a[1]);
const recommendations = {};

// Get topN most similar users and generate recommendations
sortedSimilarities.slice(0, topN).forEach(([otherUserId]) => {
  Object.keys(userInteractions[otherUserId]).forEach(postId => {
      // Ensure the current user hasn't interacted with the post
      if (!userInteractions[userId][postId]) {
          recommendations[postId] = (recommendations[postId] || 0) + 1;
      }
  });
});



// sortedSimilarities.slice(0, topN).forEach(([otherUserId]) => {
//   Object.keys(userInteractions[otherUserId]).forEach(postId => {
//     //user le post maa interact garexaina vanera ensure garney
//     if (!userInteractions[userId][postId]) {
//       recommendations[postId] = (recommendations[postId] || 0) + 1;
//     }
//   });
// });



const sortedRecommendations = Object.entries(recommendations)
        .sort((a, b) => b[1] - a[1])
        .slice(0, topN)
        .map(([postId]) => postId);
    console.log("Collaborative recommendations:", sortedRecommendations);
    return sortedRecommendations;

}

function calculateCosineSimilarity(userId, otherUserId) {
  const interactions1 = Object.values(userInteractions[userId]|| {});
  const interactions2 = Object.values(userInteractions[otherUserId] || {});

  // Calculate dot product
  let dotProduct = 0;
  for (let i = 0; i < interactions1.length; i++) {
      dotProduct += interactions1[i] * interactions2[i];
  }

  // Calculate magnitudes
  const magnitude1 = Math.sqrt(interactions1.reduce((sum, x) => sum + x * x, 0));
  const magnitude2 = Math.sqrt(interactions2.reduce((sum, x) => sum + x * x, 0));

  // Calculate cosine similarity (handle division by zero)
  const similarity = magnitude1 > 0 && magnitude2 > 0 ? dotProduct / (magnitude1 * magnitude2) : 0;

  return similarity;
}

export function getHybridRecommendations(userId, topN = 5) {

let recentPostContent = '';
if (userInteractions[userId]) {
const recentPostId = Object.keys(userInteractions[userId]).pop();
const recentPost = tfidf.documents.find(doc => doc.__key === recentPostId);
recentPostContent = recentPost ? recentPost.document.join(' ') : '';
}
console.log("Recent post content for hybrid recommendations:", recentPostContent);
const contentRecommendations = getContentRecommendations(recentPostContent, topN).map(r => r.docId);
console.log("Content-based recommendations:", contentRecommendations);
const collaborativeRecommendations = getCollaborativeRecommendations(userId, topN);
console.log("Collaborative recommendations:", collaborativeRecommendations);
const hybridRecommendations = [...new Set([...contentRecommendations, ...collaborativeRecommendations])];
console.log("Hybrid recommendations:", hybridRecommendations);
return hybridRecommendations.slice(0, topN);
} 