
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface TextOverlay {
  title: string;
  subtitle: string;
}

interface BannerTemplate {
  id: string;
  name: string;
  description: string;
  image_url: string;
  is_default: boolean;
  template_type: string;
  text_overlay: TextOverlay;
  created_at?: string;
  updated_at?: string;
  metadata?: unknown;
}

interface BannerTemplateResponse {
  id: string;
  name: string;
  description: string;
  image_url: string;
  is_default: boolean;
  template_type: string;
  text_overlay: unknown;
  created_at: string;
  updated_at: string;
  metadata: unknown;
}

export function BannerTemplatesDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [templates, setTemplates] = useState<BannerTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [newTemplate, setNewTemplate] = useState<Omit<BannerTemplate, 'id'>>({
    name: '',
    description: '',
    image_url: '',
    is_default: false,
    template_type: 'daily_brief',
    text_overlay: {
      title: '',
      subtitle: ''
    }
  });
  const { toast } = useToast();

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('banner_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform the response data to match our BannerTemplate interface
      const transformedTemplates: BannerTemplate[] = (data as BannerTemplateResponse[]).map(template => ({
        ...template,
        text_overlay: typeof template.text_overlay === 'string' 
          ? JSON.parse(template.text_overlay)
          : template.text_overlay as TextOverlay
      }));

      setTemplates(transformedTemplates);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast({
        title: "Error",
        description: "Failed to load banner templates",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTemplate = async () => {
    if (!newTemplate.name) {
      toast({
        title: "Error",
        description: "Template name is required",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('banner_templates')
        .insert({
          name: newTemplate.name,
          description: newTemplate.description,
          template_type: newTemplate.template_type,
          text_overlay: newTemplate.text_overlay,
          is_default: false
        })
        .select()
        .single();

      if (error) throw error;

      const transformedTemplate: BannerTemplate = {
        ...data,
        text_overlay: typeof data.text_overlay === 'string'
          ? JSON.parse(data.text_overlay)
          : data.text_overlay as TextOverlay
      };

      toast({
        title: "Success",
        description: "Banner template created successfully",
      });

      setTemplates([transformedTemplate, ...templates]);
      setNewTemplate({
        name: '',
        description: '',
        image_url: '',
        is_default: false,
        template_type: 'daily_brief',
        text_overlay: {
          title: '',
          subtitle: ''
        }
      });
    } catch (error) {
      console.error('Error creating template:', error);
      toast({
        title: "Error",
        description: "Failed to create banner template",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          onClick={() => {
            setIsOpen(true);
            fetchTemplates();
          }}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Manage Banner Templates
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Banner Templates</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Create New Template Form */}
          <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="font-semibold">Create New Template</h3>
            <div className="space-y-2">
              <Label htmlFor="name">Template Name</Label>
              <Input
                id="name"
                value={newTemplate.name}
                onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                placeholder="Daily Brief Template"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newTemplate.description}
                onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                placeholder="Template description..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Banner Title</Label>
              <Input
                id="title"
                value={newTemplate.text_overlay.title}
                onChange={(e) => setNewTemplate({
                  ...newTemplate,
                  text_overlay: { ...newTemplate.text_overlay, title: e.target.value }
                })}
                placeholder="SisoAI Daily Brief"
              />
            </div>
            <Button
              onClick={handleCreateTemplate}
              disabled={loading || !newTemplate.name}
              className="w-full"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Template"}
            </Button>
          </div>

          {/* Existing Templates List */}
          <div className="space-y-4">
            <h3 className="font-semibold">Existing Templates</h3>
            {loading ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <div className="space-y-4">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className="flex items-start justify-between p-4 border rounded-lg"
                  >
                    <div className="space-y-1">
                      <p className="font-medium">{template.name}</p>
                      <p className="text-sm text-gray-500">{template.description}</p>
                      <p className="text-sm text-gray-500">Title: {template.text_overlay.title}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {template.image_url ? (
                        <img
                          src={template.image_url}
                          alt={template.name}
                          className="w-16 h-16 rounded object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded bg-gray-100 flex items-center justify-center">
                          <ImageIcon className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
