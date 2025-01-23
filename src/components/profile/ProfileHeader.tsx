import { User, Trophy, Star, Upload, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ProfileHeaderProps {
  fullName: string | null;
  email: string | null;
  points: number;
  rank: string;
  avatarUrl?: string | null;
  onLogout: () => void;
  onBackToHome: () => void;
}

export const ProfileHeader = ({ 
  fullName, 
  email, 
  points, 
  rank, 
  avatarUrl,
  onLogout, 
  onBackToHome 
}: ProfileHeaderProps) => {
  const [uploading, setUploading] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const { toast } = useToast();

  useEffect(() => {
    // Check system preference
    if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      setTheme('light');
      document.documentElement.classList.remove('dark');
    }

    // Load saved preference
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: filePath })
        .eq('id', user.id);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Profile photo updated successfully",
      });

      window.location.reload();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload profile photo",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-siso-border dark:border-siso-border pb-6">
      <div className="flex items-center gap-4">
        <div className="relative group">
          {avatarUrl ? (
            <img 
              src={supabase.storage.from('avatars').getPublicUrl(avatarUrl).data.publicUrl}
              alt="Profile"
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-siso-red/20 to-siso-orange/20 flex items-center justify-center">
              <User className="w-8 h-8 text-siso-red" />
            </div>
          )}
          <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
              disabled={uploading}
            />
            <Upload className="w-6 h-6 text-white" />
          </label>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-siso-text-bold dark:text-siso-text-bold">
            {fullName || email?.split('@')[0]}
          </h1>
          <div className="flex items-center gap-2 text-siso-text/70 dark:text-siso-text/70">
            <Trophy className="w-4 h-4 text-siso-orange" />
            <span>{points || 0} points</span>
            <Star className="w-4 h-4 text-siso-orange ml-2" />
            <span>{rank || 'Newbie'}</span>
          </div>
        </div>
      </div>
      <div className="flex gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          className="rounded-full"
        >
          {theme === 'light' ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
        </Button>
        <Button 
          variant="outline" 
          className="border-siso-red text-siso-text dark:text-siso-text hover:bg-siso-red hover:text-white transition-colors"
          onClick={onLogout}
        >
          Logout
        </Button>
        <Button 
          variant="outline" 
          className="border-siso-text/20 text-siso-text-bold dark:text-siso-text-bold hover:bg-siso-text/10"
          onClick={onBackToHome}
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
};