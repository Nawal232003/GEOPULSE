// A simple mapping of some key global countries/regions to their approx coordinates
const coordinatesDB = {
    'india': { lat: 20.5937, lng: 78.9629, country: 'India' },
    'delhi': { lat: 28.6139, lng: 77.2090, country: 'India' },
    'usa': { lat: 37.0902, lng: -95.7129, country: 'USA' },
    'us': { lat: 37.0902, lng: -95.7129, country: 'USA' },
    'china': { lat: 35.8617, lng: 104.1954, country: 'China' },
    'beijing': { lat: 39.9042, lng: 116.4074, country: 'China' },
    'russia': { lat: 61.5240, lng: 105.3188, country: 'Russia' },
    'moscow': { lat: 55.7558, lng: 37.6173, country: 'Russia' },
    'ukraine': { lat: 48.3794, lng: 31.1656, country: 'Ukraine' },
    'kyiv': { lat: 50.4501, lng: 30.5234, country: 'Ukraine' },
    'israel': { lat: 31.0461, lng: 34.8516, country: 'Israel' },
    'palestine': { lat: 31.9522, lng: 35.2332, country: 'Palestine' },
    'gaza': { lat: 31.3547, lng: 34.3088, country: 'Palestine' },
    'iran': { lat: 32.4279, lng: 53.6880, country: 'Iran' },
    'uk': { lat: 55.3781, lng: -3.4360, country: 'UK' },
    'london': { lat: 51.5074, lng: -0.1278, country: 'UK' },
    'france': { lat: 46.2276, lng: 2.2137, country: 'France' },
    'germany': { lat: 51.1657, lng: 10.4515, country: 'Germany' },
    'taiwan': { lat: 23.6978, lng: 120.9605, country: 'Taiwan' },
    'pakistan': { lat: 30.3753, lng: 69.3451, country: 'Pakistan' },
    'japan': { lat: 36.2048, lng: 138.2529, country: 'Japan' },
    'south korea': { lat: 35.9078, lng: 127.7669, country: 'South Korea' },
    'north korea': { lat: 40.3399, lng: 127.5101, country: 'North Korea' }
};

/**
 * Scans text for country or city names and returns approximate coordinates
 * @param {string} text - The headline or article text
 * @returns {object|null} - Null if no match, else { lat, lng, country }
 */
function extractLocation(text) {
    if (!text) return null;

    const lowerText = text.toLowerCase();

    // Sort keys by length descending to match 'south korea' before 'korea'
    const keys = Object.keys(coordinatesDB).sort((a, b) => b.length - a.length);

    for (const key of keys) {
        // Look for whole word matches
        const regex = new RegExp(`\\b${key}\\b`, 'i');
        if (regex.test(lowerText)) {
            return coordinatesDB[key];
        }
    }

    // Return null so we don't map irrelevant locations.
    return null;
}

module.exports = { extractLocation };
