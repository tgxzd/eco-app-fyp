interface FlowiseRequest {
    question: string;
    [key: string]: any; // Allow for additional properties
  }
  
  interface AgentReasoning {
    agentName: string;
    messages: any[];
    nodeName: string;
    nodeId: string;
    usedTools?: any[];
    sourceDocuments?: any[];
    artifacts?: any[];
    state?: any;
  }
  
  interface FlowiseResponse {
    route: string;
    message: string;
    error?: string;
    details?: string;
    rawResponse?: {
      text: string;
      question: string;
      chatId: string;
      chatMessageId: string;
      sessionId: string;
      memoryType: string;
      agentReasoning: AgentReasoning[];
    };
  }
  
  export async function queryFlowiseAI(data: FlowiseRequest): Promise<FlowiseResponse> {
    try {
      console.log('Sending request to API:', data);
      
      const response = await fetch('/api/chat', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      const result = await response.json();
      console.log('API response:', result);
  
      if (!response.ok) {
        throw new Error(result.error || `HTTP error! status: ${response.status}`);
      }
  
      if (result.error) {
        throw new Error(result.error);
      }
  
      return result;
    } catch (error) {
      console.error("Error querying Flowise AI:", error);
      return {
        route: 'REASK',
        message: "Sorry, I encountered an error. Please try again.",
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      };
    }
  }
  
 