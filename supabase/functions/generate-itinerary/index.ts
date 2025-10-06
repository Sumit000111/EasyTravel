import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { destination, days, budget } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Generating itinerary for:', { destination, days, budget });

    const prompt = `Create a detailed ${days}-day travel itinerary for ${destination}, India with a budget of ₹${budget}. 

Include:
- Day-wise breakdown with morning, afternoon, and evening activities
- Top attractions and their estimated costs
- Local food recommendations
- Transportation tips
- Budget allocation (40% transport, 35% stay, 15% food, 10% activities)
- Best times to visit each place
- Cultural tips and important information

Format the response as a structured JSON with the following schema:
{
  "days": [
    {
      "day": 1,
      "title": "Day title",
      "morning": "Activity description",
      "afternoon": "Activity description", 
      "evening": "Activity description",
      "estimated_cost": 5000
    }
  ],
  "budget_breakdown": {
    "transport": 40000,
    "stay": 35000,
    "food": 15000,
    "activities": 10000
  },
  "tips": ["Tip 1", "Tip 2"],
  "best_attractions": ["Attraction 1", "Attraction 2"]
}`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are an expert Indian travel planner. Always respond with valid JSON only, no markdown or extra text.' },
          { role: 'user', content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const itineraryText = data.choices[0].message.content;
    
    // Parse the JSON response
    let itinerary;
    try {
      // Remove markdown code blocks if present
      const cleanText = itineraryText.replace(/```json\n?|\n?```/g, '').trim();
      itinerary = JSON.parse(cleanText);
    } catch (e) {
      console.error('Failed to parse AI response:', itineraryText);
      throw new Error('Failed to parse itinerary');
    }

    return new Response(JSON.stringify({ itinerary }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-itinerary function:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
