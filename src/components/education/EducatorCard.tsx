
import { motion } from 'framer-motion';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { cn } from '@/lib/utils';
import { User, MapPin, Video, TrendingUp, Crown, ImageOff, Clock, RefreshCw } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

interface EducatorCardProps {
  educator: {
    name: string;
    description?: string;
    profile_image_url?: string;
    channel_avatar_url?: string;
    channel_banner_url?: string;
    number_of_subscribers?: number;
    channel_total_videos?: number;
    specialization?: string[];
    channel_location?: string;
    slug: string;
    is_featured?: boolean;
    sync_status?: string;
    last_synced_at?: string;
  };
  onClick?: () => void;
  className?: string;
}

// [Analysis] Format large numbers to human readable format (e.g., 1.2M)
const formatNumber = (num?: number) => {
  if (!num) return '0';
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

const getSyncStatusColor = (status?: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-500';
    case 'failed':
      return 'bg-red-500';
    case 'in_progress':
      return 'bg-blue-500';
    default:
      return 'bg-gray-500';
  }
};

const getSyncStatusText = (status?: string) => {
  switch (status) {
    case 'completed':
      return 'Synced';
    case 'failed':
      return 'Sync Failed';
    case 'in_progress':
      return 'Syncing...';
    default:
      return 'Pending Sync';
  }
};

export const EducatorCard = ({ educator, className }: EducatorCardProps) => {
  const [bannerLoaded, setBannerLoaded] = useState(false);
  const [bannerError, setBannerError] = useState(false);
  const [avatarLoaded, setAvatarLoaded] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  // [Analysis] Pre-load images to prevent layout shift
  useEffect(() => {
    if (educator.channel_banner_url) {
      const img = new Image();
      img.src = educator.channel_banner_url;
      img.onload = () => setBannerLoaded(true);
      img.onerror = () => setBannerError(true);
    }

    if (educator.channel_avatar_url || educator.profile_image_url) {
      const img = new Image();
      img.src = educator.channel_avatar_url || educator.profile_image_url || '';
      img.onload = () => setAvatarLoaded(true);
      img.onerror = () => setAvatarError(true);
    }
  }, [educator.channel_banner_url, educator.channel_avatar_url, educator.profile_image_url]);

  return (
    <Link 
      to={`/education/educators/${educator.slug}`}
      className="block"
      aria-label={`View ${educator.name}'s profile`}
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "group relative h-[480px] cursor-pointer rounded-xl border border-siso-border",
          "bg-gradient-to-br from-siso-bg-alt/50 to-siso-bg overflow-hidden transition-all duration-500",
          "hover:shadow-lg hover:shadow-black/20 hover:border-siso-orange/30",
          "backdrop-blur-sm",
          educator.is_featured && "ring-1 ring-siso-orange/30",
          className
        )}
      >
        {/* Banner Section */}
        <div className="relative h-40 w-full overflow-hidden">
          {educator.channel_banner_url ? (
            <motion.div 
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ 
                opacity: bannerLoaded ? 1 : 0,
                scale: bannerLoaded ? 1 : 1.1
              }}
              transition={{ duration: 0.5 }}
            >
              <AspectRatio ratio={16/5} className="h-full">
                {!bannerError ? (
                  <img
                    src={educator.channel_banner_url}
                    alt={`${educator.name}'s channel banner`}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-r from-siso-red/10 to-siso-orange/10 flex items-center justify-center">
                    <ImageOff className="w-8 h-8 text-siso-text/30" />
                  </div>
                )}
              </AspectRatio>
            </motion.div>
          ) : (
            <div className="h-full w-full bg-gradient-to-r from-siso-red/10 to-siso-orange/10" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          
          {educator.is_featured && (
            <Badge 
              variant="secondary" 
              className="absolute top-4 right-4 bg-black/40 backdrop-blur-sm border-siso-orange/30"
            >
              <Crown className="w-3 h-3 mr-1 text-siso-orange" />
              Featured Creator
            </Badge>
          )}
        </div>

        {/* Sync Status Badge */}
        {educator.sync_status && (
          <div className="absolute top-2 left-2 z-10">
            <Badge
              variant="secondary"
              className={cn(
                "flex items-center gap-1.5 text-white",
                getSyncStatusColor(educator.sync_status)
              )}
            >
              {educator.sync_status === 'in_progress' ? (
                <RefreshCw className="w-3 h-3 animate-spin" />
              ) : (
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  getSyncStatusColor(educator.sync_status)
                )} />
              )}
              {getSyncStatusText(educator.sync_status)}
            </Badge>
          </div>
        )}

        {/* Profile Section - Floating on Banner */}
        <div className="relative px-6 -mt-10">
          <motion.div 
            className="relative h-20 w-20 rounded-2xl overflow-hidden ring-4 ring-siso-bg"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {(educator.channel_avatar_url || educator.profile_image_url) ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: avatarLoaded ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {!avatarError ? (
                  <AspectRatio ratio={1} className="h-full">
                    <img
                      src={educator.channel_avatar_url || educator.profile_image_url}
                      alt={educator.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </AspectRatio>
                ) : (
                  <div className="h-full w-full bg-siso-bg-alt flex items-center justify-center">
                    <User className="w-8 h-8 text-siso-text/70" />
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="h-full w-full bg-siso-bg-alt flex items-center justify-center">
                <User className="w-8 h-8 text-siso-text/70" />
              </div>
            )}
          </motion.div>
        </div>

        {/* Content Section */}
        <div className="px-6 mt-4 space-y-4">
          <div>
            <h3 className="text-xl font-semibold text-siso-text-bold truncate group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-siso-red group-hover:to-siso-orange transition-all duration-300">
              {educator.name}
            </h3>
            
            <div className="flex items-center gap-4 mt-2 text-sm text-siso-text/70">
              {educator.number_of_subscribers && (
                <div className="flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  <span>{formatNumber(educator.number_of_subscribers)} subscribers</span>
                </div>
              )}
              
              {educator.last_synced_at && (
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>Last synced {format(new Date(educator.last_synced_at), 'MMM d, yyyy')}</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {educator.channel_location && (
              <div className="flex items-center gap-1.5 text-sm text-siso-text/70">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{educator.channel_location}</span>
              </div>
            )}
            {educator.channel_total_videos && (
              <div className="flex items-center gap-1.5 text-sm text-siso-text/70">
                <Video className="w-4 h-4 flex-shrink-0" />
                <span>{educator.channel_total_videos} videos</span>
              </div>
            )}
          </div>

          {/* Description - Fixed Height with Ellipsis */}
          {educator.description && (
            <p className="text-sm text-siso-text/70 line-clamp-3 h-[4.5rem] group-hover:text-siso-text/90 transition-colors">
              {educator.description}
            </p>
          )}

          {/* Specializations - Scrollable Container */}
          {educator.specialization && educator.specialization.length > 0 && (
            <ScrollArea className="h-24 w-full">
              <div className="flex flex-wrap gap-2">
                {educator.specialization.map((spec, index) => (
                  <motion.span
                    key={index}
                    className="text-xs px-2 py-1 rounded-full bg-gradient-to-r from-siso-red/10 to-siso-orange/10 text-siso-text/90 border border-siso-border/50 group-hover:border-siso-orange/30 transition-colors whitespace-nowrap"
                    whileHover={{ scale: 1.05 }}
                  >
                    {spec}
                  </motion.span>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </motion.div>
    </Link>
  );
};
