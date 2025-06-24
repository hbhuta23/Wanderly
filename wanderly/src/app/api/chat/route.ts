import { NextRequest } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    if (!message || typeof message !== 'string') {
      return new Response(JSON.stringify({ success: false, error: 'No message provided' }), { status: 400 });
    }

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
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: 'AI error' }), { status: 500 });
  }
} 