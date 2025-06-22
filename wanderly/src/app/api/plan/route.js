// src/app/api/plan/route.js

import dbConnect from '../../../lib/mongodb';
import TripPlan from '../../../models/TripPlan';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req) {
  // 1. Connect to Mongo
  await dbConnect();

  // 2. Read user data from request
  const data = await req.json();
  const {
    destination, 
    dates, 
    people, 
    budget, 
    preferences = [], 
    visaStatus = '', 
    specialRequests = ''
  } = data;

  // 3. Build the AI prompt
  const prompt = `
You are Wanderly, an expert AI travel planner.
Create a picture-perfect, minute-by-minute, day-by-day itinerary, covering every single detail.

Trip Details:
- Destination: ${destination}
- Dates: ${dates.join(' to ')}
- Travelers: ${people}
- Total budget: $${budget}
- Interests: ${preferences.join(', ')}
${visaStatus ? `- Visa status: ${visaStatus}` : ''}
${specialRequests ? `- Special requests: ${specialRequests}` : ''}

Requirements:
1. Plan each full day—don’t skip any.  
2. Break each day into Morning, Afternoon, Evening blocks.  
3. Suggest top attractions **and** hidden gems.  
4. Include dining recommendations (local favorites), with estimated costs.  
5. Provide transport guidance (how to get between spots).  
6. Note any booking/reservation tips and timing (e.g., “book 2 days in advance”).  
7. Optimize for budget and pace—realistic travel times.  
8. Add local tips (customs, best photo spots, safety advice).  

Return the itinerary in clear Markdown format, with headings for each day and bullet lists for each time block.
`;

  // 4. Call OpenAI
  const aiRes = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: 'You are an expert, friendly travel planning assistant.' },
      { role: 'user', content: prompt }
    ],
    max_tokens: 2000
  });

  const itineraryText = aiRes.choices?.[0]?.message?.content?.trim() || '';

  // 5. Save trip + AI result to MongoDB
  const trip = await TripPlan.create({
    ...data,
    itinerary: itineraryText
  });

  // 6. Return full trip object
  return Response.json({ success: true, trip });
}

export async function GET(req) {
  await dbConnect();
  const trips = await TripPlan.find({});
  return Response.json({ success: true, trips });
}
