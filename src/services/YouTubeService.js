// src/services/YouTubeService.js
const API_KEY = 'AIzaSyARjIn8ZwHMmdcQ_PfK0tg6zgPdyGYSbUE'; // Zameni sa pravim API ključem
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

class YouTubeService {
  // Pretraga podcast videa po ključnoj reči
  static async searchPodcasts(query, maxResults = 8) {
    try {
      const response = await fetch(
        `${BASE_URL}/search?part=snippet&q=${encodeURIComponent(query + ' podcast')}&type=video&maxResults=${maxResults}&key=${API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error('YouTube API request failed');
      }
      
      const data = await response.json();
      return this.transformYouTubeData(data.items);
    } catch (error) {
      console.error('Error fetching YouTube data:', error);
      return [];
    }
  }

  // Popularni podcast videi
  static async getPopularPodcasts(maxResults = 8) {
    try {
      const response = await fetch(
        `${BASE_URL}/videos?part=snippet,statistics&chart=mostPopular&videoCategoryId=10&maxResults=${maxResults}&key=${API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error('YouTube API request failed');
      }
      
      const data = await response.json();
      return this.transformYouTubeData(data.items);
    } catch (error) {
      console.error('Error fetching popular podcasts:', error);
      return [];
    }
  }

  // Transform YouTube API response u naš format
  static transformYouTubeData(items) {
    return items.map(item => ({
      id: item.id.videoId || item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.medium.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      videoUrl: `https://www.youtube.com/watch?v=${item.id.videoId || item.id}`
    }));
  }
}

export default YouTubeService;