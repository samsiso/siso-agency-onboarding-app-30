
import { motion } from 'framer-motion';
import { Calendar, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { useState, useCallback } from 'react';
import NewsCategories from './NewsCategories';
import { debounce } from '@/lib/utils';

interface NewsFiltersProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onDateChange?: (date: string | null) => void;
  selectedDate?: string | null;
}

// Animation variants for filter components to enhance UX
const itemVariants = {
  hidden: {
    opacity: 0,
    y: -10
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3
    }
  }
};

const NewsFilters = ({
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  onDateChange,
  selectedDate
}: NewsFiltersProps) => {
  const [dateFilter, setDateFilter] = useState<string>(selectedDate || '');
  const [inputValue, setInputValue] = useState(searchQuery);

  // Use debounce to prevent too many search requests
  const debouncedSearch = useCallback(debounce((value: string) => {
    onSearchChange(value);
  }, 350), [onSearchChange]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    debouncedSearch(value);
  };

  const handleDateSubmit = () => {
    if (onDateChange) {
      onDateChange(dateFilter || null);
    }
  };

  const clearDateFilter = () => {
    setDateFilter('');
    if (onDateChange) {
      onDateChange(null);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="show"
        className="flex flex-col md:flex-row gap-4"
      >
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search AI news..."
            value={inputValue}
            onChange={handleSearchChange}
            className="pl-10 bg-background/50 border-muted"
          />
        </div>

        {onDateChange && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2 whitespace-nowrap">
                <Calendar className="h-4 w-4" />
                {selectedDate ? selectedDate : "Filter by date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="end">
              <div className="space-y-4">
                <h3 className="font-medium text-sm">Filter by specific date</h3>
                <div className="space-y-2">
                  <Label htmlFor="date-filter">Date (YYYY-MM-DD)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="date-filter"
                      type="date"
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="flex justify-between">
                  <Button variant="ghost" size="sm" onClick={clearDateFilter}>
                    Clear
                  </Button>
                  <Button size="sm" onClick={handleDateSubmit}>
                    Apply Filter
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </motion.div>

      <NewsCategories
        selectedCategory={selectedCategory}
        onCategoryChange={onCategoryChange}
        className="pb-2"
      />
    </div>
  );
};

export default NewsFilters;
