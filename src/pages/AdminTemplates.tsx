
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/assistants/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { BulkPlanCreation } from '@/components/admin/BulkPlanCreation';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { Loader2 } from 'lucide-react';

export default function AdminTemplates() {
  const { isAdmin, isLoading } = useAdminCheck();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-siso-orange" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-6">Plan Templates</h1>
        <div className="space-y-6">
          <BulkPlanCreation />
        </div>
      </div>
    </MainLayout>
  );
}
