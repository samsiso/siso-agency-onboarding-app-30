
import { Video } from '@/components/education/types';
import { LazyVideoPlayer } from './player';
import { VideoMetadata } from './VideoMetadata';
import { VideoCreatorInfo } from './VideoCreatorInfo';
import { VideoActions } from './VideoActions';
import { VideoInteractionPanel } from './VideoInteractionPanel';
import { RelatedVideos } from '@/components/education/RelatedVideos';
import { motion } from 'framer-motion';

interface VideoDetailLayoutProps {
  video: Video;
  activeTab: string;
}

export const VideoDetailLayout = ({ video, activeTab }: VideoDetailLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900">
      {/* [Analysis] Full-width video section with gradient overlay for better contrast */}
      <div className="relative w-full bg-black/60">
        <div className="max-w-[1800px] mx-auto">
          <LazyVideoPlayer videoId={video.id} title={video.title} />
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto grid grid-cols-1 xl:grid-cols-3 gap-6 p-4">
        <motion.div 
          className="xl:col-span-2 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Content Card with Glass Effect */}
          <div className="space-y-6 rounded-xl bg-white/5 backdrop-blur-sm p-6 border border-white/10">
            <VideoMetadata 
              title={video.title}
              viewCount={video.metrics.views}
              publishDate={video.created_at || null}
            />
            
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-4">
              <VideoCreatorInfo
                channelName={video.educator.name}
                channelAvatar={video.educator.avatar_url}
                educatorSlug=""
              />
              <VideoActions />
            </div>
          </div>

          {/* Tabs Panel with Glass Effect */}
          <div className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden">
            <VideoInteractionPanel videoId={video.id} activeTab={activeTab} />
          </div>
        </motion.div>

        {/* Related Videos with Glass Effect */}
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-4">
            <RelatedVideos 
              currentVideoId={video.id} 
              topics={video.topics}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};
