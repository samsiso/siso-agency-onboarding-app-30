
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Video } from '../types';
import { useAuthSession } from '@/hooks/useAuthSession';
import { VideoThumbnail } from './VideoThumbnail';
import { VideoActions } from './VideoActions';
import { VideoMetadata } from './VideoMetadata';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Clock, Sparkles, Bookmark } from 'lucide-react';

interface OptimizedVideoCardProps {
  video: Video;
  index: number;
  onClick?: () => void;
  className?: string;
}

export const OptimizedVideoCard = ({ video, index, onClick, className }: OptimizedVideoCardProps) => {
  const [isInView, setIsInView] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { user } = useAuthSession();

  // [Analysis] Using intersection observer for performance optimization
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const currentElement = document.getElementById(`video-card-${index}`);
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => observer.disconnect();
  }, [index]);

  // Check if video is bookmarked
  useEffect(() => {
    if (!user?.id) return;
    
    const checkBookmarkStatus = async () => {
      const { data } = await supabase
        .from('video_bookmarks')
        .select('id')
        .eq('user_id', user.id)
        .eq('video_id', video.id)
        .maybeSingle();
      
      setIsBookmarked(!!data);
    };

    checkBookmarkStatus();
  }, [user?.id, video.id]);

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('[OptimizedVideoCard] Card clicked, delegating to onClick handler');
    onClick?.();
  };

  // [Analysis] Calculate if video is new (within last 7 days)
  const isNew = video.created_at && new Date(video.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  
  // [Analysis] Calculate if video is trending (more than 1000 views)
  const isTrending = video.metrics?.views > 1000;

  // Stagger animation delay based on index
  const staggerDelay = Math.min(index * 0.1, 0.8);

  return (
    <motion.div
      id={`video-card-${index}`}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: staggerDelay }}
      onClick={handleCardClick}
      className={cn(
        "group cursor-pointer rounded-lg border border-siso-border bg-siso-bg-alt overflow-hidden",
        "transition-all duration-300 hover:border-siso-orange/30 hover:bg-siso-text/5 hover:scale-[1.02]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-siso-orange",
        "relative",
        className
      )}
      tabIndex={0}
      role="article"
      aria-label={`Video: ${video.title}`}
    >
      <div className="relative">
        <VideoThumbnail
          thumbnailUrl={video.thumbnail_url}
          duration={video.duration}
          isInView={isInView}
          index={index}
        />
        
        {/* Status badges */}
        <div className="absolute top-2 left-2 flex gap-2">
          {isNew && (
            <Badge className="bg-green-500/90 text-white">
              NEW
            </Badge>
          )}
          {isTrending && (
            <Badge className="bg-orange-500/90 text-white flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Trending
            </Badge>
          )}
          {video.metrics?.difficulty && (
            <Badge className={cn(
              "text-white",
              video.metrics.difficulty === 'Beginner' && 'bg-blue-500/90',
              video.metrics.difficulty === 'Intermediate' && 'bg-yellow-500/90',
              video.metrics.difficulty === 'Advanced' && 'bg-red-500/90'
            )}>
              {video.metrics.difficulty}
            </Badge>
          )}
        </div>

        <VideoActions
          videoId={video.id}
          videoUrl={video.url}
          videoTitle={video.title}
          userId={user?.id}
          isBookmarked={isBookmarked}
          onBookmarkChange={setIsBookmarked}
        />
      </div>

      <div className="p-4 space-y-3">
        <h3 className={cn(
          "line-clamp-2 font-semibold text-siso-text-bold text-lg leading-tight",
          "group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-siso-red group-hover:to-siso-orange"
        )}>
          {video.title}
        </h3>

        {/* Video metadata with improved layout */}
        <div className="space-y-2">
          <VideoMetadata
            educator={video.educator}
            metrics={video.metrics}
          />
          
          {/* Additional metadata */}
          <div className="flex items-center gap-4 text-xs text-siso-text/60">
            {video.duration && (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {video.duration}
              </div>
            )}
            {video.created_at && (
              <time dateTime={new Date(video.created_at).toISOString()}>
                {new Date(video.created_at).toLocaleDateString()}
              </time>
            )}
          </div>
        </div>
      </div>

      {/* Progress bar for watched videos (if implemented) */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-siso-bg">
        <div className="h-full bg-gradient-to-r from-siso-red to-siso-orange" style={{ width: '0%' }} />
      </div>
    </motion.div>
  );
};
