import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const ALLOWED_ORIGINS = [
  "https://hdastudio.com",
  "https://www.hdastudio.com",
  "https://hda-studio.com",
  "https://www.hda-studio.com",
  "http://localhost:5173",
  "http://localhost:3000",
];

const getCorsHeaders = (origin: string | null) => {
  const allowedOrigin = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };
};

interface AITaggingRequest {
  imageId: string;
  storagePath: string;
}

interface AITaggingResponse {
  success: boolean;
  tags?: string[];
  description?: string;
  confidence?: number;
  error?: string;
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req.headers.get("origin"));

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Verify authorization
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify user is admin
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    // Check if user has admin role
    const { data: roleData, error: roleError } = await supabase
      .rpc('has_role', { user_id: user.id, role_name: 'admin' });

    if (roleError || !roleData) {
      throw new Error('Unauthorized: Admin access required');
    }

    // Parse request body
    const body: AITaggingRequest = await req.json();
    const { imageId, storagePath } = body;

    if (!imageId || !storagePath) {
      throw new Error('Missing required fields: imageId and storagePath');
    }

    // Get OpenAI API key
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Get public image URL
    const imageUrl = `${supabaseUrl}/storage/v1/object/public/gallery-images/${storagePath}`;

    // Call OpenAI Vision API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are an expert makeup and beauty photography analyst. Analyze images and provide:
1. Relevant tags (makeup style, techniques, products, colors, occasion)
2. A concise professional description
3. A confidence score (0-1) for your analysis

Respond ONLY with valid JSON in this exact format:
{
  "tags": ["tag1", "tag2", "tag3"],
  "description": "Professional description here",
  "confidence": 0.95
}`,
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyze this makeup/beauty image and provide tags, description, and confidence score.',
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl,
                  detail: 'high',
                },
              },
            ],
          },
        ],
        max_tokens: 500,
        temperature: 0.3,
      }),
    });

    if (!openaiResponse.ok) {
      const error = await openaiResponse.text();
      throw new Error(`OpenAI API error: ${error}`);
    }

    const openaiData = await openaiResponse.json();
    const content = openaiData.choices[0].message.content;

    // Parse AI response
    let aiResult;
    try {
      aiResult = JSON.parse(content);
    } catch (e) {
      throw new Error(`Failed to parse AI response: ${content}`);
    }

    const { tags, description, confidence } = aiResult;

    // Validate response structure
    if (!Array.isArray(tags) || typeof description !== 'string' || typeof confidence !== 'number') {
      throw new Error('Invalid AI response structure');
    }

    // Update gallery image with AI tags
    const { error: updateError } = await supabase
      .from('gallery_images')
      .update({
        ai_tags: tags,
        ai_description: description,
        ai_confidence: confidence,
        ai_processed_at: new Date().toISOString(),
      })
      .eq('id', imageId);

    if (updateError) {
      throw new Error(`Failed to update image: ${updateError.message}`);
    }

    // Return success response
    const response: AITaggingResponse = {
      success: true,
      tags,
      description,
      confidence,
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error: unknown) {
    console.error('Error processing image:', error);

    const response: AITaggingResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
