
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, MessageSquare } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';

const AIAgentTest = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [model, setModel] = useState<string>('mistral-small-latest');

  const testAgent = async () => {
    if (!prompt.trim()) {
      toast.warning('Please enter a prompt');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('mistral-ai', {
        body: {
          prompt,
          model
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      setResponse(data.response);
      toast.success('Agent response received');
    } catch (error) {
      console.error('Error testing agent:', error);
      toast.error('Failed to test agent', {
        description: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border border-sidebar-border">
      <CardHeader>
        <CardTitle>Test AI Agent</CardTitle>
        <CardDescription>
          Test Mistral AI agent responses with sample proposal text
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="model-select" className="text-sm font-medium">
              Select Model
            </label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger id="model-select" className="w-[220px]">
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mistral-small-latest">Mistral Small (Fastest)</SelectItem>
                <SelectItem value="mistral-medium-latest">Mistral Medium (Balanced)</SelectItem>
                <SelectItem value="mistral-large-latest">Mistral Large (Most Capable)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Textarea
            placeholder="Enter a proposal or question for the AI agent to analyze..."
            className="min-h-[120px]"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          
          <Button 
            onClick={testAgent} 
            disabled={loading || !prompt.trim()}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <MessageSquare className="mr-2 h-4 w-4" />
                Test Agent Response
              </>
            )}
          </Button>
        </div>
        
        {response && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Agent Response:</label>
            <div className="rounded-md border border-sidebar-border bg-muted p-4 text-sm">
              <div className="whitespace-pre-wrap">{response}</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIAgentTest;
