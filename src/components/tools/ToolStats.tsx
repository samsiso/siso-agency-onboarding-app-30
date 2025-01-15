import { Star, Download, Heart } from 'lucide-react';
import { Tool } from './types';

interface ToolStatsProps {
  tool: Tool;
}

export function ToolStats({ tool }: ToolStatsProps) {
  if (tool.member_type) return null;

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="text-center p-6 rounded-lg bg-siso-text/5 hover:bg-siso-text/10 transition-colors">
        <Star className="h-6 w-6 text-siso-orange mx-auto mb-2" />
        <div className="text-lg font-medium text-siso-text-bold">{tool.rating?.toFixed(1) || '-'}</div>
        <div className="text-sm text-siso-text">Rating</div>
      </div>
      <div className="text-center p-6 rounded-lg bg-siso-text/5 hover:bg-siso-text/10 transition-colors">
        <Download className="h-6 w-6 text-siso-text/60 mx-auto mb-2" />
        <div className="text-lg font-medium text-siso-text-bold">{tool.downloads_count || '0'}</div>
        <div className="text-sm text-siso-text">Downloads</div>
      </div>
      <div className="text-center p-6 rounded-lg bg-siso-text/5 hover:bg-siso-text/10 transition-colors">
        <Heart className="h-6 w-6 text-siso-red mx-auto mb-2" />
        <div className="text-lg font-medium text-siso-text-bold">{tool.likes_count || '0'}</div>
        <div className="text-sm text-siso-text">Likes</div>
      </div>
    </div>
  );
}