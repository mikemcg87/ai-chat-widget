import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const { messages } = await request.json();
    
    // Create a thread
    const thread = await openai.beta.threads.create();
    
    // Add the latest message to the thread
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: messages[messages.length - 1].content
    });
    
    // Run the assistant
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: process.env.OPENAI_ASSISTANT_ID
    });
    
    // Wait for completion
    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    while (runStatus.status !== 'completed') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    }
    
    // Get the assistant's response
    const messages_response = await openai.beta.threads.messages.list(thread.id);
    const assistantMessage = messages_response.data[0].content[0].text.value;
    
    return NextResponse.json({ message: assistantMessage });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to get response' }, { status: 500 });
  }
}