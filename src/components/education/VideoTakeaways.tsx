
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { safeSupabase } from '@/utils/supabaseHelpers';

interface VideoTakeawaysProps {
  videoId: string;
}

export function VideoTakeaways({ videoId }: VideoTakeawaysProps) {
  const { data: takeaways, isLoading } = useQuery({
    queryKey: ['video-takeaways', videoId],
    queryFn: async () => {
      const { data, error } = await safeSupabase
        .from('video_summaries')
        .select('*')
        .eq('video_id', videoId)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading takeaways...</div>;
  }

  if (!takeaways) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-siso-text-bold">Key Takeaways</h3>
          <p className="text-siso-text">No takeaways available for this video yet.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-siso-text-bold">Key Takeaways</h3>
        <div className="space-y-3">
          {takeaways?.key_points?.map((point: string, index: number) => (
            <div key={index} className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-siso-orange flex-shrink-0 mt-0.5" />
              <p className="text-siso-text">{point}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
