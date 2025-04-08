
import { Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import OnboardingSocial from './pages/onboarding/social';
import { Toaster } from '@/components/ui/toaster';
import OnboardingChat from '@/pages/OnboardingChat';
import ThankYou from '@/pages/ThankYou';
import Plan from './pages/Plan';
import DecoraPlan from './pages/DecoraPlan';
import Congratulations from './pages/onboarding/congratulations';

function App() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/onboarding-chat" element={<OnboardingChat />} />
        <Route path="/thankyou" element={<ThankYou />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/onboarding/social" element={<OnboardingSocial />} />
        <Route path="/onboarding/congratulations" element={<Congratulations />} />
        <Route path="/plan/:username" element={<Plan />} />
        <Route path="/decora-plan" element={<DecoraPlan />} />
      </Routes>
    </>
  );
}

export default App;
