import { NextRequest } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { message, mode } = await req.json();
    if (!message || typeof message !== 'string') {
      return new Response(JSON.stringify({ success: false, error: 'No message provided' }), { status: 400 });
    }

    if (mode === 'extract-location') {
      // Use OpenAI to extract the main travel destination
      const aiRes = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'Extract the main travel destination (city, country, or region) from the user message. Only return the location name, nothing else.' },
          { role: 'user', content: message },
        ],
        max_tokens: 20,
      });
      const location = aiRes.choices?.[0]?.message?.content?.trim() || '';
      console.log('Extracted location (server):', location);
      return new Response(JSON.stringify({ success: true, location }), { status: 200 });
    }

    // Default: normal chat
    const aiRes = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are Wanderly, an expert, friendly travel planning assistant.' },
        { role: 'user', content: message },
      ],
      max_tokens: 500,
    });

    const aiMessage = aiRes.choices?.[0]?.message?.content?.trim() || '';
    return new Response(JSON.stringify({ success: true, reply: aiMessage }), { status: 200 });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(JSON.stringify({ success: false, error: 'Internal server error' }), { status: 500 });
  }
} 