
import { Search, Command, Mic, X, Clock, History, ArrowLeft } from 'lucide-react';
import { PlaceholdersAndVanishInput } from '@/components/ui/placeholders-and-vanish-input';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { SearchHistory } from './SearchHistory';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';

interface SearchInputProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  placeholders: string[];
}

export const SearchInput = ({ 
  searchQuery, 
  onSearchChange, 
  onFocus, 
  onBlur, 
  onSubmit,
  placeholders 
}: SearchInputProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // [Analysis] Use React Query for better caching and loading states
  const { data: searchHistory, refetch: refetchHistory } = useQuery({
    queryKey: ['search-history'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_search_history')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
    enabled: isExpanded
  });

  const handleFocus = () => {
    setIsExpanded(true);
    onFocus();
  };

  const handleBlur = () => {
    // [Analysis] Small delay to allow clicking search history items
    setTimeout(() => {
      setIsExpanded(false);
      onBlur();
    }, 200);
  };

  const clearSearch = () => {
    onSearchChange('');
  };

  // [Analysis] Create a wrapper function to handle the refetch promise
  const handleHistoryRefetch = async () => {
    await refetchHistory();
  };

  return (
    <div className="relative w-full">
      <div className="relative group">
        <PlaceholdersAndVanishInput
          placeholders={placeholders}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onSubmit={onSubmit}
          className="w-full h-14 pl-12 pr-24 bg-black/20 backdrop-blur-sm
            border border-[#FF5722]/20 rounded-xl text-lg text-white placeholder-white/60
            focus:ring-2 focus:ring-[#FF5722]/30 focus:border-[#FF5722]/40
            hover:bg-black/30 hover:border-[#FF5722]/30 relative z-[102]
            transition-all duration-300"
        />
        
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#FF5722]/70 
          group-hover:text-[#FF5722] transition-colors z-[102]" />
        
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-white/70 z-[102]">
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border 
            border-[#FF5722]/20 bg-black/20 px-1.5 font-mono text-[10px] font-medium text-white/80">
            <span className="text-xs"><Command className="h-3 w-3" /></span>K
          </kbd>
          <Mic className="w-5 h-5 cursor-pointer hover:text-[#FF5722] transition-colors" />
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-[101]"
          >
            <Card className="p-4 border-siso-border bg-black/90 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-4 text-siso-text/70">
                <History className="w-4 h-4" />
                <span className="text-sm font-medium">Recent Searches</span>
              </div>
              
              <SearchHistory
                history={searchHistory || []}
                onHistoryCleared={handleHistoryRefetch}
                onSearchSelect={(query) => {
                  onSearchChange(query);
                  setIsExpanded(false);
                }}
              />
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
