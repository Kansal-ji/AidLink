import express from 'express';

const router = express.Router();

// Mock news data - In production, this would fetch from actual news APIs
const mockNewsData = [
  {
    id: '1',
    title: 'Heavy Rainfall Triggers Flash Floods in Mumbai Suburbs',
    description: 'Continuous heavy rainfall for the past 24 hours has led to waterlogging in several areas of Mumbai. Local authorities have issued flood warnings for low-lying areas.',
    source: 'Aaj Tak',
    publishedAt: new Date(Date.now() - 1000 * 60 * 30),
    url: '#',
    category: 'natural-disaster',
    severity: 'high',
    location: 'Mumbai, Maharashtra'
  },
  {
    id: '2',
    title: 'Earthquake of Magnitude 4.2 Hits Delhi-NCR Region',
    description: 'A moderate earthquake was felt across Delhi and surrounding areas. No major damage reported so far, but residents are advised to stay alert.',
    source: 'ABP News',
    publishedAt: new Date(Date.now() - 1000 * 60 * 45),
    url: '#',
    category: 'natural-disaster',
    severity: 'medium',
    location: 'Delhi NCR'
  },
  {
    id: '3',
    title: 'Cyclone Warning Issued for Odisha and West Bengal Coast',
    description: 'IMD has issued a cyclone warning for the eastern coast. Fishermen advised not to venture into the sea. Evacuation plans activated in vulnerable areas.',
    source: 'India Today',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60),
    url: '#',
    category: 'weather',
    severity: 'critical',
    location: 'Odisha, West Bengal'
  },
  {
    id: '4',
    title: 'Forest Fire Spreads Across 500 Hectares in Uttarakhand',
    description: 'A massive forest fire has engulfed large areas in Uttarakhand hills. Fire department and forest officials are working to control the blaze.',
    source: 'NDTV',
    publishedAt: new Date(Date.now() - 1000 * 60 * 90),
    url: '#',
    category: 'emergency',
    severity: 'high',
    location: 'Uttarakhand'
  },
  {
    id: '5',
    title: 'Landslide Blocks Highway in Himachal Pradesh',
    description: 'Heavy rains triggered a landslide on the Shimla-Chandigarh highway, blocking traffic completely. Rescue operations are underway.',
    source: 'Times Now',
    publishedAt: new Date(Date.now() - 1000 * 60 * 120),
    url: '#',
    category: 'natural-disaster',
    severity: 'medium',
    location: 'Himachal Pradesh'
  },
  {
    id: '6',
    title: 'Severe Heatwave Conditions Continue in Rajasthan',
    description: 'Temperature soars above 45°C in several districts of Rajasthan. Health advisory issued for vulnerable populations.',
    source: 'Zee News',
    publishedAt: new Date(Date.now() - 1000 * 60 * 180),
    url: '#',
    category: 'weather',
    severity: 'high',
    location: 'Rajasthan'
  }
];

// Get crisis news
router.get('/', async (req, res) => {
  try {
    const { category = 'all', limit = 10, page = 1 } = req.query;

    let filteredNews = mockNewsData;

    // Filter by category
    if (category !== 'all') {
      filteredNews = mockNewsData.filter(item => item.category === category);
    }

    // Pagination
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedNews = filteredNews.slice(startIndex, endIndex);

    res.json({
      news: paginatedNews,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: filteredNews.length,
        pages: Math.ceil(filteredNews.length / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get news error:', error);
    res.status(500).json({ message: 'Server error fetching news' });
  }
});

// Get news by location
router.get('/location/:location', async (req, res) => {
  try {
    const { location } = req.params;
    const { limit = 10 } = req.query;

    const locationNews = mockNewsData.filter(item => 
      item.location.toLowerCase().includes(location.toLowerCase())
    ).slice(0, parseInt(limit));

    res.json({ news: locationNews });
  } catch (error) {
    console.error('Get location news error:', error);
    res.status(500).json({ message: 'Server error fetching location news' });
  }
});

export default router;