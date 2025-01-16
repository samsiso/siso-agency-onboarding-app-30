import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import OpenAI from "https://esm.sh/openai@4.20.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, {
      headers: corsHeaders
    });
  }

  try {
    console.log('Received request');
    const { message, threadId } = await req.json();
    console.log('Request payload:', { message, threadId });

    const apiKey = Deno.env.get('OPENAI_API_KEY');
    if (!apiKey) {
      console.error('OpenAI API key is missing');
      return new Response(
        JSON.stringify({ error: 'OpenAI API key is missing' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Initialize OpenAI client with v2 header
    const openai = new OpenAI({
      apiKey,
      defaultHeaders: {
        'OpenAI-Beta': 'assistants=v2'
      }
    });

    try {
      // Create or retrieve thread
      let thread;
      if (!threadId) {
        console.log('Creating new thread');
        thread = await openai.beta.threads.create();
        console.log('Created new thread:', thread.id);
      } else {
        console.log('Using existing thread:', threadId);
        thread = { id: threadId };
      }

      // Add message to thread
      console.log('Adding message to thread');
      await openai.beta.threads.messages.create(thread.id, {
        role: "user",
        content: message,
      });

      // Run the assistant
      console.log('Starting assistant run');
      const run = await openai.beta.threads.runs.create(thread.id, {
        assistant_id: "asst_7f4aHDtKZtJAo1cFtptII7ed",
        model: "gpt-4-mini",
      });

      // Poll for completion
      let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      console.log('Initial run status:', runStatus.status);
      
      while (runStatus.status !== "completed") {
        if (runStatus.status === "failed") {
          console.error('Run failed:', runStatus);
          throw new Error(`Assistant run failed: ${JSON.stringify(runStatus.last_error)}`);
        }
        if (runStatus.status === "expired") {
          console.error('Run expired:', runStatus);
          throw new Error("Assistant run expired");
        }
        
        // Wait before checking status again
        await new Promise(resolve => setTimeout(resolve, 1000));
        runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
        console.log('Updated run status:', runStatus.status);
      }

      // Get messages after completion
      console.log('Retrieving messages');
      const messages = await openai.beta.threads.messages.list(thread.id);
      const lastMessage = messages.data[0];
      console.log('Retrieved message:', lastMessage.content[0].text.value);

      return new Response(
        JSON.stringify({
          response: lastMessage.content[0].text.value,
          threadId: thread.id,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );

    } catch (openaiError) {
      console.error('OpenAI API Error:', openaiError);
      return new Response(
        JSON.stringify({ 
          error: `OpenAI API Error: ${openaiError.message}`,
          details: openaiError.stack
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
  } catch (error) {
    console.error('Error in chat-with-assistant:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});