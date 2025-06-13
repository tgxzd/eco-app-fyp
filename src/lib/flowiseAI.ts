interface FlowiseRequest {
    question: string;
    [key: string]: unknown; // Allow for additional properties
  }
  
  interface Message {
    [key: string]: unknown;
  }
  
  interface Tool {
    [key: string]: unknown;
  }
  
  interface SourceDocument {
    [key: string]: unknown;
  }
  
  interface Artifact {
    [key: string]: unknown;
  }
  
  interface AgentState {
    [key: string]: unknown;
  }
  
  interface AgentReasoning {
    agentName: string;
    messages: Message[];
    nodeName: string;
    nodeId: string;
    usedTools?: Tool[];
    sourceDocuments?: SourceDocument[];
    artifacts?: Artifact[];
    state?: AgentState;
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
  
 