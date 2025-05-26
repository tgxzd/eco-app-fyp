import { NextResponse } from 'next/server';

const FLOWISE_API_URL = "http://159.65.4.16:3000/api/v1/prediction/06b41f37-cc33-4558-9b91-b0631f48bfbc";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Request body:', body);
    
    const response = await fetch(FLOWISE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        question: body.question,
        overrideConfig: {
          returnSourceDocuments: false
        }
      }),
    });

    if (!response.ok) {
      console.error('Flowise API error:', {
        status: response.status,
        statusText: response.statusText
      });
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Flowise API response:', data);
    
    // Extract the agent type from agentReasoning
    let agentType = 'REASK';
    if (data.agentReasoning && Array.isArray(data.agentReasoning)) {
      // Find the first non-RouterAgent agent
      const agentInfo = data.agentReasoning.find(
        (agent: any) => agent.agentName && agent.agentName !== 'RouterAgent'
      );
      if (agentInfo) {
        agentType = agentInfo.agentName.toUpperCase();
      }
    }
    
    // Return both the agent type and the actual response
    return NextResponse.json({ 
      route: agentType,
      message: data.text || data.message || data.content || 'No response',
      rawResponse: data
    });
  } catch (error) {
    console.error('Error in chat API route:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to process request',
        route: 'REASK',
        message: "Sorry, I encountered an error. Please try again.",
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 