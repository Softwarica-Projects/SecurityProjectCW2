
export const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }
    
    const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';
    
    let cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    cleanBaseUrl = cleanBaseUrl.endsWith('/api') ? cleanBaseUrl.slice(0, -4) : cleanBaseUrl;
    
    const cleanImagePath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    
    return `${cleanBaseUrl}${cleanImagePath}`;
};
