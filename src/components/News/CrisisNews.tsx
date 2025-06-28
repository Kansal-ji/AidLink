import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock, ExternalLink, Filter, RefreshCw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface NewsItem {
  id: string;
  title: string;
  description: string;
  source: string;
  publishedAt: Date;
  url: string;
  category: 'natural-disaster' | 'emergency' | 'weather' | 'accident';
  severity: 'low' | 'medium' | 'high' | 'critical';
  location?: string;
}

export const CrisisNews: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Mock news data simulating Indian news sources
  const mockNews: NewsItem[] = [
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

  const categories = [
    { id: 'all', label: 'All News', icon: '📰' },
    { id: 'natural-disaster', label: 'Natural Disasters', icon: '🌪️' },
    { id: 'weather', label: 'Weather Alerts', icon: '🌦️' },
    { id: 'emergency', label: 'Emergencies', icon: '🚨' },
    { id: 'accident', label: 'Accidents', icon: '⚠️' },
  ];

  useEffect(() => {
    // Simulate API call to fetch news
    const fetchNews = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setNews(mockNews);
      setLastUpdated(new Date());
      setLoading(false);
    };

    fetchNews();
  }, []);

  const filteredNews = news.filter(item => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-100 border-green-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const refreshNews = () => {
    setLoading(true);
    setTimeout(() => {
      setLastUpdated(new Date());
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Crisis & Emergency News</h2>
            <p className="text-sm text-gray-600 mt-1">
              Latest updates on natural disasters and emergencies across India
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-xs text-gray-500">Last updated</p>
              <p className="text-sm font-medium text-gray-900">
                {formatDistanceToNow(lastUpdated, { addSuffix: true })}
              </p>
            </div>
            <button
              onClick={refreshNews}
              disabled={loading}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center space-x-2 overflow-x-auto">
          <Filter className="h-4 w-4 text-gray-400 flex-shrink-0" />
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category.id
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* News List */}
      <div className="space-y-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          filteredNews.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0" />
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getSeverityColor(item.severity)}`}>
                        {item.severity}
                      </span>
                      <span className="text-sm text-gray-500 capitalize">{item.category.replace('-', ' ')}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-red-600 cursor-pointer">
                    {item.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatDistanceToNow(item.publishedAt, { addSuffix: true })}
                      </div>
                      <div className="font-medium text-red-600">
                        {item.source}
                      </div>
                      {item.location && (
                        <div className="text-gray-600">
                          📍 {item.location}
                        </div>
                      )}
                    </div>
                    
                    <button className="flex items-center text-red-600 hover:text-red-700 text-sm font-medium">
                      Read More
                      <ExternalLink className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}

        {!loading && filteredNews.length === 0 && (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <div className="text-4xl mb-4">📰</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No news available</h3>
            <p className="text-gray-600">
              {selectedCategory === 'all'
                ? 'No crisis news available at the moment.'
                : `No ${selectedCategory.replace('-', ' ')} news available.`
              }
            </p>
          </div>
        )}
      </div>

      {/* News Sources */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-blue-600" />
          </div>
          <div className="ml-3">
            <h4 className="text-sm font-medium text-blue-900">Trusted News Sources</h4>
            <p className="text-sm text-blue-700 mt-1">
              News is aggregated from verified Indian news sources including Aaj Tak, ABP News, India Today, NDTV, Times Now, and Zee News to ensure accuracy and reliability.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};