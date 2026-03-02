const Parser = require('rss-parser');
const parser = new Parser();
const LiveNews = require('../models/LiveNews');
const { extractLocation } = require('../utils/geocoder');

// Focus on Indian politics and breaking news alongside world news
const FEED_URLS = [
    { url: 'https://timesofindia.indiatimes.com/rssfeedstopstories.cms', source: 'Times of India' },
    { url: 'https://www.thehindu.com/news/national/feeder/default.rss', source: 'The Hindu' },
    { url: 'http://feeds.bbci.co.uk/news/world/rss.xml', source: 'BBC World' },
    { url: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml', source: 'NY Times' }
];

const FETCH_INTERVAL = 60000; // 1 minute (minute-by-minute updates)

async function fetchFeeds(io) {
    console.log(`[${new Date().toISOString()}] Fetching RSS feeds...`);

    for (const feedConfig of FEED_URLS) {
        try {
            const feed = await parser.parseURL(feedConfig.url);

            for (const item of feed.items) {
                // Check if article already exists
                const exists = await LiveNews.exists({ link: item.link });
                if (exists) continue;

                // Try to geocode the headline or content
                const location = extractLocation(item.title) || extractLocation(item.contentSnippet);

                // Save new article
                const newArticle = new LiveNews({
                    title: item.title,
                    link: item.link,
                    content: item.contentSnippet || item.content || '',
                    pubDate: new Date(item.pubDate || Date.now()),
                    source: feedConfig.source,
                    location: location || undefined
                });

                await newArticle.save();
                console.log(`New article saved: ${newArticle.title}`);

                // Broadcast to all clients
                io.emit('new_article', {
                    id: newArticle._id,
                    title: newArticle.title,
                    link: newArticle.link,
                    content: newArticle.content,
                    pubDate: newArticle.pubDate,
                    source: newArticle.source,
                    location: newArticle.location
                });
            }
        } catch (err) {
            console.error(`Error fetching feed ${feedConfig.url}:`, err.message);
        }
    }
}

function startRssService(io) {
    // Initial fetch
    fetchFeeds(io);

    // Setup minute-by-minute interval
    setInterval(() => fetchFeeds(io), FETCH_INTERVAL);
}

module.exports = { startRssService };
