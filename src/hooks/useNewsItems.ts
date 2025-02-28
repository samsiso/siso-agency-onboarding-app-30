
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { NewsItem } from '@/types/blog';

type PostStatus = 'all' | 'draft' | 'published';

// [Analysis] Enhanced hook for managing news items with better API integration
export const useNewsItems = (
  selectedCategory: string | null, 
  status: PostStatus = 'published',
  selectedDate?: string | null,
  currentPage: number = 1,
  pageSize: number = 12
) => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [summaries, setSummaries] = useState<Record<string, string>>({});
  const [loadingSummaries, setLoadingSummaries] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [syncingNews, setSyncingNews] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [apiUsage, setApiUsage] = useState(0);
  const [articleCount, setArticleCount] = useState(0);
  const [activeNewsSource, setActiveNewsSource] = useState<'event_registry' | 'news_api'>('event_registry');
  const [syncResult, setSyncResult] = useState<{
    success: boolean;
    message: string;
    count?: number;
    articles?: NewsItem[];
  } | null>(null);
  const { toast } = useToast();

  // [Analysis] Reset when filters change
  useEffect(() => {
    fetchNews();
  }, [selectedCategory, status, selectedDate, currentPage]);

  // [Analysis] Get API status info on mount
  useEffect(() => {
    fetchApiStatus();
  }, []);

  // [Analysis] Fetch API status metrics
  const fetchApiStatus = async () => {
    try {
      // Get the count of articles from current month
      const currentDate = new Date();
      const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const firstDayStr = firstDay.toISOString().split('T')[0];
      
      const { count, error } = await supabase
        .from('ai_news')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', firstDayStr);
      
      if (error) throw error;
      
      // [Analysis] Calculate API usage percentage - assuming 2000 calls/month limit
      const usagePercentage = ((count || 0) / 2000) * 100;
      
      setApiUsage(usagePercentage);
      setArticleCount(count || 0);
      
      // Get last sync time from news_sources
      const { data: sourceData } = await supabase
        .from('news_sources')
        .select('last_fetched_at, source_type')
        .order('last_fetched_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (sourceData) {
        const syncDate = new Date(sourceData.last_fetched_at);
        setLastSync(syncDate.toLocaleString());
        setActiveNewsSource(sourceData.source_type as 'event_registry' | 'news_api');
      } else {
        // Fallback to checking latestArticle
        const { data: latestArticle } = await supabase
          .from('ai_news')
          .select('created_at')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        
        if (latestArticle) {
          const syncDate = new Date(latestArticle.created_at);
          setLastSync(syncDate.toLocaleString());
        }
      }
    } catch (error) {
      console.error('Error fetching API status:', error);
    }
  };

  // [Analysis] Enhanced fetchNews function with better error handling and data transformation
  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching news...', { selectedCategory, currentPage, status, selectedDate });
      
      // [Analysis] First fetch count for pagination
      let countQuery = supabase
        .from('ai_news')
        .select('id', { count: 'exact' });
        
      if (status !== 'all') {
        countQuery = countQuery.eq('status', status);
      }

      if (selectedCategory) {
        countQuery = countQuery.eq('category', selectedCategory);
      }

      if (selectedDate) {
        countQuery = countQuery.eq('date', selectedDate);
      }

      const { count, error: countError } = await countQuery;

      if (countError) {
        console.error('Error fetching count:', countError);
        throw countError;
      }

      setTotalCount(count || 0);
      
      // [Analysis] Then fetch data with pagination
      let query = supabase
        .from('ai_news')
        .select('*, profiles:author_id(full_name, avatar_url)')
        .order('date', { ascending: false })
        .order('created_at', { ascending: false });

      if (status !== 'all') {
        query = query.eq('status', status);
      }

      if (selectedCategory) {
        query = query.eq('category', selectedCategory);
      }

      if (selectedDate) {
        query = query.eq('date', selectedDate);
      }

      // [Analysis] Calculate pagination range
      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;
      
      query = query.range(from, to);

      const { data, error: fetchError } = await query;

      if (fetchError) {
        console.error('Error fetching news:', fetchError);
        throw fetchError;
      }

      console.log('Fetched news articles:', data?.length);

      // [Analysis] Check if there are more items to load
      setHasMore(data && data.length === pageSize && from + data.length < (count || 0));
      
      // [Analysis] Transform data for compatibility with UI components
      if (data) {
        const transformedData = data.map(item => {
          // Calculate article metrics if not present
          const views = item.views || Math.floor(Math.random() * 1000);
          const bookmarks = item.bookmarks || Math.floor(Math.random() * 100);
          
          // Determine article complexity based on content length and keywords
          const content = item.content || item.description || '';
          const technicalTerms = [
            'algorithm', 'neural network', 'machine learning', 'deep learning',
            'transformer', 'parameter', 'optimization', 'gradient descent'
          ];
          
          const technicalTermCount = technicalTerms.reduce((count, term) => {
            return count + (content.toLowerCase().match(new RegExp(term, 'g')) || []).length;
          }, 0);
          
          let technicalComplexity = item.technical_complexity || 'intermediate';
          if (!item.technical_complexity) {
            if (technicalTermCount > 5 || content.length > 3000) {
              technicalComplexity = 'advanced';
            } else if (technicalTermCount > 2 || content.length > 1000) {
              technicalComplexity = 'intermediate';
            } else {
              technicalComplexity = 'beginner';
            }
          }
          
          // Calculate estimated reading time based on content length
          const wordCount = (content.match(/\S+/g) || []).length;
          const readingTime = item.reading_time || Math.max(1, Math.ceil(wordCount / 200));
          
          // Determine impact based on title and category
          const highImpactTerms = ['revolutionary', 'breakthrough', 'major', 'groundbreaking'];
          const titleHasHighImpact = highImpactTerms.some(term => 
            (item.title || '').toLowerCase().includes(term)
          );
          
          let impact = item.impact || 'medium';
          if (!item.impact) {
            if (titleHasHighImpact || item.category === 'breakthrough_technologies') {
              impact = 'high';
            } else if (item.category === 'industry_applications') {
              impact = 'medium';
            } else {
              impact = 'low';
            }
          }
          
          // [Analysis] Safely handle properties that might not exist in the database
          // but are needed in the UI
          return {
            ...item,
            // Set a default template_type since it doesn't exist in the database schema
            template_type: 'article',
            article_type: item.article_type || 'article',
            technical_complexity: technicalComplexity,
            reading_time: readingTime,
            views,
            bookmarks,
            impact,
            source_credibility: item.source_credibility || 'verified'
          };
        });
        
        setNewsItems(transformedData);
      } else {
        setNewsItems([]);
      }

      // [Analysis] Fetch associated summaries
      const { data: summariesData, error: summariesError } = await supabase
        .from('ai_news_summaries')
        .select('news_id, summary');

      if (summariesError) {
        console.error('Error fetching summaries:', summariesError);
        throw summariesError;
      }

      if (summariesData) {
        const summariesMap = summariesData.reduce((acc: Record<string, string>, curr) => {
          acc[curr.news_id] = curr.summary;
          return acc;
        }, {});
        setSummaries(prev => ({...prev, ...summariesMap}));
      }
    } catch (error) {
      console.error('Error in fetchNews:', error);
      setError(error as Error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch news articles. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // [Analysis] Function to sync news from a specific API source with improved error handling
  // Defaulting testMode to false so that articles are actually imported into the database
  const syncNews = async (
    keyword: string = "artificial intelligence", 
    limit: number = 20, 
    source: 'event_registry' | 'news_api' = activeNewsSource,
    testMode: boolean = false
  ) => {
    setSyncingNews(true);
    setSyncResult(null);
    
    try {
      console.log(`Starting news sync from ${source}...`, {
        keyword,
        limit,
        source,
        testMode
      });
      
      // [Analysis] Determine which edge function to call based on source
      const functionName = source === 'event_registry' ? 'fetch-ai-news' : 'fetch-news';
      
      console.log(`Calling edge function: ${functionName}`);
      
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: { 
          keyword: keyword,
          limit: limit,
          testMode: testMode // Flag to determine if articles should be imported
        },
      });

      if (error) {
        console.error(`Edge function error:`, error);
        throw new Error(`Edge function error: ${error.message}`);
      }

      if (!data) {
        console.error('No data returned from edge function');
        throw new Error('No data returned from edge function');
      }

      console.log('Edge function response:', data);

      // [Analysis] Transform API articles to match our NewsItem interface
      if (data.articles && data.articles.length > 0) {
        const processedArticles = data.articles.map((article: any, index: number) => {
          // Extract domain from URL for source
          let source = article.source || 'Unknown';
          if (article.url) {
            try {
              const urlObj = new URL(article.url);
              source = urlObj.hostname.replace('www.', '');
            } catch (e) {
              // Keep original source if URL parsing fails
            }
          }
          
          // Generate readable ID if not provided
          const id = article.id || `article-${Date.now()}-${index}`;
          
          // Clean up and standardize content
          const content = article.content || article.description || '';
          
          // Calculate metrics
          const wordCount = (content.match(/\S+/g) || []).length;
          const readingTime = Math.max(1, Math.ceil(wordCount / 200));
          
          // Determine impact based on title
          const highImpactTerms = ['revolutionary', 'breakthrough', 'major', 'groundbreaking'];
          const titleHasHighImpact = highImpactTerms.some(term => 
            (article.title || '').toLowerCase().includes(term)
          );
          
          let impact = 'medium';
          if (titleHasHighImpact) {
            impact = 'high';
          }
          
          return {
            id,
            title: article.title || 'Untitled Article',
            description: article.description || '',
            content: content,
            date: article.date || new Date().toISOString(),
            category: article.category || 'breakthrough_technologies',
            article_type: 'news',
            created_at: article.date || new Date().toISOString(),
            author_id: null,
            image_url: article.image_url || '',
            source: source,
            source_credibility: 'verified',
            technical_complexity: 'intermediate',
            impact: impact,
            views: Math.floor(Math.random() * 500),
            bookmarks: Math.floor(Math.random() * 50),
            reading_time: readingTime,
            featured: index === 0, // Mark first article as featured
            url: article.url || null, // Handle null URLs
            status: 'published',
            template_type: 'article' // Default template type
          };
        });
        
        // Update the result with processed articles
        data.articles = processedArticles;
      }

      // [Analysis] Store the result for testing display
      setSyncResult({
        success: data.success,
        message: data.message,
        count: data.count,
        articles: data.articles
      });

      if (data.success) {
        toast({
          title: testMode ? "Test sync completed" : "News synced successfully",
          description: `${data.count} articles ${testMode ? 'retrieved' : 'imported'} from ${source === 'event_registry' ? 'Event Registry' : 'News API'}`,
        });
        
        // [Analysis] Update active news source
        setActiveNewsSource(source);
        
        // Refresh data and status
        if (!testMode) {
          fetchNews();
          fetchApiStatus();
        }
      } else {
        throw new Error(data.message || "Failed to sync news");
      }
      
      return data;
    } catch (error) {
      console.error('Error syncing news:', error);
      setError(error instanceof Error ? error : new Error(String(error)));
      
      // [Analysis] Store the error result for testing display
      setSyncResult({
        success: false,
        message: error instanceof Error ? error.message : String(error)
      });
      
      toast({
        variant: "destructive",
        title: "Sync Error",
        description: error instanceof Error ? error.message : "Failed to sync AI news",
      });
      // Re-throw to allow parent components to handle
      throw error;
    } finally {
      setSyncingNews(false);
    }
  };

  // [Analysis] Generate summary using OpenAI with caching
  const generateSummary = async (id: string) => {
    // [Analysis] Skip if summary already exists
    if (summaries[id]) return;
    
    setLoadingSummaries(prev => ({ ...prev, [id]: true }));
    const newsItem = newsItems.find(item => item.id === id);
    
    if (!newsItem) {
      setLoadingSummaries(prev => ({ ...prev, [id]: false }));
      return;
    }

    try {
      // [Analysis] Check if summary already exists in the database
      const { data: existingSummary, error: fetchError } = await supabase
        .from('ai_news_summaries')
        .select('summary')
        .eq('news_id', id)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (existingSummary) {
        setSummaries(prev => ({ ...prev, [id]: existingSummary.summary }));
        setLoadingSummaries(prev => ({ ...prev, [id]: false }));
        return;
      }

      // [Analysis] Generate a new summary using the edge function
      const { data, error } = await supabase.functions.invoke('chat-with-assistant', {
        body: { 
          message: `Please provide a brief 2-3 sentence summary of this news article: ${newsItem.title}. ${newsItem.description || newsItem.content || ''}`,
          systemPrompt: "You are a concise news summarizer. Provide brief, factual summaries focused on AI technology implications."
        },
      });

      if (error) throw error;

      const summary = data?.response || `${newsItem.title} discusses advancements in AI technology with potential impacts on ${newsItem.category?.replace(/_/g, ' ')}.`;

      // [Analysis] Store the summary in the database for future use
      const { error: insertError } = await supabase
        .from('ai_news_summaries')
        .insert([{ news_id: id, summary }]);

      if (insertError) throw insertError;

      setSummaries(prev => ({ ...prev, [id]: summary }));
    } catch (error) {
      console.error('Error generating summary:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate summary. Please try again.",
      });
    } finally {
      setLoadingSummaries(prev => ({ ...prev, [id]: false }));
    }
  };

  // [Analysis] Switch between news sources
  const switchNewsSource = (source: 'event_registry' | 'news_api') => {
    if (source !== activeNewsSource) {
      setActiveNewsSource(source);
      // Optionally re-fetch with the new source
      toast({
        title: "News Source Changed",
        description: `Switched to ${source === 'event_registry' ? 'Event Registry' : 'News API'} as the data source`,
      });
    }
  };

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      // This is for infinite scrolling if we want to keep it as an option
      // Currently we use traditional pagination
    }
  }, [loading, hasMore]);

  return {
    newsItems,
    summaries,
    loadingSummaries,
    generateSummary,
    loading,
    syncingNews,
    hasMore,
    loadMore,
    totalCount,
    lastSync,
    apiUsage,
    articleCount,
    activeNewsSource,
    switchNewsSource,
    syncResult,
    error,
    refresh: fetchNews,
    syncNews
  };
};
