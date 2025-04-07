
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageLoading } from '@/components/ui/message-loading';
import { FileText, Users, MessageSquare, BarChart } from 'lucide-react';

const DecoraPlan = () => {
  const navigate = useNavigate();
  const [loadingStep, setLoadingStep] = useState(1);
  
  useEffect(() => {
    // Set up a sequence of loading steps
    const step1 = setTimeout(() => setLoadingStep(2), 1500);
    const step2 = setTimeout(() => setLoadingStep(3), 3000);
    const step3 = setTimeout(() => setLoadingStep(4), 4500);
    
    // Final navigation
    const navigationTimer = setTimeout(() => {
      navigate('/plan/decora');
    }, 6000);
    
    return () => {
      clearTimeout(step1);
      clearTimeout(step2);
      clearTimeout(step3);
      clearTimeout(navigationTimer);
    };
  }, [navigate]);
  
  const loadingSteps = [
    { icon: <Users className="h-5 w-5 text-siso-orange" />, text: "Analyzing Decora's client management needs..." },
    { icon: <FileText className="h-5 w-5 text-siso-orange" />, text: "Customizing content management features..." },
    { icon: <MessageSquare className="h-5 w-5 text-siso-orange" />, text: "Optimizing communication tools..." },
    { icon: <BarChart className="h-5 w-5 text-siso-orange" />, text: "Finalizing analytics and reporting..." }
  ];
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-black via-siso-bg to-black p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-6"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Creating Your OnlyFans Management Suite
        </h1>
        <p className="text-siso-text max-w-md mx-auto">
          We're building a customized plan for Decora Agency based on your industry needs
        </p>
      </motion.div>
      
      <div className="max-w-md w-full bg-black/40 border border-siso-text/10 rounded-lg p-6 backdrop-blur-sm">
        <MessageLoading className="mx-auto mb-6" />
        
        <div className="space-y-4">
          {loadingSteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ 
                opacity: loadingStep > index ? 1 : 0.3,
                y: 0 
              }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              className="flex items-center gap-3"
            >
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                loadingStep > index ? 'bg-siso-orange/20' : 'bg-siso-text/5'
              }`}>
                {step.icon}
              </div>
              <p className={`text-sm ${
                loadingStep > index ? 'text-siso-text' : 'text-siso-text/50'
              }`}>
                {step.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DecoraPlan;
