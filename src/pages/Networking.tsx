import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tabs } from '@/components/ui/tabs';
import { CommunityMemberCard } from '@/components/community/CommunityMemberCard';
import { CommunityMemberDetails } from '@/components/community/CommunityMemberDetails';
import { CommunityMember } from '@/components/community/types';
import { Sidebar } from '@/components/Sidebar';
import { NetworkingHeader } from '@/components/networking/NetworkingHeader';
import { NetworkingCategories } from '@/components/networking/NetworkingCategories';

export default function Networking() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMember, setSelectedMember] = useState<CommunityMember | null>(null);

  const { data: members, isLoading } = useQuery({
    queryKey: ['networking-members', selectedCategory],
    queryFn: async () => {
      console.log('Fetching networking resources...');
      let query = supabase
        .from('networking_resources')
        .select('*');
      
      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching networking resources:', error);
        throw error;
      }
      
      const transformedData = data.map(resource => ({
        id: resource.id,
        name: resource.name,
        description: resource.description,
        member_type: resource.category,
        platform: resource.platform,
        join_url: resource.join_url,
        member_count: resource.member_count,
        profile_image_url: resource.profile_image_url,
        youtube_url: null,
        youtube_videos: null,
        website_url: null,
        specialization: null,
        content_themes: null,
      })) as CommunityMember[];
      
      console.log('Fetched networking resources:', transformedData);
      return transformedData;
    },
  });

  const filteredMembers = members?.filter(member => 
    !searchQuery || 
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = {
    all: members?.length || 0,
    business: members?.filter(m => m.member_type === 'Business').length || 0,
    technology: members?.filter(m => m.member_type === 'Technology').length || 0,
    'personal development': members?.filter(m => m.member_type === 'Personal Development').length || 0,
    finance: members?.filter(m => m.member_type === 'Finance').length || 0,
    ai: members?.filter(m => m.member_type === 'AI').length || 0,
  };

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-b from-siso-bg to-siso-bg/95">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <NetworkingHeader 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          <Tabs defaultValue="all" className="w-full" onValueChange={setSelectedCategory}>
            <NetworkingCategories 
              categories={categories}
              selectedCategory={selectedCategory}
            />
          </Tabs>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
              {[...Array(8)].map((_, i) => (
                <div 
                  key={i}
                  className="h-48 rounded-lg bg-siso-text/5 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
              {filteredMembers?.map((member) => (
                <CommunityMemberCard
                  key={member.id}
                  member={member}
                  onClick={setSelectedMember}
                />
              ))}
            </div>
          )}

          <CommunityMemberDetails
            member={selectedMember}
            onClose={() => setSelectedMember(null)}
          />
        </div>
      </div>
    </div>
  );
}