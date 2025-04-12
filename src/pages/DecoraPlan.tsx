
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useOnboardingAuth } from '@/hooks/useOnboardingAuth';
import { WelcomeLoader } from '@/components/plan/WelcomeLoader';
import { useToast } from '@/hooks/use-toast';

export const useTypewriter = (text: string, speed: number = 80) => {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i <= text.length) {
        setDisplayText(text.substring(0, i));
        i++;
      } else {
        clearInterval(interval);
        setIsComplete(true);
      }
    }, speed);
    
    return () => clearInterval(interval);
  }, [text, speed]);

  return { displayText, isComplete };
};

const DecoraPlan = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userId } = useOnboardingAuth();
  const [progress, setProgress] = useState(0);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [redirectAttempted, setRedirectAttempted] = useState(false);
  const agencyName = "Decora Agency";
  
  const { displayText, isComplete: typingComplete } = useTypewriter(agencyName);
  
  // Progress animation
  useEffect(() => {
    if (typingComplete) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setLoadingComplete(true);
            return 100;
          }
          return prev + 3;
        });
      }, 120);
      
      return () => clearInterval(interval);
    }
  }, [typingComplete]);
  
  // Auto-redirect after loading completes with error handling
  useEffect(() => {
    if (loadingComplete && !redirectAttempted) {
      // Auto-redirect after a delay - with fixed lowercase username
      setRedirectAttempted(true);
      const redirectTimer = setTimeout(() => {
        console.log("DecoraPlan: Redirecting to /plan/decora");
        
        // Show toast when redirecting
        toast({
          title: "Your plan is ready!",
          description: "Redirecting you to your personalized plan."
        });
        
        navigate('/plan/decora', { replace: true });
      }, 1000);
      
      return () => clearTimeout(redirectTimer);
    }
  }, [loadingComplete, navigate, redirectAttempted, toast]);
  
  // Loading steps
  const loadingSteps = [
    "Analyzing your business needs",
    "Preparing feature recommendations",
    "Generating your custom plan"
  ];
  
  const handleContinue = () => {
    console.log("Manual continue clicked, redirecting to /plan/decora");
    toast({
      title: "Your plan is ready!",
      description: "Redirecting you to your personalized plan."
    });
    navigate('/plan/decora', { replace: true });
  };
  
  // Show the welcome/loading screen
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-siso-bg to-black flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-xl w-full z-10"
      >
        {!typingComplete ? (
          <div className="bg-black/40 backdrop-blur-sm rounded-lg p-8 border border-siso-orange/20">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-5"
            >
              <Sparkles className="h-16 w-16 text-siso-orange mx-auto mb-4" />
            </motion.div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Welcome, <span className="text-siso-orange">{displayText}</span>
              <span className="animate-pulse">|</span>
            </h1>
          </div>
        ) : (
          <WelcomeLoader
            progress={progress}
            complete={loadingComplete}
            steps={loadingSteps}
            onContinue={handleContinue}
          />
        )}
      </motion.div>
    </div>
  );
};

export default DecoraPlan;
