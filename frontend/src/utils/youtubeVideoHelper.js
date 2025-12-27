export const getYouTubeVideoId = (url) => {
  if (!url || typeof url !== 'string') {
    return null;
  }

  // Regular expressions for different YouTube URL formats
  const patterns = [
    // Standard YouTube URLs
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
    // YouTube short URLs
    /(?:https?:\/\/)?youtu\.be\/([a-zA-Z0-9_-]+)/,
    // YouTube embed URLs
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]+)/,
    // YouTube mobile URLs
    /(?:https?:\/\/)?(?:m\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
    // YouTube playlist URLs (extract video ID)
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]+)/,
    // YouTube v parameter in any position
    /[?&]v=([a-zA-Z0-9_-]+)/
  ];


  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  return null;
};


export const isValidYouTubeVideoId = (videoId) => {
  if (!videoId || typeof videoId !== 'string') {
    return false;
  }
  const videoIdPattern = /^[a-zA-Z0-9_-]{11}$/;
  return videoIdPattern.test(videoId);
};
export const getYouTubeThumbnail = (videoId, quality = 'high') => {
  if (!isValidYouTubeVideoId(videoId)) {
    return null;
  }

  const qualityMap = {
    'default': 'default',
    'medium': 'mqdefault',
    'high': 'hqdefault',
    'standard': 'sddefault',
    'maxres': 'maxresdefault'
  };

  const thumbnailQuality = qualityMap[quality] || 'hqdefault';
  return `https://img.youtube.com/vi/${videoId}/${thumbnailQuality}.jpg`;
};

export const getYouTubeEmbedUrl = (videoId, options = {}) => {
  if (!isValidYouTubeVideoId(videoId)) {
    return null;
  }

  const {
    autoplay = 0,
    controls = 1,
    loop = 0,
    mute = 0,
    start = null,
    end = null
  } = options;

  let embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay}&controls=${controls}&loop=${loop}&mute=${mute}`;

  if (start) {
    embedUrl += `&start=${start}`;
  }

  if (end) {
    embedUrl += `&end=${end}`;
  }

  return embedUrl;
};

export default {
  getYouTubeVideoId,
  isValidYouTubeVideoId,
  getYouTubeThumbnail,
  getYouTubeEmbedUrl
};
