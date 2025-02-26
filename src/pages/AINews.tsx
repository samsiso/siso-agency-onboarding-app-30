
import { useState, useEffect } from 'react';
import { NewsTabs } from '@/components/ai-news/NewsTabs';
import { NewsHeader } from '@/components/ai-news/NewsHeader';
import { MainLayout } from '@/components/assistants/layout/MainLayout';
import { NewsTabContent } from '@/components/ai-news/NewsTabContent';
import { useNewsItems } from '@/hooks/useNewsItems';
import { NewsErrorBoundary } from '@/components/ai-news/NewsErrorBoundary';
import { VideoProcessingTest } from '@/components/VideoProcessingTest'; // Add import for the new component
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';

export default function AINews() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('latest');

  const {
    newsItems,
    summaries,
    loadingSummaries,
    generateSummary,
    loading,
    hasMore,
    loadMore,
    error
  } = useNewsItems(selectedCategory);

  useEffect(() => {
    const trackPageView = async () => {
      try {
        // Track page view for analytics
        console.log('AI News page viewed');
      } catch (error) {
        console.error('Error tracking page view:', error);
      }
    };

    trackPageView();
  }, []);

  return (
    <MainLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8">
        <Tabs defaultValue="news" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="news">AI News</TabsTrigger>
            <TabsTrigger value="videos">Video Processing</TabsTrigger>
          </TabsList>
          
          <TabsContent value="news" className="space-y-4">
            <NewsHeader
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
            
            <NewsTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
            
            <NewsErrorBoundary>
              <NewsTabContent
                newsItems={newsItems}
                summaries={summaries}
                loadingSummaries={loadingSummaries}
                onGenerateSummary={generateSummary}
                searchQuery={searchQuery}
                loading={loading}
                hasMore={hasMore}
                loadMore={loadMore}
                error={error}
              />
            </NewsErrorBoundary>
          </TabsContent>
          
          <TabsContent value="videos">
            <div className="p-4">
              <h2 className="text-2xl font-bold mb-6">YouTube Video Processing</h2>
              <VideoProcessingTest />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
