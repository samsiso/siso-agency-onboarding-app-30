import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { GradientHeading } from '@/components/ui/gradient-heading';
import { 
  CheckCircle, 
  Loader2, 
  ArrowRight, 
  Calendar, 
  DollarSign, 
  Users, 
  FileText, 
  MessageSquare, 
  BarChart, 
  Shield, 
  Settings, 
  Target,
  Smartphone,
  Heart,
  ExternalLink,
  Sparkles,
  TrendingUp,
  Clock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { MessageLoading } from '@/components/ui/message-loading';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ColorPicker } from '@/components/plan/ColorPicker';
import { FeatureSelection, Feature } from '@/components/plan/FeatureSelection';
import { CaseStudy } from '@/components/plan/CaseStudy';
import { WelcomeMessage } from '@/components/plan/WelcomeMessage';
import { Skeleton } from '@/components/ui/skeleton';
import { InteractiveCallout } from '@/components/plan/InteractiveCallout';
import { PainPointsModal, PainPointDetailProps } from '@/components/plan/PainPointsModal';

interface PlanData {
  id: string;
  username: string;
  company_name: string | null;
  app_name: string | null;
  features: string[] | null;
  branding: {
    logo?: string;
    primary_color?: string;
    secondary_color?: string;
  } | null;
  estimated_cost: number | null;
  estimated_days: number | null;
  status: string | null;
}

interface FeatureCategory {
  name: string;
  icon: JSX.Element;
  description: string;
  features: string[];
}

interface PainPoint {
  problem: string;
  statistic: string;
  solution: string;
  detailedSolution: string;
  benefits: string[];
  metrics: { label: string; value: string; icon: JSX.Element }[];
  images: { url: string; caption: string }[];
  caseStudyLink: string;
}

interface Testimonial {
  content: string;
  author: string;
  position: string;
  instagram?: string;
  appLink?: string;
}

const brandColorOptions = [
  { name: 'Classic Red', value: '#E53E3E' },
  { name: 'Vibrant Orange', value: '#ED8936' },
  { name: 'Royal Purple', value: '#805AD5' },
  { name: 'Ocean Blue', value: '#3182CE' },
  { name: 'Emerald Green', value: '#38A169' },
  { name: 'Hot Pink', value: '#D53F8C' },
  { name: 'Slate Gray', value: '#4A5568' },
  { name: 'Midnight Black', value: '#1A202C' },
  { name: 'Modern Teal', value: '#319795' }
];

const caseStudies = [
  {
    title: 'OnlyFans Management Platform for Agency X',
    description: 'How we helped Agency X increase their client retention by 40% and double their revenue with our custom platform.',
    imageUrl: '/lovable-uploads/c7ac43fd-bc3e-478d-8b4f-809beafb6838.png',
    notionUrl: 'https://www.notion.so/Case-Study-OnlyFans-Management-Platform-123456'
  },
  {
    title: 'Creator Content Management System',
    description: 'A dedicated content scheduling and management system that improved workflow efficiency by 60%.',
    imageUrl: '/lovable-uploads/1f9eba1e-c2af-4ed8-84e7-a375872c9182.png',
    notionUrl: 'https://www.notion.so/Case-Study-Content-Management-System-789012'
  },
  {
    title: 'Fan Engagement & Analytics Dashboard',
    description: 'How our analytics tools helped boost fan engagement and increase subscription renewal rates.',
    imageUrl: '/lovable-uploads/19ca8c73-3736-4506-bfb2-de867b272e12.png',
    notionUrl: 'https://www.notion.so/Case-Study-Fan-Engagement-Analytics-345678'
  }
];

const additionalFeatures: Feature[] = [
  {
    id: 'white-label',
    name: 'White Label Branding',
    description: 'Remove all Siso branding and use your own logo and colors throughout the platform.',
    price: 1200,
    included: false
  },
  {
    id: 'mobile-apps',
    name: 'Native Mobile Apps',
    description: 'iOS and Android mobile apps for your team and clients to access the platform on the go.',
    price: 2500,
    included: false
  },
  {
    id: 'api-integration',
    name: 'Custom API Integrations',
    description: 'Connect with additional platforms and services beyond our standard integrations.',
    price: 1800,
    included: false
  },
  {
    id: 'ai-insights',
    name: 'AI Content Insights',
    description: 'Advanced AI tools to analyze content performance and suggest improvements.',
    price: 1500,
    included: false
  },
  {
    id: 'premium-support',
    name: 'Premium Support Package',
    description: '24/7 dedicated support team with 1-hour response time and monthly strategy calls.',
    price: 950,
    included: false
  }
];

const Plan = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [plan, setPlan] = useState<PlanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('features');
  
  const [primaryColor, setPrimaryColor] = useState('#ED8936');
  const [secondaryColor, setSecondaryColor] = useState('#E53E3E');
  const [selectedFeatures, setSelectedFeatures] = useState<Feature[]>(additionalFeatures);
  const [totalCost, setTotalCost] = useState<number | null>(null);
  
  const featuresRef = useRef<HTMLDivElement>(null);
  
  const [selectedPainPoint, setSelectedPainPoint] = useState<PainPointDetailProps | null>(null);
  const [isPainPointModalOpen, setIsPainPointModalOpen] = useState(false);
  
  const loadingAnimationSteps = [
    "Analyzing your business needs...",
    "Customizing platform features...",
    "Finalizing your tailored solution...",
    "Almost ready to showcase your plan!"
  ];
  const [loadingStep, setLoadingStep] = useState(0);
  
  const loadPlan = async () => {
    try {
      setLoading(true);
      
      const loadingInterval = setInterval(() => {
        setLoadingStep(prev => (prev + 1) % loadingAnimationSteps.length);
      }, 1500);
      
      if (!username) {
        throw new Error('Username is required');
      }
      
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .eq('username', username)
        .maybeSingle();
        
      if (error) {
        throw error;
      }
      
      const safeData: PlanData = {
        id: data?.id || '',
        username: data?.username || '',
        company_name: data?.company_name || null,
        app_name: data?.app_name || null,
        features: data?.features || null,
        branding: {
          logo: data?.branding?.logo || undefined,
          primary_color: typeof data?.branding === 'object' ? data?.branding.primary_color : '#ED8936',
          secondary_color: typeof data?.branding === 'object' ? data?.branding.secondary_color : '#E53E3E'
        },
        estimated_cost: data?.estimated_cost || null,
        estimated_days: data?.estimated_days || null,
        status: data?.status || null,
      };
      
      setPlan(safeData);
      
      if (safeData.branding?.primary_color) {
        setPrimaryColor(safeData.branding.primary_color);
      }
      
      if (safeData.branding?.secondary_color) {
        setSecondaryColor(safeData.branding.secondary_color);
      }
      
      setTotalCost(safeData.estimated_cost || 0);
      
      setTimeout(() => {
        clearInterval(loadingInterval);
        setLoading(false);
      }, 1200);
      
    } catch (error) {
      console.error('Error fetching plan:', error);
      toast({
        title: "Error loading plan",
        description: "We couldn't load the plan details. Please try again later.",
        variant: "destructive"
      });
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadPlan();
  }, [username, toast, loadingAnimationSteps.length]);
  
  useEffect(() => {
    if (plan) {
      const additionalCost = selectedFeatures
        .filter(feature => feature.included)
        .reduce((total, feature) => total + feature.price, 0);
        
      setTotalCost((plan.estimated_cost || 0) + additionalCost);
    }
  }, [selectedFeatures, plan]);
  
  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSubmitPlan = async () => {
    if (!plan) return;
    
    try {
      setSubmitting(true);
      
      const { error } = await supabase
        .from('plans')
        .update({ 
          status: 'approved',
          estimated_cost: totalCost,
          branding: {
            ...plan.branding,
            primary_color: primaryColor,
            secondary_color: secondaryColor
          }
        })
        .eq('id', plan.id);
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Plan approved!",
        description: "Your plan has been submitted successfully. Let's get started!",
      });
      
      setTimeout(() => {
        navigate(`/onboarding-chat`);
      }, 1500);
      
    } catch (error) {
      console.error('Error updating plan:', error);
      toast({
        title: "Error submitting plan",
        description: "We couldn't submit your plan. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-siso-bg to-black p-4">
        <div className="max-w-md w-full bg-black/40 border border-siso-text/10 rounded-lg p-6 backdrop-blur-sm">
          <div className="text-center mb-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Sparkles className="h-12 w-12 text-siso-orange mx-auto mb-3" />
              <h2 className="text-2xl font-bold text-white mb-1">
                {username === 'decora' ? 'Welcome, Decora Agency!' : 'Preparing Your Custom Plan'}
              </h2>
              <p className="text-siso-text text-sm">
                {username === 'decora' 
                  ? "We're finalizing your custom OnlyFans Management Suite"
                  : "We're tailoring a solution just for your business needs"}
              </p>
            </motion.div>
          </div>
          
          <MessageLoading className="mx-auto mb-6" />
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mb-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-siso-text">Loading your custom plan</span>
              <span className="text-sm text-siso-orange">{Math.min(25 * (loadingStep + 1), 100)}%</span>
            </div>
            <div className="h-2 bg-black/30 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-siso-red to-siso-orange"
                initial={{ width: "0%" }}
                animate={{ width: `${Math.min(25 * (loadingStep + 1), 100)}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>
          
          <div className="space-y-3">
            {loadingAnimationSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ 
                  opacity: loadingStep >= index ? 1 : 0.4,
                  x: 0
                }}
                transition={{ delay: index * 0.2, duration: 0.4 }}
                className="flex items-center gap-3"
              >
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  loadingStep >= index ? 'bg-siso-orange/20' : 'bg-siso-text/5'
                }`}>
                  {loadingStep > index ? (
                    <CheckCircle className="h-4 w-4 text-siso-orange" />
                  ) : loadingStep === index ? (
                    <Loader2 className="h-4 w-4 text-siso-orange animate-spin" />
                  ) : (
                    <div className="h-4 w-4 rounded-full bg-siso-text/20" />
                  )}
                </div>
                <p className={`text-sm ${
                  loadingStep >= index ? 'text-siso-text' : 'text-siso-text/50'
                }`}>
                  {step}
                </p>
              </motion.div>
            ))}
          </div>
          
          {username === 'decora' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="mt-6 rounded-lg bg-siso-orange/5 border border-siso-orange/20 p-4 text-sm text-siso-text"
            >
              <p className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-siso-orange shrink-0" />
                <span>Your OnlyFans management platform is almost ready. We've added special features just for agencies like yours!</span>
              </p>
            </motion.div>
          )}
        </div>
      </div>
    );
  }
  
  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-siso-bg to-black p-4">
        <div className="text-center max-w-md mx-auto">
          <Card className="bg-black/40 backdrop-blur-md border-siso-text/10 shadow-xl">
            <CardContent className="p-6">
              <h1 className="text-2xl font-bold text-white mb-4">Plan Not Found</h1>
              <p className="text-siso-text mb-6">
                We couldn't find a plan with this username. Please check the URL and try again.
              </p>
              <Button 
                onClick={() => navigate('/')}
                className="bg-gradient-to-r from-siso-red to-siso-orange hover:opacity-90"
              >
                Return Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  const isDecoraPlan = plan.username === 'decora';
  
  const featureCategories: FeatureCategory[] = isDecoraPlan ? [
    {
      name: 'Client Management',
      icon: <Users className="h-5 w-5 text-siso-orange" />,
      description: 'Comprehensive suite of tools for managing OnlyFans creator clients effectively',
      features: [
        'Multi-step onboarding forms with document uploads',
        'Client profiles with performance history',
        'Progress tracking with visual timelines',
        'Activity logging and status tags',
        'Client-specific notes and content preferences'
      ]
    },
    {
      name: 'Content Management',
      icon: <FileText className="h-5 w-5 text-siso-orange" />,
      description: 'Advanced content planning, review, and scheduling tools',
      features: [
        'Drag-and-drop content calendar',
        'Media library with tagging and search',
        'Content approval workflow',
        'Direct posting integration with OnlyFans',
        'Content templates for different niches'
      ]
    },
    {
      name: 'Communication Tools',
      icon: <MessageSquare className="h-5 w-5 text-siso-orange" />,
      description: 'Seamless tools for agency-client and fan interactions',
      features: [
        'In-app messaging with file sharing',
        'Fan interaction management with auto-replies',
        'Notification system for all activities',
        'WhatsApp and Telegram integration',
        'Group chats for team collaboration'
      ]
    },
    {
      name: 'Analytics & Financials',
      icon: <BarChart className="h-5 w-5 text-siso-orange" />,
      description: 'Comprehensive performance tracking and financial management',
      features: [
        'Real-time earnings and subscriber tracking',
        'Custom reports with export options',
        'Invoice generation for agency fees',
        'Payout split calculations',
        'Tax reporting and compliance tools'
      ]
    },
    {
      name: 'Security & Compliance',
      icon: <Shield className="h-5 w-5 text-siso-orange" />,
      description: 'Enterprise-grade security and compliance features',
      features: [
        'End-to-end data encryption',
        'Two-factor authentication',
        'Content compliance checking',
        'Role-based access control',
        'Comprehensive audit trails'
      ]
    },
    {
      name: 'Advanced Features',
      icon: <Settings className="h-5 w-5 text-siso-orange" />,
      description: 'Premium capabilities to maximize agency effectiveness',
      features: [
        'AI-powered content optimization',
        'Subscription tier management',
        'Social media cross-posting',
        'Automated task workflows',
        'White-label branding options'
      ]
    }
  ] : [];

  const painPoints: PainPoint[] = isDecoraPlan ? [
    {
      problem: 'Client Retention Issues',
      statistic: "80% of agencies report the average model lifecycle with an agency is 3-6 months",
      solution: "Increase client retention by 40% with transparent reporting",
      detailedSolution: "OnlyFans agencies often struggle with client churn due to lack of transparency and unclear performance metrics. Our platform solves this by providing real-time dashboards showing creator performance, revenue tracking, and activity metrics that agencies can share with clients. This transparency builds trust and demonstrates the agency's value, keeping creators loyal to your services.",
      benefits: [
        "Build trust through transparent performance reporting",
        "Demonstrate your agency's value with clear metrics",
        "Establish longer-term relationships with creators",
        "Reduce churn and stabilize your revenue"
      ],
      metrics: [
        { label: "Average Retention Increase", value: "40%", icon: <TrendingUp className="h-4 w-4 text-siso-orange" /> },
        { label: "Client Satisfaction Score", value: "92%", icon: <Heart className="h-4 w-4 text-siso-orange" /> },
        { label: "Revenue Growth", value: "35%", icon: <DollarSign className="h-4 w-4 text-siso-orange" /> },
        { label: "Client Lifetime Value", value: "2.4x higher", icon: <Users className="h-4 w-4 text-siso-orange" /> }
      ],
      images: [
        { url: "/lovable-uploads/c7ac43fd-bc3e-478d-8b4f-809beafb6838.png", caption: "Client retention dashboard showing performance metrics" },
        { url: "/lovable-uploads/1f9eba1e-c2af-4ed8-84e7-a375872c9182.png", caption: "Transparent reporting shared with creators" }
      ],
      caseStudyLink: "https://notion.so/case-study/client-retention"
    },
    {
      problem: "Inefficient Onboarding",
      statistic: "Agencies spend an average of 10 hours per new client on manual onboarding tasks",
      solution: "Cut onboarding time by 60% with automated flows",
      detailedSolution: "Traditional onboarding processes for new creators are manual, time-consuming, and often inconsistent. Our platform provides customizable onboarding workflows with automated reminders, document collection, and progress tracking. New creators are guided through each step of the process, ensuring all necessary information and assets are collected without overwhelming them with paperwork all at once.",
      benefits: [
        "Streamline client setup with guided multi-step workflows",
        "Collect all necessary documents and information efficiently",
        "Create a professional first impression for new creators",
        "Free up staff time previously spent on manual onboarding"
      ],
      metrics: [
        { label: "Onboarding Time Reduction", value: "60%", icon: <Clock className="h-4 w-4 text-siso-orange" /> },
        { label: "Information Accuracy", value: "95%", icon: <CheckCircle className="h-4 w-4 text-siso-orange" /> },
        { label: "Document Completion Rate", value: "100%", icon: <FileText className="h-4 w-4 text-siso-orange" /> },
        { label: "Time to First Content", value: "40% faster", icon: <Calendar className="h-4 w-4 text-siso-orange" /> }
      ],
      images: [
        { url: "/lovable-uploads/66b63935-28a0-4212-8e2a-ab375279b188.png", caption: "Multi-step onboarding workflow" }
      ],
      caseStudyLink: "https://notion.so/case-study/onboarding-optimization"
    },
    {
      problem: "Content Disorganization",
      statistic: "60% of agencies miss at least one content deadline per week due to disorganization",
      solution: "Save 15+ hours weekly with centralized content management",
      detailedSolution: "Managing content for multiple creators across different platforms leads to confusion, missed posts, and inefficient workflows. Our centralized content library and scheduling system allows your team to organize assets by creator, content type, and posting date. The visual calendar interface makes it easy to spot gaps in your content schedule and ensure consistent posting for all your clients.",
      benefits: [
        "Keep all content organized in a central, searchable library",
        "Never miss a posting deadline with visual scheduling tools",
        "Maintain consistency across multiple creator accounts",
        "Reduce time spent locating and organizing content"
      ],
      metrics: [
        { label: "Time Saved Weekly", value: "15+ hours", icon: <Clock className="h-4 w-4 text-siso-orange" /> },
        { label: "Posting Consistency", value: "98%", icon: <CheckCircle className="h-4 w-4 text-siso-orange" /> },
        { label: "Content Organization", value: "100%", icon: <Calendar className="h-4 w-4 text-siso-orange" /> },
        { label: "Team Productivity", value: "62% increase", icon: <Users className="h-4 w-4 text-siso-orange" /> }
      ],
      images: [
        { url: "/lovable-uploads/19ca8c73-3736-4506-bfb2-de867b272e12.png", caption: "Content calendar with drag-and-drop functionality" }
      ],
      caseStudyLink: "https://notion.so/case-study/content-management"
    },
    {
      problem: "Communication Breakdowns",
      statistic: "75% of agencies experience miscommunication that leads to client dissatisfaction monthly",
      solution: "Never miss important messages with unified inbox",
      detailedSolution: "Communication scattered across emails, texts, and DMs leads to missed messages and delayed responses. Our unified inbox consolidates all communications in one place, with thread organization by creator and topic. Automated prioritization ensures urgent messages get immediate attention, while notification systems alert team members to new messages in their assigned areas.",
      benefits: [
        "Track all client conversations in one centralized system",
        "Respond faster with prioritized messages and notifications",
        "Maintain clear communication records for accountability",
        "Eliminate crossed wires between team members and clients"
      ],
      metrics: [
        { label: "Response Time", value: "75% faster", icon: <MessageSquare className="h-4 w-4 text-siso-orange" /> },
        { label: "Message Organization", value: "100%", icon: <CheckCircle className="h-4 w-4 text-siso-orange" /> },
        { label: "Client Satisfaction", value: "88%", icon: <Heart className="h-4 w-4 text-siso-orange" /> },
        { label: "Missed Messages", value: "0%", icon: <Users className="h-4 w-4 text-siso-orange" /> }
      ],
      images: [
        { url: "/lovable-uploads/c5921a2f-8856-42f4-bec5-2d08b81c5691.png", caption: "Unified messaging interface with priority sorting" }
      ],
      caseStudyLink: "https://notion.so/case-study/communication"
    },
    {
      problem: "Fan Engagement Challenges",
      statistic: "Agencies see a 20% drop in subscriber retention without consistent engagement strategies",
      solution: "Boost subscriber satisfaction and retention by 25%",
      detailedSolution: "Keeping fans engaged and reducing subscription cancellations is a constant challenge for creators. Our platform includes fan interaction tools that help prioritize high-value subscribers, manage message volume with smart auto-replies, and analyze engagement patterns to identify at-risk subscribers before they cancel. This proactive approach maintains satisfaction and reduces subscription churn.",
      benefits: [
        "Identify and prioritize high-value subscribers",
        "Maintain engagement with automated response systems",
        "Reduce subscription cancellations with proactive retention",
        "Optimize fan interactions for maximum satisfaction"
      ],
      metrics: [
        { label: "Fan Retention Rate", value: "58% higher", icon: <Heart className="h-4 w-4 text-siso-orange" /> },
        { label: "Message Response Rate", value: "100%", icon: <MessageSquare className="h-4 w-4 text-siso-orange" /> },
        { label: "Fan Satisfaction Score", value: "94%", icon: <CheckCircle className="h-4 w-4 text-siso-orange" /> },
        { label: "Resubscription Rate", value: "72% increase", icon: <TrendingUp className="h-4 w-4 text-siso-orange" /> }
      ],
      images: [
        { url: "/lovable-uploads/c7ac43fd-bc3e-478d-8b4f-809beafb6838.png", caption: "Fan engagement dashboard with priority sorting" }
      ],
      caseStudyLink: "https://notion.so/case-study/fan-engagement"
    },
    {
      problem: "Manual Task Overload",
      statistic: "Agency staff spend 15-20 hours weekly on repetitive tasks that could be automated",
      solution: "Reduce manual work by up to 40% with automation",
      detailedSolution: "Agencies waste countless hours on repetitive tasks like scheduling posts, sending reminders, and generating reports. Our platform uses automation and AI to handle these routine activities, allowing your team to focus on strategy and creative work. From auto-scheduling similar content across platforms to generating performance reports with a single click, these time-saving features dramatically increase your team's efficiency.",
      benefits: [
        "Automate repetitive tasks to focus on high-value work",
        "Generate reports and analytics with a single click",
        "Schedule content more efficiently with templates",
        "Scale your agency without proportionally increasing staff"
      ],
      metrics: [
        { label: "Manual Tasks Reduced", value: "40%", icon: <Settings className="h-4 w-4 text-siso-orange" /> },
        { label: "Time Saved Per Creator", value: "5.5 hours weekly", icon: <Clock className="h-4 w-4 text-siso-orange" /> },
        { label: "Team Capacity Increase", value: "45%", icon: <Users className="h-4 w-4 text-siso-orange" /> },
        { label: "Administrative Costs", value: "32% reduction", icon: <DollarSign className="h-4 w-4 text-siso-orange" /> }
      ],
      images: [
        { url: "/lovable-uploads/19ca8c73-3736-4506-bfb2-de867b272e12.png", caption: "Automated workflow configuration interface" }
      ],
      caseStudyLink: "https://notion.so/case-study/automation-efficiency"
    }
  ] : [];

  const handlePainPointClick = (index: number) => {
    if (detailedPainPoints[index]) {
      setSelectedPainPoint(detailedPainPoints[index]);
      setIsPainPointModalOpen(true);
    }
  };

  const renderPainPointsSection = () => {
    if (!isDecoraPlan) return null;
    
    return (
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
          <Shield className="h-5 w-5 mr-2 text-siso-orange" />
          Pain Points Solved
        </h2>
        <div className="bg-black/30 rounded-lg p-5 border border-siso-text/5">
          <p className="text-siso-text mb-4">
            We've identified the key challenges faced by OnlyFans management agencies and designed solutions to address each one. 
            Click on any pain point to see the detailed solution.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {detailedPainPoints.map((point, index) => (
              <motion.div 
                key={index} 
                className="p-4 border border-siso-text/10 rounded-lg bg-black/20 cursor-pointer hover:bg-black/30 hover:border-siso-orange/20 hover:translate-y-[-2px] transition-all duration-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
                onClick={() => handlePainPointClick(index)}
              >
                <h3 className="text-white font-medium mb-2 flex items-center">
                  {index === 0 && <Users className="h-4 w-4 mr-2 text-siso-orange" />}
                  {index === 1 && <Clock className="h-4 w-4 mr-2 text-siso-orange" />}
                  {index === 2 && <Calendar className="h-4 w-4 mr-2 text-siso-orange" />}
                  {index === 3 && <MessageSquare className="h-4 w-4 mr-2 text-siso-orange" />}
                  {index === 4 && <Heart className="h-4 w-4 mr-2 text-siso-orange" />}
                  {index === 5 && <Settings className="h-4 w-4 mr-2 text-siso-orange" />}
                  {point.problem}
                </h3>
                <p className="text-siso-text text-sm mb-3">{point.statistic}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-siso-orange">View solution</span>
                  <ArrowRight className="h-3 w-3 text-siso-orange" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const regularFeatures = !isDecoraPlan
    ? (plan.features || [])
    : [];
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-siso-bg to-black p-4 md:p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto"
      >
        {isDecoraPlan && (
          <WelcomeMessage 
            agencyName="Decora Team" 
            industryType="OnlyFans" 
            scrollToFeatures={scrollToFeatures}
          />
        )}

        <div className="bg-black/40 backdrop-blur-md rounded-lg border border-siso-text/10 shadow-xl overflow-hidden">
          <div className="p-6 md:p-8">
            {/* App plan header */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
              <div>
                <GradientHeading className="text-3xl md:text-4xl mb-2">
                  {plan.company_name}'s App Plan
                </GradientHeading>
                
                <p className="text-siso-text mb-4">
                  We've crafted a custom app solution for your business needs
                </p>
              </div>
              
              {plan.branding?.logo && (
                <div className="mt-4 md:mt-0">
                  <img 
                    src={plan.branding.logo} 
                    alt={`${plan.company_name} logo`} 
                    className="max-h-24 rounded-md object-contain" 
                  />
                </div>
              )}
            </div>
            
            {/* Interactive Callout Boxes for Decora plan */}
            {isDecoraPlan ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
                <InteractiveCallout 
                  title="Agency Niche" 
                  value="OnlyFans Management" 
                  type="niche"
                  description="Our platform is specifically designed for agencies managing OnlyFans creators, with features tailored to the unique needs of content management and creator relationships in this space."
                />
                
                <InteractiveCallout 
                  title="Company Name" 
                  value={plan.company_name || ''} 
                  type="company"
                  description="Your agency dashboard will be fully customized with your branding, workflows, and specific requirements to ensure it perfectly aligns with how Decora operates."
                />
                
                <InteractiveCallout 
                  title="Product" 
                  value="Agency Dashboard" 
                  type="product"
                  description="A comprehensive dashboard that combines client management, content scheduling, communication tools, and analytics in one seamless platform designed specifically for OnlyFans agency operations."
                />
              </div>
            ) : (
              // Standard Plan summary cards for non-Decora plans
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-black/30 rounded-lg p-5 border border-siso-text/5">
                  <div className="flex items-start">
                    <FileText className="h-5 w-5 mr-2 text-siso-orange mt-1" />
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">App Name</h3>
                      <p className="text-siso-orange">{plan.app_name}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-black/30 rounded-lg p-5 border border-siso-text/5">
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 mr-2 text-siso-orange mt-1" />
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">Timeline</h3>
                      <p className="text-siso-orange">{plan.estimated_days} days</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-black/30 rounded-lg p-5 border border-siso-text/5">
                  <div className="flex items-start">
                    <DollarSign className="h-5 w-5 mr-2 text-siso-orange mt-1" />
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">Investment</h3>
                      <p className="text-siso-orange">£{totalCost}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Main content - conditional on plan type */}
            {isDecoraPlan ? (
              <div className="mb-8" ref={featuresRef}>
                {/* Pain points section - replaced with enhanced version */}
                {renderPainPointsSection()}
                
                {/* Target users section */}
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                    <Target className="h-5 w-5 mr-2 text-siso-orange" />
                    Target Users
                  </h2>
                  <div className="bg-black/30 rounded-lg p-5 border border-siso-text/5">
                    <p className="text-siso-text">
                      This app is designed specifically for <span className="text-siso-orange font-semibold">OnlyFans Management Agencies</span> who need to efficiently manage creators, content, and fan interactions. It's perfect for agencies like Decora who are looking to scale operations while maintaining high-quality service.
                    </p>
                  </div>
                </div>
                
                {/* Branding customization section */}
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-white mb-4">Customize Your Branding</h2>
                  <div className="bg-black/30 rounded-lg p-5 border border-siso-text/5">
                    <p className="text-siso-text mb-4">
                      Select the colors that match your brand identity. These colors will be used throughout your app.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <ColorPicker
                          title="Primary Color"
                          colors={brandColorOptions}
                          selectedColor={primaryColor}
                          onChange={setPrimaryColor}
                        />
                      </div>
                      
                      <div>
                        <ColorPicker
                          title="Secondary Color"
                          colors={brandColorOptions}
                          selectedColor={secondaryColor}
                          onChange={setSecondaryColor}
                        />
                      </div>
                    </div>
                    
                    <div className="mt-6 p-4 rounded-lg" style={{ background: `linear-gradient(135deg, ${primaryColor}10, ${secondaryColor}10)` }}>
                      <div className="flex gap-3">
                        <div className="h-12 w-12 rounded-full" style={{ backgroundColor: primaryColor }}></div>
                        <div className="h-12 w-12 rounded-full" style={{ backgroundColor: secondaryColor }}></div>
                      </div>
                      <p className="mt-2 text-sm text-siso-text">Preview of your selected brand colors</p>
                    </div>
                  </div>
                </div>
                
                {/* Feature customization section */}
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-white mb-4">Customize Your Plan</h2>
                  <FeatureSelection 
                    features={selectedFeatures} 
                    onChange={setSelectedFeatures}
                    showPricing={false}
                  />
                </div>
                
                {/* Feature tabs section */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
                  <TabsList className="w-full grid grid-cols-2 mb-6 bg-black/20">
                    <TabsTrigger value="features" className="data-[state=active]:bg-siso-orange/20">
                      Feature Categories
                    </TabsTrigger>
                    <TabsTrigger value="details" className="data-[state=active]:bg-siso-orange/20">
                      Technical Details
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="features" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {featureCategories.map((category, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-black/30 rounded-lg p-5 border border-siso-text/5 flex flex-col h-full"
                        >
                          <div className="flex items-center mb-4">
                            <div className="p-2 rounded-lg bg-siso-orange/10 mr-3">
                              {category.icon}
                            </div>
                            <h3 className="text-lg font-semibold text-white">{category.name}</h3>
                          </div>
                          
                          <p className="text-siso-text/80 text-sm mb-4">{category.description}</p>
                          
                          <ul className="space-y-2 mt-auto">
                            {category.features.map((feature, featureIndex) => (
                              <li key={featureIndex} className="flex items-start">
                                <CheckCircle className="h-4 w-4 mr-2 text-siso-orange shrink-0 mt-0.5" />
                                <span className="text-siso-text text-sm">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="details">
                    <div className="bg-black/30 rounded-lg p-5 border border-siso-text/5 mb-6">
                      <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                        <Smartphone className="h-5 w-5 mr-2 text-siso-orange" />
                        Technical Implementation
                      </h3>
                      
                      <Table>
                        <TableHeader>
                          <TableRow className="border-siso-text/10">
                            <TableHead className="text-siso-text">Component</TableHead>
                            <TableHead className="text-siso-text">Details</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow className="border-siso-text/10">
                            <TableCell className="font-medium text-white">Platform</TableCell>
                            <TableCell className="text-siso-text">Web-based application accessible on all devices with responsive design</TableCell>
                          </TableRow>
                          <TableRow className="border-siso-text/10">
                            <TableCell className="font-medium text-white">Frontend</TableCell>
                            <TableCell className="text-siso-text">React.js with Tailwind CSS for responsive design and smooth animations</TableCell>
                          </TableRow>
                          <TableRow className="border-siso-text/10">
                            <TableCell className="font-medium text-white">Backend</TableCell>
                            <TableCell className="text-siso-text">Node.js with Supabase for database, authentication, and real-time updates</TableCell>
                          </TableRow>
                          <TableRow className="border-siso-text/10">
                            <TableCell className="font-medium text-white">Integrations</TableCell>
                            <TableCell className="text-siso-text">Only Fans API, WhatsApp Business API, payment processing, messaging services</TableCell>
                          </TableRow>
                          <TableRow className="border-siso-text/10">
                            <TableCell className="font-medium text-white">Security</TableCell>
                            <TableCell className="text-siso-text">End-to-end encryption, 2FA, role-based access control, regular security audits</TableCell>
                          </TableRow>
                          <TableRow className="border-siso-text/10">
                            <TableCell className="font-medium text-white">Deployment</TableCell>
                            <TableCell className="text-siso-text">Cloud-based with automated scaling, daily backups, and 99.9% uptime guarantee</TableCell>
                          </TableRow>
                          <TableRow className="border-siso-text/10">
                            <TableCell className="font-medium text-white">Mobile Access</TableCell>
                            <TableCell className="text-siso-text">Fully responsive web app with optional native app wrapper for iOS and Android</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                    
                    <div className="bg-black/30 rounded-lg p-5 border border-siso-text/5">
                      <h3 className="text-xl font-semibold text-white mb-4">Additional Details</h3>
                      <div className="prose prose-invert prose-sm max-w-none">
                        <p>The OnlyFans Management Suite for Decora includes a complete ecosystem for managing creators, content, and fan interactions. The platform provides tools for efficient onboarding, content scheduling, analytics tracking, and secure payment processing.</p>
                        <p>Our comprehensive solution helps agencies like yours streamline operations, improve client retention, and maximize revenue potential through advanced analytics and automation. The application is built with scalability in mind, allowing it to grow alongside your agency from 10 to 100+ creators.</p>
                        <p>All system components adhere to industry best practices for security and performance, ensuring a reliable platform for your business operations.</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              // Regular features display for non-Decora plans
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-white mb-4">Selected Features</h2>
                <div className="bg-black/30 rounded-lg p-5 border border-siso-text/5">
                  <ul className="space-y-2">
                    {regularFeatures.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-4 w-4 mr-2 text-siso-orange shrink-0 mt-0.5" />
                        <span className="text-siso-text">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            
            {/* Submit button */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <Button
                onClick={handleSubmitPlan}
                disabled={submitting}
                className="w-full sm:w-auto bg-gradient-to-r from-siso-red to-siso-orange hover:opacity-90 text-white"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Approve Plan & Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
              
              <p className="text-siso-text text-sm">
                By approving this plan, you're confirming you'd like to proceed with the app development.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
      
      {isDecoraPlan && (
        <PainPointsModal
          painPoint={selectedPainPoint}
          open={isPainPointModalOpen}
          onOpenChange={setIsPainPointModalOpen}
        />
      )}
    </div>
  );
};

export default Plan;
