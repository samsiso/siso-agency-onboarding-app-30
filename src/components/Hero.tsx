import { useEffect, useState } from 'react';
import { AuthButton } from './AuthButton';
import { supabase } from '@/integrations/supabase/client';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { handleAuthCallback } from '@/utils/authUtils';
import { useSidebar } from './ui/sidebar';
import { Sidebar } from './Sidebar';

export const Hero = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { setOpen } = useSidebar();

  useEffect(() => {
    // Handle OAuth callback if present
    if (window.location.hash) {
      handleAuthCallback();
    }

    // Check for existing session on mount
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          console.log('Found existing session for user:', session.user.id);
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', session.user.id)
            .single();
          
          if (error) {
            console.error('Error fetching profile:', error);
            return;
          }
          
          setUserName(profile?.full_name || session.user.email?.split('@')[0]);
          navigate('/profile');
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      
      if (event === 'SIGNED_IN' && session?.user) {
        try {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', session.user.id)
            .single();
          
          if (error) {
            console.error('Error fetching profile:', error);
            return;
          }
          
          setUserName(profile?.full_name || session.user.email?.split('@')[0]);
          toast({
            title: "Successfully signed in",
            description: "Welcome to SISO Resource Hub!",
          });
          navigate('/profile');
        } catch (error) {
          console.error('Error in auth state change handler:', error);
        }
      } else if (event === 'SIGNED_OUT') {
        setUserName(null);
        toast({
          title: "Signed out",
          description: "Come back soon!",
        });
        navigate('/');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast, navigate]);

  const handleResourceClick = (path: string) => {
    setOpen(true); // Open the sidebar when clicking a resource
    navigate(path);
  };

  const resourceGuideItems = [
    {
      icon: "🔧",
      title: "Core Tools & Platforms",
      desc: "Access our curated list of daily tools, complete with how-to videos and integration guides.",
      path: "/tools"
    },
    {
      icon: "📚",
      title: "SISO Education Hub",
      desc: "Learn from top educators and creators, with access to valuable templates and workflows.",
      path: "/education"
    },
    {
      icon: "🌐",
      title: "SISO Networking",
      desc: "Connect with professional communities and experts to accelerate your growth.",
      path: "/networking"
    },
    {
      icon: "🤖",
      title: "SISO Automations",
      desc: "Leverage our custom-built automations for client management, lead generation, and workflows.",
      path: "/automations"
    },
    {
      icon: "💬",
      title: "ChatGPT Assistants",
      desc: "Get AI-powered guidance tailored to your specific needs and challenges.",
      path: "/assistants"
    },
    {
      icon: "🧠",
      title: "SISO AI",
      desc: "Receive personalized recommendations from your AI consultant based on your business context.",
      path: "/siso-ai"
    }
  ];

  return (
    <div className="relative min-h-screen">
      <Sidebar />
      <div className="absolute inset-0 bg-gradient-to-br from-siso-bg via-siso-bg/95 to-siso-bg/90" />
      
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="text-center space-y-8 sm:space-y-12">
          {/* Welcome Message */}
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-siso-text-bold leading-tight">
              {!loading && userName ? (
                <>
                  Welcome back,{' '}
                  <span className="bg-gradient-to-r from-siso-orange to-siso-red text-transparent bg-clip-text animate-gradient">
                    {userName}
                  </span>
                </>
              ) : (
                <>
                  Welcome to{' '}
                  <div className="relative inline-block mt-4">
                    <div className="relative p-3 sm:p-4 rounded-lg bg-black/30 backdrop-blur-sm border border-siso-text/10">
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-siso-orange to-siso-red opacity-10 animate-pulse" />
                      <span className="relative bg-gradient-to-r from-siso-orange to-siso-red text-transparent bg-clip-text">
                        SISO Agency Resources
                      </span>
                    </div>
                  </div>
                </>
              )}
            </h1>
            <p className="text-xl sm:text-2xl text-siso-text max-w-3xl mx-auto leading-relaxed">
              Your gateway to tools, education, networking, and AI-powered innovation—crafted to help your agency thrive.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <AuthButton />
            <Button 
              variant="outline" 
              className="w-full sm:w-auto min-w-[150px] border border-siso-text/20 text-siso-text-bold 
                hover:bg-gradient-to-r from-siso-red/10 to-siso-orange/10 hover:border-siso-text/40 
                transition-all duration-300"
              onClick={() => handleResourceClick('/tools')}
            >
              Learn More
            </Button>
          </div>

          {/* Resource Guide */}
          <div className="mt-20">
            <div className="relative p-6 rounded-xl bg-black/30 backdrop-blur-sm border border-siso-text/10 
              hover:border-siso-text/20 transition-all duration-300">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-siso-orange/5 to-siso-red/5" />
              
              <h2 className="text-3xl font-bold text-siso-text-bold mb-8 bg-gradient-to-r from-siso-orange to-siso-red 
                text-transparent bg-clip-text">
                Resource Hub Guide
              </h2>
              
              <ScrollArea className="h-[450px] rounded-lg px-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                  {resourceGuideItems.map((item, i) => (
                    <div
                      key={i}
                      className="group p-4 rounded-lg bg-siso-bg/50 hover:bg-siso-bg/70 
                        border border-siso-text/10 hover:border-siso-text/20 transition-all duration-300
                        cursor-pointer"
                      onClick={() => handleResourceClick(item.path)}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
                          {item.icon}
                        </span>
                        <div>
                          <h3 className="text-lg font-semibold text-siso-text-bold mb-2">{item.title}</h3>
                          <p className="text-sm text-siso-text/90 leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-12 space-y-8 border-t border-siso-text/10 pt-8">
                  <section>
                    <h3 className="text-xl font-semibold text-siso-text-bold mb-4">Why Choose SISO Resource Hub?</h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[
                        "Built and tested by industry experts",
                        "Regularly updated with latest tools",
                        "Free access to valuable content"
                      ].map((item, i) => (
                        <li key={i} className="p-3 rounded-lg bg-siso-bg/50 border border-siso-text/10 
                          text-sm text-siso-text/90 hover:bg-siso-bg/70 hover:border-siso-text/20 
                          transition-all duration-300">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section className="pb-4">
                    <h3 className="text-xl font-semibold text-siso-text-bold mb-4">Get Started Today</h3>
                    <p className="text-sm text-siso-text/90 leading-relaxed">
                      Begin with Core Tools & Platforms, explore the Education Hub, and leverage our Networking 
                      and Automations sections to scale your agency effectively.
                    </p>
                  </section>
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};